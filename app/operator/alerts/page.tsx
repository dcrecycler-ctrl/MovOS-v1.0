'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { B } from '@/lib/tokens'
import { getVehicleByUnitId, getVehicleById, createOperatorAlert, type OperatorVehicle } from '@/lib/supabase/queries/operator'

type AlertLevel = 'info' | 'warning' | 'critical'

const LEVEL_CONFIG: Record<AlertLevel, { label: string; color: string; soft: string; desc: string }> = {
  info:     { label: 'Informacional', color: B.blue,  soft: B.blueSoft,  desc: 'Nota para el equipo, sin urgencia' },
  warning:  { label: 'Advertencia',   color: B.amber, soft: B.amberSoft, desc: 'Requiere atención próxima'         },
  critical: { label: 'Crítico',       color: B.rose,  soft: B.roseSoft,  desc: 'Acción inmediata requerida'        },
}

function AlertsPageInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [vehicle,    setVehicle]   = useState<OperatorVehicle | null>(null)
  const [unitSearch, setUnitSearch] = useState('')
  const [level,      setLevel]     = useState<AlertLevel>('warning')
  const [message,    setMessage]   = useState('')
  const [photo,      setPhoto]     = useState<File | null>(null)
  const [sent,       setSent]      = useState(false)
  const [loading,    setLoading]   = useState(false)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const vehicleParam = searchParams.get('vehicle')
      const unitParam    = searchParams.get('unit')
      if (vehicleParam) {
        const v = await getVehicleById(vehicleParam)
        if (v) setVehicle(v)
      } else if (unitParam) {
        const v = await getVehicleByUnitId(unitParam)
        if (v) setVehicle(v)
      }
    }
    init()
  }, [])

  async function handleSearch() {
    if (!unitSearch.trim()) return
    const v = await getVehicleByUnitId(unitSearch.trim().toUpperCase())
    setVehicle(v)
  }

  async function handleSend() {
    if (!message.trim() || !vehicle) return
    setLoading(true)
    await createOperatorAlert({ vehicleId: vehicle.id, level, message: message.trim(), source: 'operator_app' })
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    const cfg = LEVEL_CONFIG[level]
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '70vh', padding: 32,
        textAlign: 'center', background: B.bg, fontFamily: 'var(--font-inter)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, marginBottom: 20,
          background: cfg.soft, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="1.7" strokeLinecap="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, color: B.ink, letterSpacing: '-0.02em' }}>Alerta enviada</div>
        <div style={{ fontSize: 13, color: B.ink3, marginTop: 8 }}>
          {vehicle?.unit_id} · {vehicle?.plate}
        </div>
        <span style={{
          display: 'inline-block', marginTop: 12,
          fontSize: 11, fontWeight: 600, color: cfg.color,
          background: cfg.soft, padding: '4px 14px', borderRadius: 9999,
          border: `1px solid ${cfg.color}44`,
        }}>
          {cfg.label}
        </span>
        <button
          onClick={() => router.push('/operator/tasks')}
          style={{
            marginTop: 28, padding: '12px 28px', borderRadius: 12,
            background: B.surface, border: `1px solid ${B.hairline}`,
            color: B.ink2, cursor: 'pointer',
            fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500,
            boxShadow: B.shadowSm,
          }}
        >
          ← Volver a tareas
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '12px 20px 20px', background: B.bg, fontFamily: 'var(--font-inter)' }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: B.ink3, cursor: 'pointer', padding: 0, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Volver
        </button>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>
          Crear Alerta
        </h2>
      </div>

      {/* Vehicle selector */}
      {!vehicle && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Vehículo
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              value={unitSearch}
              onChange={e => setUnitSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="ID de unidad (ej. U-0142)…"
              style={{
                flex: 1, padding: '11px 14px',
                background: B.surface, border: `1.5px solid ${B.hairline}`, borderRadius: 12,
                fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink,
                outline: 'none', boxShadow: B.shadowSm,
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: '11px 18px', borderRadius: 12,
                background: B.ink, border: 'none', color: '#fff',
                fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Buscar
            </button>
          </div>
          <button
            onClick={() => router.push('/operator/scan?redirect=alerts')}
            style={{
              width: '100%', padding: '12px', borderRadius: 12,
              background: B.surface, border: `1px solid ${B.hairline}`,
              color: B.ink2, fontFamily: 'var(--font-inter)', fontSize: 13,
              fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: B.shadowSm,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 11h18M9 4h6"/>
            </svg>
            Escanear QR
          </button>
        </div>
      )}

      {vehicle && (
        <div style={{
          background: B.surface, border: `1px solid ${B.hairline}`,
          borderRadius: 14, padding: '14px 16px', marginBottom: 20,
          boxShadow: B.shadowSm,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: B.ink, letterSpacing: '-0.01em' }}>
                {vehicle.make} {vehicle.model}
              </div>
              <div style={{ fontSize: 12, color: B.ink3, marginTop: 3 }}>{vehicle.unit_id} · {vehicle.plate}</div>
            </div>
            <button onClick={() => setVehicle(null)} style={{ background: 'none', border: 'none', color: B.ink3, cursor: 'pointer', fontSize: 18, padding: 4 }}>✕</button>
          </div>
        </div>
      )}

      {/* Alert level */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Nivel de alerta
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(Object.entries(LEVEL_CONFIG) as [AlertLevel, typeof LEVEL_CONFIG[AlertLevel]][]).map(([l, cfg]) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '13px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                background: level === l ? cfg.soft : B.surface,
                border: `1.5px solid ${level === l ? cfg.color : B.hairline}`,
                boxShadow: B.shadowSm, fontFamily: 'var(--font-inter)',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: level === l ? 600 : 400, color: level === l ? cfg.color : B.ink2 }}>
                  {cfg.label}
                </div>
                <div style={{ fontSize: 11, color: B.ink3, marginTop: 2 }}>{cfg.desc}</div>
              </div>
              {level === l && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round">
                  <path d="m5 12 5 5L20 7"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Mensaje *
        </div>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Describí el problema o la situación…"
          rows={4}
          style={{
            width: '100%', boxSizing: 'border-box', padding: '12px 14px',
            background: B.surface, border: `1.5px solid ${B.hairline}`, borderRadius: 12,
            fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink,
            resize: 'none', outline: 'none', lineHeight: 1.5, boxShadow: B.shadowSm,
          }}
        />
      </div>

      {/* Photo */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Adjuntar foto (opcional)
        </div>
        <label style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '13px', borderRadius: 12, cursor: 'pointer',
          background: photo ? B.greenSoft : B.surface,
          border: `1.5px dashed ${photo ? B.green : B.ink4}`,
          boxShadow: B.shadowSm,
        }}>
          <input
            type="file" accept="image/*" capture="environment"
            style={{ display: 'none' }}
            onChange={e => setPhoto(e.target.files?.[0] ?? null)}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={photo ? B.green : B.ink3} strokeWidth="1.7" strokeLinecap="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: photo ? B.green : B.ink2, fontWeight: photo ? 600 : 400 }}>
            {photo ? photo.name : 'Tomar foto'}
          </span>
        </label>
      </div>

      <button
        onClick={handleSend}
        disabled={!message.trim() || !vehicle || loading}
        style={{
          width: '100%', padding: '15px', borderRadius: 12,
          background: message.trim() && vehicle ? B.ink : B.surface2,
          border: 'none',
          color: message.trim() && vehicle ? '#fff' : B.ink3,
          fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 600,
          cursor: message.trim() && vehicle ? 'pointer' : 'not-allowed',
          opacity: loading ? 0.7 : 1, letterSpacing: '-0.01em',
        }}
      >
        {loading ? 'Enviando…' : 'Enviar alerta'}
      </button>
    </div>
  )
}

export default function AlertsPage() {
  return <Suspense><AlertsPageInner /></Suspense>
}
