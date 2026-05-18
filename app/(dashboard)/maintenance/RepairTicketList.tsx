'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import { ActionButton } from '@/components/ui/ActionButton'
import { DrillModal }   from '@/components/ui/DrillModal'
import { TicketDetail } from './RepairTicketsSummary'

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity    = 'critical' | 'major' | 'minor'
type TicketStatus = 'open' | 'assigned' | 'in_progress' | 'waiting_parts' | 'completed'

interface Ticket {
  id: string; unit: string; plate: string; model: string; branch: string
  issue: string; description: string
  severity: Severity; status: TicketStatus
  assignedTo: string; shop: string
  laborCost: number; partsCost: number
  daysOpen: number
  parts: { name: string; qty: number; unitCost: number }[]
  history: { status: TicketStatus; date: string; actor: string; note: string }[]
}

// ─── Mock data (10 tickets) ───────────────────────────────────────────────────

const ALL_TICKETS: Ticket[] = [
  {
    id: 'TK-0303', unit: 'U-0088', plate: 'SBC 7751', model: 'Toyota Corolla 2023', branch: 'Loc A PDE',
    issue: 'Front bumper collision', description: 'Low-speed collision, cracked bumper casing and mount. Client responsible — Res. RES-8810.',
    severity: 'critical', status: 'open', assignedTo: 'Unassigned', shop: '—',
    laborCost: 0, partsCost: 0, daysOpen: 1, parts: [],
    history: [{ status: 'open', date: '18 May 09:44', actor: 'José Ramírez', note: 'Damage recorded at return inspection' }],
  },
  {
    id: 'TK-0302', unit: 'U-0142', plate: 'SBQ 3812', model: 'Toyota Hilux 2022', branch: 'Loc A PDE',
    issue: 'Windshield — impact chip', description: 'Small chip center-right on windshield. Client responsible — Res. RES-8812.',
    severity: 'minor', status: 'assigned', assignedTo: 'AutoGlass PDE', shop: 'AutoGlass PDE',
    laborCost: 2400, partsCost: 0, daysOpen: 1, parts: [],
    history: [
      { status: 'open',     date: '18 May 09:02', actor: 'María González', note: 'Damage recorded at return inspection' },
      { status: 'assigned', date: '18 May 10:00', actor: 'Rocío Ávila',   note: 'Assigned to AutoGlass PDE' },
    ],
  },
  {
    id: 'TK-0301', unit: 'U-0055', plate: 'SAX 4421', model: 'Renault Duster 2021', branch: 'Loc A PDE',
    issue: 'Front left door — keying scratch', description: '12 cm keying scratch, primer exposed. Client responsible — Res. RES-8799.',
    severity: 'minor', status: 'in_progress', assignedTo: 'Pinturería Morales', shop: 'Pinturería Morales PDE',
    laborCost: 3200, partsCost: 1600, daysOpen: 4,
    parts: [{ name: 'Touch-up paint kit', qty: 1, unitCost: 1600 }],
    history: [
      { status: 'open',        date: '14 May 16:40', actor: 'Luis Fernández', note: 'Damage at return inspection' },
      { status: 'assigned',    date: '14 May 17:10', actor: 'Rocío Ávila',   note: 'Assigned to Pinturería Morales' },
      { status: 'in_progress', date: '15 May 10:00', actor: 'Pinturería',    note: 'Vehicle received, work started' },
    ],
  },
  {
    id: 'TK-0299', unit: 'U-0094', plate: 'SBB 6623', model: 'Renault Kangoo 2021', branch: 'Loc A PDE',
    issue: 'Rear window — full crack', description: 'Full crack across lower third. Structural integrity compromised. Client responsible — Res. RES-8803.',
    severity: 'major', status: 'in_progress', assignedTo: 'AutoGlass PDE', shop: 'AutoGlass PDE',
    laborCost: 8400, partsCost: 15700, daysOpen: 5,
    parts: [
      { name: 'Rear window glass — Kangoo 2021', qty: 1, unitCost: 14200 },
      { name: 'Window seal & adhesive kit',       qty: 1, unitCost: 1500  },
    ],
    history: [
      { status: 'open',        date: '13 May 16:40', actor: 'María González', note: 'Damage at return inspection' },
      { status: 'assigned',    date: '13 May 17:00', actor: 'Rocío Ávila',   note: 'Assigned to AutoGlass PDE'   },
      { status: 'in_progress', date: '14 May 09:30', actor: 'AutoGlass PDE', note: 'Vehicle received, work started' },
    ],
  },
  {
    id: 'TK-0297', unit: 'U-0033', plate: 'SAT 2290', model: 'Toyota SW4 2020', branch: 'Loc A PDE',
    issue: 'Hood + roof — hail damage', description: 'Approx. 18 impact dents from hailstorm on Ruta 9. Fleet responsible.',
    severity: 'major', status: 'waiting_parts', assignedTo: 'Pinturería Mendoza', shop: 'Pinturería Mendoza PDE',
    laborCost: 12000, partsCost: 26200, daysOpen: 17,
    parts: [
      { name: 'Hood panel replacement', qty: 1, unitCost: 18200 },
      { name: 'Roof repair & paint',    qty: 1, unitCost: 8000  },
    ],
    history: [
      { status: 'open',          date: '1 May 14:10', actor: 'María González', note: 'Hail damage at lot inspection'     },
      { status: 'assigned',      date: '1 May 15:00', actor: 'Rocío Ávila',   note: 'Assigned to Pinturería Mendoza'   },
      { status: 'in_progress',   date: '2 May 08:00', actor: 'Pinturería',    note: 'Assessment complete'               },
      { status: 'waiting_parts', date: '3 May 11:30', actor: 'Pinturería',    note: 'Hood panel ordered' },
    ],
  },
  {
    id: 'TK-0295', unit: 'U-0201', plate: 'SBF 9912', model: 'Toyota RAV4 2023', branch: 'Loc B MVD',
    issue: 'Engine warning — P0340 ECU fault', description: 'OBD fault code P0340 (camshaft position sensor). ECU module ordered from Toyota parts.',
    severity: 'critical', status: 'waiting_parts', assignedTo: 'Auto García', shop: 'Auto García MVD',
    laborCost: 4800, partsCost: 0, daysOpen: 12,
    parts: [{ name: 'Camshaft Position Sensor', qty: 1, unitCost: 12400 }],
    history: [
      { status: 'open',          date: '6 May 08:12', actor: 'Sistema (GPS)',  note: 'Engine warning via OBD telemetry' },
      { status: 'assigned',      date: '6 May 09:30', actor: 'Luis Fernández', note: 'Assigned to Auto García MVD'     },
      { status: 'in_progress',   date: '7 May 10:00', actor: 'Auto García',   note: 'Diagnosis: P0340 confirmed'       },
      { status: 'waiting_parts', date: '8 May 14:22', actor: 'Auto García',   note: 'Sensor ordered — ETA 5–7 days'   },
    ],
  },
  {
    id: 'TK-0291', unit: 'U-0142', plate: 'SBQ 3812', model: 'Toyota Hilux 2022', branch: 'Loc A PDE',
    issue: 'Windshield — road debris chip (prior)', description: 'Prior chip repair. Completed Apr 2026.',
    severity: 'minor', status: 'completed', assignedTo: 'AutoGlass PDE', shop: 'AutoGlass PDE',
    laborCost: 4500, partsCost: 0, daysOpen: 40, parts: [],
    history: [
      { status: 'open',      date: '8 Apr 09:00',  actor: 'María González', note: 'Damage at return inspection RES-7190' },
      { status: 'assigned',  date: '8 Apr 10:00',  actor: 'Rocío Ávila',   note: 'Assigned to AutoGlass PDE'            },
      { status: 'completed', date: '10 Apr 14:00', actor: 'AutoGlass PDE', note: 'Repair complete, vehicle returned'     },
    ],
  },
  {
    id: 'TK-0289', unit: 'U-0119', plate: 'SBD 7730', model: 'Nissan Frontier 2022', branch: 'Loc C CLN',
    issue: 'Rear left door — parking dent', description: 'Dent, no paint damage. PDR repair.',
    severity: 'minor', status: 'completed', assignedTo: 'Pinturería Morales', shop: 'Pinturería Morales PDE',
    laborCost: 3200, partsCost: 0, daysOpen: 9, parts: [],
    history: [
      { status: 'open',      date: '9 May 15:00', actor: 'María González', note: 'Damage at return inspection RES-8790' },
      { status: 'assigned',  date: '9 May 16:00', actor: 'Rocío Ávila',   note: 'Assigned to Pinturería Morales'       },
      { status: 'completed', date: '12 May 11:00',actor: 'Pinturería',    note: 'PDR complete, no paint work needed'   },
    ],
  },
  {
    id: 'TK-0285', unit: 'U-0071', plate: 'SAZ 6678', model: 'VW Amarok 2023', branch: 'Loc A PDE',
    issue: 'Transmission fluid leak', description: 'Rear differential seal leak. Full fluid replacement and seal kit.',
    severity: 'major', status: 'completed', assignedTo: 'Workshop PDE', shop: 'Workshop PDE',
    laborCost: 7200, partsCost: 11800, daysOpen: 28,
    parts: [
      { name: 'Differential seal kit', qty: 1, unitCost: 4800 },
      { name: 'Transmission fluid 5L', qty: 2, unitCost: 3500 },
    ],
    history: [
      { status: 'open',        date: '20 Apr 08:00', actor: 'Sistema (GPS)',  note: 'Oil pressure warning — diff leak' },
      { status: 'assigned',    date: '20 Apr 09:00', actor: 'Luis Fernández', note: 'Assigned to Workshop PDE'         },
      { status: 'in_progress', date: '21 Apr 08:30', actor: 'Workshop PDE',  note: 'Diagnosis confirmed, work started' },
      { status: 'completed',   date: '23 Apr 15:00', actor: 'Workshop PDE',  note: 'Repair complete, road test passed' },
    ],
  },
  {
    id: 'TK-0280', unit: 'U-0087', plate: 'SBC 1243', model: 'Toyota Corolla 2023', branch: 'Loc A PDE',
    issue: 'AC cabin filter replacement', description: 'Routine cabin air filter replacement at 30,000 km service.',
    severity: 'minor', status: 'completed', assignedTo: 'Workshop PDE', shop: 'Workshop PDE',
    laborCost: 800, partsCost: 1200, daysOpen: 45,
    parts: [{ name: 'Cabin air filter — Corolla 2023', qty: 1, unitCost: 1200 }],
    history: [
      { status: 'open',      date: '3 Apr 09:00',  actor: 'Luis Fernández', note: 'Added during 30k service'   },
      { status: 'completed', date: '3 Apr 14:00',  actor: 'Workshop PDE',  note: 'Filter replaced, AC checked' },
    ],
  },
]

