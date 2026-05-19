'use client'

import { B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'
import { RepairTicketsSummary } from './RepairTicketsSummary'
import { ServiceSchedule }      from './ServiceSchedule'
import { WorkshopStatus }       from './WorkshopStatus'
import { RepairTicketList }     from './RepairTicketList'
import { MaintenanceRules }     from './MaintenanceRules'
import { CostAnalysis }         from './CostAnalysis'

const bLight = {
  '--ds-bg':       B.bg,
  '--ds-bg-1':     B.surface,
  '--ds-bg-2':     B.surface2,
  '--ds-bg-3':     B.surface3,
  '--ds-border':   'rgba(14,23,38,0.07)',
  '--ds-border-2': 'rgba(14,23,38,0.12)',
  '--ds-text':     B.ink,
  '--ds-dim':      B.ink2,
  '--ds-muted':    B.ink3,
  '--ds-faint':    B.ink4,
  '--ds-gold':     B.amber,
  '--ds-blue':     B.blue,
  '--ds-purple':   B.lilac,
  '--ds-green':    B.green,
  '--ds-red':      B.rose,
  '--ds-orange':   B.amber,
  '--ds-yellow':   B.amber,
  '--ds-lime':     B.green,
  '--ds-slate':    B.sky,
} as unknown as React.CSSProperties

export default function MaintenancePage() {
  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar />
      <div className="max-w-[1400px] mx-auto px-4 pt-7 pb-24 md:px-6 md:pb-16 lg:px-8">

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>Mantenimiento</h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '4px 0 0' }}>
            Tickets de reparación · Agenda de servicios · Carga de talleres · Análisis de costos
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 md:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total Flota"     value="47"   sub="8 en mantenimiento"       color={B.amber} />
          <StatCard label="Tickets Abiertos" value="8"   sub="2 críticos · 3 mayores"   color={B.rose}  />
          <StatCard label="Programados"     value="6"    sub="Vencen en 30 días"         color={B.amber} />
          <StatCard label="Carga Taller"    value="12"   sub="Vehículos en 4 talleres"   color={B.blue}  />
          <StatCard label="Gasto Mensual"   value="142K" sub="$UY 142.800 este mes"      color={B.green} />
        </div>

        {/* Sub-components — bLight overrides DS CSS variables to light theme */}
        <div style={bLight}>
          <div
            className="flex gap-3.5 mb-5 items-start overflow-x-auto pb-1 lg:pb-0"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            <div className="flex-none w-[85vw] md:flex-1 md:w-auto md:min-w-[260px]" style={{ scrollSnapAlign: 'start' }}>
              <RepairTicketsSummary />
            </div>
            <div className="flex-none w-[85vw] md:flex-1 md:w-auto md:min-w-[260px]" style={{ scrollSnapAlign: 'start' }}>
              <ServiceSchedule />
            </div>
            <div className="flex-none w-[85vw] md:flex-1 md:w-auto md:min-w-[260px]" style={{ scrollSnapAlign: 'start' }}>
              <WorkshopStatus />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}><RepairTicketList /></div>
          <div className="flex flex-col gap-3.5 items-start lg:flex-row">
            <div className="w-full lg:flex-1"><MaintenanceRules /></div>
            <div className="w-full lg:flex-1"><CostAnalysis /></div>
          </div>
        </div>
      </div>
      <BentoBottomNav />
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{
      background: B.surface, borderRadius: 14, border: `1px solid ${B.hairline}`,
      padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4,
      boxShadow: B.shadowSm,
    }}>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 28, fontWeight: 700, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>{sub}</span>
    </div>
  )
}
