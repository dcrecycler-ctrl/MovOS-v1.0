'use client'

import { useState } from 'react'
import { B } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import { DrillModal }   from '@/components/ui/DrillModal'
import { ActionButton } from '@/components/ui/ActionButton'

// ─── Types + mock data ────────────────────────────────────────────────────────

type ServiceType   = 'manufacturer' | 'internal'
type ServiceStatus = 'critical' | 'warning' | 'on_track'

interface UpcomingService {
  id: string; unit: string; plate: string; model: string
  serviceName: string; type: ServiceType
  dueKm: string; dueDays: number | null; dealerShop: string
  status: ServiceStatus; notes: string
}

const SERVICES: UpcomingService[] = [
  {
    id: 's1', unit: 'U-0142', plate: 'SBQ 3812', model: 'Toyota Hilux 2022',
    serviceName: '5,000 km Service', type: 'manufacturer',
    dueKm: 'OVERDUE –284 km', dueDays: null, dealerShop: 'Toyota PDE',
    status: 'critical', notes: 'Last service at 45,000 km. Currently at 50,284 km. Oil change, filter, multi-point inspection overdue.',
  },
  {
    id: 's2', unit: 'U-0033', plate: 'SAT 2290', model: 'Toyota SW4 2020',
    serviceName: 'Annual Brake Inspection', type: 'manufacturer',
    dueKm: '—', dueDays: 12, dealerShop: 'Toyota PDE',
    status: 'warning', notes: 'Annual brake inspection due 30 May. Last done 28 May 2025. Brake pad wear: 45%.',
  },
  {
    id: 's3', unit: 'U-0087', plate: 'SBC 1243', model: 'Toyota Corolla 2023',
    serviceName: 'Quarterly Fluid Top-Up', type: 'internal',
    dueKm: '—', dueDays: 6, dealerShop: 'Workshop PDE',
    status: 'warning', notes: 'Internal fleet rule: fluid check every 90 days. Coolant, brake fluid, power steering.',
  },
  {
    id: 's4', unit: 'U-0201', plate: 'SBF 9912', model: 'Toyota RAV4 2023',
    serviceName: '20,000 km Service', type: 'manufacturer',
    dueKm: '2,100 km remaining', dueDays: 18, dealerShop: 'Toyota PDE',
    status: 'warning', notes: 'Air filter, cabin filter, brake fluid, spark plugs, belts. Currently at 57,900 km.',
  },
  {
    id: 's5', unit: 'U-0055', plate: 'SAX 4421', model: 'Renault Duster 2021',
    serviceName: 'Pickup Tire Rotation', type: 'internal',
    dueKm: '3,800 km remaining', dueDays: 32, dealerShop: 'Workshop PDE',
    status: 'on_track', notes: 'Internal rule: tire rotation every 10,000 km for pickup category. Currently at 36,200 km.',
  },
  {
    id: 's6', unit: 'U-0119', plate: 'SBD 7730', model: 'Nissan Frontier 2022',
    serviceName: 'GPS Battery Replacement', type: 'internal',
    dueKm: '—', dueDays: 45, dealerShop: 'Workshop PDE',
    status: 'on_track', notes: 'Internal rule: GPS device battery replacement every 18 months. Device installed Sep 2024.',
  },
]

const STATUS_COLOR: Record<ServiceStatus, string> = {
  critical: B.rose,
  warning:  B.amber,
  on_track: B.green,
}

const STATUS_LABEL: Record<ServiceStatus, string> = {
  critical: 'CRITICAL',
  warning:  'WARNING',
  on_track: 'ON TRACK',
}

const TYPE_COLOR: Record<ServiceType, string> = {
  manufacturer: B.blue,
  internal:     B.lilac,
}

// ─── ServiceSchedule ─────────────────────────────────────────────────────────

