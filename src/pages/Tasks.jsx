import { useState } from "react";
import { theme, icons, daysLeft } from "../constants/theme";
import { useTasks } from "../hooks/useTasks";
import { callGemini } from "../lib/gemini";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Tag } from "../components/ui/Tag";
import AIResponse from "../components/AIResponse";

export default function Tasks() {
  const { tasks, loading: dataLoading, addTask, toggleTask, removeTask } = useTasks();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "project", due: "", priority: "medium", email_notifications: true });
  const [aiTip, setAiTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  if (dataLoading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: theme.muted }}>
        <span className="loading-dots">Loading tasks</span>
      </div>
    );
  }

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addTask(form);
    setForm({ name: "", type: "project", due: "", priority: "medium", email_notifications: true });
    setModal(false);
  };

  const getAiTip = async () => {
    setLoading(true);
    const pending = tasks.filter(t => !t.done);
    if (pending.length === 0) { setAiTip("You have no pending tasks! Take a break 🎉"); setLoading(false); return; }
    const tip = await callGemini(
      `I'm a student with these pending tasks: ${pending.map(t => `"${t.name}" (due: ${t.due || "no date"}, priority: ${t.priority})`).join(", ")}. Give me a short prioritization advice and one productivity tip. Max 3 sentences.`
    );
    setAiTip(tip);
    setLoading(false);
  };

  const filtered = tasks.filter(t => filter === "all" ? true : filter === "done" ? t.done : !t.done);
  const priorityColor = { high: "red", medium: "amber", low: "green" };
  const typeColor = { project: "purple", ojt: "cyan", assignment: "amber" };
  const done = tasks.filter(t => t.done).length;

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 18 }}>
        <div className="section-title" style={{ margin: 0 }}>{icons.tasks} Tasks</div>
        <Button size="sm" onClick={() => setModal(true)}>+ Add Task</Button>
      </div>

      <div className="grid2" style={{ marginBottom: 14 }}>
        <div className="stat-box">
          <div className="stat-val" style={{ color: theme.accent }}>{tasks.length - done}</div>
          <div className="stat-lbl">Pending</div>
        </div>
        <div className="stat-box">
          <div className="stat-val" style={{ color: theme.accent4 }}>{done}</div>
          <div className="stat-lbl">Done</div>
        </div>
      </div>

      <Card>
        <div className="pill-group" style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {["all", "pending", "done"].map(f => (
            <Button 
              key={f} 
              variant={filter === f ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              style={{ borderRadius: "20px", fontSize: "12px", padding: "6px 16px" }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--muted)", padding: "20px 0", fontSize: 14 }}>No tasks here!</div>
        ) : filtered.map(t => {
          const dl = daysLeft(t.due);
          return (
            <div key={t.id} className="task-item" style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
              <Button 
                variant={t.done ? "primary" : "outline"}
                size="sm"
                onClick={() => toggleTask(t.id)}
                style={{ width: "24px", height: "24px", minWidth: "24px", padding: 0, borderRadius: "6px" }}
              >
                {t.done ? icons.check : ""}
              </Button>
              <div style={{ flex: 1, marginLeft: "12px" }}>
                <div className={`task-name ${t.done ? "done" : ""}`} style={{ fontSize: "15px", fontWeight: "600", textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--muted)" : "var(--text)" }}>{t.name}</div>
                <div className="row" style={{ marginTop: 6, flexWrap: "wrap", gap: 6 }}>
                  <Tag color={typeColor[t.type]}>{t.type}</Tag>
                  <Tag color={priorityColor[t.priority]}>{t.priority}</Tag>
                  {t.email_notifications && (
                    <span style={{ fontSize: "11px", color: theme.accent4, display: "flex", alignItems: "center", gap: "4px" }}>
                      {icons.mail} notified
                    </span>
                  )}
                  {t.due && (
                    <span className={`days-left ${dl !== null && dl <= 2 ? "urgent" : ""}`} style={{ fontSize: "11px", color: dl !== null && dl <= 2 ? theme.danger : "var(--muted)", fontWeight: "600" }}>
                      {dl === 0 ? "⚠ Due today!" : dl < 0 ? "⚠ Overdue!" : `${dl}d left`}
                    </span>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => removeTask(t.id)}
                style={{ color: theme.danger, padding: "6px", borderRadius: "8px" }}
              >
                {icons.trash}
              </Button>
            </div>
          );
        })}
      </Card>

      <Button variant="outline" style={{ width: "100%", marginBottom: 10 }} onClick={getAiTip} disabled={loading}>
        {loading ? <span className="loading-dots">Getting AI tip</span> : `${icons.spark} AI Prioritization Tip`}
      </Button>
      <AIResponse content={aiTip} loading={loading} />

      <Modal isOpen={modal} onClose={() => setModal(false)} title="New Task">
        <Input placeholder="Task name..." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 10 }} />
        <div className="grid2" style={{ marginBottom: 10 }}>
          <select className="input select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="project">Project</option>
            <option value="ojt">OJT</option>
            <option value="assignment">Assignment</option>
          </select>
          <select className="input select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
        <Input type="date" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} style={{ marginBottom: 14 }} />
        
        <div className="row" style={{ marginBottom: 14, background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "12px" }}>
          <input 
            type="checkbox" 
            id="email_notify"
            checked={form.email_notifications} 
            onChange={e => setForm({ ...form, email_notifications: e.target.checked })}
            style={{ width: "18px", height: "18px", accentColor: theme.accent }}
          />
          <label htmlFor="email_notify" style={{ fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            {icons.mail} Send email notification
          </label>
        </div>

        <div className="row" style={{ gap: 10 }}>
          <Button variant="outline" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</Button>
          <Button style={{ flex: 1 }} onClick={handleAdd}>Add Task</Button>
        </div>
      </Modal>
    </div>
  );
}
