'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'

const E = [0.25, 0.46, 0.45, 0.94] as const

const PANELS = [
  {
    src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80',
    alt: 'Highway overhead view',
    label: 'N1 · Johannesburg North',
    w: 'clamp(220px, 30vw, 420px)',
    aspect: '4/3',
    x: '-42%', y: '-12%',
    rotY: 22, rotX: -4,
    zScale: 1.08,
    delay: 0,
    badge: 'LIVE',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    alt: 'Urban intersection',
    label: 'M1 · Cape Town CBD',
    w: 'clamp(180px, 24vw, 340px)',
    aspect: '3/4',
    x: '38%', y: '-24%',
    rotY: -18, rotX: 6,
    zScale: 0.9,
    delay: 0.15,
    badge: null,
  },
  {
    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
    alt: 'Aerial city view',
    label: 'N2 · Durban Harbour',
    w: 'clamp(200px, 28vw, 380px)',
    aspect: '16/9',
    x: '-55%', y: '36%',
    rotY: 14, rotX: -8,
    zScale: 0.85,
    delay: 0.3,
    badge: 'RECORDING',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    alt: 'Mountainous road',
    label: 'N14 · Pretoria West',
    w: 'clamp(160px, 20vw, 300px)',
    aspect: '1/1',
    x: '52%', y: '30%',
    rotY: -26, rotX: 5,
    zScale: 0.78,
    delay: 0.45,
    badge: null,
  },
  {
    src: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80',
    alt: 'Night highway',
    label: 'R21 · OR Tambo',
    w: 'clamp(240px, 34vw, 460px)',
    aspect: '16/10',
    x: '8%', y: '48%',
    rotY: -8, rotX: -12,
    zScale: 0.95,
    delay: 0.6,
    badge: 'AI ACTIVE',
  },
]

interface PanelProps {
  panel: typeof PANELS[0]
  scrollProg: any   // 0→1 through section
  mouseX: any
  mouseY: any
}

