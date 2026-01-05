// Client-side Firebase Configuration
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDclw_LtgJdCHlMjosSgn7uuV5QhRKhGfk",
  authDomain: "biblo-ffa4b.firebaseapp.com",
  projectId: "biblo-ffa4b",
  storageBucket: "biblo-ffa4b.firebasestorage.app",
  messagingSenderId: "818389818130",
  appId: "1:818389818130:web:3eda5e709b6ab93f4b71cb",
  measurementId: "G-P0NJ6CP2YE"
};

// Initialize Firebase only once - with try/catch for older Android devices
let app;
let analytics = null;

try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Fallback: try to get existing app or create new one
  app = getApps().length ? getApp() : initializeApp(firebaseConfig, "biblo-app");
}

// Initialize Analytics (only in browser and if supported)
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics not supported on this device, silently ignore
    });
}

// Initialize Firebase Storage
export const storage = getStorage(app);

// Export analytics
export { analytics };

export default app;
