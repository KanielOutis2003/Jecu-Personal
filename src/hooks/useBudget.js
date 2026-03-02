import { useState, useEffect } from "react";
import { today } from "../constants/theme";
import { supabase } from "../lib/supabase";

export function useBudget() {
  const currentMonth = today().slice(0, 7);
  const [data, setData] = useState({ allowance: 0, expenses: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch allowance
      const { data: budgetData, error: budgetError } = await supabase
        .from('budget')
        .select('allowance')
        .eq('month', currentMonth)
        .single();
      
      if (budgetError && budgetError.code !== 'PGRST116') throw budgetError;

      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', `${currentMonth}-01`)
        .lte('date', `${currentMonth}-31`)
        .order('date', { ascending: false });
      
      if (expensesError) throw expensesError;

      setData({
        allowance: budgetData?.allowance || 0,
        expenses: expensesData || []
      });
    } catch (err) {
      console.error("Error fetching budget data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setAllowance = async (amount) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: budgetData, error } = await supabase
        .from('budget')
        .upsert({ month: currentMonth, allowance: parseFloat(amount) || 0, user_id: user.id }, { onConflict: 'user_id, month' })
        .select();
      
      if (error) throw error;
      setData(prev => ({ ...prev, allowance: budgetData[0].allowance }));
    } catch (err) {
      console.error("Error setting allowance:", err.message);
    }
  };

  const addExpense = async (expense) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: expenseData, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, amount: parseFloat(expense.amount), date: today(), user_id: user.id }])
        .select();
      
      if (error) throw error;
      setData(prev => ({ ...prev, expenses: [expenseData[0], ...prev.expenses] }));
    } catch (err) {
      console.error("Error adding expense:", err.message);
    }
  };

  const removeExpense = async (id) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setData(prev => ({ ...prev, expenses: prev.expenses.filter(x => x.id !== id) }));
    } catch (err) {
      console.error("Error removing expense:", err.message);
    }
  };

  return { data, loading, setAllowance, addExpense, removeExpense };
}
