import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface HomeSectionProps {
  title: string;
  linkTo?: string;
  description?: string;
  children: ReactNode;
}

export function HomeSection({ title, linkTo, description, children }: HomeSectionProps) {
  return (
    <section className="mb-8 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-mono font-medium">{title}</h2>
        {linkTo && (
          <Link 
            to={linkTo} 
            className="flex items-center text-sm font-medium hover:underline"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      {children}
    </section>
  );
}
