import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebase-config";

// Browser-side Firebase (admin panel only). Config lives in firebase-config.ts.

const app = () => (getApps().length ? getApp() : initializeApp(firebaseConfig));

export const firebaseAuth = () => getAuth(app());
export const firestore = () => getFirestore(app());
