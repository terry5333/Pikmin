import * as line from '@line/bot-sdk';
import { db } from './firebase-admin'; // 確保你有這個 Firebase 連線檔案

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { userId, lineName, pictureUrl, gameName } = req.body;
  const targetGroup = 'C37559d3c9937e6c7d230f2fa5383edf0';

  try {
    // 🗄️ 1. 真正寫入資料到 Firebase
    await db.collection('users').doc(userId).set({
      lineName,
      gameName,
      pictureUrl,
      groupId: targetGroup,
      notifications: {
        mushroom: true, // 預設開啟蘑菇通知
        daily: true     // 預設開啟大聲公通知
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // 🎨 2. 全新高質感實體 Flex Message
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

    await client.pushMessage(targetGroup, [welcomeMessage]);
    res.status(200).json({ success: true });

  } catch (error: any) {
    console.error('處理失敗:', error.response?.data || error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
