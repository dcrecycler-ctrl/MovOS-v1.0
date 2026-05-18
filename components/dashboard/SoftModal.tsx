'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { B, TONE_MAP, TONE_COLORS, STATUS_TONE, Tone } from '@/lib/tokens'
import { FLEET, CRITICAL_ALERTS, PARTS } from '@/lib/data'
import { SoftBadge } from '@/components/ui/SoftBadge'
import { PillButton } from '@/components/ui/PillButton'
import { SourceIcon } from '@/components/ui/atoms'
import { ModalPayload } from '@/components/dashboard/types'

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

function VehicleChip({ v }: { v: typeof FLEET[number] }) {
  const tone = STATUS_TONE[v.statusColor] ?? 'neutral'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: B.surface2, borderRadius: B.radiusSm }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink }}>{v.unit}</div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.model}</div>
      </div>
      <SoftBadge tone={tone} size={10}>{v.status.toLowerCase()}</SoftBadge>
    </div>
  )
}

function KPIDetail({ modal }: { modal: Extract<ModalPayload, { kind: 'kpi' }> }) {
  const k = modal.kpi
  const tone = (TONE_MAP[k.color] ?? 'amber') as Tone

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 24 }}>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 60, fontWeight: 600, color: B.ink, letterSpacing: '-0.04em', lineHeight: 1 }}>{k.value}</span>
        {k.unit && <span style={{ fontFamily: 'var(--font-inter)', fontSize: 24, fontWeight: 500, color: B.ink2, marginBottom: 6 }}>{k.unit}</span>}
        <span style={{ marginBottom: 8, marginLeft: 6 }}>
          <SoftBadge tone={tone} size={11}>{k.sub.toLowerCase()}</SoftBadge>
        </span>
      </div>
      <div style={{ marginBottom: 24 }}>
        <StatRow label="Sede principal — Montevideo" value="96 vehículos · 78% util." />
        <StatRow label="Colonia" value="48 vehículos · 81% util." />
        <StatRow label="Punta del Este" value="64 vehículos · 69% util." />
        <StatRow label="Salto" value="40 vehículos · 64% util." />
      </div>
      <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink3, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Muestra de flota</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {FLEET.slice(0, 6).map(v => <VehicleChip key={v.unit} v={v} />)}
      </div>
    </>
  )
}

function AlertDetail({ modal }: { modal: Extract<ModalPayload, { kind: 'alert' }> }) {
  const a = modal.alert
  const tone = (TONE_MAP[a.color] ?? 'amber') as Tone
  const sourceTone: Tone = a.source === 'CARCHECK' ? 'blue' : 'lilac'
  const srcColor = a.source === 'CARCHECK' ? B.blue : B.lilac
  const srcBg = a.source === 'CARCHECK' ? B.blueSoft : B.lilacSoft

  return (
    <>
      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: srcBg, color: srcColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SourceIcon source={a.source} size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <SoftBadge tone={tone} size={10}>{a.severity.toLowerCase()}</SoftBadge>
            <SoftBadge tone={sourceTone} size={10}>{a.source === 'CARCHECK' ? 'CarCheck' : 'Manual'}</SoftBadge>
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 15, color: B.ink2 }}>{a.note}</div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <StatRow label="Unidad" value={a.unit} />
        <StatRow label="Placa" value={a.plate} />
        <StatRow label="Modelo" value={a.model} />
        <StatRow label="Sucursal" value={a.branch} />
        <StatRow label="Reportado por" value={a.sourceBy} />
        <StatRow label="Hace" value={a.ago} />
      </div>

      <div style={{ padding: '18px 20px', background: B.amberSoft, borderRadius: B.radiusSm, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.amber, marginBottom: 4 }}>Requiere agendamiento de reparación</div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2 }}>El vehículo no puede rentarse hasta completar la reparación y pasar revisión CarCheck.</div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <PillButton tone="primary" size="sm">Agendar reparación</PillButton>
        <PillButton tone="ghost" size="sm">Ver historial del vehículo</PillButton>
      </div>
    </>
  )
}

