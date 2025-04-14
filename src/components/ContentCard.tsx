import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ContentCardProps {
  title: string;
  description: string;
  link?: string;
  date?: string;
  badge?: string;
  tags?: string[];
  source?: string;
  external?: boolean; // new: distinguish external links
  image?: string | null; // optional preview
  className?: string;
}

export function ContentCard({
  title,
  description,
  link,
  date,
  badge = "General",
  tags,
  source,
  external = false,
  image,
  className,
}: ContentCardProps) {
  const formattedDate = date
    ? new Date(date).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const badgeColorMap: Record<string, string> = {
    Ransomware: "bg-red-500 text-white",
    CVE: "bg-yellow-400 text-black",
    CISA: "bg-blue-600 text-white",
    APT: "bg-purple-600 text-white",
    Chicago: "bg-green-600 text-white",
    General: "bg-muted text-muted-foreground",
  };

  const CardContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      className={cn(
        "border border-border rounded-md p-4 hover:bg-secondary/50 transition-colors h-full flex flex-col justify-between",
        className
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          className="rounded-md mb-3 w-full h-32 object-cover"
        />
      )}

      <div className="space-y-2 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-mono font-medium text-lg line-clamp-3">
            {title}
          </h3>
          {formattedDate && (
            <span className="text-xs text-muted-foreground text-right">
              {formattedDate}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-4">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {badge && (
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded",
                badgeColorMap[badge] || badgeColorMap["General"]
              )}
            >
              {badge}
            </span>
          )}
          {tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-accent text-accent-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {source && (
          <p className="text-xs text-muted-foreground italic pt-1">
            Source: {source}
          </p>
        )}
      </div>

      {link && (
        <div className="flex items-center text-sm font-medium pt-3 text-primary hover:underline">
          {external ? (
            <>
              <a href={link} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
              <ExternalLink className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              <span>Read more</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </div>
      )}
    </motion.div>
  );

  if (link && !external) {
    return (
      <Link to={link} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
