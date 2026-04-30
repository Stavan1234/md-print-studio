import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Logo from "@/components/Logo";
import { Providers } from "./providers";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MD Print Studio | Convert ChatGPT Text to PDF",
  description:
    "The ultimate tool to convert ChatGPT text into beautiful, print-ready A4 PDFs. Free online Markdown to PDF converter with LaTeX, math, and code support.",
  keywords: [
    "how to convert the chatgpt text into pdf",
    "convert chatgpt to pdf",
    "edit chatgpt text",
    "md-print-studio",
    "markdown to pdf",
    "print markdown",
    "chatgpt export pdf"
  ],
  authors: [{ name: "MD Print Studio" }],
  creator: "MD Print Studio",
  openGraph: {
    title: "MD Print Studio | Convert ChatGPT Text to PDF",
    description: "Convert ChatGPT text into a beautiful, print-ready PDF instantly.",
    url: "https://md-print-studio.vercel.app",
    siteName: "MD Print Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MD Print Studio | Convert ChatGPT Text to PDF",
    description: "Convert ChatGPT text into a beautiful, print-ready PDF instantly.",
  },
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
            
            <footer className="mt-auto border-t border-zinc-200 bg-white py-8 text-center text-sm text-zinc-500 no-print">
              <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>&copy; {new Date().getFullYear()} MD Print Studio. All rights reserved.</p>
                <div className="flex gap-6">
                  <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </Link>
                  <a href="https://github.com/Stavan1234/md-print-studio" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    GitHub
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
