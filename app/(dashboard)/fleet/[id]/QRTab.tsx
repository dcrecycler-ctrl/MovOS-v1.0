'use client'

import { useRef } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { ActionButton } from '@/components/ui/ActionButton'

// ─── QR grid generator ────────────────────────────────────────────────────────
// Generates a deterministic 25×25 QR-like pattern for display purposes.
// Not a valid QR code — do not scan.

function generateQRGrid(seed: string): boolean[][] {
  const SIZE = 25
  const g: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false))

  // Finder pattern: 7×7 outer border + 5×5 inner void + 3×3 solid center
  function finder(r0: number, c0: number) {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const onBorder = r === 0 || r === 6 || c === 0 || c === 6
      const inCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4
      g[r0 + r][c0 + c] = onBorder || inCenter
    }
  }

  finder(0, 0)            // top-left
  finder(0, SIZE - 7)     // top-right
  finder(SIZE - 7, 0)     // bottom-left

  // Timing patterns — alternating on row 6 and col 6
  for (let i = 8; i < SIZE - 8; i++) {
    g[6][i] = i % 2 === 0
    g[i][6] = i % 2 === 0
  }

  // Format info dots (dark module at top-right alignment)
  g[8][SIZE - 8] = true

  // Seeded pseudo-random fill for data area
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = (h * 0x01000193) >>> 0
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const inFinder  = (r < 8 && c < 8) || (r < 8 && c >= SIZE - 8) || (r >= SIZE - 8 && c < 8)
      const inTiming  = r === 6 || c === 6
      const inFormat  = (r === 8 && c <= 8) || (c === 8 && r <= 8)
      if (inFinder || inTiming || inFormat) continue
      h ^= (r * 31 + c * 17 + 0xa3f1b2c9)
      h = (h * 0x01000193) >>> 0
      g[r][c] = (h & 0x80000000) !== 0
    }
  }

  return g
}

// ─── Canvas download ──────────────────────────────────────────────────────────

function downloadQRPng(grid: boolean[][], unitId: string) {
  const CELL = 10
  const MARGIN = 32
  const SIZE = grid.length
  const dim = SIZE * CELL + MARGIN * 2

  const canvas = document.createElement('canvas')
  canvas.width  = dim
  canvas.height = dim
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, dim, dim)

  ctx.fillStyle = '#000000'
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c]) {
        ctx.fillRect(MARGIN + c * CELL, MARGIN + r * CELL, CELL, CELL)
      }
    }
  }

  const a = document.createElement('a')
  a.download = `${unitId}-qr.png`
  a.href = canvas.toDataURL('image/png')
  a.click()
}

// ─── QRTab ────────────────────────────────────────────────────────────────────

const USE_CASES = [
  { code: '01', label: 'Lot Inspection',    desc: 'Scan to begin a periodic lot check — no login required' },
  { code: '02', label: 'Damage Report',     desc: 'Client or operator starts a damage form on the spot' },
  { code: '03', label: 'Quick Status',      desc: 'View current status, location, and active reservation' },
  { code: '04', label: 'Maintenance Handoff', desc: 'Workshop accepts vehicle — triggers maintenance stage update' },
  { code: '05', label: 'Check-In / Check-Out', desc: 'Rental pickup or return — pre-fills inspection form' },
  { code: '06', label: 'Fleet Audit',       desc: 'Auditor verifies vehicle presence and condition in batch mode' },
]

export function QRTab({ unitId, plate, model }: { unitId: string; plate: string; model: string }) {
  const qrUrl = `https://movos.app/v/${unitId}`
  const grid  = generateQRGrid(unitId)
  const CELL  = 8
  const SIZE  = grid.length
  const svgSize = SIZE * CELL

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>

      {/* Left — QR display */}
      <div>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
          Vehicle QR Code
        </div>

        <div style={{
          display: 'inline-block',
          padding: 24,
          background: '#FFFFFF',
          border: `1px solid var(--ds-border)`,
          marginBottom: 16,
        }}>
          <svg
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            shapeRendering="crispEdges"
          >
            {grid.map((row, r) =>
              row.map((on, c) => on ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * CELL}
                  y={r * CELL}
                  width={CELL}
                  height={CELL}
                  fill="#000000"
                />
              ) : null)
            )}
          </svg>
        </div>

        {/* Unit info below QR */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontFamily: FONTS.display, color: DS.gold, letterSpacing: '0.06em', lineHeight: 1, marginBottom: 4 }}>
            {unitId}
          </div>
          <div style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)', letterSpacing: '0.06em' }}>
            {model} · {plate}
          </div>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', marginTop: 4, wordBreak: 'break-all' }}>
            {qrUrl}
          </div>
        </div>

        {/* Download buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <ActionButton label="Download PNG" color={DS.gold}   onClick={() => downloadQRPng(grid, unitId)} />
          <ActionButton label="Download PDF" color={DS.gold}   secondary onClick={() => alert('PDF export — coming soon')} />
          <ActionButton label="Print Label"  color={DS.purple} secondary onClick={() => window.print()} />
        </div>

        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.04em', lineHeight: 1.6 }}>
          For display use only — place inside windshield or on key tag.<br />
          QR links to the vehicle profile on scan.
        </div>
      </div>

      {/* Right — Use cases */}
      <div>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
          Scan Use Cases
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--ds-border)' }}>
          {USE_CASES.map(uc => (
            <div key={uc.code} style={{
              display: 'grid', gridTemplateColumns: '36px 160px 1fr',
              alignItems: 'center',
              background: 'var(--ds-bg-1)',
              padding: '12px 14px',
              gap: 14,
            }}>
              <div style={{ fontSize: 18, fontFamily: FONTS.display, color: 'var(--ds-border-2)', lineHeight: 1 }}>
                {uc.code}
              </div>
              <div style={{ fontSize: 10, fontFamily: FONTS.mono, color: DS.gold, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {uc.label}
              </div>
              <div style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)', lineHeight: 1.5 }}>
                {uc.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
