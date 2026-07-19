import { useState } from "react";
import { Bell, Search, Sun, Moon, Check, HelpCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNotifications } from "./notifications-context";
import { useTheme } from "./theme-provider";
import { toast } from "sonner";

export function TopNavbar() {
  const { items, unread, markRead, markAllRead } = useNotifications();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <SidebarTrigger className="-ml-1" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) toast.success(`Searching for "${query.trim()}"`);
        }}
        className="relative hidden max-w-md flex-1 md:block"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transactions, customers, invoices…"
          className="h-10 rounded-xl border-border bg-muted/40 pl-9"
        />
      </form>
      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {unread}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
            <SheetHeader className="flex-row items-center justify-between border-b border-border px-5 py-4">
              <SheetTitle className="text-base">Notifications</SheetTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => {
                  markAllRead();
                  toast.success("Marked all as read");
                }}
              >
                <Check className="h-3.5 w-3.5" /> Mark all read
              </Button>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">You're all caught up.</div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((n) => (
                    <li
                      key={n.id}
                      onClick={() => !n.read && markRead(n.id)}
                      className={cn(
                        "cursor-pointer px-5 py-4 transition-colors hover:bg-muted/50",
                        !n.read && "bg-primary/[0.04]",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                            n.read ? "bg-muted-foreground/30" : "bg-primary",
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-medium">{n.title}</p>
                            <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">SR</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Saanvi Retail Pvt Ltd</span>
                <span className="text-xs font-normal text-muted-foreground">admin@saanvi.in</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Business profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast("Signed out (demo)")}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Badge variant="outline" className="ml-2 hidden rounded-full border-primary/30 bg-primary/5 text-[11px] font-medium text-primary lg:inline-flex">
          Live mode
        </Badge>
      </div>
    </header>
  );
}