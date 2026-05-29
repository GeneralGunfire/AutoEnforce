'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'

const E = [0.25, 0.46, 0.45, 0.94] as const

const PANELS = [
  {
    src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=70',
    alt: 'Highway overhead view',
    label: 'N1 · Johannesburg North',
    w: 'clamp(220px, 30vw, 420px)',
    aspect: '4/3',
    x: '-42%', y: '-12%',
    rotY: 22, rotX: -4,
    z: 1.08,
    delay: 0,
    badge: 'LIVE',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=70',
    alt: 'Urban intersection',
    label: 'M1 · Cape Town CBD',
    w: 'clamp(180px, 24vw, 340px)',
    aspect: '3/4',
    x: '38%', y: '-24%',
    rotY: -18, rotX: 6,
    z: 0.9,
    delay: 0.12,
    badge: null,
  },
  {
    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=70',
    alt: 'Aerial city view',
    label: 'N2 · Durban Harbour',
    w: 'clamp(200px, 28vw, 380px)',
    aspect: '16/9',
    x: '-55%', y: '36%',
    rotY: 14, rotX: -8,
    z: 0.85,
    delay: 0.24,
    badge: 'RECORDING',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=70',
    alt: 'Mountainous road',
    label: 'N14 · Pretoria West',
    w: 'clamp(160px, 20vw, 300px)',
    aspect: '1/1',
    x: '52%', y: '30%',
    rotY: -26, rotX: 5,
    z: 0.78,
    delay: 0.36,
    badge: null,
  },
  {
    src: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=70',
    alt: 'Night highway',
    label: 'R21 · OR Tambo',
    w: 'clamp(240px, 34vw, 460px)',
    aspect: '16/10',
    x: '8%', y: '48%',
    rotY: -8, rotX: -12,
    z: 0.95,
    delay: 0.48,
    badge: 'AI ACTIVE',
  },
]

