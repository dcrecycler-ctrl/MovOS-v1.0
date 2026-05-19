import { B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'
import { InspectionQueue } from './InspectionQueue'
import { TodaySummary }    from './TodaySummary'
import { BeforeAfterRow }  from './BeforeAfterRow'
import { DamageRecords }   from './DamageRecords'

export default function InspectionsPage() {
  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar />
      <div className="max-w-[1400px] mx-auto px-4 pt-7 pb-24 md:px-6 md:pb-16 lg:px-8">

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>Inspecciones</h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '4px 0 0' }}>
            Cola de inspección · Registro de daños · Antes / después
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 md:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total Flota"       value="47"  sub="14 por inspeccionar"  color={B.amber} />
          <StatCard label="Disponibles"       value="18"  sub="Listos para alquiler" color={B.green} />
          <StatCard label="Asignados"         value="21"  sub="En alquiler activo"   color={B.blue}  />
          <StatCard label="Utilización"       value="45%" sub="Asignados ÷ total"    color={B.amber} />
          <StatCard label="Fuera de servicio" value="8"   sub="3 mant · 5 insp."    color={B.rose}  />
        </div>

        <div className="flex flex-col gap-3.5 mb-5 items-start lg:flex-row">
          <div className="w-full lg:flex-[3]"><InspectionQueue /></div>
          <div className="w-full lg:flex-[2]"><TodaySummary /></div>
        </div>

        <div style={{ marginBottom: 20 }}><BeforeAfterRow /></div>

        <DamageRecords />
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
