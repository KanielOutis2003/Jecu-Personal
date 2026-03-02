import { useState } from "react";
import { theme, icons } from "../constants/theme";
import { useBudget } from "../hooks/useBudget";
import { callGemini } from "../lib/gemini";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Tag } from "../components/ui/Tag";
import AIResponse from "../components/AIResponse";

export default function Budget() {
  const { data, setAllowance, addExpense, removeExpense } = useBudget();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ label: "", amount: "", category: "food" });
  const [aiTip, setAiTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [editAllowance, setEditAllowance] = useState(false);
  const [tempAllowance, setTempAllowance] = useState(data.allowance);

  const totalSpent = data.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = data.allowance - totalSpent;
  const pct = data.allowance > 0 ? Math.min((totalSpent / data.allowance) * 100, 100) : 0;

  const handleAddExpense = () => {
    if (!form.label.trim() || !form.amount) return;
    addExpense(form);
    setForm({ label: "", amount: "", category: "food" });
    setModal(false);
  };

  const catColors = { food: "amber", transport: "cyan", school: "purple", other: "red" };

  const getBudgetTip = async () => {
    setLoading(true);
    const breakdown = data.expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
    const tip = await callGemini(
      `Student budget this month: allowance ₱${data.allowance}, spent ₱${totalSpent}, remaining ₱${remaining}. Spending breakdown: ${JSON.stringify(breakdown)}. Give 2 short money-saving tips specific to my spending pattern.`
    );
    setAiTip(tip);
    setLoading(false);
  };

  const budgetColor = pct > 90 ? theme.danger : pct > 70 ? theme.accent3 : theme.accent4;

  return (
    <div>
      <div className="section-title">{icons.budget} Budget</div>

      <Card title="This Month">
        <div className="row-between" style={{ marginBottom: 12 }}>
          <div className="card-title" style={{ margin: 0 }}>Overview</div>
          <Button variant="outline" size="sm" onClick={() => setEditAllowance(!editAllowance)}>
            {editAllowance ? "Save" : "Set Allowance"}
          </Button>
        </div>
        {editAllowance && (
          <Input type="number" placeholder="Monthly allowance (₱)" value={tempAllowance}
            onChange={e => setTempAllowance(e.target.value)}
            onBlur={() => { setAllowance(tempAllowance); setEditAllowance(false); }}
            style={{ marginBottom: 12 }} autoFocus />
        )}
        <div className="grid2" style={{ marginBottom: 12 }}>
          <div className="stat-box">
            <div className="stat-val" style={{ color: theme.accent3, fontSize: 20 }}>₱{totalSpent.toFixed(0)}</div>
            <div className="stat-lbl">Spent</div>
          </div>
          <div className="stat-box">
            <div className="stat-val" style={{ color: remaining >= 0 ? theme.accent4 : theme.danger, fontSize: 20 }}>₱{Math.abs(remaining).toFixed(0)}</div>
            <div className="stat-lbl">{remaining >= 0 ? "Remaining" : "Overspent!"}</div>
          </div>
        </div>
        <div className="row-between" style={{ marginBottom: 6, fontSize: 12, color: theme.muted }}>
          <span>Budget used</span><span>{pct.toFixed(0)}%</span>
        </div>
        <ProgressBar pct={pct} color={budgetColor} />
      </Card>

      <div className="row-between" style={{ marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Expenses</span>
        <Button size="sm" onClick={() => setModal(true)}>+ Add</Button>
      </div>

      <Card>
        {data.expenses.length === 0 ? (
          <div style={{ textAlign: "center", color: theme.muted, padding: "16px 0", fontSize: 14 }}>No expenses yet!</div>
        ) : [...data.expenses].reverse().map(e => (
          <div key={e.id} className="expense-item">
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{e.label}</div>
              <div className="row" style={{ gap: 6, marginTop: 4 }}>
                <Tag color={catColors[e.category]}>{e.category}</Tag>
                <span style={{ fontSize: 11, color: theme.muted }}>{e.date}</span>
              </div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span className="amount-neg">-₱{e.amount}</span>
              <button className="del-btn" onClick={() => removeExpense(e.id)}>✕</button>
            </div>
          </div>
        ))}
      </Card>

      <Button variant="outline" style={{ width: "100%", marginBottom: 10 }} onClick={getBudgetTip} disabled={loading}>
        {loading ? <span className="loading-dots">Analyzing</span> : `${icons.spark} AI Money Tips`}
      </Button>
      <AIResponse content={aiTip} loading={loading} />

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Expense">
        <Input placeholder="What did you spend on?" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} style={{ marginBottom: 10 }} />
        <Input type="number" placeholder="Amount (₱)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ marginBottom: 10 }} />
        <select className="input select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ marginBottom: 14 }}>
          <option value="food">🍱 Food</option>
          <option value="transport">🚌 Transport</option>
          <option value="school">📚 School</option>
          <option value="other">📦 Other</option>
        </select>
        <div className="row">
          <Button variant="outline" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</Button>
          <Button style={{ flex: 1 }} onClick={handleAddExpense}>Add</Button>
        </div>
      </Modal>
    </div>
  );
}
