import * as line from '@line/bot-sdk';
import { db } from './firebase-admin.js'; // 必須加上 .js

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  // 只允許 POST 請求
  if (req.method !== 'POST') return res.status(405).end();
  
  const { groupId, profile, mushroomData } = req.body;
  
  // 雙重保險：如果前端沒有抓到群組 ID，就使用環境變數裡的 TARGET_GROUP_ID
  const targetGroup = groupId || process.env.TARGET_GROUP_ID;
  
  const notifyText = "@All 準備派兵打菇囉！";
  
  const flexMessage = {
    type: "flex",
    altText: `🍄 新蘑菇招募：${mushroomData.type}`,
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: "https://pikmin-0.vercel.app/recruit.jpg", // ⚠️ 替換為實際網址
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover"
      },
      body: {
        type: "box", layout: "vertical",
        contents: [
          {
            type: "box", layout: "horizontal", spacing: "md", alignItems: "center",
            contents: [
              { type: "image", url: profile.pictureUrl, size: "xxs", flex: 0, style: "circular" },
              { type: "text", text: profile.displayName, weight: "bold", size: "sm", color: "#888888" }
            ],
            paddingAll: "8px",
            backgroundColor: "#f5f5f5",
            cornerRadius: "100px"
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
    if (targetGroup) {
      await client.pushMessage(targetGroup, [
        flexMessage, 
        { type: "text", text: notifyText }
      ]);
      res.status(200).json({ success: true });
    } else {
      console.error('沒有找到群組 ID，無法發送訊息');
      res.status(400).json({ error: 'Missing Group ID' });
    }
  } catch (error) {
    console.error('發送蘑菇招募失敗:', error);
    res.status(500).json({ error: 'Push failed' });
  }
}
