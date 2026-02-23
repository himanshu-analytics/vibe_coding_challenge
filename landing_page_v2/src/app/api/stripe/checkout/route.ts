import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, STRIPE_PLANS } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan, tribeId } = await request.json();

  if (!plan || !tribeId || !(plan in STRIPE_PLANS)) {
    return NextResponse.json({ error: "Invalid plan or tribeId" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS].priceId, quantity: 1 }],
    customer_email: user.email,
    metadata: { tribe_id: tribeId, user_id: user.id, plan },
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
