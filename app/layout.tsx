import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Logo from "@/components/Logo";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MD Print Studio – Markdown to A4 PDF",
  description:
    "Paste Markdown with LaTeX, tables, and code to get a perfect A4 print layout and high-quality PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900`}
      >
        <Providers>
          <div className="min-h-screen">
            <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                <Logo />
                <span className="hidden text-xs text-zinc-500 md:inline">
                  Live Markdown preview · KaTeX math · Print-perfect A4
                </span>
              </div>
            </header>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
