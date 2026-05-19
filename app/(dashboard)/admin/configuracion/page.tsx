'use client'

import { useState, useEffect, useCallback } from 'react'
import { B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'

// ─── Data ─────────────────────────────────────────────────────────────────────
const SUCURSALES_INIT = [
  { name: 'Pocitos',       city: 'Montevideo', address: 'Av. Brasil 2890',   phone: '+598 2710 0001', manager: 'Ana Rodríguez'   },
  { name: 'Centro',        city: 'Montevideo', address: '18 de Julio 1234',  phone: '+598 2900 0002', manager: 'Carlos Méndez'    },
  { name: 'Punta del Este',city: 'Maldonado',  address: 'Av. Gorlero 850',   phone: '+598 4244 0003', manager: 'Laura Fernández'  },
  { name: 'Colonia',       city: 'Colonia',    address: 'Washington 456',    phone: '+598 4522 0004', manager: 'Miguel Torres'    },
]

const VEHICLE_CATEGORIES = [
  { name: 'Economy',  desc: 'Hatchbacks y sedanes compactos', rate: '1,200' },
  { name: 'Compact',  desc: 'Sedanes medianos',               rate: '1,500' },
  { name: 'Midsize',  desc: 'Sedanes y station wagons',       rate: '1,800' },
  { name: 'SUV',      desc: 'SUVs y crossovers',              rate: '2,200' },
  { name: 'Premium',  desc: 'Vehículos de alta gama',         rate: '3,500' },
  { name: 'Van',      desc: 'Minivans y furgones',            rate: '2,000' },
  { name: 'Pickup',   desc: '4×4 y utilitarios',              rate: '2,400' },
]

const PERMS_FEATURES = [
  'Dashboard', 'Flota', 'Inspecciones', 'Mantenimiento',
  'Contratos', 'Inteligencia', 'Configuración', 'Crear alertas', 'Ver Analytics',
]

type PermLevel = 'full' | 'partial' | 'none'
const PERMS_MATRIX: Record<string, PermLevel[]> = {
  'Dashboard':      ['full', 'full',    'partial', 'partial', 'full'   ],
  'Flota':          ['full', 'full',    'partial', 'partial', 'full'   ],
  'Inspecciones':   ['full', 'partial', 'full',    'none',    'partial'],
  'Mantenimiento':  ['full', 'full',    'partial', 'full',    'partial'],
  'Contratos':      ['full', 'full',    'none',    'none',    'full'   ],
  'Inteligencia':   ['full', 'full',    'none',    'none',    'none'   ],
  'Configuración':  ['full', 'none',    'none',    'none',    'none'   ],
  'Crear alertas':  ['full', 'full',    'full',    'full',    'full'   ],
  'Ver Analytics':  ['full', 'full',    'none',    'none',    'partial'],
}

const ROLES = ['Admin', 'Gerencia', 'Inspector', 'Mecánico', 'Operador']
const ROLE_OPTIONS = ['Administrador', 'Gerencia', 'Inspector', 'Mecánico', 'Operador']

// ─── Shared components ────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 42, height: 22, borderRadius: 11, cursor: 'pointer', flexShrink: 0,
        background: on ? B.green : B.ink4, position: 'relative', transition: 'background 0.2s',
        border: `1px solid ${on ? B.green : B.ink4}`,
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2, left: on ? 22 : 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'left 0.2s',
      }}/>
    </div>
  )
}

function Toast({ message, onHide }: { message: string; onHide: () => void }) {
  useEffect(() => {
    const t = setTimeout(onHide, 2800)
    return () => clearTimeout(t)
  }, [onHide])
  return (
    <div style={{
      position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)',
      background: B.ink, color: '#fff', padding: '10px 22px', borderRadius: 999,
      fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500,
      boxShadow: B.shadowLg, zIndex: 9999, whiteSpace: 'nowrap',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ color: B.green }}>✓</span>{message}
    </div>
  )
}

