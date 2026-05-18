'use client'

import { useState } from 'react'
import { B } from '@/lib/tokens'

const PRIMARY_NAV  = ['Tablero', 'Operaciones', 'Flota', 'Inspecciones']
const SECONDARY_NAV = ['Mantenimiento', 'Contratos', 'Analítica', 'Inteligencia']
const ALL_NAV = [...PRIMARY_NAV, ...SECONDARY_NAV]

interface TopBarProps {
  active?: string
}

export function TopBar({ active = 'Tablero' }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: B.bg, borderBottom: `1px solid ${B.hairline}`, position: 'sticky', top: 0, zIndex: 10 }}>
      {/* Main bar */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8" style={{ height: 64 }}>

        {/* Left: Logo + nav */}
        <div className="flex items-center" style={{ gap: 36 }}>
          {/* Logo */}
          <div className="flex items-center" style={{ gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 9, background: B.ink, color: B.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em',
            }}>M</div>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 16, fontWeight: 600, color: B.ink, letterSpacing: '-0.01em' }}>MovOS</span>
          </div>

          {/* Nav — hidden on mobile, visible md+ */}
          <nav className="hidden md:flex" style={{ gap: 6 }}>
            {PRIMARY_NAV.map(label => (
              <NavLink key={label} label={label} active={active === label} />
            ))}
            {SECONDARY_NAV.map(label => (
              <span key={label} className="hidden lg:inline-flex">
                <NavLink label={label} active={active === label} />
              </span>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center" style={{ gap: 14 }}>
          {/* Search — desktop only */}
          <div className="hidden lg:block" style={{ position: 'relative', width: 240 }}>
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

          {/* Bell — tablet+ */}
          <button className="hidden md:flex" style={{
            width: 38, height: 38, borderRadius: 9999, background: B.surface,
            border: `1px solid ${B.hairline}`, color: B.ink2, cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center', position: 'relative',
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

          {/* User pill — always visible */}
          <div className="flex items-center" style={{
            gap: 10, padding: '6px 12px 6px 6px',
            background: B.surface, borderRadius: 9999, border: `1px solid ${B.hairline}`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 9999, background: B.blueSoft, color: B.blue,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 12,
            }}>RA</div>
            <span className="hidden sm:inline" style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, fontWeight: 500 }}>Rocío Ávila</span>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="flex md:hidden"
            onClick={() => setMenuOpen(v => !v)}
            style={{
              width: 38, height: 38, borderRadius: 9999, background: B.surface,
              border: `1px solid ${B.hairline}`, color: B.ink2, cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer — all nav links */}
      {menuOpen && (
        <div className="md:hidden" style={{ borderTop: `1px solid ${B.hairline}`, padding: '12px 16px 16px' }}>
          {ALL_NAV.map(label => (
            <a
              key={label}
              href="#"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-inter)', fontSize: 14,
                fontWeight: active === label ? 500 : 400,
                color: active === label ? B.ink : B.ink2,
                padding: '12px 8px',
                borderBottom: `1px solid ${B.hairline}`,
                textDecoration: 'none',
                background: active === label ? B.surface2 : 'transparent',
                borderRadius: 8,
              }}
            >
              {label}
              {label === 'Inteligencia' && (
                <span style={{
                  fontSize: 9, padding: '1px 6px', borderRadius: 9999,
                  background: B.amberSoft, color: B.amber, fontWeight: 500,
                }}>admin</span>
              )}
            </a>
          ))}
          {/* Search in mobile drawer */}
          <div style={{ position: 'relative', marginTop: 12 }}>
            <input
              placeholder="Buscar vehículo, placa, contrato…"
              style={{
                fontFamily: 'var(--font-inter)', fontSize: 13,
                padding: '9px 14px 9px 36px', width: '100%',
                background: B.surface, border: `1px solid ${B.hairline}`,
                borderRadius: 9999, color: B.ink, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={B.ink3} strokeWidth="2"
              style={{ position: 'absolute', left: 14, top: 11 }}>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

function NavLink({ label, active }: { label: string; active: boolean }) {
  return (
    <a href="#" style={{
      fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: active ? 500 : 400,
      color: active ? B.ink : B.ink3,
      padding: '8px 14px', borderRadius: 9999,
      background: active ? B.surface : 'transparent',
      boxShadow: active ? B.shadowSm : 'none',
      textDecoration: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 6,
      whiteSpace: 'nowrap',
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
}
