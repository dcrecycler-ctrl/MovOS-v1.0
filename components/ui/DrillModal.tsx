'use client'
import { DS, FONTS } from '@/lib/tokens'
import { CSSProperties, ReactNode, useEffect } from 'react'

interface DrillModalProps {
  title: string
  subtitle?: string
  color?: string
  children: ReactNode
  onClose: () => void
}

export function DrillModal({ title, subtitle, color = DS.gold, children, onClose }: DrillModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const overlay: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9000,
    background: 'rgba(0,0,0,0.88)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  }

  const panel: CSSProperties = {
    position: 'relative',
    width: 480,
    maxWidth: '100vw',
    height: '100vh',
    background: 'var(--ds-bg-1)',
    borderTop: `2px solid ${color}`,
    borderLeft: '1px solid var(--ds-border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }

  const header: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '20px 20px 16px',
    borderBottom: '1px solid var(--ds-border)',
    flexShrink: 0,
  }

  const closeBtn: CSSProperties = {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    color: 'var(--ds-dim)',
    background: 'transparent',
    border: '1px solid var(--ds-border)',
    borderRadius: 0,
    cursor: 'pointer',
    flexShrink: 0,
    fontFamily: FONTS.mono,
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={e => e.stopPropagation()}>
        <div style={header}>
          <div>
            <div style={{
              fontSize: 20,
              fontFamily: FONTS.display,
              color: 'var(--ds-text)',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
            }}>
              {title}
            </div>
            {subtitle && (
              <div style={{
                fontSize: 10,
                fontFamily: FONTS.mono,
                color: 'var(--ds-dim)',
                marginTop: 4,
                letterSpacing: '0.06em',
              }}>
                {subtitle}
              </div>
            )}
          </div>
          <button style={closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 24px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
