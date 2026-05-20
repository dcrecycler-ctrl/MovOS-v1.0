'use client'

import { DS, FONTS } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ActionButton } from '@/components/ui/ActionButton'

// ─── Types + data ─────────────────────────────────────────────────────────────

interface ContractRow {
  id: string; client: string; color: string
  startMs: number; endMs: number; daysRemaining: number
}

// Timeline window: May 2026 → Oct 2027 (18 months)
const WINDOW_START = new Date('2026-05-01').getTime()
const WINDOW_END   = new Date('2027-11-01').getTime()
const WINDOW_MS    = WINDOW_END - WINDOW_START

function d(s: string) { return new Date(s).getTime() }

const CONTRACTS: ContractRow[] = [
  { id: 'ute',         client: 'UTE',         color: DS.green,  startMs: d('2024-01-01'), endMs: d('2027-03-01'), daysRemaining: 287 },
  { id: 'antel',       client: 'Antel',       color: DS.green,  startMs: d('2023-06-01'), endMs: d('2027-09-01'), daysRemaining: 481 },
  { id: 'ose',         client: 'OSE',         color: DS.yellow, startMs: d('2023-03-01'), endMs: d('2026-06-29'), daysRemaining: 42  },
  { id: 'intendencia', client: 'Intendencia', color: DS.yellow, startMs: d('2022-08-01'), endMs: d('2026-06-15'), daysRemaining: 28  },
]

// 18 month tick labels
const MONTHS: string[] = []
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
for (let i = 0; i < 19; i++) {
  const d = new Date('2026-05-01')
  d.setMonth(d.getMonth() + i)
  MONTHS.push(`${MONTH_LABELS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`)
}

function barColor(daysRemaining: number): string {
  if (daysRemaining <= 0)  return DS.red
  if (daysRemaining <= 60) return DS.yellow
  return DS.green
}

function clampPct(ms: number, min = WINDOW_START, max = WINDOW_END): number {
  return Math.max(0, Math.min(100, ((ms - min) / (max - min)) * 100))
}

// ─── RenewalTimeline ──────────────────────────────────────────────────────────

export function RenewalTimeline() {
  const todayMs = new Date('2026-05-18').getTime()
  const todayPct = clampPct(todayMs)

  return (
    <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>

      {/* Header */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
        <SectionLabel label="Calendario de Renovaciones" color={DS.orange} />
      </div>

      {/* Legend */}
      <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid var(--ds-border)', display: 'flex', gap: 16 }}>
        {[
          { label: '> 60 days', color: DS.green  },
          { label: '≤ 60 days', color: DS.yellow },
          { label: 'Expired',   color: DS.red    },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 3, background: l.color }} />
            <span style={{ fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>

      {/* Timeline area */}
      <div style={{ padding: '12px 16px 16px' }}>

        {/* Month ticks */}
        <div style={{ position: 'relative', height: 18, marginBottom: 6 }}>
          {MONTHS.map((label, i) => {
            const pct = (i / (MONTHS.length - 1)) * 100
            return (
              <div key={label} style={{
                position: 'absolute', left: `${pct}%`,
                transform: 'translateX(-50%)',
                fontSize: 7, fontFamily: FONTS.mono,
                color: 'var(--ds-muted)', letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
              }}>
                {i % 3 === 0 ? label : '·'}
              </div>
            )
          })}
        </div>

        {/* Tick rule */}
        <div style={{ position: 'relative', height: 8, marginBottom: 10 }}>
          <div style={{ position: 'absolute', inset: '3px 0', background: 'var(--ds-border)' }} />
          {MONTHS.map((label, i) => {
            const pct = (i / (MONTHS.length - 1)) * 100
            return (
              <div key={label} style={{
                position: 'absolute', left: `${pct}%`,
                width: 1, height: 8, background: 'var(--ds-border-2)',
                transform: 'translateX(-50%)',
              }} />
            )
          })}
          {/* Today marker */}
          <div style={{
            position: 'absolute', left: `${todayPct}%`,
            top: 0, bottom: 0, width: 1,
            background: DS.gold, opacity: 0.8,
            transform: 'translateX(-50%)',
          }} />
        </div>

        {/* Contract rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CONTRACTS.map(c => {
            const startPct = clampPct(c.startMs)
            const endPct   = clampPct(c.endMs)
            const color    = barColor(c.daysRemaining)
            const width    = Math.max(endPct - startPct, 1)

            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

                {/* Label */}
                <div style={{ width: 80, flexShrink: 0 }}>
                  <div style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-text)', letterSpacing: '0.04em' }}>
                    {c.client}
                  </div>
                  <div style={{ fontSize: 8, fontFamily: FONTS.mono, color: c.daysRemaining <= 60 ? color : 'var(--ds-muted)', letterSpacing: '0.05em' }}>
                    {c.daysRemaining > 0 ? `${c.daysRemaining}d left` : 'expired'}
                  </div>
                </div>

                {/* Bar track */}
                <div style={{ flex: 1, position: 'relative', height: 20 }}>
                  {/* track bg */}
                  <div style={{ position: 'absolute', inset: '8px 0', background: 'var(--ds-bg-3)' }} />

                  {/* contract bar */}
                  <div style={{
                    position: 'absolute',
                    left:  `${startPct}%`,
                    width: `${width}%`,
                    top: 6, bottom: 6,
                    background: `${color}28`,
                    borderLeft:  `2px solid ${color}`,
                    borderRight: `2px solid ${color}`,
                    borderTop:   `1px solid ${color}44`,
                    borderBottom:`1px solid ${color}44`,
                  }} />

                  {/* today line overlay */}
                  <div style={{
                    position: 'absolute', left: `${todayPct}%`,
                    top: 0, bottom: 0, width: 1,
                    background: DS.gold, opacity: 0.6,
                    transform: 'translateX(-50%)',
                  }} />
                </div>

                {/* Action */}
                <div style={{ flexShrink: 0 }}>
                  <ActionButton
                    label="Renovar"
                    color={c.daysRemaining <= 60 ? DS.orange : DS.slate}
                    secondary
                    onClick={() => {}}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Today label */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 2, background: DS.gold }} />
          <span style={{ fontSize: 8, fontFamily: FONTS.mono, color: DS.gold, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Today — May 18, 2026
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 16px 10px', borderTop: '1px solid var(--ds-border)' }}>
        <span style={{ fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.05em' }}>
          Timeline: May 2026 → Nov 2027 · 2 contracts expiring within 60 days
        </span>
      </div>
    </div>
  )
}
