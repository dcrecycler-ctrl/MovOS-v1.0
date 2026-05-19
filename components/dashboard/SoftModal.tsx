'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { B, TONE_COLORS, Tone } from '@/lib/tokens'
import { SoftBadge } from '@/components/ui/SoftBadge'
import { PillButton } from '@/components/ui/PillButton'
import { SourceIcon } from '@/components/ui/atoms'
import { ModalPayload, FleetStats, CriticalAlert, ServiceAlert, LocationStat, PartsRequest, ContractRow } from '@/components/dashboard/types'

interface Props {
  modal: ModalPayload | null
  onClose: () => void
}

function ModalShell({ title, subtitle, badge, onClose, children }: {
  title: string
  subtitle?: string
  badge?: ReactNode
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(14,23,38,0.28)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        ref={ref}
        style={{
          background: B.surface, borderRadius: B.radiusLg,
          boxShadow: B.shadowLg, width: '100%', maxWidth: 680,
          maxHeight: '90vh', overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '26px 28px 20px', borderBottom: `1px solid ${B.hairline}`,
          position: 'sticky', top: 0, background: B.surface,
          borderRadius: `${B.radiusLg}px ${B.radiusLg}px 0 0`, zIndex: 1,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: badge || subtitle ? 6 : 0 }}>
              <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 20, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
              {badge}
            </div>
            {subtitle && <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, margin: 0 }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 9999, border: `1px solid ${B.hairline}`, background: B.surface2, color: B.ink3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '24px 28px 28px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${B.hairline}` }}>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 500, color: B.ink, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

// ─── KPI detail ───────────────────────────────────────────────────────────────

function KPIDetail({ kpiId, stats }: { kpiId: string; stats: FleetStats }) {
  const KPI_INFO: Record<string, { label: string; value: number; unit?: string; tone: Tone }> = {
    util:      { label: 'Utilización',      value: stats.utilization, unit: '%', tone: 'blue' },
    available: { label: 'Disponibles',      value: stats.available,              tone: 'green' },
    assigned:  { label: 'Asignados',        value: stats.assigned,               tone: 'blue' },
    total:     { label: 'Flota total',      value: stats.total,                  tone: 'sky' },
    oos:       { label: 'Fuera de servicio', value: stats.outOfService,           tone: 'rose' },
  }
  const info = KPI_INFO[kpiId] ?? KPI_INFO.total

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 24 }}>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 60, fontWeight: 600, color: B.ink, letterSpacing: '-0.04em', lineHeight: 1 }}>{info.value}</span>
        {info.unit && <span style={{ fontFamily: 'var(--font-inter)', fontSize: 24, fontWeight: 500, color: B.ink2, marginBottom: 6 }}>{info.unit}</span>}
      </div>
      <div>
        <StatRow label="Total flota"      value={String(stats.total)} />
        <StatRow label="Disponibles"      value={String(stats.available)} />
        <StatRow label="Asignados"        value={String(stats.assigned)} />
        <StatRow label="En mantenimiento" value={String(stats.maintenanceCount)} />
        <StatRow label="En inspección"    value={String(stats.inspectionCount)} />
        <StatRow label="Fuera de servicio" value={String(stats.outOfService)} />
        <StatRow label="Utilización"      value={`${stats.utilization}%`} />
      </div>
    </>
  )
}

// ─── Alert detail ─────────────────────────────────────────────────────────────

function AlertDetail({ alert: a }: { alert: CriticalAlert }) {
  const tone: Tone = a.urgent ? 'rose' : 'amber'
  const isManual = a.source === 'manager' || a.source === 'client' || a.source === 'technician'
  const srcTone: Tone = isManual ? 'lilac' : 'blue'
  const srcColor = isManual ? B.lilac : B.blue
  const srcBg = isManual ? B.lilacSoft : B.blueSoft
  const srcDisplay: 'CARCHECK' | 'MANUAL' = isManual ? 'MANUAL' : 'CARCHECK'
  const srcLabel = isManual ? 'Manual' : 'Sistema'

  return (
    <>
      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: srcBg, color: srcColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SourceIcon source={srcDisplay} size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <SoftBadge tone={tone} size={10}>{a.urgent ? 'crítico' : 'alerta'}</SoftBadge>
            <SoftBadge tone={srcTone} size={10}>{srcLabel}</SoftBadge>
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: B.ink2 }}>{a.message}</div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <StatRow label="Unidad"     value={a.unit} />
        <StatRow label="Placa"      value={a.plate} />
        <StatRow label="Origen"     value={srcLabel} />
        <StatRow label="Hace"       value={a.timeAgo} />
      </div>

      <div style={{ padding: '18px 20px', background: B.amberSoft, borderRadius: B.radiusSm, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.amber, marginBottom: 4 }}>Requiere agendamiento de reparación</div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2 }}>El vehículo no puede rentarse hasta completar la reparación y pasar revisión.</div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <PillButton tone="primary" size="sm">Agendar reparación</PillButton>
        <PillButton tone="ghost" size="sm">Ver historial del vehículo</PillButton>
      </div>
    </>
  )
}

