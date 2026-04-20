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
      </body>
    </html>
  );
}
