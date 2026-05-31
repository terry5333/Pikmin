import { useState, useEffect } from 'react';
import liff from '@line/liff';

export default function NotificationSettings({ profile }) {
  const [settings, setSettings] = useState({ mushroom: true, daily: true });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 嘗試從後端讀取設定
    fetch(`/api/get-user?userId=${profile.userId}`)
      .then(res => res.json())
      .then(data => {
        // 如果 Firebase 有資料就套用，沒有就用預設值
        if (data && data.notifications) {
          setSettings(data.notifications);
        }
      })
      .catch(err => console.error("讀取失敗，使用預設值", err))
      .finally(() => setIsLoading(false));
  }, [profile.userId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.userId, notifications: settings })
      });
      liff.closeWindow();
    } catch (error) {
      console.error(error);
      alert('儲存失敗');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-center font-bold text-gray-500 mt-20">讀取資料中...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 max-w-sm mx-auto p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">🔔 通知設定</h2>
      
      <div className="space-y-4 mb-8">
        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
          <span className="font-bold text-gray-700">🍄 接收蘑菇招募推播</span>
          <input 
            type="checkbox" 
            checked={settings.mushroom} 
            onChange={e => setSettings({...settings, mushroom: e.target.checked})}
            className="w-6 h-6 text-green-500 rounded border-gray-300 focus:ring-green-500"
          />
        </label>

        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
          <span className="font-bold text-gray-700">📢 接收每日大聲公提醒</span>
          <input 
            type="checkbox" 
            checked={settings.daily} 
            onChange={e => setSettings({...settings, daily: e.target.checked})}
            className="w-6 h-6 text-green-500 rounded border-gray-300 focus:ring-green-500"
          />
        </label>
      </div>

      <button 
        onClick={handleSave} 
        disabled={isSaving}
        className="w-full bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold text-lg py-4 rounded-xl transition-colors disabled:opacity-50"
      >
        {isSaving ? '儲存中...' : '儲存設定'}
      </button>
    </div>
  );
}
