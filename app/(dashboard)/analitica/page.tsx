'use client'

import { B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { SoftCard } from '@/components/ui/SoftCard'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'

// ─── Design helpers ───────────────────────────────────────────────────────────

function SecHead({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 10, borderLeft: `3px solid ${color}`, marginBottom: 18 }}>
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  )
}

function BigNum({ value, color, unit }: { value: string; color: string; unit?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
      <span style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 52, color, lineHeight: 1 }}>{value}</span>
      {unit && <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 14, color: B.ink3 }}>{unit}</span>}
    </div>
  )
}

function SubText({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, marginBottom: 16 }}>{children}</div>
}

function BarRow({ label, value, pct, color, suffix = '%' }: { label: string; value?: string | number; pct: number; color: string; suffix?: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: B.ink, fontWeight: 500 }}>{value ?? pct}{suffix}</span>
      </div>
      <div style={{ height: 6, background: B.surface2, borderRadius: 9999, overflow: 'hidden' }}>
        <div style={{ height: 6, width: `${pct}%`, background: color, borderRadius: 9999, transition: 'width 0.3s ease' }} />
      </div>
    </div>
  )
}

function Pill({ children, fg, bg }: { children: React.ReactNode; fg: string; bg: string }) {
  return (
    <span style={{ padding: '2px 8px', borderRadius: 9999, fontFamily: 'var(--font-dm-mono)', fontSize: 10, fontWeight: 600, color: fg, background: bg, whiteSpace: 'nowrap' as const }}>
      {children}
    </span>
  )
}

function TH({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: '8px 10px', textAlign: 'left' as const, fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, fontWeight: 600, letterSpacing: '0.06em', whiteSpace: 'nowrap' as const, borderBottom: `1px solid ${B.hairline}` }}>{String(children).toUpperCase()}</th>
}
function TD({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <td style={{ padding: '9px 10px', fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2, textAlign: right ? 'right' as const : 'left' as const, whiteSpace: 'nowrap' as const }}>{children}</td>
}

function HorizBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <div style={{ width: 90, flexShrink: 0, fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink2, textAlign: 'right' as const }}>{label}</div>
      <div style={{ flex: 1, height: 8, background: B.surface2, borderRadius: 9999, overflow: 'hidden' }}>
        <div style={{ height: 8, width: `${(value / max) * 100}%`, background: color, borderRadius: 9999 }} />
      </div>
      <div style={{ width: 40, fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink, textAlign: 'right' as const }}>{value}</div>
    </div>
  )
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const UTIL_BY_CATEGORY = [
  { cat: 'Economy', pct: 88, color: B.green  },
  { cat: 'Compact', pct: 84, color: B.green  },
  { cat: 'Midsize', pct: 79, color: B.amber  },
  { cat: 'Van',     pct: 74, color: B.amber  },
  { cat: 'SUV',     pct: 71, color: B.amber  },
  { cat: 'Premium', pct: 68, color: B.ochre  },
  { cat: 'Pickup',  pct: 61, color: B.ochre  },
]

const DOWNTIME_SPLIT = [
  { label: 'Mantenimiento planificado',      days: 58, color: B.amber },
  { label: 'Reparaciones no planificadas',   days: 64, color: B.rose  },
  { label: 'Inspecciones pendientes',        days: 20, color: B.ochre },
]
const DOWNTIME_TOP5 = [
  { unit: 'MV-018', model: 'Toyota Hilux',     days: 12, reason: 'Chapa y pintura' },
  { unit: 'MV-042', model: 'VW Amarok',        days:  9, reason: 'Motor'          },
  { unit: 'MV-077', model: 'Honda CR-V',       days:  8, reason: 'Transmisión'    },
  { unit: 'MV-031', model: 'Chevrolet S10',    days:  7, reason: 'Suspensión'     },
  { unit: 'MV-055', model: 'Ford Ranger',      days:  6, reason: 'Eléctrico'      },
]
const DOWNTIME_TOTAL = DOWNTIME_SPLIT.reduce((s, d) => s + d.days, 0)

