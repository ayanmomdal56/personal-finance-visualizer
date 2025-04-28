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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const txnRes = await fetch("/api/transactions");
        const txnData = await txnRes.json();
        const txns = txnData.transactions || txnData || [];
        setTransactions(Array.isArray(txns) ? txns : []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

  // Calculate actual spending based on transactions filtered by month and category
  const getActualSpending = (month, category) => {
    return transactions
      .filter((txn) => {
        if (!txn?.date || !txn?.description) return false;
        const txnMonth = new Date(txn.date).toLocaleString("default", { month: "long" });
        return (
          txnMonth.toLowerCase() === month.toLowerCase() &&
          txn.description.toLowerCase() === category.toLowerCase()
        );
      })
      .reduce((sum, txn) => sum + (txn.amount || 0), 0);
  };

  // Prepare the combined data with both budget and actual spending
  const combinedData = budgets.map((budget) => {
    const actual = getActualSpending(budget.month, budget.category); // Get actual spending
    return {
      month: `${budget.month} (${budget.category})`,
      Budget: budget.amount,
      Actual: actual,
      exceeded: actual > budget.amount, // Flag if the budget was exceeded
    };
  });

  return (
    <div className="p-6 space-y-6">

      {/* Budget Form */}
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
              className="border rounded p-2 w-full bg-transparent text-gray-800"
            >
              <option value="" className="bg-transparent">Select Month</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((m) => (
                <option key={m} value={m} className="bg-transparent">{m}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
            <input
              type="number"
              placeholder="Budget Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
              Add Budget
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-500">Loading transactions...</div>
      ) : (
        <>
          {/* Chart */}
          {combinedData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual Expenses</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Legend verticalAlign="top" />
                    <Line
                      type="monotone"
                      dataKey="Budget"
                      stroke="#8884d8"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Actual"
                      stroke="#82ca9d"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Warnings for Overbudget */}
          {combinedData.some((d) => d.exceeded) && (
            <Card>
              <CardHeader>
                <CardTitle>Warnings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-red-600">
                {combinedData
                  .filter((d) => d.exceeded)
                  .map((d, index) => (
                    <div key={index}>
                      ❗ You have exceeded your {d.month} budget! (Spent ₹{d.Actual} / Budget ₹{d.Budget})
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
