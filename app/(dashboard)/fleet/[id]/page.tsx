'use client'

import { useState } from 'react'
import { B } from '@/lib/tokens'
import { TopBar }       from '@/components/layout/TopBar'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'
import { ProfileTab }          from './ProfileTab'
import { ServiceIntervalsTab } from './ServiceIntervalsTab'
import { QRTab }               from './QRTab'
import { AlertsTab }           from './AlertsTab'
import { EventHistoryTab }     from './EventHistoryTab'

import { MOCK_VEHICLE, MOCK_DOCUMENTS } from './mock-data'
import type { MockVehicle } from './mock-data'

type TabId = 'profile' | 'services' | 'qr' | 'alerts' | 'events'

const TABS: { id: TabId; label: string }[] = [
  { id: 'profile',  label: 'Perfil'           },
  { id: 'services', label: 'Intervalos'        },
  { id: 'qr',       label: 'Código QR'         },
  { id: 'alerts',   label: 'Alertas'           },
  { id: 'events',   label: 'Historial'         },
]

const bLight = {
  '--ds-bg':       B.bg,
  '--ds-bg-1':     B.surface,
  '--ds-bg-2':     B.surface2,
  '--ds-bg-3':     B.surface3,
  '--ds-border':   'rgba(14,23,38,0.07)',
  '--ds-border-2': 'rgba(14,23,38,0.12)',
  '--ds-text':     B.ink,
  '--ds-dim':      B.ink2,
  '--ds-muted':    B.ink3,
  '--ds-faint':    B.ink4,
  '--ds-gold':     B.amber,
  '--ds-blue':     B.blue,
  '--ds-purple':   B.lilac,
  '--ds-green':    B.green,
  '--ds-red':      B.rose,
  '--ds-orange':   B.amber,
  '--ds-yellow':   B.amber,
  '--ds-lime':     B.green,
  '--ds-slate':    B.sky,
} as unknown as React.CSSProperties

const STATUS_COLOR: Record<string, string> = {
  assigned:    B.blue,
  available:   B.green,
  maintenance: B.amber,
  inspection:  B.amber,
}

export default function VehicleFilePage() {
  const [tab, setTab] = useState<TabId>('profile')

  const statusColor = STATUS_COLOR[MOCK_VEHICLE.status] ?? B.rose

  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar />

      {/* Sticky vehicle header + tab nav */}
      <div style={{
        position: 'sticky', top: 64, zIndex: 90,
        background: B.surface,
        borderBottom: `1px solid ${B.hairline}`,
        boxShadow: B.shadowSm,
      }}>
        <VehicleHeader vehicle={MOCK_VEHICLE} statusColor={statusColor} />
        <TabNav active={tab} onChange={setTab} />
      </div>

      {/* Tab content — bLight wraps DS sub-components */}
      <div className="max-w-[1440px] mx-auto px-4 pt-6 pb-24 md:px-5 md:pb-16 lg:px-9" style={bLight}>
        {tab === 'profile'  && <ProfileTab vehicle={MOCK_VEHICLE} documents={MOCK_DOCUMENTS} />}
        {tab === 'services' && <ServiceIntervalsTab />}
        {tab === 'qr'       && <QRTab unitId={MOCK_VEHICLE.unitId} plate={MOCK_VEHICLE.plate} model={`${MOCK_VEHICLE.make} ${MOCK_VEHICLE.model} ${MOCK_VEHICLE.year}`} />}
        {tab === 'alerts'   && <AlertsTab unitId={MOCK_VEHICLE.unitId} />}
        {tab === 'events'   && <EventHistoryTab />}
      </div>

      <BentoBottomNav />
    </div>
  )
}

function VehicleHeader({ vehicle, statusColor }: { vehicle: MockVehicle; statusColor: string }) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5 lg:px-9 lg:py-3.5">
      <div>
        <a href="/fleet" style={{
          fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3,
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 6,
        }}>
          ← Flota
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 22, fontWeight: 700,
            color: B.amber, letterSpacing: '0.04em', lineHeight: 1,
          }}>
            {vehicle.unitId}
          </span>
          <span style={{
            fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600,
            color: statusColor, background: statusColor + '18',
            padding: '3px 8px', borderRadius: 9999,
          }}>
            {vehicle.status.toUpperCase()}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, marginTop: 3 }}>
          {vehicle.make} {vehicle.model} {vehicle.year}
          <span style={{ color: B.ink4, margin: '0 6px' }}>·</span>
          {vehicle.plate}
          <span className="hidden md:inline" style={{ color: B.ink4, margin: '0 6px' }}>·</span>
          <span className="hidden md:inline">{vehicle.locationName}</span>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <ActionBtn label="Crear Alerta"    color={B.rose}  />
        <span className="hidden md:inline-flex">
          <ActionBtn label="Abrir Inspección" color={B.blue}  />
        </span>
        <span className="hidden md:inline-flex">
          <ActionBtn label="Ticket Reparación" color={B.amber} />
        </span>
      </div>
    </div>
  )
}

function ActionBtn({ label, color }: { label: string; color: string }) {
  return (
    <button style={{
      fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 500,
      color, border: `1px solid ${color}30`, background: color + '10',
      padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
    }}>
      {label}
    </button>
  )
}

function TabNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <div
      className="flex overflow-x-auto px-4 md:px-5 lg:px-9"
      style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
    >
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            height: 40, padding: '0 16px',
            fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: active === t.id ? 600 : 400,
            color: active === t.id ? B.ink : B.ink3,
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${active === t.id ? B.amber : 'transparent'}`,
            cursor: 'pointer', transition: 'color 0.12s, border-color 0.12s',
            flexShrink: 0, scrollSnapAlign: 'start',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
