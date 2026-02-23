import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend } from "@/lib/resend";
import NudgeEmail from "@/emails/NudgeEmail";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId, tribeId } = await request.json();

  if (!taskId || !tribeId) {
    return NextResponse.json({ error: "taskId and tribeId required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: task } = await admin
    .from("tasks")
    .select("id, title, description, due_date, assigned_to, status")
    .eq("id", taskId)
    .single();

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (task.assigned_to === user.id) {
    return NextResponse.json({ error: "Cannot nudge yourself" }, { status: 400 });
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("nudges")
    .select("id", { count: "exact", head: true })
    .eq("task_id", taskId)
    .eq("from_user_id", user.id)
    .gte("sent_at", oneHourAgo);

  if (count && count > 0) {
    return NextResponse.json({ error: "Rate limit: 1 nudge per task per hour" }, { status: 429 });
  }

  const { data: senderMember } = await admin
    .from("tribe_members")
    .select("display_name")
    .eq("tribe_id", tribeId)
    .eq("user_id", user.id)
    .single();

  const { data: recipientMember } = await admin
    .from("tribe_members")
    .select("display_name")
    .eq("tribe_id", tribeId)
    .eq("user_id", task.assigned_to)
    .single();

  const { data: recipientUser } = await admin.auth.admin.getUserById(task.assigned_to);

  await admin.from("nudges").insert({
    tribe_id: tribeId,
    from_user_id: user.id,
    to_user_id: task.assigned_to,
    task_id: taskId,
    read: false,
    sent_at: new Date().toISOString(),
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (recipientUser?.user?.email) {
    try {
      await getResend().emails.send({
        from: "TribeTask <noreply@tribetask.app>",
        to: recipientUser.user.email,
        subject: `👋 ${senderMember?.display_name || "A teammate"} nudged you about: ${task.title}`,
        react: NudgeEmail({
          senderName: senderMember?.display_name || "A teammate",
          recipientName: recipientMember?.display_name || "there",
          taskTitle: task.title,
          taskDescription: task.description,
          dueDate: task.due_date,
          dashboardLink: `${appUrl}/dashboard`,
        }),
      });
    } catch (_) {}
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tribeId = searchParams.get("tribe_id");

  let query = supabase
    .from("nudges")
    .select(`
      id, read, sent_at,
      task:tasks(id, title),
      sender:tribe_members!nudges_from_user_id_fkey(display_name, avatar_color)
    `)
    .eq("to_user_id", user.id)
    .order("sent_at", { ascending: false })
    .limit(20);

  if (tribeId) query = query.eq("tribe_id", tribeId);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ nudges: data });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { nudgeIds } = await request.json();

  await supabase
    .from("nudges")
    .update({ read: true })
    .in("id", nudgeIds)
    .eq("to_user_id", user.id);

  return NextResponse.json({ success: true });
}
