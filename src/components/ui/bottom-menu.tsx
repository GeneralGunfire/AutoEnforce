"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface MenuBarItem {
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  label: string
  href?: string
}

interface MenuBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuBarItem[]
}

const springConfig = {
  duration: 0.3,
  ease: "easeInOut" as const,
}

export function MenuBar({ items, className, ...props }: MenuBarProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [tooltipPosition, setTooltipPosition] = React.useState({ left: 0, width: 0 })
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (activeIndex !== null && menuRef.current && tooltipRef.current) {
      const menuItem = menuRef.current.children[activeIndex] as HTMLElement
      const menuRect = menuRef.current.getBoundingClientRect()
      const itemRect = menuItem.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      const left = itemRect.left - menuRect.left + (itemRect.width - tooltipRect.width) / 2

      setTooltipPosition({
        left: Math.max(0, Math.min(left, menuRect.width - tooltipRect.width)),
        width: tooltipRect.width
      })
    }
  }, [activeIndex])

  return (
    <div className={cn("relative", className)} {...props}>
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={springConfig}
            className="absolute left-0 right-0 -top-[31px] pointer-events-none z-50"
          >
            <motion.div
              ref={tooltipRef}
              className={cn(
                "h-7 px-3 rounded-lg inline-flex justify-center items-center overflow-hidden",
                "backdrop-blur",
              )}
              style={{ background: 'rgba(12,12,12,0.95)', border: '1px solid rgba(232,224,208,0.12)', width: 'auto' }}
              initial={{ x: tooltipPosition.left }}
              animate={{ x: tooltipPosition.left }}
              transition={springConfig}
            >
              <p className="text-[12px] font-medium leading-tight whitespace-nowrap text-white/80">
                {items[activeIndex].label}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={menuRef}
        className={cn(
          "h-12 px-2 inline-flex justify-center items-center gap-1 overflow-hidden z-10",
          "rounded-2xl",
          "border border-white/[0.08]",
        )}
        style={{
          background: 'rgba(10,10,10,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 0 0 1px rgba(232,224,208,0.08), 0 16px 48px rgba(0,0,0,0.6)',
        }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            className="w-10 h-10 rounded-xl flex justify-center items-center hover:bg-white/[0.07] active:bg-white/[0.12] transition-colors duration-150"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() => item.href && (window.location.href = item.href)}
            aria-label={item.label}
          >
            <div className="w-[18px] h-[18px] flex justify-center items-center text-white/60 hover:text-white/90 transition-colors">
              <item.icon className="w-full h-full" />
            </div>
            <span className="sr-only">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
