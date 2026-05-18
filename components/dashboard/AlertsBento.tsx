'use client'

import { useRef } from 'react'
import { B, TONE_MAP, Tone } from '@/lib/tokens'
import { CRITICAL_ALERTS, SERVICE_ALERTS } from '@/lib/data'
import { SoftCard } from '@/components/ui/SoftCard'
import { SoftBadge } from '@/components/ui/SoftBadge'
import { SourceIcon } from '@/components/ui/atoms'
import { ModalPayload } from '@/components/dashboard/types'

interface Props {
  openModal: (payload: ModalPayload) => void
}

export function AlertsBento({ openModal }: Props) {
  const crit = CRITICAL_ALERTS
  const svc = SERVICE_ALERTS

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 14, marginBottom: 14 }}>
      {/* Critical alerts — repair queue */}
      <SoftCard padding={26}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>Incidentes en curso</h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, marginTop: 4, marginBottom: 0 }}>Vehículos detenidos · por agendar reparación para volver a disponible</p>
          </div>
          <SoftBadge tone="rose">{crit.length} por agendar</SoftBadge>
        </div>

        {/* Source legend */}
        <div style={{ display: 'flex', gap: 14, padding: '10px 0 14px', borderBottom: `1px solid ${B.hairline}`, marginBottom: 6, fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: B.blue }}><SourceIcon source="CARCHECK" size={14} /></span>
            CarCheck · inspección al retorno
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: B.lilac }}><SourceIcon source="MANUAL" size={14} /></span>
            Manual · reporte de gerencia
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {crit.map(a => {
            const tone = (TONE_MAP[a.color] ?? 'amber') as Tone
            const sourceTone: Tone = a.source === 'CARCHECK' ? 'blue' : 'lilac'
            const srcColor = a.source === 'CARCHECK' ? B.blue : B.lilac
            const srcBg = a.source === 'CARCHECK' ? B.blueSoft : B.lilacSoft
            return (
              <AlertRow
                key={a.unit}
                onClick={() => openModal({ kind: 'alert', alert: a })}
                icon={
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: srcBg, color: srcColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <SourceIcon source={a.source} size={18} />
                  </div>
                }
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: B.ink }}>{a.unit}</span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3 }}>· {a.plate}</span>
                    <SoftBadge tone={tone} size={10}>{a.severity.toLowerCase()}</SoftBadge>
                    <SoftBadge tone={sourceTone} size={10}>{a.source === 'CARCHECK' ? 'CarCheck' : 'Manual'}</SoftBadge>
                  </div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.note}</div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <SoftBadge tone="amber" size={10}>{a.repair.toLowerCase()}</SoftBadge>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>{a.branch} · hace {a.ago.toLowerCase()}</div>
                </div>
              </AlertRow>
            )
          })}
        </div>

        <div
          onClick={() => openModal({ kind: 'all-alerts', title: 'Incidentes en curso' })}
          style={{ marginTop: 10, padding: 10, textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2, fontWeight: 500, cursor: 'pointer', borderRadius: 10, transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = B.surface2)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Ver bandeja completa de incidentes →
        </div>
      </SoftCard>

      {/* Service alerts */}
      <SoftCard padding={26}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>Próximos servicios</h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, marginTop: 4, marginBottom: 0 }}>Programa del manufacturador · 14 días</p>
          </div>
          <SoftBadge tone="amber">{svc.length} pendientes</SoftBadge>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {svc.slice(0, 4).map(a => {
            const tone = (TONE_MAP[a.color] ?? 'amber') as Tone
            const overdue = a.due.includes('VENCIDO')
            return (
              <div
                key={a.unit}
                onClick={() => openModal({ kind: 'service', alert: a })}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: B.surface2, cursor: 'pointer' }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: B.ink }}>{a.unit}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, marginTop: 2 }}>{a.model.split(' ').slice(0, 2).join(' ')} · {a.km.toLocaleString('es-UY')} km</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <SoftBadge tone={tone} size={10}>{overdue ? 'Vencido' : 'Programar'}</SoftBadge>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 4 }}>
                    {a.due.replace('VENCIDO ', '').replace('VENCE EN ', 'en ').toLowerCase()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SoftCard>
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
