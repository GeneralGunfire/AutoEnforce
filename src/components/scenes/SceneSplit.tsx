'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'

const E = [0.25, 0.46, 0.45, 0.94] as const

const FEATURES = [
  {
    tag: 'AI Detection',
    headline: 'See every\nviolation\ninstantly.',
    body: 'Our computer-vision stack processes 4K feeds at 60 fps, identifying plates, speed, and infraction type in under 80 ms.',
    stat: '99.4%',
    statLabel: 'Detection accuracy',
    panels: [
      { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=80', rotY: 12, rotX: -5, x: '-8%', y: '-14%', z: 1,    w: '62%', aspect: '16/10' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80', rotY: -6, rotX:  4, x: '28%', y: '22%',   z: 0.8,  w: '50%', aspect: '4/3'   },
    ],
    flip: false,
  },
  {
    tag: 'Case Generation',
    headline: 'Court-ready\nin 2\nseconds.',
    body: 'AutoEnforce ZA automatically compiles tamper-proof evidence packets — timestamped images, GPS metadata, and officer chain-of-custody.',
    stat: '< 2s',
    statLabel: 'File generation time',
    panels: [
      { src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80', rotY: -14, rotX: 6,  x: '12%', y: '-18%',  z: 1,    w: '60%', aspect: '16/10' },
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', rotY:  8,  rotX: -4, x: '-20%', y: '24%',  z: 0.75, w: '48%', aspect: '3/4'   },
    ],
    flip: true,
  },
  {
    tag: '24/7 Enforcement',
    headline: 'No shift\nends.\nEver.',
    body: 'Cameras never sleep. Night-mode infrared, adverse-weather algorithms, and redundant uplinks keep every corridor covered around the clock.',
    stat: '24/7',
    statLabel: 'Continuous enforcement',
    panels: [
      { src: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&q=80', rotY: 16,  rotX: -6, x: '-12%', y: '-10%', z: 1,    w: '65%', aspect: '16/10' },
      { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=80', rotY: -10, rotX:  5, x: '30%',  y: '28%',  z: 0.82, w: '46%', aspect: '1/1'   },
    ],
    flip: false,
  },
]

// ─── Single panel inside a cluster ───────────────────────────────────────────
function SinglePanel({
  p, progress, index, mouseX, mouseY,
}: {
  p: typeof FEATURES[0]['panels'][0]
  progress: any
  index: number
  mouseX: any
  mouseY: any
}) {
  // Use parent springs directly via useTransform — no per-panel springs
  const enterY    = useTransform(progress, [0, 0.4], [70 + index * 24, 0])
  const op        = useTransform(progress, [0.04, 0.32], [0, 1])
  const exitScale = useTransform(progress, [0.7, 1], [1, 0.95])
  const tx        = useTransform(mouseX, [-1, 1], [-(p.z * 12), p.z * 12])

  return (
    <motion.div
      className='absolute pointer-events-none'
      style={{
        left: p.x, top: p.y,
        width: p.w, aspectRatio: p.aspect,
        rotateY: p.rotY, rotateX: p.rotX,
        y: enterY, x: tx,
        scale: exitScale, opacity: op,
        willChange: 'transform, opacity',
      }}
    >
      <div className='relative w-full h-full rounded-xl overflow-hidden'
        style={{
          border: '1px solid rgba(232,224,208,0.11)',
          boxShadow: `0 ${28 + index * 10}px ${70 + index * 16}px rgba(0,0,0,0.72)`,
        }}>
        <Image
          src={p.src} alt='' fill
          className='object-cover'
          sizes='500px'
          loading='lazy'
        />
        {/* Static glare — no animation, no GPU thrash */}
        <div className='absolute inset-0' style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 45%)' }} />
        <div className='absolute inset-0' style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(8,8,8,0.3) 100%)' }} />
      </div>
    </motion.div>
  )
}

function PanelCluster({
  panels, progress, mouseX, mouseY,
}: {
  panels: typeof FEATURES[0]['panels']
  progress: any
  mouseX: any
  mouseY: any
}) {
  return (
    <div className='relative w-full h-full' style={{ transformStyle: 'preserve-3d', perspective: '900px' }}>
      {panels.map((p, i) => (
        <SinglePanel key={i} p={p} progress={progress} index={i} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  )
}

// ─── One feature row ──────────────────────────────────────────────────────────
function FeatureRow({ feat, index }: { feat: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mxMV = useMotionValue(0)
  const myMV = useMotionValue(0)
  const smx  = useSpring(mxMV, { stiffness: 55, damping: 22 })
  const smy  = useSpring(myMV, { stiffness: 55, damping: 22 })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sp = useSpring(scrollYProgress, { stiffness: 48, damping: 20 })

  const sectionOp = useTransform(sp, [0, 0.12, 1], [0, 1, 1])

  // Text: slides in from the opposite side to the panels
  const textX  = useTransform(sp, [0, 0.35], [feat.flip ? 70 : -70, 0])
  const textOp = useTransform(sp, [0.05, 0.32], [0, 1])
  const spTX   = useSpring(textX, { stiffness: 45, damping: 18 })

  // Background — slow parallax
  const bgY = useTransform(sp, [0, 1], ['4%', '-4%'])

  // Divider line animates width on scroll
  const lineW = useTransform(sp, [0.2, 0.55], ['0%', '100%'])

  // Stat number — counts up feel via scale
  const statScale = useTransform(sp, [0.2, 0.5], [0.8, 1])
  const statOp    = useTransform(sp, [0.2, 0.45], [0, 1])

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

  const textCol = (
    <motion.div
      className='flex flex-col justify-center px-8 md:px-16'
      style={{ x: spTX, opacity: textOp }}
    >
      {/* Tag with animated dot */}
      <motion.div
        className='flex items-center gap-2 mb-8'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: E }}
      >
        <motion.div
          className='w-2 h-2 rounded-full'
          style={{ background: 'rgba(232,224,208,0.5)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className='text-[11px] tracking-[0.38em] uppercase font-mono'
          style={{ color: 'rgba(232,224,208,0.6)' }}>
          {feat.tag}
        </span>
      </motion.div>

      {/* Headline — each line enters on its own axis */}
      <h2 className='font-brand font-bold text-white leading-none mb-8'
        style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)', letterSpacing: '-0.04em' }}>
        {feat.headline.split('\n').map((line, li) => (
          <motion.span
            key={li}
            className='block'
            initial={{ opacity: 0, x: feat.flip ? 30 : -30, y: 10 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1 + li * 0.12, ease: E }}
          >
            {line}
          </motion.span>
        ))}
      </h2>

      {/* Animated divider */}
      <div className='w-full h-px mb-8 overflow-hidden' style={{ background: 'rgba(232,224,208,0.06)' }}>
        <motion.div className='h-full' style={{ width: lineW, background: 'rgba(232,224,208,0.25)' }} />
      </div>

      {/* Body */}
      <motion.p
        className='text-sm font-light leading-relaxed max-w-sm mb-10'
        style={{ color: 'rgba(232,224,208,0.62)' }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, delay: 0.3, ease: E }}
      >
        {feat.body}
      </motion.p>

      {/* Stat */}
      <motion.div
        className='flex items-end gap-4'
        style={{ scale: statScale, opacity: statOp }}
      >
        <span className='font-brand font-bold text-white leading-none'
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.04em' }}>
          {feat.stat}
        </span>
        <span className='text-[10px] tracking-[0.22em] uppercase mb-2 font-mono'
          style={{ color: 'rgba(232,224,208,0.32)' }}>
          {feat.statLabel}
        </span>
      </motion.div>
    </motion.div>
  )

  const panelCol = (
    <div className='relative h-full min-h-[460px] flex items-center justify-center'>
      <PanelCluster panels={feat.panels} progress={sp} mouseX={smx} mouseY={smy} />
    </div>
  )

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ opacity: sectionOp }}
      className='relative min-h-[100vh] grid grid-cols-1 md:grid-cols-2 overflow-hidden py-20'
    >
      {/* Parallax background — subtle image per row */}
      <motion.div
        className='absolute inset-0 pointer-events-none z-0'
        style={{ y: bgY, scale: 1.06 }}
      >
        <img
          src={feat.panels[0].src}
          alt=''
          aria-hidden
          className='absolute inset-0 w-full h-full object-cover opacity-[0.08]'
          style={{ objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 80% at ${feat.flip ? '75%' : '25%'} 50%, rgba(232,224,208,0.04) 0%, transparent 65%)` }} />
      </motion.div>

      {/* Section number */}
      <motion.div
        className='absolute top-10 right-10 font-mono text-[10px] tracking-[0.3em] opacity-0'
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ color: 'rgba(232,224,208,1)' }}
      >
        0{index + 1} — 03
      </motion.div>

      {feat.flip ? (
        <>{panelCol}{textCol}</>
      ) : (
        <>{textCol}{panelCol}</>
      )}

      {/* Horizontal rule */}
      <div className='absolute bottom-0 inset-x-0 h-px'
        style={{ background: 'rgba(232,224,208,0.06)' }} />
    </motion.div>
  )
}

export default function SceneSplit() {
  return (
    <section aria-label='Feature highlights'>
      {FEATURES.map((feat, i) => (
        <FeatureRow key={feat.tag} feat={feat} index={i} />
      ))}
    </section>
  )
}
