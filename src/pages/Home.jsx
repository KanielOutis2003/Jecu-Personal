import { theme, daysLeft, icons } from "../constants/theme";
import { Card } from "../components/ui/Card";
import { useTasks } from "../hooks/useTasks";
import { useHealth } from "../hooks/useHealth";
import { useBudget } from "../hooks/useBudget";
import { useOJT } from "../hooks/useOJT";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  BarChart, Bar, Legend
} from 'recharts';
import { Button } from "../components/ui/Button";

export default function Home({ onTabChange }) {
  const { tasks, loading: tasksLoading } = useTasks();
  const { health, loading: healthLoading } = useHealth();
  const { data: budgetData, loading: budgetLoading } = useBudget();
  const { logs, loading: ojtLoading } = useOJT();

  const loading = tasksLoading || healthLoading || budgetLoading || ojtLoading;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
        <span className="loading-dots">Loading your dashboard</span>
      </div>
    );
  }

  const pending = tasks.filter(t => !t.done).length;
  const spent = budgetData.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budgetData.allowance - spent;
  const habits = Object.values(health.habits).filter(Boolean).length;

  // Prepare data for charts
  const taskTypeData = [
    { name: 'Project', value: tasks.filter(t => t.type === 'project').length },
    { name: 'OJT', value: tasks.filter(t => t.type === 'ojt').length },
    { name: 'Assignment', value: tasks.filter(t => t.type === 'assignment').length },
  ].filter(d => d.value > 0);

  const COLORS = [theme.accent, theme.accent2, theme.accent3, theme.accent4];

  const expenseData = budgetData.expenses.slice(0, 5).map(e => ({
    name: e.label.slice(0, 8),
    amount: e.amount
  }));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <div className="section-header">
        <div style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "600", marginBottom: "4px" }}>{greeting} 👋</div>
        <div className="section-title">Dashboard</div>
      </div>

      <div className="stat-grid">
        <div className="stat-card" onClick={() => onTabChange("tasks")} style={{ cursor: "pointer" }}>
          <span className="stat-label">{icons.tasks} Tasks</span>
          <span className="stat-value" style={{ color: theme.accent }}>{pending}</span>
        </div>
        <div className="stat-card" onClick={() => onTabChange("report")} style={{ cursor: "pointer" }}>
          <span className="stat-label">{icons.report} OJT Days</span>
          <span className="stat-value" style={{ color: theme.accent2 }}>{logs.length}</span>
        </div>
        <div className="stat-card" onClick={() => onTabChange("health")} style={{ cursor: "pointer" }}>
          <span className="stat-label">{icons.health} Habits</span>
          <span className="stat-value" style={{ color: theme.accent4 }}>{habits}/6</span>
        </div>
        <div className="stat-card" onClick={() => onTabChange("budget")} style={{ cursor: "pointer" }}>
          <span className="stat-label">{icons.budget} Balance</span>
          <span className="stat-value" style={{ color: remaining >= 0 ? theme.accent4 : theme.danger }}>₱{Math.abs(remaining).toFixed(0)}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "24px" }}>
        <Card title="Task Overview">
          <div style={{ height: 200, width: '100%' }}>
            {taskTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    itemStyle={{ color: 'var(--text)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '14px' }}>
                No tasks to analyze
              </div>
            )}
          </div>
        </Card>

        <Card title="Recent Expenses">
          <div style={{ height: 200, width: '100%' }}>
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                  <Bar dataKey="amount" fill={theme.accent2} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '14px' }}>
                No expenses recorded
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card title={<span>{icons.spark} Today's Focus</span>}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {tasks.filter(t => !t.done).slice(0, 3).map(t => (
            <div key={t.id} className="row-between" style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <div className="row">
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: theme.accent }}></div>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>{t.name}</span>
              </div>
              {t.due && (
                <div className="row" style={{ gap: "4px" }}>
                   {daysLeft(t.due) <= 2 && (
                    <span style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "4px", background: "rgba(239, 68, 68, 0.15)", color: theme.danger, fontWeight: "800" }}>Urgent</span>
                  )}
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>{t.due}</span>
                </div>
              )}
            </div>
          ))}
          {tasks.filter(t => !t.done).length === 0 && (
            <div style={{ textAlign: "center", color: "var(--muted)", fontSize: "14px", padding: "20px" }}>
              All caught up! 🎉
            </div>
          )}
        </div>
      </Card>

      <div style={{ marginTop: "24px" }}>
        <div className="card-title">{icons.add} Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <Button variant="outline" style={{ fontSize: "12px", padding: "14px" }} onClick={() => onTabChange("report")}>Log OJT</Button>
          <Button variant="outline" style={{ fontSize: "12px", padding: "14px" }} onClick={() => onTabChange("budget")}>Add Expense</Button>
        </div>
      </div>
    </div>
  );
}
