'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ActionButton } from '@/components/ui/ActionButton'

// ─── Types ────────────────────────────────────────────────────────────────────

type AlertLevel = 'info' | 'warning' | 'critical'

interface ActiveAlert {
  id: string; level: AlertLevel; message: string
  source: string; status: 'open' | 'acknowledged'; timeAgo: string
}

// ─── Mock active alerts ───────────────────────────────────────────────────────

const MOCK_ALERTS: ActiveAlert[] = [
  { id: 'a1', level: 'warning',  message: 'Tire pressure sensor — check all 4 tires before next rental',            source: 'Sistema (GPS)',    status: 'open',         timeAgo: '2 days ago'  },
  { id: 'a2', level: 'info',     message: '5,000 km service due in approximately 2,716 km',                         source: 'Sistema',          status: 'acknowledged', timeAgo: '5 days ago'  },
  { id: 'a3', level: 'warning',  message: 'Vehicle registration expires in 10 days — renew document',               source: 'Sistema',          status: 'open',         timeAgo: '7 days ago'  },
  { id: 'a4', level: 'critical', message: 'Technical inspection certificate expired 8 days ago — vehicle cannot be rented', source: 'Sistema', status: 'open',         timeAgo: '8 days ago'  },
]

const LEVEL_COLOR: Record<AlertLevel, string> = {
  info:     DS.blue,
  warning:  DS.yellow,
  critical: DS.red,
}

// ─── AlertsTab ────────────────────────────────────────────────────────────────

