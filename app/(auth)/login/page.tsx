'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { B } from '@/lib/tokens'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Credenciales incorrectas. Intenta nuevamente.')
      setLoading(false)
    } else {
      router.refresh()
      router.push('/')
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 400, padding: '0 16px' }}>
      <div style={{ background: B.surface, borderRadius: B.radiusLg, padding: 40, boxShadow: B.shadowLg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, background: B.ink, color: B.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em',
          }}>M</div>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, letterSpacing: '-0.01em' }}>MovOS</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 22, fontWeight: 600, color: B.ink, margin: '0 0 6px', letterSpacing: '-0.02em' }}>Bienvenido</h1>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '0 0 28px' }}>Ingresa a la plataforma de gestión de flota</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '10px 14px',
                borderRadius: 10, border: `1px solid ${B.hairline}`,
                background: B.surface2, fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink, outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2, fontWeight: 500, marginBottom: 6 }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '10px 14px',
                borderRadius: 10, border: `1px solid ${B.hairline}`,
                background: B.surface2, fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink, outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              background: B.roseSoft, fontFamily: 'var(--font-inter)', fontSize: 13, color: B.rose,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4, padding: '12px 20px', borderRadius: 10, border: 'none',
              background: loading ? B.ink3 : B.ink, color: B.surface,
              fontFamily: 'var(--font-inter)', fontSize: 14, fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
