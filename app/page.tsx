"use client";

import { useState, useRef, useEffect } from "react";
import MarkdownPreview from "@/components/MarkdownPreview";
import PrintTemplate from "@/components/PrintTemplate";
import { useReactToPrint } from "react-to-print";

export default function Home() {
  const [text, setText] = useState(`# Markdown + Math Demo

Inline math: \(a^2 + b^2 = c^2\)

$$
\int_0^1 x^2 dx
$$
`);

  const [isFixing, setIsFixing] = useState(false);

  const handleFixWithAI = async () => {
    setIsFixing(true);
    try {
      const response = await fetch("/api/fix-with-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      if (response.ok) {
        const { fixed } = await response.json();
        setText(fixed);
      }
    } catch (error) {
      console.error("AI fix failed", error);
    } finally {
      setIsFixing(false);
    }
  };

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const handleExportPdf = async () => {
    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to generate PDF", errorText);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "markdown-document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!text.trim()) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [text]);

  return (
    <>
      <div className="fixed top-4 right-6 z-50 flex gap-3 no-print">
        <button
          onClick={() => handlePrint()}
          className="px-4 py-2 rounded-full bg-black text-white text-sm shadow-md hover:bg-zinc-800 transition-colors"
        >
          Print
        </button>
        <button
          onClick={handleExportPdf}
          className="px-4 py-2 rounded-full bg-white text-black text-sm border border-zinc-300 shadow-md hover:bg-zinc-50 transition-colors"
        >
          Export PDF
        </button>
      </div>

      <main className="min-h-screen bg-zinc-50 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={handleFixWithAI}
            disabled={isFixing}
            className="mb-4 px-4 py-2 rounded-full bg-green-600 text-white text-sm shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isFixing ? "AI Fixing..." : "✨ Fix with AI"}
          </button>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[400px_1fr]">
            {/* Fixed/Sticky textarea container */}
            <div className="sticky top-6 self-start">
              <textarea
                className="w-full h-[70vh] resize-none rounded-xl border border-zinc-200 bg-white p-4 font-mono text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {/* Scrollable preview area */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <MarkdownPreview content={text} />
            </div>
          </div>

          {/* offscreen print version kept mounted for react-to-print */}
          <div className="print-root" aria-hidden="true">
            <PrintTemplate content={text} ref={printRef} />
          </div>
        </div>
      </main>
    </>
  );
}
