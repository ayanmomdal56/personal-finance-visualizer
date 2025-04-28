// app/page.js
import MonthlyBarChart from '@/components/charts/monthly_bar_chart';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Personal Finance Visualizer',
  description: 'Track your personal finances with ease.',
};

export default function Home() {
  // Example transactions data (replace with actual data fetching logic)
  // const transactions = [
  //   { amount: 100, description: 'Groceries', date: '2025-04-25' },
  //   { amount: 50, description: 'Transport', date: '2025-04-24' },
  // ];

  return (
  
    <div>

      <TransactionForm />
    </div>
     
  );
}
