"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "done" | "skipped";
  estimated_minutes: number | null;
  due_date: string | null;
  assigned_to: string | null;
  created_by: string;
}

interface Member {
  user_id: string;
  display_name: string;
  avatar_color: string;
  role: string;
}

interface TribeViewProps {
  tribeId: string;
  userId: string;
  displayName: string;
}

export default function TribeView({ tribeId, userId, displayName }: TribeViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [nudging, setNudging] = useState<string | null>(null);
  const [nudgeMsg, setNudgeMsg] = useState<{ id: string; msg: string } | null>(null);

  const fetchData = useCallback(async () => {
    const [tasksRes, settingsRes] = await Promise.all([
      fetch(`/api/tasks?tribe_id=${tribeId}&view=all`),
      fetch(`/api/tribes/settings?tribe_id=${tribeId}`),
    ]);
    if (tasksRes.ok) {
      const { tasks } = await tasksRes.json();
      setTasks(tasks || []);
    }
    if (settingsRes.ok) {
      const { members } = await settingsRes.json();
      setMembers(members || []);
    }
    setLoading(false);
  }, [tribeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("tribe-tasks")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks", filter: `tribe_id=eq.${tribeId}` }, () => {
        fetchData();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tribeId, fetchData]);

  async function handleGrab(taskId: string) {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedTo: userId }),
    });
    if (res.ok) fetchData();
  }

  async function handleNudge(taskId: string) {
    setNudging(taskId);
    const res = await fetch("/api/nudge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, tribeId }),
    });
    const json = await res.json();
    if (res.ok) {
      setNudgeMsg({ id: taskId, msg: "👋 Nudge sent!" });
    } else {
      setNudgeMsg({ id: taskId, msg: json.error || "Failed" });
    }
    setNudging(null);
    setTimeout(() => setNudgeMsg(null), 3000);
  }

  const today = new Date().toISOString().split("T")[0];
  const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  function getMemberLoad(memberId: string) {
    const memberTasks = tasks.filter((t) => t.assigned_to === memberId && t.status !== "done" && t.status !== "skipped");
    const todayCount = memberTasks.filter((t) => !t.due_date || t.due_date <= today).length;
    const weekCount = memberTasks.filter((t) => t.due_date && t.due_date > today && t.due_date <= weekEnd).length;
    return { todayCount, weekCount, total: memberTasks.length };
  }

  const maxLoad = Math.max(...members.map((m) => getMemberLoad(m.user_id).total), 1);

  if (loading) {
    return <div className="text-center py-16 text-[#7c849a]">Loading tribe view...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-sora font-bold text-[#f0f2f8] text-lg mb-1">Load Balancer</h2>
        <p className="text-[#7c849a] text-sm mb-5">See who has how much on their plate</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => {
            const load = getMemberLoad(member.user_id);
            const pct = Math.round((load.total / maxLoad) * 100);
            const isMe = member.user_id === userId;
            return (
              <div key={member.user_id} className={`bg-[#14171f] border rounded-xl p-4 ${isMe ? "border-[rgba(110,231,183,0.3)]" : "border-[rgba(255,255,255,0.07)]"}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold font-sora" style={{ backgroundColor: `${member.avatar_color}20`, color: member.avatar_color }}>
                    {member.display_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#f0f2f8]">{member.display_name}{isMe ? " (you)" : ""}</div>
                    <div className="text-[12px] text-[#7c849a]">{load.todayCount} today · {load.weekCount} this week</div>
                  </div>
                </div>
                <div className="h-[5px] bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: member.avatar_color }} />
                </div>
                <div className="text-[11px] text-[#7c849a] mt-1.5">{load.total} active task{load.total !== 1 ? "s" : ""}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-sora font-bold text-[#f0f2f8] text-lg mb-1">All Tasks</h2>
        <p className="text-[#7c849a] text-sm mb-5">Grab pending tasks or nudge teammates</p>

        {members.map((member) => {
          const memberTasks = tasks.filter((t) => t.assigned_to === member.user_id && t.status !== "done" && t.status !== "skipped");
          if (memberTasks.length === 0) return null;
          const isMe = member.user_id === userId;

          return (
            <div key={member.user_id} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold font-sora" style={{ backgroundColor: `${member.avatar_color}20`, color: member.avatar_color }}>
                  {member.display_name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[14px] font-semibold text-[#f0f2f8]">{member.display_name}{isMe ? " (you)" : ""}</span>
                <span className="text-[12px] text-[#7c849a]">{memberTasks.length} task{memberTasks.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="flex flex-col gap-2 ml-9">
                {memberTasks.map((task) => (
                  <div key={task.id} className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-[#f0f2f8]">{task.title}</p>
                      {task.description && <p className="text-[12px] text-[#7c849a] truncate">{task.description}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        {task.due_date && <span className="text-[11px] text-[#7c849a]">📅 {new Date(task.due_date + "T00:00:00").toLocaleDateString([], { month: "short", day: "numeric" })}</span>}
                        {task.estimated_minutes && <span className="text-[11px] text-[#7c849a]">⏱ {task.estimated_minutes}m</span>}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded font-sora ${task.status === "in_progress" ? "bg-[rgba(129,140,248,0.15)] text-[#818CF8]" : "bg-[rgba(255,255,255,0.06)] text-[#7c849a]"}`}>
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {!isMe && task.status === "pending" && (
                      <button
                        onClick={() => handleGrab(task.id)}
                        className="text-[11px] text-[#818CF8] px-3 py-1.5 rounded-lg border border-[rgba(129,140,248,0.3)] bg-[rgba(129,140,248,0.05)] hover:bg-[rgba(129,140,248,0.15)] transition-colors whitespace-nowrap font-semibold"
                      >
                        ⚡ Grab
                      </button>
                    )}

                    {!isMe && (
                      <div className="relative">
                        {nudgeMsg?.id === task.id ? (
                          <span className="text-[11px] text-[#6EE7B7] whitespace-nowrap">{nudgeMsg.msg}</span>
                        ) : (
                          <button
                            onClick={() => handleNudge(task.id)}
                            disabled={nudging === task.id}
                            className="text-[11px] text-[#FB923C] px-3 py-1.5 rounded-lg border border-[rgba(251,146,60,0.3)] bg-[rgba(251,146,60,0.05)] hover:bg-[rgba(251,146,60,0.15)] transition-colors whitespace-nowrap disabled:opacity-50"
                          >
                            {nudging === task.id ? "..." : "👋 Nudge"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {tasks.filter((t) => t.status !== "done" && t.status !== "skipped").length === 0 && (
          <div className="text-center py-12">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-[#7c849a]">All caught up! No active tasks in the tribe.</p>
          </div>
        )}
      </div>
    </div>
  );
}
