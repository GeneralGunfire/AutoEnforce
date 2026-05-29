'use client'

/**
 * SceneCinema — A tall scroll-driven scene where a single large panel (video/image)
 * feels like you're watching a cinematic frame. The panel slowly reveals, filling
 * the viewport, then pulls back as you continue scrolling. Text orbits it.
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'

const E = [0.25, 0.46, 0.45, 0.94] as const


export default function SceneCinema() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sp = useSpring(scrollYProgress, { stiffness: 45, damping: 20 })

  const sectionOp  = useTransform(sp, [0, 0.08, 0.9, 1], [0, 1, 1, 0])
  const panelScale = useTransform(sp, [0, 0.4, 0.7, 1], [0.72, 1.0, 1.0, 0.85])
  const panelY     = useTransform(sp, [0, 0.35, 0.75, 1], [80, 0, 0, -50])
  const panelOp    = useTransform(sp, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const panelRotX  = useTransform(sp, [0, 0.35, 1], [10, 0, -6])

  const headY  = useTransform(sp, [0, 0.35], [40, 0])
  const headOp = useTransform(sp, [0.05, 0.35, 0.8, 0.95], [0, 1, 1, 0])
  const spHeadY = useSpring(headY, { stiffness: 50, damping: 18 })

  const bgScale = useTransform(sp, [0, 1], [1.12, 1.0])

  return (
    <motion.section
      ref={ref}
      className='relative min-h-[220vh] overflow-hidden'
      style={{ background: '#080808' }}
    >
      <div className='sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden'
        style={{ perspective: '1200px', perspectiveOrigin: '50% 45%' }}>

        {/* Parallax background image */}
        <motion.div className='absolute inset-0 z-0' style={{ scale: bgScale }}>
          <Image
            src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80'
            alt='' fill className='object-cover object-top' sizes='100vw' aria-hidden
          />
          <div className='absolute inset-0' style={{ background: 'rgba(8,8,8,0.82)' }} />
        </motion.div>

        <motion.div style={{ opacity: sectionOp }} className='relative z-10 w-full flex flex-col items-center'>

          {/* Headline — appears above panel */}
          <motion.div style={{ y: spHeadY, opacity: headOp }} className='text-center mb-10 px-6 pointer-events-none select-none'>
            <p className='text-[11px] tracking-[0.45em] uppercase mb-4 font-mono'
              style={{ color: 'rgba(232,224,208,0.35)' }}>
              Live Detection Feed
            </p>
            <h2 className='font-brand font-bold text-white leading-none'
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', letterSpacing: '-0.04em' }}>
              See the system<br />
              <span style={{ color: 'rgba(232,224,208,0.28)', fontWeight: 300 }}>in action.</span>
            </h2>
          </motion.div>

          {/* Main panel */}
          <motion.div
            style={{ scale: panelScale, y: panelY, opacity: panelOp, rotateX: panelRotX }}
            className='relative'
            transition={{ duration: 0 }}
          >

            {/* The main video panel */}
            <div className='relative rounded-2xl overflow-hidden'
              style={{
                width: 'clamp(320px, 65vw, 860px)',
                aspectRatio: '16/10',
                border: '1px solid rgba(232,224,208,0.1)',
                boxShadow: '0 60px 160px rgba(0,0,0,0.85), 0 0 0 1px rgba(232,224,208,0.06)',
              }}>

              {/* Video feed */}
              <video
                src='/video/clip1.mp4'
                autoPlay muted loop playsInline
                className='absolute inset-0 w-full h-full object-cover'
                style={{ opacity: 0.8 }}
              />

              {/* Vignette */}
              <div className='absolute inset-0' style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(8,8,8,0.65) 100%)' }} />

              {/* Glare */}
              <div className='absolute inset-0' style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%)' }} />

              {/* Corner brackets */}
              {[
                { top: 14, left: 14,     borderTop: '1px solid rgba(232,224,208,0.5)', borderLeft: '1px solid rgba(232,224,208,0.5)' },
                { top: 14, right: 14,    borderTop: '1px solid rgba(232,224,208,0.5)', borderRight: '1px solid rgba(232,224,208,0.5)' },
                { bottom: 14, left: 14,  borderBottom: '1px solid rgba(232,224,208,0.5)', borderLeft: '1px solid rgba(232,224,208,0.5)' },
                { bottom: 14, right: 14, borderBottom: '1px solid rgba(232,224,208,0.5)', borderRight: '1px solid rgba(232,224,208,0.5)' },
              ].map((s, i) => (
                <div key={i} className='absolute w-5 h-5 pointer-events-none' style={s} />
              ))}

              {/* Horizontal scan line */}
              <motion.div
                animate={{ y: ['-5%', '105%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                className='absolute inset-x-0 h-px pointer-events-none'
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(232,224,208,0.35) 50%, transparent 100%)' }}
              />

              {/* Live badge */}
              <div className='absolute top-4 right-4 flex items-center gap-2'>
                <motion.div animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
                  className='w-1.5 h-1.5 rounded-full bg-white' />
                <span className='font-mono text-[9px] tracking-[0.2em] uppercase' style={{ color: 'rgba(255,255,255,0.45)' }}>Live</span>
              </div>

              {/* Stats bar */}
              <div className='absolute bottom-0 inset-x-0 px-5 py-3 flex items-center justify-between'
                style={{ background: 'rgba(8,8,8,0.82)', borderTop: '1px solid rgba(232,224,208,0.06)' }}>
                {[
                  { label: 'Plates scanned', val: '1,247' },
                  { label: 'Violations',      val: '38' },
                  { label: 'Response time',   val: '1.8s' },
                  { label: 'Uptime',          val: '99.9%' },
                ].map((s) => (
                  <div key={s.label} className='text-center'>
                    <div className='font-brand font-bold text-white text-sm tabular-nums'>{s.val}</div>
                    <div className='font-mono text-[9px] tracking-[0.12em] uppercase' style={{ color: 'rgba(232,224,208,0.3)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Glow beneath */}
            <div className='absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-10 blur-3xl pointer-events-none'
              style={{ background: 'rgba(232,224,208,0.04)' }} />
          </motion.div>

          {/* Caption */}
          <motion.p
            className='mt-10 font-mono text-[10px] tracking-[0.25em] uppercase text-center pointer-events-none'
            style={{ color: 'rgba(232,224,208,0.25)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            N1 Johannesburg North · Feed 01 · AEZA-CAM-N1-047
          </motion.p>
        </motion.div>

        {/* Top/bottom fade */}
        <div className='absolute top-0 inset-x-0 h-28 z-30 pointer-events-none'
          style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }} />
        <div className='absolute bottom-0 inset-x-0 h-28 z-30 pointer-events-none'
          style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
      </div>
    </motion.section>
  )
}
