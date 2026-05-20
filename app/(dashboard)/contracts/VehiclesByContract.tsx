'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatusBadge }  from '@/components/ui/StatusBadge'

// ─── Types + mock data ────────────────────────────────────────────────────────

type ContractKey = 'UTE' | 'OSE' | 'Antel' | 'Intendencia' | 'Unassigned'
type VehicleStatus = 'assigned' | 'in_maintenance' | 'available'

interface ContractVehicle {
  unit: string; plate: string; model: string; category: string
  branch: string; contract: ContractKey
  assignedDate: string; kmUsed: number; kmAllowance: number
  status: VehicleStatus
}

const VEHICLES: ContractVehicle[] = [
  // UTE — Midsize / Van
  { unit: 'U-0010', plate: 'GHT 1230', model: 'VW Passat 2022',   category: 'Midsize', branch: 'Loc A PDE', contract: 'UTE',    assignedDate: 'Jan 2024', kmUsed: 2480, kmAllowance: 3000, status: 'assigned'     },
  { unit: 'U-0011', plate: 'GHT 1231', model: 'VW Passat 2022',   category: 'Midsize', branch: 'Loc A PDE', contract: 'UTE',    assignedDate: 'Jan 2024', kmUsed: 1920, kmAllowance: 3000, status: 'assigned'     },
  { unit: 'U-0022', plate: 'GHT 1245', model: 'Kangoo 2021',      category: 'Van',     branch: 'Loc B MVD', contract: 'UTE',    assignedDate: 'Jan 2024', kmUsed: 3120, kmAllowance: 3000, status: 'assigned'     },
  { unit: 'U-0031', plate: 'GHT 1260', model: 'Kangoo 2022',      category: 'Van',     branch: 'Loc A PDE', contract: 'UTE',    assignedDate: 'Mar 2024', kmUsed: 2750, kmAllowance: 3000, status: 'assigned'     },
  { unit: 'U-0045', plate: 'GHT 1289', model: 'VW Passat 2023',   category: 'Midsize', branch: 'Loc B MVD', contract: 'UTE',    assignedDate: 'May 2024', kmUsed: 1840, kmAllowance: 3000, status: 'assigned'     },
  // OSE — SUV / Pickup
  { unit: 'U-0055', plate: 'SAX 4421', model: 'Duster 2021',      category: 'SUV',     branch: 'Loc C CLN', contract: 'OSE',    assignedDate: 'Mar 2023', kmUsed: 2310, kmAllowance: 2500, status: 'assigned'     },
  { unit: 'U-0060', plate: 'SAY 4430', model: 'Duster 2022',      category: 'SUV',     branch: 'Loc C CLN', contract: 'OSE',    assignedDate: 'Mar 2023', kmUsed: 1980, kmAllowance: 2500, status: 'assigned'     },
  { unit: 'U-0119', plate: 'SBD 7730', model: 'Frontier 2022',    category: 'Pickup',  branch: 'Loc C CLN', contract: 'OSE',    assignedDate: 'Mar 2023', kmUsed: 2750, kmAllowance: 2500, status: 'in_maintenance'},
  { unit: 'U-0120', plate: 'SBD 7731', model: 'Frontier 2022',    category: 'Pickup',  branch: 'Loc C CLN', contract: 'OSE',    assignedDate: 'Jun 2023', kmUsed: 2190, kmAllowance: 2500, status: 'assigned'     },
  // Antel — Economy / Compact
  { unit: 'U-0070', plate: 'SAZ 5510', model: 'Logan 2022',       category: 'Economy', branch: 'Loc B MVD', contract: 'Antel',  assignedDate: 'Aug 2023', kmUsed: 2020, kmAllowance: 2000, status: 'assigned'     },
  { unit: 'U-0075', plate: 'SAZ 7700', model: 'Yaris 2022',       category: 'Economy', branch: 'Loc D',     contract: 'Antel',  assignedDate: 'Sep 2023', kmUsed: 1560, kmAllowance: 2000, status: 'assigned'     },
  { unit: 'U-0087', plate: 'SBC 1243', model: 'Corolla 2023',     category: 'Compact', branch: 'Loc A PDE', contract: 'Antel',  assignedDate: 'Jun 2023', kmUsed: 1740, kmAllowance: 2000, status: 'assigned'     },
  { unit: 'U-0088', plate: 'SBC 7751', model: 'Corolla 2023',     category: 'Compact', branch: 'Loc A PDE', contract: 'Antel',  assignedDate: 'Jun 2023', kmUsed: 1850, kmAllowance: 2000, status: 'in_maintenance'},
  { unit: 'U-0092', plate: 'SBB 2210', model: 'Logan 2023',       category: 'Economy', branch: 'Loc C CLN', contract: 'Antel',  assignedDate: 'Oct 2023', kmUsed: 1390, kmAllowance: 2000, status: 'assigned'     },
  // Intendencia — Van / Commercial
  { unit: 'U-0033', plate: 'SAT 2290', model: 'SW4 2020',         category: 'Van',     branch: 'Loc B MVD', contract: 'Intendencia', assignedDate: 'Aug 2022', kmUsed: 2850, kmAllowance: 2000, status: 'in_maintenance'},
  { unit: 'U-0094', plate: 'SBB 6623', model: 'Kangoo 2021',      category: 'Van',     branch: 'Loc B MVD', contract: 'Intendencia', assignedDate: 'Aug 2022', kmUsed: 1980, kmAllowance: 2000, status: 'in_maintenance'},
  { unit: 'U-0095', plate: 'SBB 6624', model: 'Kangoo 2021',      category: 'Van',     branch: 'Loc D',     contract: 'Intendencia', assignedDate: 'Aug 2022', kmUsed: 2100, kmAllowance: 2000, status: 'assigned'     },
  { unit: 'U-0096', plate: 'SBB 6625', model: 'Kangoo 2022',      category: 'Commercial', branch: 'Loc B MVD', contract: 'Intendencia', assignedDate: 'Feb 2023', kmUsed: 1680, kmAllowance: 2000, status: 'assigned' },
  // Unassigned
  { unit: 'U-0142', plate: 'SBQ 3812', model: 'Hilux 2022',       category: 'Pickup',  branch: 'Loc A PDE', contract: 'Unassigned', assignedDate: '—', kmUsed: 0, kmAllowance: 0, status: 'in_maintenance'},
  { unit: 'U-0201', plate: 'SBF 9912', model: 'RAV4 2023',        category: 'SUV',     branch: 'Loc B MVD', contract: 'Unassigned', assignedDate: '—', kmUsed: 0, kmAllowance: 0, status: 'in_maintenance'},
]

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS: { id: ContractKey | 'all'; label: string }[] = [
  { id: 'all',          label: 'All' },
  { id: 'UTE',          label: 'UTE' },
  { id: 'OSE',          label: 'OSE' },
  { id: 'Antel',        label: 'Antel' },
  { id: 'Intendencia',  label: 'Intendencia' },
  { id: 'Unassigned',   label: 'Unassigned' },
]

