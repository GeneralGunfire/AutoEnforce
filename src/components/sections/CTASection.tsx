'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const E = [0.25, 0.46, 0.45, 0.94] as const

export default function CTASection() {
  return (
    <section className='relative py-40 px-6 md:px-10 overflow-hidden'>

      {/* Background — long exposure highway at night */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80'
          alt=''
          fill
          className='object-cover object-center'
          sizes='100vw'
          aria-hidden='true'
        />
        <div className='absolute inset-0' style={{ background: 'linear-gradient(180deg, rgba(4,8,15,0.78) 0%, rgba(4,8,15,0.55) 40%, rgba(4,8,15,0.78) 100%)' }} />
      </div>

      <div className='absolute top-0 inset-x-0 h-px z-10' style={{ background: 'linear-gradient(90deg,transparent,rgba(0,163,255,0.3),transparent)' }} />

      {/* Glow orb */}
      <div className='absolute inset-0 pointer-events-none z-0'
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(0,163,255,0.07) 0%, transparent 65%)' }} />

      <div className='relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-8'>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: E }}
          className='flex flex-col items-center gap-6'
        >
          <span className='inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-[#00A3FF] font-semibold'>
            <span className='w-8 h-px bg-[#00A3FF]' />
            Get Started
            <span className='w-8 h-px bg-[#00A3FF]' />
          </span>

          <h2 className='font-brand text-5xl md:text-6xl font-bold text-white leading-[1.0] tracking-tight'>
            Ready to transform<br />
            <span className='text-white/35 font-light'>enforcement in your municipality?</span>
          </h2>

          <p className='text-white/35 text-base font-light leading-relaxed max-w-md'>
            Join South African municipalities using AutoEnforce ZA to create safer roads and more accountable enforcement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: E }}
          className='flex flex-col sm:flex-row gap-3'
        >
          <button
            className='bg-[#00A3FF] hover:bg-[#0094e8] active:bg-[#007ecc] transition-colors text-white font-semibold px-9 py-4 rounded-xl text-sm tracking-wide'
            style={{ boxShadow: '0 0 40px rgba(0,163,255,0.3)' }}
          >
            Request a Demo
          </button>
          <button className='border text-white/50 hover:text-white/80 font-light px-9 py-4 rounded-xl text-sm tracking-wide transition-all duration-200'
            style={{ borderColor: 'rgba(255,255,255,0.12)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          >
            Download Brochure
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='text-white/18 text-xs tracking-[0.18em]'
        >
          Available nationwide · Enterprise pricing · Full implementation support
        </motion.p>

      </div>
    </section>
  )
}