const REV_TOP5 = [
  { unit: 'MV-012', model: 'Toyota Yaris',    revenue: '$4,200', rentals: 8  },
  { unit: 'MV-019', model: 'Renault Duster',  revenue: '$3,900', rentals: 6  },
  { unit: 'MV-004', model: 'VW Polo',         revenue: '$3,600', rentals: 9  },
  { unit: 'MV-033', model: 'Chevrolet Onix',  revenue: '$3,400', rentals: 7  },
  { unit: 'MV-067', model: 'Toyota Corolla',  revenue: '$3,200', rentals: 5  },
]

const MAINT_SPLIT = [
  { label: 'Mano de obra',        value: 16200, color: B.lilac },
  { label: 'Repuestos',           value: 14800, color: B.blue  },
  { label: 'Talleres externos',   value:  7400, color: B.amber },
]
const MAINT_TOTAL = MAINT_SPLIT.reduce((s, m) => s + m.value, 0)

const MAINT_BY_CAT = [
  { cat: 'Economy', vehicles: 42, total: 6200,  avg: 148,  trend: '→' as const, tc: B.ink3 },
  { cat: 'Compact', vehicles: 38, total: 8400,  avg: 221,  trend: '↑' as const, tc: B.rose  },
  { cat: 'Midsize', vehicles: 35, total: 9800,  avg: 280,  trend: '↑' as const, tc: B.rose  },
  { cat: 'SUV',     vehicles: 48, total: 7200,  avg: 150,  trend: '↓' as const, tc: B.green },
  { cat: 'Premium', vehicles: 22, total: 4800,  avg: 218,  trend: '→' as const, tc: B.ink3  },
  { cat: 'Van',     vehicles: 18, total: 1600,  avg:  89,  trend: '↓' as const, tc: B.green },
  { cat: 'Pickup',  vehicles: 45, total:  400,  avg:   9,  trend: '↓' as const, tc: B.green },
]
const MAINT_TOP5 = [
  { unit: 'MV-042', model: 'VW Amarok',      cost: '$3,200', reason: 'Motor'        },
  { unit: 'MV-018', model: 'Toyota Hilux',   cost: '$2,800', reason: 'Carrocería'   },
  { unit: 'MV-077', model: 'Honda CR-V',     cost: '$2,400', reason: 'Transmisión'  },
  { unit: 'MV-031', model: 'Chevrolet S10',  cost: '$1,900', reason: 'Suspensión'   },
  { unit: 'MV-055', model: 'Ford Ranger',    cost: '$1,600', reason: 'Eléctrico'    },
]

const INSPECTORS = [
  { name: 'Carlos Benítez',  total: 48, avgMin: 21, damage: 18, score: 9.4, tone: B.green },
  { name: 'Valeria Romero',  total: 44, avgMin: 22, damage: 15, score: 9.0, tone: B.green },
  { name: 'Diego Fernández', total: 37, avgMin: 19, damage: 14, score: 9.1, tone: B.green },
  { name: 'Laura Sosa',      total: 41, avgMin: 25, damage: 11, score: 8.7, tone: B.amber },
  { name: 'Martín Torres',   total: 29, avgMin: 28, damage:  7, score: 7.8, tone: B.rose  },
]

const BRANCHES_DATA = [
  { name: 'Montevideo C.', flota: 82, available: 48, util: 78, maintCost: 14200, inspections: 62, incidents: 8  },
  { name: 'Pocitos',        flota: 67, available: 38, util: 74, maintCost: 10800, inspections: 51, incidents: 5  },
  { name: 'Malvín',         flota: 54, available: 32, util: 71, maintCost:  8400, inspections: 45, incidents: 6  },
  { name: 'Carrasco',       flota: 45, available: 24, util: 68, maintCost:  5000, inspections: 41, incidents: 4  },
]
const BRANCH_COLORS = [B.blue, B.green, B.amber, B.lilac]

const DAMAGE_TYPES = [
  { type: 'Rayón',          count: 87, pct: 32 },
  { type: 'Abolladura',     count: 64, pct: 23 },
  { type: 'Fisura',         count: 41, pct: 15 },
  { type: 'Chip de pintura',count: 38, pct: 14 },
  { type: 'Pieza faltante', count: 21, pct:  8 },
  { type: 'Otros',          count: 22, pct:  8 },
]
const DAMAGE_ZONES = [
  { zone: 'Parachoques delantero',   count: 42 },
  { zone: 'Puerta delantera der.',   count: 38 },
  { zone: 'Puerta trasera izq.',     count: 31 },
  { zone: 'Parachoques trasero',     count: 28 },
  { zone: 'Capó',                    count: 22 },
]
const DAMAGE_BY_CAT = [
  { cat: 'SUV',     incidents: 71 },
  { cat: 'Pickup',  incidents: 58 },
  { cat: 'Compact', incidents: 43 },
  { cat: 'Economy', incidents: 39 },
  { cat: 'Midsize', incidents: 34 },
]

