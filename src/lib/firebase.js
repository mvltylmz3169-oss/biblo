// Client-side Firebase Configuration
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase Config - direkt tanımlandı
const firebaseConfig = {
  apiKey: "AIzaSyBAK6SJa7z-_APwyO42l2eVdpY_r8vd5qM",
  authDomain: "toki-38c58.firebaseapp.com",
  projectId: "toki-38c58",
  storageBucket: "toki-38c58.firebasestorage.app",
  messagingSenderId: "1066931503451",
  appId: "1:1066931503451:web:1f05a8ce52687df8741a7e",
  measurementId: "G-3PF48GD3G4"
};

// Initialize Firebase (only once)
let app;
let analytics = null;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  
  // Initialize Analytics (only in browser and if supported)
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log("🔥 Firebase Analytics aktif!");
      }
    });
  }
} else {
  app = getApps()[0];
}

// Initialize Firebase Storage
export const storage = getStorage(app);

// Export analytics
export { analytics };

export default app;
