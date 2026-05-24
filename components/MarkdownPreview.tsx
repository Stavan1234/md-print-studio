"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import { remarkAlert } from "remark-github-blockquote-alert";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { preprocessMath } from "@/lib/preprocessMath";
import MermaidDiagram from "./MermaidDiagram";

type Props = {
  content: string;
};

export default function MarkdownPreview({ content }: Props) {
  // First pass: detect and wrap math
  const processed = preprocessMath(content);
  
  // Log to browser console for debugging
  console.log("MarkdownPreview - INPUT:", content);
  console.log("MarkdownPreview - PREPROCESSED:", processed);

  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks, remarkAlert]}
        rehypePlugins={[
          [rehypeKatex, { 
            throwOnError: false,
            errorColor: '#cc0000'
          }],
          rehypeRaw
        ]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match && match[1] === "mermaid") {
              return <MermaidDiagram chart={String(children).replace(/\n$/, "")} />;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}

