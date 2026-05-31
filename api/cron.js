import * as line from '@line/bot-sdk';
// import { db } from './firebase-admin.js'; // 如果未來你需要從 RTDB 讀取特定玩家資料，可以把這行打開

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

export default async function handler(req: any, res: any) {
  // 🔒 安全防護：確保這支 API 只有 Vercel 的 Cron 系統能呼叫，不會被路人亂打
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[Cron] 授權失敗：缺少或錯誤的 CRON_SECRET');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 讀取我們設定好的群組 ID
  const targetGroup = process.env.TARGET_GROUP_ID || 'C37559d3c9937e6c7d230f2fa5383edf0';

  try {
    console.log('[Cron] 開始執行每日推播任務...');

    // 🎨 高質感的每日提醒 Flex Message
    const dailyReminder: line.FlexMessage = {
      type: "flex",
      altText: "🌞 早安！皮克敏每日任務提醒",
      contents: {
        type: "bubble",
        size: "kilo",
        body: {
          type: "box", layout: "vertical", paddingAll: "20px", spacing: "md",
          contents: [
            { type: "text", text: "🌞 早安皮克敏！", weight: "bold", size: "xl", color: "#059669" },
            { type: "text", text: "又是適合種花的一天 🌸\n別忘了今天的：\n\n🍄 3 次免費菇菇額度\n📡 探測器免費用 1 次\n🚶‍♂️ 出門散步解任務", wrap: true, color: "#4B5563", size: "md" }
          ]
        }
      }
    };

    // 🚀 發送訊息到群組
    await client.pushMessage(targetGroup, [dailyReminder]);
    
    console.log('[Cron] 每日推播發送成功！');
    res.status(200).json({ success: true, message: 'Cron job executed successfully' });

  } catch (error: any) {
    console.error('[Cron] 處理失敗:', error.response?.data || error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
