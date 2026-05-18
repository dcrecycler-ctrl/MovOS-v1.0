'use client'

import { useState } from 'react'
import { B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { SoftCard } from '@/components/ui/SoftCard'
import { SoftBadge } from '@/components/ui/SoftBadge'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'

type Role = 'admin' | 'management' | 'inspector' | 'mechanic' | 'operator'
type Status = 'active' | 'inactive' | 'pending'

interface User {
  id: string
  name: string
  email: string
  role: Role
  branch: string
  status: Status
  lastAccess: string
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Rodrigo Medina',   email: 'r.medina@movos.uy',    role: 'admin',      branch: 'Montevideo Centro', status: 'active',   lastAccess: 'Hace 2h'     },
  { id: '2', name: 'Ana García',       email: 'a.garcia@movos.uy',    role: 'management', branch: 'Pocitos',           status: 'active',   lastAccess: 'Hoy 9:14'    },
  { id: '3', name: 'Carlos Benítez',   email: 'c.benitez@movos.uy',   role: 'inspector',  branch: 'Malvín',            status: 'active',   lastAccess: 'Ayer 18:30'  },
  { id: '4', name: 'Laura Sosa',       email: 'l.sosa@movos.uy',      role: 'mechanic',   branch: 'Carrasco',          status: 'pending',  lastAccess: 'Nunca'       },
  { id: '5', name: 'Martín Torres',    email: 'm.torres@movos.uy',     role: 'operator',   branch: 'Pocitos',           status: 'inactive', lastAccess: 'Hace 3 días' },
  { id: '6', name: 'Valeria Romero',   email: 'v.romero@movos.uy',    role: 'operator',   branch: 'Malvín',            status: 'active',   lastAccess: 'Hace 1h'     },
  { id: '7', name: 'Diego Fernández',  email: 'd.fernandez@movos.uy', role: 'inspector',  branch: 'Montevideo Centro', status: 'active',   lastAccess: 'Hoy 11:05'   },
]

const ROLE_CONFIG: Record<Role, { label: string; tone: string; fg: string; bg: string }> = {
  admin:      { label: 'Admin',     tone: 'amber',  fg: B.amber,  bg: B.amberSoft  },
  management: { label: 'Gerencia',  tone: 'blue',   fg: B.blue,   bg: B.blueSoft   },
  inspector:  { label: 'Inspector', tone: 'green',  fg: B.green,  bg: B.greenSoft  },
  mechanic:   { label: 'Mecánico',  tone: 'lilac',  fg: B.lilac,  bg: B.lilacSoft  },
  operator:   { label: 'Operador',  tone: 'sky',    fg: B.sky,    bg: B.skySoft    },
}
const STATUS_CONFIG: Record<Status, { label: string; fg: string; bg: string }> = {
  active:   { label: 'Activo',    fg: B.green, bg: B.greenSoft },
  inactive: { label: 'Inactivo', fg: B.rose,  bg: B.roseSoft  },
  pending:  { label: 'Pendiente', fg: B.amber, bg: B.amberSoft },
}

const BRANCHES = ['Montevideo Centro', 'Pocitos', 'Malvín', 'Carrasco']
const ROLES: Role[] = ['admin', 'management', 'inspector', 'mechanic', 'operator']

const inputStyle = {
  width: '100%', boxSizing: 'border-box' as const, padding: '9px 12px',
  borderRadius: 9, border: `1px solid ${B.hairline}`,
  background: B.surface2, fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink, outline: 'none',
}

export default function UsuariosPage() {
  const [users] = useState<User[]>(MOCK_USERS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'operator' as Role, branch: BRANCHES[0] })
  const [sending, setSending] = useState(false)

  const total       = users.length
  const activos     = users.filter(u => u.status === 'active').length
  const admins      = users.filter(u => u.role === 'admin').length
  const operadores  = users.filter(u => u.role === 'operator').length

  const kpis = [
    { label: 'Total usuarios', value: total,     fg: B.amber, bg: B.amberSoft },
    { label: 'Activos',        value: activos,   fg: B.green, bg: B.greenSoft },
    { label: 'Administradores', value: admins,   fg: B.blue,  bg: B.blueSoft  },
    { label: 'Operadores',     value: operadores, fg: B.sky,   bg: B.skySoft   },
  ]

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setTimeout(() => { setSending(false); setShowModal(false) }, 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar active="Usuarios" />
      <main className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-7 pb-24 md:pb-16">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>Usuarios</h1>
              <span style={{ padding: '3px 10px', borderRadius: 9999, background: B.amberSoft, fontFamily: 'var(--font-inter)', fontSize: 11, color: B.amber, fontWeight: 600, letterSpacing: '0.04em' }}>SOLO ADMINISTRADOR</span>
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: 0 }}>Gestión de acceso · {total} usuarios registrados</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 18px', borderRadius: 10, border: 'none',
              background: B.ink, color: B.surface,
              fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            Agregar usuario
          </button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
          {kpis.map(k => (
            <SoftCard key={k.label} padding={20}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 9999, background: k.fg }} />
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, fontWeight: 500 }}>{k.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: 32, fontWeight: 600, color: B.ink, letterSpacing: '-0.03em', lineHeight: 1 }}>{k.value}</div>
            </SoftCard>
          ))}
        </div>

        {/* Table */}
        <SoftCard padding={0}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-inter)' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${B.hairline}` }}>
                  {['Nombre', 'Email', 'Rol', 'Sucursal', 'Estado', 'Último acceso', 'Acciones'].map(col => (
                    <th key={col} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, color: B.ink3, fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{col.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const role   = ROLE_CONFIG[u.role]
                  const status = STATUS_CONFIG[u.status]
                  return (
                    <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? `1px solid ${B.hairline}` : 'none', transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = B.surface2)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px', fontSize: 14, color: B.ink, fontWeight: 500 }}>{u.name}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: B.ink2 }}>{u.email}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600, background: role.bg, color: role.fg }}>{role.label}</span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: B.ink2 }}>{u.branch}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600, background: status.bg, color: status.fg }}>{status.label}</span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 12, color: B.ink3 }}>{u.lastAccess}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {(['Editar rol', 'Sucursal', u.status === 'active' ? 'Desactivar' : 'Activar', 'Reset pwd'] as const).map(action => (
                            <button key={action} style={{
                              padding: '4px 10px', borderRadius: 7, border: `1px solid ${B.hairline}`,
                              background: 'transparent', fontFamily: 'var(--font-inter)', fontSize: 11,
                              color: action === 'Desactivar' ? B.rose : B.ink2, cursor: 'pointer', whiteSpace: 'nowrap',
                            }}>{action}</button>
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

      {/* Add user modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,23,38,0.35)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div style={{ background: B.surface, borderRadius: B.radiusLg, padding: 32, width: '100%', maxWidth: 480, boxShadow: B.shadowLg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>Agregar usuario</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: B.ink3, fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Nombre completo', key: 'name', type: 'text', placeholder: 'Ej. Ana García' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'ana@empresa.uy' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 6, fontFamily: 'var(--font-inter)' }}>{f.label}</label>
                  <input type={f.type} required placeholder={f.placeholder}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 6, fontFamily: 'var(--font-inter)' }}>Rol</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as Role }))} style={inputStyle}>
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 6, fontFamily: 'var(--font-inter)' }}>Sucursal</label>
                <select value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} style={inputStyle}>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, margin: 0 }}>Se enviará una invitación de Supabase al email ingresado.</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1px solid ${B.hairline}`, background: 'transparent', fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink2, cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={sending} style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: B.ink, color: B.surface, fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 500, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1 }}>
                  {sending ? 'Enviando…' : 'Enviar invitación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BentoBottomNav />
    </div>
  )
}
