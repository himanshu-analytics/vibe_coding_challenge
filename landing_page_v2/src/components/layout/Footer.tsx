export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.07)] p-5 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap gap-5 mt-20">
      <a className="font-sora font-extrabold text-[18px] flex items-center gap-2 text-[#f0f2f8]" href="#">
        <div className="w-[28px] h-[28px] bg-gradient-to-br from-[#6EE7B7] to-[#818CF8] rounded-[10px] flex items-center justify-center text-[13px]">🏕️</div>
        TribeTask
      </a>
      <div className="flex gap-6 flex-wrap">
        <a href="#" className="text-[#7c849a] text-[14px] hover:text-[#f0f2f8] transition-colors">Features</a>
        <a href="#" className="text-[#7c849a] text-[14px] hover:text-[#f0f2f8] transition-colors">Pricing</a>
        <a href="#" className="text-[#7c849a] text-[14px] hover:text-[#f0f2f8] transition-colors">Privacy</a>
        <a href="#" className="text-[#7c849a] text-[14px] hover:text-[#f0f2f8] transition-colors">Terms</a>
        <a href="#" className="text-[#7c849a] text-[14px] hover:text-[#f0f2f8] transition-colors">Contact</a>
      </div>
      <div className="text-[13px] text-[#7c849a]">© 2025 TribeTask. Built with ❤️ for every tribe.</div>
    </footer>
  );
}
