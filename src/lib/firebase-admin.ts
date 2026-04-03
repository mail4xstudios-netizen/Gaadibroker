import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length) return getApp();

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccount) {
    try {
      const parsed = JSON.parse(serviceAccount);
      return initializeApp({
        credential: cert(parsed),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (e) {
      console.error("Firebase Admin init error:", e);
    }
  }

  // Fallback: initialize with project ID only
  return initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

let adminDb: ReturnType<typeof getFirestore>;
let adminStorage: ReturnType<typeof getStorage>;
let adminAuth: ReturnType<typeof getAuth>;

try {
  const app = getAdminApp();
  adminDb = getFirestore(app);
  adminStorage = getStorage(app);
  adminAuth = getAuth(app);
} catch (e) {
  console.error("Firebase Admin setup error:", e);
  adminDb = {} as ReturnType<typeof getFirestore>;
  adminStorage = {} as ReturnType<typeof getStorage>;
  adminAuth = {} as ReturnType<typeof getAuth>;
}

export { adminDb, adminStorage, adminAuth };
