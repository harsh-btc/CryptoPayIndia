import { useEffect, useState, type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function StatCard({
  label,
  value,
  format = (v) => v.toLocaleString("en-IN"),
  delta,
  icon,
  hint,
}: {
  label: string;
  value: number;
  format?: (v: number) => string;
  delta?: number;
  icon?: ReactNode;
  hint?: string;
}) {
  const animated = useCountUp(value);
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="group relative overflow-hidden border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          {icon && (
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
              {icon}
            </span>
          )}
        </div>
        <div className="mt-3 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
          {format(animated)}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          {typeof delta === "number" && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
                positive
                  ? "bg-success/15 text-success"
                  : "bg-destructive/15 text-destructive",
              )}
            >
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  );
}