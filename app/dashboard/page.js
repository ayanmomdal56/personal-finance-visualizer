

"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions"); // Make sure this API exists
        const data = await res.json();
        setTransactions(data.transactions);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;




  const totalExpense = transactions.reduce((acc, txn) => acc + parseFloat(txn.amount || 0), 0);

  const categoryTotals = transactions.reduce((acc, txn) => {
    const category = txn.description || "Others";
    acc[category] = (acc[category] || 0) + parseFloat(txn.amount);
    return acc;
  }, {});

  const pieChartData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  const monthlyTotals = transactions.reduce((acc, txn) => {
    if (!txn.date || !txn.amount) return acc;
    const month = new Date(txn.date).toLocaleString("default", { month: "long" });
    acc[month] = (acc[month] || 0) + parseFloat(txn.amount);
    return acc;
  }, {});

  const barChartData = Object.entries(monthlyTotals).map(([month, amount]) => ({
    month,
    expense: amount,
  }));

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Finance Dashboard</h1>




      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Spending </CardTitle>
            {/* <CardDescription>This is your total spending.</CardDescription> */}
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">₹{totalExpense.toFixed(2)}</p>
          </CardContent>
        </Card>

       
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            {pieChartData.length === 0 ? (
              <div className="text-center text-gray-500">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>



        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            {barChartData.length === 0 ? (
              <div className="text-center text-gray-500">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="expense" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-background rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>

        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full bg-transparent">
            <thead className="bg-muted">
              <tr>
                <th className="py-3 px-6 text-left text-muted-foreground text-sm font-semibold">Date</th>
                <th className="py-3 px-6 text-left text-muted-foreground text-sm font-semibold">Amount</th>
                <th className="py-3 px-6 text-left text-muted-foreground text-sm font-semibold">Category</th>
              </tr>
            </thead>

            <tbody>
              {transactions.slice(0, 5).map((txn, index) => (
                <tr key={index} className="border-b hover:bg-muted/50 transition">
                  <td className="py-4 px-6 text-sm">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-sm font-medium">₹{txn.amount}</td>
                  <td className="py-4 px-6 text-sm">{txn.description || "—"}</td>
                </tr>
              ))}
            
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
