import * as line from '@line/bot-sdk';

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const events = req.body.events;
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text.trim();

        // 🟢 指令：菇
        if (text === '菇') {
          const mushroomFlex: line.FlexMessage = {
            type: "flex", altText: "🍄 招募面板",
            contents: {
              type: "bubble", size: "kilo",
              body: {
                type: "box", layout: "vertical", paddingAll: "24px",
                contents: [
                  { type: "text", text: "Mushroom Task", weight: "bold", size: "sm", color: "#9CA3AF" },
                  { type: "text", text: "招募面板", weight: "bold", size: "xxl", color: "#111827", margin: "sm" },
                  {
                    type: "box", layout: "vertical", margin: "xxl", spacing: "md",
                    contents: [
                      { type: "button", style: "primary", color: "#111827", action: { type: "uri", label: "發起招募", uri: `https://liff.line.me/${process.env.VITE_LIFF_ID}?page=recruit` } },
                      { type: "button", style: "secondary", color: "#F3F4F6", action: { type: "uri", label: "手動計時", uri: `https://liff.line.me/${process.env.VITE_LIFF_ID}?page=timer` } }
                    ]
                  }
                ]
              }
            }
          };
          await client.replyMessage(event.replyToken, [mushroomFlex]);
        }

        // 🟢 指令：通知
        if (text === '通知') {
          const notifyFlex: line.FlexMessage = {
            type: "flex", altText: "⚙️ 通知設定",
            contents: {
              type: "bubble", size: "kilo",
              body: {
                type: "box", layout: "vertical", paddingAll: "24px",
                contents: [
                  { type: "text", text: "Settings", weight: "bold", size: "sm", color: "#9CA3AF" },
                  { type: "text", text: "通知設定", weight: "bold", size: "xxl", color: "#111827", margin: "sm" },
                  {
                    type: "box", layout: "vertical", margin: "xxl",
                    contents: [
                      { type: "button", style: "primary", color: "#111827", action: { type: "uri", label: "管理個人設定", uri: `https://liff.line.me/${process.env.VITE_LIFF_ID}?page=notify` } }
                    ]
                  }
                ]
              }
            }
          };
          await client.replyMessage(event.replyToken, [notifyFlex]);
        }
      }
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).end();
  }
}
