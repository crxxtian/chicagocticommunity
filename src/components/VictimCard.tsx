import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type VictimCardProps = {
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
  const cleanedURL = claim_url?.replace(/^https?:\/\//, "") ?? "";
  const isOnion = cleanedURL.includes(".onion");

  return (
    <div className="border border-border p-4 rounded-md bg-background/40 space-y-2">
      <div className="flex justify-between items-start gap-4">
        <h3 className="font-mono font-semibold text-base break-words leading-tight">
          {victim || "Unknown Victim"}
        </h3>
        <Badge variant="outline" className="shrink-0">{group}</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        <strong>Sector:</strong> {activity || "Unknown"} •{" "}
        <strong>Country:</strong> {country || "Unknown"} • {attackdate}
      </p>

      {claim_url && (
        <div className="text-xs text-muted-foreground italic break-all mt-1">
          <Shield className="inline-block w-3.5 h-3.5 mr-1 text-red-500" />
          Leak site listed for reference only:
          <br />
          <span className={cn(isOnion && "text-red-400")}>
            {cleanedURL}
            {isOnion && " (onion link)"}
          </span>
        </div>
      )}
    </div>
  );
}
