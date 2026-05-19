'use client'

import { B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'
import { LongTermContracts }  from './LongTermContracts'
import { KarveSync }          from './KarveSync'
import { VehiclesByContract } from './VehiclesByContract'
import { RenewalTimeline }    from './RenewalTimeline'
import { ContractRevenue }    from './ContractRevenue'

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

export default function ContractsPage() {
  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar />
      <div className="max-w-[1400px] mx-auto px-4 pt-7 pb-24 md:px-6 md:pb-16 lg:px-8">

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>Contratos</h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '4px 0 0' }}>
            Contratos a largo plazo · Sincronización Karve · Calendario de renovaciones
          </p>
        </div>

        {/* KPI row — 6 cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 md:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total Contratos"  value="4"    sub="4 contratos registrados"         color={B.amber} />
          <StatCard label="Activos"          value="2"    sub="UTE · Antel"                     color={B.green} />
          <StatCard label="Por Vencer"       value="2"    sub="OSE 42d · Intendencia 28d"       color={B.amber} />
          <StatCard label="Vehículos Asign." value="306"  sub="En los 4 contratos"              color={B.blue}  />
          <StatCard label="Ingreso Mensual"  value="$64K" sub="$64.000 / mes combinado"         color={B.green} />
          <StatCard label="Duración Prom."   value="18m"  sub="Promedio contratos activos"      color={B.sky}   />
        </div>

        {/* Sub-components — bLight overrides DS CSS variables to light theme */}
        <div style={bLight}>
          <div className="flex flex-col gap-3.5 mb-5 items-start lg:flex-row">
            <div className="w-full lg:flex-[3]"><LongTermContracts /></div>
            <div className="w-full lg:flex-[2]"><KarveSync /></div>
          </div>
          <div style={{ marginBottom: 20 }}><VehiclesByContract /></div>
          <div className="flex flex-col gap-3.5 items-start lg:flex-row">
            <div className="w-full lg:flex-1"><RenewalTimeline /></div>
            <div className="w-full lg:flex-1"><ContractRevenue /></div>
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
