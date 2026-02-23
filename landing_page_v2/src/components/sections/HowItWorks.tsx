export default function HowItWorks() {
  return (
    <section id="how" className="bg-[#14171f] py-[60px] md:py-[100px] px-5 md:px-[40px]">
      <div className="max-w-[1100px] mx-auto">
        <div className="font-sora text-[12px] font-bold tracking-[2px] uppercase text-[#6EE7B7] mb-[16px]">How it works</div>
        <h2 className="font-sora text-[clamp(32px,4vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] mb-[20px]">Live in 5 minutes, organized forever</h2>
        <p className="text-[18px] text-[#7c849a] max-w-[500px] leading-[1.7]">No onboarding calls. No tutorials. Just invite your tribe and go.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px] lg:gap-0 mt-[60px] relative before:hidden lg:before:block before:absolute before:top-[28px] before:left-[10%] before:right-[10%] before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.07)] before:to-transparent">
          <div className="text-center px-0 lg:px-[20px] relative">
            <div className="w-[56px] h-[56px] rounded-full bg-[#1c2030] border border-[rgba(255,255,255,0.07)] flex items-center justify-center font-sora font-extrabold text-[18px] text-[#6EE7B7] mx-auto mb-[20px] relative z-[1]">1</div>
            <h4 className="font-sora text-[16px] font-bold mb-[10px]">Create your tribe</h4>
            <p className="text-[14px] text-[#7c849a] leading-[1.6]">Sign up and create a shared workspace. Family, roommates, or any group — all welcome.</p>
          </div>
          
          <div className="text-center px-0 lg:px-[20px] relative">
            <div className="w-[56px] h-[56px] rounded-full bg-[#1c2030] border border-[rgba(255,255,255,0.07)] flex items-center justify-center font-sora font-extrabold text-[18px] text-[#6EE7B7] mx-auto mb-[20px] relative z-[1]">2</div>
            <h4 className="font-sora text-[16px] font-bold mb-[10px]">Invite members</h4>
            <p className="text-[14px] text-[#7c849a] leading-[1.6]">Share a link or invite by email. Members join in one click, no app download required.</p>
          </div>
          
          <div className="text-center px-0 lg:px-[20px] relative">
            <div className="w-[56px] h-[56px] rounded-full bg-[#1c2030] border border-[rgba(255,255,255,0.07)] flex items-center justify-center font-sora font-extrabold text-[18px] text-[#6EE7B7] mx-auto mb-[20px] relative z-[1]">3</div>
            <h4 className="font-sora text-[16px] font-bold mb-[10px]">Add your tasks</h4>
            <p className="text-[14px] text-[#7c849a] leading-[1.6]">Add one-off or recurring chores. Assign them or let TribeTask distribute fairly.</p>
          </div>
          
          <div className="text-center px-0 lg:px-[20px] relative">
            <div className="w-[56px] h-[56px] rounded-full bg-[#1c2030] border border-[rgba(255,255,255,0.07)] flex items-center justify-center font-sora font-extrabold text-[18px] text-[#6EE7B7] mx-auto mb-[20px] relative z-[1]">4</div>
            <h4 className="font-sora text-[16px] font-bold mb-[10px]">Run as a team</h4>
            <p className="text-[14px] text-[#7c849a] leading-[1.6]">Grab tasks, nudge each other, track progress. Everyone sees the same dashboard, live.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
