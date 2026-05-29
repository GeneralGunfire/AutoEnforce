'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'

const E = [0.25, 0.46, 0.45, 0.94] as const

const PANELS = [
  {
    src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=65',
    alt: 'Highway overhead view',
    label: 'N1 · Johannesburg',
    w: 'clamp(200px, 28vw, 400px)',
    aspect: '4/3',
    x: '-42%', y: '-12%',
    rotY: 22, rotX: -4,
    z: 1.08,
    delay: 0,
    badge: 'LIVE',
  },
  {
    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=65',
    alt: 'Aerial city view',
    label: 'N2 · Durban',
    w: 'clamp(180px, 26vw, 360px)',
    aspect: '16/9',
    x: '-55%', y: '36%',
    rotY: 14, rotX: -8,
    z: 0.85,
    delay: 0.15,
    badge: null,
  },
  {
    src: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=65',
    alt: 'Night highway',
    label: 'R21 · OR Tambo',
    w: 'clamp(220px, 32vw, 440px)',
    aspect: '16/10',
    x: '8%', y: '42%',
    rotY: -8, rotX: -12,
    z: 0.95,
    delay: 0.3,
    badge: 'AI ACTIVE',
  },
]

function FloatingPanel({
  panel,
  scrollProg,
  mouseX,
}: {
  panel: typeof PANELS[0]
  scrollProg: any
  mouseX: any
}) {
  const z = panel.z
  const translateZ = useTransform(scrollProg, [0, 1], [0, 100 * z])
  const driftY     = useTransform(scrollProg, [0, 1], [0, -(24 * z)])
  const tiltX      = useTransform(mouseX, [-1, 1], [-(z * 10), z * 10])

  return (
    <motion.div
      className='absolute pointer-events-none select-none'
      style={{
        left: panel.x, top: panel.y,
        width: panel.w, aspectRatio: panel.aspect,
        rotateY: panel.rotY, rotateX: panel.rotX,
        translateZ, y: driftY, x: tiltX,
        willChange: 'transform',
      }}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.0, delay: panel.delay, ease: E }}
    >
      {/* Image — no infinite glow animation */}
      <div className='relative w-full h-full rounded-xl overflow-hidden'
        style={{
          border: '1px solid rgba(232,224,208,0.13)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
        }}>
        <Image
          src={panel.src} alt={panel.alt} fill
          className='object-cover'
          sizes='440px'
          loading='lazy'
        />
        <div className='absolute inset-0'
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,8,8,0.5) 100%)' }} />

        {panel.badge && (
          <div className='absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded'
            style={{ background: 'rgba(8,8,8,0.75)', border: '1px solid rgba(232,224,208,0.14)' }}>
            {/* Static dot — removed infinite animation */}
            <div className='w-1.5 h-1.5 rounded-full bg-white/70' />
            <span className='text-white/65 text-[9px] tracking-[0.18em] uppercase font-mono'>{panel.badge}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function SceneRoom() {
  const ref  = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Mouse tracking — desktop only
  const mxMV = useMotionValue(0)
  const smx  = useSpring(mxMV, { stiffness: 45, damping: 22 })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sp = useSpring(scrollYProgress, { stiffness: 40, damping: 22 })

  const opacity  = useTransform(sp, [0, 0.1, 1], [0, 1, 1])
  const cameraZ  = useTransform(sp, [0, 1], [0, 1])
  const titleY   = useTransform(sp, [0, 0.25, 0.65, 0.85], [60, 0, -25, -60])
  const titleOp  = useTransform(sp, [0, 0.14, 0.55, 0.72], [0, 1, 1, 0])

  const rafPending = useRef(false)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || rafPending.current) return
    rafPending.current = true
    requestAnimationFrame(() => {
      const rect = ref.current?.getBoundingClientRect()
      if (rect) mxMV.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
      rafPending.current = false
    })
  }
  const handleMouseLeave = () => { if (!isMobile) mxMV.set(0) }

  return (
    <motion.section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className='relative min-h-[180vh] overflow-hidden'
      style={{ background: '#080808' }}
    >
      <motion.div
        className='sticky top-0 h-screen flex items-center justify-center overflow-hidden'
        style={{ perspective: '1100px', perspectiveOrigin: '50% 50%' }}
      >
        {/* Ambient */}
        <div className='absolute inset-0 pointer-events-none'
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,224,208,0.04) 0%, transparent 70%)' }} />

        {/* Panels */}
        <motion.div
          className='absolute inset-0 flex items-center justify-center'
          style={{ opacity, transformStyle: 'preserve-3d' }}
        >
          {PANELS.map((panel) => (
            <FloatingPanel key={panel.label} panel={panel} scrollProg={cameraZ} mouseX={smx} />
          ))}
        </motion.div>

        {/* Title */}
        <motion.div
          style={{ y: titleY, opacity: titleOp, zIndex: 20 }}
          className='relative text-center px-6 pointer-events-none select-none'
        >
          <h2 className='font-brand font-bold text-white leading-none'
            style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', letterSpacing: '-0.04em' }}>
            <motion.span className='block'
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.1, ease: E }}>
              Nationwide
            </motion.span>
            <motion.span className='block'
              style={{ color: 'rgba(232,224,208,0.22)', fontWeight: 300 }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.22, ease: E }}>
              Coverage
            </motion.span>
          </h2>
        </motion.div>

        <div className='absolute bottom-0 inset-x-0 h-40 pointer-events-none z-30'
          style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
        <div className='absolute top-0 inset-x-0 h-36 pointer-events-none z-30'
          style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }} />
      </motion.div>
    </motion.section>
  )
}
