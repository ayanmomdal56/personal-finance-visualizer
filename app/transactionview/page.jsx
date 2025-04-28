"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data.transactions || []); 
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
    fetchTransactions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBudget = {
      month,
      category,
      amount: parseFloat(amount),
    };
    setBudgets((prev) => [...prev, newBudget]);
    setMonth("");
    setCategory("");
    setAmount("");
  };

  const getActualSpending = (month, category) => {
    return transactions
      .filter((txn) => {
        if (!txn.date || !txn.description) return false;
        const txnMonth = new Date(txn.date).toLocaleString('default', { month: 'long' });
        return (
          txnMonth.toLowerCase() === month.toLowerCase() &&
          txn.description.toLowerCase() === category.toLowerCase()
        );
      })
      .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
  };

  const combinedData = budgets.map((budget) => {
    const actual = getActualSpending(budget.month, budget.category);
    return {
      month: `${budget.month} (${budget.category})`,
      Budget: budget.amount,
      Actual: actual,
      exceeded: actual > budget.amount,
    };
  });

  return (
    <div className="p-6 space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Set Monthly Category Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="border rounded p-2 w-full"
            >
              <option value="">Select Month</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Category (e.g., Food, Travel)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="border rounded p-2 w-full"
            />
            <input
              type="number"
              placeholder="Budget Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="border rounded p-2 w-full"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
              Add Budget
            </button>
          </form>
        </CardContent>
      </Card>



      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Expenses</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Budget" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="Actual" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>




      {combinedData.some((d) => d.exceeded) && (
        <Card>
          <CardHeader>
            <CardTitle>Warnings</CardTitle>
          </CardHeader>
          <CardContent className="text-red-600 space-y-2">
            {combinedData
              .filter((d) => d.exceeded)
              .map((d, idx) => (
                <div key={idx}>
                  ❗ You have exceeded your {d.month} budget! (Spent ₹{d.Actual} / Budget ₹{d.Budget})
                </div>
              ))}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