function SectionCard({
  title, accent, icon, onSave, children, saveLabel,
}: {
  title: string; accent: string; icon: React.ReactNode;
  onSave?: () => void; children: React.ReactNode; saveLabel?: string;
}) {
  return (
    <div style={{
      background: B.surface, border: `1px solid ${B.hairline}`,
      borderTop: `3px solid ${accent}`, borderRadius: B.radius,
      boxShadow: B.shadowMd, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '22px 24px 20px', borderBottom: `1px solid ${B.hairline}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent,
          }}>
            {icon}
          </div>
          <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 600, color: B.ink, margin: 0 }}>{title}</h2>
        </div>
      </div>
      <div style={{ padding: '20px 24px', flex: 1 }}>{children}</div>
      {onSave && (
        <div style={{ padding: '14px 24px', borderTop: `1px solid ${B.hairline}` }}>
          <button
            onClick={onSave}
            style={{
              padding: '9px 22px', borderRadius: 8, background: B.ink, color: '#fff',
              border: 'none', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {saveLabel ?? 'Guardar cambios'}
          </button>
        </div>
      )}
    </div>
  )
}

const iStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '9px 12px',
  background: B.surface2, border: `1px solid ${B.ink4}`, borderRadius: 8,
  fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, outline: 'none',
}

function FL({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2, marginBottom: 5, fontWeight: 500 }}>{children}</div>
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <FL>{label}</FL>
      {children}
    </div>
  )
}

function PermIcon({ level }: { level: PermLevel }) {
  if (level === 'full')    return <span style={{ color: B.green,  fontSize: 14, fontWeight: 700 }}>✓</span>
  if (level === 'partial') return <span style={{ color: B.amber,  fontSize: 14 }}>◐</span>
  return <span style={{ color: B.ink4, fontSize: 14 }}>—</span>
}

// ─── Section 1 — Empresa y Sucursales ────────────────────────────────────────
function Section1({ onSave }: { onSave: () => void }) {
  const [branches, setBranches] = useState(SUCURSALES_INIT)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState(SUCURSALES_INIT[0])
  const [adding, setAdding] = useState(false)
  const [newBranch, setNewBranch] = useState({ name: '', city: '', address: '', phone: '', manager: '' })
  const [currency, setCurrency] = useState<'UYU' | 'USD'>('UYU')

  function startEdit(i: number) { setEditingIdx(i); setEditDraft({ ...branches[i] }) }
  function saveEdit() {
    if (editingIdx === null) return
    setBranches(b => b.map((br, i) => i === editingIdx ? editDraft : br))
    setEditingIdx(null)
  }
  function saveNew() {
    setBranches(b => [...b, { ...newBranch }])
    setNewBranch({ name: '', city: '', address: '', phone: '', manager: '' })
    setAdding(false)
  }

  return (
    <SectionCard
      title="Empresa y Sucursales"
      accent={B.blue}
      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
      onSave={onSave}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <FieldRow label="Nombre empresa">
          <input style={iStyle} defaultValue="MovOS / Pegasus Pixels" />
        </FieldRow>
        <FieldRow label="País">
          <select style={iStyle}><option>Uruguay</option><option>Argentina</option><option>Chile</option></select>
        </FieldRow>
        <FieldRow label="Zona horaria">
          <select style={iStyle}><option>America/Montevideo</option><option>America/Buenos_Aires</option></select>
        </FieldRow>
        <FieldRow label="Moneda">
          <div style={{ display: 'flex', gap: 6 }}>
            {(['UYU', 'USD'] as const).map(c => (
              <button key={c} onClick={() => setCurrency(c)} style={{
                flex: 1, padding: '9px', borderRadius: 8, cursor: 'pointer', border: 'none',
                background: currency === c ? B.ink : B.surface2,
                color: currency === c ? '#fff' : B.ink2,
                fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: currency === c ? 600 : 400,
              }}>{c}</button>
            ))}
          </div>
        </FieldRow>
      </div>

      <FieldRow label="Logo de empresa">
        <div style={{
          border: `1.5px dashed ${B.ink4}`, borderRadius: 10, padding: '16px',
          textAlign: 'center', cursor: 'pointer', background: B.surface2,
        }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>Arrastrá o hacé click para subir logo</div>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink4, marginTop: 4 }}>PNG, SVG — máx 2MB</div>
        </div>
      </FieldRow>

      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.ink }}>Sucursales ({branches.length})</span>
          <button onClick={() => setAdding(a => !a)} style={{
            padding: '6px 14px', borderRadius: 7, background: adding ? B.surface2 : B.ink,
            color: adding ? B.ink2 : '#fff', border: `1px solid ${adding ? B.ink4 : B.ink}`,
            fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            {adding ? 'Cancelar' : '+ Agregar'}
          </button>
        </div>

        {adding && (
          <div style={{ background: B.surface2, border: `1px solid ${B.hairline}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              {[['Nombre', 'name'], ['Ciudad', 'city'], ['Dirección', 'address'], ['Teléfono', 'phone'], ['Responsable', 'manager']].map(([lbl, key]) => (
                <div key={key}>
                  <FL>{lbl}</FL>
                  <input style={iStyle} value={(newBranch as Record<string,string>)[key]} onChange={e => setNewBranch(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <button onClick={saveNew} style={{ padding: '8px 18px', borderRadius: 7, background: B.blue, color: '#fff', border: 'none', fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              Agregar sucursal
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {branches.map((br, i) => (
            <div key={i} style={{ background: B.surface2, border: `1px solid ${B.hairline}`, borderRadius: 10 }}>
              {editingIdx === i ? (
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    {[['Nombre', 'name'], ['Ciudad', 'city'], ['Dirección', 'address'], ['Teléfono', 'phone'], ['Responsable', 'manager']].map(([lbl, key]) => (
                      <div key={key}>
                        <FL>{lbl}</FL>
                        <input style={iStyle} value={(editDraft as Record<string,string>)[key]} onChange={e => setEditDraft(p => ({ ...p, [key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={saveEdit} style={{ padding: '7px 16px', borderRadius: 7, background: B.ink, color: '#fff', border: 'none', fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Guardar</button>
                    <button onClick={() => setEditingIdx(null)} style={{ padding: '7px 14px', borderRadius: 7, background: 'transparent', color: B.ink3, border: `1px solid ${B.hairline}`, fontFamily: 'var(--font-inter)', fontSize: 12, cursor: 'pointer' }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.ink }}>{br.name} <span style={{ fontWeight: 400, color: B.ink3 }}>· {br.city}</span></div>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3, marginTop: 2 }}>{br.address} · {br.phone} · {br.manager}</div>
                  </div>
                  <button onClick={() => startEdit(i)} style={{ padding: '5px 12px', borderRadius: 6, background: 'transparent', color: B.ink3, border: `1px solid ${B.hairline}`, fontFamily: 'var(--font-inter)', fontSize: 11, cursor: 'pointer' }}>Editar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

// ─── Section 2 — Usuarios y Roles ────────────────────────────────────────────
function Section2({ onSave }: { onSave: () => void }) {
  return (
    <SectionCard
      title="Usuarios y Roles"
      accent={B.green}
      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
      onSave={onSave}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Ver todos los usuarios', href: '/admin/usuarios' },
          { label: 'Agregar usuario',         href: '/admin/usuarios' },
          { label: 'Gestionar roles',          href: '#' },
        ].map(lnk => (
          <a key={lnk.label} href={lnk.href} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 14px', borderRadius: 9, background: B.surface2,
            border: `1px solid ${B.hairline}`, textDecoration: 'none',
            fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, fontWeight: 500,
          }}>
            {lnk.label}
            <span style={{ color: B.ink3 }}>→</span>
          </a>
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.ink, marginBottom: 12 }}>Permisos por rol</div>
      <div style={{ overflowX: 'auto', marginLeft: -4 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
          <thead>
            <tr>
              <th style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, fontWeight: 600, textAlign: 'left', padding: '6px 8px', borderBottom: `1px solid ${B.hairline}` }}>Función</th>
              {ROLES.map(r => (
                <th key={r} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, fontWeight: 600, textAlign: 'center', padding: '6px 6px', borderBottom: `1px solid ${B.hairline}`, whiteSpace: 'nowrap' }}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMS_FEATURES.map((feat, fi) => (
              <tr key={feat} style={{ background: fi % 2 === 0 ? 'transparent' : B.surface2 }}>
                <td style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2, padding: '7px 8px', borderBottom: `1px solid ${B.hairline}` }}>{feat}</td>
                {PERMS_MATRIX[feat].map((lvl, ri) => (
                  <td key={ri} style={{ textAlign: 'center', padding: '7px 6px', borderBottom: `1px solid ${B.hairline}` }}>
                    <PermIcon level={lvl} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, paddingLeft: 4 }}>
          {[['✓', B.green, 'Acceso completo'], ['◐', B.amber, 'Acceso parcial'], ['—', B.ink4, 'Sin acceso']].map(([sym, col, lbl]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: col, fontSize: 13, fontWeight: 700 }}>{sym}</span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3 }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

// ─── Section 3 — Integraciones ────────────────────────────────────────────────
function Section3({ onSave }: { onSave: () => void }) {
  const [karveConnected, setKarveConnected] = useState(true)
  const [syncFreq, setSyncFreq] = useState('30min')
  const [showKey, setShowKey] = useState(false)
  const [testState, setTestState] = useState<'idle' | 'loading' | 'ok' | 'fail'>('idle')

  function testConnection() {
    setTestState('loading')
    setTimeout(() => setTestState(karveConnected ? 'ok' : 'fail'), 1600)
  }

  return (
    <SectionCard
      title="Integraciones"
      accent={B.amber}
      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
      onSave={onSave}
    >
      {/* Karve */}
      <div style={{ background: B.surface2, border: `1px solid ${B.hairline}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: B.ink }}>Karve API</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, fontWeight: 700,
              color: karveConnected ? B.green : B.rose,
              background: (karveConnected ? B.green : B.rose) + '18',
              padding: '3px 9px', borderRadius: 99,
            }}>{karveConnected ? 'CONECTADO' : 'DESCONECTADO'}</span>
            <Toggle on={karveConnected} onChange={setKarveConnected} />
          </div>
        </div>

        <FieldRow label="Endpoint URL">
          <input style={iStyle} defaultValue="https://api.karve.io/v2" />
        </FieldRow>

        <div style={{ marginBottom: 14 }}>
          <FL>API Key</FL>
          <div style={{ position: 'relative' }}>
            <input type={showKey ? 'text' : 'password'} style={{ ...iStyle, paddingRight: 40 }} defaultValue="krv_live_sk_xxxxxxxxxxxxxxxxxxx" />
            <button onClick={() => setShowKey(v => !v)} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: B.ink3, fontSize: 12,
            }}>{showKey ? '🙈' : '👁'}</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <FieldRow label="Última sincronización">
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: B.ink3, padding: '9px 0' }}>Hoy, 14:32</div>
          </FieldRow>
          <FieldRow label="Frecuencia">
            <select style={iStyle} value={syncFreq} onChange={e => setSyncFreq(e.target.value)}>
              <option value="15min">Cada 15 min</option>
              <option value="30min">Cada 30 min</option>
              <option value="1hr">Cada 1 hora</option>
            </select>
          </FieldRow>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={testConnection} style={{
            padding: '8px 16px', borderRadius: 8, border: `1px solid ${B.hairline}`,
            background: B.surface, color: B.ink2, fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {testState === 'loading' ? '⏳ Probando…' : testState === 'ok' ? '✓ Conexión OK' : testState === 'fail' ? '✗ Sin conexión' : 'Probar conexión'}
          </button>
        </div>
      </div>

      {/* Supabase */}
      <div style={{ background: B.surface2, border: `1px solid ${B.hairline}`, borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 600, color: B.ink }}>Supabase</span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, fontWeight: 700, color: B.green, background: B.green + '18', padding: '3px 9px', borderRadius: 99 }}>CONECTADO</span>
        </div>
        <FieldRow label="Project URL">
          <input style={{ ...iStyle, color: B.ink3 }} readOnly defaultValue="https://xxxxxxxxxxxx.supabase.co" />
        </FieldRow>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2 }}>Entorno:</span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, fontWeight: 700, color: B.blue, background: B.blueSoft, padding: '3px 9px', borderRadius: 99 }}>Producción</span>
        </div>
      </div>
    </SectionCard>
  )
}

// ─── Section 4 — Notificaciones y Alertas ────────────────────────────────────
function Section4({ onSave }: { onSave: () => void }) {
  const [emailOn, setEmailOn]   = useState(true)
  const [inAppOn, setInAppOn]   = useState(true)
  const [critRoles,  setCritRoles]  = useState(['Administrador', 'Gerencia'])
  const [servRoles,  setServRoles]  = useState(['Administrador', 'Mecánico'])
  const [docRoles,   setDocRoles]   = useState(['Administrador', 'Operador'])

  function toggleRole(list: string[], setter: (v: string[]) => void, role: string) {
    setter(list.includes(role) ? list.filter(r => r !== role) : [...list, role])
  }

  function RolePills({ selected, onToggle }: { selected: string[]; onToggle: (r: string) => void }) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {ROLE_OPTIONS.map(r => (
          <button key={r} onClick={() => onToggle(r)} style={{
            padding: '4px 11px', borderRadius: 99, cursor: 'pointer', border: 'none',
            background: selected.includes(r) ? B.ink : B.surface2,
            color: selected.includes(r) ? '#fff' : B.ink3,
            fontFamily: 'var(--font-dm-mono)', fontSize: 10,
            fontWeight: selected.includes(r) ? 600 : 400,
          }}>{r}</button>
        ))}
      </div>
    )
  }

  return (
    <SectionCard
      title="Notificaciones y Alertas"
      accent={B.rose}
      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>}
      onSave={onSave}
    >
      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: B.ink2, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Umbrales de alerta</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Aviso servicio (km antes)',    key: 'serviceKm',   unit: 'km',  def: '500'  },
          { label: 'Aviso servicio (días antes)',  key: 'serviceDays', unit: 'días',def: '14'   },
          { label: 'Vencimiento documentos',       key: 'docDays',     unit: 'días',def: '30'   },
          { label: 'GPS offline después de',       key: 'gpsMins',     unit: 'hs',  def: '2'    },
        ].map(f => (
          <FieldRow key={f.key} label={f.label}>
            <div style={{ position: 'relative' }}>
              <input type="number" style={{ ...iStyle, paddingRight: 38 }} defaultValue={f.def} />
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3 }}>{f.unit}</span>
            </div>
          </FieldRow>
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: B.ink2, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Canales</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Notificaciones por email',   on: emailOn, set: setEmailOn },
          { label: 'Notificaciones en la app',   on: inAppOn, set: setInAppOn },
        ].map(c => (
          <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: B.surface2, border: `1px solid ${B.hairline}`, borderRadius: 9 }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink }}>{c.label}</span>
            <Toggle on={c.on} onChange={c.set} />
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: B.ink2, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Destinatarios por tipo</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { label: 'Alertas críticas',      selected: critRoles, setter: setCritRoles },
          { label: 'Alertas de servicio',   selected: servRoles, setter: setServRoles },
          { label: 'Vencimiento docs',      selected: docRoles,  setter: setDocRoles  },
        ].map(row => (
          <div key={row.label}>
            <FL>{row.label}</FL>
            <RolePills selected={row.selected} onToggle={r => toggleRole(row.selected, row.setter, r)} />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ─── Section 5 — Flota y Operaciones ─────────────────────────────────────────
function Section5({ onSave }: { onSave: () => void }) {
  const [categories, setCategories] = useState(VEHICLE_CATEGORIES)
  const [editingCat, setEditingCat] = useState<number | null>(null)
  const [catDraft, setCatDraft] = useState(VEHICLE_CATEGORIES[0])
  const [inspSettings, setInspSettings] = useState({
    requireSig: true, minPhotos: 2, autoTicket: true, autoOOS: true,
  })

  return (
    <SectionCard
      title="Flota y Operaciones"
      accent={B.lilac}
      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>}
      onSave={onSave}
    >
      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: B.ink2, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categorías de vehículos</div>
      <div style={{ border: `1px solid ${B.hairline}`, borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: B.surface2 }}>
              {['Categoría', 'Descripción', 'Tarifa/día', ''].map(h => (
                <th key={h} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, fontWeight: 600, textAlign: 'left', padding: '8px 12px', borderBottom: `1px solid ${B.hairline}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              editingCat === i ? (
                <tr key={i} style={{ background: B.amberSoft }}>
                  <td style={{ padding: '8px 10px' }}><input style={{ ...iStyle, padding: '5px 8px' }} value={catDraft.name} onChange={e => setCatDraft(p => ({ ...p, name: e.target.value }))} /></td>
                  <td style={{ padding: '8px 10px' }}><input style={{ ...iStyle, padding: '5px 8px' }} value={catDraft.desc} onChange={e => setCatDraft(p => ({ ...p, desc: e.target.value }))} /></td>
                  <td style={{ padding: '8px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3 }}>$</span>
                      <input style={{ ...iStyle, padding: '5px 8px', width: 70 }} value={catDraft.rate} onChange={e => setCatDraft(p => ({ ...p, rate: e.target.value }))} />
                    </div>
                  </td>
                  <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                    <button onClick={() => { setCategories(c => c.map((x,j) => j===i ? catDraft : x)); setEditingCat(null) }} style={{ marginRight: 4, padding: '4px 10px', borderRadius: 6, background: B.ink, color: '#fff', border: 'none', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>OK</button>
                    <button onClick={() => setEditingCat(null)} style={{ padding: '4px 8px', borderRadius: 6, background: 'transparent', color: B.ink3, border: `1px solid ${B.hairline}`, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-inter)' }}>✕</button>
                  </td>
                </tr>
              ) : (
                <tr key={i} style={{ borderBottom: `1px solid ${B.hairline}` }}>
                  <td style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.ink, padding: '9px 12px' }}>{cat.name}</td>
                  <td style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2, padding: '9px 12px' }}>{cat.desc}</td>
                  <td style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: B.ink2, padding: '9px 12px', whiteSpace: 'nowrap' }}>$ {cat.rate}</td>
                  <td style={{ padding: '9px 10px' }}>
                    <button onClick={() => { setEditingCat(i); setCatDraft({ ...cat }) }} style={{ padding: '4px 10px', borderRadius: 6, background: 'transparent', color: B.ink3, border: `1px solid ${B.hairline}`, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-inter)' }}>Editar</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: B.ink2, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Configuración de inspecciones</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: 'Requerir firma del cliente', key: 'requireSig', type: 'toggle' as const },
          { label: 'Crear ticket automático en daño mayor', key: 'autoTicket', type: 'toggle' as const },
          { label: 'Pasar a Fuera de Servicio en daño mayor', key: 'autoOOS', type: 'toggle' as const },
        ].map(f => (
          <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: B.surface2, border: `1px solid ${B.hairline}`, borderRadius: 9 }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink }}>{f.label}</span>
            <Toggle on={inspSettings[f.key as keyof typeof inspSettings] as boolean} onChange={v => setInspSettings(p => ({ ...p, [f.key]: v }))} />
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: B.surface2, border: `1px solid ${B.hairline}`, borderRadius: 9 }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink }}>Fotos mínimas por zona dañada</span>
          <input
            type="number" min={1} max={8}
            value={inspSettings.minPhotos}
            onChange={e => setInspSettings(p => ({ ...p, minPhotos: Number(e.target.value) }))}
            style={{ width: 60, padding: '6px 10px', background: B.surface, border: `1px solid ${B.ink4}`, borderRadius: 7, fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, outline: 'none', textAlign: 'center' }}
          />
        </div>
      </div>
    </SectionCard>
  )
}

// ─── Section 6 — Sistema ──────────────────────────────────────────────────────
function Section6({ onSave }: { onSave: () => void }) {
  const [clearConfirm, setClearConfirm] = useState(false)
  const [clearDone, setClearDone] = useState(false)

  return (
    <SectionCard
      title="Sistema"
      accent={B.ink3}
      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>}
      onSave={onSave}
    >
      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: B.ink2, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Información del sistema</div>
      <div style={{ border: `1px solid ${B.hairline}`, borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
        {[
          ['Versión',       'MovOS v1.0'],
          ['Último deploy', '18 mayo 2025 · 11:24'],
          ['Base de datos', 'Supabase PostgreSQL'],
          ['Storage',       'Supabase Storage'],
          ['Hosting',       'Vercel'],
          ['Framework',     'Next.js 14 (App Router)'],
        ].map(([k, v], i) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 14px', borderBottom: i < 5 ? `1px solid ${B.hairline}` : 'none',
            background: i % 2 === 0 ? 'transparent' : B.surface2,
          }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3 }}>{k}</span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div style={{ border: `1px solid ${B.rose}44`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ background: B.rose + '0d', padding: '10px 14px', borderBottom: `1px solid ${B.rose}33` }}>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 700, color: B.rose }}>⚠ Zona peligrosa</span>
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink }}>Exportar todos los datos</div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3, marginTop: 2 }}>Descarga un archivo ZIP con toda la base de datos</div>
            </div>
            <button style={{
              padding: '7px 14px', borderRadius: 8, background: 'transparent',
              border: `1px solid ${B.ink4}`, color: B.ink2, cursor: 'pointer',
              fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportar
            </button>
          </div>

          <div style={{ borderTop: `1px solid ${B.rose}22`, paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: clearConfirm ? 12 : 0 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.rose }}>Limpiar datos de prueba</div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3, marginTop: 2 }}>Elimina registros marcados como demo</div>
              </div>
              {!clearConfirm && !clearDone && (
                <button onClick={() => setClearConfirm(true)} style={{
                  padding: '7px 14px', borderRadius: 8, background: B.rose + '18',
                  border: `1px solid ${B.rose}44`, color: B.rose, cursor: 'pointer',
                  fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600,
                }}>Limpiar</button>
              )}
              {clearDone && <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.green }}>✓ Limpiado</span>}
            </div>
            {clearConfirm && !clearDone && (
              <div style={{ background: B.rose + '0d', border: `1px solid ${B.rose}33`, borderRadius: 9, padding: '12px 14px' }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.rose, marginBottom: 10 }}>
                  ¿Confirmar? Esta acción no se puede deshacer.
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setClearConfirm(false); setClearDone(true) }} style={{
                    padding: '7px 16px', borderRadius: 7, background: B.rose, color: '#fff', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 700,
                  }}>Sí, limpiar</button>
                  <button onClick={() => setClearConfirm(false)} style={{
                    padding: '7px 14px', borderRadius: 7, background: 'transparent', color: B.ink2, border: `1px solid ${B.hairline}`, cursor: 'pointer',
                    fontFamily: 'var(--font-inter)', fontSize: 12,
                  }}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

// ─── Section Vendors ─────────────────────────────────────────────────────────
const V_DATA = [
  { id: 1, name: 'AutoPartes Uruguay',   branch: 'Pocitos',        category: 'Frenos',      contact: 'Roberto Silva',  phone: '+598 99 234 567', email: 'rsilva@autopartes.uy',   orders: 3, active: true  },
  { id: 2, name: 'NeumáticosUY',        branch: 'Centro',         category: 'Neumáticos',  contact: 'María Fuentes',  phone: '+598 98 345 678', email: 'mfuentes@neumaticos.uy', orders: 1, active: true  },
  { id: 3, name: 'Electro-Auto',        branch: 'Punta del Este', category: 'Eléctrico',   contact: 'Juan Méndez',    phone: '+598 97 456 789', email: 'jmendez@electroauto.uy', orders: 0, active: true  },
  { id: 4, name: 'Carrocería Ideal',    branch: 'Pocitos',        category: 'Carrocería',  contact: 'Ana Torres',     phone: '+598 96 567 890', email: 'atorres@carroceria.uy',  orders: 2, active: true  },
  { id: 5, name: 'Lubricantes del Sur', branch: 'Colonia',        category: 'Lubricantes', contact: 'Pedro Gómez',    phone: '+598 95 678 901', email: 'pgomez@lubricantes.uy',  orders: 0, active: true  },
  { id: 6, name: 'Filtros & Más',       branch: 'Centro',         category: 'Filtros',     contact: 'Carmen López',   phone: '+598 94 789 012', email: 'clopez@filtros.uy',      orders: 1, active: true  },
  { id: 7, name: 'Suspensiones Pro',    branch: 'Pocitos',        category: 'Suspensión',  contact: 'Diego Martínez', phone: '+598 93 890 123', email: 'dmartinez@suspro.uy',    orders: 0, active: false },
  { id: 8, name: 'Auto Total',          branch: 'Punta del Este', category: 'Otros',       contact: 'Laura Díaz',     phone: '+598 92 901 234', email: 'ldiaz@autototal.uy',     orders: 0, active: true  },
]

const V_ACTIVE_ORDERS = [
  { unit: 'ABC-1234', part: 'Pastillas de freno',  qty: 4, urgency: 'Alta',   status: 'En camino',  date: '15 may' },
  { unit: 'XYZ-5678', part: 'Filtro de aceite',    qty: 2, urgency: 'Normal', status: 'Pendiente',  date: '16 may' },
  { unit: 'DEF-9012', part: 'Kit frenos traseros', qty: 1, urgency: 'Alta',   status: 'Confirmado', date: '14 may' },
]

const V_HISTORY = [
  { date: '10 may', parts: 'Pastillas × 8',       total: '$4,200', ticket: 'TK-0234', status: 'Entregado' },
  { date: '02 may', parts: 'Kit frenos × 2',       total: '$2,800', ticket: 'TK-0198', status: 'Entregado' },
  { date: '24 abr', parts: 'Discos traseros × 4', total: '$5,600', ticket: 'TK-0172', status: 'Entregado' },
  { date: '15 abr', parts: 'Pastillas × 4',        total: '$2,100', ticket: 'TK-0154', status: 'Entregado' },
  { date: '08 abr', parts: 'Kit completo',          total: '$9,400', ticket: 'TK-0139', status: 'Entregado' },
]

const CAT_CLR: Record<string, string> = {
  Filtros: B.ink3, Frenos: B.rose, Neumáticos: B.blue, Eléctrico: B.amber,
  Carrocería: B.lilac, Lubricantes: B.green, Suspensión: B.sky, Otros: B.ochre,
}

type VendorRow = typeof V_DATA[0]

function SectionVendors({ onSave }: { onSave: () => void }) {
  const [vendors, setVendors] = useState(V_DATA)
  const [search, setSearch]   = useState('')
  const [branchF, setBranchF] = useState('Todas')
  const [catF, setCatF]       = useState('Todas')
  const [showAdd, setShowAdd] = useState(false)
  const [detail, setDetail]   = useState<VendorRow | null>(null)
  const [newV, setNewV] = useState({ name: '', branches: [] as string[], category: 'Frenos', contact: '', phone: '', email: '', address: '', notes: '', active: true })

  const BRANCHES = ['Pocitos', 'Centro', 'Punta del Este', 'Colonia']
  const CATS = ['Filtros', 'Frenos', 'Neumáticos', 'Eléctrico', 'Carrocería', 'Lubricantes', 'Suspensión', 'Otros']

  const filtered = vendors.filter(v =>
    (branchF === 'Todas' || v.branch === branchF) &&
    (catF === 'Todas' || v.category === catF) &&
    (!search || v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()))
  )

  const totalActive = vendors.filter(v => v.active).length
  const totalOrders = vendors.reduce((s, v) => s + v.orders, 0)
  const topBranch = BRANCHES.reduce((a, b) =>
    vendors.filter(v => v.branch === b).length > vendors.filter(v => v.branch === a).length ? b : a, BRANCHES[0])

  function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <button onClick={onClick} style={{
        padding: '5px 12px', borderRadius: 99, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
        background: active ? B.ink : B.surface2, color: active ? '#fff' : B.ink2,
        fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: active ? 600 : 400,
      }}>{label}</button>
    )
  }

  return (
    <SectionCard
      title="Directorio de Vendors"
      accent={B.amber}
      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
      onSave={onSave}
    >
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, margin: '-10px 0 16px' }}>Proveedores de repuestos por sucursal</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 18 }}>
        {[
          { label: 'Total vendors',   value: String(vendors.length), color: B.amber },
          { label: 'Activos',         value: String(totalActive),    color: B.green },
          { label: 'Top sucursal',    value: topBranch,              color: B.blue  },
          { label: 'Pedidos activos', value: String(totalOrders),    color: B.rose  },
        ].map(s => (
          <div key={s.label} style={{ background: B.surface2, border: `1px solid ${B.hairline}`, borderTop: `2px solid ${s.color}`, borderRadius: 10, padding: '10px 10px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 20, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {['Todas', ...BRANCHES].map(b => <Pill key={b} label={b} active={branchF === b} onClick={() => setBranchF(b)} />)}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {['Todas', ...CATS].map(c => <Pill key={c} label={c} active={catF === c} onClick={() => setCatF(c)} />)}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar nombre o tipo de repuesto…" style={{ ...iStyle, flex: 1 }} />
        <button onClick={() => setShowAdd(true)} style={{ padding: '9px 16px', borderRadius: 8, background: B.amber, color: '#fff', border: 'none', fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Agregar vendor</button>
      </div>

      <div style={{ border: `1px solid ${B.hairline}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: B.surface2 }}>
                {['Nombre', 'Sucursal', 'Categoría', 'Contacto', 'Teléfono', 'Pedidos', 'Acciones'].map(h => (
                  <th key={h} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, fontWeight: 600, textAlign: 'left', padding: '8px 12px', borderBottom: `1px solid ${B.hairline}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={v.id} style={{ borderBottom: `1px solid ${B.hairline}`, background: i % 2 === 0 ? 'transparent' : B.surface2, opacity: v.active ? 1 : 0.5 }}>
                  <td style={{ padding: '9px 12px' }}>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.ink }}>{v.name}</div>
                    {!v.active && <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink4 }}>Inactivo</span>}
                  </td>
                  <td style={{ padding: '9px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2 }}>{v.branch}</td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, fontWeight: 600, color: CAT_CLR[v.category] ?? B.ink3, background: (CAT_CLR[v.category] ?? B.ink3) + '18', padding: '2px 7px', borderRadius: 4 }}>{v.category}</span>
                  </td>
                  <td style={{ padding: '9px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2 }}>{v.contact}</td>
                  <td style={{ padding: '9px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3, whiteSpace: 'nowrap' }}>{v.phone}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                    {v.orders > 0 ? <span style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 18, color: B.rose }}>{v.orders}</span> : <span style={{ color: B.ink4 }}>—</span>}
                  </td>
                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {([['Ver', B.blue], ['Editar', B.ink3], ['Pedido', B.green]] as [string, string][]).map(([lbl, clr]) => (
                        <button key={lbl} onClick={() => lbl === 'Ver' && setDetail(v)} style={{ padding: '3px 8px', borderRadius: 5, border: 'none', cursor: 'pointer', background: clr + '18', color: clr, fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 600 }}>{lbl}</button>
                      ))}
                      <button onClick={() => setVendors(p => p.map(x => x.id === v.id ? { ...x, active: !x.active } : x))} style={{ padding: '3px 8px', borderRadius: 5, border: 'none', cursor: 'pointer', background: B.rose + '18', color: B.rose, fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 600 }}>
                        {v.active ? 'Desact.' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,23,38,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: B.surface, borderRadius: B.radiusLg, maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: B.shadowLg }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${B.hairline}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 16, fontWeight: 700, color: B.ink, margin: 0 }}>Agregar Vendor</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: B.ink3, fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1/-1' }}><FieldRow label="Nombre del proveedor *"><input style={iStyle} value={newV.name} onChange={e => setNewV(p => ({ ...p, name: e.target.value }))} placeholder="Nombre comercial" /></FieldRow></div>
                <div style={{ gridColumn: '1/-1' }}>
                  <FL>Sucursal(es) *</FL>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {BRANCHES.map(b => (
                      <button key={b} onClick={() => setNewV(p => ({ ...p, branches: p.branches.includes(b) ? p.branches.filter(x => x !== b) : [...p.branches, b] }))} style={{ padding: '5px 12px', borderRadius: 99, cursor: 'pointer', border: 'none', background: newV.branches.includes(b) ? B.ink : B.surface2, color: newV.branches.includes(b) ? '#fff' : B.ink2, fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: newV.branches.includes(b) ? 600 : 400 }}>{b}</button>
                    ))}
                  </div>
                </div>
                <FieldRow label="Categoría *"><select style={iStyle} value={newV.category} onChange={e => setNewV(p => ({ ...p, category: e.target.value }))}>{CATS.map(c => <option key={c}>{c}</option>)}</select></FieldRow>
                <FieldRow label="Contacto principal *"><input style={iStyle} value={newV.contact} onChange={e => setNewV(p => ({ ...p, contact: e.target.value }))} /></FieldRow>
                <FieldRow label="Teléfono *"><input style={iStyle} value={newV.phone} onChange={e => setNewV(p => ({ ...p, phone: e.target.value }))} placeholder="+598 99…" /></FieldRow>
                <FieldRow label="Email"><input style={iStyle} value={newV.email} onChange={e => setNewV(p => ({ ...p, email: e.target.value }))} /></FieldRow>
                <div style={{ gridColumn: '1/-1' }}><FieldRow label="Dirección"><input style={iStyle} value={newV.address} onChange={e => setNewV(p => ({ ...p, address: e.target.value }))} /></FieldRow></div>
                <div style={{ gridColumn: '1/-1' }}><FieldRow label="Notas"><textarea rows={2} style={{ ...iStyle, resize: 'none' }} value={newV.notes} onChange={e => setNewV(p => ({ ...p, notes: e.target.value }))} /></FieldRow></div>
                <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink }}>Activo</span>
                  <Toggle on={newV.active} onChange={v => setNewV(p => ({ ...p, active: v }))} />
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 24px', borderTop: `1px solid ${B.hairline}`, display: 'flex', gap: 8 }}>
              <button onClick={() => { setVendors(p => [...p, { id: Date.now(), branch: newV.branches[0] ?? 'Pocitos', ...newV, orders: 0 }]); setShowAdd(false) }} style={{ padding: '10px 24px', borderRadius: 8, background: B.amber, color: '#fff', border: 'none', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>GUARDAR VENDOR</button>
              <button onClick={() => setShowAdd(false)} style={{ padding: '10px 16px', borderRadius: 8, background: 'transparent', color: B.ink3, border: `1px solid ${B.hairline}`, fontFamily: 'var(--font-inter)', fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,23,38,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setDetail(null)}>
          <div style={{ background: B.surface, borderRadius: B.radiusLg, maxWidth: 720, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: B.shadowLg }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${B.hairline}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 17, fontWeight: 700, color: B.ink, margin: 0 }}>{detail.name}</h3>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, fontWeight: 700, color: CAT_CLR[detail.category] ?? B.ink3, background: (CAT_CLR[detail.category] ?? B.ink3) + '18', padding: '2px 8px', borderRadius: 4 }}>{detail.category}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: B.ink3, marginTop: 4 }}>{detail.branch} · {detail.phone} · {detail.email}</div>
              </div>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: B.ink3, fontSize: 20 }}>✕</button>
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.ink, marginBottom: 10 }}>Pedidos activos</div>
              <div style={{ border: `1px solid ${B.hairline}`, borderRadius: 10, overflow: 'hidden', marginBottom: 22 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: B.surface2 }}>{['Unidad','Parte','Cant.','Urgencia','Estado','Fecha'].map(h => <th key={h} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, fontWeight: 600, textAlign: 'left', padding: '7px 12px', borderBottom: `1px solid ${B.hairline}` }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {V_ACTIVE_ORDERS.map((o, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${B.hairline}` }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2, fontWeight: 600 }}>{o.unit}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink }}>{o.part}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2, textAlign: 'center' }}>{o.qty}</td>
                        <td style={{ padding: '8px 12px' }}><span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: o.urgency === 'Alta' ? B.rose : B.ink3, background: (o.urgency === 'Alta' ? B.rose : B.ink3) + '18', padding: '2px 6px', borderRadius: 4 }}>{o.urgency}</span></td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2 }}>{o.status}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3 }}>{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.ink, marginBottom: 10 }}>Historial de pedidos</div>
              <div style={{ border: `1px solid ${B.hairline}`, borderRadius: 10, overflow: 'hidden', marginBottom: 18 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: B.surface2 }}>{['Fecha','Repuestos','Total','Ticket','Estado'].map(h => <th key={h} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, fontWeight: 600, textAlign: 'left', padding: '7px 12px', borderBottom: `1px solid ${B.hairline}` }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {V_HISTORY.map((h, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${B.hairline}`, background: i % 2 === 0 ? 'transparent' : B.surface2 }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3 }}>{h.date}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink }}>{h.parts}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2, fontWeight: 600 }}>{h.total}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.blue }}>{h.ticket}</td>
                        <td style={{ padding: '8px 12px' }}><span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.green, background: B.greenSoft, padding: '2px 6px', borderRadius: 4 }}>{h.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button style={{ padding: '10px 22px', borderRadius: 8, background: B.amber, color: '#fff', border: 'none', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Nuevo pedido</button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

// ─── Section Talleres ─────────────────────────────────────────────────────────
const T_DATA = [
  { id: 1, name: 'Taller Central MovOS', type: 'Interno',           branch: 'Centro',        specialty: 'Mecánica general',     current: 3, avgDays: 3.2, contact: 'Ing. Roberto P.', phone: '+598 2900 1001', active: true  },
  { id: 2, name: 'Toyota Dealer UY',     type: 'Dealer Autorizado', branch: 'Pocitos',        specialty: 'Toyota / Lexus',        current: 2, avgDays: 5.1, contact: 'Carlos M.',        phone: '+598 2710 2002', active: true  },
  { id: 3, name: 'Electro-Mec',          type: 'Especialista',      branch: 'Punta del Este', specialty: 'Eléctrico / Híbrido',   current: 1, avgDays: 6.8, contact: 'Ana R.',           phone: '+598 4244 3003', active: true  },
  { id: 4, name: 'Móvil Express',        type: 'Mecánico Móvil',    branch: 'Todas',          specialty: 'Diagnóstico / Auxilio', current: 0, avgDays: 0.5, contact: 'Miguel T.',        phone: '+598 99 100 200', active: true  },
  { id: 5, name: 'Ford Service UY',      type: 'Dealer Autorizado', branch: 'Colonia',        specialty: 'Ford / Lincoln',        current: 0, avgDays: 4.5, contact: 'Laura F.',         phone: '+598 4522 5005', active: true  },
  { id: 6, name: 'Taller Norte',         type: 'Interno',           branch: 'Pocitos',        specialty: 'Mecánica / Planchado',  current: 0, avgDays: 2.8, contact: 'Pedro G.',         phone: '+598 2710 6006', active: false },
]

const T_CURRENT_VEHICLES = [
  { unit: 'ABC-1234', model: 'Toyota Hilux',    ticket: 'TK-0291', stage: 'En reparación',  days: 3, cost: '$6,200' },
  { unit: 'GHI-3456', model: 'Mitsubishi L200', ticket: 'TK-0285', stage: 'En diagnóstico', days: 1, cost: 'TBD'    },
  { unit: 'JKL-7890', model: 'Nissan Frontier',  ticket: 'TK-0280', stage: 'Control calidad',days: 5, cost: '$4,800' },
]

const T_HISTORY = [
  { date: '05 may', unit: 'XYZ-5678', issue: 'Frenos traseros',       days: 4, cost: '$3,800',  result: 'Resuelto' },
  { date: '28 abr', unit: 'MNO-1234', issue: 'Motor / Distribución',  days: 7, cost: '$12,500', result: 'Resuelto' },
  { date: '20 abr', unit: 'PQR-5678', issue: 'Transmisión manual',    days: 5, cost: '$8,200',  result: 'Resuelto' },
  { date: '12 abr', unit: 'STU-9012', issue: 'Sistema eléctrico',     days: 3, cost: '$2,400',  result: 'Resuelto' },
  { date: '04 abr', unit: 'VWX-3456', issue: 'Suspensión delantera',  days: 2, cost: '$3,100',  result: 'Resuelto' },
]

const TYPE_CLR: Record<string, string> = {
  'Interno': B.amber, 'Dealer Autorizado': B.blue, 'Especialista': B.lilac, 'Mecánico Móvil': B.green,
}

type TallerRow = typeof T_DATA[0]

function SectionTalleres({ onSave }: { onSave: () => void }) {
  const [providers, setProviders] = useState(T_DATA)
  const [branchF, setBranchF]     = useState('Todas')
  const [typeF, setTypeF]         = useState('Todos')
  const [showAdd, setShowAdd]     = useState(false)
  const [detail, setDetail]       = useState<TallerRow | null>(null)
  const [newT, setNewT] = useState({ name: '', type: 'Interno', branches: [] as string[], specialty: '', contact: '', phone: '', email: '', address: '', avgDays: '', notes: '', active: true })

  const BRANCHES = ['Pocitos', 'Centro', 'Punta del Este', 'Colonia']
  const TYPES    = ['Interno', 'Dealer Autorizado', 'Especialista', 'Mecánico Móvil']

  const filtered = providers.filter(p =>
    (branchF === 'Todas' || p.branch === branchF || p.branch === 'Todas') &&
    (typeF === 'Todos' || p.type === typeF)
  )

  const totalCurrent = providers.reduce((s, p) => s + p.current, 0)
  const avgDaysAll   = (providers.reduce((s, p) => s + p.avgDays, 0) / providers.length).toFixed(1)

  function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <button onClick={onClick} style={{
        padding: '5px 12px', borderRadius: 99, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
        background: active ? B.ink : B.surface2, color: active ? '#fff' : B.ink2,
        fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: active ? 600 : 400,
      }}>{label}</button>
    )
  }

  return (
    <SectionCard
      title="Talleres y Servicios"
      accent={B.lilac}
      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></svg>}
      onSave={onSave}
    >
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, margin: '-10px 0 16px' }}>Dealers autorizados, talleres internos y especialistas</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 18 }}>
        {[
          { label: 'Total talleres',     value: String(providers.length), color: B.amber },
          { label: 'En taller ahora',    value: String(totalCurrent),     color: B.rose  },
          { label: 'Tiempo promedio',    value: avgDaysAll + ' d',        color: B.blue  },
          { label: 'Costo prom./ticket', value: '$8,450',                 color: B.amber },
        ].map(s => (
          <div key={s.label} style={{ background: B.surface2, border: `1px solid ${B.hairline}`, borderTop: `2px solid ${s.color}`, borderRadius: 10, padding: '10px 10px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 20, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {['Todas', ...BRANCHES].map(b => <Pill key={b} label={b} active={branchF === b} onClick={() => setBranchF(b)} />)}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {['Todos', ...TYPES].map(t => <Pill key={t} label={t} active={typeF === t} onClick={() => setTypeF(t)} />)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button onClick={() => setShowAdd(true)} style={{ padding: '9px 16px', borderRadius: 8, background: B.lilac, color: '#fff', border: 'none', fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Agregar taller</button>
      </div>

      <div style={{ border: `1px solid ${B.hairline}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ background: B.surface2 }}>
                {['Nombre','Tipo','Sucursal','Especialidad','Actuales','t̄ días','Contacto','Acciones'].map(h => (
                  <th key={h} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, fontWeight: 600, textAlign: 'left', padding: '8px 10px', borderBottom: `1px solid ${B.hairline}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${B.hairline}`, background: i % 2 === 0 ? 'transparent' : B.surface2, opacity: p.active ? 1 : 0.5 }}>
                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: 600, color: B.ink }}>{p.name}</div>
                    {!p.active && <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink4 }}>Inactivo</span>}
                  </td>
                  <td style={{ padding: '9px 10px' }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, fontWeight: 600, color: TYPE_CLR[p.type] ?? B.ink3, background: (TYPE_CLR[p.type] ?? B.ink3) + '18', padding: '2px 7px', borderRadius: 4, whiteSpace: 'nowrap' }}>{p.type}</span>
                  </td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2 }}>{p.branch}</td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink2 }}>{p.specialty}</td>
                  <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                    {p.current > 0 ? <span style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 18, color: B.rose }}>{p.current}</span> : <span style={{ color: B.ink4 }}>—</span>}
                  </td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2, textAlign: 'center' }}>{p.avgDays}</td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3 }}>{p.contact}</td>
                  <td style={{ padding: '9px 8px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {([['Ver', B.blue], ['Editar', B.ink3], ['Vehículos', B.green]] as [string,string][]).map(([lbl, clr]) => (
                        <button key={lbl} onClick={() => lbl === 'Ver' && setDetail(p)} style={{ padding: '3px 7px', borderRadius: 5, border: 'none', cursor: 'pointer', background: clr + '18', color: clr, fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 600 }}>{lbl}</button>
                      ))}
                      <button onClick={() => setProviders(prev => prev.map(x => x.id === p.id ? { ...x, active: !x.active } : x))} style={{ padding: '3px 7px', borderRadius: 5, border: 'none', cursor: 'pointer', background: B.rose + '18', color: B.rose, fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 600 }}>
                        {p.active ? 'Desact.' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,23,38,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: B.surface, borderRadius: B.radiusLg, maxWidth: 580, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: B.shadowLg }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${B.hairline}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 16, fontWeight: 700, color: B.ink, margin: 0 }}>Agregar Taller</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: B.ink3, fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1/-1' }}><FieldRow label="Nombre *"><input style={iStyle} value={newT.name} onChange={e => setNewT(p => ({ ...p, name: e.target.value }))} placeholder="Nombre del taller" /></FieldRow></div>
                <FieldRow label="Tipo *"><select style={iStyle} value={newT.type} onChange={e => setNewT(p => ({ ...p, type: e.target.value }))}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></FieldRow>
                <FieldRow label="Especialidad / marcas *"><input style={iStyle} value={newT.specialty} onChange={e => setNewT(p => ({ ...p, specialty: e.target.value }))} placeholder="Toyota, Eléctrico…" /></FieldRow>
                <div style={{ gridColumn: '1/-1' }}>
                  <FL>Sucursal(es) que atiende *</FL>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[...BRANCHES, 'Todas'].map(b => (
                      <button key={b} onClick={() => setNewT(p => ({ ...p, branches: p.branches.includes(b) ? p.branches.filter(x => x !== b) : [...p.branches, b] }))} style={{ padding: '5px 12px', borderRadius: 99, cursor: 'pointer', border: 'none', background: newT.branches.includes(b) ? B.ink : B.surface2, color: newT.branches.includes(b) ? '#fff' : B.ink2, fontFamily: 'var(--font-inter)', fontSize: 12, fontWeight: newT.branches.includes(b) ? 600 : 400 }}>{b}</button>
                    ))}
                  </div>
                </div>
                <FieldRow label="Contacto principal *"><input style={iStyle} value={newT.contact} onChange={e => setNewT(p => ({ ...p, contact: e.target.value }))} /></FieldRow>
                <FieldRow label="Teléfono *"><input style={iStyle} value={newT.phone} onChange={e => setNewT(p => ({ ...p, phone: e.target.value }))} /></FieldRow>
                <FieldRow label="Email"><input style={iStyle} value={newT.email} onChange={e => setNewT(p => ({ ...p, email: e.target.value }))} /></FieldRow>
                <FieldRow label="Tiempo prom. (días)"><input type="number" style={iStyle} value={newT.avgDays} onChange={e => setNewT(p => ({ ...p, avgDays: e.target.value }))} placeholder="4.5" /></FieldRow>
                <div style={{ gridColumn: '1/-1' }}><FieldRow label="Dirección"><input style={iStyle} value={newT.address} onChange={e => setNewT(p => ({ ...p, address: e.target.value }))} /></FieldRow></div>
                <div style={{ gridColumn: '1/-1' }}><FieldRow label="Notas"><textarea rows={2} style={{ ...iStyle, resize: 'none' }} value={newT.notes} onChange={e => setNewT(p => ({ ...p, notes: e.target.value }))} /></FieldRow></div>
                <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink }}>Activo</span>
                  <Toggle on={newT.active} onChange={v => setNewT(p => ({ ...p, active: v }))} />
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 24px', borderTop: `1px solid ${B.hairline}`, display: 'flex', gap: 8 }}>
              <button onClick={() => { setProviders(p => [...p, { id: Date.now(), branch: newT.branches[0] ?? 'Pocitos', ...newT, current: 0, avgDays: parseFloat(newT.avgDays) || 0 }]); setShowAdd(false) }} style={{ padding: '10px 24px', borderRadius: 8, background: B.lilac, color: '#fff', border: 'none', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>GUARDAR TALLER</button>
              <button onClick={() => setShowAdd(false)} style={{ padding: '10px 16px', borderRadius: 8, background: 'transparent', color: B.ink3, border: `1px solid ${B.hairline}`, fontFamily: 'var(--font-inter)', fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,23,38,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setDetail(null)}>
          <div style={{ background: B.surface, borderRadius: B.radiusLg, maxWidth: 760, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: B.shadowLg }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${B.hairline}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: 17, fontWeight: 700, color: B.ink, margin: 0 }}>{detail.name}</h3>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, fontWeight: 700, color: TYPE_CLR[detail.type] ?? B.ink3, background: (TYPE_CLR[detail.type] ?? B.ink3) + '18', padding: '3px 10px', borderRadius: 6 }}>{detail.type}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: B.ink3 }}>{detail.branch} · {detail.specialty} · {detail.phone}</div>
              </div>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: B.ink3, fontSize: 20 }}>✕</button>
            </div>
            <div style={{ padding: '18px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 22 }}>
                {[
                  { label: 'Tiempo promedio',    value: detail.avgDays + ' días', color: B.blue  },
                  { label: 'Ticket más largo',   value: '12 días',                color: B.rose  },
                  { label: 'Costo total proc.',  value: '$187,400',               color: B.green },
                  { label: 'Tasa de reingreso',  value: '8%',                     color: B.amber },
                ].map(m => (
                  <div key={m.label} style={{ background: B.surface2, border: `1px solid ${B.hairline}`, borderTop: `2px solid ${m.color}`, borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 20, color: m.color, lineHeight: 1 }}>{m.value}</div>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: B.ink3, marginTop: 3 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.ink, marginBottom: 10 }}>Vehículos actuales en este taller</div>
              <div style={{ border: `1px solid ${B.hairline}`, borderRadius: 10, overflow: 'hidden', marginBottom: 22 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: B.surface2 }}>{['Unidad','Modelo','Ticket','Etapa','Días','Costo est.'].map(h => <th key={h} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, fontWeight: 600, textAlign: 'left', padding: '7px 12px', borderBottom: `1px solid ${B.hairline}` }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {T_CURRENT_VEHICLES.map((v, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${B.hairline}` }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2, fontWeight: 600 }}>{v.unit}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink }}>{v.model}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.blue }}>{v.ticket}</td>
                        <td style={{ padding: '8px 12px' }}><span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.amber, background: B.amberSoft, padding: '2px 6px', borderRadius: 4 }}>{v.stage}</span></td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2, textAlign: 'center' }}>{v.days}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2, fontWeight: 600 }}>{v.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: B.ink, marginBottom: 10 }}>Historial de reparaciones</div>
              <div style={{ border: `1px solid ${B.hairline}`, borderRadius: 10, overflow: 'hidden', marginBottom: 18 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: B.surface2 }}>{['Fecha','Unidad','Problema','Días','Costo','Resultado'].map(h => <th key={h} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.ink3, fontWeight: 600, textAlign: 'left', padding: '7px 12px', borderBottom: `1px solid ${B.hairline}` }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {T_HISTORY.map((h, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${B.hairline}`, background: i % 2 === 0 ? 'transparent' : B.surface2 }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3 }}>{h.date}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2, fontWeight: 600 }}>{h.unit}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink }}>{h.issue}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2, textAlign: 'center' }}>{h.days}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink2, fontWeight: 600 }}>{h.cost}</td>
                        <td style={{ padding: '8px 12px' }}><span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: B.green, background: B.greenSoft, padding: '2px 6px', borderRadius: 4 }}>{h.result}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button style={{ padding: '10px 22px', borderRadius: 8, background: B.lilac, color: '#fff', border: 'none', fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Asignar vehículo</button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ConfiguracionPage() {
  const [toast, setToast] = useState<string | null>(null)
  const save = useCallback((section: string) => setToast(`${section} guardado correctamente`), [])

  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar active="Configuración" />

      <main className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-7 pb-24 md:pb-16">
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <h1 style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 32, fontWeight: 400, color: B.ink, margin: 0, letterSpacing: '0.01em' }}>Configuración</h1>
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 10, fontWeight: 700,
                color: B.amber, background: B.amberSoft, padding: '3px 10px', borderRadius: 99,
                letterSpacing: '0.06em',
              }}>ADMINISTRADOR</span>
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: 0 }}>
              Panel de control del sistema MovOS
            </p>
          </div>
        </div>

        {/* Sections grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section1 onSave={() => save('Empresa y sucursales')} />
          <Section2 onSave={() => save('Usuarios y roles')} />
          <Section3 onSave={() => save('Integraciones')} />
          <Section4 onSave={() => save('Notificaciones')} />
          <Section5 onSave={() => save('Flota y operaciones')} />
          <SectionVendors onSave={() => save('Proveedores')} />
          <SectionTalleres onSave={() => save('Talleres')} />
          <Section6 onSave={() => save('Sistema')} />
        </div>
      </main>

      <BentoBottomNav />

      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </div>
  )
}
