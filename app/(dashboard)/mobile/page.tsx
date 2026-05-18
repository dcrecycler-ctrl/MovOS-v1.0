'use client'

import { useState, useRef } from 'react'
import { DS, B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'

// ─── Constants ────────────────────────────────────────────────────────────────
const SCREENS = [
  { id: 1, label: 'Mis Tareas',     sub: 'Home' },
  { id: 2, label: 'Inspección',     sub: '5 pasos' },
  { id: 3, label: 'Escanear QR',    sub: 'Vista rápida' },
  { id: 4, label: 'A Taller',       sub: 'Mover vehículo' },
  { id: 5, label: 'Estado Taller',  sub: 'Pipeline' },
]

const CHECKLIST_ITEMS = [
  'Nivel combustible', 'Nivel aceite', 'Presión neumáticos', 'Luces',
  'Limpiaparabrisas', 'Frenos', 'Bocina', 'Aire acondicionado',
  'Asientos y cinturones', 'Tablero', 'Baúl', 'Limpieza interior',
  'Documentos', 'Rueda de auxilio',
]

const MAINTENANCE_STAGES = [
  'Traslado a taller', 'En diagnóstico', 'Esperando repuestos',
  'En reparación', 'Control de calidad', 'Listo para retirar', 'Retornado a flota',
]

const CAR_ZONES = [
  { id: 'bumper_front', label: 'Paragolpes delantero',     x: 30,  y: 0,   w: 140, h: 22,  cx: 100, cy: 11  },
  { id: 'fender_fl',    label: 'Guardabarro del. izq.',    x: 0,   y: 22,  w: 28,  h: 77,  cx: 14,  cy: 60  },
  { id: 'hood',         label: 'Capó',                     x: 30,  y: 22,  w: 140, h: 77,  cx: 100, cy: 60  },
  { id: 'fender_fr',    label: 'Guardabarro del. der.',    x: 172, y: 22,  w: 28,  h: 77,  cx: 186, cy: 60  },
  { id: 'door_fl',      label: 'Puerta delantera izq.',    x: 0,   y: 99,  w: 28,  h: 68,  cx: 14,  cy: 133 },
  { id: 'windshield',   label: 'Parabrisas',               x: 30,  y: 99,  w: 140, h: 35,  cx: 100, cy: 116 },
  { id: 'roof',         label: 'Techo',                    x: 30,  y: 134, w: 140, h: 68,  cx: 100, cy: 168 },
  { id: 'door_fr',      label: 'Puerta delantera der.',    x: 172, y: 99,  w: 28,  h: 68,  cx: 186, cy: 133 },
  { id: 'door_rl',      label: 'Puerta trasera izq.',      x: 0,   y: 167, w: 28,  h: 68,  cx: 14,  cy: 201 },
  { id: 'rear_ws',      label: 'Luneta',                   x: 30,  y: 202, w: 140, h: 34,  cx: 100, cy: 219 },
  { id: 'trunk',        label: 'Baúl',                     x: 30,  y: 236, w: 140, h: 56,  cx: 100, cy: 264 },
  { id: 'door_rr',      label: 'Puerta trasera der.',      x: 172, y: 167, w: 28,  h: 68,  cx: 186, cy: 201 },
  { id: 'fender_rl',    label: 'Guardabarro tras. izq.',   x: 0,   y: 235, w: 28,  h: 57,  cx: 14,  cy: 263 },
  { id: 'fender_rr',    label: 'Guardabarro tras. der.',   x: 172, y: 235, w: 28,  h: 57,  cx: 186, cy: 263 },
  { id: 'bumper_rear',  label: 'Paragolpes trasero',       x: 30,  y: 292, w: 140, h: 22,  cx: 100, cy: 303 },
]

const INTERIOR_ZONES = ['Interior', 'Tablero', 'Asientos', 'Baúl interior', 'Parte inferior']

const PHOTO_GUIDE: Record<string, string> = {
  bumper_front: 'Párese a 2m frente al vehículo. Encuadre el paragolpes completo incluyendo ambas esquinas.',
  hood: 'Párese a 1.5m frente con capota abierta. Capture toda la superficie desde arriba.',
  windshield: 'Párese a 1m frente al vehículo. Capture el parabrisas completo con luz lateral para revelar fisuras.',
  roof: 'Capture desde un lateral elevado. Toda la superficie del techo visible.',
  rear_ws: 'Párese a 1m detrás. Capture la luneta completa con luz lateral.',
  trunk: 'Párese a 1.5m detrás. Capture la cubierta del baúl completa.',
  bumper_rear: 'Párese a 2m detrás. Encuadre el paragolpes trasero completo.',
  door_fl: 'Párese perpendicular a la puerta. Capture el panel completo, de borde a ventanilla.',
  door_rl: 'Párese perpendicular a la puerta trasera izq. Panel completo.',
  door_fr: 'Párese perpendicular a la puerta der. Panel completo.',
  door_rr: 'Párese perpendicular a la puerta trasera der. Panel completo.',
  fender_fl: 'Ángulo 45° frente izq. Del neumático hasta la puerta.',
  fender_rl: 'Ángulo 45° trasero izq. Guardabarro completo.',
  fender_fr: 'Ángulo 45° frente der. Del neumático hasta la puerta.',
  fender_rr: 'Ángulo 45° trasero der. Guardabarro completo.',
}

type Severity = 'cosmetic' | 'minor' | 'major'
type DamageType = 'Rayón' | 'Abolladura' | 'Grieta' | 'Astilla' | 'Pieza faltante' | 'Mancha'
interface ZoneDamage { type: DamageType; severity: Severity; notes: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mono = 'var(--font-dm-mono)'
const inter = 'var(--font-inter)'
const bebas = 'var(--font-bebas-neue)'

function sevColor(s: Severity) {
  return s === 'cosmetic' ? DS.yellow : s === 'minor' ? DS.orange : DS.red
}
function sevLabel(s: Severity) {
  return s === 'cosmetic' ? 'Cosmético' : s === 'minor' ? 'Menor' : 'Mayor'
}

// ─── Phone Frame ─────────────────────────────────────────────────────────────
const BOTTOM_NAV_ITEMS = [
  { label: 'Tareas',       icon: '☑' },
  { label: 'Flota',        icon: '◈' },
  { label: 'Inspeccionar', icon: '🔍' },
  { label: 'Mantener',     icon: '🔧' },
  { label: 'Alertas',      icon: '⚡' },
]

function PhoneFrame({ children, label, active }: {
  children: React.ReactNode
  label: string
  active: boolean
}) {
  return (
    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 375,
        background: '#0a0a0a',
        borderRadius: 44,
        padding: 10,
        border: `2px solid ${active ? DS.gold : '#2a2a2a'}`,
        boxShadow: active
          ? `0 0 0 3px ${DS.gold}44, 0 40px 100px rgba(0,0,0,0.5)`
          : '0 20px 60px rgba(0,0,0,0.3)',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}>
        <div style={{
          borderRadius: 30, overflow: 'hidden',
          background: DS.bg, height: 780,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Status bar */}
          <div style={{
            flexShrink: 0, display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '10px 22px 6px', background: DS.bg,
          }}>
            <span style={{ fontFamily: mono, fontSize: 11, color: DS.textDim, fontWeight: 600 }}>9:41</span>
            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: DS.gold, letterSpacing: '0.1em' }}>MovOS</span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <svg width="14" height="10" viewBox="0 0 14 10">
                <rect x="0" y="6" width="2" height="4" rx="0.5" fill={DS.textDim}/>
                <rect x="3" y="4" width="2" height="6" rx="0.5" fill={DS.textDim}/>
                <rect x="6" y="2" width="2" height="8" rx="0.5" fill={DS.textDim}/>
                <rect x="9" y="0" width="2" height="10" rx="0.5" fill={DS.muted}/>
              </svg>
              <svg width="20" height="10" viewBox="0 0 20 10">
                <rect x="0" y="0" width="18" height="10" rx="2" stroke={DS.textDim} strokeWidth="1" fill="none"/>
                <rect x="1" y="1" width="12" height="8" rx="1" fill={DS.textDim}/>
                <rect x="18" y="3" width="2" height="4" rx="1" fill={DS.textDim}/>
              </svg>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {children}
          </div>

          {/* Bottom nav */}
          <div style={{
            flexShrink: 0, background: DS.bg1,
            borderTop: `1px solid ${DS.border}`,
            display: 'flex', justifyContent: 'space-around',
            padding: '7px 4px 14px',
          }}>
            {BOTTOM_NAV_ITEMS.map(item => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 56 }}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span style={{ fontFamily: mono, fontSize: 9, color: DS.muted }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <span style={{ fontFamily: inter, fontSize: 12, fontWeight: 600, color: active ? B.amber : B.ink2 }}>
          {label}
        </span>
      </div>
    </div>
  )
}

// ─── Screen 1 — Home / Tareas ─────────────────────────────────────────────────
function Screen1_Home() {
  const tasks = [
    { type: 'Inspección Entrega',     color: DS.blue,   unit: 'ABC-1234', model: 'Toyota Hilux',     plate: 'TUV-891', time: '09:00', customer: 'Juan Pérez',    urgent: false },
    { type: 'Inspección Devolución',  color: DS.gold,   unit: 'XYZ-5678', model: 'Ford Ranger',      plate: 'WXY-234', time: '10:30', customer: 'María García',  urgent: true  },
    { type: 'Mover a Taller',         color: DS.orange, unit: 'DEF-9012', model: 'VW Amarok',         plate: 'ZAB-567', time: '11:00', customer: null,            urgent: true  },
    { type: 'Limpieza',               color: DS.yellow, unit: 'GHI-3456', model: 'Mitsubishi L200',   plate: 'CDE-890', time: '14:00', customer: null,            urgent: false },
    { type: 'Inspección Entrega',     color: DS.blue,   unit: 'JKL-7890', model: 'Nissan Frontier',   plate: 'FGH-123', time: '15:30', customer: 'Carlos López',  urgent: false },
  ]
  const activity = [
    { action: 'Inspección completada', unit: 'MNO-1234', time: 'Hace 2h' },
    { action: 'Daño reportado',        unit: 'PQR-5678', time: 'Hace 3h' },
    { action: 'Vehículo liberado',     unit: 'STU-9012', time: 'Hace 5h' },
  ]
  return (
    <div style={{ padding: '0 16px 20px', background: DS.bg }}>
      <div style={{ padding: '12px 0 18px' }}>
        <p style={{ fontFamily: mono, fontSize: 10, color: DS.muted, margin: 0, marginBottom: 2 }}>
          Lun 19 mayo · Sucursal A
        </p>
        <h1 style={{ fontFamily: inter, fontSize: 20, fontWeight: 700, color: DS.text, margin: 0, letterSpacing: '-0.02em' }}>
          Buenos días, Rodrigo
        </h1>
        <p style={{ fontFamily: mono, fontSize: 10, color: DS.gold, margin: '2px 0 0' }}>
          Inspector de Flota
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Mis Tareas', value: '5', color: DS.blue },
          { label: 'Urgentes',   value: '2', color: DS.red  },
          { label: 'Completadas',value: '3', color: DS.green},
        ].map(s => (
          <div key={s.label} style={{
            background: DS.bg1, border: `1px solid ${DS.border}`,
            borderTop: `2px solid ${s.color}`, borderRadius: 10,
            padding: '10px 8px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: bebas, fontSize: 30, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: mono, fontSize: 9, color: DS.muted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 600, color: DS.textDim, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tareas del día</span>
        <span style={{ fontFamily: mono, fontSize: 10, color: DS.gold }}>Ver todas</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {tasks.map((t, i) => (
          <div key={i} style={{
            background: DS.bg1, border: `1px solid ${DS.border}`,
            borderLeft: t.urgent ? `3px solid ${DS.red}` : `1px solid ${DS.border}`,
            borderRadius: 10, padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{
                fontFamily: mono, fontSize: 9, fontWeight: 600,
                color: t.color, background: t.color + '22',
                padding: '2px 7px', borderRadius: 4,
              }}>{t.type}</span>
              <span style={{ fontFamily: mono, fontSize: 10, color: DS.muted }}>{t.time}</span>
            </div>
            <div style={{ fontFamily: inter, fontSize: 13, fontWeight: 600, color: DS.text }}>{t.model}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
              <span style={{ fontFamily: mono, fontSize: 10, color: DS.textDim }}>{t.unit}</span>
              <span style={{ color: DS.muted, fontSize: 10 }}>·</span>
              <span style={{ fontFamily: mono, fontSize: 10, color: DS.textDim }}>{t.plate}</span>
              {t.customer && <>
                <span style={{ color: DS.muted, fontSize: 10 }}>·</span>
                <span style={{ fontFamily: mono, fontSize: 10, color: DS.textDim }}>{t.customer}</span>
              </>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 10 }}>
        <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 600, color: DS.textDim, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Actividad reciente</span>
      </div>
      {activity.map((a, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${DS.border}` }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 11, color: DS.textDim }}>{a.action}</div>
            <div style={{ fontFamily: mono, fontSize: 10, color: DS.muted }}>{a.unit}</div>
          </div>
          <span style={{ fontFamily: mono, fontSize: 10, color: DS.muted }}>{a.time}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Screen 2 — Pickup Inspection ────────────────────────────────────────────
function Screen2_Inspection() {
  const [step, setStep]           = useState(0)
  const [fuelLevel, setFuelLevel] = useState(5)
  const [odometer, setOdometer]   = useState('45230')
  const [checkItems, setCheckItems] = useState<Record<string, 'ok' | 'issue' | 'na' | null>>(
    () => Object.fromEntries(CHECKLIST_ITEMS.map(k => [k, null]))
  )
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [zoneMarkers, setZoneMarkers]   = useState<Record<string, ZoneDamage>>({
    hood:    { type: 'Rayón',      severity: 'cosmetic', notes: '' },
    door_fl: { type: 'Abolladura', severity: 'minor',    notes: 'Golpe en la manija' },
  })
  const [newDmg, setNewDmg]   = useState<{ type: DamageType; severity: Severity; notes: string }>({ type: 'Rayón', severity: 'cosmetic', notes: '' })
  const [dmgTab, setDmgTab]   = useState<'diagram' | 'list' | 'photos'>('diagram')
  const [submitted, setSubmitted] = useState(false)

  const checkedCount = Object.values(checkItems).filter(v => v !== null).length
  const STEPS = ['Vehículo', 'Checklist', 'Daños', 'Fotos', 'Firma']

  const stepBar = (
    <div style={{ padding: '12px 16px 10px', borderBottom: `1px solid ${DS.border}`, flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              height: 3, width: '100%', borderRadius: 99,
              background: i < step ? DS.gold : i === step ? DS.gold : DS.border,
              opacity: i > step ? 0.3 : 1,
            }}/>
            <span style={{ fontFamily: mono, fontSize: 8, color: i === step ? DS.gold : i < step ? DS.textDim : DS.muted, textAlign: 'center', lineHeight: 1.2 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (submitted) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
      <div style={{ fontFamily: inter, fontSize: 18, fontWeight: 700, color: DS.green }}>¡Inspección enviada!</div>
      <div style={{ fontFamily: mono, fontSize: 12, color: DS.textDim, marginTop: 8 }}>Registro #INS-2847 creado</div>
      <div style={{ fontFamily: mono, fontSize: 11, color: DS.muted, marginTop: 4 }}>Toyota Hilux · TUV-891</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: DS.bg }}>
      {stepBar}

      <div style={{ flex: 1, overflowY: 'visible', padding: '0 16px' }}>

        {/* STEP 0 — Vehicle info */}
        {step === 0 && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontFamily: mono, fontSize: 10, color: DS.muted, marginBottom: 4 }}>Inspección Entrega · TUV-891</div>
            <div style={{ fontFamily: inter, fontSize: 16, fontWeight: 700, color: DS.text, marginBottom: 20 }}>Toyota Hilux · ABC-1234</div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: mono, fontSize: 10, color: DS.textDim, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Odómetro (km)</div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={odometer}
                  onChange={e => setOdometer(e.target.value)}
                  style={{
                    fontFamily: bebas, fontSize: 44, color: DS.gold,
                    background: DS.bg1, border: `1px solid ${DS.border}`,
                    borderRadius: 10, padding: '10px 16px',
                    width: '100%', boxSizing: 'border-box', outline: 'none',
                    letterSpacing: '0.05em',
                  }}
                />
                <span style={{ position: 'absolute', right: 16, bottom: 16, fontFamily: mono, fontSize: 11, color: DS.muted }}>km</span>
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: mono, fontSize: 10, color: DS.textDim, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Nivel de combustible — {Math.round((fuelLevel / 8) * 100)}%
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: DS.muted }}>E</span>
                <div style={{ flex: 1, display: 'flex', gap: 3 }}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      onClick={() => setFuelLevel(i + 1)}
                      style={{
                        flex: 1, height: 28, borderRadius: 4, cursor: 'pointer',
                        background: i < fuelLevel ? DS.gold : DS.bg2,
                        border: `1px solid ${i < fuelLevel ? DS.gold : DS.border}`,
                        transition: 'background 0.15s',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontFamily: mono, fontSize: 10, color: DS.muted }}>F</span>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              style={{
                width: '100%', padding: '14px', borderRadius: 10,
                background: DS.gold, color: DS.bg, border: 'none', cursor: 'pointer',
                fontFamily: inter, fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
              }}
            >
              INICIAR CHECKLIST →
            </button>
          </div>
        )}

        {/* STEP 1 — Checklist */}
        {step === 1 && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: mono, fontSize: 11, color: DS.textDim }}>Checklist de condición</span>
              <span style={{ fontFamily: bebas, fontSize: 16, color: DS.gold }}>{checkedCount}/14</span>
            </div>
            <div style={{ height: 4, background: DS.bg2, borderRadius: 99, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(checkedCount / 14) * 100}%`, background: DS.gold, borderRadius: 99, transition: 'width 0.3s' }}/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {CHECKLIST_ITEMS.map(item => {
                const val = checkItems[item]
                return (
                  <div key={item} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 10px', background: DS.bg1, border: `1px solid ${DS.border}`, borderRadius: 8,
                    borderLeft: val === 'issue' ? `3px solid ${DS.red}` : val === 'ok' ? `3px solid ${DS.green}` : `1px solid ${DS.border}`,
                  }}>
                    <span style={{ fontFamily: mono, fontSize: 11, color: DS.textDim, flex: 1 }}>{item}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(['ok', 'issue', 'na'] as const).map(v => (
                        <button
                          key={v}
                          onClick={() => setCheckItems(prev => ({ ...prev, [item]: val === v ? null : v }))}
                          style={{
                            fontFamily: mono, fontSize: 9, padding: '3px 7px', borderRadius: 5, cursor: 'pointer', border: 'none',
                            background: val === v
                              ? v === 'ok' ? DS.green : v === 'issue' ? DS.red : DS.muted
                              : DS.bg2,
                            color: val === v ? '#fff' : DS.muted,
                            fontWeight: val === v ? 700 : 400,
                          }}
                        >
                          {v === 'ok' ? '✓ OK' : v === 'issue' ? '⚠ Aviso' : 'N/A'}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, padding: '12px', borderRadius: 10, background: DS.bg1, border: `1px solid ${DS.border}`, color: DS.textDim, cursor: 'pointer', fontFamily: mono, fontSize: 11 }}>← Anterior</button>
              <button onClick={() => setStep(2)} style={{ flex: 2, padding: '12px', borderRadius: 10, background: DS.gold, border: 'none', color: DS.bg, cursor: 'pointer', fontFamily: inter, fontSize: 13, fontWeight: 700 }}>Mapa de daños →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — Damage Map */}
        {step === 2 && (
          <div style={{ padding: '16px 0' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
              {(['diagram', 'list', 'photos'] as const).map(tab => (
                <button key={tab} onClick={() => setDmgTab(tab)} style={{
                  flex: 1, padding: '7px', borderRadius: 8, cursor: 'pointer', border: 'none',
                  background: dmgTab === tab ? DS.gold : DS.bg1,
                  color: dmgTab === tab ? DS.bg : DS.textDim,
                  fontFamily: mono, fontSize: 10,
                  fontWeight: dmgTab === tab ? 700 : 400,
                }}>
                  {tab === 'diagram' ? 'Diagrama' : tab === 'list' ? 'Lista de daños' : 'Fotos'}
                </button>
              ))}
            </div>

            {dmgTab === 'diagram' && (
              <>
                {/* SVG car diagram */}
                <div style={{ background: DS.bg1, borderRadius: 12, border: `1px solid ${DS.border}`, padding: '12px', marginBottom: 10 }}>
                  <svg viewBox="0 0 200 314" width="100%" style={{ display: 'block' }}>
                    {/* Background */}
                    <rect x="0" y="0" width="200" height="314" fill={DS.bg1}/>
                    {/* Front arrow label */}
                    <text x="100" y="10" textAnchor="middle" fontSize="6" fill={DS.muted} fontFamily="var(--font-dm-mono)">↑ FRENTE</text>
                    {/* Zones */}
                    {CAR_ZONES.map(zone => {
                      const dmg = zoneMarkers[zone.id]
                      const isSelected = selectedZone === zone.id
                      return (
                        <g key={zone.id} onClick={() => setSelectedZone(isSelected ? null : zone.id)} style={{ cursor: 'pointer' }}>
                          <rect
                            x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx={2}
                            fill={dmg ? sevColor(dmg.severity) + '33' : DS.bg2}
                            stroke={isSelected ? DS.gold : dmg ? sevColor(dmg.severity) : DS.border2}
                            strokeWidth={isSelected ? 1.5 : 0.75}
                          />
                          {/* Damage marker dot */}
                          {dmg && (
                            <circle cx={zone.cx} cy={zone.cy} r={4} fill={sevColor(dmg.severity)} stroke={DS.bg} strokeWidth={1}/>
                          )}
                          {/* Zone label (small, center) */}
                          <text x={zone.cx} y={zone.cy + (dmg ? -8 : 2)} textAnchor="middle" fontSize="5" fill={DS.muted} fontFamily="var(--font-dm-mono)" style={{ pointerEvents: 'none' }}>
                            {zone.label.length > 18 ? zone.label.slice(0, 16) + '…' : zone.label}
                          </text>
                        </g>
                      )
                    })}
                    {/* Rear label */}
                    <text x="100" y="312" textAnchor="middle" fontSize="6" fill={DS.muted} fontFamily="var(--font-dm-mono)">↓ TRASERO</text>
                  </svg>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, justifyContent: 'center' }}>
                  {(['cosmetic', 'minor', 'major'] as Severity[]).map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: sevColor(s) }}/>
                      <span style={{ fontFamily: mono, fontSize: 9, color: DS.textDim }}>{sevLabel(s)}</span>
                    </div>
                  ))}
                </div>

                {/* Interior zones */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: mono, fontSize: 10, color: DS.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Interior &amp; otros</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {INTERIOR_ZONES.map(z => {
                      const dmg = zoneMarkers['interior_' + z]
                      return (
                        <button key={z}
                          onClick={() => setSelectedZone(selectedZone === 'interior_' + z ? null : 'interior_' + z)}
                          style={{
                            fontFamily: mono, fontSize: 10, padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                            background: dmg ? sevColor(dmg.severity) + '22' : DS.bg1,
                            border: `1px solid ${selectedZone === 'interior_' + z ? DS.gold : dmg ? sevColor(dmg.severity) : DS.border}`,
                            color: dmg ? sevColor(dmg.severity) : DS.textDim,
                          }}
                        >{z}</button>
                      )
                    })}
                  </div>
                </div>

                {/* Zone damage bottom sheet */}
                {selectedZone && (
                  <div style={{ background: DS.bg1, border: `1px solid ${DS.border}`, borderRadius: 14, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ fontFamily: inter, fontSize: 13, fontWeight: 600, color: DS.text }}>
                        {[...CAR_ZONES, ...INTERIOR_ZONES.map(z => ({ id: 'interior_' + z, label: z }))].find(z => z.id === selectedZone)?.label}
                      </div>
                      <button onClick={() => setSelectedZone(null)} style={{ background: 'none', border: 'none', color: DS.muted, cursor: 'pointer', fontSize: 16 }}>✕</button>
                    </div>

                    {/* Damage type */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontFamily: mono, fontSize: 9, color: DS.muted, marginBottom: 6, textTransform: 'uppercase' }}>Tipo de daño</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {(['Rayón', 'Abolladura', 'Grieta', 'Astilla', 'Pieza faltante', 'Mancha'] as DamageType[]).map(t => (
                          <button key={t} onClick={() => setNewDmg(p => ({ ...p, type: t }))} style={{
                            fontFamily: mono, fontSize: 9, padding: '4px 8px', borderRadius: 5, cursor: 'pointer', border: 'none',
                            background: newDmg.type === t ? DS.gold : DS.bg2,
                            color: newDmg.type === t ? DS.bg : DS.textDim,
                          }}>{t}</button>
                        ))}
                      </div>
                    </div>

                    {/* Severity */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontFamily: mono, fontSize: 9, color: DS.muted, marginBottom: 6, textTransform: 'uppercase' }}>Severidad</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {(['cosmetic', 'minor', 'major'] as Severity[]).map(s => (
                          <button key={s} onClick={() => setNewDmg(p => ({ ...p, severity: s }))} style={{
                            flex: 1, fontFamily: mono, fontSize: 9, padding: '6px', borderRadius: 6, cursor: 'pointer', border: 'none',
                            background: newDmg.severity === s ? sevColor(s) : DS.bg2,
                            color: newDmg.severity === s ? '#fff' : DS.textDim,
                            fontWeight: newDmg.severity === s ? 700 : 400,
                          }}>{sevLabel(s)}</button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontFamily: mono, fontSize: 9, color: DS.muted, marginBottom: 6, textTransform: 'uppercase' }}>Notas</div>
                      <textarea
                        value={newDmg.notes}
                        onChange={e => setNewDmg(p => ({ ...p, notes: e.target.value }))}
                        placeholder="Descripción adicional…"
                        rows={2}
                        style={{
                          width: '100%', boxSizing: 'border-box', padding: '8px 10px',
                          background: DS.bg2, border: `1px solid ${DS.border}`, borderRadius: 8,
                          fontFamily: mono, fontSize: 11, color: DS.text, resize: 'none', outline: 'none',
                        }}
                      />
                    </div>

                    {/* Photo guide */}
                    {PHOTO_GUIDE[selectedZone] && (
                      <div style={{ background: DS.blue + '18', border: `1px solid ${DS.blue}44`, borderRadius: 8, padding: '8px 10px', marginBottom: 10 }}>
                        <div style={{ fontFamily: mono, fontSize: 9, color: DS.blue, marginBottom: 3, fontWeight: 700, textTransform: 'uppercase' }}>📷 Guía de foto</div>
                        <div style={{ fontFamily: mono, fontSize: 10, color: DS.textDim, lineHeight: 1.5 }}>{PHOTO_GUIDE[selectedZone]}</div>
                      </div>
                    )}

                    {/* Photo slots */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontFamily: mono, fontSize: 9, color: DS.muted, marginBottom: 6, textTransform: 'uppercase' }}>Fotos</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} style={{
                            width: 64, height: 64, borderRadius: 8, cursor: 'pointer',
                            background: DS.bg2, border: `1.5px dashed ${DS.border2}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <span style={{ fontSize: 20, color: DS.muted }}>+</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Major damage warning */}
                    {newDmg.severity === 'major' && (
                      <div style={{ background: DS.red + '18', border: `1px solid ${DS.red}44`, borderRadius: 8, padding: '8px 10px', marginBottom: 10 }}>
                        <div style={{ fontFamily: mono, fontSize: 10, color: DS.red, fontWeight: 700 }}>⚠ Daño mayor — acciones automáticas</div>
                        <div style={{ fontFamily: mono, fontSize: 10, color: DS.textDim, marginTop: 4 }}>Se notificará al supervisor · Vehículo marcado para revisión</div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setZoneMarkers(p => ({ ...p, [selectedZone]: { ...newDmg } as ZoneDamage }))
                        setSelectedZone(null)
                      }}
                      style={{
                        width: '100%', padding: '10px', borderRadius: 8, cursor: 'pointer', border: 'none',
                        background: DS.gold, color: DS.bg, fontFamily: inter, fontSize: 12, fontWeight: 700,
                      }}
                    >
                      Guardar daño
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: '11px', borderRadius: 10, background: DS.bg1, border: `1px solid ${DS.border}`, color: DS.textDim, cursor: 'pointer', fontFamily: mono, fontSize: 11 }}>← Anterior</button>
                  <button onClick={() => setStep(3)} style={{ flex: 2, padding: '11px', borderRadius: 10, background: DS.gold, border: 'none', color: DS.bg, cursor: 'pointer', fontFamily: inter, fontSize: 12, fontWeight: 700 }}>
                    {Object.keys(zoneMarkers).length === 0 ? 'Sin daños → Fotos' : `${Object.keys(zoneMarkers).length} daño(s) → Fotos`}
                  </button>
                </div>
              </>
            )}

            {dmgTab === 'list' && (
              <div>
                {Object.entries(zoneMarkers).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: DS.muted, fontFamily: mono, fontSize: 12 }}>Sin daños registrados</div>
                ) : (
                  Object.entries(zoneMarkers).map(([zid, dmg]) => {
                    const zoneName = CAR_ZONES.find(z => z.id === zid)?.label ?? zid
                    return (
                      <div key={zid} style={{ background: DS.bg1, border: `1px solid ${DS.border}`, borderLeft: `3px solid ${sevColor(dmg.severity)}`, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: inter, fontSize: 12, fontWeight: 600, color: DS.text }}>{zoneName}</span>
                          <span style={{ fontFamily: mono, fontSize: 9, color: sevColor(dmg.severity), background: sevColor(dmg.severity) + '22', padding: '2px 6px', borderRadius: 4 }}>{sevLabel(dmg.severity)}</span>
                        </div>
                        <div style={{ fontFamily: mono, fontSize: 10, color: DS.textDim, marginTop: 3 }}>{dmg.type}{dmg.notes ? ' · ' + dmg.notes : ''}</div>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {dmgTab === 'photos' && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: DS.muted, fontFamily: mono, fontSize: 12 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📷</div>
                Agrega daños en el diagrama para adjuntar fotos por zona
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Photos */}
        {step === 3 && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ fontFamily: inter, fontSize: 14, fontWeight: 700, color: DS.text, marginBottom: 4 }}>Fotos por zona</div>
            <div style={{ fontFamily: mono, fontSize: 11, color: DS.muted, marginBottom: 16 }}>Capture todas las zonas requeridas antes de continuar.</div>

            {[
              { label: 'Frente del vehículo',  req: true,  guide: 'A 3m frente al vehículo, encuadre completo.' },
              { label: 'Lateral izquierdo',    req: true,  guide: 'A 4m del lateral, capture de parabrisas a luneta.' },
              { label: 'Lateral derecho',      req: true,  guide: 'A 4m del lateral derecho.' },
              { label: 'Parte trasera',        req: true,  guide: 'A 3m detrás del vehículo.' },
              { label: 'Interior / tablero',   req: true,  guide: 'Sentado en asiento conductor, capture todo el tablero.' },
              { label: 'Baúl',                 req: false, guide: 'Con baúl abierto, capture interior completo.' },
              ...Object.entries(zoneMarkers).map(([zid]) => ({
                label: CAR_ZONES.find(z => z.id === zid)?.label ?? zid,
                req: true,
                guide: PHOTO_GUIDE[zid] ?? '',
              })),
            ].map((zone, i) => (
              <div key={i} style={{ background: DS.bg1, border: `1px solid ${DS.border}`, borderRadius: 12, padding: '12px', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: inter, fontSize: 12, fontWeight: 600, color: DS.text }}>{zone.label}</span>
                  {zone.req && <span style={{ fontFamily: mono, fontSize: 9, color: DS.red, background: DS.red + '22', padding: '2px 6px', borderRadius: 4 }}>Requerido</span>}
                </div>
                {zone.guide && (
                  <div style={{ fontFamily: mono, fontSize: 10, color: DS.textDim, marginBottom: 8 }}>{zone.guide}</div>
                )}
                <div style={{ display: 'flex', gap: 6 }}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} style={{
                      width: 56, height: 56, borderRadius: 8,
                      background: DS.bg2, border: `1.5px dashed ${DS.border2}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>
                      <span style={{ fontSize: 18, color: DS.muted }}>+</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: '12px', borderRadius: 10, background: DS.bg1, border: `1px solid ${DS.border}`, color: DS.textDim, cursor: 'pointer', fontFamily: mono, fontSize: 11 }}>← Anterior</button>
              <button onClick={() => setStep(4)} style={{ flex: 2, padding: '12px', borderRadius: 10, background: DS.gold, border: 'none', color: DS.bg, cursor: 'pointer', fontFamily: inter, fontSize: 13, fontWeight: 700 }}>Firma y cierre →</button>
            </div>
          </div>
        )}

        {/* STEP 4 — Signature */}
        {step === 4 && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ fontFamily: inter, fontSize: 14, fontWeight: 700, color: DS.text, marginBottom: 16 }}>Resumen de inspección</div>

            {[
              ['Vehículo',      'Toyota Hilux'],
              ['Unidad',        'ABC-1234'],
              ['Placa',         'TUV-891'],
              ['Odómetro',      odometer + ' km'],
              ['Combustible',   Math.round((fuelLevel / 8) * 100) + '%'],
              ['Checklist',     `${checkedCount}/14 ítems`],
              ['Daños',         `${Object.keys(zoneMarkers).length} zona(s)`],
              ['Inspector',     'Rodrigo Martínez'],
              ['Fecha y hora',  'Lun 19 may · 09:45'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${DS.border}` }}>
                <span style={{ fontFamily: mono, fontSize: 11, color: DS.muted }}>{k}</span>
                <span style={{ fontFamily: mono, fontSize: 11, color: DS.textDim }}>{v}</span>
              </div>
            ))}

            <div style={{ marginTop: 20, marginBottom: 8 }}>
              <div style={{ fontFamily: mono, fontSize: 10, color: DS.textDim, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Firma del cliente</div>
              <div style={{
                height: 100, background: DS.bg1, border: `1px solid ${DS.border}`,
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: mono, fontSize: 11, color: DS.muted }}>Área de firma táctil</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: mono, fontSize: 10, color: DS.muted, marginBottom: 6 }}>Nombre del cliente</div>
              <input
                type="text"
                defaultValue="Juan Pérez"
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '10px 12px',
                  background: DS.bg1, border: `1px solid ${DS.border}`, borderRadius: 8,
                  fontFamily: mono, fontSize: 12, color: DS.text, outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep(3)} style={{ flex: 1, padding: '12px', borderRadius: 10, background: DS.bg1, border: `1px solid ${DS.border}`, color: DS.textDim, cursor: 'pointer', fontFamily: mono, fontSize: 11 }}>← Anterior</button>
              <button onClick={() => setSubmitted(true)} style={{ flex: 2, padding: '12px', borderRadius: 10, background: DS.green, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: inter, fontSize: 13, fontWeight: 700 }}>
                CONFIRMAR Y ENVIAR ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Screen 3 — QR Scan ───────────────────────────────────────────────────────
function Screen3_QR() {
  const [scanned, setScanned] = useState(false)
  return (
    <div style={{ padding: '16px', background: DS.bg, minHeight: '100%' }}>
      {!scanned ? (
        <>
          <div style={{ fontFamily: inter, fontSize: 16, fontWeight: 700, color: DS.text, marginBottom: 4 }}>Escanear QR</div>
          <div style={{ fontFamily: mono, fontSize: 11, color: DS.muted, marginBottom: 20 }}>Apunte la cámara al código QR del vehículo</div>
          <div
            onClick={() => setScanned(true)}
            style={{
              height: 280, background: DS.bg1, border: `2px dashed ${DS.gold}`,
              borderRadius: 16, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              gap: 12, marginBottom: 20, position: 'relative',
            }}
          >
            {/* Corner brackets */}
            {[{t:16,l:16,bt:'top',bl:'left'},{t:16,r:16,bt:'top',bl:'right'},{b:16,l:16,bt:'bottom',bl:'left'},{b:16,r:16,bt:'bottom',bl:'right'}].map((c,i) => (
              <div key={i} style={{
                position: 'absolute',
                top: 'top' in c ? (c as {t:number}).t : undefined,
                bottom: 'bottom' in c ? (c as {b:number}).b : undefined,
                left: 'left' in c ? (c as {l:number}).l : undefined,
                right: 'right' in c ? (c as {r:number}).r : undefined,
                width: 24, height: 24,
                borderTop: (c.bt === 'top') ? `2px solid ${DS.gold}` : 'none',
                borderBottom: (c.bt === 'bottom') ? `2px solid ${DS.gold}` : 'none',
                borderLeft: (c.bl === 'left') ? `2px solid ${DS.gold}` : 'none',
                borderRight: (c.bl === 'right') ? `2px solid ${DS.gold}` : 'none',
              }}/>
            ))}
            <div style={{ fontSize: 40 }}>📷</div>
            <div style={{ fontFamily: inter, fontSize: 14, fontWeight: 700, color: DS.gold }}>TAP PARA ESCANEAR QR</div>
            <div style={{ fontFamily: mono, fontSize: 11, color: DS.muted }}>O ingrese la placa manualmente</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="Placa o ID de unidad…"
              style={{
                flex: 1, padding: '11px 14px',
                background: DS.bg1, border: `1px solid ${DS.border}`, borderRadius: 10,
                fontFamily: mono, fontSize: 12, color: DS.text, outline: 'none',
              }}
            />
            <button style={{
              padding: '11px 18px', borderRadius: 10, background: DS.gold, border: 'none',
              color: DS.bg, fontFamily: inter, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>Buscar</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: inter, fontSize: 16, fontWeight: 700, color: DS.text }}>Vehículo encontrado</div>
            <button onClick={() => setScanned(false)} style={{ background: 'none', border: 'none', color: DS.muted, cursor: 'pointer', fontFamily: mono, fontSize: 11 }}>← Escanear otro</button>
          </div>

          <div style={{ background: DS.bg1, border: `1px solid ${DS.border}`, borderRadius: 14, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: bebas, fontSize: 22, color: DS.text, letterSpacing: '0.05em' }}>TOYOTA HILUX</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: DS.textDim }}>ABC-1234 · TUV-891</div>
              </div>
              <span style={{ fontFamily: mono, fontSize: 10, color: DS.green, background: DS.green + '22', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>Disponible</span>
            </div>
            {[
              ['Odómetro',         '45,230 km'],
              ['Última inspección', '12 mayo 2025'],
              ['Próximo servicio',  '15 jun 2025'],
              ['Alertas abiertas',  '2 activas'],
            ].map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderTop: `1px solid ${DS.border}` }}>
                <span style={{ fontFamily: mono, fontSize: 11, color: DS.muted }}>{k}</span>
                <span style={{ fontFamily: mono, fontSize: 11, color: i === 3 ? DS.red : DS.textDim }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Inspección Entrega', color: DS.blue  },
              { label: 'Mover a Taller',     color: DS.orange },
              { label: 'Crear Alerta',       color: DS.red   },
              { label: 'Ver Historial',      color: DS.muted },
            ].map(btn => (
              <button key={btn.label} style={{
                padding: '12px', borderRadius: 10, cursor: 'pointer',
                background: btn.color + '18', border: `1px solid ${btn.color}44`,
                color: btn.color, fontFamily: inter, fontSize: 11, fontWeight: 700,
              }}>{btn.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Screen 4 — Move to Maintenance ──────────────────────────────────────────
function Screen4_Move() {
  const [stage, setStage]       = useState<string>('')
  const [motivo, setMotivo]     = useState('')
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80%', padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔧</div>
      <div style={{ fontFamily: inter, fontSize: 18, fontWeight: 700, color: DS.orange }}>Vehículo enviado a taller</div>
      <div style={{ fontFamily: mono, fontSize: 12, color: DS.textDim, marginTop: 8 }}>Toyota Hilux · TUV-891</div>
      <div style={{ fontFamily: mono, fontSize: 11, color: DS.muted, marginTop: 4 }}>{stage}</div>
      <button onClick={() => { setConfirmed(false); setStage(''); setMotivo('') }}
        style={{ marginTop: 24, padding: '10px 24px', borderRadius: 10, background: DS.bg1, border: `1px solid ${DS.border}`, color: DS.textDim, cursor: 'pointer', fontFamily: mono, fontSize: 11 }}>
        Nueva operación
      </button>
    </div>
  )

  return (
    <div style={{ padding: '16px', background: DS.bg, minHeight: '100%' }}>
      <div style={{ background: DS.bg1, border: `1px solid ${DS.border}`, borderRadius: 12, padding: '12px', marginBottom: 16 }}>
        <div style={{ fontFamily: bebas, fontSize: 20, color: DS.text, letterSpacing: '0.05em' }}>TOYOTA HILUX</div>
        <div style={{ fontFamily: mono, fontSize: 11, color: DS.textDim }}>ABC-1234 · TUV-891</div>
        <span style={{ fontFamily: mono, fontSize: 9, color: DS.green, background: DS.green + '22', padding: '2px 7px', borderRadius: 4, marginTop: 6, display: 'inline-block' }}>Disponible</span>
      </div>

      <div style={{ fontFamily: mono, fontSize: 10, color: DS.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Etapa de mantenimiento</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {MAINTENANCE_STAGES.map(s => (
          <button key={s} onClick={() => setStage(s)} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
            background: stage === s ? DS.orange + '22' : DS.bg1,
            border: `1px solid ${stage === s ? DS.orange : DS.border}`,
            color: stage === s ? DS.orange : DS.textDim,
            fontFamily: mono, fontSize: 11, fontWeight: stage === s ? 700 : 400,
          }}>
            {s}
            {stage === s && <span style={{ fontSize: 14 }}>✓</span>}
          </button>
        ))}
      </div>

      <div style={{ fontFamily: mono, fontSize: 10, color: DS.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Motivo del traslado</div>
      <textarea
        value={motivo}
        onChange={e => setMotivo(e.target.value)}
        placeholder="Describe el problema o motivo del traslado…"
        rows={3}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '10px 12px', marginBottom: 14,
          background: DS.bg1, border: `1px solid ${DS.border}`, borderRadius: 10,
          fontFamily: mono, fontSize: 11, color: DS.text, resize: 'none', outline: 'none',
        }}
      />

      <div style={{ background: DS.red + '18', border: `1px solid ${DS.red}44`, borderRadius: 10, padding: '10px 12px', marginBottom: 16 }}>
        <div style={{ fontFamily: mono, fontSize: 10, color: DS.red, fontWeight: 700 }}>⚠ Atención</div>
        <div style={{ fontFamily: mono, fontSize: 10, color: DS.textDim, marginTop: 3 }}>Este vehículo pasará a estado <b>Fuera de Servicio</b> y no estará disponible para contratos.</div>
      </div>

      <button
        onClick={() => stage && setConfirmed(true)}
        style={{
          width: '100%', padding: '14px', borderRadius: 10, cursor: stage ? 'pointer' : 'not-allowed',
          background: stage ? DS.orange : DS.bg2,
          border: 'none', color: stage ? '#fff' : DS.muted,
          fontFamily: inter, fontSize: 14, fontWeight: 700,
          opacity: stage ? 1 : 0.5,
        }}
      >
        CONFIRMAR TRASLADO
      </button>
    </div>
  )
}

// ─── Screen 5 — Update Maintenance Status ────────────────────────────────────
function Screen5_Update() {
  const [currentStage, setCurrentStage] = useState(3)
  const [nextStage, setNextStage]       = useState<number | null>(null)
  const [updated, setUpdated]           = useState(false)

  if (updated) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80%', padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <div style={{ fontFamily: inter, fontSize: 18, fontWeight: 700, color: DS.green }}>Estado actualizado</div>
      <div style={{ fontFamily: mono, fontSize: 12, color: DS.textDim, marginTop: 8 }}>Ford Ranger · STU-456</div>
      <div style={{ fontFamily: mono, fontSize: 11, color: DS.gold, marginTop: 4 }}>{MAINTENANCE_STAGES[nextStage ?? currentStage]}</div>
      {(nextStage ?? currentStage) === 6 && (
        <div style={{ background: DS.green + '18', border: `1px solid ${DS.green}44`, borderRadius: 10, padding: '10px 14px', marginTop: 16 }}>
          <div style={{ fontFamily: mono, fontSize: 11, color: DS.green, fontWeight: 700 }}>Vehículo retorna a flota como Disponible</div>
        </div>
      )}
      <button onClick={() => { setUpdated(false); setNextStage(null) }}
        style={{ marginTop: 24, padding: '10px 24px', borderRadius: 10, background: DS.bg1, border: `1px solid ${DS.border}`, color: DS.textDim, cursor: 'pointer', fontFamily: mono, fontSize: 11 }}>
        Volver
      </button>
    </div>
  )

  return (
    <div style={{ padding: '16px', background: DS.bg, minHeight: '100%' }}>
      <div style={{ background: DS.bg1, border: `1px solid ${DS.border}`, borderRadius: 12, padding: '12px', marginBottom: 16 }}>
        <div style={{ fontFamily: bebas, fontSize: 20, color: DS.text, letterSpacing: '0.05em' }}>FORD RANGER</div>
        <div style={{ fontFamily: mono, fontSize: 11, color: DS.textDim }}>DEF-5678 · STU-456</div>
        <span style={{ fontFamily: mono, fontSize: 9, color: DS.orange, background: DS.orange + '22', padding: '2px 7px', borderRadius: 4, marginTop: 6, display: 'inline-block' }}>Fuera de servicio</span>
      </div>

      <div style={{ fontFamily: mono, fontSize: 10, color: DS.muted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pipeline de mantenimiento</div>

      {/* Visual pipeline */}
      <div style={{ background: DS.bg1, border: `1px solid ${DS.border}`, borderRadius: 14, padding: '14px', marginBottom: 16 }}>
        {MAINTENANCE_STAGES.map((s, i) => {
          const past    = i < currentStage
          const current = i === currentStage
          const future  = i > currentStage
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: i < MAINTENANCE_STAGES.length - 1 ? 16 : 0, position: 'relative' }}>
              {/* Line */}
              {i < MAINTENANCE_STAGES.length - 1 && (
                <div style={{ position: 'absolute', left: 11, top: 22, width: 2, height: 26, background: past ? DS.green : DS.border }}/>
              )}
              {/* Dot */}
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: past ? DS.green : current ? DS.gold : DS.bg2,
                border: `2px solid ${past ? DS.green : current ? DS.gold : DS.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {past && <span style={{ fontSize: 10, color: '#fff' }}>✓</span>}
                {current && <div style={{ width: 8, height: 8, borderRadius: '50%', background: DS.bg }}/>}
              </div>
              {/* Label */}
              <div style={{ paddingTop: 2 }}>
                <div style={{ fontFamily: mono, fontSize: 11, fontWeight: current ? 700 : 400, color: past ? DS.textDim : current ? DS.gold : DS.muted, opacity: future ? 0.5 : 1 }}>
                  {s}
                </div>
                {current && <div style={{ fontFamily: mono, fontSize: 9, color: DS.muted, marginTop: 1 }}>Estado actual</div>}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ fontFamily: mono, fontSize: 10, color: DS.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actualizar a siguiente etapa</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {MAINTENANCE_STAGES.slice(currentStage + 1).map((s, i) => {
          const idx = currentStage + 1 + i
          return (
            <button key={s} onClick={() => setNextStage(idx)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
              background: nextStage === idx ? DS.gold + '22' : DS.bg1,
              border: `1px solid ${nextStage === idx ? DS.gold : DS.border}`,
              color: nextStage === idx ? DS.gold : DS.textDim,
              fontFamily: mono, fontSize: 11, fontWeight: nextStage === idx ? 700 : 400,
            }}>
              {s}
              {nextStage === idx && <span>✓</span>}
            </button>
          )
        })}
      </div>

      {nextStage === 6 && (
        <div style={{ background: DS.green + '18', border: `1px solid ${DS.green}44`, borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>
          <div style={{ fontFamily: mono, fontSize: 11, color: DS.green, fontWeight: 700 }}>
            ✅ Vehículo retorna a flota como Disponible
          </div>
        </div>
      )}

      <button
        onClick={() => nextStage !== null && (setCurrentStage(nextStage), setUpdated(true))}
        style={{
          width: '100%', padding: '14px', borderRadius: 10,
          background: nextStage !== null ? DS.gold : DS.bg2,
          border: 'none', color: nextStage !== null ? DS.bg : DS.muted,
          fontFamily: inter, fontSize: 14, fontWeight: 700,
          cursor: nextStage !== null ? 'pointer' : 'not-allowed',
          opacity: nextStage !== null ? 1 : 0.5,
        }}
      >
        ACTUALIZAR ESTADO
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MobilePreviewPage() {
  const [activeScreen, setActiveScreen] = useState(1)
  const phoneRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null])

  function handleTab(id: number) {
    setActiveScreen(id)
    const el = phoneRefs.current[id - 1]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  const screens = [
    { label: 'Mis Tareas',     node: <Screen1_Home /> },
    { label: 'Inspección',     node: <Screen2_Inspection /> },
    { label: 'Escanear QR',    node: <Screen3_QR /> },
    { label: 'A Taller',       node: <Screen4_Move /> },
    { label: 'Estado Taller',  node: <Screen5_Update /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar active="Flota" />

      <main className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-7 pb-24 md:pb-16">
        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>
            Aplicación Móvil
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '4px 0 0' }}>
            Preview de pantallas para el equipo de campo — datos de ejemplo
          </p>
        </div>

        {/* Screen selector */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {SCREENS.map(s => (
            <button
              key={s.id}
              onClick={() => handleTab(s.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '10px 16px', borderRadius: 12, cursor: 'pointer',
                background: activeScreen === s.id ? B.ink : B.surface,
                border: `1px solid ${activeScreen === s.id ? B.ink : B.hairline}`,
                boxShadow: activeScreen === s.id ? 'none' : B.shadowSm,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: activeScreen === s.id ? '#fff' : B.ink }}>
                {s.label}
              </span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: activeScreen === s.id ? 'rgba(255,255,255,0.55)' : B.ink3 }}>
                {s.sub}
              </span>
            </button>
          ))}
        </div>

        {/* Phone frames row */}
        <div style={{
          display: 'flex', gap: 32, overflowX: 'auto', padding: '8px 4px 24px',
          scrollSnapType: 'x mandatory',
        }}>
          {screens.map((s, i) => (
            <div key={i} ref={el => { phoneRefs.current[i] = el }} style={{ scrollSnapAlign: 'center' }}>
              <PhoneFrame label={s.label} active={activeScreen === i + 1}>
                {s.node}
              </PhoneFrame>
            </div>
          ))}
        </div>
      </main>

      <BentoBottomNav active="flota" />
    </div>
  )
}
