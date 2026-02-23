import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tribeId = searchParams.get("tribe_id");
  const view = searchParams.get("view") || "my";

  if (!tribeId) {
    return NextResponse.json({ error: "tribe_id required" }, { status: 400 });
  }

  let query = supabase
    .from("tasks")
    .select(`
      *,
      assignee:tribe_members!tasks_assigned_to_fkey(display_name, avatar_color),
      creator:tribe_members!tasks_created_by_fkey(display_name, avatar_color)
    `)
    .eq("tribe_id", tribeId)
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (view === "my") {
    query = query.eq("assigned_to", user.id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tasks: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { tribeId, title, description, assignedTo, estimatedMinutes, dueDate } = body;

  if (!tribeId || !title?.trim()) {
    return NextResponse.json({ error: "tribeId and title required" }, { status: 400 });
  }

  const { data: member } = await supabase
    .from("tribe_members")
    .select("id")
    .eq("tribe_id", tribeId)
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return NextResponse.json({ error: "Not a member of this tribe" }, { status: 403 });
  }

  const { data: task, error } = await supabase.from("tasks").insert({
    tribe_id: tribeId,
    title: title.trim(),
    description: description?.trim() || null,
    assigned_to: assignedTo || user.id,
    created_by: user.id,
    status: "pending",
    estimated_minutes: estimatedMinutes || null,
    due_date: dueDate || null,
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ task }, { status: 201 });
}
