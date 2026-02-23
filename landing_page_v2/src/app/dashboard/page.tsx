import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: membership } = await supabase
    .from("tribe_members")
    .select("tribe_id, display_name, avatar_color, role, tribes(id, name, invite_code)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership) redirect("/onboarding");

  const tribe = (Array.isArray(membership.tribes) ? membership.tribes[0] : membership.tribes) as { id: string; name: string; invite_code: string } | null;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0f14]" />}>
      <DashboardClient
        userId={user.id}
        tribeId={membership.tribe_id}
        tribeName={tribe?.name || ""}
        inviteCode={tribe?.invite_code || ""}
        displayName={membership.display_name}
        avatarColor={membership.avatar_color}
        role={membership.role as "owner" | "member"}
      />
    </Suspense>
  );
}
