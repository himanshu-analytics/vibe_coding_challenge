"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Nudge {
  id: string;
  read: boolean;
  sent_at: string;
  task: { id: string; title: string } | null;
  sender: { display_name: string; avatar_color: string } | null;
}

interface TopNavProps {
  tribeName: string;
  tribeId: string;
  displayName: string;
  avatarColor: string;
}

export default function TopNav({ tribeName, tribeId, displayName, avatarColor }: TopNavProps) {
  const router = useRouter();
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = nudges.filter((n) => !n.read).length;

  useEffect(() => {
    async function fetchNudges() {
      const res = await fetch(`/api/nudge?tribe_id=${tribeId}`);
      if (res.ok) {
        const { nudges } = await res.json();
        setNudges(nudges || []);
      }
    }
    fetchNudges();

    const supabase = createClient();
    const channel = supabase
      .channel("nudges")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "nudges" }, () => {
        fetchNudges();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tribeId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleOpenNotifs() {
    setShowNotifs((v) => !v);
    const unread = nudges.filter((n) => !n.read).map((n) => n.id);
    if (unread.length > 0) {
      await fetch("/api/nudge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nudgeIds: unread }),
      });
      setNudges((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-[60px] bg-[#0d0f14]/90 backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.07)] flex items-center px-4 md:px-6 gap-4">
      <a href="/" className="flex items-center gap-2 shrink-0">
        <div className="w-[30px] h-[30px] bg-gradient-to-br from-[#6EE7B7] to-[#818CF8] rounded-[8px] flex items-center justify-center text-[13px]">🏕️</div>
        <span className="font-sora font-extrabold text-[16px] text-[#f0f2f8] hidden sm:block">TribeTask</span>
      </a>

      <div className="h-4 w-px bg-[rgba(255,255,255,0.1)] hidden sm:block" />

      <span className="text-[#6EE7B7] font-sora font-semibold text-[14px] truncate max-w-[160px]">{tribeName}</span>

      <nav className="hidden md:flex items-center gap-1 ml-4">
        <a href="/dashboard" className="px-3 py-1.5 rounded-lg text-[13px] text-[#7c849a] hover:text-[#f0f2f8] hover:bg-[rgba(255,255,255,0.05)] transition-colors">My Tasks</a>
        <a href="/dashboard/tribe" className="px-3 py-1.5 rounded-lg text-[13px] text-[#7c849a] hover:text-[#f0f2f8] hover:bg-[rgba(255,255,255,0.05)] transition-colors">Tribe View</a>
        <a href="/settings" className="px-3 py-1.5 rounded-lg text-[13px] text-[#7c849a] hover:text-[#f0f2f8] hover:bg-[rgba(255,255,255,0.05)] transition-colors">Settings</a>
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleOpenNotifs}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#7c849a] hover:text-[#f0f2f8] hover:bg-[rgba(255,255,255,0.05)] transition-colors relative"
          >
            <span className="text-[18px]">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FB923C] rounded-full text-[10px] font-bold text-white flex items-center justify-center font-sora">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 bg-[#14171f] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
                <span className="text-[13px] font-semibold text-[#f0f2f8] font-sora">Notifications</span>
              </div>
              {nudges.length === 0 ? (
                <div className="px-4 py-6 text-center text-[#7c849a] text-sm">No notifications yet</div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {nudges.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0 ${!n.read ? "bg-[rgba(110,231,183,0.03)]" : ""}`}>
                      <div className="flex items-start gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                          style={{ backgroundColor: `${n.sender?.avatar_color}20`, color: n.sender?.avatar_color }}
                        >
                          {n.sender?.display_name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-[#f0f2f8] leading-tight">
                            <span className="font-semibold">{n.sender?.display_name}</span> nudged you
                          </p>
                          <p className="text-[12px] text-[#7c849a] truncate mt-0.5">{n.task?.title}</p>
                          <p className="text-[11px] text-[#7c849a] mt-1">
                            {new Date(n.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-[#6EE7B7] rounded-full mt-1.5 shrink-0" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold font-sora"
            style={{ backgroundColor: `${avatarColor}20`, color: avatarColor }}
          >
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-[13px] text-[#f0f2f8] hidden md:block">{displayName}</span>
        </div>

        <button
          onClick={handleSignOut}
          className="text-[#7c849a] text-[13px] hover:text-[#f0f2f8] transition-colors px-2 py-1 rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
