import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ХИМИК — Интерактивный тренажер по химии",
  description: "Изучайте периодическую таблицу Менделеева с 118 химическими элементами. Интерактивный тренажер с режимами обучения и викторины.",
  keywords: ["Химия", "Периодическая таблица", "Менделеев", "Обучение", "Викторина", "Элементы", "Химические элементы"],
  authors: [{ name: "Daniil Himik" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ХИМИК — Интерактивный тренажер по химии",
    description: "Изучайте периодическую таблицу с 118 химическими элементами",
    siteName: "ХИМИК",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ХИМИК — Интерактивный тренажер по химии",
    description: "Изучайте периодическую таблицу с 118 химическими элементами",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
