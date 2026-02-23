import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const tribeId = searchParams.get("tribe_id");
  if (!tribeId) return NextResponse.json({ error: "tribe_id required" }, { status: 400 });

  const { data: tribe } = await supabase
    .from("tribes")
    .select("id, name, invite_code, created_by, created_at")
    .eq("id", tribeId)
    .single();

  const { data: members } = await supabase
    .from("tribe_members")
    .select("id, user_id, display_name, avatar_color, role, joined_at")
    .eq("tribe_id", tribeId)
    .order("joined_at", { ascending: true });

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("tribe_id", tribeId)
    .single();

  return NextResponse.json({ tribe, members, subscription });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tribeId, action, name, memberId } = await request.json();
  if (!tribeId) return NextResponse.json({ error: "tribeId required" }, { status: 400 });

  const { data: myMember } = await supabase
    .from("tribe_members")
    .select("role")
    .eq("tribe_id", tribeId)
    .eq("user_id", user.id)
    .single();

  if (!myMember || myMember.role !== "owner") {
    return NextResponse.json({ error: "Owner only" }, { status: 403 });
  }

  const admin = createAdminClient();

  if (action === "rename" && name?.trim()) {
    await admin.from("tribes").update({ name: name.trim() }).eq("id", tribeId);
    return NextResponse.json({ success: true });
  }

  if (action === "regenerate_code") {
    const newCode = generateInviteCode();
    await admin.from("tribes").update({ invite_code: newCode }).eq("id", tribeId);
    return NextResponse.json({ inviteCode: newCode });
  }

  if (action === "remove_member" && memberId) {
    const { data: target } = await admin
      .from("tribe_members")
      .select("role, user_id")
      .eq("id", memberId)
      .single();
    if (target?.role === "owner") {
      return NextResponse.json({ error: "Cannot remove owner" }, { status: 400 });
    }
    await admin.from("tribe_members").delete().eq("id", memberId);
    return NextResponse.json({ success: true });
  }

  if (action === "archive") {
    await admin.from("tribes").update({ name: `[Archived] ${(await admin.from("tribes").select("name").eq("id", tribeId).single()).data?.name}` }).eq("id", tribeId);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
