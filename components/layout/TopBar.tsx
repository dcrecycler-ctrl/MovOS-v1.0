'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { B } from '@/lib/tokens'
import { createClient } from '@/lib/supabase/client'

// ─── Nav config ───────────────────────────────────────────────────────────────

type NavItem = { label: string; href: string; badge?: string }
type NavGroup = { label: string; href?: string; badge?: string; children?: NavItem[] }

const PRIMARY_NAV: NavGroup[] = [
  { label: 'Tablero',   href: '/'         },
  {
    label: 'Operaciones',
    children: [
      { label: 'Inspecciones',  href: '/inspections' },
      { label: 'Mantenimiento', href: '/maintenance'  },
    ],
  },
  { label: 'Flota',     href: '/fleet'     },
  { label: 'Contratos', href: '/contracts' },
]

const SECONDARY_NAV: NavGroup[] = [
  {
    label: 'Analítica',
    children: [
      { label: 'Analítica',    href: '/analitica'    },
      { label: 'Inteligencia', href: '/intelligence', badge: 'beta' },
    ],
  },
]

const ADMIN_NAV: NavItem[] = [
  { label: 'Usuarios',    href: '/admin/usuarios' },
  { label: 'Proveedores', href: '/admin/vendors'  },
  { label: 'Talleres',    href: '/admin/talleres' },
]

const ROLE_LABEL: Record<string, string> = {
  admin:      'Admin',
  management: 'Gerencia',
  operator:   'Operador',
  inspector:  'Inspector',
  mechanic:   'Mecánico',
}

// ─── TopBar ──────────────────────────────────────────────────────────────────

