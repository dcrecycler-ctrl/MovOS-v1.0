'use client'

import { useState } from 'react'
import { B } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import { DrillModal }   from '@/components/ui/DrillModal'
import { ActionButton } from '@/components/ui/ActionButton'

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = 'critical' | 'major' | 'minor'
type TicketStatus = 'open' | 'assigned' | 'in_progress' | 'waiting_parts' | 'completed'

interface UrgentTicket {
  id: string; unit: string; plate: string; model: string
  issue: string; description: string
  severity: Severity; status: TicketStatus
  assignedTo: string; shop: string
  daysOpen: number; branch: string
  laborCost: number; partsCost: number
  parts: { name: string; qty: number; unitCost: number }[]
  history: { status: TicketStatus; date: string; actor: string; note: string }[]
}

// ─── Pipeline stages ──────────────────────────────────────────────────────────

const PIPELINE = [
  { id: 'open',          label: 'Open',          count: 3, color: B.rose  },
  { id: 'assigned',      label: 'Assigned',      count: 2, color: B.amber },
  { id: 'in_progress',   label: 'In Progress',   count: 2, color: B.blue  },
  { id: 'waiting_parts', label: 'Waiting Parts', count: 1, color: B.amber },
  { id: 'completed',     label: 'Completed',     count: 5, color: B.green },
]
const PIPELINE_MAX = 5

// ─── 5 most urgent tickets ────────────────────────────────────────────────────

const URGENT: UrgentTicket[] = [
  {
    id: 'TK-0303', unit: 'U-0088', plate: 'SBC 7751', model: 'Toyota Corolla 2023',
    issue: 'Front bumper collision',
    description: 'Low-speed collision, cracked bumper casing and mount. Client responsible — Res. RES-8810.',
    severity: 'critical', status: 'open', assignedTo: 'Unassigned', shop: '—', daysOpen: 1,
    branch: 'Loc A PDE', laborCost: 0, partsCost: 0,
    parts: [],
    history: [
      { status: 'open', date: '18 May 09:44', actor: 'José Ramírez', note: 'Damage recorded at return inspection — RES-8810' },
    ],
  },
  {
    id: 'TK-0295', unit: 'U-0201', plate: 'SBF 9912', model: 'Toyota RAV4 2023',
    issue: 'Engine warning light — ECU fault',
    description: 'OBD fault code P0340 (camshaft position sensor). ECU module ordered.',
    severity: 'critical', status: 'waiting_parts', assignedTo: 'Auto García', shop: 'Auto García MVD', daysOpen: 12,
    branch: 'Loc B MVD', laborCost: 4800, partsCost: 0,
    parts: [{ name: 'Camshaft Position Sensor', qty: 1, unitCost: 12400 }],
    history: [
      { status: 'open',          date: '6 May 08:12', actor: 'Sistema (GPS)', note: 'Engine warning detected via OBD telemetry'       },
      { status: 'assigned',      date: '6 May 09:30', actor: 'Luis Fernández', note: 'Assigned to Auto García MVD for diagnosis'     },
      { status: 'in_progress',   date: '7 May 10:00', actor: 'Auto García',   note: 'Diagnosis started — P0340 confirmed'            },
      { status: 'waiting_parts', date: '8 May 14:22', actor: 'Auto García',   note: 'Sensor ordered — ETA 5–7 business days'         },
    ],
  },
  {
    id: 'TK-0299', unit: 'U-0094', plate: 'SBB 6623', model: 'Renault Kangoo 2021',
    issue: 'Rear window — full crack',
    description: 'Full crack across lower third of rear window. Structural integrity compromised. Client responsible — Res. RES-8803.',
    severity: 'major', status: 'in_progress', assignedTo: 'AutoGlass PDE', shop: 'AutoGlass PDE', daysOpen: 5,
    branch: 'Loc A PDE', laborCost: 8400, partsCost: 15700,
    parts: [
      { name: 'Rear window glass — Kangoo 2021', qty: 1, unitCost: 14200 },
      { name: 'Window seal & adhesive kit',       qty: 1, unitCost: 1500  },
    ],
    history: [
      { status: 'open',        date: '13 May 16:40', actor: 'María González', note: 'Damage recorded at return inspection'          },
      { status: 'assigned',    date: '13 May 17:00', actor: 'Rocío Ávila',   note: 'Assigned to AutoGlass PDE'                     },
      { status: 'in_progress', date: '14 May 09:30', actor: 'AutoGlass PDE', note: 'Vehicle received, work started'                },
    ],
  },
  {
    id: 'TK-0297', unit: 'U-0033', plate: 'SAT 2290', model: 'Toyota SW4 2020',
    issue: 'Hood — hail damage (multiple dents)',
    description: 'Approx. 18 impact dents across hood and roof panels from hailstorm on Ruta 9. Fleet responsible.',
    severity: 'major', status: 'waiting_parts', assignedTo: 'Pinturería Mendoza', shop: 'Pinturería Mendoza PDE', daysOpen: 17,
    branch: 'Loc A PDE', laborCost: 12000, partsCost: 26200,
    parts: [
      { name: 'Hood panel replacement',   qty: 1, unitCost: 18200 },
      { name: 'Roof repair & paint',      qty: 1, unitCost: 8000  },
    ],
    history: [
      { status: 'open',          date: '1 May 14:10', actor: 'María González', note: 'Hail damage documented at lot inspection'      },
      { status: 'assigned',      date: '1 May 15:00', actor: 'Rocío Ávila',   note: 'Assigned to Pinturería Mendoza'                },
      { status: 'in_progress',   date: '2 May 08:00', actor: 'Pinturería',    note: 'Vehicle received, assessment complete'         },
      { status: 'waiting_parts', date: '3 May 11:30', actor: 'Pinturería',    note: 'Hood panel ordered from Toyota parts center'   },
    ],
  },
  {
    id: 'TK-0301', unit: 'U-0055', plate: 'SAX 4421', model: 'Renault Duster 2021',
    issue: 'Front left door — keying scratch',
    description: '12 cm keying scratch on front left door, primer exposed. Client responsible — Res. RES-8799.',
    severity: 'minor', status: 'in_progress', assignedTo: 'Pinturería Morales', shop: 'Pinturería Morales PDE', daysOpen: 4,
    branch: 'Loc A PDE', laborCost: 3200, partsCost: 1600,
    parts: [{ name: 'Touch-up paint kit — Duster silver', qty: 1, unitCost: 1600 }],
    history: [
      { status: 'open',        date: '14 May 16:40', actor: 'Luis Fernández', note: 'Damage recorded at return inspection'          },
      { status: 'assigned',    date: '14 May 17:10', actor: 'Rocío Ávila',   note: 'Assigned to Pinturería Morales'                },
      { status: 'in_progress', date: '15 May 10:00', actor: 'Pinturería',    note: 'Vehicle received'                              },
    ],
  },
]

