'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
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
  { id: 'open',          label: 'Open',          count: 3, color: DS.red    },
  { id: 'assigned',      label: 'Assigned',      count: 2, color: DS.yellow },
  { id: 'in_progress',   label: 'In Progress',   count: 2, color: DS.blue   },
  { id: 'waiting_parts', label: 'Waiting Parts', count: 1, color: DS.orange },
  { id: 'completed',     label: 'Completed',     count: 5, color: DS.green  },
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
  critical: DS.red,
  major:    DS.orange,
  minor:    DS.yellow,
}

// ─── RepairTicketsSummary ─────────────────────────────────────────────────────

export function RepairTicketsSummary() {
  const [selected, setSelected] = useState<UrgentTicket | null>(null)
  const totalActive = PIPELINE.filter(s => s.id !== 'completed').reduce((a, s) => a + s.count, 0)

  return (
    <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>

      {/* Header */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
        <SectionLabel label="Repair Tickets" count={totalActive} color={DS.purple} />
      </div>

      {/* Pipeline */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Pipeline
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PIPELINE.map(stage => (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, fontSize: 16, fontFamily: FONTS.display, color: stage.color, lineHeight: 1, textAlign: 'right', flexShrink: 0 }}>
                {stage.count}
              </div>
              <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', width: 90, flexShrink: 0 }}>
                {stage.label}
              </div>
              <div style={{ flex: 1, height: 4, background: 'var(--ds-bg-3)' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round((stage.count / PIPELINE_MAX) * 100)}%`,
                  background: stage.color,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 urgent tickets */}
      <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--ds-border)' }}>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Most Urgent
        </div>
      </div>
      {URGENT.map((t, i) => (
        <div
          key={t.id}
          onClick={() => setSelected(t)}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '9px 14px',
            borderBottom: i < URGENT.length - 1 ? '1px solid var(--ds-border)' : 'none',
            borderLeft: `2px solid ${SEV_COLOR[t.severity]}`,
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--ds-bg-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 10, fontFamily: FONTS.mono, color: DS.gold }}>{t.unit}</span>
              <StatusBadge label={t.severity.toUpperCase()} color={SEV_COLOR[t.severity]} small />
            </div>
            <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
              {t.issue}
            </div>
            <div style={{ fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.04em' }}>
              {t.assignedTo}
            </div>
          </div>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', flexShrink: 0, textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontFamily: FONTS.display, color: t.daysOpen >= 7 ? DS.red : 'var(--ds-dim)', lineHeight: 1 }}>
              {t.daysOpen}
            </div>
            <div style={{ fontSize: 8, letterSpacing: '0.04em' }}>days</div>
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
      <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        Ticket Info
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 1, background: 'var(--ds-border)', marginBottom: 16 }}>
        {INFO_ROWS.flatMap(row => [
          <div key={`${row.label}-l`} style={{ padding: '7px 10px', background: 'var(--ds-bg-1)', fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {row.label}
          </div>,
          <div key={`${row.label}-v`} style={{ padding: '7px 10px', background: 'var(--ds-bg-1)', fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-text)' }}>
            {row.value}
          </div>,
        ])}
      </div>

      {/* Description */}
      <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Description</div>
      <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-dim)', lineHeight: 1.6, padding: '8px 10px', border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)', marginBottom: 16 }}>
        {t.description}
      </div>

      {/* Parts */}
      {t.parts.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Parts Used</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--ds-border)' }}>
            {t.parts.map(p => (
              <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '1fr 32px 80px', gap: 1, background: 'transparent' }}>
                <div style={{ padding: '7px 10px', background: 'var(--ds-bg-1)', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>{p.name}</div>
                <div style={{ padding: '7px 6px', background: 'var(--ds-bg-1)', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textAlign: 'center' }}>×{p.qty}</div>
                <div style={{ padding: '7px 10px', background: 'var(--ds-bg-1)', fontSize: 10, fontFamily: FONTS.mono, color: DS.gold, textAlign: 'right' }}>
                  ${(p.qty * p.unitCost).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--ds-border)', marginBottom: 16 }}>
        {[
          { label: 'Labor',  value: t.laborCost,  color: DS.blue   },
          { label: 'Parts',  value: t.partsCost + t.parts.reduce((a, p) => a + p.qty * p.unitCost, 0), color: DS.orange },
          { label: 'Total',  value: totalCost,     color: DS.gold   },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--ds-bg-1)', padding: '10px 12px' }}>
            <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{c.label}</div>
            <div style={{ fontSize: c.label === 'Total' ? 18 : 14, fontFamily: FONTS.display, color: c.color }}>
              {c.value === 0 ? '—' : `$UY ${c.value.toLocaleString()}`}
            </div>
          </div>
        ))}
      </div>

      {/* Status history */}
      <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Status History</div>
      <div style={{ position: 'relative', paddingLeft: 20, marginBottom: 20 }}>
        <div style={{ position: 'absolute', left: 6, top: 6, bottom: 6, width: 1, background: 'var(--ds-border)' }} />
        {t.history.map((h, i) => {
          const stageColor = h.status === 'open' ? DS.red : h.status === 'in_progress' ? DS.blue : h.status === 'waiting_parts' ? DS.orange : h.status === 'assigned' ? DS.yellow : DS.green
          return (
            <div key={i} style={{ position: 'relative', marginBottom: i < t.history.length - 1 ? 12 : 0 }}>
              <div style={{ position: 'absolute', left: -20 + 6 - 4, top: 4, width: 8, height: 8, background: stageColor, zIndex: 1 }} />
              <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: stageColor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                {h.status.replace(/_/g, ' ')} · {h.date}
              </div>
              <div style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)', lineHeight: 1.5, marginBottom: 1 }}>
                {h.note}
              </div>
              <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>{h.actor}</div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <ActionButton label="Update Status" color={DS.blue}  onClick={() => {}} />
        <ActionButton label="Close Ticket"  color={DS.green} secondary onClick={onClose} />
      </div>
    </div>
  )
}
