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
        <button key={t.id} className={`nav-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => onTabChange(t.id)}>
          <span>{t.emoji}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
