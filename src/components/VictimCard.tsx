import React from "react";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

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
  // Clean and format date
  let formattedDate: string;
  try {
    formattedDate = format(parseISO(attackdate), "PPpp");
  } catch {
    formattedDate = attackdate;
  }

  // Clean URL for display
  const cleanedURL = claim_url?.replace(/^https?:\/\//, "") ?? "";
  const isOnion = cleanedURL.includes(".onion");

  return (
    <div className="border border-border p-4 rounded-xl bg-background/40 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <h3 className="font-mono font-semibold text-lg leading-tight break-words">
          {victim || "Unknown Victim"}
        </h3>
        <Badge variant="outline">{group}</Badge>
      </div>

      <div className="flex flex-wrap text-sm text-muted-foreground gap-x-4 gap-y-1 mt-1">
        <span><strong>Sector:</strong> {activity || "Unknown"}</span>
        <span><strong>Country:</strong> {country || "Unknown"}</span>
        <span>{formattedDate}</span>
      </div>

      {claim_url && (
        <div className="mt-3 text-xs text-muted-foreground italic">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500 shrink-0" />
            <span>Leak site (reference only):</span>
          </div>
          <a
            href={claim_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "break-all hover:text-blue-400 transition-colors",
              isOnion && "text-red-400"
            )}
          >
            {cleanedURL}{isOnion ? " (onion)" : ""}
          </a>
        </div>
      )}
    </div>
  );
}
