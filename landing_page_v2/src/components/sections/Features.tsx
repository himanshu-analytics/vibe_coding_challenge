export default function Features() {
  return (
    <section id="features" className="py-[60px] md:py-[100px] px-5 md:px-[40px]">
      <div className="max-w-[1100px] mx-auto">
        <div className="font-sora text-[12px] font-bold tracking-[2px] uppercase text-[#6EE7B7] mb-[16px]">Features</div>
        <h2 className="font-sora text-[clamp(32px,4vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] mb-[20px]">Everything your tribe needs</h2>
        <p className="text-[18px] text-[#7c849a] max-w-[500px] leading-[1.7]">From auto-assigning tasks to nudging the one person who never does dishes.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.07)] rounded-[20px] overflow-hidden mt-[60px]">
          <div className="bg-[#14171f] px-[32px] py-[36px] transition-colors duration-200 hover:bg-[#1c2030]">
            <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-[22px] mb-[20px] bg-[rgba(110,231,183,0.1)]">📋</div>
            <h3 className="font-sora text-[18px] font-bold mb-[10px]">Smart Task Assignment</h3>
            <p className="text-[15px] text-[#7c849a] leading-[1.65]">Create tasks once and let TribeTask distribute them fairly based on workload balance. Or assign manually — your call.</p>
          </div>
          
          <div className="bg-[#14171f] px-[32px] py-[36px] transition-colors duration-200 hover:bg-[#1c2030]">
            <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-[22px] mb-[20px] bg-[rgba(129,140,248,0.1)]">⚡</div>
            <h3 className="font-sora text-[18px] font-bold mb-[10px]">Task Grabbing</h3>
            <p className="text-[15px] text-[#7c849a] leading-[1.65]">Got 20 free minutes? Browse unstarted tasks from your tribe and grab one. Real-time updates mean no double-doing.</p>
          </div>
          
          <div className="bg-[#14171f] px-[32px] py-[36px] transition-colors duration-200 hover:bg-[#1c2030]">
            <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-[22px] mb-[20px] bg-[rgba(251,146,60,0.1)]">👋</div>
            <h3 className="font-sora text-[18px] font-bold mb-[10px]">Nudge System</h3>
            <p className="text-[15px] text-[#7c849a] leading-[1.65]">Send a friendly poke to anyone who's slacking on their task. Rate-limited so nobody abuses it. Peace kept.</p>
          </div>
          
          <div className="bg-[#14171f] px-[32px] py-[36px] transition-colors duration-200 hover:bg-[#1c2030]">
            <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-[22px] mb-[20px] bg-[rgba(248,113,113,0.1)]">📊</div>
            <h3 className="font-sora text-[18px] font-bold mb-[10px]">Load Balancer View</h3>
            <p className="text-[15px] text-[#7c849a] leading-[1.65]">Visual breakdown of who's carrying the most weight this week. Make the workload feel fair and transparent.</p>
          </div>
          
          <div className="bg-[#14171f] px-[32px] py-[36px] transition-colors duration-200 hover:bg-[#1c2030]">
            <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-[22px] mb-[20px] bg-[rgba(52,211,153,0.1)]">🔁</div>
            <h3 className="font-sora text-[18px] font-bold mb-[10px]">Recurring Tasks</h3>
            <p className="text-[15px] text-[#7c849a] leading-[1.65]">Set it and forget it. Weekly vacuuming, daily dishes, monthly deep clean — they show up automatically.</p>
          </div>
          
          <div className="bg-[#14171f] px-[32px] py-[36px] transition-colors duration-200 hover:bg-[#1c2030]">
            <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-[22px] mb-[20px] bg-[rgba(250,204,21,0.1)]">🔥</div>
            <h3 className="font-sora text-[18px] font-bold mb-[10px]">Tribe Streaks</h3>
            <p className="text-[15px] text-[#7c849a] leading-[1.65]">Track your tribe's weekly completion rate. Nothing motivates like a "7-week streak" that nobody wants to break.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
