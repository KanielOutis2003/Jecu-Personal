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
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, verifyOTP } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (showOtp) {
        await verifyOTP(phone, otp);
      } else if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, phone);
        if (phone) {
          setShowOtp(true);
        } else {
          alert("Check your email for the confirmation link!");
        }
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
            {showOtp ? "Verify your phone number" : isLogin ? "Welcome back, scholar!" : "Start your organized journey today."}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {!showOtp ? (
            <>
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

              {!isLogin && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: theme.muted }}>Phone Number (for verification)</label>
                  <Input 
                    type="tel" 
                    placeholder="+63 912 345 6789" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: theme.muted }}>Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: theme.muted }}>OTP Code</label>
              <Input 
                type="text" 
                placeholder="123456" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
              />
              <div style={{ fontSize: "12px", color: theme.muted }}>Enter the 6-digit code sent to your phone</div>
            </div>
          )}

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
            {loading ? "Processing..." : (showOtp ? "Verify OTP" : isLogin ? "Sign In" : "Create Account")}
          </Button>

          {showOtp && (
            <button 
              type="button"
              onClick={() => setShowOtp(false)}
              style={{ background: "none", border: "none", color: theme.accent, fontSize: "13px", cursor: "pointer" }}
            >
              Back to Sign Up
            </button>
          )}
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px" }}>
          <span style={{ color: theme.muted }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          {" "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: "none", 
              border: "none", 
              color: theme.accent, 
              fontWeight: "600", 
              cursor: "pointer",
              padding: "4px"
            }}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </Card>
    </div>
  );
}