// ─── Colors + labels ──────────────────────────────────────────────────────────

const SEV_COLOR: Record<Severity, string> = {
  critical: DS.red,
  major:    DS.orange,
  minor:    DS.yellow,
}

const STATUS_COLOR: Record<TicketStatus, string> = {
  open:          DS.red,
  assigned:      DS.yellow,
  in_progress:   DS.blue,
  waiting_parts: DS.orange,
  completed:     DS.green,
}

const STATUS_LABEL: Record<TicketStatus, string> = {
  open:          'OPEN',
  assigned:      'ASSIGNED',
  in_progress:   'IN PROGRESS',
  waiting_parts: 'WAIT PARTS',
  completed:     'COMPLETED',
}

// ─── Filter options ───────────────────────────────────────────────────────────

const STATUS_OPTS: { value: TicketStatus | 'all'; label: string }[] = [
  { value: 'all',          label: 'All Status'     },
  { value: 'open',         label: 'Open'           },
  { value: 'assigned',     label: 'Assigned'       },
  { value: 'in_progress',  label: 'In Progress'    },
  { value: 'waiting_parts',label: 'Waiting Parts'  },
  { value: 'completed',    label: 'Completed'      },
]

const BRANCH_OPTS = [
  { value: 'all',   label: 'All Branches' },
  { value: 'Loc A PDE', label: 'Loc A'   },
  { value: 'Loc B MVD', label: 'Loc B'   },
  { value: 'Loc C CLN', label: 'Loc C'   },
]

