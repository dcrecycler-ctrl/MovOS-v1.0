'use client'

import { DS, FONTS } from '@/lib/tokens'

// ─── Icons ────────────────────────────────────────────────────────────────────

function DashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  )
}

function FleetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  )
}

function OpsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4"/><line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="12" y2="16"/>
    </svg>
  )
}

function MaintIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  )
}

function ContractsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Tablero',      href: '/',           Icon: DashIcon      },
  { label: 'Flota',        href: '/fleet',      Icon: FleetIcon     },
  { label: 'Operaciones',  href: '/operations', Icon: OpsIcon       },
  { label: 'Mantenimiento',href: '/maintenance',Icon: MaintIcon     },
  { label: 'Contratos',    href: '/contracts',  Icon: ContractsIcon },
]

// ─── BottomNav ────────────────────────────────────────────────────────────────

interface BottomNavProps {
  active?: string
}

export function BottomNav({ active }: BottomNavProps) {
  return (
    // Only visible on mobile (< 768px)
    <nav
      className="fixed bottom-0 left-0 right-0 z-[200] flex md:hidden"
      style={{
        height: 64,
        background: 'var(--ds-bg-1)',
        borderTop: '1px solid var(--ds-border)',
      }}
    >
      {NAV_ITEMS.map(({ label, href, Icon }) => {
        const isActive = label === active
        return (
          <a
            key={label}
            href={href}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 3,
              textDecoration: 'none',
              color: isActive ? DS.gold : 'var(--ds-muted)',
              background: isActive ? `${DS.gold}0E` : 'transparent',
              borderTop: `2px solid ${isActive ? DS.gold : 'transparent'}`,
            }}
          >
            <Icon />
            <span style={{
              fontSize: 7, fontFamily: FONTS.mono,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
