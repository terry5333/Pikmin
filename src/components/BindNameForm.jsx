import { useState } from 'react';
import liff from '@line/liff';

export default function BindNameForm({ profile }) {
  const [gameName, setGameName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gameName.trim()) return;
    setIsSubmitting(true);
    const context = liff.getContext();
    
    await fetch('/api/bind-user', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId: context?.roomId || context?.groupId, userId: profile.userId, lineName: profile.displayName, pictureUrl: profile.pictureUrl, gameName: gameName.trim() })
    });
    liff.closeWindow();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg rounded-[32px] p-8 space-y-6">
      <div className="flex flex-col items-center mb-6">
        <img src={profile.pictureUrl} alt="Avatar" className="w-16 h-16 rounded-full mb-4 shadow-md" />
        <h2 className="text-xl font-bold text-gray-800">歡迎, {profile.displayName}</h2>
      </div>
      <input type="text" required placeholder="遊戲內暱稱" className="w-full bg-white/60 p-4 rounded-2xl outline-none text-gray-800 font-medium" value={gameName} onChange={e => setGameName(e.target.value)} disabled={isSubmitting} />
      <button type="submit" disabled={isSubmitting} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-[24px] shadow-sm disabled:opacity-50 mt-4">
        {isSubmitting ? '綁定中...' : '確認綁定'}
      </button>
    </form>
  );
}
