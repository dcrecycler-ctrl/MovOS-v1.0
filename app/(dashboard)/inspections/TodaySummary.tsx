'use client'

import { DS, FONTS } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatusBadge }  from '@/components/ui/StatusBadge'

// ─── Types + mock data ────────────────────────────────────────────────────────

type InspType   = 'pickup' | 'return' | 'periodic'
type InspOutcome = 'clean' | 'damage'

interface CompletedInsp {
  id: string; unit: string; plate: string
  type: InspType; inspector: string; time: string; outcome: InspOutcome
}

const STATS = [
  { label: 'Total Today',  value: '12',  color: DS.gold   },
  { label: 'Completed',    value: '8',   color: DS.green  },
  { label: 'Pending',      value: '4',   color: DS.yellow },
  { label: 'Damage Found', value: '2',   color: DS.red    },
  { label: 'Avg Time',     value: '18m', color: DS.blue   },
  { label: 'Clean Rate',   value: '75%', color: DS.green  },
]

const RECENT: CompletedInsp[] = [
  { id: 'c1', unit: 'U-0033', plate: 'SAT 2290', type: 'periodic', inspector: 'María González', time: '08:12', outcome: 'clean'  },
  { id: 'c2', unit: 'U-0205', plate: 'SBH 1102', type: 'return',   inspector: 'José Ramírez',   time: '08:41', outcome: 'damage' },
  { id: 'c3', unit: 'U-0071', plate: 'SAZ 6678', type: 'pickup',   inspector: 'María González', time: '09:05', outcome: 'clean'  },
  { id: 'c4', unit: 'U-0156', plate: 'SBE 3390', type: 'return',   inspector: 'Luis Fernández', time: '09:22', outcome: 'clean'  },
  { id: 'c5', unit: 'U-0088', plate: 'SBC 7751', type: 'pickup',   inspector: 'José Ramírez',   time: '09:44', outcome: 'damage' },
]

const TYPE_COLOR: Record<InspType, string> = {
  pickup:   DS.green,
  return:   DS.orange,
  periodic: DS.purple,
}

// ─── TodaySummary ─────────────────────────────────────────────────────────────

export function TodaySummary() {
  return (
    <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>

      {/* Header */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
        <SectionLabel label="Today's Summary" color={DS.green} />
      </div>

      {/* Stats grid — 3 columns × 2 rows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--ds-border)', borderBottom: '1px solid var(--ds-border)' }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: 'var(--ds-bg-1)', padding: '14px 16px' }}>
            <div style={{ fontSize: 26, fontFamily: FONTS.display, color: s.color, lineHeight: 1, marginBottom: 4 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Section label */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--ds-border)' }}>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Last 5 Completed
        </div>
      </div>

      {/* Recent list */}
      {RECENT.map((insp, i) => (
        <div key={insp.id} style={{
          display: 'grid', gridTemplateColumns: '72px 88px 72px 1fr auto',
          alignItems: 'center', gap: '0 10px',
          padding: '9px 14px',
          borderBottom: i < RECENT.length - 1 ? '1px solid var(--ds-border)' : 'none',
          borderLeft: `2px solid ${insp.outcome === 'damage' ? DS.red : 'transparent'}`,
        }}>
          <span style={{ fontSize: 11, fontFamily: FONTS.mono, color: DS.gold }}>
            {insp.unit}
          </span>
          <span style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>
            {insp.plate}
          </span>
          <StatusBadge label={insp.type.toUpperCase()} color={TYPE_COLOR[insp.type]} small />
          <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {insp.inspector}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>
              {insp.time}
            </span>
            <StatusBadge
              label={insp.outcome === 'damage' ? 'DMG' : 'OK'}
              color={insp.outcome === 'damage' ? DS.red : DS.green}
              small
            />
          </div>
        </div>
      ))}
    </div>
  )
}
