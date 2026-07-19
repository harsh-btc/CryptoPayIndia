import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, Landmark, ShieldCheck, Download, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { exchangeRates, formatINR, settlements } from "@/lib/dummy-data";
import { toast } from "sonner";

export const Route = createFileRoute("/settlements")({
  head: () => ({
    meta: [
      { title: "Settlement Center · CryptoPay India" },
      { name: "description", content: "Track settlements, exchange rates and fees, all in one place." },
    ],
  }),
  component: SettlementCenter,
});

function SettlementCenter() {
  const today = 3_42_900;
  const gross = 3_45_670;
  const fee = gross - today;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <PageHeader
        title="Settlement center"
        description="Everything you receive in INR, credited to your bank account."
        actions={
          <Button className="gap-2" onClick={() => toast.success("Statement downloaded")}>
            <Download className="h-4 w-4" /> Download statement
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's settlement" value={today} format={(v) => formatINR(v)} icon={<Landmark className="h-4 w-4" />} hint="Scheduled for tomorrow" />
        <StatCard label="This month" value={68_42_150} format={(v) => formatINR(v)} delta={18.7} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Fees paid" value={54_720} format={(v) => formatINR(v)} icon={<ShieldCheck className="h-4 w-4" />} hint="0.8% flat" />
        <StatCard label="Avg. settlement time" value={22} format={(v) => `${Math.round(v)}h`} icon={<Clock className="h-4 w-4" />} hint="T+1 to bank" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-border/70 shadow-sm">
          <CardHeader><CardTitle className="text-base font-semibold">Live exchange rates</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(["BTC", "ETH", "USDT"] as const).map((k) => (
              <div key={k} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3">
                <div>
                  <p className="text-sm font-medium">1 {k}</p>
                  <p className="text-[11px] text-muted-foreground">Updated 30s ago</p>
                </div>
                <p className="text-lg font-semibold tabular-nums">{formatINR(exchangeRates[k])}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader><CardTitle className="text-base font-semibold">Bank account</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Primary account</p>
              <p className="mt-1 text-base font-semibold">HDFC Bank · Current</p>
              <p className="mt-4 font-mono text-lg tracking-widest">•••• •••• 4821</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>IFSC HDFC0001234</span>
                <span>Mumbai</span>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full gap-2" onClick={() => toast("Manage bank accounts")}>
              Manage accounts <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader><CardTitle className="text-base font-semibold">Settlement breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Gross collections</span><span className="font-medium tabular-nums">{formatINR(gross)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Platform fee (0.8%)</span><span className="tabular-nums">− {formatINR(fee)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST on fee</span><span className="tabular-nums">− {formatINR(fee * 0.18)}</span></div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><span>Net settlement</span><span className="tabular-nums text-primary">{formatINR(today - fee * 0.18)}</span></div>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-success/10 p-3 text-xs text-success">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Funds are held in a FDIC-partnered escrow and settled T+1 to your registered bank account.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/70 shadow-sm">
        <CardHeader><CardTitle className="text-base font-semibold">Settlement history</CardTitle></CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Settlement ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>UTR</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer" onClick={() => toast(`Opening ${s.id}`)}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(s.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                    <TableCell><span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px]">{s.method}</span></TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{s.utr}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatINR(s.amount)}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}