"use client";
import TopNav from "@/components/app/TopNav";
import TribeView from "./TribeView";

interface DashboardClientProps {
  userId: string;
  tribeId: string;
  tribeName: string;
  inviteCode: string;
  displayName: string;
  avatarColor: string;
  role: "owner" | "member";
}

export default function DashboardClient({
  userId, tribeId, tribeName, displayName, avatarColor, role,
}: DashboardClientProps) {
  return (
    <>
      <TopNav tribeName={tribeName} tribeId={tribeId} displayName={displayName} avatarColor={avatarColor} />
      <div className="pt-[60px] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <TribeView tribeId={tribeId} userId={userId} displayName={displayName} role={role} />
        </div>
      </div>
    </>
  );
}