export function ServiceSchedule() {
  const [filter,   setFilter]   = useState<ServiceType | 'all'>('all')
  const [selected, setSelected] = useState<UpcomingService | null>(null)

  const rows = filter === 'all' ? SERVICES : SERVICES.filter(s => s.type === filter)
  const urgentCount = SERVICES.filter(s => s.status !== 'on_track').length

  return (
    <div style={{
      border: `1px solid ${B.hairline}`, background: B.surface,
      borderRadius: 14, boxShadow: B.shadowSm, overflow: 'hidden',
    }}>

      {/* Header + tabs */}
      <div style={{ padding: '14px 14px 0', borderBottom: `1px solid ${B.hairline}` }}>
        <div style={{ marginBottom: 10 }}>
          <SectionLabel label="Upcoming Services" count={urgentCount} color={B.blue} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {(['all', 'manufacturer', 'internal'] as const).map(f => {
            const active = filter === f
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                height: 32, padding: '0 14px',
                fontSize: 11, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.06em',
                color:      active ? B.blue : B.ink3,
                background: 'transparent', border: 'none',
                borderBottom: active ? `2px solid ${B.blue}` : '2px solid transparent',
                cursor: 'pointer',
              }}>
                {f === 'all' ? 'All' : f === 'manufacturer' ? 'Manufacturer' : 'Internal'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Service rows */}
      {rows.map((s, i) => (
        <div
          key={s.id}
          onClick={() => setSelected(s)}
          style={{
            padding: '10px 14px',
            borderBottom: i < rows.length - 1 ? `1px solid ${B.hairline}` : 'none',
            borderLeft: `2px solid ${STATUS_COLOR[s.status]}`,
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = B.surface2)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {/* Top row: unit + badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.amber, fontWeight: 700 }}>{s.unit}</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink2 }}>{s.plate}</span>
              <StatusBadge label={s.type === 'manufacturer' ? 'MFR' : 'INT'} color={TYPE_COLOR[s.type]} small />
            </div>
            <StatusBadge label={STATUS_LABEL[s.status]} color={STATUS_COLOR[s.status]} small />
          </div>
          {/* Service name */}
          <div style={{ fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink, marginBottom: 3 }}>
            {s.serviceName}
          </div>
          {/* Due info + shop */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3 }}>
              {s.dueKm !== '—' && <span style={{ marginRight: 8 }}>{s.dueKm}</span>}
              {s.dueDays !== null && (
                <span style={{ color: s.dueDays <= 14 ? B.amber : B.ink3 }}>
                  {s.dueDays} days
                </span>
              )}
            </div>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3 }}>{s.dealerShop}</span>
          </div>
        </div>
      ))}

      {/* Detail modal */}
      {selected && (
        <DrillModal
          title={`${selected.unit} · ${selected.serviceName}`}
          subtitle={`${selected.model} · ${selected.plate} · ${selected.dealerShop}`}
          color={STATUS_COLOR[selected.status]}
          onClose={() => setSelected(null)}
        >
          <ServiceDetail service={selected} onClose={() => setSelected(null)} />
        </DrillModal>
      )}
    </div>
  )
}

// ─── Service detail ───────────────────────────────────────────────────────────

function ServiceDetail({ service: s, onClose }: { service: UpcomingService; onClose: () => void }) {
  const ROWS = [
    { label: 'Unit',      value: s.unit },
    { label: 'Plate',     value: s.plate },
    { label: 'Model',     value: s.model },
    { label: 'Service',   value: s.serviceName },
    { label: 'Type',      value: s.type === 'manufacturer' ? 'Manufacturer booklet' : 'Internal rule' },
    { label: 'Due km',    value: s.dueKm },
    { label: 'Due in',    value: s.dueDays !== null ? `${s.dueDays} days` : '—' },
    { label: 'Shop',      value: s.dealerShop },
    { label: 'Status',    value: STATUS_LABEL[s.status] },
  ]
  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        Service Info
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 1, background: B.surface3, borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        {ROWS.flatMap(row => [
          <div key={`${row.label}-l`} style={{ padding: '7px 10px', background: B.surface2, fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {row.label}
          </div>,
          <div key={`${row.label}-v`} style={{ padding: '7px 10px', background: B.surface, fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink }}>
            {row.value}
          </div>,
        ])}
      </div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        Notes
      </div>
      <div style={{ fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink2, lineHeight: 1.6, padding: '10px 12px', border: `1px solid ${B.hairline}`, background: B.surface2, borderRadius: 8, marginBottom: 20 }}>
        {s.notes}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <ActionButton label="Schedule Service" color={B.blue}  onClick={() => {}} />
        <ActionButton label="Close"            color={B.amber} secondary onClick={onClose} />
      </div>
    </div>
  )
}
