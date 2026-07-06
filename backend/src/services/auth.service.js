import { auth, db } from "../config/firebase.js";

export const registerUser = async (userData) => {
  const { firstName, lastName, email, password } = userData;

  const userRecord = await auth.createUser({
    email,
    password,
  });

  await db.collection("users").doc(userRecord.uid).set({
    uid: userRecord.uid,
    firstName,
    lastName,
    email,
    role: "employee",
    createdAt: new Date(),
  });

  return {
    uid: userRecord.uid,
    email: userRecord.email,
  };
};