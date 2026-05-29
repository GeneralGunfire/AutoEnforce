'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'

const E = [0.25, 0.46, 0.45, 0.94] as const

// Floating data tags at different Z depths
const TAGS = [
  { label: 'CA 123-456', status: 'CLEAR',     x: '-42%', y: '-28%', z: 60,  delay: 0    },
  { label: 'GP 87-XJ-99', status: 'VIOLATION', x: '38%',  y: '-18%', z: 100, delay: 0.3  },
  { label: 'WC 44-AB-01', status: 'CLEAR',     x: '-50%', y: '32%',  z: 40,  delay: 0.6  },
  { label: 'NP 19-ZZ-03', status: 'SCANNING',  x: '45%',  y: '24%',  z: 80,  delay: 0.9  },
  { label: 'EC 08-MN-77', status: 'VIOLATION', x: '10%',  y: '-44%', z: 120, delay: 1.2  },
]

const STATUS_COLOR: Record<string, string> = {
  CLEAR:     'rgba(255,255,255,0.5)',
  VIOLATION: '#E8E0D0',
  SCANNING:  'rgba(232,224,208,0.4)',
}

function FloatingTag({ tag, mouseX, mouseY }: { tag: typeof TAGS[0]; mouseX: any; mouseY: any }) {
  const px = useTransform(mouseX, [-1, 1], [-(tag.z * 0.08), tag.z * 0.08])
  const py = useTransform(mouseY, [-1, 1], [-(tag.z * 0.06), tag.z * 0.06])
  const spX = useSpring(px, { stiffness: 80, damping: 25 })
  const spY = useSpring(py, { stiffness: 80, damping: 25 })

  return (
    <motion.div
      className='absolute pointer-events-none'
      style={{ left: tag.x, top: tag.y, x: spX, y: spY }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: tag.delay, ease: E }}
    >
      <div className='px-3 py-1.5 rounded font-mono text-[10px] tracking-[0.15em] flex items-center gap-2'
        style={{
          background: 'rgba(8,8,8,0.85)',
          border: `1px solid ${STATUS_COLOR[tag.status]}`,
          color: STATUS_COLOR[tag.status],
          backdropFilter: 'none',
          boxShadow: tag.status === 'VIOLATION' ? `0 0 20px rgba(232,224,208,0.12)` : 'none',
        }}
      >
        {tag.status === 'VIOLATION' && (
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className='w-1 h-1 rounded-full bg-current'
          />
        )}
        <span>{tag.label}</span>
        <span className='opacity-50'>·</span>
        <span>{tag.status}</span>
      </div>
    </motion.div>
  )
}

