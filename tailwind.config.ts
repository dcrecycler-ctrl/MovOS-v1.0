import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Fonts ────────────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-bebas-neue)', 'Impact', 'sans-serif'],
        mono:    ['var(--font-dm-mono)', 'Courier New', 'monospace'],
        sans:    ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      // ─── Colors ──────────────────────────────────────────────────
      colors: {
        // Variant C · Bento — primary production theme
        bg:       'var(--bg)',
        surface:  'var(--surface)',
        surface2: 'var(--surface-2)',
        surface3: 'var(--surface-3)',
        ink:      'var(--ink)',
        ink2:     'var(--ink-2)',
        ink3:     'var(--ink-3)',
        ink4:     'var(--ink-4)',
        hairline: 'var(--hairline)',
        accent: {
          blue:        'var(--blue)',
          'blue-soft': 'var(--blue-soft)',
          green:        'var(--green)',
          'green-soft': 'var(--green-soft)',
          amber:        'var(--amber)',
          'amber-soft': 'var(--amber-soft)',
          rose:         'var(--rose)',
          'rose-soft':  'var(--rose-soft)',
          lilac:        'var(--lilac)',
          'lilac-soft': 'var(--lilac-soft)',
          sky:          'var(--sky)',
          'sky-soft':   'var(--sky-soft)',
          ochre:        'var(--ochre)',
          'ochre-soft': 'var(--ochre-soft)',
        },

        // Dark Spec — reference palette for future dark screens
        ds: {
          bg:      '#080808',
          bg1:     '#0D0D0D',
          bg2:     '#111111',
          bg3:     '#161616',
          border:  '#1C1C1C',
          border2: '#242424',
          text:    '#E2D9C8',
          dim:     '#3A3A3A',
          muted:   '#555555',
          gold:    '#C8A96E',
          blue:    '#7EB8C9',
          purple:  '#9B7EC8',
          green:   '#6DBF8E',
          red:     '#C97E7E',
          orange:  '#C9956E',
          yellow:  '#C9B87E',
          lime:    '#A8C96E',
          slate:   '#7E9BC9',
        },

        // Light Spec — reference palette (cool blue-white variant)
        dl: {
          bg:      '#EEF2F7',
          bg1:     '#FFFFFF',
          bg2:     '#E8EEF5',
          border:  '#D5DCE5',
          text:    '#0E1726',
          muted:   '#64748B',
          gold:    '#8F6B2A',
          blue:    '#3D6C7C',
          green:   '#2E7548',
          red:     '#9E3636',
        },
      },

      // ─── Shadows ─────────────────────────────────────────────────
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },

      // ─── Border radius ───────────────────────────────────────────
      borderRadius: {
        card:    'var(--radius)',
        'card-sm': 'var(--radius-sm)',
        'card-lg': 'var(--radius-lg)',
      },

      // ─── Spacing scale (4px base unit) ───────────────────────────
      spacing: {
        'card-gap':    '14px',
        'section-gap': '28px',
        'card-sm':     '16px',
        'card-md':     '22px',
        'card-lg':     '26px',
        'row':         '44px',
        'nav':         '52px',
      },
    },
  },
  plugins: [],
}

export default config
