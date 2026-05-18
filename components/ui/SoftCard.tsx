'use client'

import { useState, CSSProperties, ReactNode } from 'react'
import { B } from '@/lib/tokens'

interface SoftCardProps {
  children: ReactNode
  padding?: number
  big?: boolean
  tint?: string
  onClick?: () => void
  style?: CSSProperties
  className?: string
}

export function SoftCard({ children, padding = 24, big = false, tint, onClick, style = {} }: SoftCardProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tint ?? B.surface,
        borderRadius: big ? B.radiusLg : B.radius,
        padding,
        boxShadow: hovered && onClick ? B.shadowMd : B.shadowSm,
        transform: hovered && onClick ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
