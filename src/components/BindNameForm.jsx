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
      liff.closeWindow();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert("綁定發生錯誤，請重試！");
    }
  };

  return (
    /* 純白實體卡片，去除透明度 */
    <div className="bg-white shadow-xl rounded-[32px] overflow-hidden border border-gray-100 max-w-sm mx-auto">
      
      {/* 活潑的頂部橫幅設計 */}
      <div className="h-32 w-full bg-green-100 relative">
         <img src="/welcome.png" alt="Banner" className="w-full h-full object-cover" />
         <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <img src={profile.pictureUrl} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-white" />
         </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 pt-14 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-800">哈囉, {profile.displayName}</h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">幫自己取個響亮的皮克敏名字吧！<br/>這樣大家打菇才認得你喔 🍄</p>
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700 pl-2">遊戲內暱稱</label>
          <input 
            type="text" 
            required 
            placeholder="例如：台北皮克敏大師" 
            className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-gray-200 outline-none text-gray-800 font-bold placeholder-gray-400 focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all" 
            value={gameName} 
            onChange={e => setGameName(e.target.value)} 
            disabled={isSubmitting} 
          />
        </div>

        {/* 立體感遊戲按鈕 */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-[#4CAF50] hover:bg-[#43a047] text-white font-black text-lg py-4 rounded-[24px] shadow-[0_4px_0_0_#2e7d32] active:shadow-none active:translate-y-1 transition-all mt-4 disabled:opacity-50 disabled:active:shadow-[0_4px_0_0_#2e7d32] disabled:active:translate-y-0"
        >
          {isSubmitting ? '綁定中...' : '確認綁定 🚀'}
        </button>
      </form>
    </div>
  );
}