export function AlertsTab({ unitId }: { unitId: string }) {
  const [level,    setLevel]    = useState<AlertLevel>('warning')
  const [message,  setMessage]  = useState('')
  const [statusAction, setStatusAction] = useState<'none' | 'oos'>('none')
  const [recipients, setRecipients] = useState<Record<string, boolean>>({
    branch: true, workshop: false, management: false, admin: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [alerts, setAlerts] = useState<ActiveAlert[]>(MOCK_ALERTS)

  function toggleRecipient(key: string) {
    setRecipients(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function submit() {
    if (!message.trim()) return
    const newAlert: ActiveAlert = {
      id: `manual-${Date.now()}`,
      level,
      message: message.trim(),
      source: 'Manual · Rocío Ávila',
      status: 'open',
      timeAgo: 'just now',
    }
    setAlerts(prev => [newAlert, ...prev])
    setMessage('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div style={{ maxWidth: 800 }}>

      {/* ── Create alert form ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 14 }}>
          <SectionLabel label={`Create Alert — ${unitId}`} color={DS.red} />
        </div>

        <div style={{
          border: '1px solid var(--ds-border)',
          borderTop: `2px solid ${DS.red}`,
          background: 'var(--ds-bg-1)',
          padding: '20px 22px',
        }}>
          {/* Level selector */}
          <div style={{ marginBottom: 18 }}>
            <Label>Alert Level</Label>
            <div style={{ display: 'flex', gap: 1, background: 'var(--ds-border)', width: 'fit-content' }}>
              {(['info', 'warning', 'critical'] as AlertLevel[]).map(l => {
                const color = LEVEL_COLOR[l]
                const active = level === l
                return (
                  <button key={l} onClick={() => setLevel(l)} style={{
                    height: 34, padding: '0 18px',
                    fontSize: 10, fontFamily: FONTS.mono, textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: active ? color : 'var(--ds-dim)',
                    background: active ? `${color}14` : 'var(--ds-bg-1)',
                    border: `1px solid ${active ? color : 'var(--ds-border)'}`,
                    cursor: 'pointer',
                  }}>
                    {l === 'info' ? 'Informational' : l}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Message */}
          <div style={{ marginBottom: 18 }}>
            <Label>Message</Label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe the issue or situation..."
              style={{
                width: '100%', height: 72,
                padding: '10px 12px',
                fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-text)',
                background: 'var(--ds-bg-2)',
                border: `1px solid ${message ? 'var(--ds-border-2)' : 'var(--ds-border)'}`,
                borderRadius: 0, outline: 'none', resize: 'none',
                letterSpacing: '0.02em', lineHeight: 1.6,
              }}
            />
          </div>

          {/* Recipients */}
          <div style={{ marginBottom: 18 }}>
            <Label>Recipients</Label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(recipients).map(([key, on]) => (
                <button key={key} onClick={() => toggleRecipient(key)} style={{
                  height: 30, padding: '0 14px',
                  fontSize: 9, fontFamily: FONTS.mono, textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: on ? DS.gold : 'var(--ds-dim)',
                  background: on ? `${DS.gold}14` : 'transparent',
                  border: `1px solid ${on ? DS.gold : 'var(--ds-border)'}`,
                  cursor: 'pointer',
                }}>
                  {on ? '✓ ' : ''}{key === 'branch' ? 'All Branch' : key}
                </button>
              ))}
            </div>
          </div>

          {/* Status action */}
          <div style={{ marginBottom: 22 }}>
            <Label>Status Action</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              {([
                { val: 'none', label: 'No Change' },
                { val: 'oos',  label: 'Force Out of Service' },
              ] as const).map(o => (
                <button key={o.val} onClick={() => setStatusAction(o.val)} style={{
                  height: 30, padding: '0 14px',
                  fontSize: 9, fontFamily: FONTS.mono, textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: statusAction === o.val ? (o.val === 'oos' ? DS.red : DS.gold) : 'var(--ds-dim)',
                  background: statusAction === o.val ? (o.val === 'oos' ? `${DS.red}14` : `${DS.gold}14`) : 'transparent',
                  border: `1px solid ${statusAction === o.val ? (o.val === 'oos' ? DS.red : DS.gold) : 'var(--ds-border)'}`,
                  cursor: 'pointer',
                }}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ActionButton
              label="Enviar Alerta"
              color={LEVEL_COLOR[level]}
              onClick={submit}
            />
            {submitted && (
              <span style={{ fontSize: 10, fontFamily: FONTS.mono, color: DS.green, letterSpacing: '0.06em' }}>
                ✓ Alerta creada
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Active alerts ── */}
      <div>
        <div style={{ marginBottom: 14 }}>
          <SectionLabel label="Alertas Activas" count={alerts.filter(a => a.status === 'open').length} color={DS.red} />
        </div>

        {alerts.length === 0 ? (
          <div style={{ padding: '24px 16px', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Sin alertas activas
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--ds-border)' }}>
            {alerts.map(a => {
              const color = LEVEL_COLOR[a.level]
              return (
                <div key={a.id} style={{
                  display: 'grid', gridTemplateColumns: '90px 1fr 140px auto',
                  alignItems: 'center', gap: '0 12px',
                  padding: '10px 14px',
                  background: 'var(--ds-bg-1)',
                  borderLeft: `2px solid ${a.status === 'open' ? color : 'transparent'}`,
                }}>
                  <StatusBadge label={a.level.toUpperCase()} color={color} small />
                  <div>
                    <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-text)', marginBottom: 2 }}>{a.message}</div>
                    <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.04em' }}>{a.source}</div>
                  </div>
                  <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textAlign: 'right' }}>
                    <div style={{ marginBottom: 3 }}>{a.timeAgo}</div>
                    <StatusBadge label={a.status.replace('_', ' ').toUpperCase()} color={a.status === 'open' ? color : DS.green} small />
                  </div>
                  <button
                    onClick={() => setAlerts(prev => prev.map(x => x.id === a.id ? { ...x, status: 'acknowledged' } : x))}
                    style={{
                      width: 28, height: 28, fontSize: 10, fontFamily: FONTS.mono,
                      color: 'var(--ds-dim)', background: 'transparent',
                      border: '1px solid var(--ds-border)', borderRadius: 0, cursor: 'pointer',
                    }}
                    title="Confirmar"
                  >
                    ✓
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Label({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
      {children}
    </div>
  )
}
