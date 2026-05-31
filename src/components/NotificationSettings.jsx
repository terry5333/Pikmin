import { useState, useEffect } from 'react';
import liff from '@line/liff';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function NotificationSettings({ profile }) {
  const [dndStart, setDndStart] = useState('23:00');
  const [dndEnd, setDndEnd] = useState('07:00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDoc(doc(db, "users", profile.userId));
      if (docSnap.exists() && docSnap.data().notifications) {
        setDndStart(docSnap.data().notifications.dndStart || '23:00');
        setDndEnd(docSnap.data().notifications.dndEnd || '07:00');
      }
      setLoading(false);
    };
    fetchSettings();
  }, [profile.userId]);

  const handleSave = async () => {
    await setDoc(doc(db, "users", profile.userId), {
      notifications: { dndStart, dndEnd }
    }, { merge: true });
    liff.closeWindow();
  };

  if (loading) return <div>讀取設定中...</div>;

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg rounded-[32px] p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <img src={profile.pictureUrl} alt="avatar" className="w-12 h-12 rounded-full shadow-sm" />
        <h2 className="text-lg font-bold text-gray-800">{profile.displayName} 的通知</h2>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3">勿擾時間 (暫停標註)</h3>
        <div className="flex items-center space-x-2">
          <input type="time" value={dndStart} onChange={e => setDndStart(e.target.value)} className="flex-1 bg-white/50 p-3 rounded-2xl outline-none text-gray-700" />
          <span className="text-gray-500 font-bold">~</span>
          <input type="time" value={dndEnd} onChange={e => setDndEnd(e.target.value)} className="flex-1 bg-white/50 p-3 rounded-2xl outline-none text-gray-700" />
        </div>
      </div>
      <button onClick={handleSave} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-[24px] shadow-sm mt-4">儲存設定</button>
    </div>
  );
}
