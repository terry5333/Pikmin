import * as line from '@line/bot-sdk';

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  // 1. 取得目標群組 ID (這必須設定在 Vercel Environment Variables 中)
  const groupId = process.env.TARGET_GROUP_ID;
  
  if (!groupId) {
    console.error('缺少 TARGET_GROUP_ID 環境變數');
    return res.status(400).json({ error: 'Missing TARGET_GROUP_ID environment variable' });
  }

  // 2. 判斷今天是平日還是假日 (使用台灣時間判斷)
  const dayOfWeek = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei', weekday: 'short' });
  const isWeekend = dayOfWeek === 'Sat' || dayOfWeek === 'Sun';
  
  // 3. 準備推播文字
  const notifyText = isWeekend 
    ? "📢 週末愉快！今日大聲公已刷新 3 次！" 
    : "🍄 新的一天！今日蘑菇次數已新增為 3 次，大聲公已刷新 1 次！";

  try {
    // 4. 主動推送訊息到指定的群組
    await client.pushMessage(groupId, [
      { type: 'text', text: notifyText }
    ]);
    
    // 5. 回傳成功狀態，讓 Vercel 的 Cron Job 知道執行完畢
    res.status(200).json({ success: true, text: notifyText });

  } catch (error) {
    console.error('每日推播排程失敗:', error);
    res.status(500).json({ error: 'Failed to execute cron push message' });
  }
}
