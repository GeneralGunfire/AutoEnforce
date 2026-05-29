'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'

const E = [0.25, 0.46, 0.45, 0.94] as const

// Pre-seeded positions so server and client render identically (no Math.random in render)
const STARS = [
  { w: 1.8, h: 1.8, left: 12, top: 8,  dur: 3.2, delay: 0.4 },
  { w: 1.2, h: 1.2, left: 28, top: 22, dur: 5.1, delay: 1.1 },
  { w: 2.1, h: 2.1, left: 44, top: 14, dur: 2.8, delay: 0.7 },
  { w: 1.5, h: 1.5, left: 60, top: 35, dur: 4.4, delay: 2.0 },
  { w: 1.0, h: 1.0, left: 75, top: 9,  dur: 3.7, delay: 0.2 },
  { w: 2.4, h: 2.4, left: 88, top: 28, dur: 5.5, delay: 1.6 },
  { w: 1.3, h: 1.3, left: 7,  top: 55, dur: 4.0, delay: 0.9 },
  { w: 1.9, h: 1.9, left: 22, top: 70, dur: 2.6, delay: 2.3 },
  { w: 1.1, h: 1.1, left: 38, top: 62, dur: 3.9, delay: 1.4 },
  { w: 2.2, h: 2.2, left: 53, top: 78, dur: 4.8, delay: 0.6 },
  { w: 1.6, h: 1.6, left: 68, top: 55, dur: 3.3, delay: 2.8 },
  { w: 1.0, h: 1.0, left: 82, top: 72, dur: 5.2, delay: 1.0 },
  { w: 2.0, h: 2.0, left: 15, top: 88, dur: 2.9, delay: 1.7 },
  { w: 1.4, h: 1.4, left: 33, top: 44, dur: 4.2, delay: 0.3 },
  { w: 1.7, h: 1.7, left: 50, top: 50, dur: 3.6, delay: 2.5 },
  { w: 1.2, h: 1.2, left: 65, top: 18, dur: 4.9, delay: 1.2 },
  { w: 2.3, h: 2.3, left: 78, top: 42, dur: 3.1, delay: 0.8 },
  { w: 1.5, h: 1.5, left: 91, top: 85, dur: 5.0, delay: 2.1 },
  { w: 1.8, h: 1.8, left: 5,  top: 38, dur: 2.7, delay: 1.9 },
  { w: 1.0, h: 1.0, left: 20, top: 95, dur: 4.5, delay: 0.5 },
  { w: 2.0, h: 2.0, left: 42, top: 82, dur: 3.8, delay: 2.6 },
  { w: 1.3, h: 1.3, left: 57, top: 92, dur: 5.3, delay: 1.3 },
  { w: 1.6, h: 1.6, left: 72, top: 65, dur: 2.5, delay: 0.1 },
  { w: 1.9, h: 1.9, left: 95, top: 48, dur: 4.1, delay: 2.2 },
]

