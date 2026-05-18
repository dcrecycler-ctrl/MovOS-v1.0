'use client'
import { FONTS } from '@/lib/tokens'
import { CSSProperties, MouseEvent, useState } from 'react'

interface ActionButtonProps {
  label: string
  color?: string
  full?: boolean
  secondary?: boolean
  danger?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

export function ActionButton({
  label,
  color = 'var(--ds-gold)',
  full = false,
  secondary = false,
  danger = false,
  onClick,
}: ActionButtonProps) {
  const [hovered, setHovered] = useState(false)

  const resolvedColor = danger ? 'var(--ds-red)' : secondary ? 'var(--ds-dim)' : color

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: full ? '100%' : undefined,
    padding: '0 16px',
    height: 32,
    fontSize: 10,
    fontFamily: FONTS.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: resolvedColor,
    background: hovered ? `${resolvedColor}54` : `${resolvedColor}38`,
    border: `1px solid ${resolvedColor}`,
    borderRadius: 0,
    cursor: 'pointer',
    transition: 'background 0.12s',
    outline: 'none',
  }

  return (
    <button
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  )
}
