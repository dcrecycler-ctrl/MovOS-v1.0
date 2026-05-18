'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { StatusBadge } from '@/components/ui/StatusBadge'

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType =
  | 'status_change' | 'inspection' | 'service' | 'alert'
  | 'damage' | 'repair' | 'contract' | 'document' | 'check_in' | 'note'

interface VehicleEvent {
  id: string; type: EventType
  summary: string; detail: string
  actor: string; timeAgo: string
}

// ─── Color + label per event type ─────────────────────────────────────────────

const TYPE_META: Record<EventType, { color: string; label: string }> = {
  status_change: { color: DS.green,  label: 'Status'      },
  inspection:    { color: DS.blue,   label: 'Inspection'  },
  service:       { color: DS.gold,   label: 'Service'     },
  alert:         { color: DS.red,    label: 'Alert'       },
  damage:        { color: DS.red,    label: 'Damage'      },
  repair:        { color: DS.orange, label: 'Repair'      },
  contract:      { color: DS.purple, label: 'Contract'    },
  document:      { color: DS.slate,  label: 'Document'    },
  check_in:      { color: DS.green,  label: 'Check-in'   },
  note:          { color: DS.dim,    label: 'Note'        },
}

// ─── 15 mock events — full vehicle lifecycle ──────────────────────────────────

const ALL_EVENTS: VehicleEvent[] = [
  {
    id: 'e15', type: 'status_change',
    summary: 'Status changed to Assigned',
    detail: 'Assigned to client Carlos Mendoza — Reservation #RES-8812 · Pickup: Loc A PDE',
    actor: 'Sistema', timeAgo: '3 days ago',
  },
  {
    id: 'e14', type: 'alert',
    summary: 'System alert created: tire pressure warning',
    detail: 'GPS telemetry detected pressure drop in rear-left tire (1.8 bar, expected 2.4 bar)',
    actor: 'Sistema (GPS)', timeAgo: '5 days ago',
  },
  {
    id: 'e13', type: 'document',
    summary: 'Insurance certificate renewed',
    detail: 'MAPFRE Uruguay — Policy #POL-UY-442819 — Coverage: comprehensive — Expires: Aug 2026',
    actor: 'Rocío Ávila', timeAgo: '12 days ago',
  },
  {
    id: 'e12', type: 'service',
    summary: '5,000 km service completed',
    detail: 'Toyota PDE dealer — Odometer: 45,000 km — Oil change, filter, inspection — Cost: $UY 8,200 — Stamp: STM-2026-04-PDE',
    actor: 'Toyota Punta del Este', timeAgo: '21 days ago',
  },
  {
    id: 'e11', type: 'status_change',
    summary: 'Status changed to Available',
    detail: 'Returned to active fleet after scheduled service',
    actor: 'Sistema', timeAgo: '21 days ago',
  },
  {
    id: 'e10', type: 'status_change',
    summary: 'Status changed to Maintenance',
    detail: 'Sent to Toyota dealer for 5,000 km scheduled service — Est. return: 1 day',
    actor: 'Luis Fernández', timeAgo: '22 days ago',
  },
  {
    id: 'e9', type: 'inspection',
    summary: 'Return inspection completed — clean',
    detail: 'Reservation #RES-7741 — No new damage recorded — Fuel: 75% — Odometer: 44,820 km — Inspector: María González',
    actor: 'María González', timeAgo: '22 days ago',
  },
  {
    id: 'e8', type: 'repair',
    summary: 'Repair ticket closed',
    detail: 'Ticket #TK-0291 — Windshield chip repair — AutoGlass PDE — Labor: $UY 4,500 — Parts: included',
    actor: 'AutoGlass PDE', timeAgo: '35 days ago',
  },
  {
    id: 'e7', type: 'repair',
    summary: 'Repair ticket opened',
    detail: 'Ticket #TK-0291 — Windshield chip from road debris — Severity: minor — Shop: AutoGlass PDE',
    actor: 'Rocío Ávila', timeAgo: '40 days ago',
  },
  {
    id: 'e6', type: 'damage',
    summary: 'Damage recorded — windshield chip',
    detail: 'Zone: Windshield · Type: Impact chip · Severity: Minor · Responsible: Client · Linked to Reservation #RES-7190',
    actor: 'María González', timeAgo: '40 days ago',
  },
  {
    id: 'e5', type: 'inspection',
    summary: 'Return inspection — damage found',
    detail: 'Reservation #RES-7190 — 1 damage item recorded (windshield chip) — Fuel: 68% — Odometer: 44,291 km',
    actor: 'María González', timeAgo: '40 days ago',
  },
  {
    id: 'e4', type: 'check_in',
    summary: 'Pickup inspection completed — clean',
    detail: 'Reservation #RES-7190 — No pre-existing damage — Fuel: 100% — Odometer: 42,140 km — Client signature obtained',
    actor: 'María González', timeAgo: '52 days ago',
  },
  {
    id: 'e3', type: 'contract',
    summary: 'Assigned to long-term contract — OSE',
    detail: 'Contract #CON-082 · OSE Servicios Públicos · Monthly rate: $UY 38,000 · Start: Feb 2026 · Mileage allowance: 3,000 km/mo',
    actor: 'Rocío Ávila', timeAgo: '90 days ago',
  },
  {
    id: 'e2', type: 'service',
    summary: 'Pre-delivery inspection completed',
    detail: 'Toyota Punta del Este — PDI at dealer, all systems checked — Odometer: 12 km — Handed to fleet',
    actor: 'Toyota PDE', timeAgo: '3 years ago',
  },
  {
    id: 'e1', type: 'status_change',
    summary: 'Vehicle registered in MovOS',
    detail: 'U-0142 · VIN: 8AFED71B5LA247892 · Toyota Hilux 2022 · Silver · Acquisition: USD 42,500 · Loc A PDE',
    actor: 'Rocío Ávila', timeAgo: '3 years ago',
  },
]

