import { ArrowRight } from "lucide-react";
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
  className?: string;
}

export function ContentCard({
  title,
  description,
  link,
  date,
  badge,
  tags,
  className,
}: ContentCardProps) {
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
        "border border-border rounded-md p-4 hover:bg-secondary/50 transition-colors",
        className
      )}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-mono font-medium text-lg">{title}</h3>
          {date && <span className="text-xs text-muted-foreground">{date}</span>}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
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
        {link && (
          <div className="flex items-center text-sm font-medium pt-2">
            Read more
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        )}
      </div>
    </motion.div>
  );

  if (link) {
    return (
      <Link to={link} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
