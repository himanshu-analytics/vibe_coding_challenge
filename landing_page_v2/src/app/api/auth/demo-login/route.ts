import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return NextResponse.json({ error: "Demo mode is not enabled" }, { status: 403 });
  }

  const email = process.env.DEMO_USER_EMAIL;
  const password = process.env.DEMO_USER_PASSWORD;

  if (!email || !password) {
    return NextResponse.json({ error: "Demo credentials not configured" }, { status: 500 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message || "Demo login failed" }, { status: 401 });
  }

  const { data: membership } = await supabase
    .from("tribe_members")
    .select("tribe_id")
    .eq("user_id", data.user.id)
    .limit(1)
    .single();

  const redirectTo = membership ? "/dashboard" : "/onboarding";
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}${redirectTo}`, { status: 303 });
}
