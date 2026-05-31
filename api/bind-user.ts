import * as line from '@line/bot-sdk';

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { groupId, userId, lineName, pictureUrl, gameName } = req.body;
  
  // 🔥 終極物理防禦：直接寫死你截圖裡的正確群組 ID，完全不依賴 process.env
  const targetGroup = groupId || 'C37559d3c9937e6c7d230f2fa5383edf0';

  if (!targetGroup.startsWith('C')) {
    console.error(`🚨 ID 格式錯誤：[${targetGroup}]`);
    return res.status(400).json({ error: '群組 ID 格式錯誤' });
  }

  try {
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

    // 發送推播到寫死的群組
    await client.pushMessage(targetGroup, [
      { type: "text", text: `歡迎 ${gameName} 加入我們的拔草行列！🌱` },
      welcomeMessage
    ]);
    
    res.status(200).json({ success: true });

  } catch (error) {
    console.error('發送 LINE 訊息失敗:', error);
    res.status(500).json({ error: 'Failed to push message to LINE' });
  }
}
