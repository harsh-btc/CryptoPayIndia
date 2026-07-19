import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bitcoin,
  Copy,
  Download,
  Link as LinkIcon,
  Share2,
  Smartphone,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { exchangeRates, formatINR } from "@/lib/dummy-data";
import { toast } from "sonner";

export const Route = createFileRoute("/accept-payment")({
  head: () => ({
    meta: [
      { title: "Accept Payment · CryptoPay India" },
      { name: "description", content: "Generate a QR code and payment link for UPI, Bitcoin, Ethereum or USDT." },
    ],
  }),
  component: AcceptPayment,
});

type Method = "UPI" | "BTC" | "ETH" | "USDT";

const methodMeta: Record<Method, { label: string; icon: React.ComponentType<{ className?: string }>; address: string; note: string }> = {
  UPI:  { label: "UPI",      icon: Smartphone, address: "saanviretail@hdfcbank", note: "Instant · Zero fee for merchant" },
  BTC:  { label: "Bitcoin",  icon: Bitcoin,    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", note: "~10 min confirmation · Network fee applies" },
  ETH:  { label: "Ethereum", icon: Bitcoin,    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2", note: "~30 sec confirmation · Gas fee applies" },
  USDT: { label: "USDT",     icon: Bitcoin,    address: "TQrZ9wBs4pJfXBmMoP7yA3n2K5vE8xL6dM", note: "TRC-20 · ~1 min · Low fee" },
};

function QRCodePlaceholder({ payload }: { payload: string }) {
  // Deterministic pseudo QR pattern derived from the payload
  const cells = useMemo(() => {
    const arr: boolean[] = [];
    for (let i = 0; i < 625; i++) {
      let h = i;
      for (let j = 0; j < payload.length; j++) h = (h * 31 + payload.charCodeAt(j)) | 0;
      arr.push(((h ^ (h >> 7)) & 3) === 0);
    }
    return arr;
  }, [payload]);

  return (
    <div className="grid aspect-square w-full max-w-[280px] grid-cols-[repeat(25,1fr)] gap-[2px] rounded-2xl border border-border bg-white p-4 shadow-sm">
      {cells.map((on, i) => (
        <span key={i} className={on ? "bg-slate-900" : "bg-white"} />
      ))}
    </div>
  );
}

function AcceptPayment() {
  const [amount, setAmount] = useState<string>("2500");
  const [note, setNote] = useState<string>("Payment for Order #1042");
  const [method, setMethod] = useState<Method>("UPI");
  const [status, setStatus] = useState<"idle" | "waiting" | "received">("idle");

  const amountNum = Number(amount) || 0;

  const cryptoAmount = useMemo(() => {
    if (method === "BTC") return (amountNum / exchangeRates.BTC).toFixed(6) + " BTC";
    if (method === "ETH") return (amountNum / exchangeRates.ETH).toFixed(5) + " ETH";
    if (method === "USDT") return (amountNum / exchangeRates.USDT).toFixed(2) + " USDT";
    return formatINR(amountNum);
  }, [amountNum, method]);

  const payload = `${method}:${methodMeta[method].address}?amount=${amountNum}&note=${encodeURIComponent(note)}`;

  const generate = () => {
    if (amountNum <= 0) return toast.error("Enter a valid amount");
    setStatus("waiting");
    toast.success("Payment request generated");
    setTimeout(() => setStatus("received"), 4500);
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <PageHeader title="Accept payment" description="Generate a QR code or payment link. Customer pays in UPI or crypto — you settle in INR." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Payment details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (INR)</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">₹</span>
                <Input id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} className="h-11 pl-7 text-lg font-semibold tabular-nums" placeholder="0.00" />
              </div>
              {amountNum > 0 && amountNum < 100 && (
                <p className="text-xs text-destructive">Minimum amount is ₹100</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note / Invoice reference</Label>
              <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="resize-none" />
            </div>
            <div className="space-y-2">
              <Label>Payment method</Label>
              <Tabs value={method} onValueChange={(v) => { setMethod(v as Method); setStatus("idle"); }}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="UPI">UPI</TabsTrigger>
                  <TabsTrigger value="BTC">BTC</TabsTrigger>
                  <TabsTrigger value="ETH">ETH</TabsTrigger>
                  <TabsTrigger value="USDT">USDT</TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="text-xs text-muted-foreground">{methodMeta[method].note}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Customer pays</span>
                <span className="font-semibold tabular-nums">{cryptoAmount}</span>
              </div>
              {method !== "UPI" && (
                <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>You receive</span>
                  <span className="tabular-nums">{formatINR(amountNum)}</span>
                </div>
              )}
              <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>Live rate</span>
                <span className="tabular-nums">1 {method === "UPI" ? "INR" : method} = {method === "UPI" ? "₹1" : formatINR(exchangeRates[method as "BTC" | "ETH" | "USDT"])}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={generate} disabled={amountNum < 100}>Generate payment</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">Payment request</CardTitle>
            {status === "waiting" && (
              <Badge className="gap-1.5 bg-warning/15 text-warning-foreground hover:bg-warning/20" variant="secondary">
                <Loader2 className="h-3 w-3 animate-spin" /> Waiting for payment
              </Badge>
            )}
            {status === "received" && (
              <Badge className="gap-1.5 bg-success/15 text-success hover:bg-success/20" variant="secondary">
                <CheckCircle2 className="h-3 w-3" /> Payment received
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col items-center justify-center">
                <QRCodePlaceholder payload={payload} />
                <p className="mt-4 text-xs text-muted-foreground">Scan with any {method === "UPI" ? "UPI app" : "wallet"}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("QR downloaded")}>
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Share dialog opened")}>
                    <Share2 className="h-3.5 w-3.5" /> Share
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">{method === "UPI" ? "UPI ID" : "Wallet address"}</Label>
                  <button
                    onClick={() => copy(methodMeta[method].address, method === "UPI" ? "UPI ID" : "Address")}
                    className="mt-1 flex w-full items-center justify-between rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
                  >
                    <span className="truncate font-mono text-xs">{methodMeta[method].address}</span>
                    <Copy className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </button>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Payment link</Label>
                  <button
                    onClick={() => copy(`https://pay.cryptopay.in/${method.toLowerCase()}/inv_${Date.now().toString(36)}`, "Payment link")}
                    className="mt-1 flex w-full items-center justify-between rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate font-mono text-xs">pay.cryptopay.in/{method.toLowerCase()}/inv_{Date.now().toString(36).slice(-6)}</span>
                    </span>
                    <Copy className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </button>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-semibold tabular-nums">{formatINR(amountNum)}</span></div>
                  <div className="mt-1.5 flex justify-between"><span className="text-muted-foreground">Fee (0.8%)</span><span className="tabular-nums">{formatINR(amountNum * 0.008)}</span></div>
                  <div className="mt-1.5 flex justify-between border-t border-border pt-1.5"><span className="font-medium">Net settlement</span><span className="font-semibold tabular-nums text-primary">{formatINR(amountNum * 0.992)}</span></div>
                </div>
                <div className="text-xs text-muted-foreground">Expires in 15 minutes. A webhook will fire once the payment confirms.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}