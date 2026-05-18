'use client'

import { B } from '@/lib/tokens'

const NAV_ITEMS = [
  {
    id: 'tablero', label: 'Tablero',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'flota', label: 'Flota',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
        <circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>
      </svg>
    ),
  },
  {
    id: 'ops', label: 'Operación',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h4l3-8 4 16 3-8h4"/>
      </svg>
    ),
  },
  {
    id: 'taller', label: 'Taller',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/>
      </svg>
    ),
  },
  {
    id: 'mas', label: 'Más',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
]

interface BentoBottomNavProps {
  active?: string
}

export function BentoBottomNav({ active = 'tablero' }: BentoBottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[200] flex md:hidden"
      style={{
        background: B.surface,
        borderTop: `1px solid ${B.hairline}`,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {NAV_ITEMS.map(item => {
        const isActive = item.id === active
        return (
          <button
            key={item.id}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 3,
              padding: '10px 0',
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: isActive ? B.ink : B.ink3,
              opacity: isActive ? 1 : 0.55,
            }}
          >
            {item.icon}
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, fontWeight: isActive ? 600 : 500, letterSpacing: '0.01em' }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
