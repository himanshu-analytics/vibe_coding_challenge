import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import WhoItsFor from "@/components/sections/WhoItsFor";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main className="w-full relative">
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <WhoItsFor />
      <Testimonials />
      <Pricing />
      <CTA />
    </main>
  );
}
