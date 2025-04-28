"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editedAmount, setEditedAmount] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDate, setEditedDate] = useState(''); // New state for editing Date

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
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

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  const handleDelete = (index) => {
    const updatedTransactions = [...transactions];
    updatedTransactions.splice(index, 1);
    setTransactions(updatedTransactions);
  };

  const handleEdit = (index) => {
    const txn = transactions[index];
    setEditIndex(index);
    setEditedAmount(txn.amount);
    setEditedDescription(txn.description || '');
    setEditedDate(txn.date || ''); // set the date also
    setModalOpen(true);
  };

  const saveChanges = () => {
    const updatedTransactions = [...transactions];
    updatedTransactions[editIndex] = {
      ...updatedTransactions[editIndex],
      amount: editedAmount,
      description: editedDescription,
      date: editedDate, // update the date too
    };
    setTransactions(updatedTransactions);
    setModalOpen(false);
  };

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

  const categoryTotals = transactions.reduce((acc, txn) => {
    const category = txn.description || "Others";
    acc[category] = (acc[category] || 0) + parseFloat(txn.amount);
    return acc;
  }, {});

  const pieChartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Finance Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Monthly Expenses Bar Chart */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Overview of your expenses month by month.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {barChartData.length === 0 ? (
              <div className="text-center text-gray-500">No data to display.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="expense" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
          <CardFooter>
            <span className="text-sm text-muted-foreground">Total monthly expenses.</span>
          </CardFooter>
        </Card>

        {/* Category-wise Pie Chart */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Category-wise Expenses</CardTitle>
            <CardDescription>See how your expenses are distributed.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {pieChartData.length === 0 ? (
              <div className="text-center text-gray-500">No data to display.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
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
          <CardFooter>
            <span className="text-sm text-muted-foreground">Expenses by category.</span>
          </CardFooter>
        </Card>

      </div>

      {/* All Transactions */}
      <div className="bg-background rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">All Transactions</h2>

        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full bg-transparent">
            <thead className="bg-muted">
              <tr>
                <th className="py-3 px-6 text-left text-muted-foreground text-sm font-semibold">Date</th>
                <th className="py-3 px-6 text-left text-muted-foreground text-sm font-semibold">Amount</th>
                <th className="py-3 px-6 text-left text-muted-foreground text-sm font-semibold">Category</th>
                <th className="py-3 px-6 text-left text-muted-foreground text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index} className="border-b hover:bg-muted/50 transition">
                  <td className="py-4 px-6 text-sm">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-sm font-medium">₹{txn.amount}</td>
                  <td className="py-4 px-6 text-sm">{txn.description || "—"}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="inline-flex items-center justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-500 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="inline-flex items-center justify-center rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold">Amount</label>
              <input
                type="text"
                id="amount"
                value={editedAmount}
                onChange={(e) => setEditedAmount(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-semibold">Category</label>
              <input
                type="text"
                id="category"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-semibold">Date</label>
              <input
                type="date"
                id="date"
                value={editedDate ? new Date(editedDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditedDate(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveChanges} className="bg-green-500 text-white">Save Changes</Button>
            <Button onClick={() => setModalOpen(false)} className="bg-gray-500 text-white">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
