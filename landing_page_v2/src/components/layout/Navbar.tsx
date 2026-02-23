export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-5 md:px-10 py-[14px] md:py-[18px] flex items-center justify-between bg-[#0d0f14]/80 backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.07)]">
      <a className="font-sora font-extrabold text-[22px] flex items-center gap-2 text-[#f0f2f8]" href="/">  
        <div className="w-[34px] h-[34px] bg-gradient-to-br from-[#6EE7B7] to-[#818CF8] rounded-[10px] flex items-center justify-center text-[16px]">🏕️</div>
        TribeTask
      </a>
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-[#7c849a] text-[15px] hover:text-[#f0f2f8] transition-colors">Features</a>
        <a href="#how" className="text-[#7c849a] text-[15px] hover:text-[#f0f2f8] transition-colors">How it works</a>
        <a href="#pricing" className="text-[#7c849a] text-[15px] hover:text-[#f0f2f8] transition-colors">Pricing</a>
      </div>
      <div className="flex gap-[10px] items-center">
        <a className="border border-[rgba(255,255,255,0.07)] text-[#f0f2f8] bg-transparent font-sora font-semibold text-[14px] px-[22px] py-[10px] rounded-[10px] no-underline cursor-pointer transition-all duration-200 hover:border-[#6EE7B7] hover:bg-[#6EE7B7]/5 inline-block" href="/auth/login">Log in</a>
        <a className="bg-gradient-to-br from-[#6EE7B7] to-[#34d399] text-[#0d1a13] font-sora font-bold text-[14px] px-[22px] py-[10px] rounded-[10px] no-underline border-none cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] inline-block" href="/auth/login">Get started free</a>
      </div>
    </nav>
  );
}
