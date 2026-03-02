import { theme } from "../constants/theme";

export default function Header() {
  return (
    <div className="header">
      <div className="logo">StudentOS</div>
      <div style={{ fontSize: 12, color: theme.muted }}>
        {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </div>
    </div>
  );
}
