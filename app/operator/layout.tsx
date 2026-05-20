'use client'

import { usePathname, useRouter } from 'next/navigation'
import { B } from '@/lib/tokens'

// ─── Status bar icons ─────────────────────────────────────────────────────────

function Signal() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11">
      <g fill={B.ink}>
        <rect x="0" y="7" width="3" height="4" rx="0.5"/>
        <rect x="4" y="5" width="3" height="6" rx="0.5"/>
        <rect x="8" y="3" width="3" height="8" rx="0.5"/>
        <rect x="12" y="0" width="3" height="11" rx="0.5"/>
      </g>
    </svg>
  )
}

function Wifi() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke={B.ink} strokeWidth="1.2" strokeLinecap="round">
      <path d="M1 4 a10 10 0 0 1 14 0"/>
      <path d="M3.5 6.5 a6 6 0 0 1 9 0"/>
      <path d="M6 9 a3 3 0 0 1 4 0"/>
      <circle cx="8" cy="11" r="0.7" fill={B.ink}/>
    </svg>
  )
}

function Battery() {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12">
      <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke={B.ink} strokeWidth="1" opacity="0.4"/>
      <rect x="2" y="2" width="14" height="8" rx="1.5" fill={B.ink}/>
      <rect x="23" y="4" width="2" height="4" rx="1" fill={B.ink} opacity="0.4"/>
    </svg>
  )
}

// ─── Nav icons ────────────────────────────────────────────────────────────────

const strokeProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function IconTasks() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...strokeProps}>
      <rect x="3" y="4" width="18" height="16" rx="2"/>
      <path d="M8 10h8M8 14h5"/>
    </svg>
  )
}

function IconFleet() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...strokeProps}>
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
      <circle cx="6.5" cy="16.5" r="2.5"/>
      <circle cx="16.5" cy="16.5" r="2.5"/>
    </svg>
  )
}

function IconScan() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...strokeProps}>
      <rect x="3" y="7" width="18" height="13" rx="2"/>
      <path d="M3 11h18M9 4h6"/>
    </svg>
  )
}

function IconWrench() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...strokeProps}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/>
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...strokeProps}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  )
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV = [
  { label: 'Tareas',    Icon: IconTasks,  href: '/operator/tasks'       },
  { label: 'Flota',     Icon: IconFleet,  href: '/operator/scan'        },
  { label: 'Inspeccionar', Icon: IconScan,   href: '/operator/inspect'     },
  { label: 'Mantener',  Icon: IconWrench, href: '/operator/maintenance' },
  { label: 'Alertas',   Icon: IconBell,   href: '/operator/alerts'      },
]

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: '100%', maxWidth: 430, minHeight: '100vh',
        background: B.bg, display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>

        {/* iOS-style status bar */}
        <div style={{
          flexShrink: 0, height: 48,
          padding: '12px 28px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          background: B.bg,
          fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, fontWeight: 600,
        }}>
          <span>9:41</span>
          <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <Signal/><Wifi/><Battery/>
          </span>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 80 }}>
          {children}
        </div>

        {/* Bottom navigation */}
        <div style={{
          position: 'fixed', bottom: 0,
          left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430,
          background: B.surface,
          borderTop: `1px solid ${B.hairline}`,
          display: 'flex', justifyContent: 'space-around',
          padding: '10px 12px 26px',
          zIndex: 100,
        }}>
          {NAV.map(({ label, Icon, href }) => {
            const active = pathname === href ||
              (href !== '/operator/tasks' && pathname.startsWith(href))
            return (
              <button
                key={label}
                onClick={() => router.push(href)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  minWidth: 52, padding: '2px 4px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: active ? B.ink : B.ink3,
                  opacity: active ? 1 : 0.5,
                }}
              >
                <div style={{ display: 'flex', padding: 6 }}><Icon /></div>
                <span style={{
                  fontFamily: 'var(--font-inter)', fontSize: 10,
                  color: active ? B.ink : B.ink3,
                  fontWeight: active ? 600 : 500,
                }}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