const CONTRACT_COLOR: Record<ContractKey, string> = {
  UTE:          DS.green,
  OSE:          DS.yellow,
  Antel:        DS.blue,
  Intendencia:  DS.orange,
  Unassigned:   DS.slate,
}

const STATUS_COLOR: Record<VehicleStatus, string> = {
  assigned:       DS.green,
  in_maintenance: DS.orange,
  available:      DS.blue,
}

const STATUS_LABEL: Record<VehicleStatus, string> = {
  assigned:       'ASSIGNED',
  in_maintenance: 'MAINTENANCE',
  available:      'AVAILABLE',
}

// ─── Mileage progress bar ─────────────────────────────────────────────────────

function MileageBar({ used, allowance }: { used: number; allowance: number }) {
  if (allowance === 0) return <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>—</span>

  const pct    = Math.min((used / allowance) * 100, 100)
  const over   = used > allowance
  const color  = pct >= 90 ? DS.red : pct >= 75 ? DS.yellow : DS.green

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 60, height: 4, background: 'var(--ds-bg-3)', flexShrink: 0 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
      </div>
      <span style={{ fontSize: 9, fontFamily: FONTS.mono, color, whiteSpace: 'nowrap' }}>
        {used.toLocaleString()}{over ? ' ▲' : ''}
      </span>
    </div>
  )
}

// ─── Table style constants ────────────────────────────────────────────────────

