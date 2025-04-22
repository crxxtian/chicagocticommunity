// components/RP_Card.tsx
"use client";

import { FC } from "react";

type ResearchPaper = {
  title: string;
  summary: string;
  link: string;
  published?: string; // optional
};

const RP_Card: FC<ResearchPaper> = ({ title, summary, link, published }) => {
  return (
    <div className="border border-border p-5 rounded-xl bg-secondary/30 shadow-sm hover:shadow-md transition-all space-y-3">
      <h3 className="font-sans text-lg font-semibold text-foreground line-clamp-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
        {summary}
      </p>
      <div className="flex justify-between items-center text-sm">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-medium underline"
        >
          Read paper →
        </a>
        <span className="text-muted-foreground italic">
          {published ? `Published: ${published}` : "via arXiv"}
        </span>
      </div>
    </div>
  );
};

export default RP_Card;
