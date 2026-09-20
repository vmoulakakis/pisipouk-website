import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

type Notification = {
  id: string;
  kind: string;
  title: string;
  message: string | null;
  href: string | null;
  read_at: string | null;
  created_at: string;
};

export function NotificationsBell() {
  const { lang } = useLanguage();
  const T = (gr: string, en: string) => (lang === "gr" ? gr : en);
  const [items, setItems] = useState<Notification[]>([]);
  const [meId, setMeId] = useState<string | null>(null);

  const load = useCallback(async (uid: string) => {
    const { data } = await (supabase.from("notifications" as never) as any)
      .select("id,kind,title,message,href,read_at,created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(30);
    setItems((data ?? []) as Notification[]);
  }, []);

  useEffect(() => {
    let channel: any;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id ?? null;
      setMeId(uid);
      if (!uid) return;
      await load(uid);
      channel = supabase
        .channel(`notifications:${uid}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${uid}` },
          () => load(uid),
        )
        .subscribe();
    })();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [load]);

  const unread = items.filter((i) => !i.read_at).length;

  const markAllRead = async () => {
    if (!meId || unread === 0) return;
    await (supabase.from("notifications" as never) as any)
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", meId)
      .is("read_at", null);
    await load(meId);
  };

  const markRead = async (id: string) => {
    if (!meId) return;
    await (supabase.from("notifications" as never) as any)
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative rounded-full gap-2" aria-label={T("Ειδοποιήσεις", "Notifications")}>
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-border p-3">
          <p className="text-sm font-semibold">{T("Ειδοποιήσεις", "Notifications")}</p>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={markAllRead}>
              <CheckCheck className="h-3 w-3" />
              {T("Όλα ως αναγνωσμένα", "Mark all read")}
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[400px]">
          {items.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {T("Δεν υπάρχουν ειδοποιήσεις", "No notifications yet")}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => {
                const body = (
                  <div className={`flex flex-col gap-1 p-3 text-left transition-colors hover:bg-muted ${!n.read_at ? "bg-primary/5" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{n.title}</p>
                      {!n.read_at && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </div>
                    {n.message && <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>}
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(n.created_at).toLocaleString(lang === "gr" ? "el-GR" : "en-GB")}
                    </p>
                  </div>
                );
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <Link to={n.href} onClick={() => markRead(n.id)} className="block">
                        {body}
                      </Link>
                    ) : (
                      <button type="button" onClick={() => markRead(n.id)} className="block w-full">
                        {body}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}