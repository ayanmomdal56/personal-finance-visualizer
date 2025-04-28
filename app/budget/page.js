"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function BudgetsPage() {
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

  // Function to calculate actual spending for a specific month
  const getActualSpending = (month) => {
    return transactions
      .filter((txn) => {
        if (!txn?.date) return false; // Ensure there's a date
        const txnMonth = new Date(txn.date).toLocaleString('default', { month: 'long' });
        return txnMonth.toLowerCase() === month.toLowerCase();
      })
      .reduce((sum, txn) => sum + (txn.amount || 0), 0); // Sum the actual amounts
  };

  const combinedData = [
    {
      month: month, // Display selected month
      Actual: getActualSpending(month), // Actual spending for the selected month
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Form to select month and category */}
      <Card>
        <CardHeader>
          <CardTitle>Select Month</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row gap-4">
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
          </form>
        </CardContent>
      </Card>

      {/* Chart to display Actual expenses */}
      {loading ? (
        <div className="text-center text-gray-500">Loading transactions...</div>
      ) : (
        month && (
          <Card>
            <CardHeader>
              <CardTitle>Actual Expenses for {month}</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend verticalAlign="top" />
                  <Line type="monotone" dataKey="Actual" stroke="#82ca9d" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
