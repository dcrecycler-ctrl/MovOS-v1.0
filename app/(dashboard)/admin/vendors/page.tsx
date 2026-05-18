'use client'

import { useState, useMemo } from 'react'
import { B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { SoftCard } from '@/components/ui/SoftCard'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'

type Category = 'Filtros' | 'Frenos' | 'Neumáticos' | 'Eléctrico' | 'Carrocería' | 'Lubricantes' | 'Otros'
type Branch   = 'Montevideo Centro' | 'Pocitos' | 'Malvín' | 'Carrasco'

interface Vendor {
  id: string
  name: string
  branch: Branch
  category: Category
  contact: string
  phone: string
  email: string
  activeOrders: number
  lastOrder: string
  address: string
  notes: string
}

const MOCK_VENDORS: Vendor[] = [
  { id: '1', name: 'Repuestos Uruguay S.A.',  branch: 'Montevideo Centro', category: 'Frenos',     contact: 'Jorge Pérez',    phone: '099 123 456', email: 'jorge@repuruguay.uy',   activeOrders: 3, lastOrder: '12 may 2025', address: 'Av. 18 de Julio 1234', notes: 'Proveedor principal de frenos' },
  { id: '2', name: 'AutoFiltros del Sur',     branch: 'Pocitos',           category: 'Filtros',    contact: 'María López',    phone: '098 234 567', email: 'maria@autofiltros.uy',  activeOrders: 1, lastOrder: '9 may 2025',  address: 'Bv. España 445',       notes: '' },
  { id: '3', name: 'Neumáticos del Río',       branch: 'Malvín',            category: 'Neumáticos', contact: 'Pedro Ruiz',     phone: '091 345 678', email: 'pedro@neumaticos.uy',   activeOrders: 5, lastOrder: '14 may 2025', address: 'Av. Italia 2890',      notes: 'Stock alto en verano' },
  { id: '4', name: 'Electro Auto UY',          branch: 'Carrasco',          category: 'Eléctrico',  contact: 'Sofía Díaz',     phone: '092 456 789', email: 'sofia@electroauto.uy',  activeOrders: 0, lastOrder: '2 may 2025',  address: 'Giannattasio km 14',   notes: '' },
  { id: '5', name: 'Carrocerías Unidas',       branch: 'Montevideo Centro', category: 'Carrocería', contact: 'Luis Martínez',  phone: '094 567 890', email: 'luis@carroceriauy.uy',  activeOrders: 2, lastOrder: '11 may 2025', address: 'Propios 3120',         notes: 'Pintura y chapa' },
  { id: '6', name: 'LubriMax',                 branch: 'Pocitos',           category: 'Lubricantes',contact: 'Clara Gómez',    phone: '095 678 901', email: 'clara@lubrimax.uy',     activeOrders: 4, lastOrder: '13 may 2025', address: 'Av. Luis Batlle 890',  notes: 'Descuento por volumen' },
  { id: '7', name: 'Repuestos Norte S.R.L.',  branch: 'Malvín',            category: 'Otros',      contact: 'Roberto Suárez', phone: '096 789 012', email: 'roberto@repnorte.uy',   activeOrders: 1, lastOrder: '8 may 2025',  address: 'Av. Rivera 5500',      notes: '' },
]

const CATEGORIES: Category[] = ['Filtros', 'Frenos', 'Neumáticos', 'Eléctrico', 'Carrocería', 'Lubricantes', 'Otros']
const BRANCHES: Branch[]  = ['Montevideo Centro', 'Pocitos', 'Malvín', 'Carrasco']

const CATEGORY_COLOR: Record<Category, { fg: string; bg: string }> = {
  Filtros:     { fg: B.blue,  bg: B.blueSoft  },
  Frenos:      { fg: B.rose,  bg: B.roseSoft  },
  Neumáticos:  { fg: B.sky,   bg: B.skySoft   },
  Eléctrico:   { fg: B.amber, bg: B.amberSoft },
  Carrocería:  { fg: B.lilac, bg: B.lilacSoft },
  Lubricantes: { fg: B.green, bg: B.greenSoft },
  Otros:       { fg: B.ink3,  bg: B.surface2  },
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box' as const, padding: '9px 12px',
  borderRadius: 9, border: `1px solid ${B.hairline}`,
  background: B.surface2, fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, outline: 'none',
}

export default function VendorsPage() {
  const [branchFilter, setBranchFilter] = useState<Branch | 'Todos'>('Todos')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'Todos'>('Todos')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [detail, setDetail] = useState<Vendor | null>(null)
  const [form, setForm] = useState({ name: '', branch: BRANCHES[0] as Branch, category: CATEGORIES[0] as Category, contact: '', phone: '', email: '', address: '', notes: '' })
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => MOCK_VENDORS.filter(v => {
    if (branchFilter !== 'Todos' && v.branch !== branchFilter) return false
    if (categoryFilter !== 'Todos' && v.category !== categoryFilter) return false
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.category.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [branchFilter, categoryFilter, search])

  const totalActive    = MOCK_VENDORS.reduce((s, v) => s + v.activeOrders, 0)
  const criticalOrders = MOCK_VENDORS.filter(v => v.activeOrders >= 3).length
  const byBranch       = BRANCHES.map(b => ({ label: b.split(' ')[0], count: MOCK_VENDORS.filter(v => v.branch === b).length }))

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => { setSaving(false); setShowAdd(false) }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar active="Proveedores" />
      <main className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-7 pb-24 md:pb-16">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Directorio de Proveedores</h1>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: 0 }}>Repuestos por sucursal · no proveedores de servicio</p>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, border: 'none', background: B.ink, color: B.surface, fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            Agregar proveedor
          </button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
          <SoftCard padding={20}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8 }}>TOTAL PROVEEDORES</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: B.ink, letterSpacing: '-0.03em', fontFamily: 'var(--font-inter)', lineHeight: 1 }}>{MOCK_VENDORS.length}</div>
          </SoftCard>
          <SoftCard padding={20}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8 }}>POR SUCURSAL</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {byBranch.map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink }}>{b.count}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: B.ink3 }}>{b.label}</span>
                </div>
              ))}
            </div>
          </SoftCard>
          <SoftCard padding={20}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8 }}>PEDIDOS ACTIVOS</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: B.amber, letterSpacing: '-0.03em', fontFamily: 'var(--font-inter)', lineHeight: 1 }}>{totalActive}</div>
          </SoftCard>
          <SoftCard padding={20}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8 }}>PEDIDOS CRÍTICOS</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: B.rose, letterSpacing: '-0.03em', fontFamily: 'var(--font-inter)', lineHeight: 1 }}>{criticalOrders}</div>
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
          {(['Todos', ...CATEGORIES] as const).map(c => (
            <button key={c} onClick={() => setCategoryFilter(c as Category | 'Todos')} style={{
              padding: '7px 14px', borderRadius: 9999, border: `1px solid ${categoryFilter === c ? B.green : B.hairline}`,
              background: categoryFilter === c ? B.greenSoft : B.surface,
              fontFamily: 'var(--font-inter)', fontSize: 12, color: categoryFilter === c ? B.green : B.ink2,
              fontWeight: categoryFilter === c ? 500 : 400, cursor: 'pointer',
            }}>{c}</button>
          ))}
          <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <input placeholder="Buscar proveedor…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 14px 8px 34px', borderRadius: 9999, border: `1px solid ${B.hairline}`, background: B.surface, fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, outline: 'none', width: 220 }} />
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={B.ink3} strokeWidth="2" style={{ position: 'absolute', left: 12, top: 10 }}>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
            </svg>
          </div>
        </div>

        {/* Table */}
        <SoftCard padding={0}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-inter)' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${B.hairline}` }}>
                  {['Nombre', 'Sucursal', 'Categoría', 'Contacto', 'Teléfono', 'Email', 'Pedidos activos', 'Última orden', 'Acciones'].map(col => (
                    <th key={col} style={{ padding: '13px 18px', textAlign: 'left', fontSize: 11, color: B.ink3, fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{col.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => {
                  const cat = CATEGORY_COLOR[v.category]
                  return (
                    <tr key={v.id}
                      style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${B.hairline}` : 'none', cursor: 'pointer', transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = B.surface2)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => setDetail(v)}
                    >
                      <td style={{ padding: '13px 18px', fontSize: 14, color: B.ink, fontWeight: 500 }}>{v.name}</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: B.ink2 }}>{v.branch}</td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600, background: cat.bg, color: cat.fg }}>{v.category}</span>
                      </td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: B.ink2 }}>{v.contact}</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: B.ink2 }}>{v.phone}</td>
                      <td style={{ padding: '13px 18px', fontSize: 13, color: B.ink2 }}>{v.email}</td>
                      <td style={{ padding: '13px 18px', fontSize: 14, fontWeight: 600, color: v.activeOrders > 2 ? B.rose : v.activeOrders > 0 ? B.amber : B.green }}>{v.activeOrders}</td>
                      <td style={{ padding: '13px 18px', fontSize: 12, color: B.ink3 }}>{v.lastOrder}</td>
                      <td style={{ padding: '13px 18px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          {['Ver', 'Editar', 'Nuevo pedido'].map(a => (
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
        <Modal title="Agregar proveedor" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {([
              { label: 'Nombre del proveedor', key: 'name',    type: 'text',  placeholder: 'Ej. Repuestos Norte' },
              { label: 'Contacto principal',   key: 'contact', type: 'text',  placeholder: 'Nombre' },
              { label: 'Teléfono',             key: 'phone',   type: 'tel',   placeholder: '099 000 000' },
              { label: 'Email',                key: 'email',   type: 'email', placeholder: 'contacto@proveedor.uy' },
              { label: 'Dirección',            key: 'address', type: 'text',  placeholder: 'Calle, número' },
            ]).map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 5, fontFamily: 'var(--font-inter)' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} required={['name', 'contact'].includes(f.key)}
                  value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={inputStyle} />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 5, fontFamily: 'var(--font-inter)' }}>Sucursal</label>
                <select value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value as Branch }))} style={inputStyle}>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 5, fontFamily: 'var(--font-inter)' }}>Categoría</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))} style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 5, fontFamily: 'var(--font-inter)' }}>Notas</label>
              <textarea placeholder="Observaciones opcionales…" value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} />
            </div>
            <ModalButtons onCancel={() => setShowAdd(false)} saving={saving} label="Guardar proveedor" />
          </form>
        </Modal>
      )}

      {/* Detail modal */}
      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                ['Sucursal', detail.branch], ['Categoría', detail.category],
                ['Contacto', detail.contact], ['Teléfono', detail.phone],
                ['Email', detail.email], ['Dirección', detail.address],
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
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink, marginBottom: 10 }}>Pedidos activos: <span style={{ color: B.amber }}>{detail.activeOrders}</span></div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3 }}>Última orden: {detail.lastOrder}</div>
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
