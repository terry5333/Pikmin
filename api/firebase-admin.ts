import admin from 'firebase-admin';

// 確保在 Serverless 環境下不會重複初始化
if (!admin.apps.length) {
  try {
    // 🌟 讀取你在 Vercel 設定的 FIREBASE_SERVICE_ACCOUNT 整包 JSON
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT || '{}';
    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // 雙重防呆：如果 JSON 裡面沒抓到，就用你設定的 VITE_FIREBASE_PROJECT_ID
      projectId: serviceAccount.project_id || process.env.VITE_FIREBASE_PROJECT_ID,
    });
    console.log('Firebase Admin 初始化成功！');
  } catch (error) {
    console.error('Firebase Admin 初始化失敗:', error);
  }
}

const db = admin.firestore();
export { db };
