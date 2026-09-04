import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BhuSetu | National Land Acquisition & Management System',
  description: 'Digital lifecycle portal for RFCTLARR Act 2013 land acquisition, cadastral GIS mapping, and automated compensation disbursement under Ministry of Road Transport and Highways (MoRTH), Government of India.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('antialiased font-sans', inter.variable)}>
      <body className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-[#166534]/20 selection:text-[#0F2E53]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
