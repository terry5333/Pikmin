import admin from 'firebase-admin';

// 確保不會重複初始化 Firebase
if (!admin.apps.length) {
  try {
    // 檢查是否有設定環境變數
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin 初始化成功');
    } else {
      console.warn('警告：未設定 FIREBASE_SERVICE_ACCOUNT 環境變數，資料庫功能將暫時停用。');
    }
  } catch (error) {
    console.error('Firebase Admin 初始化失敗:', error);
  }
}

// 匯出 db 供其他檔案使用
const db = admin.apps.length ? admin.firestore() : null;
export { admin, db };
