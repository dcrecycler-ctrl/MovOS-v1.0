'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { B } from '@/lib/tokens'
import { getOperatorProfile, type OperatorProfile } from '@/lib/supabase/queries/operator'

// ─── Mock tasks ───────────────────────────────────────────────────────────────

type TaskKind = 'ENTREGA' | 'RETORNO' | 'TALLER' | 'LIMPIEZA' | 'INSPECCIÓN' | 'ALERTA'

const MOCK_TASKS = [
  { id: '1', kind: 'ENTREGA'    as TaskKind, unit: 'U-0142', model: 'Toyota Hilux 2022',   plate: 'SBQ 3812', time: '09:00', client: 'Juan Pérez',   urgency: 'normal' },
  { id: '2', kind: 'RETORNO'   as TaskKind, unit: 'U-0033', model: 'Toyota SW4 2020',     plate: 'SAT 2290', time: '10:30', client: 'María García', urgency: 'high'   },
  { id: '3', kind: 'TALLER'    as TaskKind, unit: 'U-0088', model: 'Toyota Corolla 2023', plate: 'SBC 7751', time: '11:00', client: null,           urgency: 'high'   },
  { id: '4', kind: 'LIMPIEZA'  as TaskKind, unit: 'U-0055', model: 'Renault Duster 2021', plate: 'SAX 4421', time: '14:00', client: null,           urgency: 'normal' },
  { id: '5', kind: 'ENTREGA'   as TaskKind, unit: 'U-0201', model: 'Toyota RAV4 2023',    plate: 'SBF 9912', time: '15:30', client: 'Carlos López', urgency: 'normal' },
]

const ACTIVITY = [
  { action: 'Inspección completada',    unit: 'U-0094', time: 'Hace 2h' },
  { action: 'Vehículo enviado a taller', unit: 'U-0119', time: 'Hace 4h' },
  { action: 'Alerta creada',            unit: 'U-0201', time: 'Hace 5h' },
]

const ROLE_LABEL: Record<string, string> = {
  inspector: 'Inspector de Flota',
  operator:  'Operador',
  mechanic:  'Mecánico',
}

// ─── Task icons ───────────────────────────────────────────────────────────────

const sp = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function TaskIcon({ kind }: { kind: TaskKind }) {
  switch (kind) {
    case 'ENTREGA':
      return <svg width="20" height="20" viewBox="0 0 24 24" {...sp}><path d="M5 12V7a5 5 0 0 1 10 0v5"/><rect x="3" y="12" width="14" height="9" rx="1"/></svg>
    case 'RETORNO':
      return <svg width="20" height="20" viewBox="0 0 24 24" {...sp}><path d="m9 14-4-4 4-4"/><path d="M5 10h11a5 5 0 0 1 5 5v0"/></svg>
    case 'TALLER':
      return <svg width="20" height="20" viewBox="0 0 24 24" {...sp}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></svg>
    case 'LIMPIEZA':
      return <svg width="20" height="20" viewBox="0 0 24 24" {...sp}><path d="M3 3h2M7 3h2M3 8h6M3 13h6M14 3v18M14 8h4M14 13h4M14 18h4"/></svg>
    case 'INSPECCIÓN':
      return <svg width="20" height="20" viewBox="0 0 24 24" {...sp}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
    default:
      return <svg width="20" height="20" viewBox="0 0 24 24" {...sp}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  }
}

