'use client'
import { DS, FONTS } from '@/lib/tokens'
import { CSSProperties, useState } from 'react'

export interface Column<T> {
  key: keyof T
  header: string
  width?: string | number
  align?: 'left' | 'right' | 'center'
  render?: (value: T[keyof T], row: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  rows: T[]
  onRowClick?: (row: T) => void
  alertKey?: keyof T
}

type SortDir = 'asc' | 'desc' | null

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  onRowClick,
  alertKey,
}: DataTableProps<T>) {
  const [sortCol, setSortCol] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  function handleSort(col: Column<T>) {
    if (!col.sortable) return
    if (sortCol === col.key) {
      setSortDir(d => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'))
      if (sortDir === 'desc') setSortCol(null)
    } else {
      setSortCol(col.key)
      setSortDir('asc')
    }
  }

  const sorted = [...rows].sort((a, b) => {
    if (!sortCol || !sortDir) return 0
    const av = a[sortCol]
    const bv = b[sortCol]
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  const thStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    background: 'var(--ds-bg)',
    padding: '0 12px',
    height: 32,
    fontSize: 8,
    fontFamily: FONTS.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--ds-muted)',
    borderBottom: '1px solid var(--ds-border)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  }

  return (
    <div style={{ overflowX: 'auto', fontFamily: FONTS.mono }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                style={{
                  ...thStyle,
                  textAlign: col.align ?? 'left',
                  width: col.width,
                  cursor: col.sortable ? 'pointer' : 'default',
                }}
                onClick={() => handleSort(col)}
              >
                {col.header}
                {col.sortable && (
                  <span style={{ marginLeft: 4, color: sortCol === col.key ? DS.gold : 'var(--ds-faint)' }}>
                    {sortCol === col.key && sortDir === 'asc' ? '▲' : sortCol === col.key && sortDir === 'desc' ? '▼' : '▲▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const isAlert = alertKey ? Boolean(row[alertKey]) : false
            const isHovered = hoveredRow === i
            return (
              <tr
                key={i}
                style={{
                  height: 44,
                  background: isHovered ? 'var(--ds-bg-2)' : 'transparent',
                  borderBottom: '1px solid var(--ds-border)',
                  cursor: onRowClick ? 'pointer' : 'default',
                  borderLeft: isAlert ? `2px solid ${DS.red}` : '2px solid transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td
                    key={String(col.key)}
                    style={{
                      padding: '0 12px',
                      fontSize: 11,
                      color: 'var(--ds-text)',
                      textAlign: col.align ?? 'left',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
