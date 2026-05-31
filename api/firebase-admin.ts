import admin from 'firebase-admin';

// 確保在 Serverless 環境下不會重複初始化
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // 處理 Vercel 環境變數中私鑰的換行字元問題
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin 初始化成功！');
  } catch (error) {
    console.error('Firebase Admin 初始化失敗:', error);
  }
}

const db = admin.firestore();
export { db };
