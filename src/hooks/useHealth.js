import { useState } from "react";
import { today } from "../constants/theme";

const db = {
  get: (key) => JSON.parse(localStorage.getItem(key) || "null"),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
};

export function useHealth() {
  const todayKey = `health_${today()}`;
  const [health, setHealth] = useState(() => db.get(todayKey) || { water: 0, sleep: 0, steps: 0, meals: [], habits: {} });

  const save = (h) => {
    db.set(todayKey, h);
    setHealth(h);
  };

  const updateHealth = (updates) => {
    save({ ...health, ...updates });
  };

  const toggleHabit = (key) => {
    save({ ...health, habits: { ...health.habits, [key]: !health.habits[key] } });
  };

  const addMeal = (meal) => {
    save({ ...health, meals: [...(health.meals || []), meal] });
  };

  const removeMeal = (index) => {
    save({ ...health, meals: health.meals.filter((_, i) => i !== index) });
  };

  return { health, updateHealth, toggleHabit, addMeal, removeMeal };
}
