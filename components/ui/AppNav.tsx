'use client'

import { useState, useEffect, useRef } from 'react'
import { DS, FONTS } from '@/lib/tokens'

// ─── Nav config ───────────────────────────────────────────────────────────────

type NavItem = {
  label: string
  href?: string
  children?: { label: string; href: string }[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Tablero',   href: '/'          },
  {
    label: 'Operaciones',
    children: [
      { label: 'Inspecciones',  href: '/inspections' },
      { label: 'Mantenimiento', href: '/maintenance'  },
    ],
  },
  { label: 'Flota',     href: '/fleet'     },
  { label: 'Contratos', href: '/contracts' },
  {
    label: 'Analítica',
    children: [
      { label: 'Analítica',     href: '/analitica'    },
      { label: 'Inteligencia',  href: '/intelligence' },
    ],
  },
]

// Tablet primary (flat labels that are always visible at md breakpoint)
const TABLET_PRIMARY = ['Tablero', 'Flota', 'Contratos']

interface AppNavProps {
  active?: string
}

// ─── AppNav ───────────────────────────────────────────────────────────────────

export function AppNav({ active }: AppNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const navRef  = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function openDD(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenDropdown(label)
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120)
  }

  // Flat list of all items for the tablet hamburger menu
  const tabletOverflow: { label: string; href: string }[] = NAV_ITEMS
    .filter(n => !TABLET_PRIMARY.includes(n.label))
    .flatMap(n => n.children ?? (n.href ? [{ label: n.label, href: n.href }] : []))

  function isGroupActive(item: NavItem) {
    if (item.label === active) return true
    return item.children?.some(c => c.label === active) ?? false
  }

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-[100] flex items-center justify-between"
      style={{
        height: 52,
        background: 'var(--ds-bg-1)',
        borderBottom: '1px solid var(--ds-border)',
        padding: '0 16px',
      }}
    >
      {/* ── Left: Logo + nav links ────────────────────────────────── */}
      <div className="flex items-center gap-4 lg:gap-6 min-w-0">
        <a
          href="/"
          style={{ fontSize: 22, fontFamily: FONTS.display, color: DS.gold, letterSpacing: '0.08em', lineHeight: 1, flexShrink: 0, textDecoration: 'none' }}
        >
          MOVOS
        </a>

        {/* Desktop: all links */}
        <div className="hidden lg:flex gap-0.5" style={{ position: 'relative' }}>
          {NAV_ITEMS.map(item => {
            const active_ = isGroupActive(item)
            const hasChildren = !!item.children?.length
            const isOpen = openDropdown === item.label

            return (
              <div
                key={item.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => hasChildren && openDD(item.label)}
                onMouseLeave={() => hasChildren && scheduleClose()}
              >
                {item.href ? (
                  <a href={item.href} style={linkStyle(active_)}>
                    {item.label}
                  </a>
                ) : (
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    style={{ ...linkStyle(active_), background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    {item.label}
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                )}

                {hasChildren && isOpen && (
                  <div
                    onMouseEnter={() => openDD(item.label)}
                    onMouseLeave={scheduleClose}
                    style={{
                      position: 'absolute', top: '100%', left: 0, zIndex: 999,
                      marginTop: 4,
                      background: 'var(--ds-bg-1)',
                      border: '1px solid var(--ds-border)',
                      minWidth: 160,
                    }}
                  >
                    {item.children!.map(child => (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={() => setOpenDropdown(null)}
                        style={{
                          display: 'block', padding: '10px 14px',
                          fontSize: 10, fontFamily: FONTS.mono, textTransform: 'uppercase',
                          letterSpacing: '0.08em', textDecoration: 'none',
                          color: child.label === active ? DS.gold : 'var(--ds-dim)',
                          background: child.label === active ? `${DS.gold}1C` : 'transparent',
                          borderBottom: '1px solid var(--ds-border)',
                        }}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Tablet: primary links only */}
        <div className="hidden md:flex lg:hidden gap-0.5">
          {NAV_ITEMS.filter(n => TABLET_PRIMARY.includes(n.label)).map(item => {
            const active_ = isGroupActive(item)
            return (
              <a key={item.label} href={item.href!} style={linkStyle(active_)}>
                {item.label}
              </a>
            )
          })}
        </div>
      </div>

      {/* ── Right: actions ────────────────────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Notif button */}
        <button style={{
          position: 'relative', width: 32, height: 32, background: 'transparent',
          border: '1px solid var(--ds-border)', borderRadius: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ds-dim)',
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, background: DS.red, borderRadius: '50%' }} />
        </button>

        {/* User avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 4px 6px', border: '1px solid var(--ds-border)', flexShrink: 0 }}>
          <div style={{ width: 22, height: 22, background: `${DS.gold}1C`, border: `1px solid ${DS.gold}54`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontFamily: FONTS.mono, color: DS.gold, letterSpacing: '0.06em' }}>
            RA
          </div>
          <span className="hidden md:inline" style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Admin
          </span>
        </div>

        {/* Hamburger — tablet only */}
        <div ref={menuRef} className="relative hidden md:flex lg:hidden">
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              width: 32, height: 32, background: menuOpen ? 'var(--ds-bg-2)' : 'transparent',
              border: '1px solid var(--ds-border)', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 4, flexShrink: 0,
            }}
          >
            <span style={{ display: 'block', width: 14, height: 1, background: 'var(--ds-dim)' }} />
            <span style={{ display: 'block', width: 14, height: 1, background: 'var(--ds-dim)' }} />
            <span style={{ display: 'block', width: 14, height: 1, background: 'var(--ds-dim)' }} />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: 36, right: 0, zIndex: 999,
              background: 'var(--ds-bg-1)',
              border: '1px solid var(--ds-border)',
              minWidth: 160,
            }}>
              {tabletOverflow.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block', padding: '10px 14px',
                    fontSize: 10, fontFamily: FONTS.mono, textTransform: 'uppercase',
                    letterSpacing: '0.08em', textDecoration: 'none',
                    color: item.label === active ? DS.gold : 'var(--ds-dim)',
                    background: item.label === active ? `${DS.gold}1C` : 'transparent',
                    borderBottom: '1px solid var(--ds-border)',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function linkStyle(isActive: boolean): React.CSSProperties {
  return {
    fontSize: 10, fontFamily: FONTS.mono, textTransform: 'uppercase',
    letterSpacing: '0.08em', padding: '6px 12px',
    color:      isActive ? DS.gold : 'var(--ds-dim)',
    background: isActive ? `${DS.gold}1C` : 'transparent',
    border:     isActive ? `1px solid ${DS.gold}54` : '1px solid transparent',
    textDecoration: 'none',
  }
}
