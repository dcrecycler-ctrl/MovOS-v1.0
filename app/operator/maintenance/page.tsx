'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { B } from '@/lib/tokens'
import { getVehicleByUnitId, getVehicleById, moveToMaintenance, type OperatorVehicle } from '@/lib/supabase/queries/operator'

const STAGES = [
  'Traslado a taller',
  'En diagnóstico',
  'Esperando repuestos',
  'En reparación',
  'Control de calidad',
  'Listo para retirar',
  'Retornado a flota',
]

export default function MaintenancePage() {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const [vehicle,     setVehicle]    = useState<OperatorVehicle | null>(null)
  const [unitSearch,  setUnitSearch] = useState('')
  const [stage,       setStage]      = useState('')
  const [notes,       setNotes]      = useState('')
  const [confirmed,   setConfirmed]  = useState(false)
  const [loading,     setLoading]    = useState(false)
  const [userId,      setUserId]     = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)

      const unitParam    = searchParams.get('unit')
      const vehicleParam = searchParams.get('vehicle')

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

  async function handleConfirm() {
    if (!stage || !vehicle || !userId) return
    setLoading(true)
    await moveToMaintenance(vehicle.id, userId, stage, notes)
    setLoading(false)
    setConfirmed(true)
  }

  if (confirmed) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '70vh', padding: 32,
      textAlign: 'center', background: B.bg, fontFamily: 'var(--font-inter)',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: B.amberSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={B.amber} strokeWidth="1.7" strokeLinecap="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/>
        </svg>
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, color: B.ink, letterSpacing: '-0.02em' }}>Vehículo enviado a taller</div>
      <div style={{ fontSize: 13, color: B.ink3, marginTop: 8 }}>
        {vehicle?.make} {vehicle?.model} · {vehicle?.plate}
      </div>
      <div style={{
        marginTop: 12, fontSize: 12, color: B.amber,
        background: B.amberSoft, padding: '4px 14px', borderRadius: 9999,
      }}>
        {stage}
      </div>
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
          Mover a Taller
        </h2>
      </div>

      {/* Vehicle selector */}
      {!vehicle && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Seleccionar vehículo
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              value={unitSearch}
              onChange={e => setUnitSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="ID de unidad (ej. U-0142)…"
              style={{
                flex: 1, padding: '11px 14px',
                background: B.surface, border: `1.5px solid ${B.hairline}`,
                borderRadius: 12, fontFamily: 'var(--font-inter)', fontSize: 14,
                color: B.ink, outline: 'none', boxShadow: B.shadowSm,
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
            onClick={() => router.push('/operator/scan?redirect=maintenance')}
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

      {/* Vehicle card */}
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
              <div style={{ fontSize: 12, color: B.ink3, marginTop: 3 }}>
                {vehicle.unit_id} · {vehicle.plate}
              </div>
              <span style={{
                display: 'inline-block', marginTop: 8,
                fontSize: 10, fontWeight: 600, color: B.green,
                background: B.greenSoft, padding: '3px 10px', borderRadius: 9999,
              }}>
                {vehicle.status}
              </span>
            </div>
            <button
              onClick={() => setVehicle(null)}
              style={{ background: 'none', border: 'none', color: B.ink3, cursor: 'pointer', fontSize: 18, padding: 4 }}
            >✕</button>
          </div>
        </div>
      )}

      {/* Stage + notes */}
      {vehicle && (
        <>
          <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Etapa de mantenimiento
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            {STAGES.map(s => (
              <button
                key={s}
                onClick={() => setStage(s)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '13px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                  background: stage === s ? B.amberSoft : B.surface,
                  border: `1.5px solid ${stage === s ? B.amber : B.hairline}`,
                  fontFamily: 'var(--font-inter)', fontSize: 13,
                  color: stage === s ? B.amber : B.ink2,
                  fontWeight: stage === s ? 600 : 400,
                  boxShadow: B.shadowSm,
                }}
              >
                {s}
                {stage === s && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="m5 12 5 5L20 7"/>
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Motivo del traslado *
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Describí el problema o motivo del traslado…"
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '12px 14px', marginBottom: 16,
              background: B.surface, border: `1.5px solid ${B.hairline}`, borderRadius: 12,
              fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink,
              resize: 'none', outline: 'none', lineHeight: 1.5, boxShadow: B.shadowSm,
            }}
          />

          {/* Warning */}
          <div style={{
            background: B.roseSoft, border: `1px solid ${B.rose}44`,
            borderRadius: 12, padding: '12px 14px', marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, color: B.rose, fontWeight: 600, marginBottom: 4 }}>
              ⚠ Atención
            </div>
            <div style={{ fontSize: 12, color: B.ink2, lineHeight: 1.5 }}>
              El vehículo pasará a <strong>Fuera de Servicio</strong> y no estará disponible para contratos.
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!stage || !notes.trim() || loading}
            style={{
              width: '100%', padding: '15px', borderRadius: 12,
              background: stage && notes.trim() ? B.ink : B.surface2,
              border: 'none',
              color: stage && notes.trim() ? '#fff' : B.ink3,
              fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 600,
              cursor: stage && notes.trim() ? 'pointer' : 'not-allowed',
              opacity: loading ? 0.7 : 1,
              letterSpacing: '-0.01em',
            }}
          >
            {loading ? 'Confirmando…' : 'Confirmar traslado'}
          </button>
        </>
      )}
    </div>
  )
}
