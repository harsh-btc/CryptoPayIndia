import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  IndianRupee,
  Bitcoin,
  Smartphone,
  Clock,
  TrendingUp,
  QrCode,
  Download,
  Send,
  ArrowRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  formatINR,
  paymentDistribution,
  revenueTrend,
  transactions,
  settlements,
} from "@/lib/dummy-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · CryptoPay India" },
      { name: "description", content: "Overview of today's revenue, payments and settlements." },
    ],
  }),
  component: Index,
});

function Index() {
  const todayRevenue = 2_84_620;
  const todayCrypto = 1_18_450;
  const todayUpi = 1_66_170;
  const pendingSettlement = 3_42_900;
  const monthlyRevenue = 68_42_150;

  const recent = transactions.slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <PageHeader
        title="Dashboard"
        description="Here's what's happening with your payments today."
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button asChild className="gap-2">
              <Link to="/accept-payment">
                <QrCode className="h-4 w-4" /> New payment
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Today's Revenue" value={todayRevenue} format={(v) => formatINR(v)} delta={12.4} icon={<IndianRupee className="h-4 w-4" />} hint="vs yesterday" />
        <StatCard label="Today's Crypto" value={todayCrypto} format={(v) => formatINR(v)} delta={8.1} icon={<Bitcoin className="h-4 w-4" />} hint="41.6% of revenue" />
        <StatCard label="Today's UPI" value={todayUpi} format={(v) => formatINR(v)} delta={-2.3} icon={<Smartphone className="h-4 w-4" />} hint="58.4% of revenue" />
        <StatCard label="Pending Settlement" value={pendingSettlement} format={(v) => formatINR(v)} icon={<Clock className="h-4 w-4" />} hint="T+1 to HDFC ••4821" />
        <StatCard label="Monthly Revenue" value={monthlyRevenue} format={(v) => formatINR(v)} delta={18.7} icon={<TrendingUp className="h-4 w-4" />} hint="November 2026" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenue overview</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Last 30 days · INR</p>
            </div>
            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5 text-primary">
              +18.7%
            </Badge>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                      color: "var(--popover-foreground)",
                    }}
                    formatter={(v: number) => formatINR(v)}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Payment distribution</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">By method · this month</p>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3} stroke="none">
                    {paymentDistribution.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 space-y-2.5">
              {paymentDistribution.map((d) => (
                <li key={d.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-foreground">{d.name}</span>
                  </span>
                  <span className="font-medium tabular-nums text-muted-foreground">{d.value}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">Recent transactions</CardTitle>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link to="/transactions">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <div className="divide-y divide-border">
              {recent.map((t) => (
                <div key={t.id} className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted/40">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {t.customer.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.customer}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.reference} · {t.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">{formatINR(t.amountInr)}</p>
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Settlement status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Today's collections</span>
                  <span className="font-semibold tabular-nums">{formatINR(todayRevenue)}</span>
                </div>
                <Progress value={72} className="h-2" />
                <p className="mt-1.5 text-xs text-muted-foreground">72% of daily target · ₹4,00,000</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Next settlement</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{formatINR(pendingSettlement)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {settlements[1] ? `Scheduled ${new Date(settlements[1].date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}` : "Scheduled tomorrow"} · HDFC ••4821
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" className="h-auto flex-col gap-1.5 py-3">
                <Link to="/accept-payment"><QrCode className="h-4 w-4" /><span className="text-xs">New QR</span></Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col gap-1.5 py-3">
                <Link to="/transactions"><Send className="h-4 w-4" /><span className="text-xs">Refund</span></Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col gap-1.5 py-3">
                <Link to="/settlements"><Download className="h-4 w-4" /><span className="text-xs">Statement</span></Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col gap-1.5 py-3">
                <Link to="/analytics"><TrendingUp className="h-4 w-4" /><span className="text-xs">Reports</span></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
