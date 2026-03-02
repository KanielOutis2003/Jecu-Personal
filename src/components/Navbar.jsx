import { Button } from "./ui/Button";

export default function Navbar({ activeTab, onTabChange }) {
  const tabs = [
    { id: "home", label: "Home", emoji: "⌂" },
    { id: "tasks", label: "Tasks", emoji: "📋" },
    { id: "health", label: "Health", emoji: "💪" },
    { id: "budget", label: "Budget", emoji: "💸" },
    { id: "report", label: "OJT", emoji: "🤖" },
  ];

  return (
    <nav className="nav">
      {tabs.map(t => (
        <Button 
          key={t.id} 
          onClick={() => onTabChange(t.id)}
          className={`nav-btn ${activeTab === t.id ? "active" : ""}`}
          style={{ 
            background: activeTab === t.id ? "rgba(139, 92, 246, 0.25)" : "transparent",
            border: "none",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            padding: "10px 4px",
            borderRadius: "14px",
            color: activeTab === t.id ? "var(--text)" : "var(--muted)"
          }}
        >
          <span>{t.emoji}</span>
          <span style={{ fontSize: "11px", fontWeight: "600" }}>{t.label}</span>
        </Button>
      ))}
    </nav>
  );
}
