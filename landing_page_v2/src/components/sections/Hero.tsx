export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-[120px] px-5 md:px-10 pb-[80px] text-center relative overflow-hidden">
      <div className="absolute w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(110,231,183,0.08)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.07)_0%,transparent_70%)] top-[30%] right-[10%] pointer-events-none"></div>
      
      <div className="relative z-[2] w-full">
        <div className="fade-up inline-flex items-center gap-[6px] bg-[rgba(110,231,183,0.1)] border border-[rgba(110,231,183,0.25)] rounded-[100px] px-[14px] py-[6px] text-[13px] text-[#6EE7B7] mb-[28px] font-medium">
          <span className="w-[6px] h-[6px] bg-[#6EE7B7] rounded-full animate-pulse-slow"></span>
          Now in Beta — Free for your whole tribe
        </div>
        
        <h1 className="fade-up delay-1 font-sora text-[clamp(42px,6vw,80px)] font-extrabold leading-[1.05] tracking-[-2px] max-w-[800px] mx-auto mb-[24px]">
          Your tribe runs smoother <span className="bg-gradient-to-br from-[#6EE7B7] to-[#818CF8] bg-clip-text text-transparent">together</span>
        </h1>
        
        <p className="fade-up delay-2 text-[18px] text-[#7c849a] max-w-[520px] mx-auto mb-[40px] leading-[1.7]">
          Assign chores, grab tasks, nudge teammates — whether it's your family, roommates, or anyone sharing a space.
        </p>
        
        <div className="fade-up delay-3 flex gap-[14px] justify-center flex-wrap mb-[60px]">
          <a className="bg-gradient-to-br from-[#6EE7B7] to-[#34d399] text-[#071a10] font-sora font-bold text-[16px] px-[32px] py-[14px] rounded-[12px] no-underline transition-all duration-200 hover:opacity-90 hover:-translate-y-[2px] inline-block" href="/auth/login">Start for free →</a>
          <a className="border border-[rgba(255,255,255,0.07)] text-[#f0f2f8] bg-transparent font-sora font-semibold text-[16px] px-[32px] py-[14px] rounded-[12px] no-underline transition-colors duration-200 hover:border-[rgba(255,255,255,0.25)] inline-block" href="#how">See how it works</a>
        </div>

        <div className="fade-up delay-4 max-w-[860px] mx-auto bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-[20px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] relative z-[2]">
          <div className="bg-[#1c2030] px-[20px] py-[12px] flex items-center gap-[8px] border-b border-[rgba(255,255,255,0.07)]">
            <div className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]"></div>
            <div className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]"></div>
            <div className="w-[10px] h-[10px] rounded-full bg-[#28CA41]"></div>
            <span className="text-[13px] text-[#7c849a] ml-[8px] font-sora">TribeTask — Apartment 4B</span>
          </div>
          <div className="p-[24px] grid grid-cols-1 md:grid-cols-[220px_1fr] gap-[20px] min-h-[320px] text-left">
            <div className="hidden md:flex flex-col gap-[10px]">
              <div className="bg-[rgba(110,231,183,0.05)] border border-[rgba(110,231,183,0.3)] rounded-[12px] p-[12px] flex items-center gap-[10px]">
                <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[14px] font-bold font-sora shrink-0 bg-[rgba(110,231,183,0.2)] text-[#6EE7B7]">AJ</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold">Alex J.</div>
                  <div className="text-[11px] text-[#7c849a]">3 tasks today</div>
                  <div className="h-[4px] bg-[rgba(255,255,255,0.08)] rounded-[4px] mt-[4px] overflow-hidden"><div className="h-full rounded-[4px] w-[60%] bg-[#6EE7B7]"></div></div>
                </div>
              </div>
              <div className="bg-[#1c2030] border border-[rgba(255,255,255,0.07)] rounded-[12px] p-[12px] flex items-center gap-[10px]">
                <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[14px] font-bold font-sora shrink-0 bg-[rgba(129,140,248,0.2)] text-[#818CF8]">SR</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold">Sara R.</div>
                  <div className="text-[11px] text-[#7c849a]">5 tasks today</div>
                  <div className="h-[4px] bg-[rgba(255,255,255,0.08)] rounded-[4px] mt-[4px] overflow-hidden"><div className="h-full rounded-[4px] w-[90%] bg-[#818CF8]"></div></div>
                </div>
              </div>
              <div className="bg-[#1c2030] border border-[rgba(255,255,255,0.07)] rounded-[12px] p-[12px] flex items-center gap-[10px]">
                <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[14px] font-bold font-sora shrink-0 bg-[rgba(251,146,60,0.2)] text-[#FB923C]">MK</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold">Mike K.</div>
                  <div className="text-[11px] text-[#7c849a]">1 task today</div>
                  <div className="h-[4px] bg-[rgba(255,255,255,0.08)] rounded-[4px] mt-[4px] overflow-hidden"><div className="h-full rounded-[4px] w-[20%] bg-[#FB923C]"></div></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[14px]">
              <div className="text-[11px] text-[#7c849a] font-semibold tracking-[0.8px] uppercase">Today's Tasks</div>
              <div className="bg-[#1c2030] border border-[rgba(255,255,255,0.07)] rounded-[10px] px-[14px] py-[12px] flex items-center gap-[12px]">
                <div className="w-[20px] h-[20px] rounded-[6px] border-2 border-[#6EE7B7] bg-[#6EE7B7] shrink-0 flex items-center justify-center text-[#14171f] text-[12px] font-bold">✓</div>
                <span className="flex-1 text-[13px] line-through text-[#7c849a]">Take out trash</span>
                <span className="text-[10px] font-semibold px-[8px] py-[3px] rounded-[6px] font-sora bg-[rgba(110,231,183,0.1)] text-[#6EE7B7]">Done</span>
              </div>
              <div className="bg-[#1c2030] border border-[rgba(255,255,255,0.07)] rounded-[10px] px-[14px] py-[12px] flex items-center gap-[12px]">
                <div className="w-[20px] h-[20px] rounded-[6px] border-2 border-[rgba(255,255,255,0.15)] shrink-0"></div>
                <span className="flex-1 text-[13px]">Vacuum living room</span>
                <span className="text-[10px] font-semibold px-[8px] py-[3px] rounded-[6px] font-sora bg-[rgba(129,140,248,0.1)] text-[#818CF8]">Sara</span>
                <span className="text-[11px] text-[#FB923C] cursor-pointer px-[10px] py-[4px] rounded-[6px] border border-[rgba(251,146,60,0.3)] bg-[rgba(251,146,60,0.05)]">👋 Nudge</span>
              </div>
              <div className="bg-[#1c2030] border border-[rgba(255,255,255,0.07)] rounded-[10px] px-[14px] py-[12px] flex items-center gap-[12px]">
                <div className="w-[20px] h-[20px] rounded-[6px] border-2 border-[rgba(255,255,255,0.15)] shrink-0"></div>
                <span className="flex-1 text-[13px]">Buy groceries</span>
                <span className="text-[10px] font-semibold px-[8px] py-[3px] rounded-[6px] font-sora bg-[rgba(251,146,60,0.1)] text-[#FB923C]">Mike</span>
                <span className="text-[11px] text-[#818CF8] cursor-pointer px-[10px] py-[4px] rounded-[6px] border border-[rgba(129,140,248,0.3)] bg-[rgba(129,140,248,0.05)] whitespace-nowrap">⚡ Grab it</span>
              </div>
              <div className="bg-[#1c2030] border border-[rgba(255,255,255,0.07)] rounded-[10px] px-[14px] py-[12px] flex items-center gap-[12px]">
                <div className="w-[20px] h-[20px] rounded-[6px] border-2 border-[rgba(255,255,255,0.15)] shrink-0"></div>
                <span className="flex-1 text-[13px]">Clean bathroom</span>
                <span className="text-[10px] font-semibold px-[8px] py-[3px] rounded-[6px] font-sora bg-[rgba(110,231,183,0.1)] text-[#6EE7B7]">You</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
