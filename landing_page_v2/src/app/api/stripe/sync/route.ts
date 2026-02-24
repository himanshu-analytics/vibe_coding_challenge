import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const { tribe_id, plan } = session.metadata || {};
  if (!tribe_id || !plan || !session.subscription) {
    return NextResponse.json({ error: "Invalid session metadata" }, { status: 400 });
  }

  const sub = await stripe.subscriptions.retrieve(session.subscription as string);

  const rawPeriodEnd = (sub as unknown as { current_period_end: number | null | undefined }).current_period_end;
  const currentPeriodEnd = rawPeriodEnd != null && isFinite(rawPeriodEnd)
    ? new Date(rawPeriodEnd * 1000).toISOString()
    : null;

  const admin = createAdminClient();
  await admin.from("subscriptions").upsert({
    tribe_id,
    stripe_customer_id: session.customer as string,
    stripe_subscription_id: session.subscription as string,
    plan,
    status: sub.status,
    current_period_end: currentPeriodEnd,
  }, { onConflict: "tribe_id" });

  redirect(`/settings?upgraded=${plan}`);
}
