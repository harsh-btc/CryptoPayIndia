import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { seedNotifications, type AppNotification } from "@/lib/dummy-data";

interface NotificationsCtx {
  items: AppNotification[];
  unread: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const Ctx = createContext<NotificationsCtx | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AppNotification[]>(seedNotifications);

  const value = useMemo<NotificationsCtx>(
    () => ({
      items,
      unread: items.filter((i) => !i.read).length,
      markRead: (id) =>
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i))),
      markAllRead: () => setItems((prev) => prev.map((i) => ({ ...i, read: true }))),
    }),
    [items],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}