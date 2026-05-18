'use client'
import { DS, FONTS } from '@/lib/tokens'
import { CSSProperties, ReactNode, useState } from 'react'

interface FilterChip {
  label: string
  value: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  filters?: FilterChip[]
  activeFilter?: string
  onFilterChange?: (value: string) => void
}

export function PageHeader({
  title,
  subtitle,
  actions,
  filters,
  activeFilter,
  onFilterChange,
}: PageHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
      paddingBottom: 16,
      borderBottom: '1px solid var(--ds-border)',
      marginBottom: 20,
      flexWrap: 'wrap',
    }}>
      <div>
        <h1 style={{
          fontSize: 30,
          fontFamily: FONTS.display,
          color: 'var(--ds-text)',
          letterSpacing: '0.04em',
          lineHeight: 1,
          margin: 0,
        }}>
          {title}
        </h1>
        {subtitle && (
          <div style={{
            fontSize: 10,
            fontFamily: FONTS.mono,
            color: 'var(--ds-dim)',
            marginTop: 6,
            letterSpacing: '0.06em',
          }}>
            {subtitle}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {filters && filters.map(f => (
          <FilterChipButton
            key={f.value}
            label={f.label}
            active={activeFilter === f.value}
            onClick={() => onFilterChange?.(f.value)}
          />
        ))}
        {actions}
      </div>
    </div>
  )
}

function FilterChipButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    height: 26,
    padding: '0 10px',
    fontSize: 9,
    fontFamily: FONTS.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: active ? DS.gold : 'var(--ds-dim)',
    background: active ? `${DS.gold}1C` : hovered ? 'var(--ds-bg-2)' : 'transparent',
    border: `1px solid ${active ? DS.gold : 'var(--ds-border)'}`,
    borderRadius: 0,
    cursor: 'pointer',
    transition: 'all 0.12s',
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
