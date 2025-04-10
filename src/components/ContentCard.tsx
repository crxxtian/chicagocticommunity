
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  description: string;
  link?: string;
  date?: string;
  tags?: string[];
  className?: string;
}

export function ContentCard({ 
  title, 
  description, 
  link, 
  date, 
  tags,
  className 
}: ContentCardProps) {
  const CardContent = () => (
    <div className={cn("border border-border rounded-md p-4 hover:bg-secondary/50 transition-colors", className)}>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-mono font-medium text-lg">{title}</h3>
          {date && <span className="text-xs text-muted-foreground">{date}</span>}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-accent text-accent-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {link && (
          <div className="flex items-center text-sm font-medium pt-2">
            Read more
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        )}
      </div>
    </div>
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
