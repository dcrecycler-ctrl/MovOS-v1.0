'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { B } from '@/lib/tokens'
import { getVehicleByUnitId } from '@/lib/supabase/queries/operator'

const PENDING = [
  { id: 'p1', type: 'Entrega',    unit: 'U-0142', model: 'Toyota Hilux 2022',  plate: 'SBQ 3812', client: 'Juan Pérez',   time: '09:00', urgent: false },
  { id: 'p2', type: 'Devolución', unit: 'U-0033', model: 'Toyota SW4 2020',    plate: 'SAT 2290', client: 'María García', time: '10:30', urgent: true  },
  { id: 'p3', type: 'Entrega',    unit: 'U-0201', model: 'Toyota RAV4 2023',   plate: 'SBF 9912', client: 'Carlos López', time: '15:30', urgent: false },
]

export default function InspectPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [notFound, setNotFound] = useState(false)

  async function handleSearch() {
    if (!search.trim()) return
    setSearching(true)
    setNotFound(false)
    const vehicle = await getVehicleByUnitId(search.trim().toUpperCase())
    setSearching(false)
    if (vehicle) {
      router.push(`/operator/inspect/new?vehicle=${vehicle.id}&type=pickup`)
    } else {
      setNotFound(true)
    }
  }

  return (
    <div style={{ padding: '12px 20px 16px', fontFamily: 'var(--font-inter)', background: B.bg }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Inspecciones
        </h2>
        <p style={{ fontSize: 13, color: B.ink3, margin: '4px 0 0' }}>
          Seleccioná una tarea o buscá por unidad
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setNotFound(false) }}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="ID de unidad (ej. U-0142)…"
            style={{
              flex: 1, padding: '11px 14px',
              background: B.surface,
              border: `1.5px solid ${notFound ? B.rose : B.hairline}`,
              borderRadius: 12,
              fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink,
              outline: 'none', boxShadow: B.shadowSm,
            }}
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            style={{
              padding: '11px 18px', borderRadius: 12,
              background: B.ink, border: 'none', color: '#fff',
              fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', opacity: searching ? 0.6 : 1,
              boxShadow: B.shadowSm,
            }}
          >
            {searching ? '…' : 'Buscar'}
          </button>
        </div>
        {notFound && (
          <p style={{ fontSize: 12, color: B.rose, margin: '6px 0 0' }}>Unidad no encontrada</p>
        )}
      </div>

      {/* QR shortcut */}
      <button
        onClick={() => router.push('/operator/scan?redirect=inspect')}
        style={{
          width: '100%', padding: '12px', borderRadius: 12, marginBottom: 24,
          background: B.surface, border: `1px solid ${B.hairline}`,
          color: B.ink2, fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: B.shadowSm,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 11h18M9 4h6"/>
        </svg>
        Escanear código QR del vehículo
      </button>

      {/* Pending */}
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: B.ink2 }}>
          Inspecciones asignadas
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PENDING.map(p => {
          const isEntrega = p.type === 'Entrega'
          return (
            <div
              key={p.id}
              onClick={() => router.push(`/operator/inspect/new?type=${isEntrega ? 'pickup' : 'return'}&unit=${p.unit}`)}
              style={{
                background: B.surface, borderRadius: 14,
                boxShadow: B.shadowSm, cursor: 'pointer',
                borderLeft: p.urgent ? `3px solid ${B.rose}` : undefined,
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: isEntrega ? B.blue : B.amber,
                  background: isEntrega ? B.blueSoft : B.amberSoft,
                  padding: '3px 10px', borderRadius: 9999,
                }}>
                  Inspección {p.type}
                </span>
                <span style={{ fontSize: 11, color: B.ink3 }}>{p.time}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: B.ink, marginBottom: 4 }}>{p.model}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: B.blue, fontWeight: 500 }}>{p.unit}</span>
                <span style={{ color: B.ink4, fontSize: 11 }}>·</span>
                <span style={{ fontSize: 11, color: B.ink3 }}>{p.plate}</span>
                <span style={{ color: B.ink4, fontSize: 11 }}>·</span>
                <span style={{ fontSize: 11, color: B.ink3 }}>{p.client}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
