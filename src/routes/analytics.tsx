import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, IndianRupee, Percent } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatINR, monthlyRevenue, paymentDistribution, revenueTrend, topCustomers, weeklyRevenue } from "@/lib/dummy-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · CryptoPay India" },
      { name: "description", content: "Deep-dive analytics across revenue, methods, settlements and customers." },
    ],
  }),
  component: Analytics,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

function Analytics() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <PageHeader title="Analytics" description="Revenue, methods and customer behaviour across your account." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total revenue" value={8_642_150} format={(v) => formatINR(v)} delta={22.6} icon={<IndianRupee className="h-4 w-4" />} hint="Last 90 days" />
        <StatCard label="Avg. transaction" value={4820} format={(v) => formatINR(v)} delta={3.2} icon={<TrendingUp className="h-4 w-4" />} hint="Per successful payment" />
        <StatCard label="Unique customers" value={1284} delta={14.8} icon={<Users className="h-4 w-4" />} hint="+184 this month" />
        <StatCard label="Success rate" value={97.4} format={(v) => v.toFixed(1) + "%"} delta={0.6} icon={<Percent className="h-4 w-4" />} hint="Last 30 days" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Revenue</CardTitle>
              <Tabs defaultValue="monthly">
                <TabsList>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                </TabsList>
                <TabsContent value="weekly" className="mt-4">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINR(v)} />
                        <Bar dataKey="revenue" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="monthly" className="mt-4">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINR(v)} />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                        <Bar dataKey="revenue" name="Revenue" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="settlements" name="Settlements" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="daily" className="mt-4">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINR(v)} />
                        <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader><CardTitle className="text-base font-semibold">Crypto vs UPI</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentDistribution} dataKey="value" nameKey="name" outerRadius={90} paddingAngle={3} stroke="none" label={{ fontSize: 11 }}>
                    {paymentDistribution.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/70 shadow-sm">
          <CardHeader><CardTitle className="text-base font-semibold">Settlement trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatINR(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="upi" name="UPI" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="crypto" name="Crypto" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader><CardTitle className="text-base font-semibold">Top customers</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {topCustomers.map((c, i) => (
              <div key={c.email} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/50">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">{formatINR(c.spend)}</p>
                  <p className="text-[11px] text-muted-foreground">#{i + 1}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}