// ─── Colors ───────────────────────────────────────────────────────────────────

const SEV_COLOR: Record<Severity, string> = {
  critical: B.rose,
  major:    B.amber,
  minor:    B.amber,
}

// ─── RepairTicketsSummary ─────────────────────────────────────────────────────

export function RepairTicketsSummary() {
  const [selected, setSelected] = useState<UrgentTicket | null>(null)
  const totalActive = PIPELINE.filter(s => s.id !== 'completed').reduce((a, s) => a + s.count, 0)

  return (
    <div style={{ border: `1px solid ${B.hairline}`, background: B.surface, borderRadius: 14, boxShadow: B.shadowSm, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${B.hairline}` }}>
        <SectionLabel label="Repair Tickets" count={totalActive} color={B.lilac} />
      </div>

      {/* Pipeline */}
      <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${B.hairline}` }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
          Pipeline
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PIPELINE.map(stage => (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, fontSize: 18, fontFamily: 'var(--font-inter)', fontWeight: 700, color: stage.color, lineHeight: 1, textAlign: 'right', flexShrink: 0, letterSpacing: '-0.02em' }}>
                {stage.count}
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, width: 90, flexShrink: 0 }}>
                {stage.label}
              </div>
              <div style={{ flex: 1, height: 4, background: B.surface3, borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round((stage.count / PIPELINE_MAX) * 100)}%`,
                  background: stage.color,
                  borderRadius: 9999,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 urgent tickets */}
      <div style={{ padding: '10px 16px 8px', borderBottom: `1px solid ${B.hairline}` }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Most Urgent
        </div>
      </div>
      {URGENT.map((t, i) => (
        <div
          key={t.id}
          onClick={() => setSelected(t)}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 16px',
            borderBottom: i < URGENT.length - 1 ? `1px solid ${B.hairline}` : 'none',
            borderLeft: `2px solid ${SEV_COLOR[t.severity]}`,
            cursor: 'pointer', transition: 'background 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = B.surface2)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-dm-mono)', fontWeight: 700, color: B.amber }}>{t.unit}</span>
              <StatusBadge label={t.severity.toUpperCase()} color={SEV_COLOR[t.severity]} small />
            </div>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
              {t.issue}
            </div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3 }}>
              {t.assignedTo}
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontFamily: 'var(--font-inter)', fontWeight: 700, color: t.daysOpen >= 7 ? B.rose : B.ink2, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {t.daysOpen}
            </div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3 }}>days</div>
          </div>
        </div>
      ))}

      {/* Detail modal */}
      {selected && (
        <DrillModal
          title={`${selected.id} · ${selected.unit}`}
          subtitle={`${selected.issue} · ${selected.branch}`}
          color={SEV_COLOR[selected.severity]}
          onClose={() => setSelected(null)}
        >
          <TicketDetail ticket={selected} onClose={() => setSelected(null)} />
        </DrillModal>
      )}
    </div>
  )
}

// ─── Ticket detail (shared, used by both summary and list) ────────────────────

export function TicketDetail({ ticket: t, onClose }: { ticket: UrgentTicket; onClose: () => void }) {
  const totalCost = t.laborCost + t.partsCost + t.parts.reduce((a, p) => a + p.qty * p.unitCost, 0)

  const INFO_ROWS = [
    { label: 'Ticket ID',   value: t.id },
    { label: 'Unit',        value: t.unit },
    { label: 'Plate',       value: t.plate },
    { label: 'Model',       value: t.model },
    { label: 'Branch',      value: t.branch },
    { label: 'Assigned To', value: t.assignedTo },
    { label: 'Shop',        value: t.shop || '—' },
    { label: 'Status',      value: t.status.replace(/_/g, ' ').toUpperCase() },
    { label: 'Days Open',   value: String(t.daysOpen) },
  ]

  return (
    <div>
      {/* Info grid */}
      <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        Ticket Info
      </div>
      <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${B.hairline}`, marginBottom: 16 }}>
        {INFO_ROWS.map((row, idx) => (
          <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', borderBottom: idx < INFO_ROWS.length - 1 ? `1px solid ${B.hairline}` : 'none' }}>
            <div style={{ padding: '8px 12px', background: idx % 2 === 0 ? B.surface2 : B.surface, fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3 }}>
              {row.label}
            </div>
            <div style={{ padding: '8px 12px', background: idx % 2 === 0 ? B.surface2 : B.surface, fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink, borderLeft: `1px solid ${B.hairline}` }}>
              {row.value}
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Description</div>
      <div style={{ fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink2, lineHeight: 1.6, padding: '10px 14px', border: `1px solid ${B.hairline}`, borderRadius: 10, background: B.surface2, marginBottom: 16 }}>
        {t.description}
      </div>

      {/* Parts */}
      {t.parts.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Parts Used</div>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${B.hairline}` }}>
            {t.parts.map((p, idx) => (
              <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '1fr 36px 90px', borderBottom: idx < t.parts.length - 1 ? `1px solid ${B.hairline}` : 'none', background: idx % 2 === 0 ? B.surface2 : B.surface }}>
                <div style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink2 }}>{p.name}</div>
                <div style={{ padding: '8px 6px', fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink3, textAlign: 'center' }}>×{p.qty}</div>
                <div style={{ padding: '8px 12px', fontSize: 12, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.amber, textAlign: 'right' }}>
                  ${(p.qty * p.unitCost).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Labor',  value: t.laborCost,  color: B.blue  },
          { label: 'Parts',  value: t.partsCost + t.parts.reduce((a, p) => a + p.qty * p.unitCost, 0), color: B.amber },
          { label: 'Total',  value: totalCost,    color: B.amber },
        ].map(c => (
          <div key={c.label} style={{ background: B.surface2, padding: '12px 14px', borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: c.label === 'Total' ? 20 : 16, fontFamily: 'var(--font-inter)', fontWeight: 700, color: c.color, letterSpacing: '-0.02em' }}>
              {c.value === 0 ? '—' : `$UY ${c.value.toLocaleString()}`}
            </div>
          </div>
        ))}
      </div>

      {/* Status history */}
      <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Status History</div>
      <div style={{ position: 'relative', paddingLeft: 20, marginBottom: 20 }}>
        <div style={{ position: 'absolute', left: 6, top: 6, bottom: 6, width: 1, background: B.hairline }} />
        {t.history.map((h, i) => {
          const stageColor = h.status === 'open' ? B.rose : h.status === 'in_progress' ? B.blue : h.status === 'waiting_parts' ? B.amber : h.status === 'assigned' ? B.amber : B.green
          return (
            <div key={i} style={{ position: 'relative', marginBottom: i < t.history.length - 1 ? 12 : 0 }}>
              <div style={{ position: 'absolute', left: -20 + 6 - 4, top: 5, width: 7, height: 7, background: stageColor, borderRadius: 9999, zIndex: 1 }} />
              <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600, color: stageColor, marginBottom: 2 }}>
                {h.status.replace(/_/g, ' ')} · {h.date}
              </div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink2, lineHeight: 1.5, marginBottom: 1 }}>
                {h.note}
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3 }}>{h.actor}</div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <ActionButton label="Update Status" color={B.blue}  onClick={() => {}} />
        <ActionButton label="Close Ticket"  color={B.green} secondary onClick={onClose} />
      </div>
    </div>
  )
}
