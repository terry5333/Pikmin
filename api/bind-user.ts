import * as line from '@line/bot-sdk';
import { db } from './firebase-admin.js'; 

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { userId, lineName, pictureUrl, gameName } = req.body;
  const targetGroup = process.env.TARGET_GROUP_ID || 'C37559d3c9937e6c7d230f2fa5383edf0';

  console.log(`[System] 準備寫入玩家資料 (RTDB): ${gameName} (ID: ${userId})`);

  try {
    // 🗄️ 寫入 Firebase Realtime Database
    await db.ref(`users/${userId}`).update({
      lineName,
      gameName,
      pictureUrl,
      groupId: targetGroup,
      notifications: {
        mushroom: true,
        daily: true
      },
      updatedAt: new Date().toISOString()
    });

    console.log('[System] RTDB 寫入成功！準備發送 LINE 訊息...');

    // 🎨 高質感實體 Flex Message
    const welcomeMessage: line.FlexMessage = {
      type: "flex",
      altText: `新成員 ${gameName} 綁定完成囉！`,
      contents: {
        type: "bubble",
        size: "mega",
        header: {
          type: "box", layout: "vertical", backgroundColor: "#4CAF50", paddingAll: "16px",
          contents: [
            { type: "text", text: "🌱 皮克敏大隊 報到成功", color: "#ffffff", weight: "bold", size: "lg", align: "center" }
          ]
        },
        body: {
          type: "box", layout: "vertical", paddingAll: "24px", spacing: "lg", backgroundColor: "#ffffff",
          contents: [
            {
              type: "box", layout: "horizontal", spacing: "lg", alignItems: "center",
              contents: [
                { type: "image", url: pictureUrl, size: "md", flex: 0 },
                {
                  type: "box", layout: "vertical",
                  contents: [
                    { type: "text", text: gameName, weight: "bold", size: "xl", color: "#111827" },
                    { type: "text", text: `LINE: ${lineName}`, size: "sm", color: "#6B7280" }
                  ]
                }
              ]
            },
            { type: "separator", margin: "lg", color: "#E5E7EB" },
            {
              type: "box", layout: "vertical", spacing: "sm",
              contents: [
                { type: "text", text: "📌 群組指令指南", weight: "bold", color: "#059669", size: "sm" },
                { type: "text", text: "• 輸入「菇」：呼叫招募面板", size: "sm", color: "#4B5563" },
                { type: "text", text: "• 輸入「通知」：設定個人勿擾", size: "sm", color: "#4B5563" }
              ]
            }
          ]
        }
      }
    };

    await client.pushMessage(targetGroup, [
      { type: "text", text: `歡迎 ${gameName} 加入我們的拔草行列！🌱` },
      welcomeMessage
    ]);
    
    console.log('[System] LINE 訊息發送成功！完美結案！');
    res.status(200).json({ success: true });

  } catch (error: any) {
    console.error('處理失敗:', error.response?.data || error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
