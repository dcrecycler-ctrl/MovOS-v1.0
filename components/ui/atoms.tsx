import { B, Tone } from '@/lib/tokens'

// ─── Dot ────────────────────────────────────────────────────────
const DOT_COLORS: Record<string, string> = {
  blue: B.blue, green: B.green, amber: B.amber, rose: B.rose,
  lilac: B.lilac, sky: B.sky, ochre: B.ochre, neutral: B.ink3,
}

export function Dot({ tone = 'blue', size = 6 }: { tone?: string; size?: number }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: 9999,
      background: DOT_COLORS[tone] ?? B.blue,
      display: 'inline-block', flexShrink: 0,
    }} />
  )
}

// ─── Ring ────────────────────────────────────────────────────────
export function Ring({
  value, size = 64, stroke = 6, color = B.blue, label,
}: {
  value: number; size?: number; stroke?: number; color?: string; label?: string
}) {
  const r = (size - stroke) / 2
  const C = 2 * Math.PI * r
  const off = C * (1 - value / 100)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={B.hairline} strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      {label && (
        <text x={size / 2} y={size / 2 + 5} textAnchor="middle"
          fontFamily="var(--font-inter), sans-serif"
          fontSize={size >= 64 ? 16 : 13} fontWeight="600" fill={B.ink}>
          {label}
        </text>
      )}
    </svg>
  )
}

// ─── Sparkline ────────────────────────────────────────────────────
export function Sparkline({ values, color, height = 44 }: { values: number[]; color: string; height?: number }) {
  const w = 120, h = height
  const max = Math.max(...values), min = Math.min(...values)
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3
    return [x, y]
  })
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const fillD = d + ` L ${w} ${h} L 0 ${h} Z`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <path d={fillD} fill={color} opacity="0.12" />
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={color} />
    </svg>
  )
}

// ─── SourceIcon ────────────────────────────────────────────────────
export function SourceIcon({ source, size = 18 }: { source: 'CARCHECK' | 'MANUAL'; size?: number }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  if (source === 'MANUAL') {
    return (
      <svg {...props}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M6 10h12" />
      <path d="M10 18h4" />
    </svg>
  )
}
