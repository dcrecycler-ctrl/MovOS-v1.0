'use client'

import { useState } from 'react'
import { B, Tone } from '@/lib/tokens'
import { FleetStats } from '@/lib/supabase/queries/dashboard'
import { ModalPayload } from '@/components/dashboard/types'
import { KPIBento } from '@/components/dashboard/KPIBento'
import { SoftModal } from '@/components/dashboard/SoftModal'
import { SoftCard } from '@/components/ui/SoftCard'
import { SoftBadge } from '@/components/ui/SoftBadge'
import { DataTable, Column } from '@/components/ui/DataTable'
import { DrillModal } from '@/components/ui/DrillModal'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Vehicle { unit: string; plate: string; model: string; location: string }

interface PartRow extends Record<string, unknown> {
  id: string; unit: string; plate: string; part: string
  shop: string; days: number; priority: 'low' | 'medium' | 'high' | 'critical'
}

interface Workshop {
  id: string; name: string; city: string
  total: number; waiting: number; inRepair: number; inspection: number; cleared: number
  avgDays: number
}

type OpsModal =
  | { kind: 'vehicle-list'; title: string; subtitle: string; tone: Tone; vehicles: Vehicle[] }
  | { kind: 'part'; part: PartRow }
  | { kind: 'workshop'; shop: Workshop }

// ── Constants ─────────────────────────────────────────────────────────────────

const TONE_CLR: Record<Tone, string> = {
  blue: B.blue, green: B.green, amber: B.amber, rose: B.rose,
  lilac: B.lilac, sky: B.sky, ochre: B.ochre, neutral: B.ink3,
}

const PRIORITY_TONE: Record<string, Tone> = {
  critical: 'rose', high: 'amber', medium: 'sky', low: 'green',
}

const LOCATIONS = ['Todas', 'Montevideo Centro', 'Carrasco', 'Punta del Este', 'Colonia']

const FLEET_TOTAL = 47
const MAINT_POOL  = 8

// ── Mock data ─────────────────────────────────────────────────────────────────

