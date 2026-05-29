'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'

const E = [0.25, 0.46, 0.45, 0.94] as const

const BEATS = [
  { number: '99.4%', label: 'Detection accuracy', sub: 'Every violation. Captured.' },
  { number: '< 2s',  label: 'Case file generated', sub: 'Before the car clears the frame.' },
  { number: '24 / 7',label: 'Live enforcement', sub: 'No shift ends. No camera sleeps.' },
]

function StatBeat({ beat, i }: { beat: typeof BEATS[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sp = useSpring(scrollYProgress, { stiffness: 60, damping: 20 })

  const opacity = useTransform(sp, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const scale   = useTransform(sp, [0, 0.15, 1], [0.9, 1, 1.06])
  const y       = useTransform(sp, [0, 0.15, 1], [50, 0, -20])

  return (
    <div ref={ref} className='relative min-h-[100vh] flex items-center justify-center overflow-hidden'>
      {/* Background image per beat */}
      <motion.div className='absolute inset-0' style={{ scale: useTransform(sp, [0,1], [1.08, 1.0]) }}>
        <Image
          src={[
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80',
          ][i]}
          alt=''
          fill
          className='object-cover object-center'
          sizes='100vw'
          aria-hidden
        />
        <div className='absolute inset-0' style={{ background: 'rgba(8,8,8,0.62)' }} />
      </motion.div>

      {/* Vertical rule */}
      <div className='absolute left-8 top-0 bottom-0 w-px' style={{ background: 'rgba(232,224,208,0.06)' }} />

      {/* Beat index */}
      <div className='absolute top-10 left-10 font-mono text-[10px] tracking-[0.3em] text-cream-faint opacity-40'>
        0{i + 1} / 03
      </div>

      <motion.div
        style={{ opacity, scale, y }}
        className='relative z-10 text-center px-6 max-w-3xl mx-auto'
      >
        <motion.div
          className='font-brand font-bold text-white leading-none mb-6'
          style={{ fontSize: 'clamp(5rem, 18vw, 14rem)', letterSpacing: '-0.04em' }}
        >
          {beat.number}
        </motion.div>
        <div className='w-12 h-px mx-auto mb-6' style={{ background: 'rgba(232,224,208,0.3)' }} />
        <p className='text-cream-dim text-sm tracking-[0.25em] uppercase mb-2'>{beat.label}</p>
        <p className='text-cream-faint text-xs tracking-[0.15em] font-light'>{beat.sub}</p>
      </motion.div>
    </div>
  )
}

export default function SceneReveal() {
  return (
    <section aria-label='Key statistics'>
      {BEATS.map((beat, i) => (
        <StatBeat key={beat.number} beat={beat} i={i} />
      ))}
    </section>
  )
}