function FloatingPanel({ panel, scrollProg, mouseX, mouseY }: PanelProps) {
  const z = panel.zScale

  // Forward camera push — near panels advance faster than far
  const translateZ = useTransform(scrollProg, [0, 1], [0, 140 * z])
  const spZ = useSpring(translateZ, { stiffness: 38, damping: 16 })

  // Vertical drift — panels at different y positions drift at different rates
  const driftY = useTransform(scrollProg, [0, 1], [0, -(30 * z)])
  const spDY   = useSpring(driftY, { stiffness: 38, damping: 16 })

  // Mouse parallax — deeper panels tilt more
  const tiltX = useTransform(mouseX, [-1, 1], [-(z * 18), z * 18])
  const tiltY = useTransform(mouseY, [-1, 1], [-(z * 12), z * 12])
  const spTX  = useSpring(tiltX, { stiffness: 70, damping: 26 })
  const spTY  = useSpring(tiltY, { stiffness: 70, damping: 26 })

  // Subtle scale pulse on idle
  return (
    <motion.div
      className='absolute pointer-events-none select-none'
      style={{
        left: panel.x,
        top: panel.y,
        width: panel.w,
        aspectRatio: panel.aspect,
        rotateY: panel.rotY,
        rotateX: panel.rotX,
        z: spZ,
        translateZ: spZ,
        x: spTX,
        y: spDY,
      }}
      initial={{ opacity: 0, scale: 0.82 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.3, delay: panel.delay, ease: E }}
    >
      {/* Glow ring */}
      <motion.div
        className='absolute -inset-1 rounded-2xl pointer-events-none z-0'
        animate={{ opacity: [0.04, 0.12, 0.04] }}
        transition={{ duration: 4 + panel.delay * 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'rgba(232,224,208,1)', filter: 'blur(12px)' }}
      />

      {/* Border */}
      <div className='absolute -inset-px rounded-xl pointer-events-none z-10'
        style={{ border: '1px solid rgba(232,224,208,0.14)', boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)' }}
      />

      {/* Image */}
      <div className='relative w-full h-full rounded-xl overflow-hidden'
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.75)' }}>
        <Image src={panel.src} alt={panel.alt} fill className='object-cover' sizes='500px' />
        <div className='absolute inset-0' style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(8,8,8,0.55) 100%)' }} />
        {/* Moving glare that sweeps */}
        <motion.div
          className='absolute inset-0 pointer-events-none'
          animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
          transition={{ duration: 8 + panel.delay * 3, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)',
            backgroundSize: '300% 100%',
          }}
        />

        {panel.badge && (
          <div className='absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md'
            style={{ background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(232,224,208,0.16)' }}>
            <motion.div animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
              className='w-1.5 h-1.5 rounded-full bg-white' />
            <span className='text-white/70 text-[9px] tracking-[0.2em] uppercase font-mono'>{panel.badge}</span>
          </div>
        )}

        <div className='absolute bottom-0 inset-x-0 px-3 py-2.5'
          style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.92), transparent)' }}>
          <p className='text-white/45 text-[9px] tracking-[0.22em] uppercase font-mono'>{panel.label}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function SceneRoom() {
  const ref  = useRef<HTMLDivElement>(null)
  const mxMV = useMotionValue(0)
  const myMV = useMotionValue(0)
  const smx  = useSpring(mxMV, { stiffness: 55, damping: 22 })
  const smy  = useSpring(myMV, { stiffness: 55, damping: 22 })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sp = useSpring(scrollYProgress, { stiffness: 38, damping: 18 })

  const opacity = useTransform(sp, [0, 0.08, 0.88, 1], [0, 1, 1, 0])

  // Camera Z — drives all panel depth movement
  const cameraZ = useTransform(sp, [0, 1], [0, 1])

  // Title: rises in, then drifts up and fades as panels take over
  const titleY  = useTransform(sp, [0, 0.25, 0.65, 0.85], [70, 0, -30, -70])
  const titleOp = useTransform(sp, [0, 0.14, 0.55, 0.72], [0, 1, 1, 0])
  const titleScale = useTransform(sp, [0, 0.25], [0.94, 1])

  // Perspective shift — POV slowly tilts as you scroll (subtle)
  const perspOX = useTransform(sp, [0, 1], ['50% 45%', '50% 52%'])

  // Grid parallax — grid drifts toward viewer
  const gridScale = useTransform(sp, [0, 1], [1, 1.18])
  const gridOp    = useTransform(sp, [0, 0.15, 0.7, 1], [0, 0.04, 0.025, 0])

  // Light beam that sweeps across
  const beamX = useTransform(sp, [0, 1], ['-120%', '220%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect()
    mxMV.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
    myMV.set(((e.clientY - rect.top)  / rect.height) * 2 - 1)
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
        style={{ perspective: '1100px', perspectiveOrigin: perspOX } as any}
      >
        {/* Ambient radial */}
        <motion.div className='absolute inset-0 z-0 pointer-events-none'
          style={{ opacity: useTransform(sp, [0, 0.5, 1], [0.5, 1, 0.5]) }}
        >
          <div style={{ position:'absolute', inset:0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(50,70,180,0.07) 0%, transparent 70%)' }} />
        </motion.div>

        {/* Depth grid — scales toward viewer on scroll */}
        <motion.div className='absolute inset-0 z-0 pointer-events-none'
          style={{
            scale: gridScale,
            opacity: gridOp,
            backgroundImage: `
              linear-gradient(rgba(232,224,208,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232,224,208,1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 72%)',
          } as any}
        />

        {/* Horizontal light sweep */}
        <motion.div
          className='absolute inset-y-0 w-[30vw] pointer-events-none z-0'
          style={{
            x: beamX,
            background: 'linear-gradient(90deg, transparent, rgba(232,224,208,0.025), transparent)',
          }}
        />

        {/* 3D panels */}
        <motion.div
          className='absolute inset-0 flex items-center justify-center'
          style={{ opacity, transformStyle: 'preserve-3d' }}
        >
          {PANELS.map((panel) => (
            <FloatingPanel key={panel.label} panel={panel} scrollProg={cameraZ} mouseX={smx} mouseY={smy} />
          ))}
        </motion.div>

        {/* Center title */}
        <motion.div
          style={{ y: titleY, opacity: titleOp, scale: titleScale, zIndex: 20 }}
          className='relative text-center px-6 pointer-events-none select-none'
        >
          {/* Eyebrow — letter by letter */}
          <motion.p
            className='text-[11px] tracking-[0.55em] uppercase mb-6 font-mono'
            style={{ color: 'rgba(232,224,208,0.35)' }}
            initial={{ opacity: 0, letterSpacing: '0.8em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.55em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: E }}
          >
            Enforcement Network
          </motion.p>

          <h2 className='font-brand font-bold text-white leading-none'
            style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', letterSpacing: '-0.04em' }}>
            {/* Each word slides in from a different axis */}
            <motion.span
              className='block'
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: E }}
            >
              Nationwide
            </motion.span>
            <motion.span
              className='block'
              style={{ color: 'rgba(232,224,208,0.22)', fontWeight: 300 }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.25, ease: E }}
            >
              Coverage
            </motion.span>
          </h2>

          <motion.p
            className='mt-7 text-sm font-light tracking-wide max-w-sm mx-auto'
            style={{ color: 'rgba(232,224,208,0.38)' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4, ease: E }}
          >
            Real-time feeds from every major corridor.<br />Every plate. Every second.
          </motion.p>
        </motion.div>

        {/* Floor / ceiling fades */}
        <div className='absolute bottom-0 inset-x-0 h-40 pointer-events-none z-30'
          style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
        <div className='absolute top-0 inset-x-0 h-36 pointer-events-none z-30'
          style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }} />
      </motion.div>
    </motion.section>
  )
}
