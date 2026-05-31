import * as line from '@line/bot-sdk';
import { db } from './firebase-admin.js'; // 必須加上 .js

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  // 只允許 POST 請求
  if (req.method !== 'POST') return res.status(405).end();
  
  const { groupId, userId, lineName, pictureUrl, gameName } = req.body;
  
  try {
    // 1. 將綁定資料寫入 Firebase (若有設定 Firebase 的話)
    if (db) {
      await db.collection('users').doc(userId).set({ 
        lineName: lineName, 
        gameName: gameName, 
        pictureUrl: pictureUrl, 
        updatedAt: new Date() 
      }, { merge: true });
    }
    
    // 2. 只有在群組內觸發綁定時，才推播介紹卡片回群組
    if (groupId) {
      const welcomeMessage = {
        type: "flex",
        altText: `新成員 ${gameName} 綁定完成囉！`,
        contents: {
          type: "bubble",
          hero: {
            type: "image",
            url: "https://i.imgur.com/your-image2.jpg", // ⚠️ 請替換為你實際的皮克敏圖片網址
            size: "full",
            aspectRatio: "20:13",
            aspectMode: "cover"
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "md",
            contents: [
              { type: "text", text: "🎉 新成員報到", weight: "bold", size: "xl", color: "#4CAF50" },
              {
                type: "box", layout: "horizontal", spacing: "md", alignItems: "center", margin: "lg",
                contents: [
                  { type: "image", url: pictureUrl, size: "sm", flex: 0, style: "circular" },
                  {
                    type: "box", layout: "vertical",
                    contents: [
                      { type: "text", text: `LINE: ${lineName}`, size: "sm", color: "#888888" },
                      { type: "text", text: `遊戲名: ${gameName}`, weight: "bold", size: "md", color: "#333333" }
                    ]
                  }
                ]
              },
              { type: "separator", margin: "lg" },
              { type: "text", text: "🤖 機器人小幫手指南", weight: "bold", size: "sm", margin: "lg", color: "#666666" },
              { type: "text", text: "• 輸入「菇」：開啟招募與計時器\n• 輸入「通知」：設定客製化勿擾\n• 每天 00:00：自動推播大聲公次數", wrap: true, size: "xs", color: "#888888", margin: "sm" }
            ]
          }
        }
      };

      // 推播兩則訊息：純文字歡迎 + Flex 介紹卡片
      await client.pushMessage(groupId, [
        { type: "text", text: `歡迎 ${gameName} 加入我們的拔草行列！🌱` },
        welcomeMessage
      ]);
    }
    
    // 3. 回傳成功給前端 LIFF
    res.status(200).json({ success: true });

  } catch (error) {
    console.error('綁定處理失敗:', error);
    res.status(500).json({ error: 'Failed to bind user or push message' });
  }
}
