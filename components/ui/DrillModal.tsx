'use client'
import { B } from '@/lib/tokens'
import { CSSProperties, ReactNode, useEffect } from 'react'
import { useBreakpoint } from '@/hooks/useBreakpoint'

interface DrillModalProps {
  title: string
  subtitle?: string
  color?: string
  children: ReactNode
  onClose: () => void
}

export function DrillModal({ title, subtitle, color = B.amber, children, onClose }: DrillModalProps) {
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const overlay: CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 9000,
    background: 'rgba(14,23,38,0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent: isMobile ? 'stretch' : 'center',
  }

  const panel: CSSProperties = isMobile
    ? {
        position: 'relative',
        width: '100%',
        height: '90vh',
        background: B.surface,
        borderTop: `2px solid ${color}`,
        borderRadius: '16px 16px 0 0',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: B.shadowLg,
      }
    : {
        position: 'relative',
        width: '90%',
        maxWidth: 720,
        maxHeight: '90vh',
        background: B.surface,
        borderTop: `2px solid ${color}`,
        border: `1px solid ${B.hairline}`,
        borderTopWidth: 2,
        borderRadius: 16,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: B.shadowLg,
      }

  const header: CSSProperties = {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: '20px 24px 16px',
    borderBottom: `1px solid ${B.hairline}`,
    flexShrink: 0,
  }

  const closeBtn: CSSProperties = {
    width: 32, height: 32,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, color: B.ink3,
    background: B.surface2,
    border: `1px solid ${B.hairline}`,
    borderRadius: 9999, cursor: 'pointer', flexShrink: 0,
    fontFamily: 'var(--font-inter)',
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={e => e.stopPropagation()}>

        {/* Mobile drag handle */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
            <div style={{ width: 36, height: 3, background: B.ink4, borderRadius: 9999 }} />
          </div>
        )}

        <div style={header}>
          <div>
            <div style={{ fontSize: 18, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.ink, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink3, marginTop: 4 }}>
                {subtitle}
              </div>
            )}
          </div>
          <button style={closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 28px', background: B.bg }}>
          {children}
        </div>
      </div>
    </div>
  )
}
