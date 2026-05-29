'use client'

import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useParallax } from '@/hooks/useParallax'

const E = [0.25, 0.46, 0.45, 0.94] as const

const features = [
  {
    title: 'AI Detection',
    desc: 'Real-time computer vision identifies violations across multiple feeds simultaneously at 99.4% accuracy.',
    svg: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="10" cy="10" r="3" />
        <path d="M3 3l4 4M17 3l-4 4M3 17l4-4M17 17l-4-4" />
        <circle cx="10" cy="10" r="8" strokeDasharray="2 3" />
      </svg>
    ),
  },
  {
    title: 'Aerial Surveillance',
    desc: 'Drone and fixed-wing integration delivers top-down coverage of intersections, highways, and corridors.',
    svg: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M10 2L13 8H17L14 12L15 17L10 14.5L5 17L6 12L3 8H7L10 2Z" />
      </svg>
    ),
  },
  {
    title: '2-Second Processing',
    desc: 'From detection to case file in under 2 seconds. Edge AI means zero cloud latency at point of capture.',
    svg: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="10" cy="10" r="7.5" />
        <polyline points="10 5.5 10 10 13.5 10" />
      </svg>
    ),
  },
  {
    title: 'Secure Evidence Chain',
    desc: 'Tamper-proof digital evidence with GPS metadata, timestamps, and cryptographic signing.',
    svg: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="4" y="9" width="12" height="9" rx="2" />
        <path d="M7 9V6a3 3 0 016 0v3" />
        <circle cx="10" cy="13.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Live Command Dashboard',
    desc: 'Command centres get real-time feeds, violation heat maps, and predictive enforcement analytics.',
    svg: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="3" width="16" height="11" rx="1.5" />
        <polyline points="5 10 7.5 7 10 9 13 5.5 15 8" />
        <line x1="6" y1="17" x2="14" y2="17" />
        <line x1="10" y1="14" x2="10" y2="17" />
      </svg>
    ),
  },
  {
    title: 'Court-Ready Output',
    desc: 'Automated generation of legally compliant fine notices and evidentiary packages aligned to SA law.',
    svg: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M6 2h8a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z" />
        <line x1="7.5" y1="7"  x2="12.5" y2="7"  />
        <line x1="7.5" y1="10" x2="12.5" y2="10" />
        <line x1="7.5" y1="13" x2="10"   y2="13" />
      </svg>
    ),
  },
]

/* Individual card with mouse-tracking 3D tilt */
function FeatureCard({ f, i }: { f: typeof features[0]; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null!)
  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)

  const rotX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]),  { stiffness: 200, damping: 20 })
  const rotY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]),  { stiffness: 200, damping: 20 })
  const gX   = useSpring(useTransform(mouseX, [-0.5, 0.5], [35, 65]), { stiffness: 200, damping: 20 })
  const gY   = useSpring(useTransform(mouseY, [-0.5, 0.5], [35, 65]), { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.65, delay: i * 0.08, ease: E }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
      className='group relative flex flex-col gap-5 p-7 rounded-2xl cursor-default'
    >
      {/* Glass background */}
      <div className='absolute inset-0 rounded-2xl transition-all duration-300'
        style={{
          background: 'rgba(6,11,20,0.55)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      />

      {/* Mouse-tracking glare */}
      <motion.div
        className='absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        style={{
          background: useTransform(
            [gX, gY] as any,
            ([x, y]: number[]) => `radial-gradient(circle at ${x}% ${y}%, rgba(0,163,255,0.12) 0%, transparent 60%)`
          ),
        }}
      />

      {/* Hover border glow */}
      <div className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'
        style={{ border: '1px solid rgba(0,163,255,0.25)' }} />

      {/* Content lifted in Z */}
      <div style={{ transform: 'translateZ(20px)' }} className='relative flex flex-col gap-5'>
        <div className='w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[#00A3FF]'
          style={{ background: 'rgba(0,163,255,0.09)', border: '1px solid rgba(0,163,255,0.18)' }}>
          {f.svg}
        </div>
        <div className='flex flex-col gap-2'>
          <h3 className='font-brand font-bold text-white text-[17px] leading-snug tracking-tight'>{f.title}</h3>
          <p className='text-white/40 text-sm leading-relaxed font-light'>{f.desc}</p>
        </div>
      </div>
    </motion.div>
  )
}

// need ref import
import { useRef } from 'react'

export default function FeaturesSection() {
  const { ref, bgY, bgScale, sectionY } = useParallax()

  return (
    <motion.section
      ref={ref as any}
      className='relative py-32 px-6 md:px-10 overflow-hidden'
      style={{ perspective: '1200px' }}
    >
      {/* Parallax background */}
      <motion.div className='absolute inset-0 z-0' style={{ y: bgY, scale: bgScale }}>
        <Image
          src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
          alt=''
          fill
          className='object-cover object-center'
          sizes='100vw'
          aria-hidden='true'
        />
        <div className='absolute inset-0' style={{ background: 'linear-gradient(180deg, rgba(6,11,20,0.75) 0%, rgba(6,11,20,0.60) 50%, rgba(6,11,20,0.80) 100%)' }} />
      </motion.div>

      <div className='absolute top-0 inset-x-0 h-px z-10' style={{ background: 'linear-gradient(90deg,transparent,rgba(0,163,255,0.3),transparent)' }} />
      <div className='absolute bottom-0 inset-x-0 h-px z-10' style={{ background: 'linear-gradient(90deg,transparent,rgba(0,163,255,0.15),transparent)' }} />

      {/* Content with subtle Y lift on scroll */}
      <motion.div className='relative z-10 max-w-7xl mx-auto' style={{ y: sectionY }}>

        <motion.div
          initial={{ opacity: 0, y: 28, rotateX: 6 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: E }}
          style={{ transformPerspective: 1000 }}
          className='mb-20'
        >
          <span className='inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[#00A3FF] font-semibold mb-5'>
            <span className='w-5 h-px bg-[#00A3FF]' />
            Capabilities
          </span>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6'>
            <h2 className='font-brand text-5xl md:text-6xl font-bold text-white leading-[1.0] tracking-tight'>
              Intelligent enforcement<br />
              <span className='text-white/40 font-light'>at every scale</span>
            </h2>
            <p className='text-white/35 text-sm font-light leading-relaxed max-w-xs md:text-right'>
              End-to-end traffic enforcement powered by computer vision — from aerial capture to court submission.
            </p>
          </div>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          style={{ transformStyle: 'preserve-3d' }}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} />
          ))}
        </div>

      </motion.div>
    </motion.section>
  )
}
