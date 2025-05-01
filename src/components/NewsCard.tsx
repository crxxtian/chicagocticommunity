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
    whileHover={{ scale: 1.01 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="group relative flex h-full flex-col rounded-lg border border-border bg-card p-6 min-h-[320px] shadow-sm hover:shadow-md transition-all"
    role="article"
    aria-label={title}
  >
    {/* Body grows to push "Read more" to bottom */}
    <div className="flex flex-col flex-1 space-y-4">
      {/* Badge */}
      <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs sm:text-sm font-semibold text-primary-foreground self-start">
        {badge}
      </span>

      {/* Title: Truncate to 3 lines with ellipsis */}
      <h3
        className={cn(
          "text-lg sm:text-xl font-mono font-semibold leading-tight transition-colors",
          "line-clamp-3",
          "group-hover:text-primary"
        )}
        title={title} // Show full title on hover
      >
        {title}
      </h3>

      {/* Date */}
      <time className="text-xs sm:text-sm text-muted-foreground">{date}</time>

      {/* Description: Clamp to 4 lines */}
      <p className="flex-1 text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-4">
        {description}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="text-xs sm:text-sm bg-muted px-2 py-1 rounded-full text-muted-foreground border border-muted"
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
      className="mt-4 inline-flex items-center text-sm sm:text-base font-medium text-primary hover:underline"
      aria-label={`Read more about ${title}`}
    >
      Read more <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  </motion.article>
);