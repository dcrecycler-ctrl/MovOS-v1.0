'use client'

import { B } from '@/lib/tokens'
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
  { label: 'Total Hoy',     value: '12',  color: B.amber },
  { label: 'Completadas',   value: '8',   color: B.green  },
  { label: 'Pendientes',    value: '4',   color: B.amber  },
  { label: 'Con Daño',      value: '2',   color: B.rose   },
  { label: 'Tiempo Prom.',  value: '18m', color: B.blue   },
  { label: 'Sin Daño',      value: '75%', color: B.green  },
]

const RECENT: CompletedInsp[] = [
  { id: 'c1', unit: 'U-0033', plate: 'SAT 2290', type: 'periodic', inspector: 'María González', time: '08:12', outcome: 'clean'  },
  { id: 'c2', unit: 'U-0205', plate: 'SBH 1102', type: 'return',   inspector: 'José Ramírez',   time: '08:41', outcome: 'damage' },
  { id: 'c3', unit: 'U-0071', plate: 'SAZ 6678', type: 'pickup',   inspector: 'María González', time: '09:05', outcome: 'clean'  },
  { id: 'c4', unit: 'U-0156', plate: 'SBE 3390', type: 'return',   inspector: 'Luis Fernández', time: '09:22', outcome: 'clean'  },
  { id: 'c5', unit: 'U-0088', plate: 'SBC 7751', type: 'pickup',   inspector: 'José Ramírez',   time: '09:44', outcome: 'damage' },
]

const TYPE_COLOR: Record<InspType, string> = {
  pickup:   B.green,
  return:   B.amber,
  periodic: B.lilac,
}

// ─── TodaySummary ─────────────────────────────────────────────────────────────

export function TodaySummary() {
  return (
    <div style={{ background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`, overflow: 'hidden', boxShadow: B.shadowSm }}>

      {/* Header */}
      <div style={{ padding: '18px 20px 16px', borderBottom: `1px solid ${B.hairline}` }}>
        <SectionLabel label="Resumen del Día" color={B.green} />
      </div>

      {/* Stats grid — 3 columns × 2 rows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${B.hairline}` }}>
        {STATS.map((s, idx) => (
          <div key={s.label} style={{
            background: B.surface,
            padding: '16px 18px',
            borderRight: (idx + 1) % 3 !== 0 ? `1px solid ${B.hairline}` : 'none',
            borderTop: idx >= 3 ? `1px solid ${B.hairline}` : 'none',
          }}>
            <div style={{ fontSize: 28, fontFamily: 'var(--font-inter)', fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 4, letterSpacing: '-0.02em' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, fontWeight: 500 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Section label */}
      <div style={{ padding: '12px 20px', borderBottom: `1px solid ${B.hairline}` }}>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Últimas 5 Completadas
        </span>
      </div>

      {/* Recent list */}
      {RECENT.map((insp, i) => (
        <div key={insp.id} style={{
          display: 'grid', gridTemplateColumns: '72px 90px 80px 1fr auto',
          alignItems: 'center', gap: '0 10px',
          padding: '10px 20px',
          borderBottom: i < RECENT.length - 1 ? `1px solid ${B.hairline}` : 'none',
          borderLeft: `2px solid ${insp.outcome === 'damage' ? B.rose : 'transparent'}`,
          background: B.surface,
        }}>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-dm-mono)', fontWeight: 700, color: B.amber }}>
            {insp.unit}
          </span>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-dm-mono)', color: B.ink2 }}>
            {insp.plate}
          </span>
          <StatusBadge label={insp.type.toUpperCase()} color={TYPE_COLOR[insp.type]} small />
          <span style={{ fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {insp.inspector}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-dm-mono)', color: B.ink3 }}>
              {insp.time}
            </span>
            <StatusBadge
              label={insp.outcome === 'damage' ? 'DAÑO' : 'OK'}
              color={insp.outcome === 'damage' ? B.rose : B.green}
              small
            />
          </div>
        </div>
      ))}
    </div>
  )
}
