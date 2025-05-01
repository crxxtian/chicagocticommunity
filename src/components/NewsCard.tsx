// src/components/NewsCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NewsCardProps {
  title: string;
  description: string;
  date: string;
  badge: string;
  tags?: string[];
  link: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  date,
  badge,
  tags = [],
  link,
}) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-shadow"
  >
    <header className="mb-4 flex items-center justify-between">
      <time className="text-xs text-muted-foreground">{date}</time>
      <span className="inline-block rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
        {badge}
      </span>
    </header>

    <h3 className="mb-2 text-lg font-mono font-semibold leading-snug group-hover:text-primary transition-colors">
      {title}
    </h3>

    <p className="mb-4 text-sm text-muted-foreground line-clamp-3">{description}</p>

    {tags.length > 0 && (
      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    )}

    <Link
      to={link}
      className={cn(
        "mt-auto inline-flex items-center text-sm font-medium text-primary hover:underline"
      )}
    >
      Read more <ArrowRight className="ml-1 h-4 w-4" />
    </Link>
  </motion.article>
);
