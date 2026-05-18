'use client'

import { B, Tone } from '@/lib/tokens'
import { BRANCHES, PARTS, Branch } from '@/lib/data'
import { SoftCard } from '@/components/ui/SoftCard'
import { SoftBadge } from '@/components/ui/SoftBadge'
import { PillButton } from '@/components/ui/PillButton'
import { Dot, Ring } from '@/components/ui/atoms'
import { ModalPayload } from '@/components/dashboard/types'

interface Props {
  openModal: (payload: ModalPayload) => void
}

const toneFor = (util: number): Tone => util >= 75 ? 'green' : util >= 65 ? 'blue' : 'amber'
const TONE_COLOR: Record<Tone, string> = {
  green: B.green, blue: B.blue, amber: B.amber, rose: B.rose,
  lilac: B.lilac, sky: B.sky, ochre: B.ochre, neutral: B.ink3,
}
const titleCase = (s: string) => s.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')
const TONE_MAP: Record<string, Tone> = { red: 'rose', orange: 'amber', yellow: 'amber', green: 'green', blue: 'blue' }

// Compact card used in mobile horizontal scroll
function BranchScrollCard({ b, onClick }: { b: Branch; onClick: () => void }) {
  const tone = toneFor(b.util)
  return (
    <SoftCard
      padding={14}
      onClick={onClick}
      style={{ flexShrink: 0, width: 152 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 8 }}>
          {titleCase(b.name).split(' ').slice(0, 2).join(' ')}
        </span>
        <Ring value={b.util} color={TONE_COLOR[tone]} size={32} stroke={3} label={`${b.util}`} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-inter)', fontSize: 10, color: B.ink3 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Dot tone="green" size={4} /> {b.available}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Dot tone="blue"  size={4} /> {b.assigned}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Dot tone="rose"  size={4} /> {b.oos}</span>
      </div>
    </SoftCard>
  )
}

// Full card used in tablet/desktop grid
function BranchGridCard({ b, index, onClick }: { b: Branch; index: number; onClick: () => void }) {
  const tone = toneFor(b.util)
  const isMain = index === 0
  return (
    <div className="min-w-0 w-full overflow-hidden h-full flex flex-col">
      <SoftCard padding={isMain ? 26 : 24} onClick={onClick} style={{ height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: isMain ? 22 : 18 }}>
          <div>
            {isMain && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <SoftBadge tone="blue" size={10}>Sede principal</SoftBadge>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink4 }}>{b.code}</span>
              </div>
            )}
            <h3 style={{
              fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.ink, margin: 0,
              letterSpacing: isMain ? '-0.02em' : '-0.01em',
              fontSize: isMain ? 24 : 17,
            }}>{titleCase(b.name)}</h3>
            {!isMain && <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink4, marginTop: 3 }}>{b.code}</div>}
            {isMain && <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, margin: '6px 0 0' }}>Departamento de Montevideo</p>}
          </div>
          <Ring value={b.util} color={TONE_COLOR[tone]} size={isMain ? 76 : 56} stroke={isMain ? 6 : 5} label={isMain ? `${b.util}%` : `${b.util}`} />
        </div>
        {isMain ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {([
              { l: 'Total', v: b.total, tone: 'sky' as Tone },
              { l: 'Disponibles', v: b.available, tone: 'green' as Tone },
              { l: 'Asignados', v: b.assigned, tone: 'blue' as Tone },
              { l: 'Inactivos', v: b.oos, tone: 'rose' as Tone },
            ] as const).map((s, i) => (
              <div key={s.l} style={{ paddingLeft: i ? 14 : 0, borderLeft: i ? `1px solid ${B.hairline}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                  <Dot tone={s.tone} size={5} />
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: B.ink3, fontWeight: 500 }}>{s.l}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 22, fontWeight: 600, color: B.ink, letterSpacing: '-0.02em' }}>{s.v}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {([
              { l: 'Tot', v: b.total, tone: 'sky' as Tone },
              { l: 'Disp.', v: b.available, tone: 'green' as Tone },
              { l: 'Asig.', v: b.assigned, tone: 'blue' as Tone },
              { l: 'Inac.', v: b.oos, tone: 'rose' as Tone },
            ] as const).map(s => (
              <div key={s.l}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <Dot tone={s.tone} size={5} />
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: B.ink3, fontWeight: 500 }}>{s.l}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, letterSpacing: '-0.01em' }}>{s.v}</div>
              </div>
            ))}
          </div>
        )}
      </SoftCard>
    </div>
  )
}

export function SucursalesBento({ openModal }: Props) {
  const branches = BRANCHES
  const parts = PARTS

  return (
    <div className="mb-3.5">
      {/* Section heading */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8, marginBottom: 14 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>Sucursales</h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, marginTop: 4, marginBottom: 0 }}>Utilización actual · 4 ubicaciones en Uruguay</p>
        </div>
        <PillButton tone="ghost" size="sm">Ver mapa</PillButton>
      </div>

      {/* Mobile: horizontal scroll strip */}
      <div className="flex sm:hidden gap-2.5 overflow-x-auto pb-2 mb-3.5" style={{ marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16, scrollbarWidth: 'none' }}>
        {branches.map(b => (
          <BranchScrollCard key={b.id} b={b} onClick={() => openModal({ kind: 'branch', branch: b })} />
        ))}
      </div>

      {/* Tablet+: 2×2 / 4-col grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-3.5 items-stretch">
        {branches.map((b, i) => (
          <BranchGridCard key={b.id} b={b} index={i} onClick={() => openModal({ kind: 'branch', branch: b })} />
        ))}
      </div>

      {/* Parts — full width */}
      <div className="min-w-0 w-full overflow-hidden">
        <SoftCard padding={26}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>Refacciones en camino</h2>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, marginTop: 4, marginBottom: 0 }}>Pedidos activos · {parts.length} solicitudes</p>
            </div>
            <PillButton tone="ghost" size="sm" onClick={() => openModal({ kind: 'all-parts' })}>Ver almacén</PillButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {parts.map(p => {
              const tone = (TONE_MAP[p.color] ?? 'amber') as Tone
              const fg = B[`${tone}` as keyof typeof B] as string
              const bg = B[`${tone}Soft` as keyof typeof B] as string
              return (
                <div
                  key={p.ref}
                  onClick={() => openModal({ kind: 'part', part: p })}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, background: B.surface2, cursor: 'pointer' }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: fg, flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 3h5v5" /><path d="M21 3 11 13" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 500, color: B.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.part}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, marginTop: 2 }}>{p.vehicle} · {p.eta.toLowerCase()}</div>
                  </div>
                  <SoftBadge tone={tone} size={10}>{p.priority.toLowerCase()}</SoftBadge>
                </div>
              )
            })}
          </div>
        </SoftCard>
      </div>
    </div>
  )
}
