export const theme = {
  accent: "#8b5cf6",
  accent2: "#06b6d4",
  accent3: "#f59e0b",
  accent4: "#10b981",
  danger: "#ef4444",
};

export const icons = {
  tasks: "📋", health: "💪", budget: "💸", report: "🤖",
  add: "+", check: "✓", trash: "✕", timer: "⏱",
  home: "⌂", water: "💧", sleep: "🌙", steps: "👟",
  food: "🍱", coin: "🪙", warning: "⚠", spark: "✨",
  fire: "🔥", back: "←", user: "👤", logout: "🚪",
  bell: "🔔", mail: "📧", sun: "☀️", moon: "🌙"
};

export const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
  
  :root {
    --bg: #0a0a0f;
    --surface: rgba(19, 19, 26, 0.9);
    --card: rgba(30, 30, 45, 0.7);
    --border: rgba(255, 255, 255, 0.12);
    --text: #ffffff;
    --muted: #a1a1aa;
    --glass: backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    --shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5);
    --accent-gradient: linear-gradient(135deg, #8b5cf6, #06b6d4);
    --card-gradient: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
    --bg-gradient: radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
                   radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.08) 0%, transparent 50%);
  }

  [data-theme='light'] {
    --bg: #f8fafc;
    --surface: rgba(255, 255, 255, 0.9);
    --card: rgba(255, 255, 255, 0.8);
    --border: rgba(0, 0, 0, 0.08);
    --text: #0f172a;
    --muted: #64748b;
    --glass: backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    --shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.05);
    --card-gradient: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.5) 100%);
    --bg-gradient: radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
                   radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.05) 0%, transparent 50%);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  
  body { 
    background: var(--bg); 
    color: var(--text); 
    font-family: 'Plus Jakarta Sans', sans-serif;
    background-image: var(--bg-gradient);
    background-attachment: fixed;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    transition: background 0.3s ease, color 0.3s ease;
  }

  ::-webkit-scrollbar { width: 6px; } 
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
  
  .app { 
    min-height: 100vh; 
    display: flex; 
    flex-direction: column;
    max-width: 100%;
    overflow-x: hidden;
  }

  .header { 
    padding: 16px 20px; 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    border-bottom: 1px solid var(--border); 
    position: sticky; 
    top: 0; 
    background: var(--surface);
    var(--glass);
    z-index: 100; 
  }

  .logo { 
    font-family: 'Syne', sans-serif; 
    font-size: 22px; 
    font-weight: 800; 
    background: var(--accent-gradient);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent; 
    letter-spacing: -0.8px;
  }

  .content { 
    flex: 1; 
    padding: 24px 16px; 
    max-width: 600px; 
    margin: 0 auto; 
    width: 100%; 
    padding-bottom: 100px; 
  }

  .nav { 
    position: fixed; 
    bottom: 20px; 
    left: 16px; 
    right: 20px;
    background: var(--surface); 
    border: 1px solid var(--border);
    border-radius: 20px;
    display: flex; 
    padding: 6px;
    gap: 4px;
    var(--glass);
    box-shadow: var(--shadow);
    z-index: 100; 
    max-width: 500px;
    margin: 0 auto;
  }

  .nav-btn { 
    flex: 1;
    padding: 10px 4px; 
    display: flex; 
    flex-direction: column;
    align-items: center; 
    gap: 4px; 
    background: none; 
    border: none; 
    color: var(--muted); 
    cursor: pointer; 
    font-size: 11px; 
    font-weight: 600;
    font-family: inherit; 
    transition: all 0.2s ease;
    border-radius: 14px;
  }

  .nav-btn span:first-child {
    font-size: 18px;
  }

  .nav-btn.active { 
    color: var(--text); 
    background: rgba(139, 92, 246, 0.25);
  }

  .card { 
    background: var(--card); 
    background-image: var(--card-gradient);
    border: 1px solid var(--border); 
    border-radius: 20px; 
    padding: 20px; 
    margin-bottom: 16px; 
    var(--glass);
    box-shadow: var(--shadow);
  }
  
  .card-title { 
    font-family: 'Syne', sans-serif; 
    font-size: 12px; 
    font-weight: 700; 
    color: var(--muted); 
    text-transform: uppercase; 
    letter-spacing: 1.2px; 
    margin-bottom: 16px; 
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn { 
    padding: 12px 20px; 
    border-radius: 12px; 
    border: none; 
    font-family: inherit; 
    font-size: 14px; 
    font-weight: 700; 
    cursor: pointer; 
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-primary { 
    background: var(--accent-gradient); 
    color: white; 
  }
  
  .btn-primary:active { transform: scale(0.96); }

  .btn-outline { 
    background: var(--surface); 
    color: var(--text); 
    border: 1px solid var(--border); 
  }

  .input { 
    width: 100%; 
    padding: 12px 16px; 
    background: var(--surface); 
    border: 1px solid var(--border); 
    border-radius: 12px; 
    color: var(--text); 
    font-family: inherit; 
    font-size: 16px; /* Prevents iOS zoom on focus */
    outline: none; 
  }
  
  .input:focus { border-color: ${theme.accent}; }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: transform 0.2s ease;
  }
  
  .stat-card:active { transform: scale(0.98); }

  .stat-label { font-size: 12px; color: var(--muted); font-weight: 600; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; }

  .row-between { display: flex; align-items: center; justify-content: space-between; }
  .row { display: flex; align-items: center; gap: 8px; }

  .section-header {
    margin-bottom: 20px;
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 4px;
  }

  .section-subtitle {
    font-size: 14px;
    color: var(--muted);
  }

  @media (max-width: 480px) {
    .content { padding: 20px 12px; }
    .stat-value { font-size: 20px; }
    .logo { font-size: 20px; }
  }
`;

export const today = () => new Date().toISOString().split("T")[0];
export const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const daysLeft = (date) => {
  if (!date) return null;
  const diff = Math.ceil((new Date(date) - new Date()) / 86400000);
  return diff;
};
