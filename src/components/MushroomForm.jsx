import { useState } from 'react';
import liff from '@line/liff';

export default function MushroomForm({ profile }) {
  const [formData, setFormData] = useState({ type: '普', color: '紅', location: '', slots: '1', timeLeft: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const context = liff.getContext();
    await fetch('/api/push-mushroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId: context?.roomId || context?.groupId, profile, mushroomData: formData })
    });
    liff.closeWindow();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg rounded-[32px] p-6 space-y-5">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-4">發起蘑菇招募</h2>
      <div className="flex space-x-2">
        <select className="flex-1 bg-white/60 p-3 rounded-2xl outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
          <option>小</option><option>普</option><option>巨</option><option>活動</option><option>火</option><option>水</option><option>電</option><option>水晶</option>
        </select>
        <select className="flex-1 bg-white/60 p-3 rounded-2xl outline-none" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}>
          <option>紅</option><option>黃</option><option>紫</option><option>白</option><option>粉</option><option>灰</option><option>無</option>
        </select>
      </div>
      <input type="text" required placeholder="位置 (例: 台北車站)" className="w-full bg-white/60 p-3 rounded-2xl outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
      <div className="flex space-x-2">
        <input type="number" min="1" max="4" required placeholder="空位" className="w-full bg-white/60 p-3 rounded-2xl outline-none" value={formData.slots} onChange={e => setFormData({...formData, slots: e.target.value})} />
        <input type="text" placeholder="剩餘時間 (例: 1h20m)" required className="w-full bg-white/60 p-3 rounded-2xl outline-none" value={formData.timeLeft} onChange={e => setFormData({...formData, timeLeft: e.target.value})} />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-red-400 hover:bg-red-500 text-white font-bold py-4 rounded-[24px] shadow-sm disabled:opacity-50 mt-4">
        {isSubmitting ? '發布中...' : '發布到群組'}
      </button>
    </form>
  );
}
