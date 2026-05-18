'use client'
import { DS, FONTS } from '@/lib/tokens'
import { CSSProperties, useState } from 'react'

interface CycleCardProps {
  label: string
  sub?: string
  value: number
  total: number
  color?: string
  index?: number
  showArrow?: boolean
  onClick?: () => void
}

export function CycleCard({
  label,
  sub,
  value,
  total,
  color = DS.gold,
  index,
  showArrow = false,
  onClick,
}: CycleCardProps) {
  const [hovered, setHovered] = useState(false)
  const pct = total > 0 ? Math.min(value / total, 1) : 0

  const card: CSSProperties = {
    position: 'relative',
    flex: 1,
    background: 'var(--ds-bg-1)',
    borderTop: `3px solid ${color}`,
    border: `1px solid var(--ds-border)`,
    borderTopWidth: 3,
    borderTopColor: color,
    padding: '16px 16px 14px',
    cursor: onClick ? 'pointer' : 'default',
    overflow: 'hidden',
    transition: 'background 0.15s',
    ...(hovered && onClick ? { background: 'var(--ds-bg-2)' } : {}),
  }

  const ghost: CSSProperties = {
    position: 'absolute',
    bottom: -8,
    right: -4,
    fontSize: 52,
    fontFamily: FONTS.display,
    color: `${color}12`,
    lineHeight: 1,
    userSelect: 'none',
    pointerEvents: 'none',
  }

  const arrow: CSSProperties = {
    position: 'absolute',
    right: -13,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    fontSize: 14,
    color: 'var(--ds-border-2)',
    lineHeight: 1,
    pointerEvents: 'none',
    userSelect: 'none',
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flex: 1 }}>
      <div
        style={card}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          fontSize: 9,
          fontFamily: FONTS.mono,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--ds-muted)',
          marginBottom: 6,
        }}>
          {label}
        </div>

        <div style={{
          fontSize: 44,
          lineHeight: 1,
          fontFamily: FONTS.display,
          color: 'var(--ds-text)',
          marginBottom: 2,
        }}>
          {value}
          <span style={{ fontSize: 18, color: 'var(--ds-dim)', marginLeft: 4 }}>/{total}</span>
        </div>

        {sub && (
          <div style={{
            fontSize: 10,
            fontFamily: FONTS.mono,
            color: 'var(--ds-dim)',
            marginBottom: 10,
            letterSpacing: '0.04em',
          }}>
            {sub}
          </div>
        )}

        <div style={{
          height: 2,
          background: 'var(--ds-border)',
          borderRadius: 2,
          marginTop: sub ? 0 : 10,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${pct * 100}%`,
            height: '100%',
            background: color,
            borderRadius: 2,
            transition: 'width 0.4s ease',
          }} />
        </div>

        {index !== undefined && <div style={ghost}>{index}</div>}
      </div>
      {showArrow && <div style={arrow}>›</div>}
    </div>
  )
}
