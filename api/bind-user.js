const line = require('@line/bot-sdk');
const { db } = require('./firebase-admin');

const client = new line.Client({ channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { groupId, userId, lineName, pictureUrl, gameName } = req.body;
  
  try {
    if (db) {
      await db.collection('users').doc(userId).set({ lineName, gameName, pictureUrl, updatedAt: new Date() }, { merge: true });
    }
    
    if (groupId) {
      const flexMsg = {
        type: "flex", altText: `新成員 ${gameName} 綁定完成`,
        contents: {
          type: "bubble",
          body: {
            type: "box", layout: "vertical", spacing: "md",
            contents: [
              { type: "text", text: "🎉 新成員報到", weight: "bold", size: "xl", color: "#4CAF50" },
              {
                type: "box", layout: "horizontal", spacing: "md", alignItems: "center", margin: "lg",
                contents: [
                  { type: "image", url: pictureUrl, size: "sm", flex: 0, style: "circular" },
                  { type: "box", layout: "vertical", contents: [{ type: "text", text: `LINE: ${lineName}`, size: "sm", color: "#888888" }, { type: "text", text: `遊戲名: ${gameName}`, weight: "bold", size: "md" }] }
                ]
              }
            ]
          }
        }
      };
      await client.pushMessage(groupId, [{ type: "text", text: `歡迎 ${gameName}！🌱` }, flexMsg]);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bind failed' });
  }
}
