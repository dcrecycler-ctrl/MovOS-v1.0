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
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, fontWeight: 500 }}>{label}</span>
        <SoftBadge tone={tone} size={10}>{delta}</SoftBadge>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: 36, fontWeight: 600, color: B.ink, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, marginTop: 6 }}>{sub}</div>}
      </div>
    </div>
  )
}

export function KPIBento({ openModal }: Props) {
  const util = KPIS.find(k => k.id === 'util')!

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)',
      gridAutoRows: '118px', gap: 14, marginBottom: 14,
    }}>
      {/* Hero: Utilización — spans 5 cols × 2 rows */}
      <SoftCard
        style={{ gridColumn: 'span 5', gridRow: 'span 2' }}
        padding={28}
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
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 30 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 72, fontWeight: 600, color: B.ink, letterSpacing: '-0.04em', lineHeight: 0.9 }}>73</span>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 28, fontWeight: 500, color: B.ink2, letterSpacing: '-0.02em' }}>%</span>
          </div>
          <Sparkline values={KPI_SPARKLINE} color={B.blue} height={56} />
        </div>
        <div style={{ marginTop: 18, padding: '14px 16px', background: B.surface2, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Dot tone="green" />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2 }}>Por encima de la meta trimestral (70%)</span>
          </div>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3 }}>Ver detalle →</span>
        </div>
      </SoftCard>

      {/* Row 1: Disponibles (4) + Asignados (3) */}
      <SoftCard
        style={{ gridColumn: 'span 4' }}
        onClick={() => openModal({ kind: 'kpi', kpi: KPIS.find(k => k.id === 'available')! })}
      >
        <SmallKPI label="Disponibles" value="142" tone="green" delta="↑ 8 hoy" sub="Listos para renta" />
      </SoftCard>
      <SoftCard
        style={{ gridColumn: 'span 3' }}
        onClick={() => openModal({ kind: 'kpi', kpi: KPIS.find(k => k.id === 'assigned')! })}
      >
        <SmallKPI label="Asignados" value="87" tone="blue" delta="12 vuelven hoy" />
      </SoftCard>

      {/* Row 2: Flota total (4) + Fuera de servicio (3) */}
      <SoftCard
        style={{ gridColumn: 'span 4' }}
        onClick={() => openModal({ kind: 'kpi', kpi: KPIS.find(k => k.id === 'total')! })}
      >
        <SmallKPI label="Flota total" value="248" tone="sky" delta="4 sucursales" sub="Activos en operación" />
      </SoftCard>
      <SoftCard
        style={{ gridColumn: 'span 3' }}
        onClick={() => openModal({ kind: 'kpi', kpi: KPIS.find(k => k.id === 'oos')! })}
      >
        <SmallKPI label="Fuera de servicio" value="19" tone="rose" delta="8 en taller · 6 espera" />
      </SoftCard>
    </div>
  )
}
