// Client-side Firebase Configuration
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase Config - direkt tanımlandı
const firebaseConfig = {
  apiKey: "AIzaSyAgE0W-zuSMVnaoVO4ISqmC_tg7csiOVjY",
  authDomain: "biblo-ba9e7.firebaseapp.com",
  projectId: "biblo-ba9e7",
  storageBucket: "biblo-ba9e7.firebasestorage.app",
  messagingSenderId: "787689888986",
  appId: "1:787689888986:web:9ec9bfbcd93394dfe7d9e3",
  measurementId: "G-M23WW6KP0V"
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
