import { useState } from "react";
import { theme, icons } from "../constants/theme";
import { useHealth } from "../hooks/useHealth";
import { callGemini } from "../lib/gemini";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { ProgressBar } from "../components/ui/ProgressBar";
import AIResponse from "../components/AIResponse";

export default function Health() {
  const { health, logs, loading: dataLoading, updateHealth, toggleHabit, addMeal, removeMeal } = useHealth();
  const [aiTip, setAiTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [mealInput, setMealInput] = useState("");

  if (dataLoading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
        <span className="loading-dots">Loading health logs</span>
      </div>
    );
  }

  // Calendar logic
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const getStatusForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const log = logs.find(l => l.date === dateStr);
    if (!log) return "none";
    const habitCount = Object.values(log.habits || {}).filter(Boolean).length;
    if (log.water >= 8 && habitCount >= 4) return "excellent";
    if (log.water >= 4 || habitCount >= 2) return "good";
    return "logged";
  };

  const habitsList = [
    { key: "exercise", label: "Exercise", emoji: "🏃" },
    { key: "vitamins", label: "Vitamins", emoji: "💊" },
    { key: "stretch", label: "Stretch", emoji: "🧘" },
    { key: "noJunk", label: "No Junk", emoji: "🥗" },
    { key: "sleep8", label: "8hrs Sleep", emoji: "😴" },
    { key: "outside", label: "Outside", emoji: "🌤" },
  ];

  const handleAddMeal = () => {
    if (!mealInput.trim()) return;
    addMeal(mealInput);
    setMealInput("");
  };

  const waterPct = Math.min((health.water / 8) * 100, 100);
  const doneHabits = Object.values(health.habits).filter(Boolean).length;

  const getHealthTip = async () => {
    setLoading(true);
    const tip = await callGemini(
      `Student health check: water glasses today: ${health.water}/8, sleep hours: ${health.sleep}, steps: ${health.steps}, habits done: ${doneHabits}/6, meals: ${(health.meals || []).join(", ") || "none logged"}. Give 2 short, specific health tips for today. Be encouraging.`
    );
    setAiTip(tip);
    setLoading(false);
  };

  const sendAIReminders = async () => {
    setLoading(true);
    const plan = await callGemini(
      `Based on my current health stats (Water: ${health.water}/8, Sleep: ${health.sleep}h, Steps: ${health.steps}), create a personalized hourly reminder schedule for the rest of my day. Include reminders for drinking water, jogging if steps are low, and specific meal times.`,
      "You are a health coach. Create a clear schedule. Format it as an email draft."
    );
    setAiTip(`📧 Sending to your email...\n\n${plan}`);
    
    // In a real implementation, this would call a Supabase Edge Function to send the email
    // For now, we simulate the success
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div>
      <div className="section-title">{icons.health} Health</div>

      <Card title="Monthly Progress">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", color: "var(--muted)", marginBottom: "12px" }}>
          {["S", "M", "T", "W", "T", "F", "S"].map(d => <div key={d} style={{ fontWeight: "700" }}>{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const status = getStatusForDay(day);
            const isToday = day === todayDate.getDate();
            return (
              <div 
                key={day} 
                style={{ 
                  height: "32px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: isToday ? "800" : "500",
                  background: status === "excellent" ? theme.accent4 : 
                              status === "good" ? `${theme.accent4}66` :
                              status === "logged" ? "var(--border)" : "transparent",
                  color: status !== "none" ? "white" : "var(--text)",
                  border: isToday ? `2px solid ${theme.accent}` : "none"
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="row" style={{ gap: "12px", justifyContent: "center", fontSize: "11px", color: "var(--muted)" }}>
          <div className="row"><div style={{ width: 8, height: 8, borderRadius: 2, background: theme.accent4 }}></div> Excellent</div>
          <div className="row"><div style={{ width: 8, height: 8, borderRadius: 2, background: `${theme.accent4}66` }}></div> Good</div>
          <div className="row"><div style={{ width: 8, height: 8, borderRadius: 2, background: "var(--border)" }}></div> Logged</div>
        </div>
      </Card>

      <Card title={`${icons.water} Water Today`}>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 28, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: theme.accent2 }}>{health.water}<span style={{ fontSize: 14, color: theme.muted }}>/8 glasses</span></span>
          <div className="row">
            <Button variant="outline" size="sm" onClick={() => updateHealth({ water: Math.max(0, health.water - 1) })}>-</Button>
            <Button size="sm" onClick={() => updateHealth({ water: health.water + 1 })}>+</Button>
          </div>
        </div>
        <ProgressBar pct={waterPct} color={theme.accent2} />
      </Card>

      <div className="grid2" style={{ marginBottom: 14 }}>
        <Card title={`${icons.sleep} Sleep (hrs)`} style={{ margin: 0 }}>
          <Input type="number" min="0" max="24" value={health.sleep} onChange={e => updateHealth({ sleep: +e.target.value })} style={{ textAlign: "center", fontSize: 24, fontFamily: "'Syne', sans-serif", fontWeight: 800 }} />
        </Card>
        <Card title={`${icons.steps} Steps`} style={{ margin: 0 }}>
          <Input type="number" min="0" value={health.steps} onChange={e => updateHealth({ steps: +e.target.value })} style={{ textAlign: "center", fontSize: 22, fontFamily: "'Syne', sans-serif", fontWeight: 800 }} />
        </Card>
      </div>

      <Card title={`Daily Habits (${doneHabits}/6)`}>
        <div className="habit-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {habitsList.map(h => (
            <Button 
              key={h.key} 
              variant={health.habits[h.key] ? "primary" : "outline"}
              onClick={() => toggleHabit(h.key)}
              style={{ height: "80px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px" }}
            >
              <div style={{ fontSize: 22 }}>{h.emoji}</div>
              {h.label}
            </Button>
          ))}
        </div>
      </Card>

      <Card title={`${icons.food} Meals Today`}>
        <div className="row" style={{ marginBottom: 10 }}>
          <Input placeholder="e.g. rice + chicken" value={mealInput} onChange={e => setMealInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddMeal()} />
          <Button size="sm" style={{ flexShrink: 0 }} onClick={handleAddMeal}>Add</Button>
        </div>
        {(health.meals || []).map((m, i) => (
          <div key={i} style={{ fontSize: "14px", padding: "12px 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="row">
              <span>🍱</span>
              <span style={{ fontWeight: "500" }}>{m}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => removeMeal(i)}
              style={{ color: theme.danger, padding: "4px", minWidth: "32px" }}
            >
              ✕
            </Button>
          </div>
        ))}
      </Card>

      <Card title="Notifications">
        <div className="row" style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "12px" }}>
          <input 
            type="checkbox" 
            id="health_notify"
            checked={health.email_notifications} 
            onChange={e => updateHealth({ email_notifications: e.target.checked })}
            style={{ width: "18px", height: "18px", accentColor: theme.accent }}
          />
          <label htmlFor="health_notify" style={{ fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            {icons.mail} Enable health email reminders
          </label>
        </div>
      </Card>

      <Card title="AI Health Coach">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
          <Button variant="outline" onClick={getHealthTip} disabled={loading}>
            {loading ? "Analyzing..." : `${icons.spark} Quick Tips`}
          </Button>
          <Button onClick={sendAIReminders} disabled={loading}>
            {loading ? "Processing..." : `${icons.mail} Email Plan`}
          </Button>
        </div>
        <AIResponse content={aiTip} loading={loading} />
      </Card>
    </div>
  );
}
