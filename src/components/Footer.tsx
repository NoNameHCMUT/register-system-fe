const footerLinks = ["PRIVACY POLICY", "TERMS OF SERVICE", "CONTACT US", "SUPPORT"]

function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e8ebf1] bg-[#f7f9fc] px-6 py-5 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1126px] flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="text-left">
          <div className="text-[19px] font-semibold tracking-[-0.03em] text-[#19202d]">
            Mua He Xanh Online
          </div>
          <div className="mt-2 text-[14px] uppercase tracking-[0.12em] text-[#8e98ab]">
            © 2026 Mua He Xanh Online.
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-start gap-x-8 gap-y-2 md:justify-end">
          {footerLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[13px] uppercase tracking-[0.16em] text-[#8e98ab] transition-colors hover:text-[#1d9bf0]"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export { Footer }