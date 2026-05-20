'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { B } from '@/lib/tokens'
import {
  getVehicleByUnitId, getVehicleById,
  createInspection, saveOdometerAndFuel,
  saveChecklistItem, saveDamageRecord, uploadInspectionPhoto,
  completeInspection,
  type OperatorVehicle,
} from '@/lib/supabase/queries/operator'

// ─── Constants ────────────────────────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  'Nivel combustible', 'Nivel aceite', 'Presión neumáticos', 'Luces',
  'Limpiaparabrisas', 'Frenos', 'Bocina', 'Aire acondicionado',
  'Asientos y cinturones', 'Tablero', 'Baúl', 'Limpieza interior',
  'Documentos', 'Rueda de auxilio',
]

const CAR_ZONES = [
  { id: 'bumper_front', label: 'Paragolpes delantero',   x: 30, y: 0,   w: 140, h: 22,  cx: 100, cy: 11  },
  { id: 'fender_fl',   label: 'Guardabarro del. izq.',  x: 0,  y: 22,  w: 28,  h: 77,  cx: 14,  cy: 60  },
  { id: 'hood',        label: 'Capó',                   x: 30, y: 22,  w: 140, h: 77,  cx: 100, cy: 60  },
  { id: 'fender_fr',   label: 'Guardabarro del. der.',  x: 172,y: 22,  w: 28,  h: 77,  cx: 186, cy: 60  },
  { id: 'door_fl',     label: 'Puerta delantera izq.',  x: 0,  y: 99,  w: 28,  h: 68,  cx: 14,  cy: 133 },
  { id: 'windshield',  label: 'Parabrisas',             x: 30, y: 99,  w: 140, h: 35,  cx: 100, cy: 116 },
  { id: 'roof',        label: 'Techo',                  x: 30, y: 134, w: 140, h: 68,  cx: 100, cy: 168 },
  { id: 'door_fr',     label: 'Puerta delantera der.',  x: 172,y: 99,  w: 28,  h: 68,  cx: 186, cy: 133 },
  { id: 'door_rl',     label: 'Puerta trasera izq.',    x: 0,  y: 167, w: 28,  h: 68,  cx: 14,  cy: 201 },
  { id: 'rear_ws',     label: 'Luneta',                 x: 30, y: 202, w: 140, h: 34,  cx: 100, cy: 219 },
  { id: 'trunk',       label: 'Baúl',                   x: 30, y: 236, w: 140, h: 56,  cx: 100, cy: 264 },
  { id: 'door_rr',     label: 'Puerta trasera der.',    x: 172,y: 167, w: 28,  h: 68,  cx: 186, cy: 201 },
  { id: 'fender_rl',   label: 'Guardabarro tras. izq.', x: 0,  y: 235, w: 28,  h: 57,  cx: 14,  cy: 263 },
  { id: 'fender_rr',   label: 'Guardabarro tras. der.', x: 172,y: 235, w: 28,  h: 57,  cx: 186, cy: 263 },
  { id: 'bumper_rear', label: 'Paragolpes trasero',     x: 30, y: 292, w: 140, h: 22,  cx: 100, cy: 303 },
]

const INTERIOR_ZONES = ['Interior', 'Tablero', 'Asientos', 'Baúl interior', 'Parte inferior']

const PHOTO_GUIDE: Record<string, string> = {
  bumper_front: 'A 2m frente al vehículo. Encuadre el paragolpes completo.',
  windshield:   'A 1m frente. Capturá el parabrisas completo con luz lateral para revelar fisuras.',
  roof:         'Desde un lateral elevado. Toda la superficie del techo visible.',
  hood:         'A 1.5m con capó abierto. Toda la superficie desde arriba.',
  door_fl:      'Perpendicular a la puerta. Panel completo, borde a ventanilla.',
  door_fr:      'Perpendicular a la puerta der. Panel completo.',
  door_rl:      'Perpendicular a la puerta trasera izq. Panel completo.',
  door_rr:      'Perpendicular a la puerta trasera der. Panel completo.',
  trunk:        'A 1.5m detrás. Cubierta del baúl completa.',
  bumper_rear:  'A 2m detrás. Paragolpes trasero completo.',
  rear_ws:      'A 1m detrás. Luneta completa con luz lateral.',
}

const BASE_PHOTOS = [
  { key: 'front',    label: 'Frente del vehículo', guide: 'A 3m frente, encuadre completo.' },
  { key: 'left',     label: 'Lateral izquierdo',   guide: 'A 4m del lateral, de parabrisas a luneta.' },
  { key: 'right',    label: 'Lateral derecho',     guide: 'A 4m del lateral derecho.' },
  { key: 'rear',     label: 'Parte trasera',       guide: 'A 3m detrás del vehículo.' },
  { key: 'interior', label: 'Interior / tablero',  guide: 'Sentado en conductor, capturá todo el tablero.' },
]