const FLEET_STATES: Array<{
  id: string; label: string; tone: Tone; count: number; pct: number; vehicles: Vehicle[]
}> = [
  { id: 'assigned', label: 'Asignado', tone: 'blue', count: 21, pct: 45,
    vehicles: [
      { unit: 'PDE-001', plate: 'SBA 1234', model: 'Toyota Hilux 2022',    location: 'Punta del Este'    },
      { unit: 'PDE-002', plate: 'SBA 5678', model: 'Toyota Corolla 2023',  location: 'Punta del Este'    },
      { unit: 'MVD-001', plate: 'SBB 3344', model: 'Toyota Yaris 2022',    location: 'Montevideo Centro' },
      { unit: 'MVD-002', plate: 'SBB 5566', model: 'Ford Ranger 2021',     location: 'Montevideo Centro' },
      { unit: 'CAR-001', plate: 'SBC 7788', model: 'Toyota SW4 2021',      location: 'Carrasco'          },
      { unit: 'CAR-002', plate: 'SBD 6677', model: 'Toyota SW4 2022',      location: 'Carrasco'          },
      { unit: 'CLN-001', plate: 'SBF 5566', model: 'Toyota Hilux 2021',    location: 'Colonia'           },
      { unit: 'CLN-002', plate: 'SBF 7788', model: 'Renault Oroch 2022',   location: 'Colonia'           },
    ] },
  { id: 'available', label: 'Disponible', tone: 'green', count: 15, pct: 32,
    vehicles: [
      { unit: 'MVD-003', plate: 'SBC 1122', model: 'Chevrolet Onix 2023',  location: 'Montevideo Centro' },
      { unit: 'MVD-004', plate: 'SBC 3344', model: 'Peugeot 208 2022',     location: 'Montevideo Centro' },
      { unit: 'CAR-003', plate: 'SBE 8899', model: 'VW Taos 2023',         location: 'Carrasco'          },
      { unit: 'CLN-003', plate: 'SBG 1122', model: 'Fiat Strada 2022',     location: 'Colonia'           },
      { unit: 'PDE-003', plate: 'SBH 4455', model: 'Renault Sandero 2023', location: 'Punta del Este'    },
    ] },
  { id: 'for_cleaning', label: 'Para Limpieza', tone: 'sky', count: 4, pct: 9,
    vehicles: [
      { unit: 'PDE-004', plate: 'SBJ 2233', model: 'Chevrolet Tracker 2022', location: 'Punta del Este'    },
      { unit: 'MVD-005', plate: 'SBD 2233', model: 'Fiat Cronos 2021',       location: 'Montevideo Centro' },
      { unit: 'CAR-004', plate: 'SBE 1122', model: 'Chevrolet S10 2021',     location: 'Carrasco'          },
      { unit: 'CLN-004', plate: 'SBG 2233', model: 'Ford Fiesta 2023',       location: 'Colonia'           },
    ] },
  { id: 'for_inspection', label: 'Para Inspección', tone: 'amber', count: 4, pct: 9,
    vehicles: [
      { unit: 'PDE-005', plate: 'SCB 9900', model: 'Renault Duster 2022', location: 'Punta del Este'    },
      { unit: 'MVD-006', plate: 'SBD 4455', model: 'VW Virtus 2023',      location: 'Montevideo Centro' },
      { unit: 'CAR-005', plate: 'SBE 3344', model: 'Ford EcoSport 2022',  location: 'Carrasco'          },
      { unit: 'CLN-005', plate: 'SBG 4455', model: 'Renault Kwid 2023',   location: 'Colonia'           },
    ] },
  { id: 'on_service', label: 'En Servicio', tone: 'rose', count: 3, pct: 6,
    vehicles: [
      { unit: 'U-0142', plate: 'SBQ 3812', model: 'Toyota Hilux 2022',   location: 'Montevideo Centro' },
      { unit: 'U-0055', plate: 'SAX 4421', model: 'Renault Duster 2021', location: 'Punta del Este'    },
      { unit: 'U-0098', plate: 'SBG 4455', model: 'Fiat Palio 2020',     location: 'Carrasco'          },
    ] },
]

const MAINT_STAGES: Array<{
  id: string; label: string; tone: Tone; count: number; vehicles: Vehicle[]
}> = [
  { id: 'waiting',         label: 'Esp. Servicio',  tone: 'amber', count: 1,
    vehicles: [{ unit: 'U-0019', plate: 'SCB 2211', model: 'Chevrolet Tracker 2021', location: 'Montevideo Centro' }] },
  { id: 'assigned_tech',   label: 'Asig. Técnico',  tone: 'blue',  count: 1,
    vehicles: [{ unit: 'U-0087', plate: 'SBC 1243', model: 'Toyota Corolla 2023',    location: 'Carrasco'          }] },
  { id: 'diagnostic',      label: 'Diagnóstico',    tone: 'lilac', count: 1,
    vehicles: [{ unit: 'U-0032', plate: 'SBT 7766', model: 'Renault Sandero 2022',   location: 'Colonia'           }] },
  { id: 'waiting_parts',   label: 'Esp. Repuestos', tone: 'amber', count: 3,
    vehicles: [
      { unit: 'U-0142', plate: 'SBQ 3812', model: 'Toyota Hilux 2022',   location: 'Montevideo Centro' },
      { unit: 'U-0055', plate: 'SAX 4421', model: 'Renault Duster 2021', location: 'Punta del Este'    },
      { unit: 'U-0098', plate: 'SBG 4455', model: 'Fiat Palio 2020',     location: 'Carrasco'          },
    ] },
  { id: 'in_repair',       label: 'En Reparación',  tone: 'sky',   count: 2,
    vehicles: [
      { unit: 'U-0033', plate: 'SCB 1122', model: 'Ford EcoSport 2021', location: 'Montevideo Centro' },
      { unit: 'U-0067', plate: 'SBE 6677', model: 'VW Gol 2022',        location: 'Carrasco'          },
    ] },
  { id: 'post_inspection', label: 'Insp. Post-Rep.', tone: 'green', count: 0, vehicles: [] },
  { id: 'cleared',         label: 'Liberado',        tone: 'green', count: 0, vehicles: [] },
]

