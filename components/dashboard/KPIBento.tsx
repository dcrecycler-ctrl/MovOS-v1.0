'use client'

import { B, Tone } from '@/lib/tokens'
import { KPIS, KPI_SPARKLINE, KPI } from '@/lib/data'
import { SoftCard } from '@/components/ui/SoftCard'
import { SoftBadge } from '@/components/ui/SoftBadge'
import { Dot, Sparkline } from '@/components/ui/atoms'
import { ModalPayload } from '@/components/dashboard/types'

interface Props {
  openModal: (payload: ModalPayload) => void
}

function SmallKPI({ label, value, tone, delta, sub }: {
  label: string; value: string; tone: Tone; delta: string; sub?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Dot tone={tone} size={5} />
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500 }}>{label}</span>
        </div>
        <SoftBadge tone={tone} size={10}>{delta}</SoftBadge>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.ink, letterSpacing: '-0.03em', lineHeight: 1 }}
          className="text-2xl sm:text-2xl lg:text-3xl">{value}</div>
        {sub && <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 5 }}>{sub}</div>}
      </div>
    </div>
  )
}

export function KPIBento({ openModal }: Props) {
  const util = KPIS.find(k => k.id === 'util')!

  return (
    // Mobile: 2-col grid, hero spans both cols. sm+: 5-col with hero 2fr.
    <div className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2.5 w-full mb-3.5">

      {/* Hero: Utilización — full-width on mobile, 2fr col on sm+ */}
      <div className="col-span-2 sm:col-span-1 min-w-0 overflow-hidden w-full">
        <SoftCard
          padding={20}
          big
          onClick={() => openModal({ kind: 'kpi', kpi: util })}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, fontWeight: 500, marginBottom: 4 }}>Utilización de flota</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink4 }}>Mes en curso</div>
            </div>
            <SoftBadge tone="green">↑ 4.2 pts vs abril</SoftBadge>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span
                className="text-5xl sm:text-4xl lg:text-6xl"
                style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.ink, letterSpacing: '-0.04em', lineHeight: 0.9 }}
              >73</span>
              <span
                className="text-xl sm:text-base lg:text-2xl"
                style={{ fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink2, letterSpacing: '-0.02em' }}
              >%</span>
            </div>
            <Sparkline values={KPI_SPARKLINE} color={B.blue} height={40} />
          </div>
          {/* Goal chip — hidden on mobile to keep card compact */}
          <div className="hidden sm:flex" style={{ marginTop: 14, padding: '12px 14px', background: B.surface2, borderRadius: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Dot tone="green" />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2 }}>Por encima de la meta trimestral (70%)</span>
            </div>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>Ver →</span>
          </div>
        </SoftCard>
      </div>

      {/* 4 small KPIs — each 1 cell (2-col on mobile = 2×2, 4×1fr on sm+) */}
      <div className="min-w-0 overflow-hidden w-full">
        <SoftCard onClick={() => openModal({ kind: 'kpi', kpi: KPIS.find(k => k.id === 'available')! })}>
          <SmallKPI label="Disponibles" value="142" tone="green" delta="↑ 8 hoy" sub="Listos para renta" />
        </SoftCard>
      </div>

      <div className="min-w-0 overflow-hidden w-full">
        <SoftCard onClick={() => openModal({ kind: 'kpi', kpi: KPIS.find(k => k.id === 'assigned')! })}>
          <SmallKPI label="Asignados" value="87" tone="blue" delta="12 vuelven hoy" />
        </SoftCard>
      </div>

      <div className="min-w-0 overflow-hidden w-full">
        <SoftCard onClick={() => openModal({ kind: 'kpi', kpi: KPIS.find(k => k.id === 'total')! })}>
          <SmallKPI label="Flota total" value="248" tone="sky" delta="4 sucursales" sub="Activos" />
        </SoftCard>
      </div>

      <div className="min-w-0 overflow-hidden w-full">
        <SoftCard onClick={() => openModal({ kind: 'kpi', kpi: KPIS.find(k => k.id === 'oos')! })}>
          <SmallKPI label="Fuera de servicio" value="19" tone="rose" delta="8 taller" />
        </SoftCard>
      </div>
    </div>
  )
}