const SEV_OPTS: { value: Severity | 'all'; label: string }[] = [
  { value: 'all',      label: 'All Severity' },
  { value: 'critical', label: 'Critical'     },
  { value: 'major',    label: 'Major'        },
  { value: 'minor',    label: 'Minor'        },
]

// ─── Table column widths ──────────────────────────────────────────────────────

const COL_WIDTHS = {
  id:         88,
  unit:       72,
  plate:      90,
  issue:      0,    // flex fill
  severity:   82,
  status:     110,
  assigned:   140,
  shop:       150,
  cost:       90,
  days:       60,
  actions:    140,
}

const TH: React.CSSProperties = {
  position: 'sticky', top: 0, background: 'var(--ds-bg)',
  padding: '0 10px', height: 32,
  fontSize: 8, fontFamily: FONTS.mono,
  textTransform: 'uppercase', letterSpacing: '0.1em',
  color: 'var(--ds-muted)',
  borderBottom: '1px solid var(--ds-border)',
  whiteSpace: 'nowrap', userSelect: 'none',
  textAlign: 'left',
}

const TD: React.CSSProperties = {
  padding: '0 10px',
  fontSize: 11, fontFamily: FONTS.mono,
  color: 'var(--ds-text)',
  whiteSpace: 'nowrap',
}

