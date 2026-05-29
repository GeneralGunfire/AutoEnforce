'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const links = ['About', 'Technology', 'Solutions', 'Contact']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0A1628]/90 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-[#00A3FF] flex items-center justify-center'>
            <span className='font-brand font-bold text-white text-sm leading-none'>AE</span>
          </div>
          <span className='font-brand font-bold text-white text-sm tracking-wide'>
            AutoEnforce ZA
          </span>
        </div>

        {/* Desktop links */}
        <nav className='hidden md:flex items-center gap-8'>
          {links.map((l) => (
            <a
              key={l}
              href='#'
              className='text-white/50 hover:text-white text-sm font-medium transition-colors duration-200 tracking-wide'
            >
              {l}
            </a>
          ))}
          <a
            href='#'
            className='ml-4 bg-[#00A3FF] hover:bg-[#0090e0] transition-colors text-white text-sm font-semibold px-5 py-2 rounded-lg'
          >
            Request Demo
          </a>
        </nav>

        {/* Hamburger — mobile only */}
        <button className='md:hidden flex flex-col gap-1.5 p-2' aria-label='Menu'>
          <span className='w-5 h-0.5 bg-white/70 rounded' />
          <span className='w-5 h-0.5 bg-white/70 rounded' />
          <span className='w-3.5 h-0.5 bg-white/70 rounded' />
        </button>
      </div>
    </motion.header>
  )
}
