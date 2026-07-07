import { db } from "../config/firebase.js";
import { calculateAttendance } from "../utils/timeCalculator.js";

export const punchInService = async (userId) => {
  const today = new Date().toISOString().split("T")[0];
  const attendanceRef = db
    .collection("attendance")
    .doc(`${userId}_${today}`);


  const attendanceDoc = await attendanceRef.get();
  if (attendanceDoc.exists) {
    throw new Error("You have already punched in today.");
  }
  await attendanceRef.set({
    userId,
    date: today,
    timeIn: new Date(),
    timeOut: null,
  });
};

export const punchOutService = async (userId) => {
  const today = new Date().toISOString().split("T")[0];

  const attendanceRef = db.collection("attendance").doc(`${userId}_${today}`);

  const attendanceDoc = await attendanceRef.get();

  if (!attendanceDoc.exists) {
    throw new Error("No punch in found.");
  }

  const attendance = attendanceDoc.data();
  if (attendance.timeOut) {
    throw new Error("You have already punched out today.");
  }
  const timeOut = new Date();

  await attendanceRef.update({
    timeOut,
  });

  const userDoc = await db.collection("users").doc(userId).get();

  if (!userDoc.exists) {
    throw new Error("User not found.");
  }

  const user = userDoc.data();

  const summary = calculateAttendance(
    attendance.timeIn.toDate(),
    timeOut,
    user.schedule
  );

  await attendanceRef.update(summary);

  return summary;
};

export const getTodayAttendanceService = async (userId) => {
  const today = new Date().toISOString().split("T")[0];

  const doc = await db
    .collection("attendance")
    .doc(`${userId}_${today}`)
    .get();

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
    history.push(doc.data());
  });

  return history;
};