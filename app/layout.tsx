import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Tracker - Manage Your Tasks Efficiently',
  description:
    'A beautiful and intuitive task management application built with Next.js, MongoDB, and NextAuth. Organize your tasks, boost productivity, and never miss a deadline.',
  keywords: ['task tracker', 'todo app', 'productivity', 'task management'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
