import { Suspense } from "react";
import OnboardingForm from "./OnboardingForm";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0f14] flex items-center justify-center text-[#7c849a]">Loading...</div>}>
      <OnboardingForm />
    </Suspense>
  );
}
