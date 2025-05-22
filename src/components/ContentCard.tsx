import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  description: string;
  link?: string;
  date?: string;
  badge?: string;
  tags?: string[];
  source?: string;
  external?: boolean;
  image?: string | null;
  variant?: "news" | "report" | "spotlight";
  className?: string;
}

// ─── Module-scope constants ─────────────────────────────────────────────
const BADGE_CLASSES: Record<string, string> = {
  Ransomware:      "bg-red-600 text-white",
  CVE:             "bg-yellow-400 text-black",
  CISA:            "bg-blue-600 text-white",
  APT:             "bg-purple-700 text-white",
  Chicago:         "bg-green-600 text-white",
  Vulnerability:   "bg-orange-500 text-white",
  "Data Breach":   "bg-rose-500 text-white",
  "Zero-Day":      "bg-pink-500 text-white",
  Phishing:        "bg-indigo-600 text-white",
  Healthcare:      "bg-emerald-600 text-white",
  Education:       "bg-cyan-600 text-white",
  Russia:          "bg-red-800 text-white",
  China:           "bg-orange-700 text-white",
  Iran:            "bg-teal-600 text-white",
  "North Korea":   "bg-blue-800 text-white",
  "United States": "bg-gray-600 text-white",
  NATO:            "bg-sky-700 text-white",
  Malware:         "bg-zinc-800 text-white",
  Exploit:         "bg-orange-600 text-white",
  Patch:           "bg-lime-500 text-black",
  DDoS:            "bg-fuchsia-700 text-white",
  General:         "bg-muted text-muted-foreground",
};

const VARIANT_CONFIG = {
  news:      { clampTitle: "", clampDesc: "line-clamp-3", minH: "min-h-[360px]" },
  report:    { clampTitle: "", clampDesc: "line-clamp-2", minH: "min-h-[320px]" }, // Removed title clamp, increased min-h
  spotlight: { clampTitle: "line-clamp-2", clampDesc: "line-clamp-2", minH: "min-h-[240px]" },
} as const;

// ─── Sub-components ─────────────────────────────────────────────────────
interface CardBodyProps {
  title: string;
  formattedDate: string | null;
  description: string;
  tags: string[];
  badgeClass: string;
  clampTitle: string;
  clampDesc: string;
}
const CardBody: React.FC<CardBodyProps> = ({
  title,
  formattedDate,
  description,
  tags,
  badgeClass,
  clampTitle,
  clampDesc,
}) => (
  <div className="flex-1 space-y-3">
    <header className="flex justify-between items-start gap-2">
      <h3
        className={cn("font-semibold text-lg leading-tight break-words font-mono", clampTitle)}
        title={title}
      >
        {title}
      </h3>
      {formattedDate && (
        <time className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
          {formattedDate}
        </time>
      )}
    </header>
    <p className={cn("text-sm text-muted-foreground leading-relaxed", clampDesc)}>
      {description || <i>No summary available.</i>}
    </p>
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-2 pt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={cn("text-xs px-2 py-0.5 rounded-full border border-muted text-muted-foreground", badgeClass)}
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

interface CardFooterProps {
  link?: string;
  external?: boolean;
}
const CardFooter: React.FC<CardFooterProps> = ({ link, external }) => {
  if (!link) return null;
  return (
    <div className="mt-4 flex items-center text-sm font-medium text-primary hover:underline">
      {external ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read more externally"
        >
          Read more <ExternalLink className="inline-block ml-1 h-4 w-4" />
        </a>
      ) : (
        <Link to={link} aria-label="Read more">
          Read more <ArrowRight className="inline-block ml-1 h-4 w-4" />
        </Link>
      )}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────
export function ContentCard({
  title,
  description,
  date,
  badge = "General",
  tags = [],
  link,
  external = false,
  image,
  variant = "news",
  className,
}: ContentCardProps) {
  const { clampTitle, clampDesc, minH } = VARIANT_CONFIG[variant];

  const formattedDate = useMemo(() => {
    if (!date) return null;
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [date]);

  const allTags = useMemo(() => {
    return Array.from(
      new Map(
        [badge, ...tags]
          .filter(Boolean)
          .map((t) => [t.toLowerCase(), t])
      ).values()
    );
  }, [badge, tags]);

  const badgeClass = BADGE_CLASSES[badge] ?? BADGE_CLASSES.General;

  const Wrapper: React.ElementType = link && !external ? Link : "div";
  const wrapperProps = link && !external
    ? { to: link, className: "block h-full", role: "article", "aria-label": title }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        viewport={{ once: true }}
        className={cn(
          "flex flex-col justify-between rounded-xl p-6 bg-card border border-border shadow-sm transition-all hover:shadow-md hover:scale-[1.01] duration-200",
          minH,
          className
        )}        
      >
        {image && (
          <img
            src={image}
            alt={title}
            className="rounded-md mb-4 w-full h-32 object-cover"
          />
        )}
        <CardBody
          title={title}
          formattedDate={formattedDate}
          description={description}
          tags={allTags}
          badgeClass={badgeClass}
          clampTitle={clampTitle}
          clampDesc={clampDesc}
        />
        <CardFooter link={link} external={external} />
      </motion.div>
    </Wrapper>
  );
}