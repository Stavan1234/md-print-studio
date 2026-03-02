"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { forwardRef } from "react";
import { preprocessMath } from "@/lib/preprocessMath";

type Props = {
  content: string;
};

const PrintTemplate = forwardRef<HTMLDivElement, Props>(({ content }, ref) => {
  const processed = preprocessMath(content);

  return (
    <div className="print-page" ref={ref}>
      <div className="print-body prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
          rehypePlugins={[
            [rehypeKatex, { throwOnError: false, errorColor: '#cc0000' }],
            rehypeRaw
          ]}
        >
          {processed}
        </ReactMarkdown>
      </div>
    </div>
  );
});

PrintTemplate.displayName = "PrintTemplate";

export default PrintTemplate;