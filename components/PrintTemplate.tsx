"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { forwardRef } from "react";

type Props = {
  content: string;
};

const PrintTemplate = forwardRef<HTMLDivElement, Props>(({ content }, ref) => {
  return (
    <div className="print-page" ref={ref}>
      <div className="print-body prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
});

PrintTemplate.displayName = "PrintTemplate";

export default PrintTemplate;
