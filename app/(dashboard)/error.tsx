'use client'

import { useEffect } from 'react'
import { DS, FONTS } from '@/lib/tokens'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// This boundary only fires for uncaught render errors — query errors are
// handled inline per-section in DashboardClient and never reach here.
export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[dashboard] render error:', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ds-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    }}>
      <div style={{
        maxWidth: 480,
        border: `1px solid ${DS.red}54`,
        borderTop: `2px solid ${DS.red}`,
        background: 'var(--ds-bg-1)',
        padding: '28px 32px',
      }}>
        {/* Header */}
        <div style={{
          fontSize: 28,
          fontFamily: FONTS.display,
          color: DS.red,
          letterSpacing: '0.06em',
          lineHeight: 1,
          marginBottom: 8,
        }}>
          DASHBOARD ERROR
        </div>
        <div style={{
          fontSize: 9,
          fontFamily: FONTS.mono,
          color: 'var(--ds-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 20,
        }}>
          A render error prevented the dashboard from loading
        </div>

        {/* Error message */}
        <div style={{
          padding: '10px 12px',
          background: 'var(--ds-bg-2)',
          borderLeft: `2px solid ${DS.red}`,
          fontFamily: FONTS.mono,
          fontSize: 11,
          color: 'var(--ds-text)',
          marginBottom: 8,
          wordBreak: 'break-word',
        }}>
          {error.message || 'Unknown error'}
        </div>

        {/* Digest (for Vercel error matching) */}
        {error.digest && (
          <div style={{
            fontSize: 9,
            fontFamily: FONTS.mono,
            color: 'var(--ds-muted)',
            letterSpacing: '0.06em',
            marginBottom: 24,
          }}>
            Digest: {error.digest}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={reset}
            style={{
              height: 32, padding: '0 16px',
              fontSize: 10, fontFamily: FONTS.mono,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: DS.gold,
              background: `${DS.gold}1C`,
              border: `1px solid ${DS.gold}`,
              borderRadius: 0, cursor: 'pointer',
            }}
          >
            Retry
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              height: 32, padding: '0 16px',
              fontSize: 10, fontFamily: FONTS.mono,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--ds-dim)',
              background: 'transparent',
              border: '1px solid var(--ds-border)',
              borderRadius: 0, cursor: 'pointer',
            }}
          >
            Hard Reload
          </button>
        </div>
      </div>
    </div>
  )
}
