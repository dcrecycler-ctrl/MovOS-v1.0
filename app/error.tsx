'use client'

import { useEffect } from 'react'
import { B } from '@/lib/tokens'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div style={{ minHeight: '100vh', background: B.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, padding: 40, background: B.surface, borderRadius: B.radiusLg, boxShadow: B.shadowLg }}>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.rose, fontWeight: 500, marginBottom: 12 }}>Error de renderizado</div>
        <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 20, fontWeight: 600, color: B.ink, margin: '0 0 12px', letterSpacing: '-0.02em' }}>{error.message}</h2>
        <pre style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3, background: B.surface2, padding: 16, borderRadius: B.radiusSm, overflow: 'auto', marginBottom: 20, whiteSpace: 'pre-wrap' }}>
          {error.stack}
        </pre>
        <button onClick={reset} style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.surface, background: B.ink, border: 'none', padding: '10px 20px', borderRadius: 9999, cursor: 'pointer' }}>
          Reintentar
        </button>
      </div>
    </div>
  )
}
