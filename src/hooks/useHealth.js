import { useState, useEffect } from "react";
import { today } from "../constants/theme";
import { supabase } from "../lib/supabase";

export function useHealth() {
  const [health, setHealth] = useState({ water: 0, sleep: 0, steps: 0, meals: [], habits: {}, email_notifications: true });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      // Fetch today's log
      const { data: todayData, error: todayError } = await supabase
        .from('health_logs')
        .select('*')
        .eq('date', today())
        .single();
      
      if (todayError && todayError.code !== 'PGRST116') throw todayError;
      if (todayData) setHealth(todayData);

      // Fetch this month's logs for the calendar
      const firstDay = new Date();
      firstDay.setDate(1);
      const { data: monthData, error: monthError } = await supabase
        .from('health_logs')
        .select('date, water, habits')
        .gte('date', firstDay.toISOString().split('T')[0]);
      
      if (monthError) throw monthError;
      setLogs(monthData || []);
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const newHealth = { ...health, ...updates, date: today(), user_id: user.id };
      const { data, error } = await supabase
        .from('health_logs')
        .upsert(newHealth, { onConflict: 'user_id, date' })
        .select();
      
      if (error) throw error;
      if (data) setHealth(data[0]);
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

  return { health, logs, loading, updateHealth, toggleHabit, addMeal, removeMeal };
}
