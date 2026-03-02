import { theme, icons } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/Button";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <div className="header">
      <div className="logo">StudentOS</div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: theme.text }}>
            {user?.email?.split("@")[0] || "Scholar"}
          </div>
          <div style={{ fontSize: "11px", color: theme.muted }}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          style={{ padding: "8px", borderRadius: "10px", minWidth: "36px" }}
          title="Sign Out"
        >
          {icons.logout}
        </Button>
      </div>
    </div>
  );
}
