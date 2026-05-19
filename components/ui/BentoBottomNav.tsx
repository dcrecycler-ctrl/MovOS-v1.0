'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { B } from '@/lib/tokens'

const NAV_ITEMS = [
  {
    id: 'tablero', label: 'Tablero', href: '/',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'flota', label: 'Flota', href: '/fleet',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
        <circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>
      </svg>
    ),
  },
  {
    id: 'ops', label: 'Operación', href: '/operations',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h4l3-8 4 16 3-8h4"/>
      </svg>
    ),
  },
  {
    id: 'taller', label: 'Taller', href: '/maintenance',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/>
      </svg>
    ),
  },
  {
    id: 'mas', label: 'Más', href: null,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
]

const MORE_ITEMS = [
  { label: 'Inspecciones', href: '/inspections', icon: '🔍' },
  { label: 'Contratos',    href: '/contracts',   icon: '📋' },
  { label: 'Analítica',    href: '/analitica',   icon: '📊' },
  { label: 'Inteligencia', href: '/intelligence', icon: '✨', badge: 'beta' },
  { label: 'Configuración', href: '/admin/configuracion', icon: '⚙️' },
]

interface BentoBottomNavProps {
  active?: string
}

export function BentoBottomNav({ active: _active }: BentoBottomNavProps) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isActive = (href: string | null) => {
    if (!href) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const anyMoreActive = MORE_ITEMS.some(item => isActive(item.href))

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 195, background: 'rgba(14,23,38,0.25)' }}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Más drawer */}
      {drawerOpen && (
        <div style={{
          position: 'fixed', left: 0, right: 0, zIndex: 196,
          bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))',
          background: B.surface, borderTop: `1px solid ${B.hairline}`,
          borderRadius: '16px 16px 0 0',
          padding: '8px 0 4px',
          boxShadow: '0 -4px 24px rgba(14,23,38,0.08)',
        }}>
          <div style={{ width: 36, height: 3, background: B.ink4, borderRadius: 9999, margin: '0 auto 12px' }} />
          {MORE_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 20px',
                textDecoration: 'none',
                background: isActive(item.href) ? B.surface2 : 'transparent',
              }}
            >
              <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{item.icon}</span>
              <span style={{
                fontFamily: 'var(--font-inter)', fontSize: 15,
                fontWeight: isActive(item.href) ? 600 : 400,
                color: isActive(item.href) ? B.ink : B.ink2,
                flex: 1,
              }}>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 9999, background: B.amberSoft, color: B.amber, fontWeight: 600 }}>{item.badge}</span>
              )}
            </a>
          ))}
        </div>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-[200] flex md:hidden"
        style={{
          background: B.surface,
          borderTop: `1px solid ${B.hairline}`,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {NAV_ITEMS.map(item => {
          const active = item.id === 'mas' ? anyMoreActive || drawerOpen : isActive(item.href)
          if (item.href === null) {
            return (
              <button
                key={item.id}
                onClick={() => setDrawerOpen(v => !v)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 3,
                  padding: '10px 0',
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  color: active ? B.amber : B.ink3,
                  opacity: active ? 1 : 0.6,
                }}
              >
                {item.icon}
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, fontWeight: active ? 600 : 500, letterSpacing: '0.01em' }}>
                  {item.label}
                </span>
              </button>
            )
          }
          return (
            <a
              key={item.id}
              href={item.href}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 3,
                padding: '10px 0', textDecoration: 'none',
                color: active ? B.amber : B.ink3,
                opacity: active ? 1 : 0.6,
                borderTop: active ? `2px solid ${B.amber}` : '2px solid transparent',
              }}
            >
              {item.icon}
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, fontWeight: active ? 600 : 500, letterSpacing: '0.01em' }}>
                {item.label}
              </span>
            </a>
          )
        })}
      </nav>
    </>
  )
}