// ─── Filter config ────────────────────────────────────────────────────────────

const FILTERS: { id: EventType | 'all'; label: string }[] = [
  { id: 'all',          label: 'All'           },
  { id: 'inspection',   label: 'Inspection'    },
  { id: 'service',      label: 'Service'       },
  { id: 'alert',        label: 'Alert'         },
  { id: 'status_change',label: 'Status Change' },
  { id: 'damage',       label: 'Damage'        },
  { id: 'repair',       label: 'Repair'        },
  { id: 'check_in',     label: 'Check-in'      },
  { id: 'document',     label: 'Document'      },
]

// ─── EventHistoryTab ──────────────────────────────────────────────────────────

export function EventHistoryTab() {
  const [filter, setFilter] = useState<EventType | 'all'>('all')

  const events = filter === 'all'
    ? ALL_EVENTS
    : ALL_EVENTS.filter(e => e.type === filter)

  return (
    <div style={{ maxWidth: 900 }}>

      {/* Filter chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
        {FILTERS.map(f => {
          const active = filter === f.id
          const color = f.id === 'all' ? DS.gold : TYPE_META[f.id as EventType]?.color ?? DS.gold
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                height: 28, padding: '0 12px',
                fontSize: 9, fontFamily: FONTS.mono, textTransform: 'uppercase', letterSpacing: '0.08em',
                color: active ? color : 'var(--ds-dim)',
                background: active ? `${color}1C` : 'transparent',
                border: `1px solid ${active ? color : 'var(--ds-border)'}`,
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              {f.label}
            </button>
          )
        })}
        <span style={{ marginLeft: 6, fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', alignSelf: 'center', letterSpacing: '0.06em' }}>
          {events.length} event{events.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Immutable note */}
      <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.06em', marginBottom: 20 }}>
        IMMUTABLE AUDIT LOG · EVENTS CANNOT BE EDITED OR DELETED
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <div style={{ padding: '28px 0', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          No events for this filter
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 6, top: 8, bottom: 8,
            width: 1, background: 'var(--ds-border)',
          }} />

          {events.map((ev, idx) => {
            const meta = TYPE_META[ev.type]
            return (
              <div key={ev.id} style={{ position: 'relative', marginBottom: 0 }}>
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute', left: -24 + 6 - 4, top: 14,
                  width: 8, height: 8,
                  background: meta.color,
                  border: `1px solid ${meta.color}`,
                  zIndex: 1,
                }} />

                {/* Event row */}
                <div style={{
                  borderBottom: idx < events.length - 1 ? '1px solid var(--ds-border)' : 'none',
                  padding: '12px 0 12px 4px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StatusBadge label={meta.label.toUpperCase()} color={meta.color} small />
                      <span style={{ fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-text)' }}>
                        {ev.summary}
                      </span>
                    </div>
                    <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {ev.timeAgo}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)', lineHeight: 1.5, marginBottom: 4, paddingLeft: 0 }}>
                    {ev.detail}
                  </div>
                  <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.04em' }}>
                    {ev.actor}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
