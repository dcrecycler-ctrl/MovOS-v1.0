'use client'
import { B } from '@/lib/tokens'
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
  color = B.amber,
  full = false,
  secondary = false,
  danger = false,
  onClick,
}: ActionButtonProps) {
  const [hovered, setHovered] = useState(false)

  const resolvedColor = danger ? B.rose : secondary ? B.ink3 : color

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: full ? '100%' : undefined,
    padding: '0 16px',
    height: 32,
    fontSize: 12,
    fontFamily: 'var(--font-inter)',
    fontWeight: 500,
    letterSpacing: '0.01em',
    color: resolvedColor,
    background: hovered ? resolvedColor + '28' : resolvedColor + '14',
    border: `1px solid ${resolvedColor}40`,
    borderRadius: 8,
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
