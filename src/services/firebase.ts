import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

// Only initialize if API key is present to avoid "invalid-api-key" error on startup
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined") {
  try {
    console.log("Initializing Firebase with project:", firebaseConfig.projectId);
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    console.log("Firebase Auth initialized successfully");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase API Key is missing or undefined. Auth will not be available.");
}

// Export a proxy or a safe getter for auth
export const auth = authInstance as Auth;
