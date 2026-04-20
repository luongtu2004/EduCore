import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/components/auth/auth-guard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduCore - Hệ thống quản lý giáo dục",
  description: "Giải pháp CRM + CMS toàn diện cho trung tâm đào tạo",
};

import { ConditionalFloatingAction } from "@/components/layout/conditional-floating-action";
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthGuard>
          {children}
        </AuthGuard>
        <ConditionalFloatingAction />
        <Toaster 
          position="top-right" 
          reverseOrder={false} 
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              padding: '16px 24px',
              color: '#0f172a',
              fontWeight: '700',
              fontSize: '13px',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
              letterSpacing: '-0.01em',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
