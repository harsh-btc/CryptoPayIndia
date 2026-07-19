import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, Download, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { transactions, formatINR, formatDate, type Transaction } from "@/lib/dummy-data";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions · CryptoPay India" },
      { name: "description", content: "Search, filter and inspect every payment across UPI and crypto." },
    ],
  }),
  component: TransactionsPage,
});

type SortKey = "date" | "amountInr" | "customer";

function TransactionsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [method, setMethod] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let list = transactions.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (method !== "all" && t.method !== method) return false;
      if (q) {
        const s = q.toLowerCase();
        return (
          t.customer.toLowerCase().includes(s) ||
          t.email.toLowerCase().includes(s) ||
          t.reference.toLowerCase().includes(s) ||
          t.id.toLowerCase().includes(s)
        );
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") cmp = +new Date(a.date) - +new Date(b.date);
      else if (sortKey === "amountInr") cmp = a.amountInr - b.amountInr;
      else cmp = a.customer.localeCompare(b.customer);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [q, status, method, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("desc"); }
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <PageHeader
        title="Transactions"
        description={`${filtered.length} of ${transactions.length} transactions`}
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Filters saved")}>
              <SlidersHorizontal className="h-4 w-4" /> Save view
            </Button>
            <Button className="gap-2" onClick={() => toast.success("Exporting to CSV…")}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </>
        }
      />

      <Card className="border-border/70 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by customer, email, reference or transaction ID" className="h-10 pl-9" />
          </div>
          <div className="flex gap-2">
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={method} onValueChange={(v) => { setMethod(v); setPage(1); }}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="BTC">Bitcoin</SelectItem>
                <SelectItem value="ETH">Ethereum</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("customer")}>
                    Customer <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">
                  <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("amountInr")}>
                    Amount <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>
                  <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("date")}>
                    Date <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-40 text-center text-sm text-muted-foreground">No transactions match your filters.</TableCell></TableRow>
              ) : pageItems.map((t) => (
                <TableRow key={t.id} onClick={() => setSelected(t)} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                        {t.customer.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{t.customer}</div>
                        <div className="truncate text-xs text-muted-foreground">{t.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="rounded-full font-mono text-[11px]">{t.method}</Badge></TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatINR(t.amountInr)}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{t.reference}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(t.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border p-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(page - 1) * pageSize + 1}</span>–<span className="font-medium text-foreground">{Math.min(page * pageSize, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm tabular-nums">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Transaction details</SheetTitle>
                <SheetDescription className="font-mono text-xs">{selected.id}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6 px-6 pb-6">
                <div className="rounded-2xl border border-border bg-muted/40 p-5">
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="mt-1 text-3xl font-semibold tabular-nums">{formatINR(selected.amountInr)}</div>
                  <div className="mt-2"><StatusBadge status={selected.status} /></div>
                </div>
                <dl className="space-y-3 text-sm">
                  {[
                    ["Customer", selected.customer],
                    ["Email", selected.email],
                    ["Reference", selected.reference],
                    ["Method", selected.method],
                    ["Crypto amount", selected.cryptoAmount ? `${selected.cryptoAmount} ${selected.method}` : "—"],
                    ["Fee", formatINR(selected.fee)],
                    ["Net", formatINR(selected.amountInr - selected.fee)],
                    ["Date", formatDate(selected.date)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-border pb-2">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => toast.success("Receipt sent")}>Send receipt</Button>
                  <Button variant="outline" className="flex-1" onClick={() => toast("Refund initiated")}>Refund</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}