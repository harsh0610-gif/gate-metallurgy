import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'katex/dist/katex.min.css';
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GATE MT Pro — Crack GATE Metallurgy With Confidence",
  description:
    "India's most comprehensive GATE MT preparation platform. PYQs, Mock Tests, Smart Analytics, and Expert Notes — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-[#f0f4ff] text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
