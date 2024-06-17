import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH,
    projectId: import.meta.env.VITE_FIREBASE_PID,
    storageBucket: import.meta.env.VITE_FIRBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIRBASE_MESSAGING_ID,
    appId: import.meta.env.VITE_FIRBASE_APPID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics }