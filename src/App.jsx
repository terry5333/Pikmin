import { useEffect, useState } from 'react';
import liff from '@line/liff';
import MushroomForm from './components/MushroomForm';
import NotificationSettings from './components/NotificationSettings';
import BindNameForm from './components/BindNameForm';

export default function App() {
  const [liffState, setLiffState] = useState({ init: false, profile: null });
  const [error, setError] = useState(null); // ✨ 新增錯誤狀態
  
  const queryParams = new URLSearchParams(window.location.search);
  const page = queryParams.get('page') || 'recruit';

  useEffect(() => {
    // 檢查是否有抓到環境變數
    const liffId = import.meta.env.VITE_LIFF_ID;
    
    if (!liffId) {
      setError("找不到 LIFF ID！請確認 Vercel 的環境變數是否有設定 VITE_LIFF_ID，且設定後有重新 Deploy。");
      return;
    }

    liff.init({ liffId })
      .then(() => {
        if (liff.isLoggedIn()) {
          liff.getProfile()
            .then(profile => setLiffState({ init: true, profile }))
            .catch(err => setError(`取得個人資料失敗: ${err.message}`));
        } else {
          liff.login();
        }
      })
      .catch((err) => {
        console.error(err);
        setError(`LIFF 初始化失敗: ${err.message}`);
      });
  }, []);

  // ✨ 如果有錯誤，直接顯示在畫面上
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm w-full max-w-sm">
          <p className="font-bold text-red-700">⚠️ 發生錯誤</p>
          <p className="text-sm text-red-600 mt-2 break-words">{error}</p>
        </div>
      </div>
    );
  }

  if (!liffState.init) {
    return (
      <div className="flex h-screen items-center justify-center font-bold text-gray-500">
        載入中...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-md mx-auto">
      {page === 'recruit' && <MushroomForm profile={liffState.profile} />}
      {page === 'notify' && <NotificationSettings profile={liffState.profile} />}
      {page === 'bind' && <BindNameForm profile={liffState.profile} />}
    </div>
  );
}
