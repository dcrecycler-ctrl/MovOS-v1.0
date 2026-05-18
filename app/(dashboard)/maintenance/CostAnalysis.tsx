'use client'

import { DS, FONTS } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'

// ─── Mock data ────────────────────────────────────────────────────────────────

const TOTAL_MONTH = 142800

const COST_BREAKDOWN = [
  { label: 'Labor',          amount: 58400, color: DS.blue   },
  { label: 'Parts',          amount: 49200, color: DS.orange },
  { label: 'External Shops', amount: 35200, color: DS.purple },
]

const TOP_VEHICLES = [
  { unit: 'U-0033', model: 'SW4 2020',       cost: 38200 },
  { unit: 'U-0094', model: 'Kangoo 2021',    cost: 24100 },
  { unit: 'U-0088', model: 'Corolla 2023',   cost: 19500 },
  { unit: 'U-0142', model: 'Hilux 2022',     cost: 14200 },
  { unit: 'U-0055', model: 'Duster 2021',    cost: 12800 },
]

const CATEGORY_COSTS = [
  { label: 'Economy',  avg: 8200  },
  { label: 'Compact',  avg: 11400 },
  { label: 'Midsize',  avg: 14800 },
  { label: 'SUV',      avg: 22600 },
  { label: 'Van',      avg: 18200 },
  { label: 'Pickup',   avg: 24800 },
  { label: 'Premium',  avg: 28400 },
]

const TOP_VEH_MAX  = Math.max(...TOP_VEHICLES.map(v => v.cost))
const CAT_MAX      = Math.max(...CATEGORY_COSTS.map(c => c.avg))

// ─── Helpers ──────────────────────────────────────────────────────────────────

function HBar({
  pct, color, height = 4,
}: { pct: number; color: string; height?: number }) {
  return (
    <div style={{ flex: 1, height, background: 'var(--ds-bg-3)' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color }} />
    </div>
  )
}

function formatUY(n: number): string {
  if (n >= 1000) return `$UY ${n.toLocaleString()}`
  return `$UY ${n}`
}

// ─── CostAnalysis ─────────────────────────────────────────────────────────────

export function CostAnalysis() {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <SectionLabel label="Maintenance Costs" color={DS.lime} />
      </div>

      <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>

        {/* Total spend */}
        <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid var(--ds-border)' }}>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Total Spend — May 2026
          </div>
          <div style={{ fontSize: 44, fontFamily: FONTS.display, color: DS.gold, lineHeight: 1, letterSpacing: '0.02em' }}>
            $UY {TOTAL_MONTH.toLocaleString()}
          </div>
        </div>

        {/* Cost breakdown bars */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--ds-border)' }}>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {COST_BREAKDOWN.map(c => {
              const pct = Math.round((c.amount / TOTAL_MONTH) * 100)
              return (
                <div key={c.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {c.label}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, fontFamily: FONTS.mono, color: c.color }}>{pct}%</span>
                      <span style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)', width: 110, textAlign: 'right' }}>
                        {formatUY(c.amount)}
                      </span>
                    </div>
                  </div>
                  <HBar pct={pct} color={c.color} height={6} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Top 5 vehicles */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--ds-border)' }}>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Top 5 Vehicles This Month
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {TOP_VEHICLES.map(v => {
              const pct = Math.round((v.cost / TOP_VEH_MAX) * 100)
              return (
                <div key={v.unit}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, fontFamily: FONTS.mono, color: DS.gold, width: 56 }}>{v.unit}</span>
                      <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>{v.model}</span>
                    </div>
                    <span style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>
                      {formatUY(v.cost)}
                    </span>
                  </div>
                  <HBar pct={pct} color={DS.gold} height={4} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Category averages */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Avg Cost per Category
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CATEGORY_COSTS.sort((a, b) => b.avg - a.avg).map(c => {
              const pct = Math.round((c.avg / CAT_MAX) * 100)
              return (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', width: 60, flexShrink: 0 }}>
                    {c.label}
                  </span>
                  <HBar pct={pct} color={DS.blue} height={4} />
                  <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-dim)', width: 90, textAlign: 'right', flexShrink: 0 }}>
                    {formatUY(c.avg)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
