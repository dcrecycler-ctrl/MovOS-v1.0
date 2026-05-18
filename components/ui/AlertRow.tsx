'use client'
import { DS, FONTS } from '@/lib/tokens'
import { CSSProperties, useState } from 'react'

interface AlertRowProps {
  unit: string
  plate: string
  message: string
  type?: string
  time?: string
  urgent?: boolean
  onClick?: () => void
}

const TYPE_COLOR: Record<string, string> = {
  mechanical: DS.red,
  fuel:       DS.orange,
  insurance:  DS.yellow,
  inspection: DS.blue,
  tire:       DS.lime,
  electrical: DS.purple,
}

export function AlertRow({ unit, plate, message, type, time, urgent = false, onClick }: AlertRowProps) {
  const [hovered, setHovered] = useState(false)

  const accentColor = type ? (TYPE_COLOR[type.toLowerCase()] ?? DS.gold) : DS.gold

  const row: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '80px 80px 1fr auto',
    alignItems: 'center',
    gap: '0 12px',
    height: 44,
    padding: '0 14px 0 12px',
    borderBottom: '1px solid var(--ds-border)',
    borderLeft: urgent ? `2px solid ${DS.red}` : '2px solid transparent',
    background: hovered ? 'var(--ds-bg-2)' : 'transparent',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'background 0.1s',
    fontFamily: FONTS.mono,
  }

  const unitStyle: CSSProperties = {
    fontSize: 11,
    fontFamily: FONTS.display,
    color: 'var(--ds-text)',
    letterSpacing: '0.04em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  const plateStyle: CSSProperties = {
    fontSize: 9,
    color: 'var(--ds-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  const msgStyle: CSSProperties = {
    fontSize: 10,
    color: urgent ? DS.red : 'var(--ds-text)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  const timeStyle: CSSProperties = {
    fontSize: 9,
    color: 'var(--ds-muted)',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  }

  return (
    <div
      style={row}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={unitStyle}>{unit}</div>
      <div style={plateStyle}>{plate}</div>
      <div style={msgStyle}>{message}</div>
      <div style={timeStyle}>{time}</div>
    </div>
  )
}
