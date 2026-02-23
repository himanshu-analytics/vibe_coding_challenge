"use client";
import { useState, useEffect, useCallback } from "react";
import TopNav from "@/components/app/TopNav";

interface Member {
  id: string;
  user_id: string;
  display_name: string;
  avatar_color: string;
  role: string;
  joined_at: string;
}

interface SettingsClientProps {
  userId: string;
  tribeId: string;
  tribeName: string;
  inviteCode: string;
  displayName: string;
  avatarColor: string;
  role: "owner" | "member";
}

export default function SettingsClient({
  userId, tribeId, tribeName: initialTribeName, inviteCode: initialInviteCode,
  displayName, avatarColor, role,
}: SettingsClientProps) {
  const [tribeName, setTribeName] = useState(initialTribeName);
  const [inviteCode, setInviteCode] = useState(initialInviteCode);
  const [members, setMembers] = useState<Member[]>([]);
  const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(initialTribeName);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchSettings = useCallback(async () => {
    const res = await fetch(`/api/tribes/settings?tribe_id=${tribeId}`);
    if (res.ok) {
      const { tribe, members, subscription } = await res.json();
      if (tribe) setTribeName(tribe.name);
      setMembers(members || []);
      setSubscription(subscription);
    }
  }, [tribeId]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  function flash(message: string) {
    setMsg(message);
    setTimeout(() => setMsg(""), 3000);
  }

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/tribes/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tribeId, action: "rename", name: newName }),
    });
    if (res.ok) {
      setTribeName(newName);
      setEditingName(false);
      flash("✓ Tribe renamed");
    }
    setLoading(false);
  }

  async function handleRegenerateCode() {
    if (!confirm("Regenerate the invite code? The old code will stop working.")) return;
    const res = await fetch("/api/tribes/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tribeId, action: "regenerate_code" }),
    });
    if (res.ok) {
      const { inviteCode: newCode } = await res.json();
      setInviteCode(newCode);
      flash("✓ Invite code regenerated");
    }
  }

  async function handleRemoveMember(memberId: string, name: string) {
    if (!confirm(`Remove ${name} from the tribe?`)) return;
    const res = await fetch("/api/tribes/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tribeId, action: "remove_member", memberId }),
    });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      flash("✓ Member removed");
    }
  }

  async function handleUpgrade(plan: string) {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, tribeId }),
    });
    if (res.ok) {
      const { url } = await res.json();
      if (url) window.location.href = url;
    }
  }

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <>
      <TopNav tribeName={tribeName} tribeId={tribeId} displayName={displayName} avatarColor={avatarColor} />
      <div className="pt-[60px] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="font-sora font-bold text-2xl text-[#f0f2f8] mb-1">Settings</h1>
          <p className="text-[#7c849a] text-sm mb-8">Manage your tribe and account</p>

          {msg && (
            <div className="mb-4 p-3 bg-[rgba(110,231,183,0.1)] border border-[rgba(110,231,183,0.3)] rounded-xl text-[#6EE7B7] text-sm">
              {msg}
            </div>
          )}

          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 mb-5">
            <h2 className="font-sora font-bold text-[#f0f2f8] mb-4">Tribe Info</h2>

            <div className="mb-5">
              <div className="text-[12px] text-[#7c849a] mb-1">Tribe name</div>
              {editingName ? (
                <form onSubmit={handleRename} className="flex gap-2">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 bg-[#1c2030] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-[#f0f2f8] text-sm focus:outline-none focus:border-[#6EE7B7] transition-colors"
                  />
                  <button type="submit" disabled={loading} className="px-4 py-2 bg-[#6EE7B7] text-[#071a10] rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">Save</button>
                  <button type="button" onClick={() => setEditingName(false)} className="px-4 py-2 text-[#7c849a] rounded-xl text-sm border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.2)] transition-colors">Cancel</button>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[#f0f2f8] font-semibold">{tribeName}</span>
                  {role === "owner" && (
                    <button onClick={() => { setEditingName(true); setNewName(tribeName); }} className="text-[#6EE7B7] text-sm hover:underline">Rename</button>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="text-[12px] text-[#7c849a] mb-1">Invite code</div>
              <div className="flex items-center justify-between bg-[#1c2030] rounded-xl px-4 py-3">
                <span className="font-mono text-[#6EE7B7] text-lg font-bold tracking-widest">{inviteCode}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { navigator.clipboard.writeText(`${appUrl}/onboarding?code=${inviteCode}`); flash("✓ Link copied!"); }}
                    className="text-[12px] text-[#7c849a] px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.2)] transition-colors"
                  >
                    Copy link
                  </button>
                  {role === "owner" && (
                    <button onClick={handleRegenerateCode} className="text-[12px] text-[#FB923C] px-3 py-1.5 rounded-lg border border-[rgba(251,146,60,0.3)] bg-[rgba(251,146,60,0.05)] hover:bg-[rgba(251,146,60,0.15)] transition-colors">
                      Regenerate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 mb-5">
            <h2 className="font-sora font-bold text-[#f0f2f8] mb-4">Members · {members.length}</h2>
            <div className="flex flex-col gap-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 py-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold font-sora" style={{ backgroundColor: `${member.avatar_color}20`, color: member.avatar_color }}>
                    {member.display_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] text-[#f0f2f8] font-medium">
                      {member.display_name}
                      {member.user_id === userId && <span className="text-[#7c849a] ml-1">(you)</span>}
                    </div>
                    <div className="text-[12px] text-[#7c849a]">{member.role}</div>
                  </div>
                  {role === "owner" && member.user_id !== userId && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.display_name)}
                      className="text-[12px] text-[#7c849a] px-3 py-1.5 rounded-lg hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 mb-5">
            <h2 className="font-sora font-bold text-[#f0f2f8] mb-1">Plan</h2>
            <p className="text-[#7c849a] text-sm mb-5">
              Current plan: <span className="text-[#6EE7B7] font-semibold capitalize">{subscription?.plan || "Free"}</span>
              {subscription?.status && subscription.status !== "active" && (
                <span className="text-[#FB923C] ml-2">({subscription.status})</span>
              )}
            </p>
            {(!subscription || subscription.plan === "free") && (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="border border-[rgba(255,255,255,0.07)] rounded-xl p-4">
                  <div className="font-sora font-bold text-[#f0f2f8] mb-1">Tribe</div>
                  <div className="text-[#6EE7B7] font-bold text-lg mb-3">$6<span className="text-[#7c849a] text-sm font-normal">/mo</span></div>
                  <ul className="text-[#7c849a] text-sm space-y-1 mb-4">
                    <li>✓ Recurring task templates</li>
                    <li>✓ Load analytics</li>
                    <li>✓ Priority support</li>
                  </ul>
                  <button onClick={() => handleUpgrade("tribe")} className="w-full py-2 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#6EE7B7] to-[#34d399] text-[#071a10] hover:opacity-90 transition-opacity font-sora">
                    Upgrade to Tribe
                  </button>
                </div>
                <div className="border border-[rgba(129,140,248,0.3)] rounded-xl p-4">
                  <div className="font-sora font-bold text-[#f0f2f8] mb-1">Community</div>
                  <div className="text-[#818CF8] font-bold text-lg mb-3">$15<span className="text-[#7c849a] text-sm font-normal">/mo</span></div>
                  <ul className="text-[#7c849a] text-sm space-y-1 mb-4">
                    <li>✓ Everything in Tribe</li>
                    <li>✓ Tribe streaks</li>
                    <li>✓ Advanced analytics</li>
                  </ul>
                  <button onClick={() => handleUpgrade("community")} className="w-full py-2 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#818CF8] to-[#a78bfa] text-white hover:opacity-90 transition-opacity font-sora">
                    Upgrade to Community
                  </button>
                </div>
              </div>
            )}
          </div>

          {role === "owner" && (
            <div className="bg-[#14171f] border border-red-500/20 rounded-2xl p-6">
              <h2 className="font-sora font-bold text-red-400 mb-2">Danger Zone</h2>
              <p className="text-[#7c849a] text-sm mb-4">These actions cannot be easily undone.</p>
              <button
                onClick={async () => {
                  if (!confirm("Archive this tribe? All data will be preserved but the tribe will be inactive.")) return;
                  await fetch("/api/tribes/settings", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tribeId, action: "archive" }),
                  });
                  flash("Tribe archived.");
                }}
                className="px-4 py-2 rounded-xl text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
              >
                Archive tribe
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