// Single spring for mouse — shared across all panels
function FloatingPanel({
  panel,
  scrollProg,
  mouseX,
  mouseY,
}: {
  panel: typeof PANELS[0]
  scrollProg: any
  mouseX: any
  mouseY: any
}) {
  const z = panel.z
  // useTransform directly — no per-panel spring, uses parent spring
  const translateZ = useTransform(scrollProg, [0, 1], [0, 120 * z])
  const driftY     = useTransform(scrollProg, [0, 1], [0, -(28 * z)])
  const tiltX      = useTransform(mouseX, [-1, 1], [-(z * 14), z * 14])
  const tiltY      = useTransform(mouseY, [-1, 1], [-(z * 10), z * 10])

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
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.2, delay: panel.delay, ease: E }}
    >
      {/* Glow */}
      <motion.div
        className='absolute -inset-1 rounded-2xl pointer-events-none'
        animate={{ opacity: [0.04, 0.10, 0.04] }}
        transition={{ duration: 4 + panel.delay * 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'rgba(232,224,208,0.9)', filter: 'blur(14px)' }}
      />

      {/* Image */}
      <div className='relative w-full h-full rounded-xl overflow-hidden'
        style={{
          border: '1px solid rgba(232,224,208,0.13)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}>
        <Image
          src={panel.src} alt={panel.alt} fill
          className='object-cover'
          sizes='460px'
          loading='lazy'
        />
        <div className='absolute inset-0'
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,8,8,0.5) 100%)' }} />

        {panel.badge && (
          <div className='absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded'
            style={{ background: 'rgba(8,8,8,0.75)', border: '1px solid rgba(232,224,208,0.14)' }}>
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className='w-1.5 h-1.5 rounded-full bg-white'
            />
            <span className='text-white/65 text-[9px] tracking-[0.18em] uppercase font-mono'>{panel.badge}</span>
          </div>
        )}

        <div className='absolute bottom-0 inset-x-0 px-3 py-2'
          style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.85), transparent)' }}>
          <p className='text-white/40 text-[9px] tracking-[0.2em] uppercase font-mono'>{panel.label}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function SceneRoom() {
  const ref  = useRef<HTMLDivElement>(null)

  // Single shared mouse motion values — no per-panel springs
  const mxMV = useMotionValue(0)
  const myMV = useMotionValue(0)
  // One spring for the whole scene
  const smx  = useSpring(mxMV, { stiffness: 40, damping: 20 })
  const smy  = useSpring(myMV, { stiffness: 40, damping: 20 })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // One spring for scroll
  const sp = useSpring(scrollYProgress, { stiffness: 35, damping: 20 })

  const opacity    = useTransform(sp, [0, 0.1, 1], [0, 1, 1])
  const cameraZ    = useTransform(sp, [0, 1], [0, 1])
  const titleY     = useTransform(sp, [0, 0.25, 0.65, 0.85], [60, 0, -25, -60])
  const titleOp    = useTransform(sp, [0, 0.14, 0.55, 0.72], [0, 1, 1, 0])
  const perspOX    = useTransform(sp, [0, 1], ['50% 45%', '50% 52%'])
  const gridScale  = useTransform(sp, [0, 1], [1, 1.15])
  const gridOp     = useTransform(sp, [0, 0.15, 0.7, 1], [0, 0.04, 0.025, 0])
  const beamX      = useTransform(sp, [0, 1], ['-120%', '220%'])

  // Throttle mouse updates with RAF
  const rafPending = useRef(false)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafPending.current) return
    rafPending.current = true
    requestAnimationFrame(() => {
      const rect = ref.current?.getBoundingClientRect()
      if (rect) {
        mxMV.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
        myMV.set(((e.clientY - rect.top)  / rect.height) * 2 - 1)
      }
      rafPending.current = false
    })
  }
  const handleMouseLeave = () => { mxMV.set(0); myMV.set(0) }

  return (
    <motion.section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className='relative min-h-[200vh] overflow-hidden'
      style={{ background: '#080808' }}
    >
      <motion.div
        className='sticky top-0 h-screen flex items-center justify-center overflow-hidden'
        style={{ perspective: '1100px', perspectiveOrigin: perspOX as any }}
      >
        {/* Ambient */}
        <div className='absolute inset-0 pointer-events-none'
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,224,208,0.04) 0%, transparent 70%)' }} />

        {/* Depth grid */}
        <motion.div className='absolute inset-0 pointer-events-none'
          style={{
            scale: gridScale, opacity: gridOp,
            backgroundImage: `linear-gradient(rgba(232,224,208,1) 1px,transparent 1px),linear-gradient(90deg,rgba(232,224,208,1) 1px,transparent 1px)`,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 72%)',
          } as any}
        />

        {/* Light beam */}
        <motion.div
          className='absolute inset-y-0 w-[30vw] pointer-events-none'
          style={{ x: beamX, background: 'linear-gradient(90deg,transparent,rgba(232,224,208,0.025),transparent)' }}
        />

        {/* Panels */}
        <motion.div
          className='absolute inset-0 flex items-center justify-center'
          style={{ opacity, transformStyle: 'preserve-3d' }}
        >
          {PANELS.map((panel) => (
            <FloatingPanel key={panel.label} panel={panel} scrollProg={cameraZ} mouseX={smx} mouseY={smy} />
          ))}
        </motion.div>

        {/* Title */}
        <motion.div
          style={{ y: titleY, opacity: titleOp, zIndex: 20 }}
          className='relative text-center px-6 pointer-events-none select-none'
        >
          <motion.p
            className='text-[11px] tracking-[0.55em] uppercase mb-6 font-mono'
            style={{ color: 'rgba(232,224,208,0.35)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: E }}
          >
            Enforcement Network
          </motion.p>
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
          <motion.p
            className='mt-6 text-sm font-light tracking-wide max-w-sm mx-auto'
            style={{ color: 'rgba(232,224,208,0.38)' }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.38, ease: E }}>
            Real-time feeds from every major corridor.<br />Every plate. Every second.
          </motion.p>
        </motion.div>

        <div className='absolute bottom-0 inset-x-0 h-40 pointer-events-none z-30'
          style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
        <div className='absolute top-0 inset-x-0 h-36 pointer-events-none z-30'
          style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }} />
      </motion.div>
    </motion.section>
  )
}
