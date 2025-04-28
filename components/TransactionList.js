// // src/app/transactionview/page.jsx
// "use client";
// import { useState, useEffect } from "react";
// import TransactionList from "@/components/TransactionList"; // Adjust the import path

// export default function TransactionViewPage() {
//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       const res = await fetch("/api/transactions");
//       const data = await res.json();
//       setTransactions(data);
//     };

//     fetchTransactions();
//   }, []);

//   return (
//     <div className="p-4 space-y-4">
//       <h1 className="text-2xl font-bold">All Transactions</h1>
//       <TransactionList transactions={transactions} />
//     </div>
//   );
// }
// import React from 'react'

// const TransactionList = () => {
//   return (
//     <div>
//       heyy
//     </div>
//   )
// }

// export default TransactionList
