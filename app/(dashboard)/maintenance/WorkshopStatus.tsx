'use client'

import { DS, FONTS } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatusBadge }  from '@/components/ui/StatusBadge'

// ─── Types + mock data ────────────────────────────────────────────────────────

type WorkshopType = 'internal' | 'dealer' | 'specialist'

interface Workshop {
  id: string; name: string; city: string; type: WorkshopType
  waiting: number; inProgress: number; inspected: number; cleared: number
  avgDays: number; techs: number | null
}

const WORKSHOPS: Workshop[] = [
  {
    id: 'w1', name: 'Workshop PDE', city: 'Punta del Este', type: 'internal',
    waiting: 1, inProgress: 3, inspected: 1, cleared: 0,
    avgDays: 3.2, techs: 3,
  },
  {
    id: 'w2', name: 'Toyota PDE', city: 'Punta del Este', type: 'dealer',
    waiting: 0, inProgress: 4, inspected: 0, cleared: 0,
    avgDays: 5.1, techs: null,
  },
  {
    id: 'w3', name: 'AutoGlass PDE', city: 'Punta del Este', type: 'specialist',
    waiting: 0, inProgress: 2, inspected: 0, cleared: 0,
    avgDays: 1.8, techs: null,
  },
  {
    id: 'w4', name: 'Pinturería Mendoza', city: 'Punta del Este', type: 'specialist',
    waiting: 0, inProgress: 1, inspected: 0, cleared: 0,
    avgDays: 7.4, techs: null,
  },
]

const TYPE_COLOR: Record<WorkshopType, string> = {
  internal:   DS.gold,
  dealer:     DS.blue,
  specialist: DS.purple,
}

const STACKED_SEGMENTS = [
  { key: 'waiting',    label: 'Waiting',    color: DS.yellow },
  { key: 'inProgress', label: 'In Progress', color: DS.blue  },
  { key: 'inspected',  label: 'Inspected',  color: DS.green  },
  { key: 'cleared',    label: 'Cleared',    color: DS.slate  },
] as const

// ─── WorkshopStatus ───────────────────────────────────────────────────────────

export function WorkshopStatus() {
  const totalVehicles = WORKSHOPS.reduce((a, w) => a + w.waiting + w.inProgress + w.inspected + w.cleared, 0)

  return (
    <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>

      {/* Header */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
        <SectionLabel label="Workshop Load" count={totalVehicles} color={DS.gold} />
      </div>

      {/* Workshop cards */}
      {WORKSHOPS.map((w, i) => {
        const total    = w.waiting + w.inProgress + w.inspected + w.cleared
        const segments = [
          { ...STACKED_SEGMENTS[0], count: w.waiting    },
          { ...STACKED_SEGMENTS[1], count: w.inProgress },
          { ...STACKED_SEGMENTS[2], count: w.inspected  },
          { ...STACKED_SEGMENTS[3], count: w.cleared    },
        ].filter(s => s.count > 0)

        return (
          <div key={w.id} style={{
            padding: '12px 14px',
            borderBottom: i < WORKSHOPS.length - 1 ? '1px solid var(--ds-border)' : 'none',
          }}>
            {/* Workshop name + type badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-text)', marginBottom: 2 }}>
                  {w.name}
                </div>
                <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.04em' }}>
                  {w.city}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <StatusBadge label={w.type.toUpperCase()} color={TYPE_COLOR[w.type]} small />
                {w.techs !== null && (
                  <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>
                    {w.techs} techs
                  </span>
                )}
              </div>
            </div>

            {/* Large vehicle count */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 32, fontFamily: FONTS.display, color: DS.gold, lineHeight: 1 }}>
                {total}
              </span>
              <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                vehicles
              </span>
              <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', marginLeft: 'auto' }}>
                avg {w.avgDays}d
              </span>
            </div>

            {/* Stacked bar */}
            {total > 0 && (
              <div style={{ display: 'flex', height: 6, gap: 1, marginBottom: 6 }}>
                {segments.map(seg => (
                  <div key={seg.key} style={{
                    flex: seg.count,
                    background: seg.color,
                    height: '100%',
                  }} />
                ))}
              </div>
            )}

            {/* Legend */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {segments.map(seg => (
                <div key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, background: seg.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.04em' }}>
                    {seg.count} {seg.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