// ─── RepairTicketList ─────────────────────────────────────────────────────────

export function RepairTicketList() {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [sevFilter,    setSevFilter]    = useState<Severity | 'all'>('all')
  const [selected,     setSelected]     = useState<Ticket | null>(null)
  const [hoveredRow,   setHoveredRow]   = useState<number | null>(null)

  const [tickets, setTickets] = useState<Ticket[]>(ALL_TICKETS)

  const rows = tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (branchFilter !== 'all' && t.branch !== branchFilter) return false
    if (sevFilter    !== 'all' && t.severity !== sevFilter)  return false
    return true
  })

  function closeTicket(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t))
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <SectionLabel label="All Repair Tickets" count={tickets.filter(t => t.status !== 'completed').length} color={DS.purple} />
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {/* Status filter */}
        <FilterGroup
          options={STATUS_OPTS}
          active={statusFilter}
          color={DS.purple}
          onChange={v => setStatusFilter(v as TicketStatus | 'all')}
        />
        {/* Branch filter */}
        <FilterGroup
          options={BRANCH_OPTS}
          active={branchFilter}
          color={DS.blue}
          onChange={setBranchFilter}
        />
        {/* Severity filter */}
        <FilterGroup
          options={SEV_OPTS}
          active={sevFilter}
          color={DS.orange}
          onChange={v => setSevFilter(v as Severity | 'all')}
        />
        <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', alignSelf: 'center', marginLeft: 4, letterSpacing: '0.06em' }}>
          {rows.length} ticket{rows.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid var(--ds-border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
          <thead>
            <tr>
              <th style={{ ...TH, width: COL_WIDTHS.id }}>Ticket ID</th>
              <th style={{ ...TH, width: COL_WIDTHS.unit }}>Unit</th>
              <th style={{ ...TH, width: COL_WIDTHS.plate }}>Plate</th>
              <th style={{ ...TH }}>Issue</th>
              <th style={{ ...TH, width: COL_WIDTHS.severity }}>Severity</th>
              <th style={{ ...TH, width: COL_WIDTHS.status }}>Status</th>
              <th style={{ ...TH, width: COL_WIDTHS.assigned }}>Assigned To</th>
              <th style={{ ...TH, width: COL_WIDTHS.shop }}>Shop</th>
              <th style={{ ...TH, width: COL_WIDTHS.cost, textAlign: 'right' }}>Cost</th>
              <th style={{ ...TH, width: COL_WIDTHS.days, textAlign: 'right' }}>Days</th>
              <th style={{ ...TH, width: COL_WIDTHS.actions }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => {
              const totalCost = t.laborCost + t.partsCost + t.parts.reduce((a, p) => a + p.qty * p.unitCost, 0)
              return (
                <tr
                  key={t.id}
                  style={{
                    height: 44,
                    background: hoveredRow === i ? 'var(--ds-bg-2)' : 'transparent',
                    borderBottom: '1px solid var(--ds-border)',
                    borderLeft: `2px solid ${SEV_COLOR[t.severity]}`,
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => setSelected(t)}
                >
                  <td style={{ ...TD, color: DS.purple }}>{t.id}</td>
                  <td style={{ ...TD, color: DS.gold }}>{t.unit}</td>
                  <td style={{ ...TD }}>{t.plate}</td>
                  <td style={{ ...TD, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.issue}</td>
                  <td style={{ ...TD }}>
                    <StatusBadge label={t.severity.toUpperCase()} color={SEV_COLOR[t.severity]} small />
                  </td>
                  <td style={{ ...TD }}>
                    <StatusBadge label={STATUS_LABEL[t.status]} color={STATUS_COLOR[t.status]} small />
                  </td>
                  <td style={{ ...TD, color: 'var(--ds-dim)', fontSize: 10 }}>{t.assignedTo}</td>
                  <td style={{ ...TD, color: 'var(--ds-dim)', fontSize: 10 }}>{t.shop || '—'}</td>
                  <td style={{ ...TD, textAlign: 'right', color: totalCost > 0 ? DS.gold : 'var(--ds-muted)' }}>
                    {totalCost > 0 ? `$UY ${totalCost.toLocaleString()}` : '—'}
                  </td>
                  <td style={{ ...TD, textAlign: 'right', color: t.daysOpen >= 7 ? DS.red : 'var(--ds-dim)' }}>
                    {t.daysOpen}
                  </td>
                  <td style={{ ...TD }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <SmallBtn label="VIEW"   color={DS.gold}   onClick={(e) => { e.stopPropagation(); setSelected(t) }} />
                      {t.status !== 'completed' && (
                        <SmallBtn label="CLOSE"  color={DS.green}  onClick={(e) => closeTicket(t.id, e)} />
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} style={{ padding: '28px 16px', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
                  No tickets match these filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <DrillModal
          title={`${selected.id} · ${selected.unit}`}
          subtitle={`${selected.issue} · ${selected.branch}`}
          color={SEV_COLOR[selected.severity]}
          onClose={() => setSelected(null)}
        >
          <TicketDetail ticket={selected as Parameters<typeof TicketDetail>[0]['ticket']} onClose={() => setSelected(null)} />
        </DrillModal>
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SmallBtn({ label, color, onClick }: { label: string; color: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button onClick={onClick} style={{
      height: 22, padding: '0 8px',
      fontSize: 8, fontFamily: FONTS.mono, textTransform: 'uppercase', letterSpacing: '0.08em',
      color, background: `${color}14`, border: `1px solid ${color}54`,
      borderRadius: 0, cursor: 'pointer',
    }}>
      {label}
    </button>
  )
}

function FilterGroup<T extends string>({
  options, active, color, onChange,
}: {
  options: { value: T; label: string }[]
  active: T; color: string
  onChange: (v: T) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 1, background: 'var(--ds-border)' }}>
      {options.map(o => {
        const isActive = active === o.value
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            height: 28, padding: '0 10px',
            fontSize: 9, fontFamily: FONTS.mono, textTransform: 'uppercase', letterSpacing: '0.07em',
            color:      isActive ? color : 'var(--ds-dim)',
            background: isActive ? `${color}14` : 'var(--ds-bg-1)',
            border:     `1px solid ${isActive ? color : 'var(--ds-border)'}`,
            cursor: 'pointer',
          }}>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
