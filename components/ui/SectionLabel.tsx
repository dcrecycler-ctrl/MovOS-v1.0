import { B } from '@/lib/tokens'
import { CSSProperties } from 'react'

interface SectionLabelProps {
  label: string
  count?: number
  color?: string
}

export function SectionLabel({ label, count, color = B.amber }: SectionLabelProps) {
  const wrap: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  }

  const text: CSSProperties = {
    fontSize: 15,
    fontFamily: 'var(--font-inter)',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    color: B.ink,
  }

  const badge: CSSProperties = {
    marginLeft: 'auto',
    fontSize: 11,
    fontFamily: 'var(--font-inter)',
    fontWeight: 600,
    color: color,
    background: color + '18',
    padding: '2px 8px',
    borderRadius: 9999,
  }

  return (
    <div style={wrap}>
      <span style={text}>{label}</span>
      {count !== undefined && <span style={badge}>{count}</span>}
    </div>
  )
}
