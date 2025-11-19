// Client-side Firebase Configuration
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase Config - direkt tanımlandı
const firebaseConfig = {
  apiKey: "AIzaSyDclw_LtgJdCHlMjosSgn7uuV5QhRKhGfk",
  authDomain: "biblo-ffa4b.firebaseapp.com",
  projectId: "biblo-ffa4b",
  storageBucket: "biblo-ffa4b.firebasestorage.app",
  messagingSenderId: "818389818130",
  appId: "1:818389818130:web:3eda5e709b6ab93f4b71cb",
  measurementId: "G-P0NJ6CP2YE"
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
