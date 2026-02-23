import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const AVATAR_COLORS = ["#6EE7B7", "#818CF8", "#FB923C", "#F472B6", "#34D399", "#A78BFA"];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { inviteCode, displayName } = await request.json();

  if (!inviteCode?.trim() || !displayName?.trim()) {
    return NextResponse.json({ error: "Invite code and display name required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: tribe, error: tribeError } = await admin
    .from("tribes")
    .select("id, name")
    .eq("invite_code", inviteCode.trim().toUpperCase())
    .single();

  if (tribeError || !tribe) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  const { data: existing } = await admin
    .from("tribe_members")
    .select("id")
    .eq("tribe_id", tribe.id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ tribe }, { status: 200 });
  }

  const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

  const { error: memberError } = await admin.from("tribe_members").insert({
    tribe_id: tribe.id,
    user_id: user.id,
    display_name: displayName.trim(),
    avatar_color: color,
    role: "member",
  });

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({ tribe }, { status: 201 });
}
