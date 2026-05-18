'use client'

import { DS, FONTS } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import { ActionButton } from '@/components/ui/ActionButton'

// ─── Types + mock data ────────────────────────────────────────────────────────

interface Snapshot {
  fuel: number; odometer: number; date: string; zones: string[]
}

interface Comparison {
  id: string; reservation: string
  unit: string; plate: string; model: string
  pickup: Snapshot; return: Snapshot
  delta: { km: number; fuelDiff: number; newDamageZones: string[] }
  outcome: 'clean' | 'damage'
}

const COMPARISONS: Comparison[] = [
  {
    id: 'cmp1', reservation: 'RES-8812',
    unit: 'U-0142', plate: 'SBQ 3812', model: 'Toyota Hilux 2022',
    pickup: { fuel: 100, odometer: 44820, date: '12 May 09:14', zones: []                          },
    return: { fuel: 38,  odometer: 46104, date: '18 May 09:02', zones: ['Windshield']               },
    delta:  { km: 1284, fuelDiff: -62, newDamageZones: ['Windshield'] },
    outcome: 'damage',
  },
  {
    id: 'cmp2', reservation: 'RES-8807',
    unit: 'U-0087', plate: 'SBC 1243', model: 'Toyota Corolla 2023',
    pickup: { fuel: 100, odometer: 22410, date: '10 May 14:30', zones: []                           },
    return: { fuel: 55,  odometer: 23190, date: '17 May 11:22', zones: []                           },
    delta:  { km: 780, fuelDiff: -45, newDamageZones: [] },
    outcome: 'clean',
  },
  {
    id: 'cmp3', reservation: 'RES-8799',
    unit: 'U-0055', plate: 'SAX 4421', model: 'Renault Duster 2021',
    pickup: { fuel: 100, odometer: 38200, date: '08 May 10:00', zones: ['Rear bumper (prior)']      },
    return: { fuel: 22,  odometer: 39815, date: '15 May 16:40', zones: ['Rear bumper (prior)', 'Front left door'] },
    delta:  { km: 1615, fuelDiff: -78, newDamageZones: ['Front left door'] },
    outcome: 'damage',
  },
]

// ─── Fuel bar ─────────────────────────────────────────────────────────────────

function FuelBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'var(--ds-bg-3)', position: 'relative', flexShrink: 0 }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${pct}%`, background: color,
        }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: FONTS.mono, color, width: 30, textAlign: 'right', flexShrink: 0 }}>
        {pct}%
      </span>
    </div>
  )
}

// ─── Comparison card ──────────────────────────────────────────────────────────

function ComparisonCard({ cmp }: { cmp: Comparison }) {
  const accentColor = cmp.outcome === 'damage' ? DS.red : DS.green
  const returnFuelColor = cmp.return.fuel < 20 ? DS.red : cmp.return.fuel < 40 ? DS.yellow : DS.green

  return (
    <div style={{
      background: 'var(--ds-bg-1)',
      borderTop: `2px solid ${accentColor}`,
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Card header */}
      <div style={{
        padding: '12px 14px', borderBottom: '1px solid var(--ds-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ fontSize: 16, fontFamily: FONTS.display, color: DS.gold, letterSpacing: '0.06em', lineHeight: 1, marginBottom: 3 }}>
            {cmp.unit}
          </div>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>
            {cmp.model} · {cmp.plate}
          </div>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', marginTop: 2 }}>
            Res. {cmp.reservation}
          </div>
        </div>
        <StatusBadge
          label={cmp.outcome === 'damage' ? 'DAMAGE DETECTED' : 'CLEAN RETURN'}
          color={accentColor}
          small
        />
      </div>

      {/* Pickup snapshot */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--ds-border)' }}>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: DS.green, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Pickup · {cmp.pickup.date}
        </div>
        <FuelBar pct={cmp.pickup.fuel} color={DS.green} />
        <div style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)', marginTop: 5 }}>
          Odometer: <span style={{ color: 'var(--ds-text)' }}>{cmp.pickup.odometer.toLocaleString()} km</span>
        </div>
        <div style={{ marginTop: 5 }}>
          {cmp.pickup.zones.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {cmp.pickup.zones.map(z => (
                <span key={z} style={{
                  fontSize: 8, fontFamily: FONTS.mono, color: DS.yellow,
                  background: `${DS.yellow}14`, border: `1px solid ${DS.yellow}54`,
                  padding: '2px 6px', letterSpacing: '0.06em',
                }}>
                  {z}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>
              No pre-existing damage
            </span>
          )}
        </div>
      </div>

      {/* Return snapshot */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--ds-border)' }}>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: DS.orange, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Return · {cmp.return.date}
        </div>
        <FuelBar pct={cmp.return.fuel} color={returnFuelColor} />
        <div style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)', marginTop: 5 }}>
          Odometer: <span style={{ color: 'var(--ds-text)' }}>{cmp.return.odometer.toLocaleString()} km</span>
        </div>
        <div style={{ marginTop: 5 }}>
          {cmp.return.zones.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {cmp.return.zones.map(z => {
                const isNew = !cmp.pickup.zones.includes(z)
                return (
                  <span key={z} style={{
                    fontSize: 8, fontFamily: FONTS.mono,
                    color:      isNew ? DS.red       : 'var(--ds-dim)',
                    background: isNew ? `${DS.red}1C` : 'var(--ds-bg-2)',
                    border:     `1px solid ${isNew ? `${DS.red}54` : 'var(--ds-border)'}`,
                    padding: '2px 6px', letterSpacing: '0.06em',
                  }}>
                    {isNew ? '▲ ' : ''}{z}
                  </span>
                )
              })}
            </div>
          ) : (
            <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>
              No damage recorded
            </span>
          )}
        </div>
      </div>

      {/* Delta */}
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid var(--ds-border)',
        background: cmp.outcome === 'damage' ? `${DS.red}08` : 'transparent',
      }}>
        <div style={{ display: 'flex', gap: 20, marginBottom: cmp.delta.newDamageZones.length > 0 ? 8 : 0 }}>
          <div>
            <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.06em' }}>KM DRIVEN</div>
            <div style={{ fontSize: 18, fontFamily: FONTS.display, color: DS.gold }}>{cmp.delta.km.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.06em' }}>FUEL DIFF</div>
            <div style={{ fontSize: 18, fontFamily: FONTS.display, color: DS.red }}>{cmp.delta.fuelDiff}%</div>
          </div>
          <div>
            <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.06em' }}>NEW DAMAGE</div>
            <div style={{ fontSize: 18, fontFamily: FONTS.display, color: cmp.delta.newDamageZones.length > 0 ? DS.red : DS.green }}>
              {cmp.delta.newDamageZones.length}
            </div>
          </div>
        </div>
        {cmp.delta.newDamageZones.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {cmp.delta.newDamageZones.map(z => (
              <span key={z} style={{
                fontSize: 8, fontFamily: FONTS.mono, color: DS.red,
                background: `${DS.red}1C`, border: `1px solid ${DS.red}54`,
                padding: '2px 6px', letterSpacing: '0.06em',
              }}>
                ▲ {z}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action */}
      <div style={{ padding: '10px 14px' }}>
        <ActionButton label="View Full Comparison" color={DS.gold} secondary onClick={() => {}} />
      </div>
    </div>
  )
}

// ─── BeforeAfterRow ───────────────────────────────────────────────────────────

export function BeforeAfterRow() {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <SectionLabel label="Before / After Comparison" count={COMPARISONS.length} color={DS.orange} />
      </div>
      <div
        className="flex gap-px overflow-x-auto"
        style={{ background: 'var(--ds-border)', scrollSnapType: 'x mandatory' }}
      >
        {COMPARISONS.map(cmp => (
          <div
            key={cmp.id}
            className="flex-none w-[85vw] md:w-auto md:flex-1"
            style={{ scrollSnapAlign: 'start', minWidth: 0 }}
          >
            <ComparisonCard cmp={cmp} />
          </div>
        ))}
      </div>
    </div>
  )
}