function ServiceDetail({ modal }: { modal: Extract<ModalPayload, { kind: 'service' }> }) {
  const a = modal.alert
  const tone = (TONE_MAP[a.color] ?? 'amber') as Tone
  const overdue = a.due.includes('VENCIDO')
  const kmNum = parseInt(a.type.replace(/\D/g, ''))
  const kmTarget = isNaN(kmNum) ? 50000 : kmNum * 1000
  const pct = Math.min(100, Math.round((a.km / kmTarget) * 100))

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>Progreso hacia servicio</span>
          <SoftBadge tone={tone} size={10}>{overdue ? 'Vencido' : 'Próximo'}</SoftBadge>
        </div>
        <div style={{ height: 8, background: B.surface2, borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: overdue ? B.rose : B.amber, borderRadius: 9999 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>{a.km.toLocaleString('es-UY')} km actuales</span>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>Servicio a {kmTarget.toLocaleString('es-UY')} km</span>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <StatRow label="Unidad" value={a.unit} />
        <StatRow label="Placa" value={a.plate} />
        <StatRow label="Modelo" value={a.model} />
        <StatRow label="Sucursal" value={a.branch} />
        <StatRow label="Tipo de servicio" value={a.type} />
        <StatRow label="Estado" value={a.due.replace('VENCIDO ', '').replace('VENCE EN ', 'Vence en ').toLowerCase()} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <PillButton tone="primary" size="sm">Agendar servicio</PillButton>
        <PillButton tone="ghost" size="sm">Ver historial de mantenimiento</PillButton>
      </div>
    </>
  )
}

function BranchDetail({ modal }: { modal: Extract<ModalPayload, { kind: 'branch' }> }) {
  const b = modal.branch
  const branchVehicles = FLEET.filter(v =>
    v.branch.toLowerCase().includes(b.name.split(' ')[0].toLowerCase())
  )

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {([
          { l: 'Total', v: b.total, tone: 'sky' as Tone },
          { l: 'Disponibles', v: b.available, tone: 'green' as Tone },
          { l: 'Asignados', v: b.assigned, tone: 'blue' as Tone },
          { l: 'Inactivos', v: b.oos, tone: 'rose' as Tone },
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
            <div style={{ height: '100%', width: `${b.util}%`, background: b.util >= 75 ? B.green : b.util >= 65 ? B.blue : B.amber, borderRadius: 9999 }} />
          </div>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: B.ink }}>{b.util}%</span>
        </div>
      </div>

      {branchVehicles.length > 0 && (
        <>
          <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink3, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vehículos en esta sucursal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {branchVehicles.map(v => <VehicleChip key={v.unit} v={v} />)}
          </div>
        </>
      )}
    </>
  )
}

function ContractDetail({ modal }: { modal: Extract<ModalPayload, { kind: 'contract' }> }) {
  const c = modal.contract
  const tone = (TONE_MAP[c.color] ?? 'amber') as Tone
  const clientKey = c.client.split('·')[0].trim().toUpperCase()
  const contractVehicles = FLEET.filter(v => v.contract.toUpperCase() === clientKey)
  const isUrgent = c.status === 'VENCE PRONTO'
  const isWarning = c.status === 'POR RENOVAR'

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <StatRow label="ID contrato" value={c.id} />
        <StatRow label="Tipo" value={c.type} />
        <StatRow label="Flota asignada" value={`${c.fleet} vehículos`} />
        <StatRow label="Vencimiento" value={`${c.expires} (en ${c.renewIn.toLowerCase()})`} />
        <StatRow label="Estado" value={<SoftBadge tone={tone} size={10}>{c.status.toLowerCase()}</SoftBadge>} />
      </div>

      {(isUrgent || isWarning) && (
        <div style={{ padding: '18px 20px', background: isUrgent ? B.roseSoft : B.amberSoft, borderRadius: B.radiusSm, marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: isUrgent ? B.rose : B.amber, marginBottom: 4 }}>
            {isUrgent ? 'Vence en 1 mes — requiere acción inmediata' : 'Iniciar proceso de renovación'}
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2 }}>
            Contactar al cliente para coordinar la renovación antes del vencimiento.
          </div>
        </div>
      )}

      {contractVehicles.length > 0 && (
        <>
          <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink3, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vehículos del contrato</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
            {contractVehicles.map(v => <VehicleChip key={v.unit} v={v} />)}
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <PillButton tone="primary" size="sm">Gestionar contrato</PillButton>
        <PillButton tone="ghost" size="sm">Descargar PDF</PillButton>
      </div>
    </>
  )
}

