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
          <Section6 onSave={() => save('Sistema')} />
        </div>
      </main>

      <BentoBottomNav />

      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </div>
  )
}
