import { db } from "../config/firebase.js";
import { calculateAttendance } from "../utils/timeCalculator.js";

const buildAttendanceDocId = (userId, date) => `${userId}_${date}`;

const toDateValue = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  return new Date(value);
};

const getUserProfile = async (userId) => {
  const userDoc = await db.collection("users").doc(userId).get();

  if (!userDoc.exists) {
    throw new Error("User not found.");
  }

  return userDoc.data();
};

const ensureAdmin = async (userId) => {
  const user = await getUserProfile(userId);
  if (user.role !== "admin") {
    throw new Error("Only admins can access this resource.");
  }
};

const formatUserLabel = (profile, fallbackId) => {
  if (!profile) return fallbackId;

  if (profile.name) return profile.name;
  if (profile.firstName || profile.lastName) {
    return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  }
  if (profile.email) return profile.email;

  return fallbackId;
};

const enrichAttendanceRecords = async (records) => {
  const uniqueUserIds = [...new Set(records.map((record) => record.userId))];
  const profiles = await Promise.all(
    uniqueUserIds.map(async (userId) => {
      try {
        const profile = await getUserProfile(userId);
        return [userId, profile];
      } catch (error) {
        return [userId, null];
      }
    })
  );

  const profileMap = new Map(profiles);

  return records.map((record) => ({
    ...record,
    userName: formatUserLabel(profileMap.get(record.userId), record.userId),
  }));
};

export const punchInService = async (userId) => {
  const today = new Date().toISOString().split("T")[0];
  const attendanceRef = db.collection("attendance").doc(buildAttendanceDocId(userId, today));

  const attendanceDoc = await attendanceRef.get();
  if (attendanceDoc.exists) {
    throw new Error("You have already punched in today.");
  }

  await attendanceRef.set({
    userId,
    date: today,
    timeIn: new Date(),
    timeOut: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    regularHours: 0,
    overtimeHours: 0,
    nightDifferentialHours: 0,
    lateMinutes: 0,
    undertimeMinutes: 0,
  });
};

export const punchOutService = async (userId) => {
  const today = new Date().toISOString().split("T")[0];
  const attendanceRef = db.collection("attendance").doc(buildAttendanceDocId(userId, today));
  const attendanceDoc = await attendanceRef.get();

  if (!attendanceDoc.exists) {
    throw new Error("No punch in found.");
  }

  const attendance = attendanceDoc.data();
  if (attendance.timeOut) {
    throw new Error("You have already punched out today.");
  }

  const timeOut = new Date();
  const user = await getUserProfile(userId);
  const summary = calculateAttendance(
    toDateValue(attendance.timeIn),
    timeOut,
    user.schedule
  );

  await attendanceRef.update({
    ...summary,
    timeOut,
    updatedAt: new Date(),
  });

  await db.collection("dailySummary").doc(buildAttendanceDocId(userId, today)).set({
    userId,
    date: today,
    ...summary,
    timeIn: attendance.timeIn,
    timeOut,
    createdAt: new Date(),
  });

  return summary;
};

export const getTodayAttendanceService = async (userId) => {
  const today = new Date().toISOString().split("T")[0];
  const doc = await db.collection("attendance").doc(buildAttendanceDocId(userId, today)).get();

  if (!doc.exists) {
    throw new Error("No attendance found for today.");
  }

  return doc.data();
};

export const getAttendanceHistoryService = async (userId) => {
  const snapshot = await db
    .collection("attendance")
    .where("userId", "==", userId)
    .orderBy("date", "desc")
    .get();

  const history = [];

  snapshot.forEach((doc) => {
    history.push({ id: doc.id, ...doc.data() });
  });

  return history;
};

export const getAdminAttendanceService = async (requesterId) => {
  await ensureAdmin(requesterId);

  const snapshot = await db.collection("attendance").orderBy("date", "desc").get();
  const records = [];

  snapshot.forEach((doc) => {
    records.push({ id: doc.id, ...doc.data() });
  });

  return enrichAttendanceRecords(records);
};

export const updateAttendanceService = async (attendanceId, updates, requesterId) => {
  await ensureAdmin(requesterId);

  const attendanceRef = db.collection("attendance").doc(attendanceId);
  const attendanceDoc = await attendanceRef.get();

  if (!attendanceDoc.exists) {
    throw new Error("Attendance record not found.");
  }

  const current = attendanceDoc.data();
  const nextTimeIn = updates.timeIn ? new Date(updates.timeIn) : current.timeIn?.toDate ? current.timeIn.toDate() : current.timeIn;
  const nextTimeOut = updates.timeOut ? new Date(updates.timeOut) : current.timeOut?.toDate ? current.timeOut.toDate() : current.timeOut;
  const userDoc = await db.collection("users").doc(current.userId).get();

  if (!userDoc.exists) {
    throw new Error("User profile not found.");
  }

  const summary = calculateAttendance(nextTimeIn, nextTimeOut, userDoc.data().schedule);
  const nextUpdates = {
    ...updates,
    ...summary,
    updatedAt: new Date(),
  };

  await attendanceRef.update(nextUpdates);

  return { success: true };
};

export const getAdminReportsService = async (requesterId, range = "daily", date = new Date().toISOString().split("T")[0]) => {
  await ensureAdmin(requesterId);

  if (range === "weekly") {
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const snapshot = await db
      .collection("attendance")
      .where("date", ">=", date)
      .where("date", "<", end.toISOString().split("T")[0])
      .get();

    const items = [];
    snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
    return enrichAttendanceRecords(items);
  }

  const snapshot = await db.collection("attendance").where("date", "==", date).get();
  const items = [];
  snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
  return enrichAttendanceRecords(items);
};