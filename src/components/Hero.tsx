'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

// Only the top-down / aerial road clips
const LEFT_CLIP  = '/video/clip1.mp4'   // 14114362 — top-view highway UHD
const RIGHT_CLIP = '/video/clip3.mp4'   // 2103099  — aerial traffic UHD

export default function Hero() {
  const videoLeft  = useRef<HTMLVideoElement>(null)
  const videoRight = useRef<HTMLVideoElement>(null)

  const [ready, setReady]         = useState(false)
  const [showScroll, setShowScroll] = useState(true)
  const [textVisible, setTextVisible] = useState(false)

  const brandControls   = useAnimation()
  const subtextControls = useAnimation()
  const btnControls     = useAnimation()
  const animDone        = useRef(false)

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Reveal text after 3s of playing (both are looping, so just use a timer)
  const triggerText = () => {
    if (animDone.current) return
    animDone.current = true

    if (prefersReducedMotion) {
      brandControls.set({ opacity: 1, y: 0 })
      subtextControls.set({ opacity: 1, y: 0 })
      btnControls.set({ opacity: 1, y: 0 })
      setTextVisible(true)
      return
    }

    setTextVisible(true)

    brandControls.start({
      opacity: 1, y: 0,
      transition: { duration: 0.9, ease: EASE_OUT_EXPO },
    })
    setTimeout(() => {
      subtextControls.start({
        opacity: 1, y: 0,
        transition: { duration: 0.9, ease: EASE_OUT_EXPO },
      })
    }, 200)
    setTimeout(() => {
      btnControls.start({
        opacity: 1, y: 0,
        transition: { duration: 0.8, ease: EASE_OUT_EXPO },
      })
    }, 450)
  }

  // Ready gate + text timer
  useEffect(() => {
    const vl = videoLeft.current
    const vr = videoRight.current
    if (!vl || !vr) return

    let readyCount = 0
    const onReady = () => {
      readyCount++
      if (readyCount >= 1) setReady(true)   // show as soon as one is ready
    }

    vl.addEventListener('canplay',    onReady, { once: true })
    vl.addEventListener('loadeddata', onReady, { once: true })
    vl.addEventListener('playing',    onReady, { once: true })

    const fallback   = setTimeout(() => setReady(true), 1500)
    const textTimer  = setTimeout(triggerText, 3200)   // reveal text after ~3s

    return () => {
      clearTimeout(fallback)
      clearTimeout(textTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll indicator
  useEffect(() => {
    const h = () => { if (window.scrollY > 50) setShowScroll(false) }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <>
      {/* ── Loading screen ──────────────────────────────────────── */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: '#060608',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexDirection: 'column', gap: 24,
            }}
          >
            <motion.p
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                color: '#fff', fontSize: 11, letterSpacing: '0.35em',
                textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', margin: 0,
              }}
            >
              AutoEnforce ZA
            </motion.p>
            <div style={{ width: 100, height: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 1, overflow: 'hidden' }}>
              <motion.div
                animate={{ x: ['-100%', '110%'] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: '55%', height: '100%', background: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        aria-label="AutoEnforce ZA hero section"
        style={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          background: '#060608',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // 3-D stage
          perspective: '1000px',
          perspectiveOrigin: '50% 55%',
        }}
      >

        {/* ── Radial glow behind panels ── */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 30% 55%, rgba(80,100,255,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 70% 55%, rgba(120,80,255,0.07) 0%, transparent 70%)
          `,
        }} />

        {/* ══ 3-D VIDEO PANELS CONTAINER ══════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.1 }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5vw',
            transformStyle: 'preserve-3d',
            zIndex: 1,
          }}
        >

          {/* ── LEFT PANEL — rotated toward viewer on right edge ── */}
          <motion.div
            initial={{ rotateY: 0, x: 0 }}
            animate={ready ? { rotateY: 18, x: '-2vw' } : {}}
            transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.2 }}
            style={{
              width: 'clamp(280px, 38vw, 580px)',
              aspectRatio: '16/10',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.07),
                0 30px 80px rgba(0,0,0,0.7),
                0 0 60px rgba(80,100,255,0.08)
              `,
              transformStyle: 'preserve-3d',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {/* Subtle glare on left panel */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
              borderRadius: 12,
            }} />
            <video
              ref={videoLeft}
              autoPlay muted playsInline loop preload="auto"
              aria-label="Aerial highway footage"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            >
              <source src={LEFT_CLIP} type="video/mp4" />
              <track kind="captions" src="/video/captions.vtt" />
            </video>
          </motion.div>

          {/* ── RIGHT PANEL — rotated toward viewer on left edge ── */}
          <motion.div
            initial={{ rotateY: 0, x: 0 }}
            animate={ready ? { rotateY: -18, x: '2vw' } : {}}
            transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.3 }}
            style={{
              width: 'clamp(280px, 38vw, 580px)',
              aspectRatio: '16/10',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.07),
                0 30px 80px rgba(0,0,0,0.7),
                0 0 60px rgba(120,80,255,0.08)
              `,
              transformStyle: 'preserve-3d',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {/* Subtle glare on right panel */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
              borderRadius: 12,
            }} />
            <video
              ref={videoRight}
              autoPlay muted playsInline loop preload="auto"
              aria-label="Aerial traffic footage"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            >
              <source src={RIGHT_CLIP} type="video/mp4" />
            </video>
          </motion.div>

        </motion.div>

        {/* ── Floor reflection strip ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.8 }}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '18vh',
            background: 'linear-gradient(to top, rgba(6,6,8,0.95) 0%, transparent 100%)',
            zIndex: 2,
          }}
        />

        {/* ── Top fade ─────────────────────────────────────────────*/}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '15vh',
          background: 'linear-gradient(to bottom, rgba(6,6,8,0.8) 0%, transparent 100%)',
          zIndex: 2,
        }} />

        {/* ══ TEXT — bottom-left, like the reference ══════════════ */}
        <div style={{
          position: 'absolute',
          bottom: '12vh',
          left: 'clamp(24px, 5vw, 80px)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 480,
        }}>
          {/* Nav-style tag */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={textVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <div style={{ width: 3, height: 14, background: '#4f6cff', borderRadius: 2 }} />
            <span style={{
              color: 'rgba(255,255,255,0.5)', fontSize: 11,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif', fontWeight: 400,
            }}>
              Enforcement Technology
            </span>
          </motion.div>

          {/* Brand headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={brandControls}
            style={{
              margin: 0, color: '#fff',
              fontWeight: 700,
              fontSize: 'clamp(32px, 4.5vw, 54px)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              fontFamily: 'Inter, system-ui, sans-serif',
              textShadow: '0 4px 32px rgba(0,0,0,0.5)',
            }}
          >
            AutoEnforce ZA
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={subtextControls}
            style={{
              margin: 0,
              color: 'rgba(255,255,255,0.55)',
              fontWeight: 300,
              fontSize: 'clamp(13px, 1.5vw, 16px)',
              letterSpacing: '0.04em',
              lineHeight: 1.6,
              fontFamily: 'Inter, sans-serif',
              maxWidth: 360,
            }}
          >
            Redefining policing with next-generation<br />
            traffic enforcement technology.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={btnControls}
            style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}
          >
            <button style={{
              background: '#4f6cff',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 24px',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 24px rgba(79,108,255,0.35)',
            }}>
              Learn More
            </button>
            <span style={{
              color: 'rgba(255,255,255,0.35)', fontSize: 12,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif', cursor: 'pointer',
            }}>
              View Demo →
            </span>
          </motion.div>
        </div>

        {/* ── Scroll indicator ─────────────────────────────────────*/}
        <AnimatePresence>
          {showScroll && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 6, 0],
                transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', bottom: 24, right: 'clamp(24px, 4vw, 60px)',
                color: 'rgba(255,255,255,0.4)', zIndex: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}
            >
              <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                fontFamily: 'Inter,sans-serif' }}>Scroll</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

      </section>
    </>
  )
}