function PartDetail({ modal }: { modal: Extract<ModalPayload, { kind: 'part' }> }) {
  const p = modal.part
  const tone = (TONE_MAP[p.color] ?? 'amber') as Tone

  const steps = [
    { label: 'Pedido solicitado', done: true },
    { label: p.status === 'COTIZANDO' ? 'Cotizando con proveedor' : 'Proveedor confirmado', done: p.status !== 'COTIZANDO' },
    { label: 'En tránsito', done: p.status === 'EN TRÁNSITO' || p.status === 'EN STOCK' },
    { label: 'Recibido en sucursal', done: p.status === 'EN STOCK' },
    { label: 'Instalado', done: false },
  ]

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <StatRow label="Referencia" value={p.ref} />
        <StatRow label="Vehículo" value={p.vehicle} />
        <StatRow label="Prioridad" value={<SoftBadge tone={tone} size={10}>{p.priority.toLowerCase()}</SoftBadge>} />
        <StatRow label="Estado" value={p.status.toLowerCase()} />
        <StatRow label="ETA" value={p.eta} />
      </div>

      <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink3, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progreso del pedido</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: i < steps.length - 1 ? 16 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 9999,
                background: s.done ? B.green : B.surface2,
                border: `2px solid ${s.done ? B.green : B.hairline}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {s.done && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={B.surface} strokeWidth="3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 2, flex: 1, minHeight: 16, background: s.done ? B.green : B.hairline }} />
              )}
            </div>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: s.done ? B.ink : B.ink3, fontWeight: s.done ? 500 : 400, paddingTop: 2 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}

function AllAlerts() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {CRITICAL_ALERTS.map(a => {
        const tone = (TONE_MAP[a.color] ?? 'amber') as Tone
        const sourceTone: Tone = a.source === 'CARCHECK' ? 'blue' : 'lilac'
        const srcColor = a.source === 'CARCHECK' ? B.blue : B.lilac
        const srcBg = a.source === 'CARCHECK' ? B.blueSoft : B.lilacSoft
        return (
          <div key={a.unit} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, alignItems: 'center', padding: '14px 16px', background: B.surface2, borderRadius: B.radiusSm }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: srcBg, color: srcColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SourceIcon source={a.source} size={16} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: B.ink }}>{a.unit}</span>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3 }}>· {a.plate}</span>
                <SoftBadge tone={tone} size={10}>{a.severity.toLowerCase()}</SoftBadge>
                <SoftBadge tone={sourceTone} size={10}>{a.source === 'CARCHECK' ? 'CarCheck' : 'Manual'}</SoftBadge>
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2 }}>{a.note}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 2 }}>{a.branch} · hace {a.ago.toLowerCase()}</div>
            </div>
            <SoftBadge tone="amber" size={10}>{a.repair.toLowerCase()}</SoftBadge>
          </div>
        )
      })}
    </div>
  )
}

function AllParts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {PARTS.map(p => {
        const tone = (TONE_MAP[p.color] ?? 'amber') as Tone
        const [fg, bg] = TONE_COLORS[tone]
        return (
          <div key={p.ref} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: B.surface2, borderRadius: B.radiusSm }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5" /><path d="M21 3 11 13" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.part}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 2 }}>{p.vehicle} · {p.eta.toLowerCase()}</div>
            </div>
            <SoftBadge tone={tone} size={10}>{p.priority.toLowerCase()}</SoftBadge>
          </div>
        )
      })}
    </div>
  )
}

export function SoftModal({ modal, onClose }: Props) {
  if (!modal) return null

  const titleCase = (s: string) => s.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')

  if (modal.kind === 'kpi') {
    return (
      <ModalShell title={modal.kpi.label} subtitle={modal.kpi.sub.toLowerCase()} onClose={onClose}>
        <KPIDetail modal={modal} />
      </ModalShell>
    )
  }

  if (modal.kind === 'alert') {
    const a = modal.alert
    const tone = (TONE_MAP[a.color] ?? 'amber') as Tone
    return (
      <ModalShell
        title={a.unit}
        subtitle={`${a.model} · ${a.plate}`}
        badge={<SoftBadge tone={tone} size={10}>{a.severity.toLowerCase()}</SoftBadge>}
        onClose={onClose}
      >
        <AlertDetail modal={modal} />
      </ModalShell>
    )
  }

  if (modal.kind === 'service') {
    const a = modal.alert
    const tone = (TONE_MAP[a.color] ?? 'amber') as Tone
    return (
      <ModalShell
        title={a.unit}
        subtitle={`${a.type} · ${a.model}`}
        badge={<SoftBadge tone={tone} size={10}>{a.due.includes('VENCIDO') ? 'Vencido' : 'Próximo'}</SoftBadge>}
        onClose={onClose}
      >
        <ServiceDetail modal={modal} />
      </ModalShell>
    )
  }

  if (modal.kind === 'branch') {
    const b = modal.branch
    return (
      <ModalShell title={titleCase(b.name)} subtitle={`${b.code} · ${b.total} vehículos`} onClose={onClose}>
        <BranchDetail modal={modal} />
      </ModalShell>
    )
  }

  if (modal.kind === 'contract') {
    const c = modal.contract
    return (
      <ModalShell title={titleCase(c.client)} subtitle={titleCase(c.type)} onClose={onClose}>
        <ContractDetail modal={modal} />
      </ModalShell>
    )
  }

  if (modal.kind === 'part') {
    const p = modal.part
    return (
      <ModalShell title={p.part} subtitle={`${p.ref} · ${p.vehicle}`} onClose={onClose}>
        <PartDetail modal={modal} />
      </ModalShell>
    )
  }

  if (modal.kind === 'all-alerts') {
    return (
      <ModalShell title={modal.title ?? 'Incidentes en curso'} subtitle="Todos los vehículos por agendar" onClose={onClose}>
        <AllAlerts />
      </ModalShell>
    )
  }

  if (modal.kind === 'all-parts') {
    return (
      <ModalShell title="Almacén de refacciones" subtitle="Pedidos activos" onClose={onClose}>
        <AllParts />
      </ModalShell>
    )
  }

  return null
}
