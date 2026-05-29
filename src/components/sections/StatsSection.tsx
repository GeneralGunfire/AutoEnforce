'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const E = [0.25, 0.46, 0.45, 0.94] as const

const stats = [
  { value: 99.4, suffix: '%',  label: 'Detection Accuracy',  decimals: 1 },
  { value: 2,    suffix: 's',  label: 'Avg Processing Time', prefix: '<' },
  { value: 24,   suffix: '/7', label: 'Live Monitoring'                   },
  { value: 50,   suffix: '+',  label: 'Municipalities Served'             },
]

function CountUp({ target, decimals = 0, duration = 1400 }: { target: number; decimals?: number; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick  = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setVal((1 - Math.pow(1 - p, 4)) * target)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return <span ref={ref}>{val.toFixed(decimals)}</span>
}

export default function StatsSection() {
  return (
    <section className='relative py-28 px-6 md:px-10 overflow-hidden' style={{ background: '#04080f' }}>
      {/* Scan lines */}
      <div className='absolute inset-0 pointer-events-none'
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px)', backgroundSize: '100% 28px' }} />
      {/* Center glow */}
      <div className='absolute inset-0 pointer-events-none'
        style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(0,163,255,0.055) 0%, transparent 65%)' }} />
      <div className='absolute top-0 inset-x-0 h-px' style={{ background: 'linear-gradient(90deg,transparent,rgba(0,163,255,0.25),transparent)' }} />
      <div className='absolute bottom-0 inset-x-0 h-px' style={{ background: 'linear-gradient(90deg,transparent,rgba(0,163,255,0.15),transparent)' }} />

      <div className='relative max-w-6xl mx-auto'>
        <div className='grid grid-cols-2 lg:grid-cols-4'>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: E }}
              className='flex flex-col items-center justify-center text-center py-16 px-6 relative'
            >
              {i < stats.length - 1 && (
                <div className='absolute right-0 top-1/4 bottom-1/4 w-px hidden lg:block'
                  style={{ background: 'linear-gradient(180deg,transparent,rgba(255,255,255,0.07),transparent)' }} />
              )}
              <div className='font-brand font-black text-6xl md:text-7xl text-white leading-none mb-4 tabular-nums'
                style={{ textShadow: '0 0 60px rgba(0,163,255,0.18)' }}>
                {s.prefix && <span className='text-[#00A3FF]'>{s.prefix}</span>}
                <CountUp target={s.value} decimals={s.decimals} />
                <span className='text-[#00A3FF]'>{s.suffix}</span>
              </div>
              <p className='text-white/25 text-[10px] tracking-[0.28em] uppercase font-medium'>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
