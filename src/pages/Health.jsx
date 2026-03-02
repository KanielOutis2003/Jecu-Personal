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
  const { health, loading: dataLoading, updateHealth, toggleHabit, addMeal, removeMeal } = useHealth();
  const [aiTip, setAiTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [mealInput, setMealInput] = useState("");

  if (dataLoading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: theme.muted }}>
        <span className="loading-dots">Loading health logs</span>
      </div>
    );
  }

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

  return (
    <div>
      <div className="section-title">{icons.health} Health</div>

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
        <div className="habit-grid">
          {habitsList.map(h => (
            <button key={h.key} className={`habit-btn ${health.habits[h.key] ? "done" : ""}`} onClick={() => toggleHabit(h.key)}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{h.emoji}</div>
              {h.label}
            </button>
          ))}
        </div>
      </Card>

      <Card title={`${icons.food} Meals Today`}>
        <div className="row" style={{ marginBottom: 10 }}>
          <Input placeholder="e.g. rice + chicken" value={mealInput} onChange={e => setMealInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddMeal()} />
          <Button size="sm" style={{ flexShrink: 0 }} onClick={handleAddMeal}>Add</Button>
        </div>
        {(health.meals || []).map((m, i) => (
          <div key={i} style={{ fontSize: 13, padding: "5px 0", borderBottom: `1px solid ${theme.border}`, color: theme.muted }}>
            🍽 {m} <button className="del-btn" onClick={() => removeMeal(i)}>✕</button>
          </div>
        ))}
      </Card>

      <Button variant="outline" style={{ width: "100%", marginBottom: 10 }} onClick={getHealthTip} disabled={loading}>
        {loading ? <span className="loading-dots">Getting tips</span> : `${icons.spark} AI Health Tips`}
      </Button>
      <AIResponse content={aiTip} loading={loading} />
    </div>
  );
}
