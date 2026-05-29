'use client'

import { MenuBar, type MenuBarItem } from '@/components/ui/bottom-menu'

const menuItems: MenuBarItem[] = [
  {
    label: 'Home',
    href: '#',
    icon: (props) => (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2.25 7.5L9 2.25L15.75 7.5V15.75H11.25V11.25H6.75V15.75H2.25V7.5Z" />
      </svg>
    ),
  },
  {
    label: 'Technology',
    href: '#',
    icon: (props) => (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="9" cy="9" r="2.5" />
        <path d="M9 1.75v2M9 14.25v2M1.75 9h2M14.25 9h2M4.1 4.1l1.4 1.4M12.5 12.5l1.4 1.4M4.1 13.9l1.4-1.4M12.5 5.5l1.4-1.4" />
      </svg>
    ),
  },
  {
    label: 'Solutions',
    href: '#',
    icon: (props) => (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2.25" y="2.25" width="5.5" height="5.5" rx="1" />
        <rect x="10.25" y="2.25" width="5.5" height="5.5" rx="1" />
        <rect x="2.25" y="10.25" width="5.5" height="5.5" rx="1" />
        <rect x="10.25" y="10.25" width="5.5" height="5.5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'About',
    href: '#',
    icon: (props) => (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="9" cy="9" r="7.25" />
        <line x1="9" y1="8.25" x2="9" y2="12.75" />
        <circle cx="9" cy="5.75" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Contact',
    href: '#',
    icon: (props) => (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15.25 12.25c0 .414-.092.806-.254 1.158-.162.353-.414.678-.736.934-.551.43-1.254.668-2.01.668-.782 0-1.627-.248-2.52-.752-.893-.503-1.786-1.184-2.637-2.036-.852-.851-1.533-1.744-2.036-2.637C4.754 8.693 4.5 7.848 4.5 7.066c0-.75.234-1.447.657-1.996.423-.55.998-.82 1.593-.82.222 0 .444.046.643.138.205.096.39.24.533.44l1.846 2.6c.143.2.245.384.317.556.072.167.111.33.111.479 0 .187-.053.374-.158.556-.1.181-.248.368-.437.555l-.596.617c-.085.085-.124.186-.124.305 0 .06.008.114.024.163.02.05.04.089.057.128.143.261.386.603.727.99.346.392.717.788 1.117 1.147.146.13.26.193.325.193.12 0 .22-.04.304-.124l.596-.596c.192-.192.384-.34.568-.437.185-.102.37-.153.563-.153.149 0 .306.034.475.107.17.072.355.175.553.318l2.626 1.866c.199.143.34.32.436.516.091.2.137.412.137.634z" />
      </svg>
    ),
  },
  {
    label: 'Request Demo',
    href: '#',
    icon: (props) => (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 1.75C4.996 1.75 1.75 4.996 1.75 9s3.246 7.25 7.25 7.25 7.25-3.246 7.25-7.25S13.004 1.75 9 1.75z" />
        <polyline points="7.25 6.25 11.75 9 7.25 11.75" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50'>
      <MenuBar items={menuItems} />
    </div>
  )
}
