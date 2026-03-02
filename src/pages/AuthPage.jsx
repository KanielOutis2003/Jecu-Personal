import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { theme } from "../constants/theme";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberEmail") ? true : false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (rememberMe) {
      localStorage.setItem("rememberEmail", email);
    } else {
      localStorage.removeItem("rememberEmail");
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        alert("Check your email for the confirmation link!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "20px"
    }}>
      <Card style={{ width: "100%", maxWidth: "400px", padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div className="logo" style={{ fontSize: "32px", marginBottom: "8px" }}>StudentOS</div>
          <div style={{ color: theme.muted, fontSize: "14px" }}>
            {isLogin ? "Welcome back, scholar!" : "Start your organized journey today."}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: theme.muted }}>Email Address</label>
            <Input 
              type="email" 
              placeholder="name@university.edu" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--muted)" }}>Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="row" style={{ marginTop: "4px" }}>
            <input 
              type="checkbox" 
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: theme.accent }}
            />
            <label htmlFor="remember" style={{ fontSize: "14px", color: "var(--muted)", cursor: "pointer" }}>
              Remember me
            </label>
          </div>

          {error && (
            <div style={{ 
              color: theme.danger, 
              fontSize: "13px", 
              background: "rgba(239, 68, 68, 0.1)", 
              padding: "12px", 
              borderRadius: "12px",
              border: "1px solid rgba(239, 68, 68, 0.2)"
            }}>
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} style={{ marginTop: "8px", height: "48px" }}>
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px" }}>
          <span style={{ color: "var(--muted)" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          {" "}
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: "none", 
              border: "none", 
              color: theme.accent, 
              fontWeight: "600", 
              padding: "4px"
            }}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
