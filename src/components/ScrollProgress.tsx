'use client'

import { useScroll, useSpring, motion } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      style={{
        scaleX,
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: 'rgba(232,224,208,0.5)',
        transformOrigin: '0%',
        zIndex: 100,
      }}
    />
  )
}
