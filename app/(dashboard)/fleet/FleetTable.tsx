'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { B } from '@/lib/tokens'
import type { VehicleRow } from '@/lib/supabase/queries/fleet'

const STATUS_COLOR: Record<string, string> = {
  available:   B.green,
  assigned:    B.blue,
  maintenance: B.amber,
  inspection:  B.amber,
  retired:     B.ink3,
}

const STATUS_LABEL: Record<string, string> = {
  available:   'Disponible',
  assigned:    'Asignado',
  maintenance: 'Mantenimiento',
  inspection:  'Inspección',
  retired:     'Retirado',
}

interface Option { value: string; label: string }

interface Props {
  vehicles: VehicleRow[]
  total: number
  page: number
  totalPages: number
  search: string
  status: string
  category: string
  location: string
  sort: string
  dir: 'asc' | 'desc'
  statusOptions: Option[]
  categoryOptions: Option[]
  locationOptions: Option[]
}

export function FleetTable({
  vehicles, total, page, totalPages,
  search, status, category, location, sort, dir,
  statusOptions, categoryOptions, locationOptions,
}: Props) {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()

  const push = useCallback((updates: Record<string, string>) => {
    const sp = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v && v !== 'all') sp.set(k, v)
      else sp.delete(k)
    }
    sp.delete('page')
    router.push(`${pathname}?${sp.toString()}`)
  }, [params, pathname, router])

  const pushPage = useCallback((p: number) => {
    const sp = new URLSearchParams(params.toString())
    sp.set('page', String(p))
    router.push(`${pathname}?${sp.toString()}`)
  }, [params, pathname, router])

  const toggleSort = useCallback((col: string) => {
    const newDir = sort === col && dir === 'asc' ? 'desc' : 'asc'
    const sp = new URLSearchParams(params.toString())
    sp.set('sort', col)
    sp.set('dir', newDir)
    sp.delete('page')
    router.push(`${pathname}?${sp.toString()}`)
  }, [sort, dir, params, pathname, router])

  const SortIcon = ({ col }: { col: string }) => {
    if (sort !== col) return <span style={{ opacity: 0.3 }}>↕</span>
    return <span>{dir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div style={{ background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`, overflow: 'hidden', boxShadow: B.shadowSm }}>
      {/* Filters bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8, padding: '16px 20px',
        borderBottom: `1px solid ${B.hairline}`, background: B.surface,
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <input
            defaultValue={search}
            placeholder="Buscar unidad, placa, marca…"
            onChange={e => {
              const v = e.target.value
              const t = setTimeout(() => push({ q: v }), 350)
              return () => clearTimeout(t)
            }}
            style={{
              fontFamily: 'var(--font-inter)', fontSize: 13,
              padding: '8px 12px 8px 32px', width: '100%',
              background: B.surface2, border: `1px solid ${B.hairline}`,
              borderRadius: 9999, color: B.ink, outline: 'none', boxSizing: 'border-box',
            }}
          />
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={B.ink3} strokeWidth="2"
            style={{ position: 'absolute', left: 12, top: 10 }}>
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
          </svg>
        </div>

        {/* Filter dropdowns */}
        {[
          { value: status,   options: statusOptions,   key: 'status' },
          { value: category, options: categoryOptions,  key: 'category' },
          { value: location, options: locationOptions,  key: 'location' },
        ].map(({ value, options, key }) => (
          <select
            key={key}
            value={value || 'all'}
            onChange={e => push({ [key]: e.target.value })}
            style={{
              fontFamily: 'var(--font-inter)', fontSize: 13,
              padding: '8px 28px 8px 12px', minWidth: 130,
              background: B.surface2, border: `1px solid ${B.hairline}`,
              borderRadius: 9999, color: value && value !== 'all' ? B.ink : B.ink3,
              outline: 'none', cursor: 'pointer',
              appearance: 'none',
            }}
          >
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}

        <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, alignSelf: 'center', marginLeft: 'auto' }}>
          {total.toLocaleString()} vehículos
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: B.surface2 }}>
              {[
                { label: 'Unidad',    col: 'unit_id'  },
                { label: 'Placa',     col: 'plate'    },
                { label: 'Vehículo',  col: 'make'     },
                { label: 'Año',       col: 'year'     },
                { label: 'Km',        col: 'odometer' },
                { label: 'Estado',    col: 'status'   },
                { label: 'Sucursal',  col: null       },
              ].map(({ label, col }) => (
                <th
                  key={label}
                  onClick={() => col && toggleSort(col)}
                  style={{
                    fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600,
                    color: B.ink3, textAlign: 'left', padding: '10px 16px',
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    cursor: col ? 'pointer' : 'default', userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label} {col && <SortIcon col={col} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3 }}>
                  Sin resultados
                </td>
              </tr>
            ) : vehicles.map((v, idx) => (
              <tr
                key={v.id}
                style={{ borderTop: `1px solid ${B.hairline}`, background: idx % 2 === 0 ? B.surface : B.surface }}
                onClick={() => router.push(`/fleet/${v.id}`)}
                className="cursor-pointer hover:bg-[#F0F4FA] transition-colors"
              >
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, fontWeight: 700, color: B.amber }}>{v.unit_id}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: B.ink2 }}>{v.plate}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink }}>{v.make} {v.model}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2 }}>{v.year}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: B.ink2 }}>{v.odometer.toLocaleString()} km</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontFamily: 'var(--font-inter)', fontSize: 11, fontWeight: 600,
                    color: STATUS_COLOR[v.status] ?? B.ink3,
                    background: (STATUS_COLOR[v.status] ?? B.ink3) + '18',
                    padding: '3px 8px', borderRadius: 9999,
                  }}>
                    {STATUS_LABEL[v.status] ?? v.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3 }}>{v.location_name}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderTop: `1px solid ${B.hairline}`,
        }}>
          <button
            onClick={() => pushPage(page - 1)}
            disabled={page <= 1}
            style={{
              fontFamily: 'var(--font-inter)', fontSize: 13, padding: '7px 14px',
              borderRadius: 9999, border: `1px solid ${B.hairline}`,
              background: page <= 1 ? B.surface2 : B.surface,
              color: page <= 1 ? B.ink3 : B.ink, cursor: page <= 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Anterior
          </button>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => pushPage(page + 1)}
            disabled={page >= totalPages}
            style={{
              fontFamily: 'var(--font-inter)', fontSize: 13, padding: '7px 14px',
              borderRadius: 9999, border: `1px solid ${B.hairline}`,
              background: page >= totalPages ? B.surface2 : B.surface,
              color: page >= totalPages ? B.ink3 : B.ink, cursor: page >= totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
