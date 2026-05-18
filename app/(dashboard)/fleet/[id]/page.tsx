'use client'

import { CSSProperties, useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import { ActionButton } from '@/components/ui/ActionButton'
import { AppNav }       from '@/components/ui/AppNav'
import { BottomNav }    from '@/components/ui/BottomNav'
import { ProfileTab }          from './ProfileTab'
import { ServiceIntervalsTab } from './ServiceIntervalsTab'
import { QRTab }               from './QRTab'
import { AlertsTab }           from './AlertsTab'
import { EventHistoryTab }     from './EventHistoryTab'

// ─── Mock data ────────────────────────────────────────────────────────────────

import { MOCK_VEHICLE, MOCK_DOCUMENTS } from './mock-data'
import type { MockVehicle } from './mock-data'

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabId = 'profile' | 'services' | 'qr' | 'alerts' | 'events'

const TABS: { id: TabId; label: string }[] = [
  { id: 'profile',  label: 'Profile'          },
  { id: 'services', label: 'Service Intervals' },
  { id: 'qr',       label: 'QR Code'           },
  { id: 'alerts',   label: 'Alerts'            },
  { id: 'events',   label: 'Event History'     },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VehicleFilePage() {
  const [tab, setTab] = useState<TabId>('profile')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ds-bg)', fontFamily: FONTS.mono }}>

      <AppNav active="Flota" />

      {/* Sticky vehicle header + tab nav */}
      <div style={{
        position: 'sticky', top: 52, zIndex: 90,
        background: 'var(--ds-bg-1)',
        borderBottom: '1px solid var(--ds-border)',
      }}>
        <VehicleHeader vehicle={MOCK_VEHICLE} />
        <TabNav active={tab} onChange={setTab} />
      </div>

      {/* Tab content */}
      <div className="max-w-[1440px] mx-auto px-4 pt-6 pb-20 md:px-5 md:pb-16 lg:px-9">
        {tab === 'profile'  && <ProfileTab vehicle={MOCK_VEHICLE} documents={MOCK_DOCUMENTS} />}
        {tab === 'services' && <ServiceIntervalsTab />}
        {tab === 'qr'       && <QRTab unitId={MOCK_VEHICLE.unitId} plate={MOCK_VEHICLE.plate} model={`${MOCK_VEHICLE.make} ${MOCK_VEHICLE.model} ${MOCK_VEHICLE.year}`} />}
        {tab === 'alerts'   && <AlertsTab unitId={MOCK_VEHICLE.unitId} />}
        {tab === 'events'   && <EventHistoryTab />}
      </div>

      <BottomNav active="Fleet" />
    </div>
  )
}

// ─── VehicleHeader ────────────────────────────────────────────────────────────

function VehicleHeader({ vehicle }: { vehicle: MockVehicle }) {
  const statusColor = vehicle.status === 'assigned'    ? DS.blue
                    : vehicle.status === 'available'   ? DS.green
                    : vehicle.status === 'maintenance' ? DS.orange
                    : vehicle.status === 'inspection'  ? DS.yellow
                    : DS.red

  return (
    <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5 lg:px-9 lg:py-3.5">
      <div>
        <a href="/fleet" style={{
          fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 6,
        }}>
          ← FLEET
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28, fontFamily: FONTS.display, color: DS.gold, letterSpacing: '0.06em', lineHeight: 1 }}>
            {vehicle.unitId}
          </span>
          <StatusBadge label={vehicle.status.toUpperCase()} color={statusColor} />
        </div>
        <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-dim)', marginTop: 3, letterSpacing: '0.04em' }}>
          {vehicle.make} {vehicle.model} {vehicle.year}
          <span style={{ color: 'var(--ds-border-2)', margin: '0 6px' }}>·</span>
          {vehicle.plate}
          <span className="hidden md:inline" style={{ color: 'var(--ds-border-2)', margin: '0 6px' }}>·</span>
          <span className="hidden md:inline">{vehicle.locationName}</span>
        </div>
      </div>
      {/* Action buttons — hide less-important ones on mobile */}
      <div className="flex gap-2 flex-wrap">
        <ActionButton label="Create Alert"    color={DS.red}    onClick={() => {}} />
        <span className="hidden md:inline-flex">
          <ActionButton label="Open Inspection" color={DS.blue}   onClick={() => {}} />
        </span>
        <span className="hidden md:inline-flex">
          <ActionButton label="Repair Ticket"   color={DS.orange} onClick={() => {}} />
        </span>
      </div>
    </div>
  )
}

// ─── TabNav ───────────────────────────────────────────────────────────────────

function TabNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <div
      className="flex overflow-x-auto border-t px-4 md:px-5 lg:px-9"
      style={{
        borderColor: 'var(--ds-border)',
        scrollSnapType: 'x mandatory',
        // Hide scrollbar visually
        scrollbarWidth: 'none',
      }}
    >
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            height: 40,
            padding: '0 14px',
            fontSize: 10,
            fontFamily: FONTS.mono,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: active === t.id ? DS.gold : 'var(--ds-dim)',
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${active === t.id ? DS.gold : 'transparent'}`,
            cursor: 'pointer',
            transition: 'color 0.12s, border-color 0.12s',
            flexShrink: 0,
            scrollSnapAlign: 'start',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
