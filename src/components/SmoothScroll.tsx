'use client'

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const lenis = new Lenis({
      // On mobile, shorter duration = less frame budget consumed per scroll event
      duration: isMobile ? 0.9 : 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !isMobile, // native scroll on mobile — avoids JS overhead per touch event
      wheelMultiplier: 0.8,
      touchMultiplier: isMobile ? 1.0 : 1.5,
    })
    lenisRef.current = lenis

    let raf: number
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Expose lenis globally so hero scroll-lock can pause it
    ;(window as any).__lenis = lenis

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
