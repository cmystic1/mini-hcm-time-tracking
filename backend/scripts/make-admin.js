import { auth, db } from "../src/config/firebase.js";

const email = process.argv[2];

if (!email) {
  console.error("Usage: npm run make-admin -- <email>");
  process.exit(1);
}

const userRecord = await auth.getUserByEmail(email);
await db.collection("users").doc(userRecord.uid).set(
  {
    uid: userRecord.uid,
    email: userRecord.email,
    firstName: userRecord.displayName?.split(" ")[0] || "Admin",
    lastName: userRecord.displayName?.split(" ").slice(1).join(" ") || "User",
    name: userRecord.displayName || email,
    role: "admin",
    timezone: "Asia/Manila",
    timeZone: "Asia/Manila",
    schedule: {
      startTime: "09:00",
      endTime: "18:00",
      start: "09:00",
      end: "18:00",
    },
    updatedAt: new Date(),
  },
  { merge: true }
);

console.log(`Made ${email} an admin.`);
