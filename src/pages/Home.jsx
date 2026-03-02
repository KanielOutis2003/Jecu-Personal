import { theme, daysLeft, today } from "../constants/theme";
import { Card } from "../components/ui/Card";

export default function Home({ onTabChange }) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const todayKey = `health_${today()}`;
  const health = JSON.parse(localStorage.getItem(todayKey) || '{"water":0,"habits":{}}');
  const monthKey = `budget_${today().slice(0, 7)}`;
  const budget = JSON.parse(localStorage.getItem(monthKey) || '{"allowance":0,"expenses":[]}');
  const logs = JSON.parse(localStorage.getItem("ojt_logs") || "[]");

  const pending = tasks.filter(t => !t.done).length;
  const urgent = tasks.filter(t => !t.done && t.due && daysLeft(t.due) <= 2).length;
  const spent = budget.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget.allowance - spent;
  const habits = Object.values(health.habits).filter(Boolean).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: theme.muted, marginBottom: 4 }}>{greeting} 👋</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800 }}>Student Survival</div>
      </div>

      {urgent > 0 && (
        <div style={{ background: "#ef444411", border: `1px solid ${theme.danger}44`, borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#fca5a5" }}>
          ⚠️ You have {urgent} urgent task{urgent > 1 ? "s" : ""} due soon!
        </div>
      )}

      <div className="grid2" style={{ marginBottom: 14 }}>
        {[
          { label: "Pending Tasks", val: pending, color: theme.accent, tab: "tasks", emoji: "📋" },
          { label: "OJT Days", val: logs.length, color: theme.accent2, tab: "report", emoji: "🤖" },
          { label: "Habits Done", val: `${habits}/6`, color: theme.accent4, tab: "health", emoji: "💪" },
          { label: "Budget Left", val: `₱${Math.abs(remaining).toFixed(0)}`, color: remaining >= 0 ? theme.accent4 : theme.danger, tab: "budget", emoji: "💸" },
        ].map(s => (
          <button key={s.tab} className="stat-box" style={{ cursor: "pointer", border: `1px solid ${s.color}33`, textAlign: "left", background: theme.card }} onClick={() => onTabChange(s.tab)}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.emoji}</div>
            <div className="stat-val" style={{ color: s.color, fontSize: 22 }}>{s.val}</div>
            <div className="stat-lbl">{s.label}</div>
          </button>
        ))}
      </div>

      <Card title="Today's Focus">
        {tasks.filter(t => !t.done).slice(0, 3).map(t => (
          <div key={t.id} style={{ padding: "8px 0", borderBottom: `1px solid ${theme.border}`, fontSize: 14, display: "flex", gap: 8, alignItems: "center" }}>
            <span>•</span>
            <span>{t.name}</span>
            {t.due && daysLeft(t.due) <= 2 && <span className="tag tag-red" style={{ fontSize: 10 }}>urgent</span>}
          </div>
        ))}
        {tasks.filter(t => !t.done).length === 0 && (
          <div style={{ color: theme.muted, fontSize: 14 }}>No pending tasks! 🎉</div>
        )}
      </Card>

      <div className="card" style={{ background: `linear-gradient(135deg, ${theme.accent}22, ${theme.accent2}11)`, border: `1px solid ${theme.accent}33` }}>
        <div style={{ fontSize: 13, color: theme.muted, marginBottom: 6 }}>Quick Actions</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-outline btn-sm" onClick={() => onTabChange("report")}>📝 Log OJT Day</button>
          <button className="btn btn-outline btn-sm" onClick={() => onTabChange("budget")}>💸 Add Expense</button>
          <button className="btn btn-outline btn-sm" onClick={() => onTabChange("tasks")}>+ New Task</button>
        </div>
      </div>
    </div>
  );
}
