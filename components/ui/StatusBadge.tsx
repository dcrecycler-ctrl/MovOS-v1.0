import { B } from '@/lib/tokens'
import { CSSProperties } from 'react'

interface StatusBadgeProps {
  label: string
  color?: string
  small?: boolean
}

export function StatusBadge({ label, color = B.ink3, small = false }: StatusBadgeProps) {
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: small ? '2px 7px' : '3px 9px',
    fontSize: small ? 10 : 11,
    fontFamily: 'var(--font-inter)',
    fontWeight: 600,
    letterSpacing: '0.02em',
    color,
    background: color + '18',
    borderRadius: 9999,
    whiteSpace: 'nowrap',
  }

  return <span style={style}>{label}</span>
}
