import { useState } from "react";
import { globalCss } from "./constants/theme";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Health from "./pages/Health";
import Budget from "./pages/Budget";
import OJTReport from "./pages/OJTReport";

export default function App() {
  const [tab, setTab] = useState("home");

  return (
    <>
      <style>{globalCss}</style>
      <div className="app">
        <Header />
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