const PARTS: PartRow[] = [
  { id: 'p1', unit: 'U-0142', plate: 'SBQ 3812', part: 'Parabrisas delantero',      shop: 'Taller MVD Centro',     days: 3, priority: 'high'     },
  { id: 'p2', unit: 'U-0087', plate: 'SBC 1243', part: 'Pastillas de freno del.',   shop: 'Taller Carrasco',       days: 1, priority: 'medium'   },
  { id: 'p3', unit: 'U-0055', plate: 'SAX 4421', part: 'Correa de distribución',    shop: 'Taller Punta del Este', days: 6, priority: 'critical' },
  { id: 'p4', unit: 'U-0032', plate: 'SBT 7766', part: 'Amortiguador trasero der.', shop: 'Taller Colonia',        days: 2, priority: 'medium'   },
  { id: 'p5', unit: 'U-0019', plate: 'SCB 2211', part: 'Bomba de aceite',           shop: 'Taller MVD Centro',     days: 8, priority: 'critical' },
  { id: 'p6', unit: 'U-0098', plate: 'SBG 4455', part: 'Filtro de aire',            shop: 'Taller Carrasco',       days: 0, priority: 'low'      },
]

const WORKSHOPS: Workshop[] = [
  { id: 'w1', name: 'Taller MVD Centro',     city: 'Montevideo',     total: 3, waiting: 1, inRepair: 1, inspection: 1, cleared: 0, avgDays: 4.2 },
  { id: 'w2', name: 'Taller Carrasco',       city: 'Montevideo',     total: 2, waiting: 0, inRepair: 2, inspection: 0, cleared: 1, avgDays: 2.8 },
  { id: 'w3', name: 'Taller Punta del Este', city: 'Punta del Este', total: 2, waiting: 1, inRepair: 1, inspection: 0, cleared: 0, avgDays: 6.1 },
  { id: 'w4', name: 'Taller Colonia',        city: 'Colonia',        total: 1, waiting: 1, inRepair: 0, inspection: 0, cleared: 0, avgDays: 2.0 },
]

// ── Parts table columns ───────────────────────────────────────────────────────

const PARTS_COLS: Column<PartRow>[] = [
  {
    key: 'unit', header: 'Vehículo', width: 85,
    render: (v) => <span style={{ fontFamily: 'var(--font-dm-mono)', fontWeight: 700, fontSize: 12, color: B.amber }}>{String(v)}</span>,
  },
  { key: 'plate', header: 'Placa',    width: 88 },
  { key: 'part',  header: 'Repuesto' },
  { key: 'shop',  header: 'Taller',   width: 170 },
  {
    key: 'days', header: 'Días', width: 55, align: 'right',
    render: (v) => {
      const n = Number(v)
      return <span style={{ fontFamily: 'var(--font-dm-mono)', fontWeight: 700, fontSize: 13, color: n >= 5 ? B.rose : n >= 3 ? B.amber : B.ink3 }}>{n}</span>
    },
  },
  {
    key: 'priority', header: 'Prioridad', width: 100,
    render: (v) => <SoftBadge tone={PRIORITY_TONE[String(v)] ?? 'amber'} size={10}>{String(v).toUpperCase()}</SoftBadge>,
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 14, marginTop: 8 }}>
      <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, marginTop: 4, marginBottom: 0 }}>{sub}</p>
    </div>
  )
}

