import * as line from '@line/bot-sdk';
// 如果目前還沒完全串接 Firebase，請暫時把底下這行註解掉，確保程式不會報錯
// import { db } from './firebase-admin.js'; 

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { groupId, userId, lineName, pictureUrl, gameName } = req.body;
  
  // 🔥 關鍵修復：如果前端因為隱私設定抓不到群組 ID，強制使用全域變數的群組 ID
  const targetGroup = groupId || process.env.TARGET_GROUP_ID;

  try {
    // 準備要傳送的歡迎卡片
    const welcomeMessage: line.FlexMessage = {
      type: "flex",
      altText: `新成員 ${gameName} 綁定完成囉！`,
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://pikmin-0.vercel.app/welcome.png",
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover"
        },
        body: {
          type: "box", layout: "vertical", spacing: "md",
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

    if (targetGroup) {
      await client.pushMessage(targetGroup, [
        { type: "text", text: `歡迎 ${gameName} 加入我們的拔草行列！🌱` },
        welcomeMessage
      ]);
    } else {
      console.warn('⚠️ 找不到 targetGroup，因此沒有傳送群組訊息。請檢查 Vercel 的 TARGET_GROUP_ID。');
    }
    
    res.status(200).json({ success: true });

  } catch (error) {
    console.error('綁定處理失敗:', error);
    res.status(500).json({ error: 'Failed to bind user or push message' });
  }
}
