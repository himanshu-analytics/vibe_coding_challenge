import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const DEMO_BOT_NAME = "Jamie (Demo)";
const DEMO_BOT_COLOR = "#818CF8";
const DEMO_TASKS = [
  { title: "Clean the kitchen", description: "Wipe counters, mop floor, take out trash" },
  { title: "Take out recycling", description: "Sort and take bins to the curb" },
  { title: "Vacuum living room", description: "Move furniture and vacuum underneath" },
];

async function seedDemoData(tribeId: string, demoUserId: string) {
  const admin = createAdminClient();

  // Check if bot member already exists in this tribe
  const { data: existing } = await admin
    .from("tribe_members")
    .select("user_id")
    .eq("tribe_id", tribeId)
    .eq("display_name", DEMO_BOT_NAME)
    .single();

  if (existing) return; // Already seeded

  // Create a headless bot user in Supabase Auth
  const botEmail = `demo-bot-${tribeId.slice(0, 8)}@tribetask-demo.internal`;
  const { data: botData } = await admin.auth.admin.createUser({
    email: botEmail,
    password: crypto.randomUUID(),
    email_confirm: true,
  });

  if (!botData.user) return;
  const botId = botData.user.id;

  // Add bot to the tribe
  await admin.from("tribe_members").insert({
    tribe_id: tribeId,
    user_id: botId,
    display_name: DEMO_BOT_NAME,
    avatar_color: DEMO_BOT_COLOR,
    role: "member",
  });

  // Seed tasks assigned to the bot so demo user can nudge immediately
  await admin.from("tasks").insert(
    DEMO_TASKS.map((t) => ({
      tribe_id: tribeId,
      title: t.title,
      description: t.description,
      assigned_to: botId,
      status: "pending",
      created_by: demoUserId,
    }))
  );
}

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

  if (membership?.tribe_id) {
    // Tribe exists — ensure bot member + tasks are seeded
    await seedDemoData(membership.tribe_id, data.user.id);
  }

  const redirectTo = membership ? "/dashboard" : "/onboarding";
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}${redirectTo}`, { status: 303 });
}
