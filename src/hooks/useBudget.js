import { useState } from "react";
import { today } from "../constants/theme";

const db = {
  get: (key) => JSON.parse(localStorage.getItem(key) || "null"),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
};

export function useBudget() {
  const monthKey = `budget_${today().slice(0, 7)}`;
  const [data, setData] = useState(() => db.get(monthKey) || { allowance: 0, expenses: [] });

  const save = (d) => {
    db.set(monthKey, d);
    setData(d);
  };

  const setAllowance = (amount) => save({ ...data, allowance: parseFloat(amount) || 0 });

  const addExpense = (expense) => {
    save({ ...data, expenses: [...data.expenses, { id: Date.now(), ...expense, amount: parseFloat(expense.amount), date: today() }] });
  };

  const removeExpense = (id) => save({ ...data, expenses: data.expenses.filter(x => x.id !== id) });

  return { data, setAllowance, addExpense, removeExpense };
}