export default function SceneDetection() {
  const ref       = useRef<HTMLDivElement>(null)
  const mouseX    = useMotionValue(0)
  const mouseY    = useMotionValue(0)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sp      = useSpring(scrollYProgress, { stiffness: 38, damping: 20 })
  const opacity = useTransform(sp, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const bgY     = useTransform(sp, [0, 1], ['4%', '-4%'])
  const panelY  = useTransform(sp, [0, 0.2, 0.8, 1], [60, 0, -10, -50])
  const rotX    = useTransform(sp, [0, 0.3, 1], [8, 0, -4])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
    mouseY.set(((e.clientY - rect.top)  / rect.height) * 2 - 1)
  }
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }

  return (
    <motion.section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className='relative min-h-[120vh] flex items-center justify-center overflow-hidden'
      style={{ background: '#080808', perspective: '1000px' }}
    >
      {/* Parallax bg */}
      <motion.div className='absolute inset-0 z-0' style={{ y: bgY }}>
        <Image
          src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
          alt='' fill className='object-cover' sizes='100vw' aria-hidden
        />
        <div className='absolute inset-0' style={{ background: 'rgba(8,8,8,0.82)' }} />
      </motion.div>

      <motion.div
        style={{ opacity, y: panelY, rotateX: rotX }}
        className='relative z-10 flex flex-col items-center'
      >
        {/* Label */}
        <motion.p
          className='text-cream-faint text-[11px] tracking-[0.4em] uppercase mb-10 font-medium'
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: E }}
        >
          Live Detection Feed
        </motion.p>

        {/* Main video panel — 3D floating */}
        <div className='relative' style={{ transformStyle: 'preserve-3d' }}>
          {/* Floating tags at different z-depths */}
          {TAGS.map((tag) => (
            <FloatingTag key={tag.label} tag={tag} mouseX={mouseX} mouseY={mouseY} />
          ))}

          {/* Main panel */}
          <motion.div
            className='relative rounded-2xl overflow-hidden'
            style={{
              width: 'clamp(280px, 60vw, 760px)',
              aspectRatio: '16/10',
              background: '#020304',
              border: '1px solid rgba(232,224,208,0.1)',
              boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(232,224,208,0.06)',
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4, ease: E }}
          >
            {/* Video background */}
            <video
              src='/video/clip1.mp4'
              autoPlay muted loop playsInline
              className='absolute inset-0 w-full h-full object-cover opacity-70'
            />

            {/* Overlay */}
            <div className='absolute inset-0'
              style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,8,8,0.7) 100%)' }} />

            {/* Corner brackets */}
            {[
              { top: 12, left: 12,   bt: true, bl: true  },
              { top: 12, right: 12,  bt: true, br: true  },
              { bottom: 12, left: 12,  bb: true, bl: true  },
              { bottom: 12, right: 12, bb: true, br: true  },
            ].map((c, i) => (
              <div key={i} className='absolute w-5 h-5 pointer-events-none' style={{
                top: c.top, left: c.left, right: (c as any).right, bottom: (c as any).bottom,
                borderTop:    (c as any).bt ? '1px solid rgba(232,224,208,0.5)' : undefined,
                borderLeft:   (c as any).bl ? '1px solid rgba(232,224,208,0.5)' : undefined,
                borderRight:  (c as any).br ? '1px solid rgba(232,224,208,0.5)' : undefined,
                borderBottom: (c as any).bb ? '1px solid rgba(232,224,208,0.5)' : undefined,
              }} />
            ))}

            {/* Scan line */}
            <motion.div
              animate={{ y: ['-5%', '105%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className='absolute inset-x-0 h-px pointer-events-none'
              style={{ background: 'linear-gradient(90deg, transparent, rgba(232,224,208,0.4), transparent)' }}
            />

            {/* Live badge */}
            <div className='absolute top-4 right-4 flex items-center gap-2'>
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className='w-1.5 h-1.5 rounded-full bg-white'
              />
              <span className='text-white/50 text-[9px] tracking-[0.2em] uppercase font-mono'>Live</span>
            </div>

            {/* Bottom stats bar */}
            <div className='absolute bottom-0 inset-x-0 px-4 py-3 flex items-center justify-between'
              style={{ background: 'rgba(8,8,8,0.8)', borderTop: '1px solid rgba(232,224,208,0.06)' }}>
              {[
                { label: 'Plates', val: '1,247' },
                { label: 'Violations', val: '38' },
                { label: 'Latency', val: '1.8s' },
              ].map((s) => (
                <div key={s.label} className='text-center'>
                  <div className='font-brand font-bold text-white text-sm tabular-nums'>{s.val}</div>
                  <div className='text-cream-faint text-[9px] tracking-[0.15em] uppercase'>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shadow glow beneath panel */}
          <div className='absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 blur-2xl pointer-events-none'
            style={{ background: 'rgba(232,224,208,0.06)' }} />
        </div>

        {/* Caption */}
        <motion.p
          className='mt-12 text-cream-faint text-[11px] tracking-[0.25em] uppercase text-center'
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 1, delay: 0.5, ease: E }}
        >
          N1 Johannesburg North · Feed 01 · AEZA-CAM-N1-047
        </motion.p>
      </motion.div>

      <div className='absolute bottom-0 inset-x-0 h-32 z-20 pointer-events-none'
        style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
    </motion.section>
  )
}
