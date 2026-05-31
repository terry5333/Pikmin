import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 在 Vite 中，環境變數需以 VITE_ 開頭
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