function kindLabel(kind: TaskKind): string {
  switch (kind) {
    case 'ENTREGA':   return 'entrega'
    case 'RETORNO':   return 'retorno'
    case 'TALLER':    return 'taller'
    case 'LIMPIEZA':  return 'limpieza'
    case 'INSPECCIÓN': return 'inspección'
    default: return kind.toLowerCase()
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const router   = useRouter()
  const [profile, setProfile] = useState<OperatorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const p = await getOperatorProfile(user.id)
      setProfile(p)
      setLoading(false)
    }
    load()
  }, [])

  const pending  = MOCK_TASKS
  const urgent   = MOCK_TASKS.filter(t => t.urgency === 'high')
  const doneCount = 3

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>Cargando…</span>
    </div>
  )

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Usuario'
  const today = new Date().toLocaleDateString('es-UY', { weekday: 'short', day: 'numeric', month: 'short' })

  function handleTaskTap(task: typeof MOCK_TASKS[0]) {
    if (task.kind === 'ENTREGA' || task.kind === 'RETORNO') {
      const type = task.kind === 'ENTREGA' ? 'pickup' : 'return'
      router.push(`/operator/inspect/new?type=${type}&unit=${task.unit}`)
    } else if (task.kind === 'TALLER') {
      router.push(`/operator/maintenance?unit=${task.unit}`)
    } else {
      router.push(`/operator/alerts?unit=${task.unit}`)
    }
  }

  return (
    <div style={{ padding: '8px 20px 16px', fontFamily: 'var(--font-inter)', background: B.bg }}>

      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: B.ink3, fontWeight: 500, marginBottom: 4 }}>
          {today.charAt(0).toUpperCase() + today.slice(1)}
          {profile?.location_name ? ` · ${profile.location_name}` : ''}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: B.ink, letterSpacing: '-0.02em', margin: 0 }}>
          Hola, {firstName}.
        </h1>
        <p style={{ fontSize: 13, color: B.ink2, margin: '4px 0 0' }}>
          Tenés <strong>{pending.length} tareas pendientes</strong>
          {profile?.location_name ? ` en ${profile.location_name}` : ''}.
        </p>
        {profile && (
          <span style={{
            display: 'inline-block', marginTop: 8,
            fontSize: 10, fontWeight: 500, color: B.blue,
            background: B.blueSoft, padding: '3px 10px', borderRadius: 9999,
          }}>
            {ROLE_LABEL[profile.role] ?? 'Operador'}
          </span>
        )}
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Hoy',      value: pending.length,  dot: B.blue  },
          { label: 'Urgentes', value: urgent.length,   dot: B.rose  },
          { label: 'Listas',   value: doneCount,        dot: B.green },
        ].map(s => (
          <div key={s.label} style={{
            background: B.surface, borderRadius: 14, padding: '14px 12px',
            boxShadow: B.shadowSm,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: 9999, background: s.dot, flexShrink: 0, display: 'inline-block' }}/>
              <span style={{ fontSize: 10, color: B.ink3, fontWeight: 500 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: B.ink, letterSpacing: '-0.02em' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Scan QR CTA */}
      <div
        onClick={() => router.push('/operator/scan')}
        style={{
          background: B.ink, borderRadius: 16, padding: '18px',
          marginBottom: 20, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', cursor: 'pointer',
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Acción rápida</div>
          <div style={{ fontSize: 16, color: '#FFF', fontWeight: 600, letterSpacing: '-0.01em', marginTop: 4 }}>
            Escanear QR del vehículo →
          </div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <rect x="3" y="7" width="18" height="13" rx="2"/>
            <path d="M3 11h18M9 4h6"/>
          </svg>
        </div>
      </div>

      {/* Pending tasks */}
      <h3 style={{ fontSize: 14, fontWeight: 600, color: B.ink, margin: '0 0 10px' }}>Pendientes</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {pending.map(t => {
          const high = t.urgency === 'high'
          return (
            <div
              key={t.id}
              onClick={() => handleTaskTap(t)}
              style={{
                background: B.surface, borderRadius: 14, padding: '14px 16px',
                boxShadow: B.shadowSm, display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer',
              }}
            >
              {/* Icon tile */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: high ? B.roseSoft : B.blueSoft,
                color: high ? B.rose : B.blue,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TaskIcon kind={t.kind} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 11, color: B.ink3, fontWeight: 500 }}>{kindLabel(t.kind)}</span>
                  <span style={{ fontSize: 11, color: B.ink3 }}>· {t.time}</span>
                </div>
                <div style={{ fontSize: 14, color: B.ink, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.unit} · {t.model}
                </div>
                {t.client && (
                  <div style={{ fontSize: 11, color: B.ink2, marginTop: 2 }}>{t.client}</div>
                )}
              </div>

              {/* Chevron */}
              <div style={{ color: B.ink3 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent activity */}
      <h3 style={{ fontSize: 13, fontWeight: 600, color: B.ink2, margin: '0 0 8px' }}>Actividad reciente</h3>
      {ACTIVITY.map((a, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 0', borderBottom: `1px solid ${B.hairline}`,
        }}>
          <div>
            <div style={{ fontSize: 12, color: B.ink2 }}>{a.action}</div>
            <div style={{ fontSize: 11, color: B.ink3, marginTop: 2 }}>{a.unit}</div>
          </div>
          <span style={{ fontSize: 11, color: B.ink3 }}>{a.time}</span>
        </div>
      ))}
    </div>
  )
}
