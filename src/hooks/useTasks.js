import { useState, useEffect } from "react";

const db = {
  get: (key) => JSON.parse(localStorage.getItem(key) || "null"),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
};

export function useTasks() {
  const [tasks, setTasks] = useState(() => db.get("tasks") || []);

  const save = (t) => {
    db.set("tasks", t);
    setTasks(t);
  };

  const addTask = (form) => {
    const newTask = { id: Date.now(), ...form, done: false, created: new Date().toISOString().split("T")[0] };
    save([...tasks, newTask]);
  };

  const toggleTask = (id) => save(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask = (id) => save(tasks.filter(t => t.id !== id));

  return { tasks, addTask, toggleTask, removeTask };
}
