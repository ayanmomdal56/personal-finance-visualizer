import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Personal Finance Visualizer',
  description: 'Track your personal finances with ease.',
};

export default function Layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="bg-blue-600 text-white px-6 py-4 shadow-md">
            <nav className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="text-xl font-semibold">Personal Finance</div>
              <div className="space-x-4">
                <Link href="/" className="hover:text-gray-200 transition-colors">Home</Link>
                <Link href="/dashboard" className="hover:text-gray-200 transition-colors">Dashboard</Link>
                <Link href="/about" className="hover:text-gray-200 transition-colors">About</Link>
              </div>
            </nav>
          </header>
          <main className="flex-1 p-6">{children}</main>
          {/* <footer className="bg-blue-500 text-white p-4 text-center"> */}
            {/* © 2025 Personal Finance Visualizer */}
          {/* </footer> */}
        </ThemeProvider>
      </body>
    </html>
  );
}