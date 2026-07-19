import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2, Receipt, Landmark, Bell, Palette, Languages, Lock, LifeBuoy, Info, LogOut,
  Sun, Moon, Monitor, Check,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · CryptoPay India" },
      { name: "description", content: "Manage your business profile, bank accounts, notifications and appearance." },
    ],
  }),
  component: SettingsPage,
});

const nav = [
  { id: "profile", label: "Business profile", icon: Building2 },
  { id: "gst", label: "GST & tax", icon: Receipt },
  { id: "bank", label: "Bank accounts", icon: Landmark },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "language", label: "Language", icon: Languages },
  { id: "security", label: "Security", icon: Lock },
  { id: "help", label: "Help & support", icon: LifeBuoy },
  { id: "about", label: "About", icon: Info },
];

function SettingsPage() {
  const [active, setActive] = useState("profile");
  const { theme, setTheme } = useTheme();
  const [notif, setNotif] = useState({ payments: true, settlements: true, marketing: false, weekly: true });

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <PageHeader title="Settings" description="Manage your account, preferences and integrations." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit border-border/70 p-2 shadow-sm">
          <nav className="flex flex-col">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
            <Separator className="my-2" />
            <button
              onClick={() => toast("Signed out (demo)")}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </nav>
        </Card>

        <div className="min-w-0 space-y-6">
          {active === "profile" && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader><CardTitle className="text-base font-semibold">Business profile</CardTitle></CardHeader>
              <CardContent>
                <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved"); }}>
                  <div className="space-y-2"><Label>Legal name</Label><Input defaultValue="Saanvi Retail Pvt Ltd" /></div>
                  <div className="space-y-2"><Label>Display name</Label><Input defaultValue="Saanvi Store" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" defaultValue="admin@saanvi.in" /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
                  <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input defaultValue="304, Solitaire Corporate Park, Andheri East, Mumbai 400093" /></div>
                  <div className="sm:col-span-2 flex justify-end gap-2"><Button variant="outline" type="button">Cancel</Button><Button type="submit">Save changes</Button></div>
                </form>
              </CardContent>
            </Card>
          )}

          {active === "gst" && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader><CardTitle className="text-base font-semibold">GST & tax</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>GSTIN</Label><Input defaultValue="27AABCS1429B1Z2" /></div>
                <div className="space-y-2"><Label>PAN</Label><Input defaultValue="AABCS1429B" /></div>
                <div className="space-y-2"><Label>Trade name</Label><Input defaultValue="Saanvi Retail" /></div>
                <div className="space-y-2"><Label>State</Label><Input defaultValue="Maharashtra" /></div>
                <div className="sm:col-span-2 flex justify-end"><Button onClick={() => toast.success("Tax details verified")}>Verify</Button></div>
              </CardContent>
            </Card>
          )}

          {active === "bank" && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader><CardTitle className="text-base font-semibold">Bank accounts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { bank: "HDFC Bank", type: "Current", num: "•••• 4821", primary: true },
                  { bank: "ICICI Bank", type: "Savings", num: "•••• 1902", primary: false },
                ].map((b) => (
                  <div key={b.num} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Landmark className="h-5 w-5" /></div>
                      <div>
                        <p className="text-sm font-medium">{b.bank} · {b.type}</p>
                        <p className="font-mono text-xs text-muted-foreground">{b.num}</p>
                      </div>
                    </div>
                    {b.primary ? (
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Primary</span>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => toast.success("Set as primary")}>Set primary</Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => toast("Add bank account")}>+ Add bank account</Button>
              </CardContent>
            </Card>
          )}

          {active === "notifications" && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader><CardTitle className="text-base font-semibold">Notifications</CardTitle></CardHeader>
              <CardContent className="divide-y divide-border">
                {([
                  ["payments", "Payment received", "Get notified for every incoming payment"],
                  ["settlements", "Settlement updates", "Bank credit confirmations and UTR"],
                  ["marketing", "Product updates", "Occasional news and feature releases"],
                  ["weekly", "Weekly summary", "Every Monday at 9:00 IST"],
                ] as const).map(([key, title, desc]) => (
                  <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Switch checked={notif[key]} onCheckedChange={(v) => { setNotif((n) => ({ ...n, [key]: v })); toast(`${title}: ${v ? "on" : "off"}`); }} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {active === "appearance" && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader><CardTitle className="text-base font-semibold">Appearance</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Choose how CryptoPay India looks for you. Your selection is saved on this device.</p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {([
                    ["light", "Light", Sun, "Bright, high contrast"],
                    ["dark", "Dark", Moon, "Easy on the eyes"],
                    ["system", "System", Monitor, "Match your device"],
                  ] as const).map(([value, label, Icon, hint]) => (
                    <button
                      key={value}
                      onClick={() => { setTheme(value); toast.success(`${label} mode enabled`); }}
                      className={cn(
                        "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
                        theme === value ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:bg-muted/40",
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <Icon className="h-4 w-4" />
                        {theme === value && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{hint}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {active === "language" && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader><CardTitle className="text-base font-semibold">Language & region</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Language</Label><Input defaultValue="English (India)" /></div>
                <div className="space-y-2"><Label>Currency</Label><Input defaultValue="INR — Indian Rupee" /></div>
                <div className="space-y-2"><Label>Timezone</Label><Input defaultValue="Asia/Kolkata (IST)" /></div>
                <div className="space-y-2"><Label>Date format</Label><Input defaultValue="DD MMM YYYY" /></div>
              </CardContent>
            </Card>
          )}

          {active === "security" && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader><CardTitle className="text-base font-semibold">Security</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div><p className="text-sm font-medium">Two-factor authentication</p><p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p></div>
                  <Switch defaultChecked onCheckedChange={(v) => toast(`2FA ${v ? "enabled" : "disabled"}`)} />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div><p className="text-sm font-medium">Login alerts</p><p className="text-xs text-muted-foreground">Email me when a new device signs in</p></div>
                  <Switch defaultChecked />
                </div>
                <Button variant="outline" onClick={() => toast.success("Password reset link sent")}>Change password</Button>
              </CardContent>
            </Card>
          )}

          {active === "help" && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader><CardTitle className="text-base font-semibold">Help & support</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {["Documentation", "Contact support", "Status page", "API reference"].map((x) => (
                  <button key={x} onClick={() => toast(`${x} opened`)} className="rounded-xl border border-border p-4 text-left text-sm font-medium transition-colors hover:bg-muted/50">{x}</button>
                ))}
              </CardContent>
            </Card>
          )}

          {active === "about" && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader><CardTitle className="text-base font-semibold">About</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Product</span> · CryptoPay India</p>
                <p><span className="text-muted-foreground">Version</span> · 1.4.0</p>
                <p><span className="text-muted-foreground">Environment</span> · Live</p>
                <p className="pt-2 text-xs text-muted-foreground">A UI/UX case study exploring what a merchant crypto-settlement dashboard could look like for Indian businesses.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}