export const theme = {
  bg: "#0a0a0f",
  surface: "rgba(19, 19, 26, 0.8)",
  card: "rgba(26, 26, 36, 0.6)",
  border: "rgba(255, 255, 255, 0.08)",
  accent: "#7c3aed",
  accent2: "#06b6d4",
  accent3: "#f59e0b",
  accent4: "#10b981",
  text: "#f0f0ff",
  muted: "#94a3b8",
  danger: "#ef4444",
  glass: "backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);",
  shadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
};

export const icons = {
  tasks: "📋", health: "💪", budget: "💸", report: "🤖",
  add: "+", check: "✓", trash: "✕", timer: "⏱",
  home: "⌂", water: "💧", sleep: "🌙", steps: "👟",
  food: "🍱", coin: "🪙", warning: "⚠", spark: "✨",
  fire: "🔥", back: "←", user: "👤", logout: "🚪"
};

export const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
  
  :root {
    --accent-gradient: linear-gradient(135deg, #7c3aed, #06b6d4);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    background: ${theme.bg}; 
    color: ${theme.text}; 
    font-family: 'Plus Jakarta Sans', sans-serif;
    background-image: 
      radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.05) 0%, transparent 50%);
    background-attachment: fixed;
  }

  ::-webkit-scrollbar { width: 6px; } 
  ::-webkit-scrollbar-track { background: ${theme.bg}; }
  ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
  
  .app { 
    min-height: 100vh; 
    display: flex; 
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header { 
    padding: 20px 24px; 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    border-bottom: 1px solid ${theme.border}; 
    position: sticky; 
    top: 0; 
    background: rgba(10, 10, 15, 0.8);
    ${theme.glass}
    z-index: 100; 
  }

  .logo { 
    font-family: 'Syne', sans-serif; 
    font-size: 24px; 
    font-weight: 800; 
    background: var(--accent-gradient);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent; 
    letter-spacing: -0.5px;
  }

  .content { 
    flex: 1; 
    padding: 32px 24px; 
    max-width: 800px; 
    margin: 0 auto; 
    width: 100%; 
    padding-bottom: 120px; 
  }

  .nav { 
    position: fixed; 
    bottom: 24px; 
    left: 50%; 
    transform: translateX(-50%);
    background: ${theme.surface}; 
    border: 1px solid ${theme.border};
    border-radius: 24px;
    display: flex; 
    padding: 8px;
    gap: 8px;
    ${theme.glass}
    box-shadow: ${theme.shadow};
    z-index: 100; 
    width: fit-content;
  }

  .nav-btn { 
    padding: 12px 20px; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
    background: none; 
    border: none; 
    color: ${theme.muted}; 
    cursor: pointer; 
    font-size: 14px; 
    font-weight: 500;
    font-family: inherit; 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 16px;
  }

  .nav-btn.active { 
    color: white; 
    background: rgba(124, 58, 237, 0.2);
    box-shadow: inset 0 0 0 1px rgba(124, 58, 237, 0.3);
  }

  .card { 
    background: ${theme.card}; 
    border: 1px solid ${theme.border}; 
    border-radius: 24px; 
    padding: 24px; 
    margin-bottom: 20px; 
    ${theme.glass}
    transition: transform 0.3s ease, border-color 0.3s ease;
  }
  
  .card:hover {
    border-color: rgba(124, 58, 237, 0.3);
  }

  .card-title { 
    font-family: 'Syne', sans-serif; 
    font-size: 13px; 
    font-weight: 700; 
    color: ${theme.muted}; 
    text-transform: uppercase; 
    letter-spacing: 1.5px; 
    margin-bottom: 20px; 
  }

  .btn { 
    padding: 12px 24px; 
    border-radius: 14px; 
    border: none; 
    font-family: inherit; 
    font-size: 14px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-primary { 
    background: var(--accent-gradient); 
    color: white; 
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  }
  
  .btn-primary:hover { 
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }

  .btn-outline { 
    background: rgba(255, 255, 255, 0.03); 
    color: ${theme.text}; 
    border: 1px solid ${theme.border}; 
  }
  
  .btn-outline:hover { 
    background: rgba(255, 255, 255, 0.08);
    border-color: ${theme.accent}; 
  }

  .input { 
    width: 100%; 
    padding: 14px 18px; 
    background: rgba(255, 255, 255, 0.03); 
    border: 1px solid ${theme.border}; 
    border-radius: 14px; 
    color: ${theme.text}; 
    font-family: inherit; 
    font-size: 15px; 
    outline: none; 
    transition: all 0.2s ease; 
  }
  
  .input:focus { 
    border-color: ${theme.accent}; 
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
  }

  .stat-box { 
    background: rgba(255, 255, 255, 0.02); 
    border: 1px solid ${theme.border}; 
    border-radius: 20px; 
    padding: 20px; 
    text-align: center; 
    transition: all 0.3s ease;
  }
  
  .stat-box:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateY(-2px);
  }

  .stat-val { 
    font-family: 'Syne', sans-serif; 
    font-size: 32px; 
    font-weight: 800; 
    letter-spacing: -1px;
  }

  .tag { 
    display: inline-flex; 
    align-items: center; 
    padding: 4px 12px; 
    border-radius: 10px; 
    font-size: 12px; 
    font-weight: 600; 
  }

  .modal-overlay { 
    position: fixed; 
    inset: 0; 
    background: rgba(0, 0, 0, 0.8); 
    backdrop-filter: blur(8px);
    z-index: 200; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    padding: 20px;
  }

  .modal { 
    background: #13131a; 
    border: 1px solid ${theme.border};
    border-radius: 28px; 
    padding: 32px; 
    width: 100%; 
    max-width: 440px; 
    box-shadow: ${theme.shadow};
  }

  @media (max-width: 768px) {
    .nav {
      bottom: 0;
      left: 0;
      right: 0;
      transform: none;
      width: 100%;
      border-radius: 24px 24px 0 0;
      padding: 12px 16px 24px;
      justify-content: space-around;
    }
    .nav-btn span:last-child { display: none; }
    .nav-btn { padding: 12px; border-radius: 12px; }
  }
`;

export const today = () => new Date().toISOString().split("T")[0];
export const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const daysLeft = (date) => {
  if (!date) return null;
  const diff = Math.ceil((new Date(date) - new Date()) / 86400000);
  return diff;
};
