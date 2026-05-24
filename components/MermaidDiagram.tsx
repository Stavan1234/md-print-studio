"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "var(--font-geist-sans), Arial, sans-serif"
});

export default function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);
  const id = idRef.current;

  useEffect(() => {
    let isMounted = true;
    
    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render(id, chart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (error) {
        console.error("Mermaid parsing error:", error);
        if (isMounted) {
          setSvgContent(`<div class="text-red-500 bg-red-50 p-4 border border-red-200 rounded">Failed to render Mermaid diagram</div>`);
        }
      }
    };

    if (chart) {
      renderDiagram();
    }

    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  return (
    <div 
      ref={containerRef}
      className="mermaid flex justify-center my-6" 
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
}