function Arrow() {
  return (
    <div className="hidden lg:flex items-center" style={{ color: B.ink4, padding: '0 2px', flexShrink: 0 }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </div>
  )
}

function ProgBar({ count, total, tone }: { count: number; total: number; tone: Tone }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ height: 4, background: B.surface3, borderRadius: 9999, overflow: 'hidden', marginTop: 8 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: count === 0 ? B.ink4 : TONE_CLR[tone], borderRadius: 9999 }} />
    </div>
  )
}

function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
  const [loc, setLoc] = useState('Todas')
  const shown = loc === 'Todas' ? vehicles : vehicles.filter(v => v.location === loc)
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {LOCATIONS.map(l => (
          <button key={l} onClick={() => setLoc(l)} style={{
            padding: '4px 12px', borderRadius: 9999, cursor: 'pointer',
            border: `1px solid ${loc === l ? B.blue : B.hairline}`,
            background: loc === l ? B.blueSoft : B.surface2,
            color: loc === l ? B.blue : B.ink3,
            fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 500,
          }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${B.hairline}` }}>
        {shown.length === 0
          ? <div style={{ padding: '24px 0', textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>Sin vehículos</div>
          : shown.map((v, i) => (
            <div key={v.unit} style={{
              display: 'grid', gridTemplateColumns: '80px 88px 1fr 120px',
              alignItems: 'center', gap: '0 10px', padding: '10px 16px',
              borderBottom: i < shown.length - 1 ? `1px solid ${B.hairline}` : 'none',
              background: i % 2 === 0 ? B.surface : B.surface2,
            }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, fontWeight: 700, color: B.amber }}>{v.unit}</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3 }}>{v.plate}</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.model}</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, textAlign: 'right' }}>{v.location}</span>
            </div>
          ))
        }
      </div>
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 8, textAlign: 'right' }}>
        {shown.length} de {vehicles.length} vehículos
      </p>
    </div>
  )
}

function WorkshopDetail({ shop }: { shop: Workshop }) {
  const stages = [
    { label: 'Esperando',     value: shop.waiting,    tone: 'amber' as Tone },
    { label: 'En Reparación', value: shop.inRepair,   tone: 'blue'  as Tone },
    { label: 'Inspección',    value: shop.inspection, tone: 'sky'   as Tone },
    { label: 'Liberado',      value: shop.cleared,    tone: 'green' as Tone },
  ]
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
        {stages.map(s => (
          <div key={s.label} style={{ padding: '14px 16px', background: B.surface2, borderRadius: B.radiusSm }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: s.value > 0 ? TONE_CLR[s.tone] : B.ink4 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: B.surface2, borderRadius: B.radiusSm }}>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>Promedio días en sistema</span>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 15, fontWeight: 700, color: shop.avgDays >= 5 ? B.rose : B.amber }}>{shop.avgDays}</span>
      </div>
    </div>
  )
}

function PartDetail({ part }: { part: PartRow }) {
  const tone = PRIORITY_TONE[part.priority] ?? 'amber'
  const rows = [
    { label: 'Vehículo',  value: String(part.unit)  },
    { label: 'Placa',     value: String(part.plate) },
    { label: 'Repuesto',  value: String(part.part)  },
    { label: 'Taller',    value: String(part.shop)  },
    { label: 'Días esp.', value: String(part.days)  },
  ]
  return (
    <div>
      <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${B.hairline}`, marginBottom: 14 }}>
        {rows.map((row, idx) => (
          <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', borderBottom: idx < rows.length - 1 ? `1px solid ${B.hairline}` : 'none' }}>
            <div style={{ padding: '10px 14px', background: idx % 2 === 0 ? B.surface2 : B.surface, fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3 }}>{row.label}</div>
            <div style={{ padding: '10px 14px', background: idx % 2 === 0 ? B.surface2 : B.surface, fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink, borderLeft: `1px solid ${B.hairline}` }}>{row.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: B.surface2, borderRadius: B.radiusSm }}>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>Prioridad</span>
        <SoftBadge tone={tone} size={11}>{String(part.priority).toUpperCase()}</SoftBadge>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function OperationsContent({ stats }: { stats: FleetStats }) {
  const [kpiModal, setKpiModal] = useState<ModalPayload | null>(null)
  const [opsModal, setOpsModal] = useState<OpsModal | null>(null)

  return (
    <>
      <main className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-7 pb-24 md:pb-16">

        {/* Page header — matches Tablero */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>Operaciones</h1>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '4px 0 0' }}>
              Estado de flota · Ciclo de mantenimiento · Riesgo operacional
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 9999, background: B.surface, border: `1px solid ${B.hairline}`, boxShadow: B.shadowSm, fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Hoy
          </div>
        </div>

        {/* Row 1 — KPIs: exact Tablero reuse */}
        <KPIBento data={stats} openModal={setKpiModal} />

        {/* Row 2 — Operations Cycle */}
        <div className="mb-3.5">
          <SectionHeader
            title="Ciclo Operacional"
            sub={`${FLEET_TOTAL} vehículos · estado operativo actual`}
          />
          <div className="flex overflow-x-auto pb-2" style={{ gap: 10, scrollSnapType: 'x mandatory' }}>
            {FLEET_STATES.flatMap((state, i) => {
              const card = (
                <div
                  key={state.id}
                  style={{ width: 'clamp(148px, 18vw, 220px)', flexShrink: 0, scrollSnapAlign: 'start' }}
                >
                  <SoftCard
                    padding={20}
                    onClick={() => setOpsModal({
                      kind: 'vehicle-list',
                      title: state.label,
                      subtitle: `${state.count} vehículos · ${state.pct}% de la flota`,
                      tone: state.tone,
                      vehicles: state.vehicles,
                    })}
                    style={{ height: '100%' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: B.ink2 }}>{state.label}</span>
                      <SoftBadge tone={state.tone} size={10}>{state.pct}%</SoftBadge>
                    </div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 36, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: state.count === 0 ? B.ink4 : TONE_CLR[state.tone] }}>
                      {state.count}
                    </div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 4 }}>vehículos</div>
                  </SoftCard>
                </div>
              )
              return i < FLEET_STATES.length - 1 ? [card, <Arrow key={`fa${i}`} />] : [card]
            })}
          </div>
        </div>

        {/* Row 3 — Maintenance Pipeline */}
        <div className="mb-3.5">
          <SectionHeader
            title="Pipeline de Mantenimiento"
            sub={`${MAINT_POOL} vehículos en proceso · ciclo completo`}
          />
          <div className="flex overflow-x-auto pb-2" style={{ gap: 10, scrollSnapType: 'x mandatory' }}>
            {MAINT_STAGES.flatMap((stage, i) => {
              const card = (
                <div
                  key={stage.id}
                  style={{ width: 'clamp(130px, 14vw, 175px)', flexShrink: 0, scrollSnapAlign: 'start' }}
                >
                  <SoftCard
                    padding={16}
                    onClick={stage.count > 0
                      ? () => setOpsModal({ kind: 'vehicle-list', title: stage.label, subtitle: `${stage.count} vehículos en esta etapa`, tone: stage.tone, vehicles: stage.vehicles })
                      : undefined}
                    style={{ height: '100%', opacity: stage.count === 0 ? 0.5 : 1 }}
                  >
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600, color: B.ink2, marginBottom: 10, lineHeight: 1.3, minHeight: 28 }}>{stage.label}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 30, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: stage.count === 0 ? B.ink4 : TONE_CLR[stage.tone] }}>
                      {stage.count}
                    </div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: B.ink3, marginTop: 2 }}>
                      {MAINT_POOL > 0 ? Math.round((stage.count / MAINT_POOL) * 100) : 0}% del pool
                    </div>
                    <ProgBar count={stage.count} total={MAINT_POOL} tone={stage.tone} />
                  </SoftCard>
                </div>
              )
              return i < MAINT_STAGES.length - 1 ? [card, <Arrow key={`ma${i}`} />] : [card]
            })}
          </div>
        </div>

        {/* Row 4 — Risk Layer */}
        <SectionHeader title="Riesgo Operacional" sub="Repuestos en espera · carga por taller" />
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-5">

          {/* 4A — Parts Alerts */}
          <div className="lg:col-span-3">
            <SoftCard padding={0} style={{ overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${B.hairline}` }}>
                <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>Repuestos en Espera</h3>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, marginTop: 3, marginBottom: 0 }}>{PARTS.length} solicitudes activas</p>
              </div>
              <DataTable
                columns={PARTS_COLS}
                rows={PARTS}
                onRowClick={(row) => setOpsModal({ kind: 'part', part: row })}
              />
            </SoftCard>
          </div>

          {/* 4B — Workshop Load */}
          <div className="lg:col-span-2 flex flex-col gap-2.5">
            {WORKSHOPS.map(shop => (
              <SoftCard key={shop.id} padding={16} onClick={() => setOpsModal({ kind: 'workshop', shop })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.ink, letterSpacing: '-0.01em' }}>{shop.name}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 2 }}>{shop.city}</div>
                  </div>
                  <SoftBadge tone="rose" size={10}>{shop.total} veh.</SoftBadge>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                  {([
                    { l: 'Esp.',  v: shop.waiting,    tone: 'amber' as Tone },
                    { l: 'Rep.',  v: shop.inRepair,   tone: 'blue'  as Tone },
                    { l: 'Insp.', v: shop.inspection, tone: 'sky'   as Tone },
                    { l: 'Lib.',  v: shop.cleared,    tone: 'green' as Tone },
                  ]).map(s => (
                    <div key={s.l} style={{ textAlign: 'center', padding: '6px 4px', background: B.surface2, borderRadius: 8 }}>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: s.v > 0 ? TONE_CLR[s.tone] : B.ink4 }}>{s.v}</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: B.ink3, marginTop: 1 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>Prom. días</span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, fontWeight: 700, color: shop.avgDays >= 5 ? B.rose : B.amber }}>{shop.avgDays}</span>
                </div>
              </SoftCard>
            ))}
          </div>
        </div>

      </main>

      {/* KPI modal — exact Tablero reuse */}
      <SoftModal modal={kpiModal} onClose={() => setKpiModal(null)} />

      {/* Operations drill-down modal */}
      {opsModal && (
        <DrillModal
          title={
            opsModal.kind === 'vehicle-list' ? opsModal.title :
            opsModal.kind === 'workshop'     ? opsModal.shop.name :
            String(opsModal.part.part)
          }
          subtitle={
            opsModal.kind === 'vehicle-list' ? opsModal.subtitle :
            opsModal.kind === 'workshop'     ? `${opsModal.shop.city} · ${opsModal.shop.total} vehículos` :
            `${String(opsModal.part.unit)} · ${String(opsModal.part.shop)}`
          }
          color={
            opsModal.kind === 'vehicle-list' ? TONE_CLR[opsModal.tone] :
            opsModal.kind === 'workshop'     ? B.rose :
            TONE_CLR[PRIORITY_TONE[opsModal.part.priority] ?? 'amber']
          }
          onClose={() => setOpsModal(null)}
        >
          {opsModal.kind === 'vehicle-list' && <VehicleList vehicles={opsModal.vehicles} />}
          {opsModal.kind === 'workshop'     && <WorkshopDetail shop={opsModal.shop} />}
          {opsModal.kind === 'part'         && <PartDetail part={opsModal.part} />}
        </DrillModal>
      )}

      <BentoBottomNav />
    </>
  )
}
