'use client'

import { useRef } from 'react'
import { useScroll, useSpring, useTransform, MotionValue } from 'framer-motion'

const SPRING = { stiffness: 60, damping: 20, mass: 0.6 }

/**
 * Gives a section the same spring-physics parallax depth as the hero.
 * Returns:
 *   - ref        — attach to the section element
 *   - bgY        — subtle vertical parallax for background image (translateY)
 *   - bgScale    — scale 1.08 → 1 as section enters
 *   - sectionY   — section content lifts slightly on scroll (depth illusion)
 */
export function useParallax() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const rawBgY    = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])
  const rawBgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.04, 1.0])
  const rawTiltY  = useTransform(scrollYProgress, [0, 0.3, 1], [24, 0, -8])

  const bgY     = useSpring(rawBgY    as unknown as MotionValue<number>, SPRING) as unknown as MotionValue<string>
  const bgScale = useSpring(rawBgScale, SPRING)
  const sectionY = useSpring(rawTiltY, SPRING)

  return { ref, bgY, bgScale, sectionY }
}
