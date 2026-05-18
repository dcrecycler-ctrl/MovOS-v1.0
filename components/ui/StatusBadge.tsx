import { FONTS } from '@/lib/tokens'
import { CSSProperties } from 'react'

interface StatusBadgeProps {
  label: string
  color?: string
  small?: boolean
}

export function StatusBadge({ label, color = 'var(--ds-dim)', small = false }: StatusBadgeProps) {
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: small ? '2px 6px' : '3px 8px',
    fontSize: small ? 9 : 10,
    fontFamily: FONTS.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color,
    border: `1px solid ${color}54`,
    background: `${color}1C`,
    borderRadius: 0,
    whiteSpace: 'nowrap',
  }

  return <span style={style}>{label}</span>
}
