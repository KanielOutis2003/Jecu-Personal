import { useState, useEffect } from "react";
import { globalCss } from "./constants/theme";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Health from "./pages/Health";
import Budget from "./pages/Budget";
import OJTReport from "./pages/OJTReport";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const [tab, setTab] = useState("home");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const { user, loading } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "#0a0a0f"
      }}>
        <div className="logo" style={{ fontSize: "32px", animation: "pulse 2s infinite" }}>StudentOS</div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <style>{globalCss}</style>
        <AuthPage />
      </>
    );
  }

  return (
    <>
      <style>{globalCss}</style>
      <div className="app">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <div className="content">
          {tab === "home" && <Home onTabChange={setTab} />}
          {tab === "tasks" && <Tasks />}
          {tab === "health" && <Health />}
          {tab === "budget" && <Budget />}
          {tab === "report" && <OJTReport />}
        </div>
        <Navbar activeTab={tab} onTabChange={setTab} />
      </div>
    </>
  );
}
