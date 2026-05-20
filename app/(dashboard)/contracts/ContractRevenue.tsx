'use client'

import { DS, FONTS } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOTAL_MONTHLY  = 64000
const TOTAL_ANNUAL   = TOTAL_MONTHLY * 12

const CONTRACTS = [
  { id: 'antel',       client: 'Antel',       monthly: 22400, color: DS.green,  vehicles: 112, type: 'Corporate'  },
  { id: 'ute',         client: 'UTE',         monthly: 18500, color: DS.green,  vehicles: 87,  type: 'Corporate'  },
  { id: 'ose',         client: 'OSE',         monthly: 14200, color: DS.yellow, vehicles: 64,  type: 'Government' },
  { id: 'intendencia', client: 'Intendencia', monthly:  8900, color: DS.yellow, vehicles: 43,  type: 'Government' },
]

const MAX_MONTHLY = Math.max(...CONTRACTS.map(c => c.monthly))

const TYPE_SPLIT = [
  { label: 'Corporate',  amount: 22400 + 18500, color: DS.green  },
  { label: 'Government', amount: 14200 + 8900,  color: DS.blue   },
]

// ─── ContractRevenue ──────────────────────────────────────────────────────────

export function ContractRevenue() {
  return (
    <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>

      {/* Header */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
        <SectionLabel label="Resumen de Ingresos" color={DS.lime} />
      </div>

      {/* Total monthly */}
      <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid var(--ds-border)' }}>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
          Monthly Revenue — Long-Term
        </div>
        <div style={{ fontSize: 44, fontFamily: FONTS.display, color: DS.gold, lineHeight: 1, letterSpacing: '0.02em' }}>
          ${TOTAL_MONTHLY.toLocaleString()}
        </div>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', marginTop: 4, letterSpacing: '0.05em' }}>
          Projected annual: <span style={{ color: DS.lime }}>${TOTAL_ANNUAL.toLocaleString()}</span>
        </div>
      </div>

      {/* Per-contract bars */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--ds-border)' }}>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Revenue by Contract
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONTRACTS.map(c => {
            const pct   = Math.round((c.monthly / MAX_MONTHLY) * 100)
            const share = Math.round((c.monthly / TOTAL_MONTHLY) * 100)
            return (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: FONTS.display, color: c.color, letterSpacing: '0.04em' }}>
                      {c.client}
                    </span>
                    <span style={{ fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {c.type} · {c.vehicles} veh
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: c.color }}>{share}%</span>
                    <span style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)', width: 80, textAlign: 'right' }}>
                      ${c.monthly.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'var(--ds-bg-3)' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: c.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Type split */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--ds-border)' }}>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Contract Type Split
        </div>

        {/* Stacked bar */}
        <div style={{ display: 'flex', height: 10, gap: 1, background: 'var(--ds-border)', marginBottom: 8 }}>
          {TYPE_SPLIT.map(t => {
            const flex = t.amount / TOTAL_MONTHLY
            return (
              <div key={t.label} style={{ flex, background: t.color }} />
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16 }}>
          {TYPE_SPLIT.map(t => {
            const pct = Math.round((t.amount / TOTAL_MONTHLY) * 100)
            return (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, background: t.color, flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t.label}
                </span>
                <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: t.color }}>
                  {pct}%
                </span>
                <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>
                  ${t.amount.toLocaleString()}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Per-vehicle metric */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--ds-border)' }}>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Revenue per Vehicle
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--ds-border)' }}>
          {CONTRACTS.map(c => {
            const perVeh = Math.round(c.monthly / c.vehicles)
            return (
              <div key={c.id} style={{ background: 'var(--ds-bg-2)', padding: '8px 10px' }}>
                <div style={{ fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                  {c.client}
                </div>
                <div style={{ fontSize: 16, fontFamily: FONTS.display, color: c.color, lineHeight: 1 }}>
                  ${perVeh.toLocaleString()}
                </div>
                <div style={{ fontSize: 7, fontFamily: FONTS.mono, color: 'var(--ds-muted)', marginTop: 2, letterSpacing: '0.04em' }}>
                  per vehicle / mo
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 16px' }}>
        <span style={{ fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.05em' }}>
          Long-term contracts only · Karve short-term revenue tracked separately
        </span>
      </div>
    </div>
  )
}