// ─── Service detail ───────────────────────────────────────────────────────────

function ServiceDetail({ alert: a }: { alert: ServiceAlert }) {
  const tone: Tone = a.overdue ? 'rose' : 'amber'

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>Estado del servicio</span>
          <SoftBadge tone={tone} size={10}>{a.overdue ? 'Vencido' : 'Próximo'}</SoftBadge>
        </div>
        <div style={{ padding: '14px 16px', background: a.overdue ? B.roseSoft : B.amberSoft, borderRadius: B.radiusSm }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 22, fontWeight: 600, color: a.overdue ? B.rose : B.amber, letterSpacing: '-0.02em' }}>
            {a.deltaDisplay}
          </span>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2, marginLeft: 8 }}>
            {a.overdue ? 'vencido' : 'restantes'}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <StatRow label="Unidad"          value={a.unit} />
        <StatRow label="Placa"           value={a.plate} />
        <StatRow label="Vehículo"        value={a.vehicle} />
        <StatRow label="Tipo de servicio" value={a.service} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <PillButton tone="primary" size="sm">Agendar servicio</PillButton>
        <PillButton tone="ghost" size="sm">Ver historial de mantenimiento</PillButton>
      </div>
    </>
  )
}

// ─── Branch detail ────────────────────────────────────────────────────────────

