// src/components/HomeSection.tsx

import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HomeSectionProps {
  title: string;
  linkTo?: string;
  children: ReactNode;
  className?: string;
}

export function HomeSection({ title, linkTo, children, className = "" }: HomeSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`space-y-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl font-mono font-semibold text-foreground tracking-tight">
          {title}
        </h2>
        {linkTo && (
          <Link
            to={linkTo}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            aria-label={`View all ${title}`}
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
      <div>{children}</div>
    </motion.section>
  );
}
