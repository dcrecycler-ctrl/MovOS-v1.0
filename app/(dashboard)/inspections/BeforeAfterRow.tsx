'use client'

import { B } from '@/lib/tokens'
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
    return: { fuel: 38,  odometer: 46104, date: '18 May 09:02', zones: ['Parabrisas']              },
    delta:  { km: 1284, fuelDiff: -62, newDamageZones: ['Parabrisas'] },
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
    pickup: { fuel: 100, odometer: 38200, date: '08 May 10:00', zones: ['Paragolpes trasero (previo)']      },
    return: { fuel: 22,  odometer: 39815, date: '15 May 16:40', zones: ['Paragolpes trasero (previo)', 'Puerta delantera izq.'] },
    delta:  { km: 1615, fuelDiff: -78, newDamageZones: ['Puerta delantera izq.'] },
    outcome: 'damage',
  },
]

// ─── Fuel bar ─────────────────────────────────────────────────────────────────

function FuelBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: B.surface3, borderRadius: 9999, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${pct}%`, background: color, borderRadius: 9999,
        }} />
      </div>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-dm-mono)', fontWeight: 700, color, width: 34, textAlign: 'right', flexShrink: 0 }}>
        {pct}%
      </span>
    </div>
  )
}

// ─── Comparison card ──────────────────────────────────────────────────────────

function ComparisonCard({ cmp }: { cmp: Comparison }) {
  const accentColor = cmp.outcome === 'damage' ? B.rose : B.green
  const returnFuelColor = cmp.return.fuel < 20 ? B.rose : cmp.return.fuel < 40 ? B.amber : B.green

  return (
    <div style={{
      background: B.surface,
      borderTop: `2px solid ${accentColor}`,
      borderRadius: '0 0 14px 14px',
      display: 'flex', flexDirection: 'column',
      border: `1px solid ${B.hairline}`,
      borderTopWidth: 2,
    }}>

      {/* Card header */}
      <div style={{
        padding: '14px 16px', borderBottom: `1px solid ${B.hairline}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ fontSize: 16, fontFamily: 'var(--font-dm-mono)', fontWeight: 700, color: B.amber, letterSpacing: '0.04em', lineHeight: 1, marginBottom: 3 }}>
            {cmp.unit}
          </div>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink2 }}>
            {cmp.model} · {cmp.plate}
          </div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, marginTop: 2 }}>
            Res. {cmp.reservation}
          </div>
        </div>
        <StatusBadge
          label={cmp.outcome === 'damage' ? 'DAÑO DETECTADO' : 'SIN DAÑOS'}
          color={accentColor}
          small
        />
      </div>

      {/* Pickup snapshot */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${B.hairline}` }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.green, marginBottom: 8 }}>
          Recogida · {cmp.pickup.date}
        </div>
        <FuelBar pct={cmp.pickup.fuel} color={B.green} />
        <div style={{ fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink3, marginTop: 6 }}>
          Odómetro: <span style={{ color: B.ink, fontWeight: 500 }}>{cmp.pickup.odometer.toLocaleString()} km</span>
        </div>
        <div style={{ marginTop: 6 }}>
          {cmp.pickup.zones.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {cmp.pickup.zones.map(z => (
                <span key={z} style={{
                  fontSize: 10, fontFamily: 'var(--font-inter)', color: B.amber,
                  background: B.amberSoft, padding: '2px 8px', borderRadius: 9999,
                }}>
                  {z}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3 }}>
              Sin daños previos
            </span>
          )}
        </div>
      </div>

      {/* Return snapshot */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${B.hairline}` }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.amber, marginBottom: 8 }}>
          Devolución · {cmp.return.date}
        </div>
        <FuelBar pct={cmp.return.fuel} color={returnFuelColor} />
        <div style={{ fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink3, marginTop: 6 }}>
          Odómetro: <span style={{ color: B.ink, fontWeight: 500 }}>{cmp.return.odometer.toLocaleString()} km</span>
        </div>
        <div style={{ marginTop: 6 }}>
          {cmp.return.zones.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {cmp.return.zones.map(z => {
                const isNew = !cmp.pickup.zones.includes(z)
                return (
                  <span key={z} style={{
                    fontSize: 10, fontFamily: 'var(--font-inter)',
                    color:      isNew ? B.rose   : B.ink3,
                    background: isNew ? B.roseSoft : B.surface2,
                    padding: '2px 8px', borderRadius: 9999,
                  }}>
                    {isNew ? '▲ ' : ''}{z}
                  </span>
                )
              })}
            </div>
          ) : (
            <span style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3 }}>
              Sin daños registrados
            </span>
          )}
        </div>
      </div>

      {/* Delta */}
      <div style={{
        padding: '12px 16px', borderBottom: `1px solid ${B.hairline}`,
        background: cmp.outcome === 'damage' ? B.roseSoft : 'transparent',
      }}>
        <div style={{ display: 'flex', gap: 20, marginBottom: cmp.delta.newDamageZones.length > 0 ? 10 : 0 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, fontWeight: 500, marginBottom: 2 }}>KM</div>
            <div style={{ fontSize: 22, fontFamily: 'var(--font-inter)', fontWeight: 700, color: B.amber, letterSpacing: '-0.02em' }}>{cmp.delta.km.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, fontWeight: 500, marginBottom: 2 }}>COMBUSTIBLE</div>
            <div style={{ fontSize: 22, fontFamily: 'var(--font-inter)', fontWeight: 700, color: B.rose, letterSpacing: '-0.02em' }}>{cmp.delta.fuelDiff}%</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, fontWeight: 500, marginBottom: 2 }}>DAÑOS NUEVOS</div>
            <div style={{ fontSize: 22, fontFamily: 'var(--font-inter)', fontWeight: 700, letterSpacing: '-0.02em', color: cmp.delta.newDamageZones.length > 0 ? B.rose : B.green }}>
              {cmp.delta.newDamageZones.length}
            </div>
          </div>
        </div>
        {cmp.delta.newDamageZones.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {cmp.delta.newDamageZones.map(z => (
              <span key={z} style={{
                fontSize: 10, fontFamily: 'var(--font-inter)', color: B.rose,
                background: B.roseSoft, padding: '2px 8px', borderRadius: 9999,
              }}>
                ▲ {z}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action */}
      <div style={{ padding: '12px 16px' }}>
        <ActionButton label="Ver Comparación Completa" color={B.amber} secondary onClick={() => {}} />
      </div>
    </div>
  )
}

// ─── BeforeAfterRow ───────────────────────────────────────────────────────────

export function BeforeAfterRow() {
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <SectionLabel label="Comparación Antes / Después" count={COMPARISONS.length} color={B.amber} />
      </div>
      <div
        className="flex gap-3.5 overflow-x-auto pb-1"
        style={{ scrollSnapType: 'x mandatory' }}
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