export default function SceneClosing() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sp = useSpring(scrollYProgress, { stiffness: 50, damping: 20 })

  // Background
  const bgY     = useTransform(sp, [0, 1], ['0%', '-12%'])
  const bgScale = useTransform(sp, [0, 0.5, 1], [1.12, 1.05, 1.0])

  // Content
  const opacity = useTransform(sp, [0, 0.14, 0.88, 1], [0, 1, 1, 0])
  const y       = useTransform(sp, [0, 0.2, 0.8, 1], [60, 0, 0, -40])

  // Headline split — words drift in from opposite sides
  const h1X = useTransform(sp, [0, 0.35], [-50, 0])
  const h2X = useTransform(sp, [0, 0.35], [50, 0])
  const hOp = useTransform(sp, [0.06, 0.32], [0, 1])
  const spH1 = useSpring(h1X, { stiffness: 45, damping: 18 })
  const spH2 = useSpring(h2X, { stiffness: 45, damping: 18 })

  // Lines flanking the pre-label grow outward
  const lineW = useTransform(sp, [0.1, 0.4], ['0px', '48px'])

  // CTA button — rises in from below
  const ctaY  = useTransform(sp, [0.2, 0.5], [30, 0])
  const ctaOp = useTransform(sp, [0.2, 0.48], [0, 1])
  const spCY  = useSpring(ctaY, { stiffness: 50, damping: 18 })

  // Stars drift gently upward on scroll
  const starDrift = useTransform(sp, [0, 1], ['0%', '-6%'])

  return (
    <motion.section
      ref={ref}
      className='relative min-h-[100vh] flex items-center justify-center overflow-hidden'
      style={{ background: '#080808' }}
    >
      {/* Background */}
      <motion.div className='absolute inset-0 z-0' style={{ y: bgY, scale: bgScale }}>
        <Image
          src='https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80'
          alt='' fill className='object-cover object-center' sizes='100vw' aria-hidden
        />
        <div className='absolute inset-0' style={{ background: 'linear-gradient(180deg, #080808 0%, rgba(8,8,8,0.5) 50%, #080808 100%)' }} />
      </motion.div>

      {/* Stars */}
      <motion.div className='absolute inset-0 z-1 pointer-events-none' style={{ y: starDrift }}>
        {STARS.map((s, i) => (
          <motion.div
            key={i}
            className='absolute rounded-full'
            style={{
              width: s.w, height: s.h,
              left: `${s.left}%`, top: `${s.top}%`,
              background: 'rgba(232,224,208,0.45)',
            }}
            animate={{ opacity: [0.08, 0.55, 0.08], scale: [1, 1.5, 1] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      {/* Horizontal light sweep — triggers once on enter */}
      <motion.div
        className='absolute inset-y-0 w-[40vw] pointer-events-none z-2'
        initial={{ x: '-100%' }}
        whileInView={{ x: '250%' }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, delay: 0.3, ease: E }}
        style={{ background: 'linear-gradient(90deg, transparent, rgba(232,224,208,0.035), transparent)' }}
      />

      <motion.div
        style={{ opacity, y }}
        className='relative z-10 text-center px-6 max-w-3xl mx-auto'
      >
        {/* Pre-label with expanding lines */}
        <motion.div className='flex items-center justify-center gap-4 mb-12'>
          <motion.div className='h-px' style={{ width: lineW, background: 'rgba(232,224,208,0.2)' }} />
          <motion.span
            className='text-cream-faint text-[10px] tracking-[0.45em] uppercase font-mono'
            initial={{ opacity: 0, letterSpacing: '0.65em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.45em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: E }}
          >
            AutoEnforce ZA
          </motion.span>
          <motion.div className='h-px' style={{ width: lineW, background: 'rgba(232,224,208,0.2)' }} />
        </motion.div>

        {/* Headline — two words from opposite sides */}
        <h2 className='font-brand font-bold text-white leading-[1.0] tracking-tight mb-14 overflow-hidden'
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}>
          <motion.span
            className='block'
            style={{ x: spH1, opacity: hOp }}
          >
            Safer roads.
          </motion.span>
          <motion.span
            className='block'
            style={{ x: spH2, opacity: hOp, color: 'rgba(232,224,208,0.38)', fontWeight: 300 }}
          >
            Starts here.
          </motion.span>
        </h2>

        {/* CTA */}
        <motion.div
          className='flex flex-col sm:flex-row items-center justify-center gap-4'
          style={{ y: spCY, opacity: ctaOp }}
        >
          <motion.button
            className='font-brand font-semibold text-sm tracking-[0.08em] px-10 py-4 rounded-full transition-all duration-300'
            style={{
              background: 'rgba(232,224,208,1)',
              color: '#080808',
              boxShadow: '0 0 40px rgba(232,224,208,0.15)',
            }}
            whileHover={{
              scale: 1.04,
              boxShadow: '0 0 70px rgba(232,224,208,0.32)',
              transition: { duration: 0.25 },
            }}
            whileTap={{ scale: 0.97 }}
          >
            Request a Demo
          </motion.button>
          <motion.button
            className='text-cream-faint text-sm tracking-[0.15em] uppercase font-light'
            whileHover={{ x: 4, color: 'rgba(232,224,208,0.85)', transition: { duration: 0.2 } }}
          >
            Download Brochure →
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Footer strip */}
      <div className='absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-8 py-6'
        style={{ borderTop: '1px solid rgba(232,224,208,0.06)' }}>
        <div className='flex items-center gap-2.5'>
          <div className='w-6 h-6 rounded-md flex items-center justify-center'
            style={{ background: 'rgba(232,224,208,0.1)', border: '1px solid rgba(232,224,208,0.15)' }}>
            <span className='font-brand font-bold text-cream text-[10px]'>AE</span>
          </div>
          <span className='text-cream-faint text-[11px] opacity-40'>© 2025 AutoEnforce ZA</span>
        </div>
        <nav className='flex gap-6'>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href='#' className='text-cream-faint text-[10px] tracking-wide opacity-30 hover:opacity-60 transition-opacity'>{l}</a>
          ))}
        </nav>
      </div>
    </motion.section>
  )
}
