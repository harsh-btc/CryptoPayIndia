import { cn } from "@/lib/utils";

const map = {
  completed: "bg-success/15 text-success border-success/20",
  settled: "bg-success/15 text-success border-success/20",
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  processing: "bg-warning/15 text-warning-foreground border-warning/30",
  scheduled: "bg-secondary text-secondary-foreground border-border",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  refunded: "bg-muted text-muted-foreground border-border",
} as const;

export function StatusBadge({ status }: { status: keyof typeof map }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        map[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}