export function TopBar({ active: _active }: { active?: string } = {}) {
  const pathname = usePathname()
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [openDD,      setOpenDD]      = useState<string | null>(null)
  const [userName,    setUserName]    = useState('')
  const [userInitials, setUserInitials] = useState('--')
  const [userRole,    setUserRole]    = useState('')
  const [isAdmin,     setIsAdmin]     = useState(false)
  const ddTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const isGroupActive = (group: NavGroup) => {
    if (group.href && isActive(group.href)) return true
    return group.children?.some(c => isActive(c.href)) ?? false
  }

  function hoverOpen(label: string) {
    if (ddTimer.current) clearTimeout(ddTimer.current)
    setOpenDD(label)
  }

  function hoverClose() {
    ddTimer.current = setTimeout(() => setOpenDD(null), 100)
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('user_id', user.id)
        .single()
      if (profile) {
        setUserName(profile.full_name)
        setUserRole(ROLE_LABEL[profile.role] ?? profile.role)
        setIsAdmin(profile.role === 'admin')
        const parts = profile.full_name.trim().split(' ')
        setUserInitials((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? ''))
      } else {
        const name = user.email?.split('@')[0] ?? 'Usuario'
        setUserName(name)
        setUserInitials(name.slice(0, 2).toUpperCase())
      }
    })
  }, [])

  // flat list for mobile drawer
  const allMobileItems: NavItem[] = [
    ...PRIMARY_NAV.flatMap(g => g.children ?? (g.href ? [{ label: g.label, href: g.href }] : [])),
    ...SECONDARY_NAV.flatMap(g => g.children ?? (g.href ? [{ label: g.label, href: g.href, badge: g.badge }] : [])),
  ]

  return (
    <div style={{ background: B.bg, borderBottom: `1px solid ${B.hairline}`, position: 'sticky', top: 0, zIndex: 10 }}>
      {/* Main bar */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8" style={{ height: 64 }}>

        {/* Left: Logo + nav */}
        <div className="flex items-center" style={{ gap: 36 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 9, background: B.ink, color: B.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em',
            }}>M</div>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 16, fontWeight: 600, color: B.ink, letterSpacing: '-0.01em' }}>MovOS</span>
          </a>

          <nav className="hidden md:flex" style={{ gap: 4, position: 'relative' }}>
            {PRIMARY_NAV.map(group => (
              <NavGroupItem
                key={group.label}
                group={group}
                active={isGroupActive(group)}
                childActive={c => isActive(c.href)}
                isOpen={openDD === group.label}
                onEnter={() => group.children && hoverOpen(group.label)}
                onLeave={() => group.children && hoverClose()}
                onDropdownEnter={() => hoverOpen(group.label)}
                onDropdownLeave={hoverClose}
                onSelect={() => setOpenDD(null)}
              />
            ))}
            {SECONDARY_NAV.map(group => (
              <span key={group.label} className="hidden lg:inline-flex" style={{ position: 'relative' }}>
                <NavGroupItem
                  group={group}
                  active={isGroupActive(group)}
                  childActive={c => isActive(c.href)}
                  isOpen={openDD === group.label}
                  onEnter={() => group.children && hoverOpen(group.label)}
                  onLeave={() => group.children && hoverClose()}
                  onDropdownEnter={() => hoverOpen(group.label)}
                  onDropdownLeave={hoverClose}
                  onSelect={() => setOpenDD(null)}
                />
              </span>
            ))}
            {isAdmin && (
              <span className="hidden lg:inline-flex" style={{ alignItems: 'center', marginLeft: 4 }}>
                <span style={{ width: 1, height: 16, background: B.hairline, display: 'inline-block', margin: '0 10px' }} />
                {ADMIN_NAV.map(item => (
                  <NavLink key={item.label} label={item.label} href={item.href} active={isActive(item.href)} badge="admin" />
                ))}
              </span>
            )}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center" style={{ gap: 10 }}>
          <div className="hidden lg:block" style={{ position: 'relative', width: 240 }}>
            <input
              placeholder="Buscar vehículo, placa, contrato…"
              style={{
                fontFamily: 'var(--font-inter)', fontSize: 13,
                padding: '9px 14px 9px 36px', width: '100%',
                background: B.surface, border: `1px solid ${B.hairline}`,
                borderRadius: 9999, color: B.ink, outline: 'none', boxSizing: 'border-box',
              }}
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={B.ink3} strokeWidth="2"
              style={{ position: 'absolute', left: 14, top: 11 }}>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
            </svg>
          </div>

          <a href="/admin/configuracion" className="hidden md:flex" style={{
            width: 38, height: 38, borderRadius: 9999, background: B.surface,
            border: `1px solid ${B.hairline}`, color: B.ink3, cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </a>

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

          {/* User pill */}
          <div className="flex items-center" style={{
            gap: 8, padding: '6px 12px 6px 6px',
            background: B.surface, borderRadius: 9999, border: `1px solid ${B.hairline}`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 9999, background: B.blueSoft, color: B.blue,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 11,
            }}>{userInitials || '--'}</div>
            <div className="hidden sm:flex" style={{ flexDirection: 'column', gap: 0 }}>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, fontWeight: 500, lineHeight: 1.2 }}>
                {userName || '…'}
              </span>
              {userRole && (
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: B.ink3, lineHeight: 1.2 }}>{userRole}</span>
              )}
            </div>
          </div>

          {/* Logout */}
          <form action="/logout" method="POST">
            <button
              type="submit"
              title="Salir"
              style={{
                width: 38, height: 38, borderRadius: 9999, background: B.surface,
                border: `1px solid ${B.hairline}`, color: B.ink3, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </form>

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

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden" style={{ borderTop: `1px solid ${B.hairline}`, padding: '12px 16px 16px' }}>
          {allMobileItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-inter)', fontSize: 14,
                fontWeight: isActive(item.href) ? 500 : 400,
                color: isActive(item.href) ? B.ink : B.ink2,
                padding: '12px 8px',
                borderBottom: `1px solid ${B.hairline}`,
                textDecoration: 'none',
                background: isActive(item.href) ? B.surface2 : 'transparent',
                borderRadius: 8,
              }}
            >
              {item.label}
              {item.badge === 'beta' && (
                <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 9999, background: B.amberSoft, color: B.amber, fontWeight: 500 }}>beta</span>
              )}
            </a>
          ))}
          {isAdmin && (
            <>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: B.ink3, fontWeight: 600, letterSpacing: '0.06em', padding: '14px 8px 6px', textTransform: 'uppercase' }}>Admin</div>
              {ADMIN_NAV.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: 'var(--font-inter)', fontSize: 14,
                    fontWeight: isActive(item.href) ? 500 : 400,
                    color: isActive(item.href) ? B.ink : B.ink2,
                    padding: '12px 8px',
                    borderBottom: `1px solid ${B.hairline}`,
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                  <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 9999, background: B.amberSoft, color: B.amber, fontWeight: 600 }}>admin</span>
                </a>
              ))}
            </>
          )}
          <div style={{ position: 'relative', marginTop: 12 }}>
            <input
              placeholder="Buscar vehículo, placa, contrato…"
              style={{
                fontFamily: 'var(--font-inter)', fontSize: 13,
                padding: '9px 14px 9px 36px', width: '100%',
                background: B.surface, border: `1px solid ${B.hairline}`,
                borderRadius: 9999, color: B.ink, outline: 'none', boxSizing: 'border-box',
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

// ─── NavGroupItem ─────────────────────────────────────────────────────────────

function NavGroupItem({
  group, active, childActive, isOpen,
  onEnter, onLeave, onDropdownEnter, onDropdownLeave, onSelect,
}: {
  group: NavGroup
  active: boolean
  childActive: (c: NavItem) => boolean
  isOpen: boolean
  onEnter: () => void
  onLeave: () => void
  onDropdownEnter: () => void
  onDropdownLeave: () => void
  onSelect: () => void
}) {
  const hasChildren = !!group.children?.length

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {group.href ? (
        <NavLink label={group.label} href={group.href} active={active} badge={group.badge} />
      ) : (
        <button style={{
          fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: active ? 500 : 400,
          color: active ? B.ink : B.ink3,
          padding: '8px 12px', borderRadius: 9999,
          background: active ? B.surface : 'transparent',
          boxShadow: active ? B.shadowSm : 'none',
          border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4,
          whiteSpace: 'nowrap',
        }}>
          {group.label}
          {hasChildren && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ opacity: 0.5, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          )}
        </button>
      )}

      {hasChildren && isOpen && (
        <div
          onMouseEnter={onDropdownEnter}
          onMouseLeave={onDropdownLeave}
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50,
            background: B.surface, border: `1px solid ${B.hairline}`,
            borderRadius: 12, padding: 6,
            boxShadow: '0 4px 6px rgba(14,23,38,0.06), 0 12px 32px rgba(14,23,38,0.08)',
            minWidth: 160,
          }}
        >
          {group.children!.map(child => (
            <a
              key={child.href}
              href={child.href}
              onClick={onSelect}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 12px', borderRadius: 8,
                fontFamily: 'var(--font-inter)', fontSize: 13,
                fontWeight: childActive(child) ? 500 : 400,
                color: childActive(child) ? B.ink : B.ink2,
                background: childActive(child) ? B.surface2 : 'transparent',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              {child.label}
              {child.badge === 'beta' && (
                <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 9999, background: B.amberSoft, color: B.amber, fontWeight: 600 }}>beta</span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── NavLink ──────────────────────────────────────────────────────────────────

function NavLink({ label, href, active, badge }: { label: string; href: string; active: boolean; badge?: string }) {
  return (
    <a href={href} style={{
      fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: active ? 500 : 400,
      color: active ? B.ink : B.ink3,
      padding: '8px 12px', borderRadius: 9999,
      background: active ? B.surface : 'transparent',
      boxShadow: active ? B.shadowSm : 'none',
      textDecoration: 'none', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 5,
      whiteSpace: 'nowrap',
    }}>
      {label}
      {badge === 'beta' && (
        <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 9999, background: B.amberSoft, color: B.amber, fontWeight: 600 }}>beta</span>
      )}
      {badge === 'admin' && (
        <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 9999, background: B.amberSoft, color: B.amber, fontWeight: 600 }}>admin</span>
      )}
    </a>
  )
}
