'use client'

import { useRef, useEffect } from 'react'

export default function StarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    // Generate stars once
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.2,
      o: 0.1 + Math.random() * 0.5,
      speed: 0.3 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)
      const t = Date.now() / 1000

      stars.forEach(s => {
        const opacity = s.o * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase))
        ctx.beginPath()
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232,224,208,${opacity})`
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current!)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className='w-full h-full' style={{ display: 'block' }} />
}
