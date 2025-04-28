// "use client";

// import React, { useEffect, useState } from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // shadcn/ui Card

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#FF8042"];

// export default function DashboardPage() {
//   const [categoryData, setCategoryData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchTransactions() {
//       try {
//         const res = await fetch("/api/transactions");
//         const data = await res.json();
//         const transactions = data.transactions;

//         // Group by category (description) and sum amounts
//         const categoryTotals = transactions.reduce((acc, txn) => {
//           const category = txn.description || "Others"; // Fallback if no description
//           acc[category] = (acc[category] || 0) + parseFloat(txn.amount);
//           return acc;
//         }, {});

//         // Convert to array for recharts
//         const formattedData = Object.entries(categoryTotals).map(([name, value]) => ({
//           name,
//           value,
//         }));

//         setCategoryData(formattedData);
//       } catch (err) {
//         console.error("Failed to fetch transactions:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTransactions();
//   }, []);

//   if (loading) return <div className="p-6 text-center">Loading...</div>;

//   return (
//     <div className="p-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Category-wise Expenses</CardTitle>
//         </CardHeader>
//         <CardContent className="h-[300px]">
//           {categoryData.length === 0 ? (
//             <div className="text-center text-gray-500">No transactions found.</div>
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={categoryData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   paddingAngle={5}
//                 >
//                   {categoryData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
