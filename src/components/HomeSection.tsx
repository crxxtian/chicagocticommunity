
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface HomeSectionProps {
  title: string;
  linkTo: string;
  children: ReactNode;
}

export function HomeSection({ title, linkTo, children }: HomeSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-mono font-medium">{title}</h2>
        <Link 
          to={linkTo} 
          className="flex items-center text-sm font-medium hover:underline"
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      {children}
    </section>
  );
}
