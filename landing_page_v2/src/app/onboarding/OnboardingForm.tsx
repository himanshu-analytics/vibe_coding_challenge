"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const AVATAR_COLORS = [
  { label: "Emerald", value: "#6EE7B7" },
  { label: "Violet", value: "#818CF8" },
  { label: "Orange", value: "#FB923C" },
  { label: "Pink", value: "#F472B6" },
  { label: "Teal", value: "#34D399" },
  { label: "Purple", value: "#A78BFA" },
];

export default function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledCode = searchParams.get("code") || "";

  const [tab, setTab] = useState<"create" | "join">(prefilledCode ? "join" : "create");
  const [displayName, setDisplayName] = useState("");
  const [tribeName, setTribeName] = useState("");
  const [inviteCode, setInviteCode] = useState(prefilledCode);
  const [avatarColor, setAvatarColor] = useState("#6EE7B7");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/tribes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tribeName, displayName, avatarColor }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Something went wrong");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/tribes/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode, displayName }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Something went wrong");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0d0f14]">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-[#6EE7B7] to-[#818CF8] rounded-[10px] flex items-center justify-center text-lg">🏕️</div>
            <span className="font-sora font-extrabold text-xl text-[#f0f2f8]">TribeTask</span>
          </a>
          <h1 className="font-sora text-2xl font-bold text-[#f0f2f8] mb-2">Set up your tribe</h1>
          <p className="text-[#7c849a] text-sm">Create a new tribe or join an existing one</p>
        </div>

        <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden">
          <div className="flex border-b border-[rgba(255,255,255,0.07)]">
            {(["create", "join"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-semibold font-sora transition-colors ${tab === t ? "text-[#6EE7B7] border-b-2 border-[#6EE7B7]" : "text-[#7c849a] hover:text-[#f0f2f8]"}`}
              >
                {t === "create" ? "Create a tribe" : "Join a tribe"}
              </button>
            ))}
          </div>

          <form onSubmit={tab === "create" ? handleCreate : handleJoin} className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-[#f0f2f8] text-sm font-medium mb-2">Your display name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="e.g. Alex J."
                className="w-full bg-[#1c2030] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-[#f0f2f8] placeholder:text-[#7c849a] text-sm focus:outline-none focus:border-[#6EE7B7] transition-colors"
              />
            </div>

            <div className="mb-5">
              <label className="block text-[#f0f2f8] text-sm font-medium mb-2">Avatar color</label>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setAvatarColor(c.value)}
                    className={`w-8 h-8 rounded-full transition-all ${avatarColor === c.value ? "ring-2 ring-offset-2 ring-offset-[#14171f] ring-white scale-110" : ""}`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {tab === "create" ? (
              <div className="mb-5">
                <label className="block text-[#f0f2f8] text-sm font-medium mb-2">Tribe name</label>
                <input
                  type="text"
                  value={tribeName}
                  onChange={(e) => setTribeName(e.target.value)}
                  required
                  placeholder="e.g. Apartment 4B"
                  className="w-full bg-[#1c2030] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-[#f0f2f8] placeholder:text-[#7c849a] text-sm focus:outline-none focus:border-[#6EE7B7] transition-colors"
                />
              </div>
            ) : (
              <div className="mb-5">
                <label className="block text-[#f0f2f8] text-sm font-medium mb-2">Invite code</label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  required
                  maxLength={6}
                  placeholder="e.g. ABC123"
                  className="w-full bg-[#1c2030] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-[#f0f2f8] placeholder:text-[#7c849a] text-sm focus:outline-none focus:border-[#6EE7B7] transition-colors tracking-widest font-mono uppercase"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-[#6EE7B7] to-[#34d399] text-[#071a10] font-sora font-bold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Setting up..." : tab === "create" ? "Create tribe →" : "Join tribe →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
