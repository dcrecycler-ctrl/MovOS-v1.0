import { DS, FONTS } from '@/lib/tokens'
import { CSSProperties } from 'react'

interface SectionLabelProps {
  label: string
  count?: number
  color?: string
}

export function SectionLabel({ label, count, color = DS.gold }: SectionLabelProps) {
  const wrap: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 10,
    borderLeft: `3px solid ${color}`,
  }

  const text: CSSProperties = {
    fontSize: 9,
    fontFamily: FONTS.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--ds-dim)',
  }

  const badge: CSSProperties = {
    marginLeft: 'auto',
    fontSize: 9,
    fontFamily: FONTS.mono,
    letterSpacing: '0.06em',
    color: color,
    background: `${color}1C`,
    border: `1px solid ${color}54`,
    padding: '1px 6px',
    borderRadius: 0,
  }

  return (
    <div style={wrap}>
      <span style={text}>{label}</span>
      {count !== undefined && <span style={badge}>{count}</span>}
    </div>
  )
}
