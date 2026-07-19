// Realistic dummy data for CryptoPay India (frontend-only case study).
export type PaymentMethod = "UPI" | "BTC" | "ETH" | "USDT";
export type TxStatus = "completed" | "pending" | "failed" | "refunded";

export interface Transaction {
  id: string;
  date: string; // ISO
  customer: string;
  email: string;
  method: PaymentMethod;
  amountInr: number;
  cryptoAmount?: number;
  status: TxStatus;
  reference: string;
  fee: number;
}

const customers = [
  ["Aarav Sharma", "aarav.sharma@gmail.com"],
  ["Priya Iyer", "priya.iyer@outlook.com"],
  ["Rohan Mehta", "rohan.m@zoho.in"],
  ["Ananya Reddy", "ananya.reddy@hey.com"],
  ["Vikram Kulkarni", "vikram.k@rediff.com"],
  ["Diya Kapoor", "diya.kapoor@icloud.com"],
  ["Kabir Bansal", "kabir.b@protonmail.com"],
  ["Isha Nair", "isha.nair@gmail.com"],
  ["Arjun Malhotra", "arjun.m@fastmail.com"],
  ["Meera Joshi", "meera.j@outlook.com"],
  ["Yash Agarwal", "yash.a@gmail.com"],
  ["Sana Qureshi", "sana.q@zoho.in"],
];

const methods: PaymentMethod[] = ["UPI", "BTC", "ETH", "USDT"];
const statuses: TxStatus[] = [
  "completed", "completed", "completed", "completed", "completed",
  "pending", "pending", "failed", "refunded",
];

function seeded(i: number) {
  return Math.abs(Math.sin(i * 9301 + 49297) * 233280) % 1;
}

export const transactions: Transaction[] = Array.from({ length: 48 }, (_, i) => {
  const [customer, email] = customers[i % customers.length];
  const method = methods[Math.floor(seeded(i) * 4)];
  const status = statuses[Math.floor(seeded(i + 3) * statuses.length)];
  const amountInr = Math.round(500 + seeded(i + 7) * 84500);
  const daysAgo = Math.floor(seeded(i + 11) * 30);
  const date = new Date(Date.now() - daysAgo * 86400_000 - Math.floor(seeded(i + 2) * 86_400_000)).toISOString();
  let cryptoAmount: number | undefined;
  if (method === "BTC") cryptoAmount = +(amountInr / 5_800_000).toFixed(6);
  else if (method === "ETH") cryptoAmount = +(amountInr / 285_000).toFixed(5);
  else if (method === "USDT") cryptoAmount = +(amountInr / 84.2).toFixed(2);
  return {
    id: `tx_${(1000 + i).toString(36).toUpperCase()}${(i * 7).toString(36).toUpperCase()}`,
    date,
    customer,
    email,
    method,
    amountInr,
    cryptoAmount,
    status,
    reference: `INV-2026-${(1000 + i).toString().padStart(4, "0")}`,
    fee: +(amountInr * 0.008).toFixed(2),
  };
});

// Sort newest first
transactions.sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const revenueTrend = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const base = 45000 + Math.sin(i / 3) * 12000 + seeded(i + 100) * 20000;
  return {
    date: d.toISOString().slice(5, 10),
    revenue: Math.round(base),
    crypto: Math.round(base * (0.35 + seeded(i + 40) * 0.2)),
    upi: Math.round(base * (0.45 + seeded(i + 41) * 0.15)),
  };
});

export const weeklyRevenue = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
  day: d,
  revenue: Math.round(38000 + seeded(i + 300) * 55000),
}));

export const monthlyRevenue = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
].map((m, i) => ({
  month: m,
  revenue: Math.round(680_000 + seeded(i + 500) * 1_400_000),
  settlements: Math.round(650_000 + seeded(i + 501) * 1_300_000),
}));

export const paymentDistribution = [
  { name: "UPI", value: 46, color: "var(--chart-2)" },
  { name: "USDT", value: 28, color: "var(--chart-1)" },
  { name: "Bitcoin", value: 16, color: "var(--chart-3)" },
  { name: "Ethereum", value: 10, color: "var(--chart-4)" },
];

export const topCustomers = [
  { name: "Priya Iyer", email: "priya.iyer@outlook.com", spend: 284_500, orders: 42 },
  { name: "Rohan Mehta", email: "rohan.m@zoho.in", spend: 218_200, orders: 31 },
  { name: "Aarav Sharma", email: "aarav.sharma@gmail.com", spend: 196_800, orders: 28 },
  { name: "Ananya Reddy", email: "ananya.reddy@hey.com", spend: 154_300, orders: 22 },
  { name: "Kabir Bansal", email: "kabir.b@protonmail.com", spend: 132_900, orders: 19 },
];

export const exchangeRates = {
  BTC: 5_812_400,
  ETH: 284_950,
  USDT: 84.22,
};

export interface Settlement {
  id: string;
  date: string;
  amount: number;
  method: "NEFT" | "IMPS" | "RTGS";
  status: "settled" | "processing" | "scheduled";
  utr: string;
}

export const settlements: Settlement[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  const status: Settlement["status"] = i === 0 ? "processing" : i === 1 ? "scheduled" : "settled";
  return {
    id: `stl_${(2000 + i).toString(36).toUpperCase()}`,
    date: d.toISOString(),
    amount: Math.round(120_000 + seeded(i + 900) * 480_000),
    method: (["NEFT","IMPS","RTGS"] as const)[i % 3],
    status,
    utr: `HDFCN${(202600 + i).toString()}${Math.floor(seeded(i+50)*9999).toString().padStart(4,"0")}`,
  };
});

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "payment" | "settlement" | "customer" | "failure" | "security";
  read: boolean;
}

export const seedNotifications: AppNotification[] = [
  { id: "n1", title: "Payment received", body: "₹12,480 via USDT from Priya Iyer", time: "2m ago", type: "payment", read: false },
  { id: "n2", title: "Settlement completed", body: "₹3,42,900 credited to HDFC ••4821", time: "1h ago", type: "settlement", read: false },
  { id: "n3", title: "New customer", body: "Kabir Bansal completed first payment", time: "3h ago", type: "customer", read: false },
  { id: "n4", title: "Failed transaction", body: "BTC transfer from Rohan Mehta expired", time: "Yesterday", type: "failure", read: true },
  { id: "n5", title: "New sign-in", body: "Chrome on macOS · Mumbai, IN", time: "2d ago", type: "security", read: true },
  { id: "n6", title: "Settlement completed", body: "₹1,18,220 credited to HDFC ••4821", time: "3d ago", type: "settlement", read: true },
];

export function formatINR(n: number, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    ...opts,
  }).format(n);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}