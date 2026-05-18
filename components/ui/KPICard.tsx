'use client'
import { DS, FONTS } from '@/lib/tokens'
import { CSSProperties, useState } from 'react'

interface KPICardProps {
  label: string
  value: string | number
  sub?: string
  subColor?: string
  color?: string
  onClick?: () => void
}

export function KPICard({ label, value, sub, subColor, color = DS.gold, onClick }: KPICardProps) {
  const [hovered, setHovered] = useState(false)

  const borderColor = color
  const card: CSSProperties = {
    position: 'relative',
    background: 'var(--ds-bg-1)',
    borderTop: `2px solid ${borderColor}`,
    border: `1px solid var(--ds-border)`,
    borderTopWidth: 2,
    borderTopColor: borderColor,
    padding: '16px 18px 14px',
    cursor: onClick ? 'pointer' : 'default',
    fontFamily: FONTS.mono,
    transition: 'background 0.15s',
    ...(hovered && onClick ? { background: 'var(--ds-bg-2)' } : {}),
  }

  return (
    <div
      className="min-w-0 w-full overflow-hidden"
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
        marginBottom: 8,
      }}>
        {label}
      </div>

      <div
        className="text-3xl md:text-4xl lg:text-5xl"
        style={{
          lineHeight: 1,
          fontFamily: FONTS.display,
          color: 'var(--ds-text)',
          marginBottom: sub ? 6 : 0,
        }}
      >
        {value}
      </div>

      {sub && (
        <div
          className="overflow-hidden"
          style={{
            fontSize: 10,
            fontFamily: FONTS.mono,
            color: subColor ?? 'var(--ds-dim)',
            letterSpacing: '0.04em',
            wordBreak: 'break-word',
          }}
        >
          {sub}
        </div>
      )}

      {onClick && hovered && (
        <div style={{
          position: 'absolute',
          bottom: 12,
          right: 14,
          fontSize: 9,
          fontFamily: FONTS.mono,
          letterSpacing: '0.1em',
          color: borderColor,
          textTransform: 'uppercase',
        }}>
          VIEW →
        </div>
      )}
    </div>
  )
}