const TH: React.CSSProperties = {
  position: 'sticky', top: 0, background: 'var(--ds-bg)',
  padding: '0 10px', height: 30,
  fontSize: 8, fontFamily: FONTS.mono,
  textTransform: 'uppercase', letterSpacing: '0.1em',
  color: 'var(--ds-muted)',
  borderBottom: '1px solid var(--ds-border)',
  whiteSpace: 'nowrap', textAlign: 'left',
}

const TD: React.CSSProperties = {
  padding: '0 10px',
  fontSize: 10, fontFamily: FONTS.mono,
  color: 'var(--ds-text)',
  whiteSpace: 'nowrap',
}

// ─── VehiclesByContract ───────────────────────────────────────────────────────

export function VehiclesByContract() {
  const [filter,     setFilter]     = useState<ContractKey | 'all'>('all')
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  const rows = filter === 'all' ? VEHICLES : VEHICLES.filter(v => v.contract === filter)

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <SectionLabel label="Vehículos por Contrato" count={rows.length} color={DS.blue} />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, borderBottom: '1px solid var(--ds-border)' }}>
        <div style={{ display: 'flex', flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {FILTER_TABS.map(f => {
            const active = filter === f.id
            const color  = f.id === 'all' ? DS.blue : CONTRACT_COLOR[f.id as ContractKey]
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                height: 34, padding: '0 14px',
                fontSize: 9, fontFamily: FONTS.mono, textTransform: 'uppercase', letterSpacing: '0.08em',
                color:      active ? color : 'var(--ds-dim)',
                background: 'transparent', border: 'none',
                borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
                cursor: 'pointer', flexShrink: 0,
              }}>
                {f.label}
                {f.id !== 'all' && (
                  <span style={{ marginLeft: 5, fontSize: 8, color: active ? color : 'var(--ds-muted)' }}>
                    {VEHICLES.filter(v => v.contract === f.id).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <span style={{ flexShrink: 0, fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', paddingRight: 4, letterSpacing: '0.06em' }}>
          Showing {rows.length} of {VEHICLES.length}
        </span>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid var(--ds-border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
          <thead>
            <tr>
              <th style={{ ...TH, width: 75 }}>Unit</th>
              <th style={{ ...TH, width: 92 }}>Plate</th>
              <th style={{ ...TH, width: 150 }}>Model</th>
              <th style={{ ...TH, width: 90 }}>Category</th>
              <th style={{ ...TH, width: 95 }}>Branch</th>
              <th style={{ ...TH, width: 110 }}>Contract</th>
              <th style={{ ...TH, width: 110 }}>Assigned</th>
              <th style={{ ...TH, width: 140 }}>Mileage Used</th>
              <th style={{ ...TH, width: 110 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v, i) => (
              <tr
                key={v.unit}
                style={{
                  height: 44,
                  background: hoveredRow === i ? 'var(--ds-bg-2)' : 'transparent',
                  borderBottom: '1px solid var(--ds-border)',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => window.open(`/fleet/${v.unit}`, '_self')}
              >
                <td style={{ ...TD, color: DS.gold }}>{v.unit}</td>
                <td style={{ ...TD }}>{v.plate}</td>
                <td style={{ ...TD }}>{v.model}</td>
                <td style={{ ...TD, color: 'var(--ds-dim)' }}>{v.category}</td>
                <td style={{ ...TD, color: 'var(--ds-dim)' }}>{v.branch}</td>
                <td style={{ ...TD }}>
                  {v.contract === 'Unassigned'
                    ? <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>—</span>
                    : <StatusBadge label={v.contract} color={CONTRACT_COLOR[v.contract]} small />
                  }
                </td>
                <td style={{ ...TD, color: 'var(--ds-muted)', fontSize: 9 }}>{v.assignedDate}</td>
                <td style={{ ...TD }}>
                  <MileageBar used={v.kmUsed} allowance={v.kmAllowance} />
                </td>
                <td style={{ ...TD }}>
                  <StatusBadge label={STATUS_LABEL[v.status]} color={STATUS_COLOR[v.status]} small />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 8, fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.06em' }}>
        Showing sample vehicles · Total contracted fleet: 306 vehicles · Click row to open vehicle file
      </div>
    </div>
  )
}
