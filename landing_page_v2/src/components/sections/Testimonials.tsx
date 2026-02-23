export default function Testimonials() {
  return (
    <section className="bg-[#14171f] py-[60px] md:py-[100px] px-5 md:px-[40px]">
      <div className="max-w-[1100px] mx-auto">
        <div className="font-sora text-[12px] font-bold tracking-[2px] uppercase text-[#6EE7B7] mb-[16px]">Testimonials</div>
        <h2 className="font-sora text-[clamp(32px,4vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] mb-[20px]">Real tribes, real results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] mt-[50px]">
          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-[16px] p-[28px]">
            <p className="text-[15px] leading-[1.7] mb-[20px] text-[#c8cede]">"The nudge feature alone is worth it. No more asking my roommates five times to take out the trash."</p>
            <div className="flex items-center gap-[12px]">
              <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[14px] font-bold font-sora bg-[rgba(110,231,183,0.2)] text-[#6EE7B7]">JL</div>
              <div>
                <div className="text-[14px] font-bold font-sora">Jamie L.</div>
                <div className="text-[12px] text-[#7c849a]">Shared apartment, 4 roommates</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-[16px] p-[28px]">
            <p className="text-[15px] leading-[1.7] mb-[20px] text-[#c8cede]">"My kids actually compete to grab tasks now because of the streak. I never thought I'd say this but chores are fun."</p>
            <div className="flex items-center gap-[12px]">
              <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[14px] font-bold font-sora bg-[rgba(129,140,248,0.2)] text-[#818CF8]">RM</div>
              <div>
                <div className="text-[14px] font-bold font-sora">Rachel M.</div>
                <div className="text-[12px] text-[#7c849a]">Mom of 3, using family plan</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-[16px] p-[28px]">
            <p className="text-[15px] leading-[1.7] mb-[20px] text-[#c8cede]">"The load balancer view stopped so many arguments. We can literally see who's doing more — no more guessing."</p>
            <div className="flex items-center gap-[12px]">
              <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[14px] font-bold font-sora bg-[rgba(251,146,60,0.2)] text-[#FB923C]">DK</div>
              <div>
                <div className="text-[14px] font-bold font-sora">David K.</div>
                <div className="text-[12px] text-[#7c849a]">Couple sharing a house</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
