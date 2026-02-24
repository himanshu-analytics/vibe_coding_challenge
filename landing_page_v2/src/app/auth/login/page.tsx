"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0d0f14]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-[#6EE7B7] to-[#818CF8] rounded-[10px] flex items-center justify-center text-lg">🏕️</div>
            <span className="font-sora font-extrabold text-xl text-[#f0f2f8]">TribeTask</span>
          </a>
          <h1 className="font-sora text-2xl font-bold text-[#f0f2f8] mb-2">
            {submitted ? "Check your email" : "Sign in to TribeTask"}
          </h1>
          <p className="text-[#7c849a] text-sm">
            {submitted
              ? `We sent a magic link to ${email}`
              : "No password needed — we'll send you a magic link"}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="mb-5">
              <label className="block text-[#f0f2f8] text-sm font-medium mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-[#1c2030] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-[#f0f2f8] placeholder:text-[#7c849a] text-sm focus:outline-none focus:border-[#6EE7B7] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-[#6EE7B7] to-[#34d399] text-[#071a10] font-sora font-bold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send magic link →"}
            </button>

            {DEMO_MODE && (
              <form action="/api/auth/demo-login" method="POST" className="mt-4">
                <button
                  type="submit"
                  className="w-full bg-[#1c2030] border border-[rgba(255,255,255,0.1)] text-[#6EE7B7] font-sora font-semibold py-3 rounded-xl text-sm hover:border-[#6EE7B7] transition-colors"
                >
                  🎬 Try Demo (no email needed)
                </button>
              </form>
            )}
          </form>
        ) : (
          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">📬</div>
            <p className="text-[#7c849a] text-sm mb-4">
              Click the link in your email to sign in. It expires in 1 hour.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[#6EE7B7] text-sm hover:underline"
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
