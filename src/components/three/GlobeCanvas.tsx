'use client'

import { useRef, useEffect } from 'react'

const MUNICIPALITIES = [
  [-26.2, 28.0], [-33.9, 18.4], [-29.9, 31.0], [-25.7, 28.2],
  [-26.3, 27.8], [-33.0, 27.9], [-29.1, 26.2], [-25.5, 30.9],
  [-28.7, 24.8], [-22.9, 30.5], [-27.5, 30.4], [-28.4, 32.1],
  [-34.2, 24.5], [-26.7, 27.1], [-25.9, 29.2],
]

function latLng(lat: number, lng: number, r: number, rotY: number) {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180) + rotY
  return {
    x: -r * Math.sin(phi) * Math.cos(theta),
    y:  r * Math.cos(phi),
    z:  r * Math.sin(phi) * Math.sin(theta),
  }
}

function project(x: number, y: number, z: number, cx: number, cy: number, fov: number) {
  const scale = fov / (fov + z)
  return { sx: cx + x * scale, sy: cy - y * scale, scale, visible: z > -fov * 0.5 }
}

export default function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotY      = useRef(0)
  const rafRef    = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // Cap DPR at 2 — no benefit beyond that, halves canvas pixels on retina
    const DPR = Math.min(window.devicePixelRatio, 2)
    const resize = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width  = w * DPR
      canvas.height = h * DPR
      // Reset transform then scale once — don't accumulate
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      // Use CSS dimensions for drawing (ctx is already scaled)
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)
      rotY.current += 0.003  // slightly slower — smoother feel

      const cx  = W / 2
      const cy  = H / 2
      const R   = Math.min(W, H) * 0.32
      const fov = R * 2.5
      const ry  = rotY.current

      // Latitude/longitude grid lines
      ctx.strokeStyle = 'rgba(232,224,208,0.05)'
      ctx.lineWidth   = 0.5

      // Longitude lines
      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath()
        let first = true
        for (let lat = -90; lat <= 90; lat += 5) {
          const p = latLng(lat, lng, R, ry)
          const s = project(p.x, p.y, p.z, cx, cy, fov)
          if (!s.visible) { first = true; continue }
          if (first) { ctx.moveTo(s.sx, s.sy); first = false }
          else ctx.lineTo(s.sx, s.sy)
        }
        ctx.stroke()
      }

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath()
        let first = true
        for (let lng = 0; lng <= 360; lng += 5) {
          const p = latLng(lat, lng, R, ry)
          const s = project(p.x, p.y, p.z, cx, cy, fov)
          if (!s.visible) { first = true; continue }
          if (first) { ctx.moveTo(s.sx, s.sy); first = false }
          else ctx.lineTo(s.sx, s.sy)
        }
        ctx.stroke()
      }

      // Globe edge circle
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(232,224,208,0.08)'
      ctx.lineWidth   = 1
      ctx.stroke()

      // Municipality dots
      const projected = MUNICIPALITIES.map(([lat, lng]) => {
        const p = latLng(lat, lng, R, ry)
        return { ...project(p.x, p.y, p.z, cx, cy, fov), lat, lng }
      })

      // Connection lines between nearby municipalities
      const visible = projected.filter(p => p.visible)
      ctx.strokeStyle = 'rgba(232,224,208,0.12)'
      ctx.lineWidth   = 0.5
      for (let i = 0; i < Math.min(visible.length, 7); i++) {
        const a = visible[i]
        const b = visible[(i + 1) % visible.length]
        ctx.beginPath()
        ctx.moveTo(a.sx, a.sy)
        ctx.lineTo(b.sx, b.sy)
        ctx.stroke()
      }

      // Dots
      projected.forEach((p, i) => {
        if (!p.visible) return
        const t = Date.now() / 1000
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + i * 0.8)

        // Pulse ring
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 4 * p.scale + pulse * 3 * p.scale, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(232,224,208,${0.15 * pulse})`
        ctx.lineWidth   = 0.8
        ctx.stroke()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 1.8 * p.scale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.6 + 0.4 * pulse})`
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

  return (
    <canvas
      ref={canvasRef}
      className='w-full h-full'
      style={{ display: 'block' }}
    />
  )
}
