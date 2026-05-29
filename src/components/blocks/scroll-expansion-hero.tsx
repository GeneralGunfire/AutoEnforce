'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import Image from 'next/image'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from 'framer-motion'

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image'
  mediaSrc: string
  posterSrc?: string
  bgImageSrc: string
  title?: string
  date?: string
  scrollToExpand?: string
  textBlend?: boolean
  accentColor?: string
  children?: ReactNode
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const

// Separate component so hooks are always called at top level
function PanelShadow({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.8, 1], [0.65, 0.3, 0])
  return (
    <motion.div
      className='absolute -inset-8 -z-10 rounded-3xl blur-3xl bg-black'
      style={{ opacity }}
    />
  )
}

function VideoOverlay({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 1], [0.45, 0.08])
  return (
    <motion.div
      className='absolute inset-0 pointer-events-none'
      style={{
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(10,22,40,0.85) 100%)',
        opacity,
      }}
    />
  )
}

function BackgroundLayer({ progress, src }: { progress: MotionValue<number>; src: string }) {
  const opacity = useTransform(progress, [0, 0.75], [1, 0])
  const scale   = useTransform(progress, [0, 1], [1.06, 1])
  return (
    <motion.div className='absolute inset-0 z-0' style={{ opacity, scale }}>
      <Image
        src={src}
        alt='Background'
        fill
        className='object-cover object-center'
        priority
        sizes='100vw'
      />
      <div
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(180deg, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0.72) 100%)',
        }}
      />
    </motion.div>
  )
}

function TitleWord({
  progress,
  direction,
  children,
  reduced,
}: {
  progress: MotionValue<number>
  direction: 1 | -1
  children: ReactNode
  reduced: boolean
}) {
  const x = useTransform(progress, [0, 1], [0, reduced ? 0 : direction * 160])
  return (
    <motion.h1
      className='font-brand font-bold leading-none text-white select-none pointer-events-none'
      style={{
        fontSize: 'clamp(3rem, 8vw, 7rem)',
        x,
        letterSpacing: '-0.03em',
        textShadow: '0 4px 40px rgba(0,0,0,0.55)',
      }}
    >
      {children}
    </motion.h1>
  )
}

function DateBadge({
  progress,
  accentColor,
  date,
}: {
  progress: MotionValue<number>
  accentColor: string
  date: string
}) {
  const x = useTransform(progress, [0, 1], [0, -80])
  return (
    <motion.div style={{ x }} className='mb-4'>
      <span
        className='inline-flex items-center gap-2 border border-white/20 bg-white/5
          backdrop-blur-sm px-3 py-1 rounded-full text-[11px] tracking-[0.25em]
          uppercase text-white/60 font-medium'
      >
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className='w-1.5 h-1.5 rounded-full'
          style={{ background: accentColor }}
        />
        {date}
      </span>
    </motion.div>
  )
}

