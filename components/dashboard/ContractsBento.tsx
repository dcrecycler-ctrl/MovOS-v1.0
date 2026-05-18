'use client'

import { B, TONE_MAP, Tone } from '@/lib/tokens'
import { CONTRACTS } from '@/lib/data'
import { SoftCard } from '@/components/ui/SoftCard'
import { SoftBadge } from '@/components/ui/SoftBadge'
import { PillButton } from '@/components/ui/PillButton'
import { ModalPayload } from '@/components/dashboard/types'

interface Props {
  openModal: (payload: ModalPayload) => void
}

const STATUS_LABEL: Record<string, string> = {
  'ACTIVO': 'Activo',
  'POR RENOVAR': 'Por renovar',
  'VENCE PRONTO': 'Vence pronto',
}

const titleCase = (s: string) =>
  s.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')

export function ContractsBento({ openModal }: Props) {
  const contracts = CONTRACTS

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14, marginTop: 8 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>Contratos corporativos</h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, marginTop: 4, marginBottom: 0 }}>Flotillas activas · {contracts.filter(c => c.status === 'ACTIVO').length} activos · {contracts.filter(c => c.status !== 'ACTIVO').length} por atender</p>
        </div>
        <PillButton tone="ghost" size="sm">Ver todos</PillButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch">
        {contracts.map(c => {
          const tone = (TONE_MAP[c.color] ?? 'amber') as Tone
          const isUrgent = c.status === 'VENCE PRONTO'
          const isWarning = c.status === 'POR RENOVAR'

          return (
            <div key={c.id} className="min-w-0 w-full overflow-hidden h-full flex flex-col">
            <SoftCard
              key={c.id}
              padding={24}
              onClick={() => openModal({ kind: 'contract', contract: c })}
              style={{ height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink4, marginBottom: 4 }}>{c.id}</div>
                  <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 16, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {titleCase(c.client)}
                  </h3>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, marginTop: 3 }}>{titleCase(c.type)}</div>
                </div>
                <SoftBadge tone={tone} size={10}>{STATUS_LABEL[c.status] ?? c.status}</SoftBadge>
              </div>

              <div style={{ display: 'flex', gap: 0, padding: '14px 0', borderTop: `1px solid ${B.hairline}`, borderBottom: `1px solid ${B.hairline}`, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginBottom: 4 }}>Flota asignada</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, letterSpacing: '-0.02em', lineHeight: 1 }}>{c.fleet}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink4, marginTop: 2 }}>vehículos</div>
                </div>
                <div style={{ flex: 1, paddingLeft: 20, borderLeft: `1px solid ${B.hairline}` }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginBottom: 4 }}>Vencimiento</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: isUrgent ? B.rose : isWarning ? B.amber : B.ink, letterSpacing: '-0.01em' }}>{c.expires}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink4, marginTop: 2 }}>en {c.renewIn.toLowerCase()}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3 }}>
                  {isUrgent ? '⚠ Requiere acción inmediata' : isWarning ? 'Iniciar proceso de renovación' : 'Contrato vigente'}
                </span>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.blue, fontWeight: 500 }}>Ver →</span>
              </div>
            </SoftCard>
            </div>
          )
        })}
      </div>
    </div>
  )
}
