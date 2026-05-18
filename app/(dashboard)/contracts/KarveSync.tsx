'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import { ActionButton } from '@/components/ui/ActionButton'

// ─── Mock data ────────────────────────────────────────────────────────────────

const TODAY_STATS = [
  { label: 'Pickups Today',  value: 3,  color: DS.green  },
  { label: 'Returns Today',  value: 5,  color: DS.orange },
  { label: 'Active Rentals', value: 21, color: DS.blue   },
  { label: 'Upcoming 48h',   value: 7,  color: DS.yellow },
]

type ResStatus = 'ACTIVE' | 'RETURNED' | 'UPCOMING' | 'CONFIRMED'

interface Reservation {
  id: string; unit: string; customer: string
  pickup: string; return_: string; status: ResStatus
}

const RESERVATIONS: Reservation[] = [
  { id: 'RES-8815', unit: 'U-0050',  customer: 'Felipe Sosa',    pickup: '19 May', return_: '25 May', status: 'UPCOMING'  },
  { id: 'RES-8814', unit: 'U-0062',  customer: 'Laura Pérez',    pickup: '18 May', return_: '22 May', status: 'ACTIVE'    },
  { id: 'RES-8813', unit: 'U-0078',  customer: 'Sebastián Ruiz', pickup: '18 May', return_: '20 May', status: 'ACTIVE'    },
  { id: 'RES-8812', unit: 'U-0142',  customer: 'Carlos Mendoza', pickup: '12 May', return_: '18 May', status: 'RETURNED'  },
  { id: 'RES-8810', unit: 'U-0088',  customer: 'Ana Flores',     pickup: '10 May', return_: '18 May', status: 'RETURNED'  },
]

const STATUS_COLOR: Record<ResStatus, string> = {
  ACTIVE:    DS.green,
  RETURNED:  DS.slate,
  UPCOMING:  DS.yellow,
  CONFIRMED: DS.blue,
}

// ─── KarveSync ────────────────────────────────────────────────────────────────

export function KarveSync() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState('Today at 14:32')

  function handleSync() {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      const now = new Date()
      setLastSync(`Today at ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`)
    }, 1800)
  }

  return (
    <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>

      {/* Header */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
        <SectionLabel label="Karve API — Short Term Rentals" color={DS.green} />
      </div>

      {/* Connection status */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderBottom: '1px solid var(--ds-border)',
        background: `${DS.green}08`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, background: DS.green, borderRadius: '50%' }} />
          <span style={{ fontSize: 10, fontFamily: FONTS.mono, color: DS.green, letterSpacing: '0.06em' }}>
            CONNECTED
          </span>
          <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>
            — Karve v2 API
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>
            Last sync: {lastSync}
          </span>
          <ActionButton
            label={syncing ? 'Syncing…' : 'Sync Now'}
            color={DS.green}
            onClick={handleSync}
          />
        </div>
      </div>

      {/* Today's stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--ds-border)', borderBottom: '1px solid var(--ds-border)' }}>
        {TODAY_STATS.map(s => (
          <div key={s.label} style={{ background: 'var(--ds-bg-1)', padding: '12px 14px' }}>
            <div style={{ fontSize: 28, fontFamily: FONTS.display, color: s.color, lineHeight: 1, marginBottom: 3 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent reservations header */}
      <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--ds-border)' }}>
        <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Recent Reservations
        </span>
      </div>

      {/* Reservations table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Res ID', 'Vehicle', 'Customer', 'Pickup', 'Return', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '0 10px', height: 28,
                  fontSize: 8, fontFamily: FONTS.mono,
                  textTransform: 'uppercase', letterSpacing: '0.09em',
                  color: 'var(--ds-muted)', textAlign: 'left',
                  borderBottom: '1px solid var(--ds-border)',
                  whiteSpace: 'nowrap', background: 'var(--ds-bg)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RESERVATIONS.map((r, i) => (
              <tr key={r.id} style={{
                height: 38,
                borderBottom: i < RESERVATIONS.length - 1 ? '1px solid var(--ds-border)' : 'none',
              }}>
                <td style={{ padding: '0 10px', fontSize: 10, fontFamily: FONTS.mono, color: DS.blue }}>{r.id}</td>
                <td style={{ padding: '0 10px', fontSize: 10, fontFamily: FONTS.mono, color: DS.gold }}>{r.unit}</td>
                <td style={{ padding: '0 10px', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-text)' }}>{r.customer}</td>
                <td style={{ padding: '0 10px', fontSize: 9,  fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>{r.pickup}</td>
                <td style={{ padding: '0 10px', fontSize: 9,  fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>{r.return_}</td>
                <td style={{ padding: '0 10px' }}>
                  <StatusBadge label={r.status} color={STATUS_COLOR[r.status]} small />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid var(--ds-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.04em' }}>
          Data sourced from Karve · Short-term only
        </span>
        <button style={{
          fontSize: 9, fontFamily: FONTS.mono, color: DS.blue,
          background: 'transparent', border: 'none', cursor: 'pointer',
          letterSpacing: '0.06em',
        }}>
          API Settings →
        </button>
      </div>
    </div>
  )
}
