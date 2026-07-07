import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.resolve(__dirname, "../../credentials/firebase-admin.json");

const serviceAccountEnv = process.env.FIREBASE_ADMIN_CREDENTIALS;

let credential;

if (serviceAccountEnv) {
  credential = cert(JSON.parse(serviceAccountEnv));
} else {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
  credential = cert(serviceAccount);
}

initializeApp({
  credential,
});

const auth = getAuth();
const db = getFirestore();

export { auth, db };