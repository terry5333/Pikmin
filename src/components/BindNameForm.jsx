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
    
    try {
      await fetch('/api/bind-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: context?.roomId || context?.groupId, 
          userId: profile.userId,
          lineName: profile.displayName,
          pictureUrl: profile.pictureUrl,
          gameName: gameName.trim()
        })
      });
      
      // 成功後關閉視窗
      liff.closeWindow();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert("綁定發生錯誤，請稍後再試！");
    }
  };

  return (
    /* 完全不透明的純白實心卡片，搭配淺灰邊框 */
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 max-w-sm mx-auto p-8">
      
      <div className="flex flex-col items-center mb-8">
        <img 
          src={profile.pictureUrl} 
          alt="Avatar" 
          className="w-20 h-20 rounded-full mb-4 border border-gray-200 object-cover" 
        />
        <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
          哈囉, {profile.displayName}
        </h2>
        <p className="text-sm text-gray-500 mt-2 text-center">
          請輸入你的皮克敏遊戲暱稱
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            遊戲內暱稱
          </label>
          <input 
            type="text" 
            required 
            placeholder="例如：皮克敏大師" 
            className="w-full bg-gray-50 p-4 rounded-xl border border-gray-300 outline-none text-gray-800 font-medium placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors" 
            value={gameName} 
            onChange={e => setGameName(e.target.value)} 
            disabled={isSubmitting} 
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold text-lg py-4 rounded-xl transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '綁定中...' : '確認綁定'}
        </button>
      </form>
    </div>
  );
}
