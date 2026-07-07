import { auth, db } from "../config/firebase.js";

export const getUserProfileService = async (userId) => {
  const userDoc = await db.collection("users").doc(userId).get();

  if (!userDoc.exists) {
    throw new Error("User profile not found.");
  }

  return userDoc.data();
};

export const registerUser = async (userData) => {
  const { firstName, lastName, email, password, timezone = "Asia/Manila", role = "employee" } = userData;
  const name = `${firstName} ${lastName}`.trim();

  const userRecord = await auth.createUser({
    email,
    password,
    displayName: name,
  });

  await db.collection("users").doc(userRecord.uid).set({
    uid: userRecord.uid,
    firstName,
    lastName,
    name,
    email,
    role,
    timezone,
    timeZone: timezone,
    schedule: {
      startTime: "09:00",
      endTime: "18:00",
      start: "09:00",
      end: "18:00",
    },
    createdAt: new Date(),
  });

  return {
    uid: userRecord.uid,
    email: userRecord.email,
  };
};