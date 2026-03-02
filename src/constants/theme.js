export const theme = {
  bg: "#0a0a0f",
  surface: "#13131a",
  card: "#1a1a24",
  border: "#2a2a3a",
  accent: "#7c3aed",
  accent2: "#06b6d4",
  accent3: "#f59e0b",
  accent4: "#10b981",
  text: "#f0f0ff",
  muted: "#6b6b8a",
  danger: "#ef4444",
};

export const icons = {
  tasks: "📋", health: "💪", budget: "💸", report: "🤖",
  add: "+", check: "✓", trash: "✕", timer: "⏱",
  home: "⌂", water: "💧", sleep: "🌙", steps: "👟",
  food: "🍱", coin: "🪙", warning: "⚠", spark: "✨",
  fire: "🔥", back: "←"
};

export const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${theme.bg}; color: ${theme.text}; font-family: 'Space Grotesk', sans-serif; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${theme.bg}; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 2px; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .header { padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid ${theme.border}; position: sticky; top: 0; background: ${theme.bg}; z-index: 100; }
  .logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; background: linear-gradient(135deg, #7c3aed, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .content { flex: 1; padding: 20px; max-width: 480px; margin: 0 auto; width: 100%; padding-bottom: 90px; }
  .nav { position: fixed; bottom: 0; left: 0; right: 0; background: ${theme.surface}; border-top: 1px solid ${theme.border}; display: flex; z-index: 100; }
  .nav-btn { flex: 1; padding: 12px 4px 14px; display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; color: ${theme.muted}; cursor: pointer; font-size: 10px; font-family: inherit; transition: color 0.2s; }
  .nav-btn.active { color: ${theme.accent}; }
  .nav-btn span:first-child { font-size: 20px; }
  .card { background: ${theme.card}; border: 1px solid ${theme.border}; border-radius: 16px; padding: 18px; margin-bottom: 14px; }
  .card-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: ${theme.muted}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
  .btn { padding: 10px 18px; border-radius: 10px; border: none; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-primary { background: ${theme.accent}; color: white; }
  .btn-primary:hover { background: #6d28d9; transform: translateY(-1px); }
  .btn-outline { background: transparent; color: ${theme.text}; border: 1px solid ${theme.border}; }
  .btn-outline:hover { border-color: ${theme.accent}; color: ${theme.accent}; }
  .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 8px; }
  .btn-danger { background: ${theme.danger}; color: white; }
  .input { width: 100%; padding: 10px 14px; background: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 10px; color: ${theme.text}; font-family: inherit; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .input:focus { border-color: ${theme.accent}; }
  .input::placeholder { color: ${theme.muted}; }
  .select { appearance: none; cursor: pointer; }
  .tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .tag-purple { background: #7c3aed22; color: #a78bfa; border: 1px solid #7c3aed44; }
  .tag-cyan { background: #06b6d422; color: #67e8f9; border: 1px solid #06b6d444; }
  .tag-amber { background: #f59e0b22; color: #fcd34d; border: 1px solid #f59e0b44; }
  .tag-green { background: #10b98122; color: #6ee7b7; border: 1px solid #10b98144; }
  .tag-red { background: #ef444422; color: #fca5a5; border: 1px solid #ef444444; }
  .row { display: flex; align-items: center; gap: 10px; }
  .row-between { display: flex; align-items: center; justify-content: space-between; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-box { background: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 12px; padding: 14px; text-align: center; }
  .stat-val { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; }
  .stat-lbl { font-size: 11px; color: ${theme.muted}; margin-top: 2px; }
  .section-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 18px; }
  .task-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 0; border-bottom: 1px solid ${theme.border}; }
  .task-item:last-child { border-bottom: none; padding-bottom: 0; }
  .check-btn { width: 22px; height: 22px; border-radius: 6px; border: 2px solid ${theme.border}; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; margin-top: 1px; transition: all 0.2s; }
  .check-btn.done { background: ${theme.accent4}; border-color: ${theme.accent4}; color: white; }
  .task-name { font-size: 14px; flex: 1; line-height: 1.4; }
  .task-name.done { text-decoration: line-through; color: ${theme.muted}; }
  .del-btn { background: none; border: none; color: ${theme.muted}; cursor: pointer; font-size: 14px; padding: 2px 6px; border-radius: 6px; transition: color 0.2s; }
  .del-btn:hover { color: ${theme.danger}; }
  .timer-display { font-family: 'Syne', sans-serif; font-size: 52px; font-weight: 800; text-align: center; letter-spacing: -2px; margin: 10px 0; }
  .progress-bar { height: 6px; background: ${theme.border}; border-radius: 3px; overflow: hidden; margin-top: 6px; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }
  .habit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .habit-btn { padding: 14px 8px; background: ${theme.surface}; border: 2px solid ${theme.border}; border-radius: 12px; cursor: pointer; text-align: center; font-family: inherit; color: ${theme.muted}; font-size: 11px; font-weight: 600; transition: all 0.2s; }
  .habit-btn.done { border-color: ${theme.accent4}; color: ${theme.accent4}; background: #10b98111; }
  .ai-response { background: ${theme.surface}; border: 1px solid ${theme.accent}44; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.7; white-space: pre-wrap; margin-top: 14px; max-height: 400px; overflow-y: auto; }
  .loading-dots::after { content: '...'; animation: dots 1.2s infinite; }
  @keyframes dots { 0%,20%{content:'.'} 40%,60%{content:'..'} 80%,100%{content:'...'} }
  .expense-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid ${theme.border}; font-size: 14px; }
  .expense-item:last-child { border-bottom: none; }
  .amount-neg { color: #fca5a5; font-weight: 700; }
  .amount-pos { color: #6ee7b7; font-weight: 700; }
  .streak { display: flex; align-items: center; gap: 6px; font-size: 13px; color: ${theme.accent3}; font-weight: 600; }
  textarea.input { resize: none; }
  .modal-overlay { position: fixed; inset: 0; background: #000000bb; z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
  .modal { background: ${theme.card}; border-radius: 20px 20px 0 0; padding: 24px 20px 36px; width: 100%; max-width: 480px; border-top: 1px solid ${theme.border}; }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; margin-bottom: 16px; }
  .pill-group { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
  .pill { padding: 6px 14px; border-radius: 20px; border: 1px solid ${theme.border}; background: none; color: ${theme.muted}; font-family: inherit; font-size: 12px; cursor: pointer; transition: all 0.2s; }
  .pill.active { background: ${theme.accent}; color: white; border-color: ${theme.accent}; }
  .days-left { font-size: 12px; color: ${theme.muted}; }
  .days-left.urgent { color: #fca5a5; }
`;

export const today = () => new Date().toISOString().split("T")[0];
export const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
export const daysLeft = (date) => {
  if (!date) return null;
  const diff = Math.ceil((new Date(date) - new Date()) / 86400000);
  return diff;
};
