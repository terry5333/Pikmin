const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    // 請在 Vercel 設定 FIREBASE_SERVICE_ACCOUNT，內容為壓縮成一行的 JSON 字串
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase Admin 初始化失敗:', error);
  }
}

const db = admin.apps.length ? admin.firestore() : null;
module.exports = { admin, db };
