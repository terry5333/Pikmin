import * as line from '@line/bot-sdk';

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const events = req.body.events;
    await Promise.all(events.map(handleEvent));
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.error('Webhook 處理失敗:', err);
    res.status(500).end();
  }
}

async function handleEvent(event) {
  // 1. 新人加入群組事件
  if (event.type === 'memberJoined') {
    return client.replyMessage(event.replyToken, {
      type: 'flex',
      altText: '歡迎加入！請綁定遊戲名稱',
      contents: getWelcomeFlex()
    });
  }

  // 確保是文字訊息才繼續處理
  if (event.type !== 'message' || event.message.type !== 'text') return null;
  const text = event.message.text.trim();

  // 2. 隱藏指令：找群組 ID (用於設定排程推播)
  if (text === '找id') {
    const groupId = event.source.groupId;
    if (groupId) {
      return client.replyMessage(event.replyToken, {
        type: 'text', 
        text: `這個群組的 ID 是：\n${groupId}\n\n請把它複製貼到 Vercel 的 TARGET_GROUP_ID 環境變數中。`
      });
    } else {
      return client.replyMessage(event.replyToken, { 
        type: 'text', 
        text: '請在「群組」內輸入此指令，單線對話無法取得群組 ID 喔！' 
      });
    }
  }

  // 3. 觸發蘑菇總控制面板
  if (text === '菇') {
    return client.replyMessage(event.replyToken, {
      type: 'flex',
      altText: '🍄 蘑菇面板',
      contents: getMushroomPanelFlex()
    });
  }

  // 4. 觸發個人化通知設定
  if (text === '通知') {
    return client.replyMessage(event.replyToken, {
      type: 'flex',
      altText: '⚙️ 通知設定',
      contents: getNotificationFlex()
    });
  }
}

// ==========================================
// 🎨 Flex Message 樣板生成區
// ⚠️ 注意：請確保 hero.url 的網址換成你 Vercel 上的真實圖片網址
// ==========================================

function getMushroomPanelFlex() {
  return {
    type: "bubble",
    size: "kilo",
    hero: {
      type: "image",
      url: "https://pikmin-0.vercel.app/panel.jpg", // 替換為實際網址
      size: "full",
      aspectRatio: "20:13",
      aspectMode: "cover"
    },
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      contents: [
        { type: "text", text: "🍄 蘑菇控制中心", weight: "bold", size: "xl", align: "center" }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "primary",
          color: "#ff5252",
          action: {
            type: "uri",
            label: "發起招募",
            uri: `https://liff.line.me/${process.env.VITE_LIFF_ID}?page=recruit`
          }
        },
        {
          type: "button",
          style: "secondary",
          action: {
            type: "uri",
            label: "手動計時器",
            uri: `https://liff.line.me/${process.env.VITE_LIFF_ID}?page=timer`
          }
        }
      ]
    }
  };
}

function getWelcomeFlex() {
  return {
    type: "bubble",
    hero: {
      type: "image",
      url: "https://pikmin-0.vercel.app/welcome.jpg", // 替換為實際網址
      size: "full",
      aspectRatio: "16:9",
      aspectMode: "cover"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        { type: "text", text: "歡迎加入群組！🌱", weight: "bold", size: "xl", align: "center" },
        { type: "text", text: "請先綁定遊戲名稱喔！", color: "#666666", size: "sm", align: "center", margin: "md" }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "button",
          style: "primary",
          color: "#4CAF50",
          action: {
            type: "uri",
            label: "綁定名稱",
            uri: `https://liff.line.me/${process.env.VITE_LIFF_ID}?page=bind`
          }
        }
      ]
    }
  };
}

function getNotificationFlex() {
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        { type: "text", text: "⚙️ 個人化通知設定", weight: "bold", size: "lg", align: "center" }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "button",
          style: "primary",
          action: {
            type: "uri",
            label: "前往設定",
            uri: `https://liff.line.me/${process.env.VITE_LIFF_ID}?page=notify`
          }
        }
      ]
    }
  };
}
