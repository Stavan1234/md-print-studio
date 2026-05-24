"use client";

import PrintTemplate from "@/components/PrintTemplate";
import { useEffect, useState } from "react";

export default function PrintPage() {
  const [content, setContent] = useState("");
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const globalAny = window as any;
    if (typeof globalAny.__MD_PRINT_CONTENT__ === "string") {
      setContent(globalAny.__MD_PRINT_CONTENT__);
      // Give React/KaTeX time to fully paint the DOM
      setTimeout(() => {
        if (globalAny.twemoji) {
          globalAny.twemoji.parse(document.body, {
            folder: 'svg',
            ext: '.svg',
            base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/'
          });
        }
        setRendered(true);
      }, 800);
    } else {
      // Even if no content, signal ready after a delay
      setTimeout(() => setRendered(true), 800);
    }
  }, []);

  return (
    <main className="min-h-screen bg-white flex justify-center items-start py-8">
      <PrintTemplate content={content} />
      {rendered && <div id="render-complete" aria-hidden="true" className="hidden" />}
    </main>
  );
}