const REPAIR_BY_LOCATION = [
  { label: 'Taller interno',      avg: 2.4, pct: 68, color: B.green },
  { label: 'Dealer autorizado',   avg: 5.2, pct: 22, color: B.amber },
  { label: 'Especialista externo',avg: 8.7, pct: 10, color: B.rose  },
]
const BOTTLENECK = [
  { label: 'En espera',            days: 0.8, pct: 21, color: B.sky  },
  { label: 'Diagnóstico',          days: 0.6, pct: 16, color: B.blue },
  { label: 'Esperando repuestos',  days: 1.4, pct: 37, color: B.rose },
  { label: 'En reparación',        days: 1.0, pct: 26, color: B.amber},
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnaliticaPage() {
  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar active="Analítica" />

      <main className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-7 pb-24 md:pb-16">

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>Analítica</h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '4px 0 0' }}>Mayo 2025 · Flota activa en 4 sucursales Uruguay</p>
        </div>

        {/* ROW 1 — KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 mb-5 items-stretch">
          {/* Hero */}
          <div className="col-span-2 lg:col-span-1 min-w-0 h-full flex flex-col">
            <SoftCard padding={20} big style={{ height: '100%' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, fontWeight: 500, marginBottom: 2 }}>Utilización de flota</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink4, marginBottom: 14 }}>Mes en curso</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 56, color: B.ink, letterSpacing: '-0.02em', lineHeight: 0.9 }}>73</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 20, color: B.ink2 }}>%</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ padding: '3px 8px', borderRadius: 9999, background: B.greenSoft, color: B.green, fontFamily: 'var(--font-dm-mono)', fontSize: 10, fontWeight: 600 }}>↑ 4.2 pts</span>
                </div>
              </div>
            </SoftCard>
          </div>
          {[
            { label: 'Disponibles',     value: '142', delta: '↑ 8 hoy',        sub: 'Listos para renta', dc: B.green },
            { label: 'Asignados',       value: '87',  delta: '12 vuelven hoy', sub: '',                  dc: B.blue  },
            { label: 'Flota total',     value: '248', delta: '4 sucursales',   sub: 'Activos',           dc: B.sky   },
            { label: 'Fuera de servicio',value: '19', delta: '8 taller',       sub: '',                  dc: B.rose  },
          ].map(k => (
            <div key={k.label} className="min-w-0 h-full flex flex-col">
              <SoftCard style={{ height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500 }}>{k.label}</span>
                    <span style={{ padding: '2px 7px', borderRadius: 9999, background: `${k.dc}18`, color: k.dc, fontFamily: 'var(--font-dm-mono)', fontSize: 9, fontWeight: 600, flexShrink: 0 }}>{k.delta}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 28, fontWeight: 600, color: B.ink, letterSpacing: '-0.03em', lineHeight: 1 }}>{k.value}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: k.sub ? B.ink3 : 'transparent', marginTop: 5, minHeight: 14 }}>{k.sub || ' '}</div>
                  </div>
                </div>
              </SoftCard>
            </div>
          ))}
        </div>

        {/* ROW 2 — Utilization | Downtime | Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 mb-3.5">

          {/* Fleet Utilization */}
          <SoftCard padding={24}>
            <SecHead label="Utilización de Flota" color={B.blue} />
            <BigNum value="73.4" unit="%" color={B.amber} />
            <SubText>promedio flota completa</SubText>
            {UTIL_BY_CATEGORY.map(u => (
              <BarRow key={u.cat} label={u.cat} pct={u.pct} color={u.color} />
            ))}
          </SoftCard>

          {/* Downtime */}
          <SoftCard padding={24}>
            <SecHead label="Análisis de Inactividad" color={B.amber} />
            <BigNum value={String(DOWNTIME_TOTAL)} unit="días" color={B.rose} />
            <SubText>inactividad total este mes</SubText>
            <div style={{ marginBottom: 16 }}>
              {DOWNTIME_SPLIT.map(d => (
                <BarRow key={d.label} label={d.label} value={`${d.days}d`} pct={Math.round(d.days / DOWNTIME_TOTAL * 100)} color={d.color} suffix="" />
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${B.hairline}`, paddingTop: 14 }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, letterSpacing: '0.06em', marginBottom: 10 }}>TOP 5 VEHÍCULOS CON MÁS INACTIVIDAD</div>
              {DOWNTIME_TOP5.map((v, i) => (
                <div key={v.unit} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, width: 14, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.blue, fontWeight: 600, width: 48, flexShrink: 0 }}>{v.unit}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.model}</span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.rose, fontWeight: 600, flexShrink: 0 }}>{v.days}d</span>
                  <Pill fg={B.amber} bg={B.amberSoft}>{v.reason}</Pill>
                </div>
              ))}
            </div>
          </SoftCard>

          {/* Revenue */}
          <SoftCard padding={24}>
            <SecHead label="Ingresos" color={B.green} />
            <BigNum value="$284k" color={B.green} />
            <SubText>facturado este mes</SubText>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Renta corto plazo',      value: '$112,000', pct: 39, color: B.blue  },
                { label: 'Contratos largo plazo',  value: '$172,500', pct: 61, color: B.amber },
              ].map(r => (
                <div key={r.label} style={{ padding: '12px 14px', borderRadius: 12, background: B.surface2 }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginBottom: 6 }}>{r.label}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 16, fontWeight: 600, color: r.color, letterSpacing: '-0.02em' }}>{r.value}</div>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, marginTop: 2 }}>{r.pct}% del total</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '8px 12px', borderRadius: 10, background: B.greenSoft }}>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.green }}>vs mes anterior</span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, color: B.green, fontWeight: 700, marginLeft: 'auto' }}>+6.2%</span>
            </div>
            <div style={{ borderTop: `1px solid ${B.hairline}`, paddingTop: 14 }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, letterSpacing: '0.06em', marginBottom: 10 }}>TOP 5 VEHÍCULOS MÁS RENTABLES</div>
              {REV_TOP5.map((v, i) => (
                <div key={v.unit} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, width: 14, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.blue, fontWeight: 600, width: 48, flexShrink: 0 }}>{v.unit}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.model}</span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.green, fontWeight: 600, flexShrink: 0 }}>{v.revenue}</span>
                  <Pill fg={B.sky} bg={B.skySoft}>{v.rentals} rentas</Pill>
                </div>
              ))}
            </div>
          </SoftCard>
        </div>

        {/* ROW 3 — Maintenance costs | Inspection quality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-3.5">

          {/* Maintenance costs */}
          <SoftCard padding={24}>
            <SecHead label="Costos de Mantenimiento" color={B.lilac} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 48, color: B.lilac, lineHeight: 1 }}>${(MAINT_TOTAL / 1000).toFixed(1)}k</span>
            </div>
            <SubText>costo total este mes</SubText>
            <div style={{ marginBottom: 18 }}>
              {MAINT_SPLIT.map(m => (
                <BarRow key={m.label} label={m.label} value={`$${(m.value / 1000).toFixed(1)}k`} pct={Math.round(m.value / MAINT_TOTAL * 100)} color={m.color} suffix="" />
              ))}
            </div>
            <div style={{ overflowX: 'auto', marginBottom: 18 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-inter)' }}>
                <thead>
                  <tr><TH>Categoría</TH><TH>Vehículos</TH><TH>Total</TH><TH>Prom./veh</TH><TH>Tend.</TH></tr>
                </thead>
                <tbody>
                  {MAINT_BY_CAT.map((r, i) => (
                    <tr key={r.cat} style={{ borderBottom: i < MAINT_BY_CAT.length - 1 ? `1px solid ${B.hairline}` : 'none' }}>
                      <TD>{r.cat}</TD>
                      <TD right>{r.vehicles}</TD>
                      <TD right>${r.total.toLocaleString()}</TD>
                      <TD right>${r.avg}</TD>
                      <TD right><span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, color: r.tc, fontWeight: 700 }}>{r.trend}</span></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ borderTop: `1px solid ${B.hairline}`, paddingTop: 14 }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, letterSpacing: '0.06em', marginBottom: 10 }}>TOP 5 VEHÍCULOS MÁS COSTOSOS</div>
              {MAINT_TOP5.map((v, i) => (
                <div key={v.unit} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, width: 14, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.blue, fontWeight: 600, width: 48, flexShrink: 0 }}>{v.unit}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.model}</span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.rose, fontWeight: 600, flexShrink: 0 }}>{v.cost}</span>
                  <Pill fg={B.lilac} bg={B.lilacSoft}>{v.reason}</Pill>
                </div>
              ))}
            </div>
          </SoftCard>

          {/* Inspection quality */}
          <SoftCard padding={24}>
            <SecHead label="Calidad de Inspecciones" color={B.sky} />
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Tasa de completación', value: '94%',  color: B.green },
                { label: 'Tiempo promedio',       value: '23 min', color: B.blue },
                { label: 'Detección de daños',    value: '31%',  color: B.amber },
              ].map(s => (
                <div key={s.label} style={{ padding: '14px 12px', borderRadius: 12, background: B.surface2, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 32, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: B.ink3 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr><TH>Inspector</TH><TH>Insp.</TH><TH>T.prom</TH><TH>Daños</TH><TH>Score</TH></tr>
                </thead>
                <tbody>
                  {INSPECTORS.map((ins, i) => (
                    <tr key={ins.name} style={{ borderBottom: i < INSPECTORS.length - 1 ? `1px solid ${B.hairline}` : 'none' }}>
                      <TD>{ins.name}</TD>
                      <TD right>{ins.total}</TD>
                      <TD right>{ins.avgMin} min</TD>
                      <TD right>{ins.damage}</TD>
                      <td style={{ padding: '9px 10px', textAlign: 'right' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 9999, background: `${ins.tone}18`, color: ins.tone, fontFamily: 'var(--font-dm-mono)', fontSize: 11, fontWeight: 700 }}>{ins.score}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SoftCard>
        </div>

        {/* ROW 4 — Branch comparison (full width) */}
        <SoftCard padding={26} style={{ marginBottom: 14 }}>
          <SecHead label="Comparativa por Sucursal" color={B.green} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
            {[
              { label: 'Flota total',           key: 'flota',        suffix: ' veh', winner: 'max', fmt: (v: number) => String(v) },
              { label: 'Vehículos disponibles', key: 'available',    suffix: ' veh', winner: 'max', fmt: (v: number) => String(v) },
              { label: 'Utilización',           key: 'util',         suffix: '%',    winner: 'max', fmt: (v: number) => `${v}%`   },
              { label: 'Costo de mantenimiento',key: 'maintCost',    suffix: '',     winner: 'min', fmt: (v: number) => `$${(v/1000).toFixed(1)}k` },
              { label: 'Inspecciones',          key: 'inspections',  suffix: '',     winner: 'max', fmt: (v: number) => String(v) },
              { label: 'Incidentes',            key: 'incidents',    suffix: '',     winner: 'min', fmt: (v: number) => String(v) },
            ].map(metric => {
              const vals = BRANCHES_DATA.map(b => b[metric.key as keyof typeof b] as number)
              const maxVal = Math.max(...vals)
              const minVal = Math.min(...vals)
              const winnerVal = metric.winner === 'max' ? maxVal : minVal
              return (
                <div key={metric.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2, fontWeight: 500 }}>{metric.label}</span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.green, background: B.greenSoft, padding: '1px 7px', borderRadius: 9999 }}>
                      {metric.winner === 'max' ? 'más alto' : 'más bajo'} gana
                    </span>
                  </div>
                  {BRANCHES_DATA.map((b, i) => {
                    const val = b[metric.key as keyof typeof b] as number
                    const isWinner = val === winnerVal
                    return (
                      <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink2, width: 88, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</span>
                        <div style={{ flex: 1, height: 8, background: B.surface2, borderRadius: 9999, overflow: 'hidden' }}>
                          <div style={{ height: 8, width: `${(val / maxVal) * 100}%`, background: isWinner ? B.green : BRANCH_COLORS[i], borderRadius: 9999, opacity: isWinner ? 1 : 0.6 }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: 60, justifyContent: 'flex-end' }}>
                          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: isWinner ? B.green : B.ink2, fontWeight: isWinner ? 700 : 400 }}>{metric.fmt(val)}</span>
                          {isWinner && <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.green }}>★</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </SoftCard>

        {/* ROW 5 — Damage trends | Repair velocity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-3.5">

          {/* Damage trends */}
          <SoftCard padding={24}>
            <SecHead label="Tendencias de Daños" color={B.rose} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, letterSpacing: '0.06em', marginBottom: 12 }}>TIPOS DE DAÑO MÁS COMUNES</div>
                {DAMAGE_TYPES.map((d, i) => (
                  <div key={d.type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, width: 14, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2, flex: 1 }}>{d.type}</span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink, fontWeight: 600, width: 28, textAlign: 'right', flexShrink: 0 }}>{d.count}</span>
                    <div style={{ width: 60 }}>
                      <div style={{ height: 5, background: B.surface2, borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ height: 5, width: `${d.pct}%`, background: B.rose, borderRadius: 9999 }} />
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, width: 28, flexShrink: 0 }}>{d.pct}%</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, letterSpacing: '0.06em', marginBottom: 12 }}>ZONAS MÁS AFECTADAS</div>
                {DAMAGE_ZONES.map((z, i) => (
                  <HorizBar key={z.zone} label={z.zone} value={z.count} max={DAMAGE_ZONES[0].count} color={B.rose} />
                ))}
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, letterSpacing: '0.06em', marginBottom: 12 }}>CATEGORÍAS MÁS AFECTADAS</div>
                  {DAMAGE_BY_CAT.map(c => (
                    <HorizBar key={c.cat} label={c.cat} value={c.incidents} max={DAMAGE_BY_CAT[0].incidents} color={B.amber} />
                  ))}
                </div>
                <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, background: B.roseSoft }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.rose }}>Mayor tasa de incidentes</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.rose, marginTop: 2 }}>Montevideo Centro · 0.098/veh</div>
                </div>
              </div>
            </div>
          </SoftCard>

          {/* Repair velocity */}
          <SoftCard padding={24}>
            <SecHead label="Velocidad de Reparación" color={B.sky} />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 52, color: B.blue, lineHeight: 1 }}>3.8</span>
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: B.ink2 }}>días promedio</div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: B.ink2 }}>daño → disponible</div>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 9999, background: B.greenSoft, marginBottom: 18 }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.green, fontWeight: 600 }}>↓ 0.4 días vs mes anterior</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.green }}>Mejorando</span>
            </div>

            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, letterSpacing: '0.06em', marginBottom: 12 }}>POR LUGAR DE REPARACIÓN</div>
            {REPAIR_BY_LOCATION.map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2, width: 160, flexShrink: 0 }}>{r.label}</span>
                <div style={{ flex: 1, height: 8, background: B.surface2, borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ height: 8, width: `${r.pct}%`, background: r.color, borderRadius: 9999 }} />
                </div>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: r.color, fontWeight: 600, width: 32, textAlign: 'right', flexShrink: 0 }}>{r.pct}%</span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3, width: 48, flexShrink: 0 }}>{r.avg}d avg</span>
              </div>
            ))}

            <div style={{ borderTop: `1px solid ${B.hairline}`, paddingTop: 16, marginTop: 6 }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, letterSpacing: '0.06em', marginBottom: 12 }}>ANÁLISIS DE CUELLOS DE BOTELLA</div>
              {BOTTLENECK.map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2, flex: 1 }}>{b.label}</span>
                  <div style={{ width: 120 }}>
                    <div style={{ height: 6, background: B.surface2, borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{ height: 6, width: `${b.pct}%`, background: b.color, borderRadius: 9999 }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: b.color, fontWeight: 700, width: 36, textAlign: 'right', flexShrink: 0 }}>{b.pct}%</span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3, width: 36, flexShrink: 0 }}>{b.days}d</span>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: B.roseSoft }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.rose, fontWeight: 500 }}>Principal cuello de botella</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.rose, marginTop: 2 }}>Espera de repuestos · 1.4 días (37%)</div>
              </div>
            </div>
          </SoftCard>
        </div>
      </main>

      <BentoBottomNav />
    </div>
  )
}
