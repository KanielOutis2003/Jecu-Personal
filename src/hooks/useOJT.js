import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useOJT() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('ojt_logs')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("Error fetching OJT logs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const addLog = async (log) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('ojt_logs')
        .insert([{ ...log, user_id: user.id }])
        .select();
      
      if (error) throw error;
      setLogs([data[0], ...logs]);
    } catch (err) {
      console.error("Error adding OJT log:", err.message);
    }
  };

  const removeLog = async (id) => {
    try {
      const { error } = await supabase
        .from('ojt_logs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setLogs(logs.filter(x => x.id !== id));
    } catch (err) {
      console.error("Error removing OJT log:", err.message);
    }
  };

  return { logs, loading, addLog, removeLog };
}
