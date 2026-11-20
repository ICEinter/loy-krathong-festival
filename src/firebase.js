import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDrYd4p8dch5b6bR7VsT348RI8kPeANOAQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "loy-krathong-festival-79bbc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "loy-krathong-festival-79bbc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "loy-krathong-festival-79bbc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "959884756960",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:959884756960:web:35a80e4dd4a57c68b44d85"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

