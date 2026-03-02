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
  const [form, setForm] = useState({ name: "", type: "project", due: "", priority: "medium" });
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
    setForm({ name: "", type: "project", due: "", priority: "medium" });
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
        <div className="pill-group">
          {["all", "pending", "done"].map(f => (
            <button key={f} className={`pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: theme.muted, padding: "20px 0", fontSize: 14 }}>No tasks here!</div>
        ) : filtered.map(t => {
          const dl = daysLeft(t.due);
          return (
            <div key={t.id} className="task-item">
              <button className={`check-btn ${t.done ? "done" : ""}`} onClick={() => toggleTask(t.id)}>{t.done ? icons.check : ""}</button>
              <div style={{ flex: 1 }}>
                <div className={`task-name ${t.done ? "done" : ""}`}>{t.name}</div>
                <div className="row" style={{ marginTop: 6, flexWrap: "wrap", gap: 6 }}>
                  <Tag color={typeColor[t.type]}>{t.type}</Tag>
                  <Tag color={priorityColor[t.priority]}>{t.priority}</Tag>
                  {t.due && (
                    <span className={`days-left ${dl !== null && dl <= 2 ? "urgent" : ""}`}>
                      {dl === 0 ? "⚠ Due today!" : dl < 0 ? "⚠ Overdue!" : `${dl}d left`}
                    </span>
                  )}
                </div>
              </div>
              <button className="del-btn" onClick={() => removeTask(t.id)}>{icons.trash}</button>
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
        <div className="row" style={{ gap: 10 }}>
          <Button variant="outline" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</Button>
          <Button style={{ flex: 1 }} onClick={handleAdd}>Add Task</Button>
        </div>
      </Modal>
    </div>
  );
}
