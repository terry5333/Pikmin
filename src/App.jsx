import { useEffect, useState } from 'react';
import liff from '@line/liff';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('bind'); // 預設頁面
  const [userData, setUserData] = useState({
    userId: '',
    lineName: '',
    pictureUrl: '',
    gameName: '', // 皮克敏名稱
    settings: { mushroom: true, daily: true }
  });

  useEffect(() => {
    // 1. 抓取網址參數，決定要顯示哪個畫面
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam) setPage(pageParam);

    // 2. 初始化 LIFF
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID })
      .then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        const profile = await liff.getProfile();
        
        // 3. 去我們的 RTDB 抓取這位玩家的設定與皮克敏名稱
        try {
          const res = await fetch(`/api/get-user?userId=${profile.userId}`);
          if (res.ok) {
            const dbData = await res.json();
            setUserData({
              userId: profile.userId,
              lineName: profile.displayName,
              pictureUrl: profile.pictureUrl || '',
              gameName: dbData.gameName || '尚未綁定名稱',
              settings: dbData.notifications || { mushroom: true, daily: true }
            });
          }
        } catch (err) {
          console.error("抓取資料失敗", err);
        }
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  // 儲存設定到後端
  const handleToggle = async (type: 'mushroom' | 'daily') => {
    const newSettings = { ...userData.settings, [type]: !userData.settings[type] };
    setUserData({ ...userData, settings: newSettings });

    await fetch('/api/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userData.userId,
        notifications: newSettings
      })
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // 🟢 通知設定畫面 (極簡毛玻璃風格)
  if (page === 'notify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] p-6 flex flex-col items-center pt-12">
        {/* 卡片本體：大圓角 + 毛玻璃 */}
        <div className="w-full max-w-sm bg-white/60 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-white/80 p-8">
          
          {/* 頭像與名稱區塊 */}
          <div className="flex flex-col items-center mb-10">
            <img 
              src={userData.pictureUrl} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full shadow-md object-cover border-4 border-white mb-4"
            />
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {userData.gameName}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              LINE: {userData.lineName}
            </p>
          </div>

          {/* 設定開關區塊 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-gray-800">🍄 菇菇招募通知</p>
                <p className="text-xs text-gray-500 mt-1">群組有人發起招募時提醒我</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={userData.settings.mushroom} onChange={() => handleToggle('mushroom')} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-gray-800">🌞 每日早安提醒</p>
                <p className="text-xs text-gray-500 mt-1">每天重置免費額度時提醒我</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={userData.settings.daily} onChange={() => handleToggle('daily')} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
              </label>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // 其他畫面 (綁定頁面等...)
  return <div>請輸入其他路由邏輯</div>;
}
