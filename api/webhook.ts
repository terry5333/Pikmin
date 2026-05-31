function getMushroomPanelFlex(): line.FlexBubble {
  return {
    type: "bubble",
    size: "kilo",
    header: {
      type: "box", layout: "vertical", backgroundColor: "#EF4444", paddingAll: "12px",
      contents: [
        { type: "text", text: "🍄 蘑菇任務中心", color: "#ffffff", weight: "bold", size: "md", align: "center" }
      ]
    },
    body: {
      type: "box", layout: "vertical", paddingAll: "20px", spacing: "md", backgroundColor: "#ffffff",
      contents: [
        { type: "text", text: "請選擇要執行的動作", size: "sm", color: "#6B7280", align: "center" }
      ]
    },
    footer: {
      type: "box", layout: "vertical", paddingAll: "16px", spacing: "sm",
      contents: [
        {
          type: "button", style: "primary", color: "#EF4444", height: "sm",
          action: { type: "uri", label: "發起招募", uri: `https://liff.line.me/${process.env.VITE_LIFF_ID}?page=recruit` }
        },
        {
          type: "button", style: "secondary", color: "#E5E7EB", height: "sm",
          action: { type: "uri", label: "手動計時器", uri: `https://liff.line.me/${process.env.VITE_LIFF_ID}?page=timer` }
        }
      ]
    }
  };
}

function getWelcomeFlex(): line.FlexBubble {
  return {
    type: "bubble",
    size: "kilo",
    header: {
      type: "box", layout: "vertical", backgroundColor: "#3B82F6", paddingAll: "12px",
      contents: [
        { type: "text", text: "👋 歡迎加入群組", color: "#ffffff", weight: "bold", size: "md", align: "center" }
      ]
    },
    body: {
      type: "box", layout: "vertical", paddingAll: "20px", backgroundColor: "#ffffff",
      contents: [
        { type: "text", text: "打菇前，請先建立你的檔案！", color: "#374151", weight: "bold", size: "sm", align: "center" }
      ]
    },
    footer: {
      type: "box", layout: "vertical", paddingAll: "16px",
      contents: [
        {
          type: "button", style: "primary", color: "#3B82F6", height: "sm",
          action: { type: "uri", label: "綁定遊戲名稱", uri: `https://liff.line.me/${process.env.VITE_LIFF_ID}?page=bind` }
        }
      ]
    }
  };
}

function getNotificationFlex(): line.FlexBubble {
  return {
    type: "bubble",
    size: "kilo",
    header: {
      type: "box", layout: "vertical", backgroundColor: "#8B5CF6", paddingAll: "12px",
      contents: [
        { type: "text", text: "⚙️ 系統設定", color: "#ffffff", weight: "bold", size: "md", align: "center" }
      ]
    },
    body: {
      type: "box", layout: "vertical", paddingAll: "20px", backgroundColor: "#ffffff",
      contents: [
        { type: "text", text: "太吵了嗎？來調整通知吧！", color: "#374151", weight: "bold", size: "sm", align: "center" }
      ]
    },
    footer: {
      type: "box", layout: "vertical", paddingAll: "16px",
      contents: [
        {
          type: "button", style: "primary", color: "#8B5CF6", height: "sm",
          action: { type: "uri", label: "前往設定", uri: `https://liff.line.me/${process.env.VITE_LIFF_ID}?page=notify` }
        }
      ]
    }
  };
}
