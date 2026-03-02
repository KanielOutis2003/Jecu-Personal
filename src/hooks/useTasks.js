import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (form) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...form, done: false, user_id: user.id }])
        .select();
      
      if (error) throw error;
      setTasks([data[0], ...tasks]);
    } catch (err) {
      console.error("Error adding task:", err.message);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ done: !task.done })
        .eq('id', id);
      
      if (error) throw error;
      setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    } catch (err) {
      console.error("Error toggling task:", err.message);
    }
  };

  const removeTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error("Error removing task:", err.message);
    }
  };

  return { tasks, loading, addTask, toggleTask, removeTask };
}
