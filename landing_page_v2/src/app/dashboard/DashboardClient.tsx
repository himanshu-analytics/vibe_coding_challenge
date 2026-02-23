"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import TopNav from "@/components/app/TopNav";
import TribeView from "./TribeView";

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
  tribe_id: string;
  created_at: string;
  assignee?: { display_name: string; avatar_color: string } | null;
}

interface DashboardClientProps {
  userId: string;
  tribeId: string;
  tribeName: string;
  inviteCode: string;
  displayName: string;
  avatarColor: string;
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

export default function DashboardClient({
  userId, tribeId, tribeName, inviteCode, displayName, avatarColor, role,
}: DashboardClientProps) {
  const [view, setView] = useState<"my" | "tribe">("my");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [skipModal, setSkipModal] = useState<{ taskId: string; title: string } | null>(null);
  const [skipReason, setSkipReason] = useState("");

  const fetchTasks = useCallback(async () => {
    const res = await fetch(`/api/tasks?tribe_id=${tribeId}&view=${view}`);
    if (res.ok) {
      const { tasks } = await res.json();
      setTasks(tasks || []);
    }
    setLoading(false);
  }, [tribeId, view]);

  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("tasks")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks", filter: `tribe_id=eq.${tribeId}` }, () => {
        fetchTasks();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tribeId, fetchTasks]);

  async function updateTaskStatus(taskId: string, status: string, extra?: Record<string, unknown>) {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...extra }),
    });
    if (res.ok) fetchTasks();
  }

  async function deleteTask(taskId: string) {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    fetchTasks();
  }

  async function handleSkipSubmit() {
    if (!skipModal || !skipReason.trim()) return;
    await updateTaskStatus(skipModal.taskId, "skipped", { skipReason });
    setSkipModal(null);
    setSkipReason("");
  }

  const today = new Date().toISOString().split("T")[0];
  const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const todayTasks = tasks.filter((t) => t.due_date === today || (!t.due_date && t.status !== "done"));
  const weekTasks = tasks.filter((t) => t.due_date && t.due_date > today && t.due_date <= weekEnd);
  const doneTasks = tasks.filter((t) => t.status === "done");

  if (view === "tribe") {
    return (
      <>
        <TopNav tribeName={tribeName} tribeId={tribeId} displayName={displayName} avatarColor={avatarColor} />
        <div className="pt-[60px] min-h-screen">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setView("my")} className="px-3 py-1.5 rounded-lg text-[13px] text-[#7c849a] hover:text-[#f0f2f8] hover:bg-[rgba(255,255,255,0.05)] transition-colors">My Tasks</button>
              <button className="px-3 py-1.5 rounded-lg text-[13px] bg-[rgba(110,231,183,0.1)] text-[#6EE7B7] font-semibold">Tribe View</button>
            </div>
            <TribeView tribeId={tribeId} userId={userId} displayName={displayName} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav tribeName={tribeName} tribeId={tribeId} displayName={displayName} avatarColor={avatarColor} />
      <div className="pt-[60px] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button className="px-3 py-1.5 rounded-lg text-[13px] bg-[rgba(110,231,183,0.1)] text-[#6EE7B7] font-semibold">My Tasks</button>
              <button onClick={() => setView("tribe")} className="px-3 py-1.5 rounded-lg text-[13px] text-[#7c849a] hover:text-[#f0f2f8] hover:bg-[rgba(255,255,255,0.05)] transition-colors">Tribe View</button>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-gradient-to-br from-[#6EE7B7] to-[#34d399] text-[#071a10] font-sora font-bold text-[13px] px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              + New Task
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#7c849a]">Loading tasks...</div>
          ) : (
            <>
              <TaskGroup title="Today" tasks={todayTasks} userId={userId} role={role} onStatusChange={updateTaskStatus} onDelete={deleteTask} onSkip={(id, title) => setSkipModal({ taskId: id, title })} />
              <TaskGroup title="This Week" tasks={weekTasks} userId={userId} role={role} onStatusChange={updateTaskStatus} onDelete={deleteTask} onSkip={(id, title) => setSkipModal({ taskId: id, title })} />
              {doneTasks.length > 0 && <TaskGroup title="Completed" tasks={doneTasks} userId={userId} role={role} onStatusChange={updateTaskStatus} onDelete={deleteTask} onSkip={(id, title) => setSkipModal({ taskId: id, title })} />}

              {tasks.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-[#7c849a]">No tasks yet. Create one to get started!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showCreate && (
        <CreateTaskModal
          tribeId={tribeId}
          userId={userId}
          onClose={() => setShowCreate(false)}
          onCreated={fetchTasks}
        />
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
    </>
  );
}

function TaskGroup({ title, tasks, userId, role, onStatusChange, onDelete, onSkip }: {
  title: string;
  tasks: Task[];
  userId: string;
  role: "owner" | "member";
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onSkip: (id: string, title: string) => void;
}) {
  if (tasks.length === 0) return null;
  return (
    <div className="mb-8">
      <div className="text-[11px] text-[#7c849a] font-semibold tracking-[0.8px] uppercase mb-3">{title} · {tasks.length}</div>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} userId={userId} role={role} onStatusChange={onStatusChange} onDelete={onDelete} onSkip={onSkip} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, userId, role, onStatusChange, onDelete, onSkip }: {
  task: Task;
  userId: string;
  role: "owner" | "member";
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onSkip: (id: string, title: string) => void;
}) {
  const isDone = task.status === "done";
  const isSkipped = task.status === "skipped";
  const canDelete = role === "owner" || task.created_by === userId;

  return (
    <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3 flex items-center gap-3">
      <button
        onClick={() => onStatusChange(task.id, isDone ? "pending" : "done")}
        className={`w-5 h-5 rounded-[5px] border-2 shrink-0 flex items-center justify-center transition-all ${isDone ? "border-[#6EE7B7] bg-[#6EE7B7]" : "border-[rgba(255,255,255,0.2)] hover:border-[#6EE7B7]"}`}
      >
        {isDone && <span className="text-[#14171f] text-[11px] font-bold">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-[14px] ${isDone || isSkipped ? "line-through text-[#7c849a]" : "text-[#f0f2f8]"}`}>{task.title}</p>
        {task.description && <p className="text-[12px] text-[#7c849a] truncate mt-0.5">{task.description}</p>}
        {task.skip_reason && <p className="text-[11px] text-[#FB923C] mt-0.5">Skipped: {task.skip_reason}</p>}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {task.due_date && <span className="text-[11px] text-[#7c849a]">📅 {new Date(task.due_date + "T00:00:00").toLocaleDateString([], { month: "short", day: "numeric" })}</span>}
          {task.estimated_minutes && <span className="text-[11px] text-[#7c849a]">⏱ {task.estimated_minutes}m</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-semibold px-2 py-1 rounded-[6px] font-sora" style={{ backgroundColor: STATUS_COLORS[task.status], color: STATUS_TEXT[task.status] }}>
          {task.status.replace("_", " ")}
        </span>

        {task.status === "pending" && (
          <button
            onClick={() => onStatusChange(task.id, "in_progress")}
            className="text-[11px] text-[#818CF8] px-2 py-1 rounded-[6px] border border-[rgba(129,140,248,0.3)] bg-[rgba(129,140,248,0.05)] hover:bg-[rgba(129,140,248,0.15)] transition-colors whitespace-nowrap"
          >
            Start
          </button>
        )}

        {(task.status === "pending" || task.status === "in_progress") && (
          <button
            onClick={() => onSkip(task.id, task.title)}
            className="text-[11px] text-[#FB923C] px-2 py-1 rounded-[6px] border border-[rgba(251,146,60,0.3)] bg-[rgba(251,146,60,0.05)] hover:bg-[rgba(251,146,60,0.15)] transition-colors"
          >
            Skip
          </button>
        )}

        {canDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="text-[11px] text-[#7c849a] px-2 py-1 rounded-[6px] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function CreateTaskModal({ tribeId, userId, onClose, onCreated }: {
  tribeId: string;
  userId: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [members, setMembers] = useState<{ user_id: string; display_name: string; avatar_color: string }[]>([]);
  const [assignedTo, setAssignedTo] = useState(userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/tribes/settings?tribe_id=${tribeId}`)
      .then((r) => r.json())
      .then(({ members }) => setMembers(members || []));
  }, [tribeId]);

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
