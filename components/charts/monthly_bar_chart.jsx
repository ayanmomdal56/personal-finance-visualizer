// "use client";
// import { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

// export default function MonthlyBarChart() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchTxns = async () => {
//       const res = await fetch("/api/transactions");
//       const txns = await res.json();

//       const monthlyTotals = {};

//       txns.forEach((txn) => {
//         const date = new Date(txn.date);
//         const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
//         monthlyTotals[month] = (monthlyTotals[month] || 0) + parseFloat(txn.amount);
//       });

//       const chartData = Object.entries(monthlyTotals).map(([month, amount]) => ({
//         month,
//         amount,
//       }));

//       setData(chartData);
//     };

//     fetchTxns();
//   }, []);

//   return (
//     <BarChart width={400} height={300} data={data}>
//       <XAxis dataKey="month" />
//       <YAxis />
//       <Tooltip />
//       <Bar dataKey="amount" fill="#8884d8" />
//     </BarChart>
//   );
// }
