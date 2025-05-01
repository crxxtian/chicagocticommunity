// src/components/VictimCard.tsx

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";

export type VictimCardProps = {
  victim: string;
  group: string;
  attackdate: string;
  activity: string;
  country: string;
  claim_url?: string;
};

export default function VictimCard({
  victim,
  group,
  attackdate,
  activity,
  country,
  claim_url,
}: VictimCardProps) {
  let formattedDate: string;
  try {
    formattedDate = format(parseISO(attackdate), "PPpp");
  } catch {
    formattedDate = attackdate;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-xl p-5 bg-card border border-border shadow-sm transition-all hover:shadow-lg hover:scale-[1.01] duration-200"
    >
      <div className="flex justify-between items-start gap-4">
        <h3 className="font-mono font-semibold text-lg leading-tight break-words">
          {victim || "Unknown Victim"}
        </h3>
        <Badge variant="outline" className="text-xs px-2 py-0.5">
          {group || "Unknown"}
        </Badge>
      </div>

      <div className="flex flex-wrap text-sm text-muted-foreground gap-x-4 gap-y-1 mt-2">
        <span><strong>Sector:</strong> {activity || "Unknown"}</span>
        <span><strong>Country:</strong> {country || "Unknown"}</span>
        <span>{formattedDate}</span>
      </div>

      {claim_url && (
        <div className="mt-4 text-xs text-muted-foreground italic space-y-1">
          <div className="flex items-center gap-2 font-medium text-red-500">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Ransomware Group: <strong>{group}</strong></span>
          </div>
          <div className="pl-6 text-muted-foreground">
            URL hidden for safety.
          </div>
        </div>
      )}
    </motion.div>
  );
}
