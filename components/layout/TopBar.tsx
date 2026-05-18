'use client'

import { B } from '@/lib/tokens'

const NAV_ITEMS = [
  'Tablero', 'Operaciones', 'Flota', 'Inspecciones',
  'Mantenimiento', 'Contratos', 'Analítica', 'Inteligencia',
]

interface TopBarProps {
  active?: string
}

export function TopBar({ active = 'Tablero' }: TopBarProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 36px', borderBottom: `1px solid ${B.hairline}`,
      background: B.bg, position: 'sticky', top: 0, zIndex: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 9, background: B.ink, color: B.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em',
          }}>M</div>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 16, fontWeight: 600, color: B.ink, letterSpacing: '-0.01em' }}>MovOS</span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 6 }}>
          {NAV_ITEMS.map(label => {
            const isActive = label === active
            return (
              <a key={label} href="#" style={{
                fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: isActive ? 500 : 400,
                color: isActive ? B.ink : B.ink3,
                padding: '8px 14px', borderRadius: 9999,
                background: isActive ? B.surface : 'transparent',
                boxShadow: isActive ? B.shadowSm : 'none',
                textDecoration: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {label}
                {label === 'Inteligencia' && (
                  <span style={{
                    fontSize: 9, padding: '1px 6px', borderRadius: 9999,
                    background: B.amberSoft, color: B.amber, fontWeight: 500, letterSpacing: '0.02em',
                  }}>admin</span>
                )}
              </a>
            )
          })}
        </nav>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Search */}
        <div style={{ position: 'relative', width: 240 }}>
          <input
            placeholder="Buscar vehículo, placa, contrato…"
            style={{
              fontFamily: 'var(--font-inter)', fontSize: 13,
              padding: '9px 14px 9px 36px', width: '100%',
              background: B.surface, border: `1px solid ${B.hairline}`,
              borderRadius: 9999, color: B.ink, outline: 'none',
            }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={B.ink3} strokeWidth="2"
            style={{ position: 'absolute', left: 14, top: 11 }}>
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
          </svg>
        </div>

        {/* Bell */}
        <button style={{
          width: 38, height: 38, borderRadius: 9999, background: B.surface,
          border: `1px solid ${B.hairline}`, color: B.ink2, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span style={{
            position: 'absolute', top: 6, right: 6, width: 8, height: 8,
            background: B.rose, borderRadius: 9999, border: `2px solid ${B.surface}`,
          }} />
        </button>

        {/* User */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '6px 12px 6px 6px', background: B.surface,
          borderRadius: 9999, border: `1px solid ${B.hairline}`,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 9999, background: B.blueSoft, color: B.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 12,
          }}>RA</div>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, fontWeight: 500 }}>Rocío Ávila</span>
        </div>
      </div>
    </div>
  )
}
