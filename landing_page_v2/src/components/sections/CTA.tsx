export default function CTA() {
  return (
    <section className="text-center py-[120px] px-5 md:px-[40px] bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.07)_0%,transparent_70%)]">
      <div className="font-sora text-[12px] font-bold tracking-[2px] uppercase text-[#6EE7B7] mb-[16px]">Get started</div>
      <h2 className="font-sora text-[clamp(32px,4vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] mb-[20px] max-w-[600px] mx-auto">Ready to run your tribe like a team?</h2>
      <p className="text-[18px] text-[#7c849a] mb-[40px]">Free to start. No credit card required. Your whole tribe can join in minutes.</p>
      
      <div className="flex gap-[14px] justify-center flex-wrap">
        <a className="bg-gradient-to-br from-[#6EE7B7] to-[#34d399] text-[#071a10] font-sora font-bold text-[16px] px-[32px] py-[14px] rounded-[12px] no-underline transition-all duration-200 hover:opacity-90 hover:-translate-y-[2px] inline-block" href="#">Create your tribe →</a>
        <a className="border border-[rgba(255,255,255,0.07)] text-[#f0f2f8] bg-transparent font-sora font-semibold text-[16px] px-[32px] py-[14px] rounded-[12px] no-underline transition-colors duration-200 hover:border-[rgba(255,255,255,0.25)] inline-block" href="#">See a live demo</a>
      </div>
    </section>
  );
}
