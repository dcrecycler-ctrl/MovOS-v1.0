'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import { ActionButton } from '@/components/ui/ActionButton'

// ─── Types + mock data ────────────────────────────────────────────────────────

type ContractStatus = 'active' | 'expiring'

interface AssignedVehicle {
  unit: string; plate: string; model: string; category: string; branch: string; since: string
}

interface Contract {
  id: string; client: string; type: string; vehicles: number
  categories: string; branches: string; period: string
  status: ContractStatus; daysRemaining: number
  monthlyRate: number; kmAllowance: number
  color: string; assigned: AssignedVehicle[]
}

const CONTRACTS: Contract[] = [
  {
    id: 'ute', client: 'UTE', type: 'Corporate', vehicles: 87,
    categories: 'Midsize / Van', branches: 'Loc A PDE + Loc B MVD',
    period: 'Jan 2024 → Mar 2027',
    status: 'active', daysRemaining: 287, monthlyRate: 18500, kmAllowance: 3000,
    color: DS.green,
    assigned: [
      { unit: 'U-0010', plate: 'GHT 1230', model: 'VW Passat 2022',  category: 'Midsize', branch: 'Loc A PDE', since: 'Jan 2024' },
      { unit: 'U-0011', plate: 'GHT 1231', model: 'VW Passat 2022',  category: 'Midsize', branch: 'Loc A PDE', since: 'Jan 2024' },
      { unit: 'U-0022', plate: 'GHT 1245', model: 'Kangoo 2021',     category: 'Van',     branch: 'Loc B MVD', since: 'Jan 2024' },
      { unit: 'U-0031', plate: 'GHT 1260', model: 'Kangoo 2022',     category: 'Van',     branch: 'Loc A PDE', since: 'Mar 2024' },
    ],
  },
  {
    id: 'ose', client: 'OSE', type: 'Government', vehicles: 64,
    categories: 'SUV / Pickup', branches: 'Loc C CLN',
    period: 'Mar 2023 → Jun 2026',
    status: 'expiring', daysRemaining: 42, monthlyRate: 14200, kmAllowance: 2500,
    color: DS.yellow,
    assigned: [
      { unit: 'U-0055', plate: 'SAX 4421', model: 'Duster 2021',    category: 'SUV',    branch: 'Loc C CLN', since: 'Mar 2023' },
      { unit: 'U-0060', plate: 'SAY 4430', model: 'Duster 2022',    category: 'SUV',    branch: 'Loc C CLN', since: 'Mar 2023' },
      { unit: 'U-0119', plate: 'SBD 7730', model: 'Frontier 2022',  category: 'Pickup', branch: 'Loc C CLN', since: 'Mar 2023' },
      { unit: 'U-0120', plate: 'SBD 7731', model: 'Frontier 2022',  category: 'Pickup', branch: 'Loc C CLN', since: 'Jun 2023' },
    ],
  },
  {
    id: 'antel', client: 'Antel', type: 'Corporate', vehicles: 112,
    categories: 'Economy / Compact', branches: 'All locations',
    period: 'Jun 2023 → Sep 2027',
    status: 'active', daysRemaining: 481, monthlyRate: 22400, kmAllowance: 2000,
    color: DS.green,
    assigned: [
      { unit: 'U-0087', plate: 'SBC 1243', model: 'Corolla 2023',  category: 'Compact', branch: 'Loc A PDE', since: 'Jun 2023' },
      { unit: 'U-0088', plate: 'SBC 7751', model: 'Corolla 2023',  category: 'Compact', branch: 'Loc A PDE', since: 'Jun 2023' },
      { unit: 'U-0070', plate: 'SAZ 5510', model: 'Logan 2022',    category: 'Economy', branch: 'Loc B MVD', since: 'Aug 2023' },
      { unit: 'U-0075', plate: 'SAZ 7700', model: 'Yaris 2022',    category: 'Economy', branch: 'All',       since: 'Sep 2023' },
    ],
  },
  {
    id: 'intendencia', client: 'Intendencia', type: 'Government', vehicles: 43,
    categories: 'Van / Commercial', branches: 'Loc B MVD + Loc D',
    period: 'Aug 2022 → Jun 2026',
    status: 'expiring', daysRemaining: 28, monthlyRate: 8900, kmAllowance: 2000,
    color: DS.yellow,
    assigned: [
      { unit: 'U-0033', plate: 'SAT 2290', model: 'SW4 2020',    category: 'Van',        branch: 'Loc B MVD', since: 'Aug 2022' },
      { unit: 'U-0094', plate: 'SBB 6623', model: 'Kangoo 2021', category: 'Van',        branch: 'Loc B MVD', since: 'Aug 2022' },
      { unit: 'U-0095', plate: 'SBB 6624', model: 'Kangoo 2021', category: 'Van',        branch: 'Loc D',     since: 'Aug 2022' },
      { unit: 'U-0096', plate: 'SBB 6625', model: 'Kangoo 2022', category: 'Commercial', branch: 'Loc B MVD', since: 'Feb 2023' },
    ],
  },
]

