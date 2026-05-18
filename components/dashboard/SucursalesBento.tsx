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

function BranchMiniStats({ b }: { b: Branch }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      {[
        { l: 'Total', v: b.total, tone: 'sky' as Tone },
        { l: 'Disp.', v: b.available, tone: 'green' as Tone },
        { l: 'Asig.', v: b.assigned, tone: 'blue' as Tone },
        { l: 'Inact.', v: b.oos, tone: 'rose' as Tone },
      ].map(s => (
        <div key={s.l}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
            <Dot tone={s.tone} size={5} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500 }}>{s.l}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, letterSpacing: '-0.01em' }}>{s.v}</div>
        </div>
      ))}
    </div>
  )
}

export function SucursalesBento({ openModal }: Props) {
  const branches = BRANCHES
  const parts = PARTS

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 14, marginBottom: 14 }}>
      {/* Section heading */}
      <div style={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>Sucursales</h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, marginTop: 4, marginBottom: 0 }}>Utilización actual · 4 ubicaciones en Uruguay</p>
        </div>
        <PillButton tone="ghost" size="sm">Ver mapa</PillButton>
      </div>

      {/* Montevideo — featured, 7 cols */}
      {(() => {
        const b = branches[0]
        const tone = toneFor(b.util)
        return (
          <SoftCard style={{ gridColumn: 'span 7' }} padding={26} onClick={() => openModal({ kind: 'branch', branch: b })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <SoftBadge tone="blue" size={10}>Sede principal</SoftBadge>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink4 }}>{b.code}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 24, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>{titleCase(b.name)}</h3>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, margin: '6px 0 0' }}>Departamento de Montevideo</p>
              </div>
              <Ring value={b.util} color={TONE_COLOR[tone]} size={76} label={`${b.util}%`} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
              {[
                { l: 'Total', v: b.total, tone: 'sky' as Tone },
                { l: 'Disponibles', v: b.available, tone: 'green' as Tone },
                { l: 'Asignados', v: b.assigned, tone: 'blue' as Tone },
                { l: 'Inactivos', v: b.oos, tone: 'rose' as Tone },
              ].map((s, i) => (
                <div key={s.l} style={{ paddingLeft: i ? 20 : 0, borderLeft: i ? `1px solid ${B.hairline}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Dot tone={s.tone} size={6} />
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500 }}>{s.l}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 28, fontWeight: 600, color: B.ink, letterSpacing: '-0.02em' }}>{s.v}</div>
                </div>
              ))}
            </div>
          </SoftCard>
        )
      })()}

      {/* Colonia — 5 cols */}
      {(() => {
        const b = branches[1]; const tone = toneFor(b.util)
        return (
          <SoftCard style={{ gridColumn: 'span 5' }} padding={24} onClick={() => openModal({ kind: 'branch', branch: b })}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 17, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>{titleCase(b.name)}</h3>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink4, marginTop: 3 }}>{b.code}</div>
              </div>
              <Ring value={b.util} color={TONE_COLOR[tone]} size={56} stroke={5} label={`${b.util}`} />
            </div>
            <BranchMiniStats b={b} />
          </SoftCard>
        )
      })()}

      {/* Punta del Este — 6 cols */}
      {(() => {
        const b = branches[2]; const tone = toneFor(b.util)
        return (
          <SoftCard style={{ gridColumn: 'span 6' }} padding={24} onClick={() => openModal({ kind: 'branch', branch: b })}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 17, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>{titleCase(b.name)}</h3>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink4, marginTop: 3 }}>{b.code} · Temporada alta · enero</div>
              </div>
              <Ring value={b.util} color={TONE_COLOR[tone]} size={56} stroke={5} label={`${b.util}`} />
            </div>
            <BranchMiniStats b={b} />
          </SoftCard>
        )
      })()}

      {/* Salto — 6 cols */}
      {(() => {
        const b = branches[3]; const tone = toneFor(b.util)
        return (
          <SoftCard style={{ gridColumn: 'span 6' }} padding={24} onClick={() => openModal({ kind: 'branch', branch: b })}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 17, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>{titleCase(b.name)}</h3>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink4, marginTop: 3 }}>{b.code} · Litoral norte</div>
              </div>
              <Ring value={b.util} color={TONE_COLOR[tone]} size={56} stroke={5} label={`${b.util}`} />
            </div>
            <BranchMiniStats b={b} />
          </SoftCard>
        )
      })()}

      {/* Parts — full 12 cols */}
      <SoftCard style={{ gridColumn: 'span 12' }} padding={26}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>Refacciones en camino</h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3, marginTop: 4, marginBottom: 0 }}>Pedidos activos · {parts.length} solicitudes</p>
          </div>
          <PillButton tone="ghost" size="sm" onClick={() => openModal({ kind: 'all-parts' })}>Ver almacén</PillButton>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {parts.map(p => {
            const tone = (TONE_MAP[p.color] ?? 'amber') as Tone
            const [fg, bg] = [B[`${tone}` as keyof typeof B] as string, B[`${tone}Soft` as keyof typeof B] as string]
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
  )
}