function BranchDetail({ branch: b }: { branch: LocationStat }) {
  const u = b.units > 0 ? Math.round((b.assigned / b.units) * 100) : 0

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {([
          { l: 'Total', v: b.units, tone: 'sky' as Tone },
          { l: 'Disponibles', v: b.available, tone: 'green' as Tone },
          { l: 'Asignados', v: b.assigned, tone: 'blue' as Tone },
          { l: 'Inactivos', v: b.maintenance, tone: 'rose' as Tone },
        ]).map(s => {
          const [fg, bg] = TONE_COLORS[s.tone]
          return (
            <div key={s.l} style={{ padding: '14px 16px', background: bg, borderRadius: B.radiusSm, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 28, fontWeight: 600, color: fg, letterSpacing: '-0.02em' }}>{s.v}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 4 }}>{s.l}</div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: B.surface2, borderRadius: B.radiusSm, marginBottom: 24 }}>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2 }}>Utilización actual</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 120, height: 6, background: B.hairline, borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${u}%`, background: u >= 75 ? B.green : u >= 65 ? B.blue : B.amber, borderRadius: 9999 }} />
          </div>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: B.ink }}>{u}%</span>
        </div>
      </div>

      <StatRow label="Ciudad" value={b.city} />
    </>
  )
}

// ─── Contract detail ──────────────────────────────────────────────────────────

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function ContractDetail({ contract: c }: { contract: ContractRow }) {
  const isUrgent = c.status === 'expiring' || c.status === 'expired'
  const tone: Tone = c.status === 'active' ? 'green' : isUrgent ? 'rose' : 'neutral'
  const endDate = new Date(Date.now() + c.days * 86_400_000)
  const expires = `${MONTHS[endDate.getMonth()]} ${endDate.getFullYear()}`
  const renewIn = c.days < 0
    ? `vencido hace ${Math.abs(c.days)} días`
    : c.days > 30
      ? `${Math.floor(c.days / 30)} meses`
      : `${c.days} días`
  const titleCase = (s: string) => s.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <StatRow label="ID contrato"    value={c.id.slice(0, 18)} />
        <StatRow label="Tipo"           value={titleCase(c.type)} />
        <StatRow label="Flota asignada" value={`${c.units} vehículos`} />
        <StatRow label="Vencimiento"    value={`${expires} (en ${renewIn})`} />
        <StatRow label="Estado"         value={<SoftBadge tone={tone} size={10}>{c.status}</SoftBadge>} />
      </div>

      {isUrgent && (
        <div style={{ padding: '18px 20px', background: B.roseSoft, borderRadius: B.radiusSm, marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.rose, marginBottom: 4 }}>
            Requiere acción inmediata
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2 }}>
            Contactar al cliente para coordinar la renovación antes del vencimiento.
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <PillButton tone="primary" size="sm">Gestionar contrato</PillButton>
        <PillButton tone="ghost" size="sm">Descargar PDF</PillButton>
      </div>
    </>
  )
}

// ─── Part detail ──────────────────────────────────────────────────────────────

const PRIORITY_TONE: Record<string, Tone> = {
  critical: 'rose', high: 'amber', medium: 'amber', low: 'sky',
}

function PartDetail({ part: p }: { part: PartsRequest }) {
  const tone = PRIORITY_TONE[p.priority] ?? 'amber'

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <StatRow label="Unidad"     value={p.unit} />
        <StatRow label="Refacción"  value={p.part} />
        <StatRow label="Proveedor"  value={p.shop} />
        <StatRow label="Prioridad"  value={<SoftBadge tone={tone} size={10}>{p.priority}</SoftBadge>} />
      </div>
    </>
  )
}

// ─── All alerts ───────────────────────────────────────────────────────────────

function AllAlerts({ alerts }: { alerts: CriticalAlert[] }) {
  if (alerts.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0', fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3 }}>
        Sin alertas activas
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map(a => {
        const tone: Tone = a.urgent ? 'rose' : 'amber'
        const isManual = a.source === 'manager' || a.source === 'client' || a.source === 'technician'
        const srcTone: Tone = isManual ? 'lilac' : 'blue'
        const srcColor = isManual ? B.lilac : B.blue
        const srcBg = isManual ? B.lilacSoft : B.blueSoft
        return (
          <div key={a.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, alignItems: 'center', padding: '14px 16px', background: B.surface2, borderRadius: B.radiusSm }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: srcBg, color: srcColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SourceIcon source={isManual ? 'MANUAL' : 'CARCHECK'} size={16} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: B.ink }}>{a.unit}</span>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3 }}>· {a.plate}</span>
                <SoftBadge tone={tone} size={10}>{a.urgent ? 'crítico' : 'alerta'}</SoftBadge>
                <SoftBadge tone={srcTone} size={10}>{isManual ? 'Manual' : 'Sistema'}</SoftBadge>
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2 }}>{a.message}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 2 }}>hace {a.timeAgo}</div>
            </div>
            <SoftBadge tone="amber" size={10}>por agendar</SoftBadge>
          </div>
        )
      })}
    </div>
  )
}

// ─── All parts ────────────────────────────────────────────────────────────────

function AllParts({ parts }: { parts: PartsRequest[] }) {
  if (parts.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0', fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3 }}>
        Sin pedidos activos
      </div>
    )
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {parts.map(p => {
        const tone = PRIORITY_TONE[p.priority] ?? 'amber'
        const [fg, bg] = TONE_COLORS[tone]
        return (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: B.surface2, borderRadius: B.radiusSm }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5" /><path d="M21 3 11 13" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.part}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 2 }}>{p.unit} · {p.shop}</div>
            </div>
            <SoftBadge tone={tone} size={10}>{p.priority}</SoftBadge>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function SoftModal({ modal, onClose }: Props) {
  if (!modal) return null

  const titleCase = (s: string) => s.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')

  if (modal.kind === 'kpi') {
    const labels: Record<string, string> = {
      util: 'Utilización de flota', available: 'Disponibles',
      assigned: 'Asignados', total: 'Flota total', oos: 'Fuera de servicio',
    }
    return (
      <ModalShell title={labels[modal.kpiId] ?? 'Flota'} subtitle="Resumen general" onClose={onClose}>
        <KPIDetail kpiId={modal.kpiId} stats={modal.stats} />
      </ModalShell>
    )
  }

  if (modal.kind === 'alert') {
    const a = modal.alert
    const tone: Tone = a.urgent ? 'rose' : 'amber'
    return (
      <ModalShell
        title={a.unit}
        subtitle={a.plate}
        badge={<SoftBadge tone={tone} size={10}>{a.urgent ? 'crítico' : 'alerta'}</SoftBadge>}
        onClose={onClose}
      >
        <AlertDetail alert={a} />
      </ModalShell>
    )
  }

  if (modal.kind === 'service') {
    const a = modal.alert
    const tone: Tone = a.overdue ? 'rose' : 'amber'
    return (
      <ModalShell
        title={a.unit}
        subtitle={`${a.service} · ${a.vehicle}`}
        badge={<SoftBadge tone={tone} size={10}>{a.overdue ? 'Vencido' : 'Próximo'}</SoftBadge>}
        onClose={onClose}
      >
        <ServiceDetail alert={a} />
      </ModalShell>
    )
  }

  if (modal.kind === 'branch') {
    const b = modal.branch
    return (
      <ModalShell title={titleCase(b.name)} subtitle={`${b.city} · ${b.units} vehículos`} onClose={onClose}>
        <BranchDetail branch={b} />
      </ModalShell>
    )
  }

  if (modal.kind === 'contract') {
    const c = modal.contract
    return (
      <ModalShell title={titleCase(c.client)} subtitle={titleCase(c.type)} onClose={onClose}>
        <ContractDetail contract={c} />
      </ModalShell>
    )
  }

  if (modal.kind === 'part') {
    const p = modal.part
    return (
      <ModalShell title={p.part} subtitle={`${p.unit} · ${p.shop}`} onClose={onClose}>
        <PartDetail part={p} />
      </ModalShell>
    )
  }

  if (modal.kind === 'all-alerts') {
    return (
      <ModalShell title={modal.title ?? 'Incidentes en curso'} subtitle="Todos los vehículos por agendar" onClose={onClose}>
        <AllAlerts alerts={modal.alerts} />
      </ModalShell>
    )
  }

  if (modal.kind === 'all-parts') {
    return (
      <ModalShell title="Almacén de refacciones" subtitle="Pedidos activos" onClose={onClose}>
        <AllParts parts={modal.parts} />
      </ModalShell>
    )
  }

  return null
}
