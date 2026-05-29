'use client'

import { motion } from 'framer-motion'

const E = [0.25, 0.46, 0.45, 0.94] as const

export default function HeroContent() {
  return (
    <div className='max-w-2xl mx-auto w-full text-center flex flex-col items-center gap-8 py-8'>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: E }}
        className='font-brand font-bold text-white leading-[1.0] tracking-tight'
        style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
      >
        Redefining enforcement<br />
        <span style={{ color: 'rgba(232,224,208,0.35)', fontWeight: 300 }}>across South Africa.</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: E }}
        className='text-sm font-light leading-relaxed max-w-md'
        style={{ color: 'rgba(232,224,208,0.4)' }}
      >
        AI-powered enforcement that detects, records, and processes traffic violations in real time.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.22, ease: E }}
        className='flex gap-4 items-center'
      >
        <button
          className='font-brand font-semibold text-sm tracking-wide px-8 py-3.5 rounded-full transition-all duration-300'
          style={{ background: 'rgba(232,224,208,0.95)', color: '#080808' }}
        >
          Request a Demo
        </button>
      </motion.div>

    </div>
  )
}
