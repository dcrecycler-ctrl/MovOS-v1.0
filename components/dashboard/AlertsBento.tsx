'use client'

import { useRef } from 'react'
import { B, Tone } from '@/lib/tokens'
import { CriticalAlert, ServiceAlert } from '@/lib/supabase/queries/dashboard'
import { SoftCard } from '@/components/ui/SoftCard'
import { SoftBadge } from '@/components/ui/SoftBadge'
import { SourceIcon } from '@/components/ui/atoms'
import { ModalPayload } from '@/components/dashboard/types'

interface Props {
  criticalAlerts: CriticalAlert[]
  serviceAlerts: ServiceAlert[]
  openModal: (payload: ModalPayload) => void
}

// Map Supabase alert_source to display source
const toDisplaySource = (source: string): 'CARCHECK' | 'MANUAL' =>
  source === 'manager' || source === 'client' || source === 'technician' ? 'MANUAL' : 'CARCHECK'

const sourceTone = (source: string): Tone =>
  toDisplaySource(source) === 'MANUAL' ? 'lilac' : 'blue'

const sourceColor = (source: string) =>
  toDisplaySource(source) === 'MANUAL' ? B.lilac : B.blue

const sourceBg = (source: string) =>
  toDisplaySource(source) === 'MANUAL' ? B.lilacSoft : B.blueSoft

const sourceLabel = (source: string) =>
  toDisplaySource(source) === 'MANUAL' ? 'Manual' : 'Sistema'

export function AlertsBento({ criticalAlerts, serviceAlerts, openModal }: Props) {
  const crit = criticalAlerts
  const svc = serviceAlerts

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-3.5 items-stretch">
      {/* Critical alerts */}
      <div className="min-w-0 w-full overflow-hidden h-full flex flex-col">
      <SoftCard padding={26} style={{ height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>Incidentes en curso</h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, marginTop: 4, marginBottom: 0 }}>Vehículos detenidos · por agendar reparación</p>
          </div>
          {crit.length > 0 && <SoftBadge tone="rose">{crit.length} por agendar</SoftBadge>}
        </div>

        {/* Source legend */}
        <div style={{ display: 'flex', gap: 14, padding: '10px 0 14px', borderBottom: `1px solid ${B.hairline}`, marginBottom: 6, fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: B.blue }}><SourceIcon source="CARCHECK" size={14} /></span>
            Sistema · alerta automática
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: B.lilac }}><SourceIcon source="MANUAL" size={14} /></span>
            Manual · reporte de usuario
          </span>
        </div>

        {crit.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0', fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3 }}>
            Sin alertas activas
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {crit.map(a => {
              const tone: Tone = a.urgent ? 'rose' : 'amber'
              const dispSrc = toDisplaySource(a.source)
              const srcTone = sourceTone(a.source)
              const srcClr = sourceColor(a.source)
              const srcBg = sourceBg(a.source)
              return (
                <AlertRow
                  key={a.id}
                  onClick={() => openModal({ kind: 'alert', alert: a })}
                  icon={
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: srcBg, color: srcClr, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <SourceIcon source={dispSrc} size={18} />
                    </div>
                  }
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: B.ink }}>{a.unit}</span>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3 }}>· {a.plate}</span>
                      <SoftBadge tone={tone} size={10}>{a.urgent ? 'crítico' : 'alerta'}</SoftBadge>
                      <SoftBadge tone={srcTone} size={10}>{sourceLabel(a.source)}</SoftBadge>
                    </div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.message}</div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <SoftBadge tone="amber" size={10}>por agendar</SoftBadge>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>hace {a.timeAgo}</div>
                  </div>
                </AlertRow>
              )
            })}
          </div>
        )}

        <div
          onClick={() => openModal({ kind: 'all-alerts', title: 'Incidentes en curso', alerts: crit })}
          style={{ marginTop: 10, padding: 10, textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2, fontWeight: 500, cursor: 'pointer', borderRadius: 10, transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = B.surface2)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Ver bandeja completa de incidentes →
        </div>
      </SoftCard>
      </div>

      {/* Service alerts */}
      <div className="min-w-0 w-full overflow-hidden h-full flex flex-col">
      <SoftCard padding={26} style={{ height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>Próximos servicios</h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, marginTop: 4, marginBottom: 0 }}>Programa del manufacturador · ventana de alerta</p>
          </div>
          {svc.length > 0 && <SoftBadge tone="amber">{svc.length} pendientes</SoftBadge>}
        </div>

        {svc.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0', fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3 }}>
            Sin servicios próximos
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {svc.slice(0, 4).map(a => {
              const tone: Tone = a.overdue ? 'rose' : a.level === 'CRITICAL' ? 'rose' : 'amber'
              return (
                <div
                  key={a.id}
                  onClick={() => openModal({ kind: 'service', alert: a })}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: B.surface2, cursor: 'pointer' }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: B.ink }}>{a.unit}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, marginTop: 2 }}>
                      {a.vehicle.split(' ').slice(0, 2).join(' ')} · {a.service}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <SoftBadge tone={tone} size={10}>{a.overdue ? 'Vencido' : 'Programar'}</SoftBadge>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 4 }}>
                      {a.overdue ? `${a.deltaDisplay} vencido` : `faltan ${a.deltaDisplay}`}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SoftCard>
      </div>
    </div>
  )
}

function AlertRow({ children, onClick, icon }: { children: React.ReactNode; onClick: () => void; icon: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => { if (ref.current) ref.current.style.background = B.surface2 }}
      onMouseLeave={() => { if (ref.current) ref.current.style.background = 'transparent' }}
      style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center', padding: '14px 16px', borderRadius: 14, cursor: 'pointer', transition: 'background 0.15s' }}
    >
      {icon}
      {children}
    </div>
  )
}
