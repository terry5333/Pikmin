import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT || '{}';
    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // 🔗 從 Vercel 環境變數讀取 RTDB 網址
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log('Firebase Admin 初始化成功！(RTDB 模式)');
  } catch (error) {
    console.error('Firebase Admin 初始化失敗:', error);
  }
}

// 🗄️ 改為匯出 Realtime Database
const db = admin.database();
export { db };
