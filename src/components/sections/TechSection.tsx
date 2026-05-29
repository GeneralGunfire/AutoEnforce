'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const E = [0.25, 0.46, 0.45, 0.94] as const

const bullets = [
  'Multi-spectral arrays capture violations across all lighting and weather conditions',
  'Edge AI processing — decisions happen at point of capture with zero cloud latency',
  'Plate recognition trained on all SA formats: standard, personalised, and temporary',
]

export default function TechSection() {
  return (
    <section className='relative py-32 px-6 md:px-10 overflow-hidden'>

      {/* Background — city at night / surveillance feel */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80'
          alt=''
          fill
          className='object-cover object-center'
          sizes='100vw'
          aria-hidden='true'
        />
        <div className='absolute inset-0' style={{ background: 'linear-gradient(135deg, rgba(4,8,15,0.80) 0%, rgba(4,8,15,0.55) 50%, rgba(4,8,15,0.82) 100%)' }} />
      </div>

      <div className='absolute top-0 inset-x-0 h-px z-10' style={{ background: 'linear-gradient(90deg,transparent,rgba(0,163,255,0.2),transparent)' }} />
      <div className='absolute bottom-0 inset-x-0 h-px z-10' style={{ background: 'linear-gradient(90deg,transparent,rgba(0,163,255,0.1),transparent)' }} />

      <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>

        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: E }}
        >
          <span className='inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[#00A3FF] font-semibold mb-5'>
            <span className='w-5 h-px bg-[#00A3FF]' />
            The Technology
          </span>
          <h2 className='font-brand text-5xl md:text-6xl font-bold text-white leading-[1.0] tracking-tight mb-8'>
            Computer vision built<br />
            <span className='text-white/35 font-light'>for South African roads</span>
          </h2>

          <ul className='flex flex-col gap-7 mb-12'>
            {bullets.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 + i * 0.1, ease: E }}
                className='flex items-start gap-4'
              >
                <div className='mt-2 w-4 h-px bg-[#00A3FF] shrink-0' />
                <span className='text-white/50 text-[15px] font-light leading-relaxed'>{b}</span>
              </motion.li>
            ))}
          </ul>

          <a href='#' className='inline-flex items-center gap-2 text-[#00A3FF] text-sm font-semibold tracking-wide group'>
            Request Technical Brief
            <span className='transition-transform duration-200 group-hover:translate-x-1'>→</span>
          </a>
        </motion.div>

        {/* Right — live detection mock */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: E }}
          className='relative rounded-2xl overflow-hidden'
          style={{
            background: 'rgba(4,8,15,0.55)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          {/* Header bar */}
          <div className='flex items-center justify-between px-5 py-4' style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className='flex items-center gap-2'>
              <div className='w-1.5 h-1.5 rounded-full bg-[#00A3FF]' />
              <span className='text-[10px] text-white/25 tracking-[0.2em] uppercase font-mono'>N1 JHB North — Feed 01</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className='w-1.5 h-1.5 rounded-full bg-red-400'
              />
              <span className='text-[10px] text-red-400 tracking-[0.15em] uppercase font-mono'>Live</span>
            </div>
          </div>

          {/* Camera frame */}
          <div className='relative mx-5 my-5 rounded-xl overflow-hidden' style={{ aspectRatio: '16/9', background: '#020407', border: '1px solid rgba(255,255,255,0.04)' }}>
            {/* Corner brackets */}
            {[
              { top: 8,    left:  8,   bt: true,  bl: true  },
              { top: 8,    right: 8,   bt: true,  br: true  },
              { bottom: 8, left:  8,   bb: true,  bl: true  },
              { bottom: 8, right: 8,   bb: true,  br: true  },
            ].map((c, i) => (
              <div key={i} className='absolute w-4 h-4 pointer-events-none' style={{
                top: c.top, left: c.left, right: c.right, bottom: c.bottom,
                borderTop:    c.bt ? '1.5px solid rgba(0,163,255,0.55)' : undefined,
                borderLeft:   c.bl ? '1.5px solid rgba(0,163,255,0.55)' : undefined,
                borderRight:  c.br ? '1.5px solid rgba(0,163,255,0.55)' : undefined,
                borderBottom: c.bb ? '1.5px solid rgba(0,163,255,0.55)' : undefined,
              }} />
            ))}

            {/* Detection box 1 — blue */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className='absolute rounded-sm'
              style={{ top: '26%', left: '20%', width: '27%', height: '30%', border: '1px solid rgba(0,163,255,0.65)', boxShadow: '0 0 12px rgba(0,163,255,0.15)' }}
            >
              <span className='absolute -top-4 left-0 text-[8px] font-mono tracking-wider text-[#00A3FF]'>CA 123-456</span>
              <span className='absolute -bottom-4 left-0 text-[8px] font-mono text-[#00A3FF]/50'>97.8%</span>
            </motion.div>

            {/* Detection box 2 — amber violation */}
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3.1, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
              className='absolute rounded-sm'
              style={{ top: '42%', left: '54%', width: '22%', height: '28%', border: '1px solid rgba(246,173,85,0.7)', boxShadow: '0 0 12px rgba(246,173,85,0.12)' }}
            >
              <span className='absolute -top-4 left-0 text-[8px] font-mono tracking-wider text-[#F6AD55]'>GP 87-XJ-99</span>
              <span className='absolute -bottom-4 left-0 text-[8px] font-mono text-[#F6AD55]/70'>VIOLATION</span>
            </motion.div>

            {/* Scan line */}
            <motion.div
              animate={{ y: ['-5%', '105%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
              className='absolute inset-x-0 h-px pointer-events-none'
              style={{ background: 'linear-gradient(90deg,transparent,rgba(0,163,255,0.45),transparent)' }}
            />
            <span className='absolute bottom-2 right-3 text-[7px] text-white/12 font-mono tracking-widest'>AEZA-CAM-N1-047</span>
          </div>

          {/* Stat rows */}
          <div className='px-5 pb-5 flex flex-col'>
            {[
              { label: 'Plates Detected',    value: '1,247', color: '#00A3FF' },
              { label: 'Violations Flagged', value: '38',    color: '#F6AD55' },
              { label: 'Processing Latency', value: '1.8s',  color: '#4ade80' },
            ].map((row) => (
              <div key={row.label} className='flex items-center justify-between py-3' style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className='text-white/25 text-[11px] tracking-[0.18em] uppercase font-mono'>{row.label}</span>
                <span className='font-brand font-bold text-sm tabular-nums' style={{ color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
