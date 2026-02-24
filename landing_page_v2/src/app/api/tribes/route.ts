import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend } from "@/lib/resend";
import TribeCreatedEmail from "@/emails/TribeCreatedEmail";

export const dynamic = "force-dynamic";

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, displayName, avatarColor } = await request.json();

  if (!name?.trim() || !displayName?.trim()) {
    return NextResponse.json({ error: "Name and display name required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const inviteCode = generateInviteCode();

  const { data: tribe, error: tribeError } = await admin
    .from("tribes")
    .insert({ name: name.trim(), invite_code: inviteCode, created_by: user.id })
    .select()
    .single();

  if (tribeError) {
    return NextResponse.json({ error: tribeError.message }, { status: 500 });
  }

  const { error: memberError } = await admin.from("tribe_members").insert({
    tribe_id: tribe.id,
    user_id: user.id,
    display_name: displayName.trim(),
    avatar_color: avatarColor || "#6EE7B7",
    role: "owner",
  });

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    await getResend().emails.send({
      from: "TribeTask <no-reply@tribetask.himanshuagrawal.online>",
      to: user.email!,
      subject: `Your tribe "${tribe.name}" is ready!`,
      react: TribeCreatedEmail({
        tribeName: tribe.name,
        inviteCode: tribe.invite_code,
        inviteLink: `${appUrl}/onboarding?code=${tribe.invite_code}`,
        dashboardLink: `${appUrl}/dashboard`,
      }),
    });
  } catch (_) {}

  return NextResponse.json({ tribe, inviteCode }, { status: 201 });
}
