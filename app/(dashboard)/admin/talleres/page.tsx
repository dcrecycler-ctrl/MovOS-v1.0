'use client'

import { useState, useMemo } from 'react'
import { B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { SoftCard } from '@/components/ui/SoftCard'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'

type ProviderType = 'Interno' | 'Dealer Autorizado' | 'Especialista' | 'Mecánico Móvil'
type Branch = 'Montevideo Centro' | 'Pocitos' | 'Malvín' | 'Carrasco'

interface ServiceProvider {
  id: string
  name: string
  type: ProviderType
  branch: Branch
  speciality: string
  currentVehicles: number
  avgDays: number
  contact: string
  phone: string
  email: string
  address: string
  notes: string
}

const MOCK_TALLERES: ServiceProvider[] = [
  { id: '1', name: 'Taller Central MovOS',     type: 'Interno',          branch: 'Montevideo Centro', speciality: 'General',                currentVehicles: 4, avgDays: 2.5, contact: 'Luis Romero',     phone: '099 100 200', email: 'taller.central@movos.uy',  address: 'Av. 8 de Octubre 3250',  notes: 'Taller interno principal' },
  { id: '2', name: 'Toyota Dealer Oficial UY', type: 'Dealer Autorizado', branch: 'Pocitos',           speciality: 'Toyota',                 currentVehicles: 2, avgDays: 4.0, contact: 'Ana Pereyra',     phone: '099 200 300', email: 'servicio@toyotauy.uy',     address: 'Bv. Artigas 1580',       notes: 'Garantía de fábrica' },
  { id: '3', name: 'Taller Malvín Norte',       type: 'Interno',          branch: 'Malvín',            speciality: 'General + Frenos',       currentVehicles: 1, avgDays: 1.8, contact: 'Diego Sosa',      phone: '099 300 400', email: 'malvin@movos.uy',          address: 'Av. Italia 4500',        notes: '' },
  { id: '4', name: 'ElectroCar Especialistas',  type: 'Especialista',     branch: 'Carrasco',          speciality: 'Sistemas eléctricos',    currentVehicles: 3, avgDays: 3.2, contact: 'Pablo Castro',    phone: '099 400 500', email: 'pablo@electrocar.uy',     address: 'Giannattasio km 16',     notes: 'Solo híbridos y eléctricos' },
  { id: '5', name: 'Mecánica Rápida UY',        type: 'Mecánico Móvil',   branch: 'Montevideo Centro', speciality: 'Asistencia en ruta',     currentVehicles: 0, avgDays: 0.5, contact: 'Fernanda Ruiz',   phone: '092 500 600', email: 'fernanda@mecanica.uy',    address: 'Cobertura zona metro',   notes: 'Disponible 24/7' },
  { id: '6', name: 'Renault Service',           type: 'Dealer Autorizado', branch: 'Pocitos',           speciality: 'Renault · Dacia',        currentVehicles: 1, avgDays: 5.0, contact: 'Marco Álvarez',   phone: '099 600 700', email: 'servicio@renaultuy.uy',    address: 'Av. Luis Batlle 1200',   notes: '' },
]

const TYPE_CONFIG: Record<ProviderType, { fg: string; bg: string }> = {
  'Interno':          { fg: B.amber, bg: B.amberSoft },
  'Dealer Autorizado':{ fg: B.blue,  bg: B.blueSoft  },
  'Especialista':     { fg: B.lilac, bg: B.lilacSoft },
  'Mecánico Móvil':   { fg: B.green, bg: B.greenSoft },
}

const BRANCHES: Branch[] = ['Montevideo Centro', 'Pocitos', 'Malvín', 'Carrasco']
const TYPES: ProviderType[] = ['Interno', 'Dealer Autorizado', 'Especialista', 'Mecánico Móvil']

const inputStyle = {
  width: '100%', boxSizing: 'border-box' as const, padding: '9px 12px',
  borderRadius: 9, border: `1px solid ${B.hairline}`,
  background: B.surface2, fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, outline: 'none',
}

export default function TalleresPage() {
  const [branchFilter, setBranchFilter] = useState<Branch | 'Todos'>('Todos')
  const [typeFilter, setTypeFilter] = useState<ProviderType | 'Todos'>('Todos')
  const [showAdd, setShowAdd] = useState(false)
  const [detail, setDetail] = useState<ServiceProvider | null>(null)
  const [form, setForm] = useState({ name: '', type: TYPES[0] as ProviderType, branch: BRANCHES[0] as Branch, speciality: '', contact: '', phone: '', email: '', address: '', avgDays: '', notes: '' })
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => MOCK_TALLERES.filter(t => {
    if (branchFilter !== 'Todos' && t.branch !== branchFilter) return false
    if (typeFilter !== 'Todos' && t.type !== typeFilter) return false
    return true
  }), [branchFilter, typeFilter])

  const totalVehicles = MOCK_TALLERES.reduce((s, t) => s + t.currentVehicles, 0)
  const avgRepair     = (MOCK_TALLERES.reduce((s, t) => s + t.avgDays, 0) / MOCK_TALLERES.length).toFixed(1)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => { setSaving(false); setShowAdd(false) }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar active="Talleres" />
      <main className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-7 pb-24 md:pb-16">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Talleres y Proveedores de Servicio</h1>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: 0 }}>Dealers autorizados, talleres internos y especialistas</p>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, border: 'none', background: B.ink, color: B.surface, fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            Agregar taller
          </button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
          <SoftCard padding={20}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8 }}>TOTAL TALLERES</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: B.ink, letterSpacing: '-0.03em', fontFamily: 'var(--font-inter)', lineHeight: 1 }}>{MOCK_TALLERES.length}</div>
          </SoftCard>
          <SoftCard padding={20}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8 }}>EN TALLER AHORA</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: B.amber, letterSpacing: '-0.03em', fontFamily: 'var(--font-inter)', lineHeight: 1 }}>{totalVehicles}</div>
          </SoftCard>
          <SoftCard padding={20}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8 }}>TIEMPO PROMEDIO</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 600, color: B.blue, letterSpacing: '-0.03em', fontFamily: 'var(--font-inter)', lineHeight: 1 }}>{avgRepair}</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>días</span>
            </div>
          </SoftCard>
          <SoftCard padding={20}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8 }}>COSTO PROMEDIO</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 16, color: B.ink3 }}>$</span>
              <span style={{ fontSize: 32, fontWeight: 600, color: B.amber, letterSpacing: '-0.03em', fontFamily: 'var(--font-inter)', lineHeight: 1 }}>4.2k</span>
            </div>
          </SoftCard>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(['Todos', ...BRANCHES] as const).map(b => (
            <button key={b} onClick={() => setBranchFilter(b as Branch | 'Todos')} style={{
              padding: '7px 14px', borderRadius: 9999, border: `1px solid ${branchFilter === b ? B.blue : B.hairline}`,
              background: branchFilter === b ? B.blueSoft : B.surface,
              fontFamily: 'var(--font-inter)', fontSize: 12, color: branchFilter === b ? B.blue : B.ink2,
              fontWeight: branchFilter === b ? 500 : 400, cursor: 'pointer',
            }}>{b}</button>
          ))}
          <div style={{ width: 1, background: B.hairline, margin: '0 4px' }} />
          {(['Todos', ...TYPES] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t as ProviderType | 'Todos')} style={{
              padding: '7px 14px', borderRadius: 9999, border: `1px solid ${typeFilter === t ? B.green : B.hairline}`,
              background: typeFilter === t ? B.greenSoft : B.surface,
              fontFamily: 'var(--font-inter)', fontSize: 12, color: typeFilter === t ? B.green : B.ink2,
              fontWeight: typeFilter === t ? 500 : 400, cursor: 'pointer',
            }}>{t}</button>
          ))}
        </div>

        {/* Table */}
        <SoftCard padding={0}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-inter)' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${B.hairline}` }}>
                  {['Nombre', 'Tipo', 'Sucursal', 'Especialidad', 'Vehículos actuales', 'Tiempo prom.', 'Contacto', 'Acciones'].map(col => (
                    <th key={col} style={{ padding: '13px 18px', textAlign: 'left', fontSize: 11, color: B.ink3, fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{col.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const tc = TYPE_CONFIG[t.type]
                  return (
                    <tr key={t.id}
                      style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${B.hairline}` : 'none', cursor: 'pointer', transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = B.surface2)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => setDetail(t)}
                    >
                      <td style={{ padding: '13px 18px', fontSize: 14, color: B.ink, fontWeight: 500 }}>{t.name}</td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600, background: tc.bg, color: tc.fg }}>{t.type}</span>
                      </td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: B.ink2 }}>{t.branch}</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: B.ink2 }}>{t.speciality}</td>
                      <td style={{ padding: '13px 18px', fontSize: 14, fontWeight: 600, color: t.currentVehicles > 3 ? B.rose : t.currentVehicles > 0 ? B.amber : B.green }}>{t.currentVehicles}</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: B.ink2 }}>{t.avgDays} días</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: B.ink2 }}>{t.contact}</td>
                      <td style={{ padding: '13px 18px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          {['Ver', 'Editar', 'Vehículos'].map(a => (
                            <button key={a} style={{ padding: '4px 9px', borderRadius: 7, border: `1px solid ${B.hairline}`, background: 'transparent', fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink2, cursor: 'pointer', whiteSpace: 'nowrap' }}>{a}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </SoftCard>
      </main>

      {/* Add modal */}
      {showAdd && (
        <Modal title="Agregar taller" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 5, fontFamily: 'var(--font-inter)' }}>Nombre</label>
              <input type="text" required placeholder="Ej. Taller Pocitos" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 5, fontFamily: 'var(--font-inter)' }}>Tipo</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as ProviderType }))} style={inputStyle}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 5, fontFamily: 'var(--font-inter)' }}>Sucursal</label>
                <select value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value as Branch }))} style={inputStyle}>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            {([
              { label: 'Especialidad / marcas', key: 'speciality', type: 'text', placeholder: 'Ej. Toyota, Frenos' },
              { label: 'Contacto principal',    key: 'contact',    type: 'text', placeholder: 'Nombre' },
              { label: 'Teléfono',              key: 'phone',      type: 'tel',  placeholder: '099 000 000' },
              { label: 'Email',                 key: 'email',      type: 'email',placeholder: 'taller@email.uy' },
              { label: 'Dirección',             key: 'address',    type: 'text', placeholder: 'Calle, número' },
              { label: 'Tiempo promedio (días)',key: 'avgDays',    type: 'number',placeholder: '3' },
            ]).map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 5, fontFamily: 'var(--font-inter)' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 5, fontFamily: 'var(--font-inter)' }}>Notas</label>
              <textarea placeholder="Observaciones…" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 64 }} />
            </div>
            <ModalButtons onCancel={() => setShowAdd(false)} saving={saving} label="Guardar taller" />
          </form>
        </Modal>
      )}

      {/* Detail modal */}
      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600, background: TYPE_CONFIG[detail.type].bg, color: TYPE_CONFIG[detail.type].fg }}>{detail.type}</span>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink3 }}>{detail.branch}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                ['Especialidad', detail.speciality], ['Contacto', detail.contact],
                ['Teléfono', detail.phone], ['Email', detail.email],
                ['Dirección', detail.address], ['Tiempo promedio', `${detail.avgDays} días`],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink }}>{v}</div>
                </div>
              ))}
            </div>
            {detail.notes && (
              <div style={{ padding: '12px 14px', borderRadius: 10, background: B.surface2, fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2 }}>{detail.notes}</div>
            )}
            <div style={{ borderTop: `1px solid ${B.hairline}`, paddingTop: 14 }}>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink, marginBottom: 6 }}>
                Vehículos en taller ahora: <span style={{ color: detail.currentVehicles > 0 ? B.amber : B.green }}>{detail.currentVehicles}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3 }}>Historial de reparaciones disponible con integración completa de Supabase.</div>
            </div>
          </div>
        </Modal>
      )}

      <BentoBottomNav />
    </div>
  )
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,23,38,0.35)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: B.surface, borderRadius: B.radiusLg, padding: 32, width: '100%', maxWidth: 520, boxShadow: B.shadowLg, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: B.ink3, fontSize: 22, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ModalButtons({ onCancel, saving, label }: { onCancel: () => void; saving: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
      <button type="button" onClick={onCancel} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${B.hairline}`, background: 'transparent', fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink2, cursor: 'pointer' }}>Cancelar</button>
      <button type="submit" disabled={saving} style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: B.ink, color: B.surface, fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Guardando…' : label}
      </button>
    </div>
  )
}
