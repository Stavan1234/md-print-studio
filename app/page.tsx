"use client";

import { useState, useRef, useEffect } from "react";
import MarkdownPreview from "@/components/MarkdownPreview";
import PrintTemplate from "@/components/PrintTemplate";
import { useReactToPrint } from "react-to-print";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [text, setText] = useState(`# Markdown + Math Demo

Inline math: \(a^2 + b^2 = c^2\)

$$
\int_0^1 x^2 dx
$$
`);

  const [isFixing, setIsFixing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const showToast = (message: string, type: "error" | "success" = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!session) {
      alert("Sign in with Google to paste images");
      return;
    }

    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') === 0) {
        e.preventDefault(); // Stop the default paste
        const file = items[i].getAsFile();
        if (!file) return;

        // Get cursor position
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        try {
          // Upload image to server
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            const { url } = data;
            
            // Create markdown image tag with local path
            const imageMarkdown = `![image](${url})`;

            // Insert at cursor using functional update to get latest state
            setText((prevText) => {
              const newText = prevText.substring(0, start) + imageMarkdown + prevText.substring(end);
              
              // Move cursor after inserted image (needs to be outside setText)
              setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
                textarea.focus();
              }, 0);
              
              return newText;
            });
          } else {
            console.error('Failed to upload image');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
        
        return; // Only handle first image
      }
    }
    // If not an image, let normal paste happen
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
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
        showToast(`Failed to generate PDF: ${JSON.parse(errorText).error || 'Unknown error'}`, "error");
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
      
      showToast("PDF exported successfully!", "success");
    } catch (error: any) {
      console.error("Error generating PDF", error);
      showToast(`Error generating PDF: ${error.message || 'Unknown error'}`, "error");
    } finally {
      setIsExporting(false);
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
        {session ? (
          <button
            onClick={() => signOut()}
            className="px-4 py-2 rounded-full bg-red-500 text-white text-sm shadow-md hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm shadow-md hover:bg-blue-700 transition-colors"
          >
            Sign In with Google
          </button>
        )}
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
                ref={textareaRef}
                className="w-full h-[70vh] resize-none rounded-xl border border-zinc-200 bg-white p-4 font-mono text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onPaste={handlePaste}
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

      {isExporting && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl transition-all duration-500">
          <div className="relative flex flex-col items-center justify-center p-10 rounded-3xl bg-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-2xl border border-white/20">
            <div className="relative flex h-32 w-32 items-center justify-center mb-6">
              <div className="absolute h-full w-full animate-ping rounded-full bg-blue-500 opacity-20"></div>
              <div className="absolute h-24 w-24 animate-spin rounded-full border-[6px] border-solid border-white border-t-transparent shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
              <div className="absolute h-16 w-16 animate-pulse rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 shadow-inner"></div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white animate-pulse drop-shadow-md">
              Crafting your PDF...
            </h2>
            <p className="mt-3 text-base text-blue-100/80 font-medium">
              We're polishing the pixels, please wait a moment.
            </p>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[110] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 transition-all duration-300 animate-in slide-in-from-bottom-5 ${toast.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'}`}>
          <span className="text-xl">{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <p className="font-medium">{toast.message}</p>
        </div>
      )}
    </>
  );
}