const STEPS = ['Odómetro', 'Checklist', 'Daños', 'Fotos', 'Firma']

type Severity   = 'cosmetic' | 'minor' | 'major'
type DamageType = 'Golpe' | 'Rayón' | 'Abolladura' | 'Rotura' | 'Astilla' | 'Mancha'
interface ZoneDamage { type: DamageType; severity: Severity; notes: string }

function sevColor(s: Severity) {
  return s === 'cosmetic' ? B.amber : s === 'minor' ? B.amber : B.rose
}
function sevLabel(s: Severity) {
  return s === 'cosmetic' ? 'Leve' : s === 'minor' ? 'Medio' : 'Mayor'
}
function sevSoft(s: Severity) {
  return s === 'cosmetic' ? B.amberSoft : s === 'minor' ? B.amberSoft : B.roseSoft
}

// ─── Signature canvas ─────────────────────────────────────────────────────────

function SignatureCanvas({ onSave }: { onSave: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing   = useRef(false)
  const [hasSig, setHasSig] = useState(false)

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const scaleX = canvasRef.current!.width / rect.width
    const scaleY = canvasRef.current!.height / rect.height
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true
    const ctx = canvasRef.current!.getContext('2d')!
    const p = getPos(e)
    ctx.beginPath(); ctx.moveTo(p.x, p.y)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const p = getPos(e)
    ctx.lineTo(p.x, p.y)
    ctx.strokeStyle = B.ink; ctx.lineWidth = 2.5
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.stroke(); setHasSig(true)
  }

  function onPointerUp() { drawing.current = false }

  function clear() {
    const canvas = canvasRef.current!
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
    setHasSig(false)
  }

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 8 }}>
        <canvas
          ref={canvasRef} width={380} height={120}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
          style={{
            width: '100%', height: 120, display: 'block', touchAction: 'none',
            background: B.surface, border: `1.5px solid ${B.hairline}`, borderRadius: 12,
          }}
        />
        {!hasSig && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>
              Firmá aquí con el dedo
            </span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={clear} style={{
          flex: 1, padding: '10px', borderRadius: 10,
          background: B.surface, border: `1px solid ${B.hairline}`,
          color: B.ink3, fontFamily: 'var(--font-inter)', fontSize: 12, cursor: 'pointer',
        }}>Borrar</button>
        {hasSig && (
          <button onClick={() => onSave(canvasRef.current!.toDataURL('image/png'))} style={{
            flex: 2, padding: '10px', borderRadius: 10,
            background: B.greenSoft, border: `1px solid ${B.green}44`,
            color: B.green, fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>✓ Aceptar firma</button>
        )}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function InspectFlowPage({ params }: { params: { id: string } }) {
  const router      = useRouter()
  const searchParams = useSearchParams()
  const inspectionId = params.id

  const [vehicle,      setVehicle]      = useState<OperatorVehicle | null>(null)
  const [userId,       setUserId]       = useState<string | null>(null)
  const [activeInspId, setActiveInspId] = useState<string | null>(inspectionId !== 'new' ? inspectionId : null)
  const [loading,      setLoading]      = useState(true)
  const [step,         setStep]         = useState(0)
  const [submitted,    setSubmitted]    = useState(false)

  // Step 0
  const [odometer,  setOdometer]  = useState('')
  const [fuelLevel, setFuelLevel] = useState(5)
  const [inspType,  setInspType]  = useState('pickup')

  // Step 1
  const [checkItems, setCheckItems] = useState<Record<string, 'ok' | 'issue' | 'na' | null>>(
    () => Object.fromEntries(CHECKLIST_ITEMS.map(k => [k, null]))
  )

  // Step 2
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [zoneMarkers,  setZoneMarkers]  = useState<Record<string, ZoneDamage>>({})
  const [newDmg, setNewDmg]             = useState<{ type: DamageType; severity: Severity; notes: string }>({ type: 'Golpe', severity: 'cosmetic', notes: '' })
  const [dmgTab,       setDmgTab]       = useState<'diagram' | 'list' | 'photos'>('diagram')

  // Step 3
  const [zonePhotos, setZonePhotos] = useState<Record<string, File[]>>({})
  const [uploading,  setUploading]  = useState(false)

  // Step 4
  const [customerName,   setCustomerName]   = useState('')
  const [signatureSaved, setSignatureSaved] = useState(false)
  const [submitting,     setSubmitting]     = useState(false)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      setUserId(user.id)
      setInspType(searchParams.get('type') ?? 'pickup')

      const vehicleId = searchParams.get('vehicle')
      const unitParam = searchParams.get('unit')
      let v: OperatorVehicle | null = null
      if (vehicleId) v = await getVehicleById(vehicleId)
      else if (unitParam) v = await getVehicleByUnitId(unitParam)
      if (v) { setVehicle(v); setOdometer(v.odometer.toString()) }
      setLoading(false)
    }
    init()
  }, [])

  const checkedCount   = Object.values(checkItems).filter(v => v !== null).length
  const allChecked     = checkedCount === CHECKLIST_ITEMS.length
  const hasMajorDamage = Object.values(zoneMarkers).some(d => d.severity === 'major')

  async function handleStartChecklist() {
    if (!vehicle || !userId) return
    if (!activeInspId) {
      const id = await createInspection(vehicle.id, userId, inspType)
      if (id) {
        setActiveInspId(id)
        await saveOdometerAndFuel(id, parseInt(odometer) || vehicle.odometer, fuelLevel)
      }
    }
    setStep(1)
  }

  async function handleChecklistItem(item: string, val: 'ok' | 'issue' | 'na') {
    const newVal = checkItems[item] === val ? null : val
    setCheckItems(prev => ({ ...prev, [item]: newVal }))
    if (activeInspId && newVal) await saveChecklistItem(activeInspId, item, newVal)
  }

  async function handleSaveDamage() {
    if (!selectedZone || !vehicle) return
    const zoneInfo = [...CAR_ZONES, ...INTERIOR_ZONES.map(z => ({ id: 'interior_' + z, label: z }))]
      .find(z => z.id === selectedZone)
    setZoneMarkers(prev => ({ ...prev, [selectedZone]: { ...newDmg } }))
    if (activeInspId && vehicle) {
      await saveDamageRecord({
        inspectionId: activeInspId, vehicleId: vehicle.id,
        zoneId: selectedZone, zoneLabel: zoneInfo?.label ?? selectedZone,
        damageType: newDmg.type, severity: newDmg.severity, notes: newDmg.notes,
      })
    }
    setSelectedZone(null)
    setNewDmg({ type: 'Golpe', severity: 'cosmetic', notes: '' })
  }

  async function handlePhotoAdded(zone: string, file: File) {
    setZonePhotos(prev => ({ ...prev, [zone]: [...(prev[zone] ?? []), file] }))
    if (activeInspId) { setUploading(true); await uploadInspectionPhoto(activeInspId, zone, file); setUploading(false) }
  }

  async function handleComplete(signature: string) {
    if (!vehicle || !userId) return
    setSubmitting(true)
    const inspId = activeInspId ?? await createInspection(vehicle.id, userId, inspType)
    if (inspId) await completeInspection(inspId, vehicle.id, customerName, signature, hasMajorDamage)
    setSubmitting(false)
    setSubmitted(true)
  }

  // ─── Step bar ────────────────────────────────────────────────────────────────

  const stepBar = (
    <div style={{ padding: '12px 20px 10px', borderBottom: `1px solid ${B.hairline}`, flexShrink: 0, background: B.surface }}>
      <div style={{ display: 'flex', gap: 5 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{
              height: 4, borderRadius: 9999,
              background: i < step ? B.green : i === step ? B.blue : B.surface2,
            }}/>
            <div style={{
              fontFamily: 'var(--font-inter)', fontSize: 9, marginTop: 4,
              color: i === step ? B.ink : B.ink3,
              fontWeight: i === step ? 600 : 400,
            }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  )

  // ─── Done ────────────────────────────────────────────────────────────────────

  if (submitted) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: 32, textAlign: 'center', background: B.bg, fontFamily: 'var(--font-inter)' }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: B.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={B.green} strokeWidth="2" strokeLinecap="round">
          <path d="m5 12 5 5L20 7"/>
        </svg>
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, color: B.ink, letterSpacing: '-0.02em' }}>¡Inspección enviada!</div>
      <div style={{ fontSize: 13, color: B.ink3, marginTop: 8 }}>{vehicle?.unit_id} · {vehicle?.plate}</div>
      {hasMajorDamage && (
        <div style={{ marginTop: 14, padding: '10px 16px', borderRadius: 12, background: B.roseSoft, border: `1px solid ${B.rose}44` }}>
          <div style={{ fontSize: 12, color: B.rose, fontWeight: 600 }}>Daño mayor — ticket de reparación creado</div>
        </div>
      )}
      <button onClick={() => router.push('/operator/tasks')} style={{ marginTop: 28, padding: '12px 28px', borderRadius: 12, background: B.surface, border: `1px solid ${B.hairline}`, color: B.ink2, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, boxShadow: B.shadowSm }}>
        ← Volver a tareas
      </button>
    </div>
  )

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>Cargando vehículo…</span>
    </div>
  )

  if (!vehicle) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 32, textAlign: 'center', background: B.bg, fontFamily: 'var(--font-inter)' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: B.ink, marginBottom: 16 }}>Vehículo no encontrado</div>
      <button onClick={() => router.back()} style={{ padding: '10px 20px', borderRadius: 12, background: B.surface, border: `1px solid ${B.hairline}`, color: B.ink2, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, boxShadow: B.shadowSm }}>← Volver</button>
    </div>
  )

  // ─── Header (always visible) ──────────────────────────────────────────────

  const header = (
    <div style={{ padding: '8px 20px 14px', borderBottom: `1px solid ${B.hairline}`, background: B.surface }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <button onClick={() => router.back()} style={{ width: 32, height: 32, borderRadius: 9999, background: B.surface2, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: B.ink2, cursor: 'pointer', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: inspType === 'pickup' ? B.blue : B.amber,
          background: inspType === 'pickup' ? B.blueSoft : B.amberSoft,
          padding: '3px 10px', borderRadius: 9999,
        }}>
          {inspType === 'pickup' ? 'pre-entrega' : 'post-retorno'}
        </span>
        {activeInspId && (
          <span style={{ fontSize: 11, color: B.ink3 }}>
            {activeInspId.slice(0, 8).toUpperCase()}
          </span>
        )}
      </div>
      <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 19, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>
        {vehicle.unit_id} · {vehicle.make} {vehicle.model}
      </h1>
      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, marginTop: 4 }}>
        {vehicle.plate} · {vehicle.location_name}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: B.bg, fontFamily: 'var(--font-inter)', minHeight: '100%' }}>
      {header}
      {stepBar}

      <div style={{ padding: '0 20px', flex: 1 }}>

        {/* ─── STEP 0 — Odómetro & Combustible ──────────────────────── */}
        {step === 0 && (
          <div style={{ padding: '18px 0' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: B.ink, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
              Odómetro y combustible
            </h2>
            <p style={{ fontSize: 12, color: B.ink3, margin: '0 0 20px', lineHeight: 1.5 }}>
              Verificá y ajustá los datos del vehículo antes de continuar.
            </p>

            {/* Odometer */}
            <div style={{ background: B.surface, borderRadius: 14, padding: '16px', marginBottom: 14, boxShadow: B.shadowSm }}>
              <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Odómetro
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <input
                  type="number"
                  value={odometer}
                  onChange={e => setOdometer(e.target.value)}
                  inputMode="numeric"
                  style={{
                    fontFamily: 'var(--font-inter)', fontSize: 36, fontWeight: 600,
                    color: B.ink, background: 'transparent', border: 'none',
                    outline: 'none', letterSpacing: '-0.02em', width: '100%',
                  }}
                />
                <span style={{ fontSize: 14, color: B.ink3, fontWeight: 500 }}>km</span>
              </div>
            </div>

            {/* Fuel */}
            <div style={{ background: B.surface, borderRadius: 14, padding: '16px', marginBottom: 20, boxShadow: B.shadowSm }}>
              <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Combustible — {Math.round((fuelLevel / 8) * 100)}%
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: B.ink3, marginRight: 4 }}>E</span>
                <div style={{ flex: 1, display: 'flex', gap: 3 }}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      onClick={() => setFuelLevel(i + 1)}
                      style={{
                        flex: 1, height: 28, borderRadius: 6, cursor: 'pointer',
                        background: i < fuelLevel ? B.amber : B.surface2,
                        transition: 'background 0.15s',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: B.ink3, marginLeft: 4 }}>F</span>
              </div>
            </div>

            {/* Odometer photo */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Foto del odómetro (requerida)
              </div>
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                height: 72, borderRadius: 12, cursor: 'pointer',
                background: zonePhotos['odometer']?.length ? B.greenSoft : B.surface,
                border: `1.5px dashed ${zonePhotos['odometer']?.length ? B.green : B.ink4}`,
                boxShadow: B.shadowSm,
              }}>
                <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
                  onChange={e => { if (e.target.files?.[0]) handlePhotoAdded('odometer', e.target.files[0]) }}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke={zonePhotos['odometer']?.length ? B.green : B.ink3} strokeWidth="1.7" strokeLinecap="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                <span style={{ fontSize: 13, color: zonePhotos['odometer']?.length ? B.green : B.ink2, fontWeight: zonePhotos['odometer']?.length ? 600 : 400 }}>
                  {zonePhotos['odometer']?.length ? '✓ Foto tomada' : 'Tomar foto del odómetro'}
                </span>
              </label>
            </div>

            <button
              onClick={handleStartChecklist}
              style={{
                width: '100%', padding: '15px', borderRadius: 12,
                background: B.ink, color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
              }}
            >
              Iniciar checklist →
            </button>
          </div>
        )}

        {/* ─── STEP 1 — Checklist ────────────────────────────────────── */}
        {step === 1 && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: B.ink }}>Checklist de condición</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: B.blue }}>{checkedCount}/14</span>
            </div>
            <div style={{ height: 4, background: B.surface2, borderRadius: 9999, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(checkedCount / 14) * 100}%`, background: B.blue, borderRadius: 9999, transition: 'width 0.3s' }}/>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
              {CHECKLIST_ITEMS.map(item => {
                const val = checkItems[item]
                return (
                  <div key={item} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px',
                    background: B.surface, borderRadius: 12, boxShadow: B.shadowSm,
                    borderLeft: val === 'issue' ? `3px solid ${B.rose}` : val === 'ok' ? `3px solid ${B.green}` : undefined,
                  }}>
                    <span style={{ fontSize: 13, color: B.ink2, flex: 1 }}>{item}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(['ok', 'issue', 'na'] as const).map(v => (
                        <button
                          key={v}
                          onClick={() => handleChecklistItem(item, v)}
                          style={{
                            fontSize: 10, padding: '4px 9px', borderRadius: 9999, cursor: 'pointer', border: 'none',
                            fontFamily: 'var(--font-inter)', fontWeight: val === v ? 600 : 400,
                            background: val === v
                              ? (v === 'ok' ? B.green : v === 'issue' ? B.rose : B.ink3)
                              : B.surface2,
                            color: val === v ? '#fff' : B.ink3,
                          }}
                        >
                          {v === 'ok' ? '✓ OK' : v === 'issue' ? '⚠' : 'N/A'}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: B.surface, border: `1px solid ${B.hairline}`, color: B.ink2, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, boxShadow: B.shadowSm }}>← Anterior</button>
              <button onClick={() => setStep(2)} style={{ flex: 2, padding: '12px', borderRadius: 12, background: B.ink, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600 }}>
                {allChecked ? 'Mapa de daños →' : `Omitir (${14 - checkedCount} sin marcar) →`}
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2 — Damage map ───────────────────────────────────── */}
        {step === 2 && (
          <div style={{ padding: '14px 0' }}>
            {/* Tab strip */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {(['diagram', 'list', 'photos'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDmgTab(tab)}
                  style={{
                    padding: '8px 14px', borderRadius: 9999, cursor: 'pointer',
                    fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 500,
                    background: dmgTab === tab ? B.ink : 'transparent',
                    color: dmgTab === tab ? '#fff' : B.ink2,
                    border: dmgTab === tab ? 'none' : `1px solid ${B.hairline}`,
                  } as React.CSSProperties}
                >
                  {tab === 'diagram' ? 'Diagrama' : tab === 'list' ? `Daños (${Object.keys(zoneMarkers).length})` : 'Fotos'}
                </button>
              ))}
            </div>

            {dmgTab === 'diagram' && (
              <>
                {/* SVG car map */}
                <div style={{ background: B.surface, borderRadius: 14, padding: '14px', marginBottom: 10, boxShadow: B.shadowSm, display: 'flex', justifyContent: 'center' }}>
                  <svg viewBox="0 0 200 314" width="100%" style={{ display: 'block', maxWidth: 280 }}>
                    {CAR_ZONES.map(zone => {
                      const dmg = zoneMarkers[zone.id]
                      const isSelected = selectedZone === zone.id
                      return (
                        <g key={zone.id} onClick={() => setSelectedZone(isSelected ? null : zone.id)} style={{ cursor: 'pointer' }}>
                          <rect
                            x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx={3}
                            fill={dmg ? sevColor(dmg.severity) + '28' : B.surface2}
                            stroke={isSelected ? B.blue : dmg ? sevColor(dmg.severity) : B.ink4}
                            strokeWidth={isSelected ? 1.5 : 0.75}
                          />
                          {dmg && <circle cx={zone.cx} cy={zone.cy} r={5} fill={sevColor(dmg.severity)} stroke={B.surface} strokeWidth={1.5}/>}
                          <text x={zone.cx} y={zone.cy + (dmg ? -9 : 2)} textAnchor="middle" fontSize="5" fill={B.ink3} fontFamily="var(--font-inter)" style={{ pointerEvents: 'none' }}>
                            {zone.label.length > 18 ? zone.label.slice(0, 16) + '…' : zone.label}
                          </text>
                        </g>
                      )
                    })}
                    <text x="100" y="8" textAnchor="middle" fontSize="6" fill={B.ink3} fontFamily="var(--font-inter)">↑ FRENTE</text>
                    <text x="100" y="312" textAnchor="middle" fontSize="6" fill={B.ink3} fontFamily="var(--font-inter)">↓ TRASERO</text>
                  </svg>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: 14, marginBottom: 12, justifyContent: 'center' }}>
                  {(['cosmetic', 'minor', 'major'] as Severity[]).map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 9999, background: sevColor(s) }}/>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: B.ink3 }}>{sevLabel(s)}</span>
                    </div>
                  ))}
                </div>

                {/* Interior zones */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Interior y otros</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {INTERIOR_ZONES.map(z => {
                      const key = 'interior_' + z
                      const dmg = zoneMarkers[key]
                      return (
                        <button key={z} onClick={() => setSelectedZone(selectedZone === key ? null : key)} style={{
                          fontFamily: 'var(--font-inter)', fontSize: 11, padding: '6px 12px', borderRadius: 9999, cursor: 'pointer',
                          background: dmg ? sevSoft(dmg.severity) : B.surface,
                          border: `1.5px solid ${selectedZone === key ? B.blue : dmg ? sevColor(dmg.severity) : B.hairline}`,
                          color: dmg ? sevColor(dmg.severity) : B.ink2,
                          boxShadow: B.shadowSm,
                        }}>{z}</button>
                      )
                    })}
                  </div>
                </div>

                {/* Zone detail panel */}
                {selectedZone && (
                  <div style={{ background: B.surface, border: `1.5px solid ${B.hairline}`, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: B.shadowMd }}>
                    {/* drag handle */}
                    <div style={{ width: 40, height: 4, background: B.ink4, borderRadius: 9999, margin: '0 auto 14px' }}/>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: B.ink }}>
                          {[...CAR_ZONES, ...INTERIOR_ZONES.map(z => ({ id: 'interior_' + z, label: z }))].find(z => z.id === selectedZone)?.label}
                        </div>
                        <div style={{ fontSize: 11, color: B.ink3, marginTop: 2 }}>Zona seleccionada</div>
                      </div>
                      <button onClick={() => setSelectedZone(null)} style={{ background: 'none', border: 'none', color: B.ink3, cursor: 'pointer', fontSize: 18, padding: 4 }}>✕</button>
                    </div>

                    {/* Damage type */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: B.ink2, fontWeight: 500, marginBottom: 6 }}>Tipo de daño</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {(['Golpe', 'Rayón', 'Abolladura', 'Rotura'] as DamageType[]).map(t => (
                          <button key={t} onClick={() => setNewDmg(p => ({ ...p, type: t }))} style={{
                            fontFamily: 'var(--font-inter)', fontSize: 12, padding: '5px 12px', borderRadius: 9999, cursor: 'pointer',
                            background: newDmg.type === t ? B.ink : B.surface2,
                            color: newDmg.type === t ? '#fff' : B.ink2,
                            border: 'none', fontWeight: newDmg.type === t ? 600 : 400,
                          }}>{t}</button>
                        ))}
                      </div>
                    </div>

                    {/* Severity */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: B.ink2, fontWeight: 500, marginBottom: 6 }}>Severidad</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {(['cosmetic', 'minor', 'major'] as Severity[]).map(s => (
                          <button key={s} onClick={() => setNewDmg(p => ({ ...p, severity: s }))} style={{
                            flex: 1, padding: '9px 0', textAlign: 'center', borderRadius: 9999,
                            fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                            background: newDmg.severity === s ? sevSoft(s) : B.surface2,
                            color: newDmg.severity === s ? sevColor(s) : B.ink2,
                            border: newDmg.severity === s ? `1.5px solid ${sevColor(s)}55` : 'none',
                          }}>{sevLabel(s)}</button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: B.ink2, fontWeight: 500, marginBottom: 6 }}>Notas</div>
                      <textarea
                        value={newDmg.notes}
                        onChange={e => setNewDmg(p => ({ ...p, notes: e.target.value }))}
                        placeholder="Descripción adicional…"
                        rows={2}
                        style={{
                          width: '100%', boxSizing: 'border-box', padding: '10px 12px',
                          background: B.surface2, border: `1px solid ${B.hairline}`, borderRadius: 10,
                          fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink, resize: 'none', outline: 'none',
                        }}
                      />
                    </div>

                    {/* Photo guide */}
                    {PHOTO_GUIDE[selectedZone] && (
                      <div style={{ background: B.blueSoft, borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                        <div style={{ fontSize: 10, color: B.blue, marginBottom: 3, fontWeight: 600 }}>📷 Guía de foto</div>
                        <div style={{ fontSize: 11, color: B.ink2, lineHeight: 1.5 }}>{PHOTO_GUIDE[selectedZone]}</div>
                      </div>
                    )}

                    {/* Photo slots */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: B.ink2, fontWeight: 500, marginBottom: 6 }}>Fotos</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {Array.from({ length: 3 }).map((_, i) => {
                          const file = zonePhotos[selectedZone]?.[i]
                          return (
                            <label key={i} style={{
                              width: 64, height: 64, borderRadius: 10, cursor: 'pointer',
                              background: file ? B.greenSoft : B.surface2,
                              border: `1.5px dashed ${file ? B.green : B.ink4}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
                                onChange={e => { if (e.target.files?.[0]) handlePhotoAdded(selectedZone, e.target.files[0]) }}
                              />
                              {file
                                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={B.green} strokeWidth="2" strokeLinecap="round"><path d="m5 12 5 5L20 7"/></svg>
                                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={B.ink3} strokeWidth="1.5" strokeLinecap="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/></svg>
                              }
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* Major damage warning */}
                    {newDmg.severity === 'major' && (
                      <div style={{ background: B.amberSoft, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
                        <div style={{ fontSize: 11, color: B.amber, fontWeight: 600, marginBottom: 4 }}>⚠ Daño mayor · acción automática</div>
                        <p style={{ fontSize: 11, color: B.ink2, lineHeight: 1.5, margin: 0 }}>Al guardar: vehículo a Fuera de servicio, ticket de reparación y alerta a gerente.</p>
                      </div>
                    )}

                    <button onClick={handleSaveDamage} style={{
                      width: '100%', padding: '12px', borderRadius: 12, cursor: 'pointer', border: 'none',
                      background: B.ink, color: '#fff', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600,
                    }}>
                      Guardar daño →
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: B.surface, border: `1px solid ${B.hairline}`, color: B.ink2, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, boxShadow: B.shadowSm }}>← Anterior</button>
                  <button onClick={() => setStep(3)} style={{ flex: 2, padding: '12px', borderRadius: 12, background: B.ink, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600 }}>
                    {Object.keys(zoneMarkers).length === 0 ? 'Sin daños → Fotos' : `${Object.keys(zoneMarkers).length} daño(s) → Fotos`}
                  </button>
                </div>
              </>
            )}

            {dmgTab === 'list' && (
              <div>
                {Object.entries(zoneMarkers).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: B.ink3, fontFamily: 'var(--font-inter)', fontSize: 13 }}>Sin daños registrados</div>
                ) : (
                  Object.entries(zoneMarkers).map(([zid, dmg]) => {
                    const zoneName = CAR_ZONES.find(z => z.id === zid)?.label ?? zid.replace('interior_', '')
                    return (
                      <div key={zid} style={{ background: B.surface, borderLeft: `3px solid ${sevColor(dmg.severity)}`, borderRadius: 12, padding: '12px 14px', marginBottom: 8, boxShadow: B.shadowSm }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: B.ink }}>{zoneName}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: sevColor(dmg.severity), background: sevSoft(dmg.severity), padding: '2px 8px', borderRadius: 9999 }}>{sevLabel(dmg.severity)}</span>
                        </div>
                        <div style={{ fontSize: 11, color: B.ink3, marginTop: 4 }}>{dmg.type}{dmg.notes ? ' · ' + dmg.notes : ''}</div>
                      </div>
                    )
                  })
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: B.surface, border: `1px solid ${B.hairline}`, color: B.ink2, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, boxShadow: B.shadowSm }}>← Anterior</button>
                  <button onClick={() => setStep(3)} style={{ flex: 2, padding: '12px', borderRadius: 12, background: B.ink, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600 }}>Fotos →</button>
                </div>
              </div>
            )}

            {dmgTab === 'photos' && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: B.ink3, fontFamily: 'var(--font-inter)', fontSize: 13 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={B.ink3} strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 12 }}>
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                Agregá daños en el diagrama para adjuntar fotos por zona
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: B.surface, border: `1px solid ${B.hairline}`, color: B.ink2, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, boxShadow: B.shadowSm }}>← Anterior</button>
                  <button onClick={() => setStep(3)} style={{ flex: 2, padding: '12px', borderRadius: 12, background: B.ink, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600 }}>Fotos →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 3 — Photos ────────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ padding: '16px 0' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: B.ink, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
              Fotos · paso 4 de 5
            </h2>
            <p style={{ fontSize: 12, color: B.ink2, margin: '0 0 16px', lineHeight: 1.5 }}>
              Capturá los 4 ángulos · mínimo 1 requerida para guardar.
              {uploading && <span style={{ color: B.blue }}> Subiendo…</span>}
            </p>

            {/* Odo + fuel summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
              <div style={{ background: B.surface, borderRadius: 12, padding: '12px 14px', boxShadow: B.shadowSm }}>
                <div style={{ fontSize: 10, color: B.ink3, fontWeight: 500, marginBottom: 4 }}>Odómetro</div>
                <div style={{ fontSize: 18, color: B.ink, fontWeight: 600, letterSpacing: '-0.02em' }}>
                  {odometer} <span style={{ fontSize: 11, color: B.ink3, fontWeight: 400 }}>km</span>
                </div>
              </div>
              <div style={{ background: B.surface, borderRadius: 12, padding: '12px 14px', boxShadow: B.shadowSm }}>
                <div style={{ fontSize: 10, color: B.ink3, fontWeight: 500, marginBottom: 6 }}>Combustible</div>
                <div style={{ display: 'flex', gap: 2, height: 8 }}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} style={{ flex: 1, background: i < fuelLevel ? B.amber : B.surface2, borderRadius: 2 }}/>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: B.ink3, marginTop: 4 }}>
                  {fuelLevel}/8 · {Math.round((fuelLevel / 8) * 100)}%
                </div>
              </div>
            </div>

            {/* 4-photo grid for base angles */}
            <h3 style={{ fontSize: 13, fontWeight: 600, color: B.ink, margin: '0 0 10px' }}>Fotos del vehículo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
              {BASE_PHOTOS.slice(0, 4).map(zone => {
                const taken = !!(zonePhotos[zone.key]?.length)
                return (
                  <label key={zone.key} style={{
                    aspectRatio: '1/1.1', borderRadius: 10, cursor: 'pointer',
                    background: taken ? B.surface : B.surface2,
                    border: taken ? 'none' : `1.5px dashed ${B.ink4}`,
                    boxShadow: taken ? B.shadowSm : 'none',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                    color: taken ? B.green : B.ink3,
                  }}>
                    <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
                      onChange={e => { if (e.target.files?.[0]) handlePhotoAdded(zone.key, e.target.files[0]) }}
                    />
                    {taken ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/></svg>
                    )}
                    <span style={{ fontSize: 9, fontWeight: 500 }}>{zone.label.split(' ')[0]}</span>
                  </label>
                )
              })}
            </div>

            {/* Damage zone photos (if any) */}
            {Object.entries(zoneMarkers).length > 0 && (
              <>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: B.ink, margin: '0 0 10px' }}>Fotos de daños</h3>
                {Object.entries(zoneMarkers).map(([zid]) => {
                  const zoneName = CAR_ZONES.find(z => z.id === zid)?.label ?? zid.replace('interior_', '')
                  return (
                    <div key={zid} style={{ background: B.surface, borderRadius: 12, padding: '12px 14px', marginBottom: 8, boxShadow: B.shadowSm }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: B.ink, marginBottom: 8 }}>{zoneName}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {Array.from({ length: 3 }).map((_, j) => {
                          const file = zonePhotos[zid]?.[j]
                          return (
                            <label key={j} style={{
                              width: 56, height: 56, borderRadius: 8,
                              background: file ? B.greenSoft : B.surface2,
                              border: `1.5px dashed ${file ? B.green : B.ink4}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            }}>
                              <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
                                onChange={e => { if (e.target.files?.[0]) handlePhotoAdded(zid, e.target.files[0]) }}
                              />
                              {file
                                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={B.green} strokeWidth="2" strokeLinecap="round"><path d="m5 12 5 5L20 7"/></svg>
                                : <span style={{ fontSize: 18, color: B.ink3 }}>+</span>
                              }
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: B.surface, border: `1px solid ${B.hairline}`, color: B.ink2, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, boxShadow: B.shadowSm }}>← Anterior</button>
              <button onClick={() => setStep(4)} style={{ flex: 2, padding: '12px', borderRadius: 12, background: B.ink, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600 }}>Firma y cierre →</button>
            </div>
          </div>
        )}

        {/* ─── STEP 4 — Signature ─────────────────────────────────────── */}
        {step === 4 && (
          <div style={{ padding: '16px 0' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: B.ink, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              Resumen de inspección
            </h2>

            {/* Summary rows */}
            {[
              ['Vehículo',    `${vehicle.make} ${vehicle.model} ${vehicle.year}`],
              ['Unidad',      vehicle.unit_id],
              ['Placa',       vehicle.plate],
              ['Odómetro',    `${odometer} km`],
              ['Combustible', `${Math.round((fuelLevel / 8) * 100)}%`],
              ['Checklist',   `${checkedCount}/14 ítems`],
              ['Daños',       `${Object.keys(zoneMarkers).length} zona(s)`],
              ['Daño mayor',  hasMajorDamage ? '⚠ Sí — ticket automático' : 'No'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${B.hairline}` }}>
                <span style={{ fontSize: 13, color: B.ink3 }}>{k}</span>
                <span style={{ fontSize: 13, color: k === 'Daño mayor' && hasMajorDamage ? B.rose : B.ink, fontWeight: k === 'Daño mayor' && hasMajorDamage ? 600 : 400 }}>{v}</span>
              </div>
            ))}

            {/* Signature */}
            <div style={{ marginTop: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Firma del cliente
              </div>
              <SignatureCanvas onSave={(dataUrl) => { setSignatureSaved(true); handleComplete(dataUrl) }} />
            </div>

            {/* Customer name */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 6 }}>Nombre del cliente</div>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Nombre completo…"
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '12px 14px',
                  background: B.surface, border: `1.5px solid ${B.hairline}`, borderRadius: 12,
                  fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, outline: 'none',
                  boxShadow: B.shadowSm,
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep(3)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: B.surface, border: `1px solid ${B.hairline}`, color: B.ink2, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, boxShadow: B.shadowSm }}>← Anterior</button>
              <button
                onClick={async () => { if (!signatureSaved) await handleComplete('') }}
                disabled={!customerName.trim() || submitting}
                style={{
                  flex: 2, padding: '12px', borderRadius: 12,
                  background: customerName.trim() ? B.green : B.surface2,
                  border: 'none',
                  color: customerName.trim() ? '#fff' : B.ink3,
                  fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600,
                  cursor: customerName.trim() ? 'pointer' : 'not-allowed',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Enviando…' : 'Confirmar y enviar ✓'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
