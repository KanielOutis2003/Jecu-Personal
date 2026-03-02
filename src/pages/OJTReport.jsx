import { useState } from "react";
import { theme, icons, today } from "../constants/theme";
import { useOJT } from "../hooks/useOJT";
import { callGemini } from "../lib/gemini";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Tag } from "../components/ui/Tag";
import AIResponse from "../components/AIResponse";

export default function OJTReport() {
  const { logs, loading: dataLoading, addLog, removeLog } = useOJT();
  const [form, setForm] = useState({ date: today(), activities: "", hours: 8 });
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("log"); // log | generate

  if (dataLoading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: theme.muted }}>
        <span className="loading-dots">Loading OJT logs</span>
      </div>
    );
  }

  const handleAddLog = () => {
    if (!form.activities.trim()) return;
    addLog(form);
    setForm({ date: today(), activities: "", hours: 8 });
  };

  const generateReport = async (type) => {
    if (logs.length === 0) { setReport("Please add some OJT daily logs first!"); return; }
    setLoading(true);
    setView("generate");
    const logsText = logs.map(l => `Date: ${l.date} (${l.hours}hrs)\nActivities: ${l.activities}`).join("\n\n");
    
    let prompt = "";
    if (type === "narrative") {
      prompt = `Based on my OJT daily logs, write a professional narrative report in paragraph form. Make it sound polished and professional for a student intern. Include an introduction, body describing the activities grouped by theme, and conclusion. 
      
Daily Logs:
${logsText}

Write approximately 300-400 words.`;
    } else if (type === "weekly") {
      prompt = `Based on my OJT logs, create a structured weekly accomplishment report with: 1) Summary of work done, 2) Key learnings, 3) Challenges encountered. Make it professional.

Daily Logs:
${logsText}`;
    } else {
      prompt = `Create a short OJT reflection essay (150-200 words) based on these activities. Focus on personal growth and learnings.

Daily Logs:
${logsText}`;
    }

    const result = await callGemini(prompt, "You are a professional report writer helping a student write their OJT (on-the-job training) reports. Write formally and professionally.");
    setReport(result);
    setLoading(false);
  };

  const totalHours = logs.reduce((s, l) => s + l.hours, 0);

  return (
    <div>
      <div className="section-title">{icons.report} OJT Reports</div>

      <div className="pill-group" style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <Button 
          variant={view === "log" ? "primary" : "outline"}
          size="sm"
          onClick={() => setView("log")}
          style={{ borderRadius: "20px", fontSize: "12px", padding: "6px 16px" }}
        >
          Daily Log
        </Button>
        <Button 
          variant={view === "generate" ? "primary" : "outline"}
          size="sm"
          onClick={() => setView("generate")}
          style={{ borderRadius: "20px", fontSize: "12px", padding: "6px 16px" }}
        >
          Generate Report
        </Button>
      </div>

      {view === "log" && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Days Logged</span>
              <span className="stat-value" style={{ color: theme.accent }}>{logs.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Hours</span>
              <span className="stat-value" style={{ color: theme.accent2 }}>{totalHours}</span>
            </div>
          </div>

          <Card title="Log Today's Activities">
            <div className="grid2" style={{ marginBottom: 10 }}>
              <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              <Input type="number" placeholder="Hours" min="1" max="12" value={form.hours} onChange={e => setForm({ ...form, hours: +e.target.value })} />
            </div>
            <Input as="textarea" rows={4} placeholder="What did you do today?..." value={form.activities} onChange={e => setForm({ ...form, activities: e.target.value })} style={{ marginBottom: 10 }} />
            <Button style={{ width: "100%" }} onClick={handleAddLog}>Save Log</Button>
          </Card>

          <Card title="Previous Logs">
            {logs.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--muted)", padding: "16px 0", fontSize: 14 }}>No logs yet!</div>
            ) : [...logs].reverse().slice(0, 5).map(l => (
              <div key={l.id} className="task-item" style={{ padding: "16px 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div className="row-between">
                    <Tag color="cyan">{l.date}</Tag>
                    <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: "600" }}>{l.hours}hrs</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>{l.activities.slice(0, 100)}{l.activities.length > 100 ? "..." : ""}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => removeLog(l.id)}
                  style={{ color: theme.danger, padding: "6px", borderRadius: "8px", marginLeft: "12px" }}
                >
                  ✕
                </Button>
              </div>
            ))}
          </Card>
        </>
      )}

      {view === "generate" && (
        <>
          <Card title="Generate AI Report">
            <p style={{ fontSize: 13, color: theme.muted, marginBottom: 14, lineHeight: 1.6 }}>
              Based on your {logs.length} logged days ({totalHours} hours), AI will write a professional report for you.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Button onClick={() => generateReport("narrative")} disabled={loading}>📝 Narrative Report</Button>
              <Button variant="outline" onClick={() => generateReport("weekly")} disabled={loading}>📊 Weekly Accomplishment Report</Button>
              <Button variant="outline" onClick={() => generateReport("reflection")} disabled={loading}>💭 Reflection Essay</Button>
            </div>
          </Card>

          <AIResponse content={report} loading={loading} />
          {report && !loading && (
            <div className="row-between" style={{ marginTop: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Generated Report</span>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(report)}>Copy</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
