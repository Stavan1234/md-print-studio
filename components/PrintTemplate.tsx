"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import { remarkAlert } from "remark-github-blockquote-alert";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { forwardRef } from "react";
import { preprocessMath } from "@/lib/preprocessMath";
import MermaidDiagram from "./MermaidDiagram";

type Props = {
  content: string;
};

const PrintTemplate = forwardRef<HTMLDivElement, Props>(({ content }, ref) => {
  const processed = preprocessMath(content);

  return (
    <div className="print-page" ref={ref}>
      <div className="print-body prose max-w-none text-black">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath, remarkBreaks, remarkAlert]}
          rehypePlugins={[
            [rehypeKatex, { throwOnError: false, errorColor: '#cc0000' }],
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
    </div>
  );
});

PrintTemplate.displayName = "PrintTemplate";

export default PrintTemplate;