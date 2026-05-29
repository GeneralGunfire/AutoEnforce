'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'

const E = [0.25, 0.46, 0.45, 0.94] as const

const STEPS = [
  { word: 'Detect',  sub: 'Computer vision identifies violations in real time' },
  { word: 'Verify',  sub: 'AI cross-references plate, speed, and infraction' },
  { word: 'Record',  sub: 'Tamper-proof evidence chain generated instantly' },
  { word: 'Submit',  sub: 'Court-ready case file delivered in under 2 seconds' },
]

export default function SceneMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // One spring, no chaining
  const sp = useSpring(scrollYProgress, { stiffness: 35, damping: 22 })

  const opacity  = useTransform(sp, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
  const scale    = useTransform(sp, [0, 0.18], [0.97, 1])
  const bgY      = useTransform(sp, [0, 1], ['0%', '-8%'])
  const bgScale  = useTransform(sp, [0, 1], [1.08, 1.0])
  const labelY   = useTransform(sp, [0, 0.25], [24, 0])
  const labelOp  = useTransform(sp, [0.05, 0.25], [0, 1])
  const spLY     = labelY  // drop secondary spring
  const gridRotX = useTransform(sp, [0, 0.4], [6, 0])
  const gridY    = useTransform(sp, [0, 0.35], [40, 0])
  const gridOp   = useTransform(sp, [0.08, 0.35], [0, 1])
  const spGridY  = gridY   // drop secondary spring
  const beamX    = useTransform(sp, [0.1, 0.8], ['-100%', '200%'])

  return (
    <motion.section
      ref={ref}
      className='relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden'
      style={{ background: '#080808', perspective: '1000px', perspectiveOrigin: '50% 40%' }}
    >
      {/* BG image with parallax */}
      <motion.div className='absolute inset-0 z-0' style={{ y: bgY, scale: bgScale }}>
        <Image
          src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80'
          alt='' fill className='object-cover object-top' sizes='100vw' aria-hidden
        />
        <div className='absolute inset-0' style={{ background: 'rgba(8,8,8,0.62)' }} />
      </motion.div>

      {/* Light beam */}
      <motion.div
        className='absolute inset-y-0 w-[28vw] pointer-events-none z-1'
        style={{
          x: beamX,
          background: 'linear-gradient(90deg, transparent, rgba(232,224,208,0.022), transparent)',
        }}
      />

      <motion.div className='relative z-10 w-full' style={{ opacity, scale }}>

        {/* Section label */}
        <motion.div
          className='text-center mb-12'
          style={{ y: spLY, opacity: labelOp }}
        >
          <motion.p
            className='text-cream-faint text-[11px] tracking-[0.5em] uppercase font-medium inline-block'
            initial={{ letterSpacing: '0.7em', opacity: 0 }}
            whileInView={{ letterSpacing: '0.5em', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: E }}
          >
            The Process
          </motion.p>
        </motion.div>

        {/* Step cards — tilt in from above on a 3D plane */}
        <motion.div
          className='relative z-10 max-w-5xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-px'
          style={{
            background: 'rgba(232,224,208,0.05)',
            rotateX: gridRotX,
            y: spGridY,
            opacity: gridOp,
            transformStyle: 'preserve-3d',
          }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.word}
              className='flex flex-col gap-3 p-8 group relative overflow-hidden'
              style={{ background: 'rgba(8,8,8,0.5)', backdropFilter: 'blur(14px)' }}
              initial={{ opacity: 0, y: 32, rotateX: 12 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.75, delay: i * 0.12, ease: E }}
              whileHover={{ y: -4, transition: { duration: 0.3, ease: E } }}
            >
              {/* Hover glow */}
              <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'
                style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(232,224,208,0.06) 0%, transparent 65%)' }} />

              {/* Animated top border on hover */}
              <motion.div
                className='absolute top-0 left-0 h-px bg-cream'
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: E }}
                style={{ background: 'rgba(232,224,208,0.18)' }}
              />

              <span className='text-cream-faint text-[10px] tracking-[0.3em] uppercase font-mono'>0{i + 1}</span>
              <h3 className='font-brand font-bold text-white text-xl tracking-tight'>{step.word}</h3>
              <p className='text-cream-faint text-xs leading-relaxed font-light'>{step.sub}</p>
            </motion.div>
          ))}
        </motion.div>

      </motion.div>

      <div className='absolute bottom-0 inset-x-0 h-32 z-20 pointer-events-none'
        style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
      <div className='absolute top-0 inset-x-0 h-24 z-20 pointer-events-none'
        style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }} />
    </motion.section>
  )
}
