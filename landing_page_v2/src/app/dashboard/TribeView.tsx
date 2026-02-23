"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "done" | "skipped";
  skip_reason: string | null;
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
  role: "owner" | "member";
}

const STATUS_COLORS: Record<string, string> = {
  pending: "rgba(255,255,255,0.1)",
  in_progress: "rgba(129,140,248,0.2)",
  done: "rgba(110,231,183,0.2)",
  skipped: "rgba(251,146,60,0.15)",
};
const STATUS_TEXT: Record<string, string> = {
  pending: "#7c849a",
  in_progress: "#818CF8",
  done: "#6EE7B7",
  skipped: "#FB923C",
};

export default function TribeView({ tribeId, userId, displayName, role }: TribeViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [nudging, setNudging] = useState<string | null>(null);
  const [nudgeMsg, setNudgeMsg] = useState<{ id: string; msg: string } | null>(null);
  const [skipModal, setSkipModal] = useState<{ taskId: string; title: string } | null>(null);
  const [skipReason, setSkipReason] = useState("");

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

  async function handleStatusChange(taskId: string, status: string, extra?: Record<string, unknown>) {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...extra }),
    });
    if (res.ok) fetchData();
  }

  async function handleDelete(taskId: string) {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    fetchData();
  }

  async function handleSkipSubmit() {
    if (!skipModal || !skipReason.trim()) return;
    await handleStatusChange(skipModal.taskId, "skipped", { skipReason });
    setSkipModal(null);
    setSkipReason("");
  }

  async function handleNudge(taskId: string) {
    setNudging(taskId);
    const res = await fetch("/api/nudge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, tribeId }),
    });
    const json = await res.json();
    setNudgeMsg({ id: taskId, msg: res.ok ? "👋 Nudge sent!" : (json.error || "Failed") });
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

  const activeTasks = tasks.filter((t) => t.status !== "done" && t.status !== "skipped");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sora font-extrabold text-[#f0f2f8] text-2xl mb-1">Tribe View</h1>
          <p className="text-[#7c849a] text-sm">{activeTasks.length} active task{activeTasks.length !== 1 ? "s" : ""} across your tribe</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-br from-[#6EE7B7] to-[#34d399] text-[#071a10] font-sora font-bold text-[13px] px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          + New Task
        </button>
      </div>

      <div className="mb-10">
        <h2 className="font-sora font-bold text-[#f0f2f8] text-[15px] mb-1">Load Balancer</h2>
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
        <h2 className="font-sora font-bold text-[#f0f2f8] text-[15px] mb-1">All Tasks</h2>
        <p className="text-[#7c849a] text-sm mb-5">Manage tasks, grab unassigned ones, or nudge teammates</p>

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
                {memberTasks.map((task) => {
                  const canDelete = role === "owner" || task.created_by === userId;
                  return (
                    <div key={task.id} className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3 flex items-center gap-3">
                      {isMe && (
                        <button
                          onClick={() => handleStatusChange(task.id, "done")}
                          className="w-5 h-5 rounded-[5px] border-2 shrink-0 flex items-center justify-center transition-all border-[rgba(255,255,255,0.2)] hover:border-[#6EE7B7]"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] text-[#f0f2f8]">{task.title}</p>
                        {task.description && <p className="text-[12px] text-[#7c849a] truncate mt-0.5">{task.description}</p>}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {task.due_date && <span className="text-[11px] text-[#7c849a]">📅 {new Date(task.due_date + "T00:00:00").toLocaleDateString([], { month: "short", day: "numeric" })}</span>}
                          {task.estimated_minutes && <span className="text-[11px] text-[#7c849a]">⏱ {task.estimated_minutes}m</span>}
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded font-sora" style={{ backgroundColor: STATUS_COLORS[task.status], color: STATUS_TEXT[task.status] }}>
                            {task.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {isMe && task.status === "pending" && (
                          <button onClick={() => handleStatusChange(task.id, "in_progress")} className="text-[11px] text-[#818CF8] px-2 py-1 rounded-[6px] border border-[rgba(129,140,248,0.3)] bg-[rgba(129,140,248,0.05)] hover:bg-[rgba(129,140,248,0.15)] transition-colors">
                            Start
                          </button>
                        )}
                        {isMe && (task.status === "pending" || task.status === "in_progress") && (
                          <button onClick={() => setSkipModal({ taskId: task.id, title: task.title })} className="text-[11px] text-[#FB923C] px-2 py-1 rounded-[6px] border border-[rgba(251,146,60,0.3)] bg-[rgba(251,146,60,0.05)] hover:bg-[rgba(251,146,60,0.15)] transition-colors">
                            Skip
                          </button>
                        )}
                        {!isMe && task.status === "pending" && (
                          <button onClick={() => handleGrab(task.id)} className="text-[11px] text-[#818CF8] px-2 py-1 rounded-[6px] border border-[rgba(129,140,248,0.3)] bg-[rgba(129,140,248,0.05)] hover:bg-[rgba(129,140,248,0.15)] transition-colors whitespace-nowrap">
                            ⚡ Grab
                          </button>
                        )}
                        {!isMe && (
                          nudgeMsg?.id === task.id ? (
                            <span className="text-[11px] text-[#6EE7B7] whitespace-nowrap">{nudgeMsg.msg}</span>
                          ) : (
                            <button onClick={() => handleNudge(task.id)} disabled={nudging === task.id} className="text-[11px] text-[#FB923C] px-2 py-1 rounded-[6px] border border-[rgba(251,146,60,0.3)] bg-[rgba(251,146,60,0.05)] hover:bg-[rgba(251,146,60,0.15)] transition-colors whitespace-nowrap disabled:opacity-50">
                              {nudging === task.id ? "..." : "👋 Nudge"}
                            </button>
                          )
                        )}
                        {canDelete && (
                          <button onClick={() => handleDelete(task.id)} className="text-[11px] text-[#7c849a] px-2 py-1 rounded-[6px] hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {activeTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-[#7c849a]">All caught up! No active tasks in the tribe.</p>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateTaskModal tribeId={tribeId} userId={userId} members={members} onClose={() => setShowCreate(false)} onCreated={fetchData} />
      )}

      {skipModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] px-4">
          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-sora font-bold text-[#f0f2f8] mb-1">Skip task</h3>
            <p className="text-[#7c849a] text-sm mb-4">"{skipModal.title}" — why are you skipping?</p>
            <textarea
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value)}
              placeholder="e.g. Already done by someone else..."
              className="w-full bg-[#1c2030] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-[#f0f2f8] placeholder:text-[#7c849a] text-sm resize-none focus:outline-none focus:border-[#6EE7B7] transition-colors mb-4"
              rows={3}
            />
            <div className="flex gap-2">
              <button onClick={() => setSkipModal(null)} className="flex-1 py-2 rounded-xl text-sm text-[#7c849a] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.2)] transition-colors">Cancel</button>
              <button onClick={handleSkipSubmit} className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[rgba(251,146,60,0.15)] text-[#FB923C] hover:bg-[rgba(251,146,60,0.25)] transition-colors">Skip task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateTaskModal({ tribeId, userId, members, onClose, onCreated }: {
  tribeId: string;
  userId: string;
  members: Member[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState(userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tribeId,
        title,
        description: description || null,
        assignedTo,
        estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : null,
        dueDate: dueDate || null,
      }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      setError(error);
      setLoading(false);
      return;
    }
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] px-4">
      <div className="bg-[#14171f] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-sora font-bold text-[#f0f2f8]">New Task</h3>
          <button onClick={onClose} className="text-[#7c849a] hover:text-[#f0f2f8] text-xl">✕</button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[#f0f2f8] text-sm font-medium mb-1.5">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Clean the kitchen"
              className="w-full bg-[#1c2030] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2.5 text-[#f0f2f8] placeholder:text-[#7c849a] text-sm focus:outline-none focus:border-[#6EE7B7] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#f0f2f8] text-sm font-medium mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Optional details..."
              className="w-full bg-[#1c2030] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2.5 text-[#f0f2f8] placeholder:text-[#7c849a] text-sm resize-none focus:outline-none focus:border-[#6EE7B7] transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#f0f2f8] text-sm font-medium mb-1.5">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#1c2030] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2.5 text-[#f0f2f8] text-sm focus:outline-none focus:border-[#6EE7B7] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#f0f2f8] text-sm font-medium mb-1.5">Est. minutes</label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                placeholder="30"
                min="1"
                className="w-full bg-[#1c2030] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2.5 text-[#f0f2f8] placeholder:text-[#7c849a] text-sm focus:outline-none focus:border-[#6EE7B7] transition-colors"
              />
            </div>
          </div>
          {members.length > 0 && (
            <div>
              <label className="block text-[#f0f2f8] text-sm font-medium mb-1.5">Assign to</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-[#1c2030] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2.5 text-[#f0f2f8] text-sm focus:outline-none focus:border-[#6EE7B7] transition-colors"
              >
                {members.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.display_name}{m.user_id === userId ? " (you)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[#7c849a] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.2)] transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#6EE7B7] to-[#34d399] text-[#071a10] hover:opacity-90 transition-opacity disabled:opacity-50 font-sora">
              {loading ? "Creating..." : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
