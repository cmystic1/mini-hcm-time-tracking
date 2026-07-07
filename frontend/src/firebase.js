import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTeBABa2zv983leuMca1glevUdfJyOe_4",
  authDomain: "mini-hcm-time-tracking-77bfe.firebaseapp.com",
  projectId: "mini-hcm-time-tracking-77bfe",
  storageBucket: "mini-hcm-time-tracking-77bfe.firebasestorage.app",
  messagingSenderId: "273160982273",
  appId: "1:273160982273:web:3c09644a30fa819771d500"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);