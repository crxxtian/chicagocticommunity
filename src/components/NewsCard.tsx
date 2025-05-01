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
    className="group relative flex h-full flex-col rounded-lg border border-border bg-card p-5 sm:p-6 min-h-[300px] hover:shadow-lg transition-shadow"
  >
    {/* Body grows to push "Read more" to bottom */}
    <div className="flex flex-col flex-1">
      {/* Header */}
      <header className="mb-3 flex items-center justify-between">
        <time className="text-xs sm:text-sm text-muted-foreground">{date}</time>
        <span className="inline-block rounded-full bg-primary px-2 sm:px-3 py-0.5 text-[10px] sm:text-xs font-semibold text-primary-foreground">
          {badge}
        </span>
      </header>

      {/* Title: No line clamping, wraps naturally */}
      <h3
        className={cn(
          "mb-3 text-lg sm:text-xl font-mono font-semibold leading-tight transition-colors",
          "group-hover:text-primary"
        )}
      >
        {title}
      </h3>

      {/* Description: Clamp to 4 lines */}
      <p className="mb-4 flex-1 text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-4">
        {description}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="text-[10px] sm:text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>

    {/* Footer link always at bottom */}
    <Link
      to={link}
      className="mt-auto inline-flex items-center text-sm sm:text-base font-medium text-primary hover:underline"
      aria-label={`Read more about ${title}`}
    >
      Read more <ArrowRight className="ml-1 h-4 w-4" />
    </Link>
  </motion.article>
);