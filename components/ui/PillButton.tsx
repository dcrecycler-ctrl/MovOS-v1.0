'use client'

import { useState, ReactNode } from 'react'
import { B } from '@/lib/tokens'

type PillTone = 'primary' | 'ghost' | 'danger'

interface PillButtonProps {
  tone?: PillTone
  size?: 'sm' | 'md'
  children: ReactNode
  onClick?: () => void
}

export function PillButton({ tone = 'ghost', size = 'md', children, onClick }: PillButtonProps) {
  const [hovered, setHovered] = useState(false)
  const padding = size === 'sm' ? '7px 14px' : '10px 18px'
  const fontSize = size === 'sm' ? 12 : 13

  let bg: string, fg: string, border: string
  if (tone === 'primary') {
    bg = hovered ? '#0E1726' : '#1A2538'; fg = '#FFFFFF'; border = 'transparent'
  } else if (tone === 'danger') {
    bg = hovered ? B.roseSoft : B.surface; fg = B.rose; border = hovered ? B.rose + '55' : B.hairline
  } else {
    bg = hovered ? B.surface : 'transparent'; fg = B.ink2; border = B.hairline
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize, fontWeight: 500, letterSpacing: '-0.005em',
        color: fg, background: bg, border: `1px solid ${border}`, padding,
        borderRadius: 9999, cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
      }}
    >
      {children}
    </button>
  )
}
