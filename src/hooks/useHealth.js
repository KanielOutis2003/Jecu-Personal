import { useState, useEffect } from "react";
import { today } from "../constants/theme";
import { supabase } from "../lib/supabase";

export function useHealth() {
  const [health, setHealth] = useState({ water: 0, sleep: 0, steps: 0, meals: [], habits: {} });
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const { data, error } = await supabase
        .from('health_logs')
        .select('*')
        .eq('date', today())
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      if (data) setHealth(data);
    } catch (err) {
      console.error("Error fetching health:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const saveHealth = async (updates) => {
    const newHealth = { ...health, ...updates, date: today() };
    try {
      const { data, error } = await supabase
        .from('health_logs')
        .upsert(newHealth, { onConflict: 'user_id, date' })
        .select();
      
      if (error) throw error;
      setHealth(data[0]);
    } catch (err) {
      console.error("Error saving health:", err.message);
    }
  };

  const updateHealth = (updates) => {
    saveHealth(updates);
  };

  const toggleHabit = (key) => {
    saveHealth({ habits: { ...health.habits, [key]: !health.habits[key] } });
  };

  const addMeal = (meal) => {
    saveHealth({ meals: [...(health.meals || []), meal] });
  };

  const removeMeal = (index) => {
    saveHealth({ meals: health.meals.filter((_, i) => i !== index) });
  };

  return { health, loading, updateHealth, toggleHabit, addMeal, removeMeal };
}
