const line = require('@line/bot-sdk');
const client = new line.Client({ channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN });

export default async function handler(req, res) {
  // 注意：請在 Vercel 設定 TARGET_GROUP_ID (你的 LINE 群組 ID)
  const groupId = process.env.TARGET_GROUP_ID;
  if (!groupId) return res.status(400).json({ error: 'Missing Group ID' });

  const dayOfWeek = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei', weekday: 'short' });
  const isWeekend = dayOfWeek === 'Sat' || dayOfWeek === 'Sun';
  
  const text = isWeekend 
    ? "📢 週末愉快！今日大聲公已刷新 3 次！" 
    : "🍄 新的一天！今日蘑菇次數已新增為 3 次，大聲公已刷新 1 次！";

  try {
    await client.pushMessage(groupId, [{ type: 'text', text }]);
    res.status(200).json({ success: true, text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Cron failed' });
  }
}
