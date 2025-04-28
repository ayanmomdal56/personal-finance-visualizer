"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TransactionForm({ onAdd = () => {} }) {
  const router = useRouter();

  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ✅ Optional: Auto-fill today's date if needed (safe inside useEffect)
  useEffect(() => {
    if (!form.date) {
      const today = new Date().toISOString().split('T')[0]; // format: yyyy-mm-dd
      setForm((prevForm) => ({ ...prevForm, date: today }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.date) {
      alert("Amount and Date are required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add transaction. Status: ${response.status}, Message: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Transaction Added:", responseData);

      setSuccess(true);
      onAdd(); // Trigger parent update
      setForm({ amount: "", description: "", date: new Date().toISOString().split('T')[0] }); // Reset but keep today's date
    } catch (err) {
      setError(err.message);
      console.error("Error adding transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTransactions = () => {
    router.push("/transactionview");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      {/* Success & Error Messages */}
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">Transaction added successfully!</div>}

      {/* Input Fields */}
      <input
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        className="border p-2 w-full rounded"
        type="number"
        required
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full rounded"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>

        <button
          type="button"
          onClick={handleViewTransactions}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          View All Transactions
        </button>
      </div>
    </form>
  );
}