// ─── LongTermContracts ────────────────────────────────────────────────────────

export function LongTermContracts() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
        <SectionLabel label="Long-Term Contracts" count={CONTRACTS.length} color={DS.gold} />
      </div>

      {CONTRACTS.map((c, i) => (
        <ContractCard
          key={c.id}
          contract={c}
          isLast={i === CONTRACTS.length - 1}
          expanded={expanded === c.id}
          onToggle={() => setExpanded(prev => prev === c.id ? null : c.id)}
        />
      ))}
    </div>
  )
}

// ─── ContractCard ─────────────────────────────────────────────────────────────

function ContractCard({
  contract: c, isLast, expanded, onToggle,
}: {
  contract: Contract; isLast: boolean; expanded: boolean; onToggle: () => void
}) {
  return (
    <div style={{
      borderBottom: isLast && !expanded ? 'none' : '1px solid var(--ds-border)',
      borderLeft: `2px solid ${c.color}`,
    }}>
      {/* Main card body */}
      <div style={{ padding: '14px 16px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 36, fontFamily: FONTS.display, color: c.color, lineHeight: 1 }}>
              {c.vehicles}
            </span>
            <div>
              <div style={{ fontSize: 16, fontFamily: FONTS.display, color: 'var(--ds-text)', letterSpacing: '0.04em', lineHeight: 1 }}>
                {c.client}
              </div>
              <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.06em', marginTop: 2 }}>
                {c.type} · {c.categories}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <StatusBadge
              label={c.status === 'expiring' ? `EXPIRING · ${c.daysRemaining}d` : `ACTIVE · ${c.daysRemaining}d`}
              color={c.color}
              small
            />
            {c.status === 'expiring' && (
              <StatusBadge label="⚠ RENEWAL ALERT" color={DS.orange} small />
            )}
          </div>
        </div>

        {/* Detail row */}
        <div className="grid grid-cols-1 gap-px mb-3 md:grid-cols-3" style={{ background: 'var(--ds-border)' }}>
          {[
            { label: 'Period',    value: c.period },
            { label: 'Branches',  value: c.branches },
            { label: 'Monthly',   value: `$${c.monthlyRate.toLocaleString()}` },
          ].map(row => (
            <div key={row.label} style={{ background: 'var(--ds-bg-2)', padding: '7px 10px' }}>
              <div style={{ fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>
                {row.label}
              </div>
              <div style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-text)' }}>
                {row.value}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <ActionButton label="View Vehicles" color={DS.blue}   onClick={onToggle} />
          <ActionButton label="Edit"          color={DS.gold}   secondary onClick={() => {}} />
          <ActionButton label="Renew"         color={c.status === 'expiring' ? DS.orange : DS.gold} secondary onClick={() => {}} />
          <ActionButton label="Export"        color={DS.slate}  secondary onClick={() => {}} />
        </div>
      </div>

      {/* Expanded vehicle list */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--ds-border)', background: 'var(--ds-bg-2)' }}>
          <div style={{ padding: '8px 16px 6px' }}>
            <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Showing 4 of {c.vehicles} assigned vehicles · Mileage allowance: {c.kmAllowance.toLocaleString()} km/mo
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '72px 88px 1fr 90px 95px 70px', gap: 0, background: 'var(--ds-border)', minWidth: 480 }}>
            {/* Header */}
            {['Unit', 'Plate', 'Model', 'Category', 'Branch', 'Since'].map(h => (
              <div key={h} style={{ padding: '5px 10px', background: 'var(--ds-bg-1)', fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                {h}
              </div>
            ))}
            {/* Vehicle rows */}
            {c.assigned.map(v => (
              <>
                <div key={`${v.unit}-u`} style={{ padding: '7px 10px', background: 'var(--ds-bg-1)', fontSize: 10, fontFamily: FONTS.mono, color: DS.gold }}>{v.unit}</div>
                <div key={`${v.unit}-p`} style={{ padding: '7px 10px', background: 'var(--ds-bg-1)', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>{v.plate}</div>
                <div key={`${v.unit}-m`} style={{ padding: '7px 10px', background: 'var(--ds-bg-1)', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-text)' }}>{v.model}</div>
                <div key={`${v.unit}-c`} style={{ padding: '7px 10px', background: 'var(--ds-bg-1)', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>{v.category}</div>
                <div key={`${v.unit}-b`} style={{ padding: '7px 10px', background: 'var(--ds-bg-1)', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>{v.branch}</div>
                <div key={`${v.unit}-s`} style={{ padding: '7px 10px', background: 'var(--ds-bg-1)', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>{v.since}</div>
              </>
            ))}
            {/* "More" row */}
            <div style={{ gridColumn: '1 / -1', padding: '6px 10px', background: 'var(--ds-bg-1)', fontSize: 9, fontFamily: FONTS.mono, color: DS.blue, letterSpacing: '0.04em', cursor: 'pointer' }}>
              View all {c.vehicles} vehicles in contract →
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  )
}
