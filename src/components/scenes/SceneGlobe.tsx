'use client'

import { useRef, Suspense } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import dynamic from 'next/dynamic'

const E = [0.25, 0.46, 0.45, 0.94] as const

// Dynamically import the Three.js canvas — no SSR
const GlobeCanvas = dynamic(() => import('@/components/three/GlobeCanvas'), { ssr: false })
const StarsCanvas = dynamic(() => import('@/components/three/StarsCanvas'), { ssr: false })

export default function SceneGlobe() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sp = useSpring(scrollYProgress, { stiffness: 50, damping: 20 })

  const opacity = useTransform(sp, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const y       = useTransform(sp, [0, 0.2, 0.8, 1], [80, 0, 0, -60])
  const scale   = useTransform(sp, [0, 0.2], [0.9, 1])

  return (
    <motion.section
      ref={ref}
      className='relative min-h-[120vh] flex items-center justify-center overflow-hidden'
      style={{ background: '#080808' }}
    >
      {/* Stars background */}
      <div className='absolute inset-0 z-0'>
        <StarsCanvas />
      </div>

      {/* Globe */}
      <motion.div className='absolute inset-0 z-10' style={{ opacity, scale }}>
        <GlobeCanvas />
      </motion.div>

      {/* Text overlay */}
      <motion.div
        style={{ y, opacity }}
        className='relative z-20 text-center px-6 pointer-events-none select-none'
      >
        <p className='text-[11px] tracking-[0.4em] uppercase mb-6 font-medium'
          style={{ color: 'rgba(232,224,208,0.4)' }}>
          Coverage
        </p>
        <h2
          className='font-brand font-bold text-white leading-none mb-4'
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.04em' }}
        >
          50+
        </h2>
        <p className='text-sm tracking-[0.2em] uppercase' style={{ color: 'rgba(232,224,208,0.5)' }}>
          Municipalities across South Africa
        </p>

        {/* Floating city labels */}
        {[
          { label: 'Johannesburg', style: { top: '-120px', left: '-200px' } },
          { label: 'Cape Town',    style: { top: '-60px',  right: '-180px' } },
          { label: 'Durban',       style: { bottom: '-80px', left: '-160px' } },
        ].map((p, i) => (
          <motion.div
            key={p.label}
            className='absolute text-[10px] tracking-[0.2em] uppercase font-mono'
            style={{ ...p.style, color: 'rgba(232,224,208,0.3)', whiteSpace: 'nowrap' }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
          >
            — {p.label}
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom fade */}
      <div className='absolute bottom-0 inset-x-0 h-32 z-30 pointer-events-none'
        style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
    </motion.section>
  )
}
