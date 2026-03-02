import { useState } from "react";

const db = {
  get: (key) => JSON.parse(localStorage.getItem(key) || "null"),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
};

export function useOJT() {
  const [logs, setLogs] = useState(() => db.get("ojt_logs") || []);

  const save = (l) => {
    db.set("ojt_logs", l);
    setLogs(l);
  };

  const addLog = (log) => {
    save([...logs, { id: Date.now(), ...log }]);
  };

  const removeLog = (id) => save(logs.filter(x => x.id !== id));

  return { logs, addLog, removeLog };
}
