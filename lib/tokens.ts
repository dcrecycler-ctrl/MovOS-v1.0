// ─── Variant C · Bento (production) ─────────────────────────────────
// Primary theme. All existing pages use this.
export const B = {
  bg:        '#F2F6FA',
  surface:   '#FFFFFF',
  surface2:  '#F0F4FA',
  surface3:  '#EAF0F6',
  ink:       '#0E1726',
  ink2:      '#475569',
  ink3:      '#94A3B8',
  ink4:      '#CBD5E1',
  hairline:  'rgba(14,23,38,0.05)',
  blue:      '#6F8AC9',
  blueSoft:  '#E7ECF6',
  green:     '#7AAA88',
  greenSoft: '#E5EFE7',
  amber:     '#D0A364',
  amberSoft: '#F4EBD7',
  rose:      '#C68585',
  roseSoft:  '#F2E2E0',
  lilac:     '#9C8EC0',
  lilacSoft: '#ECE8F2',
  sky:       '#85A7BD',
  skySoft:   '#E3ECF1',
  ochre:     '#8FA0B8',   // cool slate (no warm ochre)
  ochreSoft: '#E9EDF2',
  shadowSm:  '0 1px 2px rgba(14,23,38,0.04)',
  shadowMd:  '0 1px 2px rgba(14,23,38,0.04), 0 8px 24px rgba(14,23,38,0.05)',
  shadowLg:  '0 1px 2px rgba(14,23,38,0.04), 0 24px 56px rgba(14,23,38,0.07)',
  radius:    18,
  radiusSm:  12,
  radiusLg:  24,
} as const

// ─── Dark Spec · reference (future dark screens) ─────────────────────
// Original MovOS design system. Hard rules: 0px radius, no shadows,
// no gradients, outlined buttons only, top-border accents on all cards.
export const DS = {
  bg:      '#080808',
  bg1:     '#0D0D0D',
  bg2:     '#111111',
  bg3:     '#161616',
  border:  '#1C1C1C',
  border2: '#242424',
  text:    '#E2D9C8',
  textDim: '#AAAAAA',
  muted:   '#555555',
  dim:     '#3A3A3A',
  gold:    '#C8A96E',
  blue:    '#7EB8C9',
  purple:  '#9B7EC8',
  green:   '#6DBF8E',
  red:     '#C97E7E',
  orange:  '#C9956E',
  yellow:  '#C9B87E',
  lime:    '#A8C96E',
  slate:   '#7E9BC9',
} as const

// ─── Light Spec · reference (cool blue-white surfaces) ───────────────
// Same design rules as dark spec, surfaces inverted to cool blue-white.
// Accents darkened to OKLCH ~0.45 for cream-bg contrast.
export const DL = {
  bg:      '#EEF2F7',
  bg1:     '#FFFFFF',
  bg2:     '#E8EEF5',
  bg3:     '#DEE5EE',
  border:  '#D5DCE5',
  border2: '#B5BFCE',
  text:    '#0E1726',
  textDim: '#475569',
  muted:   '#64748B',
  dim:     '#94A3B8',
  gold:    '#8F6B2A',
  blue:    '#3D6C7C',
  purple:  '#5F417F',
  green:   '#2E7548',
  red:     '#9E3636',
  orange:  '#8E5524',
  yellow:  '#7A671E',
  lime:    '#5D7A1E',
  slate:   '#3D5680',
} as const

// ─── Spacing (4px base unit) ─────────────────────────────────────────
export const SPACING = {
  unit:       4,   // base unit — all values must be multiples of 4
  cardGap:   14,   // gap between bento cards
  sectionGap: 28,  // gap between content sections
  cardSm:    16,   // card inner padding — small
  cardMd:    22,   // card inner padding — medium
  cardLg:    26,   // card inner padding — large
  rowHeight: 44,   // table / list row height
  navHeight: 52,   // top nav bar height
} as const

// ─── Font names ──────────────────────────────────────────────────────
export const FONTS = {
  display: 'var(--font-bebas-neue)',   // Bebas Neue — KPI values, headings, unit IDs
  mono:    'var(--font-dm-mono)',      // DM Mono — body, labels, badges, timestamps
  sans:    'var(--font-inter)',        // Inter — bento variant body & UI
} as const

// ─── Tone system (Variant C) ─────────────────────────────────────────
export type Tone = 'blue' | 'green' | 'amber' | 'rose' | 'lilac' | 'sky' | 'ochre' | 'neutral'

export const TONE_COLORS: Record<Tone, [fg: string, bg: string]> = {
  blue:    [B.blue,  B.blueSoft],
  green:   [B.green, B.greenSoft],
  amber:   [B.amber, B.amberSoft],
  rose:    [B.rose,  B.roseSoft],
  lilac:   [B.lilac, B.lilacSoft],
  sky:     [B.sky,   B.skySoft],
  ochre:   [B.ochre, B.ochreSoft],
  neutral: [B.ink2,  '#F0EDE5'],
}

// Maps prototype `color` string → Tone
export const TONE_MAP: Record<string, Tone> = {
  red:    'rose',
  orange: 'amber',
  yellow: 'amber',
  green:  'green',
  blue:   'blue',
  purple: 'lilac',
  gold:   'amber',
}

// Maps FLEET statusColor → Tone
export const STATUS_TONE: Record<string, Tone> = {
  green:  'green',
  red:    'rose',
  blue:   'blue',
  gold:   'amber',
  yellow: 'amber',
  purple: 'lilac',
}
