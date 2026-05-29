export default function FooterSection() {
  return (
    <footer style={{ background: '#060b14', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      className='px-6 md:px-10 py-10'>
      <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5'>

        <div className='flex items-center gap-3'>
          <div className='w-7 h-7 rounded-lg bg-[#00A3FF] flex items-center justify-center shrink-0'>
            <span className='font-brand font-bold text-white text-[11px] leading-none'>AE</span>
          </div>
          <span className='text-white/20 text-sm font-light'>
            © 2025 AutoEnforce ZA. All rights reserved.
          </span>
        </div>

        <nav className='flex items-center gap-7'>
          {['Privacy Policy', 'Terms', 'Contact'].map((l) => (
            <a key={l} href='#'
              className='text-white/20 hover:text-white/45 text-xs tracking-wide transition-colors duration-200'>
              {l}
            </a>
          ))}
        </nav>

      </div>
    </footer>
  )
}