function ScrollCTA({
  progress,
  scrollToExpand,
  accentColor,
}: {
  progress: MotionValue<number>
  scrollToExpand: string
  accentColor: string
}) {
  const opacity = useTransform(progress, [0, 0.3], [1, 0])
  return (
    <motion.div
      className='mt-8 flex flex-col items-center gap-2'
      style={{ opacity }}
    >
      <span className='text-white/35 text-xs tracking-[0.2em] uppercase font-light'>
        {scrollToExpand}
      </span>
      <div className='flex flex-col items-center gap-0.5'>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: 1.4, delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: accentColor }}
            className='text-[10px] leading-none'
          >
            ▼
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function PanelWrapper({
  progress,
  isMobile,
  reduced,
  children,
}: {
  progress: MotionValue<number>
  isMobile: boolean
  reduced: boolean
  children: ReactNode
}) {
  const w       = useTransform(progress, [0, 1], isMobile ? [280, 960]  : [340, 1600])
  const h       = useTransform(progress, [0, 1], isMobile ? [360, 620]  : [420, 920])
  const rotX    = useTransform(progress, [0, 1], reduced  ? [0, 0]      : [5, 0])
  const scl     = useTransform(progress, [0, 1], reduced  ? [1, 1]      : [0.86, 1])
  const radius  = useTransform(progress, [0, 1], [16, 0])

  return (
    <motion.div
      className='absolute z-10 top-1/2 left-1/2 overflow-hidden'
      style={{
        width: w,
        height: h,
        x: '-50%',
        y: '-50%',
        rotateX: rotX,
        scale: scl,
        borderRadius: radius,
        maxWidth: '98vw',
        maxHeight: '90svh',
        transformStyle: 'preserve-3d',
        willChange: 'transform, width, height',
      }}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
export default function ScrollExpandMedia({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  accentColor = '#00A3FF',
  children,
}: ScrollExpandMediaProps) {
  const rawProgress = useRef(0)
  const mv          = useMotionValue(0)
  const spring      = useSpring(mv, { stiffness: 60, damping: 18, mass: 0.6 })

  const [showContent,        setShowContent]        = useState(false)
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false)
  const expandedRef = useRef(false)   // sync ref — avoids stale closure in scroll handler
  const [isMobile,           setIsMobile]           = useState(false)
  const [reduced,            setReduced]            = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setShowContent(false)
    setMediaFullyExpanded(false)
    rawProgress.current = 0
    mv.set(0)
  }, [mediaType, mv])

  const advance = (delta: number) => {
    const next = Math.min(Math.max(rawProgress.current + delta, 0), 1)
    rawProgress.current = next
    mv.set(next)
    if (next >= 1) {
      expandedRef.current = true
      setMediaFullyExpanded(true)
      setShowContent(true)
    } else if (next < 0.75) {
      setShowContent(false)
    }
  }

  // Scroll lock: stop Lenis + prevent native scroll during hero expansion.
  // We do NOT use position:fixed (breaks Lenis layout).
  const scrollLockY = useRef(0)

  const lockScroll = () => {
    const lenis = (window as any).__lenis
    if (lenis) lenis.stop()
    // Scroll to top silently so hero stays in view
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    document.documentElement.style.overflow = 'hidden'
  }

  const unlockScroll = () => {
    document.documentElement.style.overflow = ''
    const lenis = (window as any).__lenis
    if (lenis) lenis.start()
  }

  useEffect(() => {
    lockScroll()
    return () => unlockScroll()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (mediaFullyExpanded) {
      unlockScroll()
    } else {
      lockScroll()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaFullyExpanded])

  useEffect(() => {
    const onWheel = (e: Event) => {
      const we = e as unknown as WheelEvent
      // Scrolling up at top while expanded → collapse back
      if (expandedRef.current && we.deltaY < 0 && window.scrollY <= 5) {
        expandedRef.current = false
        setMediaFullyExpanded(false)
        rawProgress.current = 0.95
        mv.set(0.95)
        we.preventDefault()
        return
      }
      // Still expanding — intercept all wheel events
      if (!expandedRef.current) {
        we.preventDefault()
        advance(we.deltaY * 0.001)
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel as EventListener)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let startY = 0
    const onStart = (e: Event) => { startY = (e as unknown as TouchEvent).touches[0].clientY }
    const onMove  = (e: Event) => {
      const te = e as unknown as TouchEvent
      const dy = startY - te.touches[0].clientY
      if (expandedRef.current && dy < -20 && window.scrollY <= 5) {
        expandedRef.current = false
        setMediaFullyExpanded(false)
        te.preventDefault()
        return
      }
      if (!expandedRef.current) {
        te.preventDefault()
        advance(dy * (dy < 0 ? 0.008 : 0.005))
        startY = te.touches[0].clientY
      }
    }
    window.addEventListener('touchstart', onStart, { passive: false })
    window.addEventListener('touchmove',  onMove,  { passive: false })
    return () => {
      window.removeEventListener('touchstart', onStart as EventListener)
      window.removeEventListener('touchmove',  onMove  as EventListener)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const words  = (title ?? '').split(' ')
  const firstW = words[0] ?? ''
  const restW  = words.slice(1).join(' ')

  return (
    <div className='overflow-x-hidden' style={{ background: '#080808' }}>
      <section
        className='relative flex flex-col items-center justify-start min-h-[100svh]'
        style={{ perspective: '1200px', perspectiveOrigin: '50% 60%', background: '#080808' }}
      >
        <div className='relative w-full flex flex-col items-center min-h-[100svh]'>

          <BackgroundLayer progress={spring} src={bgImageSrc} />

          <div className='w-full flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full min-h-[100svh] relative'>

              {/* Expanding panel */}
              <PanelWrapper progress={spring} isMobile={isMobile} reduced={reduced}>
                <PanelShadow progress={spring} />

                {mediaType === 'video' ? (
                  <video
                    src={mediaSrc}
                    poster={posterSrc}
                    autoPlay muted loop playsInline preload='auto'
                    aria-hidden='true'
                    className='w-full h-full object-cover'
                    disablePictureInPicture
                    disableRemotePlayback
                  />
                ) : (
                  <Image src={mediaSrc} alt={title ?? 'Media'} fill className='object-cover' sizes='100vw' />
                )}

                <VideoOverlay progress={spring} />

                {/* Glass glare */}
                <div
                  className='absolute inset-0 pointer-events-none'
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)' }}
                />
              </PanelWrapper>

              {/* Title overlay */}
              <div className={`relative z-20 flex flex-col items-center gap-1 text-center ${textBlend ? 'mix-blend-difference' : ''}`}>
                {date && <DateBadge progress={spring} accentColor={accentColor} date={date} />}
                <TitleWord progress={spring} direction={-1} reduced={reduced}>{firstW}</TitleWord>
                {restW && <TitleWord progress={spring} direction={1} reduced={reduced}>{restW}</TitleWord>}
                {scrollToExpand && (
                  <ScrollCTA progress={spring} scrollToExpand={scrollToExpand} accentColor={accentColor} />
                )}
              </div>

            </div>

            {/* Expanded children */}
            <motion.section
              className='flex flex-col w-full px-6 py-20 md:px-16'
              style={{ background: '#080808' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 24 }}
              transition={{ duration: 0.85, ease: EASE }}
            >
              <div className='w-full h-px mb-16'
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  )
}
