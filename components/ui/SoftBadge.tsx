import { ReactNode } from 'react'
import { Tone, TONE_COLORS } from '@/lib/tokens'

interface SoftBadgeProps {
  tone?: Tone
  children: ReactNode
  size?: number
}

export function SoftBadge({ tone = 'neutral', children, size = 11 }: SoftBadgeProps) {
  const [fg, bg] = TONE_COLORS[tone] ?? TONE_COLORS.neutral
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: size, fontWeight: 500, color: fg, background: bg,
      padding: '4px 10px', borderRadius: 9999, lineHeight: 1.3, letterSpacing: '-0.005em',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}
