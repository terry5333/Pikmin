import * as line from '@line/bot-sdk';

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

export default async function handler(req: any, res: any) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ⚠️ 確保這裡的群組 ID 是對的
  const targetGroup = process.env.TARGET_GROUP_ID || 'C37559d3c9937e6c7d230f2fa5383edf0';

  try {
    const dailyReminder: line.FlexMessage = {
      type: "flex",
      altText: "🌞 午夜結算與早安提醒",
      contents: {
        type: "bubble",
        size: "kilo",
        body: {
          type: "box", layout: "vertical", paddingAll: "24px",
          contents: [
            { type: "text", text: "Daily Update", weight: "bold", size: "sm", color: "#9CA3AF" },
            { type: "text", text: "新的一天開始囉 🌸", weight: "bold", size: "xl", color: "#111827", margin: "sm" },
            { type: "separator", margin: "xl", color: "#F3F4F6" },
            { type: "text", text: "🍄 免費菇菇額度已重置\n📡 探測器可再次使用", wrap: true, color: "#4B5563", size: "sm", margin: "xl", lineSpacing: "6px" }
          ]
        }
      }
    };

    await client.pushMessage(targetGroup, [dailyReminder]);
    res.status(200).json({ success: true });
  } catch (error: any) {
    // 如果按 Run 沒反應，請去 Vercel 的 Logs 看這行印出什麼！
    console.error('Cron 發送失敗:', error.response?.data || error.message);
    res.status(500).json({ error: 'Cron failed' });
  }
}
