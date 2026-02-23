"use client";

import PrintTemplate from "@/components/PrintTemplate";
import { useEffect, useState } from "react";

export default function PrintPage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    const globalAny = window as any;
    if (typeof globalAny.__MD_PRINT_CONTENT__ === "string") {
      setContent(globalAny.__MD_PRINT_CONTENT__);
    }
  }, []);

  return (
    <main className="min-h-screen bg-white flex justify-center items-start py-8">
      <PrintTemplate content={content} />
    </main>
  );
}

