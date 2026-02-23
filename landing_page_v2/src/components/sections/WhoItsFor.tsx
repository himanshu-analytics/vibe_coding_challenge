export default function WhoItsFor() {
  return (
    <section className="py-[60px] md:py-[100px] px-5 md:px-[40px]">
      <div className="max-w-[1100px] mx-auto">
        <div className="font-sora text-[12px] font-bold tracking-[2px] uppercase text-[#6EE7B7] mb-[16px]">Who it's for</div>
        <h2 className="font-sora text-[clamp(32px,4vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] mb-[20px]">Built for any tribe</h2>
        <p className="text-[18px] text-[#7c849a] max-w-[500px] leading-[1.7]">If you share a space, you share the work. TribeTask keeps it fair.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] mt-[50px]">
          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-[20px] p-[32px] transition-all duration-200 hover:border-[rgba(110,231,183,0.25)] hover:-translate-y-[4px]">
            <span className="text-[40px] mb-[16px] block">👨‍👩‍👧‍👦</span>
            <h3 className="font-sora text-[20px] font-bold mb-[10px]">Families</h3>
            <p className="text-[15px] text-[#7c849a] leading-[1.65]">Teach kids responsibility with assigned tasks and streaks. Parents get a clear view of who's doing what without nagging.</p>
          </div>
          
          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-[20px] p-[32px] transition-all duration-200 hover:border-[rgba(110,231,183,0.25)] hover:-translate-y-[4px]">
            <span className="text-[40px] mb-[16px] block">🏠</span>
            <h3 className="font-sora text-[20px] font-bold mb-[10px]">Roommates</h3>
            <p className="text-[15px] text-[#7c849a] leading-[1.65]">End the passive-aggressive Post-it notes. Rotate chores fairly, nudge each other, and keep the flat liveable.</p>
          </div>
          
          <div className="bg-[#14171f] border border-[rgba(255,255,255,0.07)] rounded-[20px] p-[32px] transition-all duration-200 hover:border-[rgba(110,231,183,0.25)] hover:-translate-y-[4px]">
            <span className="text-[40px] mb-[16px] block">🤝</span>
            <h3 className="font-sora text-[20px] font-bold mb-[10px]">Housemates & Co-ops</h3>
            <p className="text-[15px] text-[#7c849a] leading-[1.65]">Manage shared responsibilities across bigger households. Multiple task lists, clear ownership, zero drama.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
