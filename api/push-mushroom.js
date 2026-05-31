const line = require('@line/bot-sdk');
const { db } = require('./firebase-admin');

const client = new line.Client({ channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { groupId, profile, mushroomData } = req.body;
  
  // 實務上這裡可以透過 db.collection('users').get() 來過濾勿擾時間
  // 目前為了 Debug 順暢，先固定標註全體
  const notifyText = "@All 準備派兵打菇囉！";
  
  const flexMessage = {
    type: "flex", altText: `🍄 新蘑菇：${mushroomData.type}`,
    contents: {
      type: "bubble",
      hero: { type: "image", url: "https://i.imgur.com/your-image3.jpg", size: "full", aspectRatio: "20:13", aspectMode: "cover" },
      body: {
        type: "box", layout: "vertical",
        contents: [
          {
            type: "box", layout: "horizontal", spacing: "md", alignItems: "center",
            contents: [
              { type: "image", url: profile.pictureUrl, size: "xxs", flex: 0, style: "circular" },
              { type: "text", text: profile.displayName, weight: "bold", size: "sm", color: "#888888" }
            ], backgroundColor: "#f5f5f5", cornerRadius: "100px", paddingAll: "8px"
          },
          { type: "separator", margin: "md" },
          { type: "text", text: `${mushroomData.type} • ${mushroomData.color}`, weight: "bold", size: "xl", margin: "md" },
          { type: "text", text: `📍 位置: ${mushroomData.location}`, size: "sm", color: "#666666", margin: "sm" },
          { type: "text", text: `🪑 空位: ${mushroomData.slots}`, size: "sm", color: "#666666", margin: "sm" },
          { type: "text", text: `⏳ 剩餘: ${mushroomData.timeLeft}`, size: "sm", color: "#666666", margin: "sm" }
        ]
      }
    }
  };

  try {
    if (groupId) await client.pushMessage(groupId, [flexMessage, { type: "text", text: notifyText }]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Push failed' });
  }
}
