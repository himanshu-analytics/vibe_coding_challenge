export default function Pricing() {
  return (
    <section id="pricing" className="py-[60px] md:py-[100px] px-5 md:px-[40px]">
      <div className="max-w-[1100px] mx-auto">
        <div className="font-sora text-[12px] font-bold tracking-[2px] uppercase text-[#6EE7B7] mb-[16px]">Pricing</div>
        <h2 className="font-sora text-[clamp(32px,4vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] mb-[20px]">Simple, tribe-friendly pricing</h2>
        <p className="text-[18px] text-[#7c849a] max-w-[500px] leading-[1.7]">Start free. Upgrade when your tribe needs more power.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] mt-[50px]">
          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-[20px] px-[32px] py-[36px] relative">
            <div className="font-sora text-[14px] font-bold text-[#7c849a] uppercase tracking-[1px] mb-[12px]">Free</div>
            <div className="font-sora text-[48px] font-extrabold tracking-[-2px] mb-[4px]">$0</div>
            <div className="text-[14px] text-[#7c849a] mb-[24px]">forever, for small tribes</div>
            <ul className="flex flex-col gap-[10px] mb-[32px] list-none p-0">
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Up to 4 tribe members</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Unlimited tasks</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Task grabbing & nudges</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Weekly tribe summary</li>
              <li className="text-[14px] flex items-center gap-[10px] text-[#7c849a]"><span className="text-[rgba(255,255,255,0.2)] font-bold text-[13px]">–</span> Recurring task scheduler</li>
              <li className="text-[14px] flex items-center gap-[10px] text-[#7c849a]"><span className="text-[rgba(255,255,255,0.2)] font-bold text-[13px]">–</span> Load balancer analytics</li>
              <li className="text-[14px] flex items-center gap-[10px] text-[#7c849a]"><span className="text-[rgba(255,255,255,0.2)] font-bold text-[13px]">–</span> Priority support</li>
            </ul>
            <a className="block w-full text-center border border-[rgba(255,255,255,0.07)] text-[#f0f2f8] bg-transparent font-sora font-semibold text-[14px] p-[14px] rounded-[10px] no-underline transition-colors duration-200 hover:border-[#6EE7B7] hover:bg-[#6EE7B7]/5" href="/auth/login">Get started free</a>
          </div>
          
          <div className="bg-gradient-to-br from-[#14171f] to-[#14171f] via-[#14171f] bg-[#14171f] border border-[rgba(110,231,183,0.4)] rounded-[20px] px-[32px] py-[36px] relative" style={{background: 'linear-gradient(160deg, rgba(110,231,183,0.06), #14171f)'}}>
            <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#6EE7B7] to-[#34d399] text-[#071a10] font-sora text-[11px] font-bold tracking-[0.5px] px-[14px] py-[4px] rounded-[100px]">MOST POPULAR</div>
            <div className="font-sora text-[14px] font-bold text-[#7c849a] uppercase tracking-[1px] mb-[12px]">Tribe</div>
            <div className="font-sora text-[48px] font-extrabold tracking-[-2px] mb-[4px]">$6</div>
            <div className="text-[14px] text-[#7c849a] mb-[24px]">per month · up to 10 members</div>
            <ul className="flex flex-col gap-[10px] mb-[32px] list-none p-0">
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Up to 10 tribe members</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Unlimited tasks & lists</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Task grabbing & nudges</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Recurring task scheduler</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Load balancer analytics</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Streak tracking & leaderboard</li>
              <li className="text-[14px] flex items-center gap-[10px] text-[#7c849a]"><span className="text-[rgba(255,255,255,0.2)] font-bold text-[13px]">–</span> Priority support</li>
            </ul>
            <a className="block w-full text-center bg-gradient-to-br from-[#6EE7B7] to-[#34d399] text-[#0d1a13] font-sora font-bold text-[15px] p-[14px] rounded-[10px] no-underline transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px]" href="/auth/login?plan=tribe">Start 14-day free trial</a>
          </div>
          
          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-[20px] px-[32px] py-[36px] relative">
            <div className="font-sora text-[14px] font-bold text-[#7c849a] uppercase tracking-[1px] mb-[12px]">Community</div>
            <div className="font-sora text-[48px] font-extrabold tracking-[-2px] mb-[4px]">$15</div>
            <div className="text-[14px] text-[#7c849a] mb-[24px]">per month · unlimited members</div>
            <ul className="flex flex-col gap-[10px] mb-[32px] list-none p-0">
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Unlimited tribe members</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Multiple task boards</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Everything in Tribe</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Task templates library</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Admin roles & permissions</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Priority support</li>
              <li className="text-[14px] flex items-center gap-[10px]"><span className="text-[#6EE7B7] font-bold text-[13px]">✓</span> Custom domain (coming soon)</li>
            </ul>
            <a className="block w-full text-center border border-[rgba(255,255,255,0.07)] text-[#f0f2f8] bg-transparent font-sora font-semibold text-[14px] p-[14px] rounded-[10px] no-underline transition-colors duration-200 hover:border-[rgba(255,255,255,0.25)]" href="/auth/login?plan=community">Get started</a>
          </div>
        </div>
      </div>
    </section>
  );
}
