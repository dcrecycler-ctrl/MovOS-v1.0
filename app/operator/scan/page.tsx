'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { B } from '@/lib/tokens'
import { getVehicleByUnitId } from '@/lib/supabase/queries/operator'

type ScanState = 'idle' | 'scanning' | 'found' | 'not_found' | 'error'

function parseQrPayload(raw: string): string | null {
  const trim = raw.trim()
  const proto = trim.match(/movos:\/\/vehicle\/([A-Z0-9-]+)/i)
  if (proto) return proto[1].toUpperCase()
  if (/^U-\d+$/i.test(trim)) return trim.toUpperCase()
  return null
}

export default function ScanPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirectTo   = searchParams.get('redirect')

  const scannerRef   = useRef<import('html5-qrcode').Html5Qrcode | null>(null)
  const mountedRef   = useRef(false)

  const [state,    setState]   = useState<ScanState>('idle')
  const [unitId,   setUnitId]  = useState<string | null>(null)
  const [manualId, setManualId] = useState('')

  useEffect(() => {
    mountedRef.current = true
    startScanner()
    return () => {
      mountedRef.current = false
      stopScanner()
    }
  }, [])

  async function startScanner() {
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      scannerRef.current = new Html5Qrcode('qr-reader')
      setState('scanning')
      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        onScanSuccess,
        () => {}
      )
    } catch {
      if (mountedRef.current) setState('error')
    }
  }

  async function stopScanner() {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      }
    } catch {}
  }

  async function onScanSuccess(raw: string) {
    const parsed = parseQrPayload(raw)
    if (!parsed) return
    await stopScanner()
    setState('found')
    setUnitId(parsed)
    const vehicle = await getVehicleByUnitId(parsed)
    if (!vehicle) { if (mountedRef.current) setState('not_found'); return }
    if (!mountedRef.current) return
    const dest = redirectTo ?? 'inspect'
    const routes: Record<string, string> = {
      inspect:     `/operator/inspect/new?vehicle=${vehicle.id}&type=pickup`,
      maintenance: `/operator/maintenance?vehicle=${vehicle.id}`,
      alerts:      `/operator/alerts?vehicle=${vehicle.id}`,
    }
    router.push(routes[dest] ?? routes.inspect)
  }

  async function handleManualSearch() {
    const id = manualId.trim().toUpperCase()
    if (!id) return
    setState('scanning')
    const vehicle = await getVehicleByUnitId(id)
    if (!vehicle) { setState('not_found'); setUnitId(id); return }
    const dest = redirectTo ?? 'inspect'
    const routes: Record<string, string> = {
      inspect:     `/operator/inspect/new?vehicle=${vehicle.id}&type=pickup`,
      maintenance: `/operator/maintenance?vehicle=${vehicle.id}`,
      alerts:      `/operator/alerts?vehicle=${vehicle.id}`,
    }
    router.push(routes[dest] ?? routes.inspect)
  }

  return (
    <div style={{ minHeight: '100%', background: B.bg, display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-inter)' }}>

      {/* Header */}
      <div style={{
        padding: '12px 20px 14px',
        background: B.surface, borderBottom: `1px solid ${B.hairline}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 34, height: 34, borderRadius: 9999,
              background: B.surface2, border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: B.ink2, cursor: 'pointer', flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.01em' }}>
              Escanear vehículo
            </h2>
            <p style={{ fontSize: 11, color: B.ink3, margin: '2px 0 0' }}>
              {redirectTo === 'maintenance' ? 'Escanea para mover a taller'
               : redirectTo === 'alerts'   ? 'Escanea para crear alerta'
               : 'Escanea para inspeccionar'}
            </p>
          </div>
        </div>
      </div>

      {/* Camera viewport */}
      <div style={{ position: 'relative', background: '#111', overflow: 'hidden' }}>
        <div id="qr-reader" style={{ width: '100%' }} />

        {state === 'scanning' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{ position: 'relative', width: 240, height: 240 }}>
              {[
                { top: 0,   left: 0,   borderTop: `2.5px solid ${B.amber}`, borderLeft:  `2.5px solid ${B.amber}` },
                { top: 0,   right: 0,  borderTop: `2.5px solid ${B.amber}`, borderRight: `2.5px solid ${B.amber}` },
                { bottom: 0, left: 0,  borderBottom: `2.5px solid ${B.amber}`, borderLeft: `2.5px solid ${B.amber}` },
                { bottom: 0, right: 0, borderBottom: `2.5px solid ${B.amber}`, borderRight: `2.5px solid ${B.amber}` },
              ].map((s, i) => (
                <div key={i} style={{ position: 'absolute', width: 28, height: 28, ...s, borderRadius: 3 }} />
              ))}
              <div style={{
                position: 'absolute', left: 0, right: 0, top: '50%',
                height: 2, background: `${B.amber}88`,
                animation: 'scan-line 2s ease-in-out infinite',
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Status + manual entry */}
      <div style={{ padding: '20px 20px 8px', flex: 1 }}>

        {state === 'idle' && (
          <p style={{ textAlign: 'center', color: B.ink3, fontSize: 13, marginBottom: 16 }}>Iniciando cámara…</p>
        )}
        {state === 'scanning' && (
          <p style={{ textAlign: 'center', color: B.ink3, fontSize: 13, marginBottom: 16 }}>
            Apuntá la cámara al código QR del vehículo
          </p>
        )}
        {state === 'found' && unitId && (
          <p style={{ textAlign: 'center', color: B.ink2, fontSize: 13, marginBottom: 16 }}>
            Buscando {unitId}…
          </p>
        )}

        {state === 'not_found' && (
          <div style={{
            background: B.roseSoft, border: `1px solid ${B.rose}44`,
            borderRadius: 14, padding: '14px 16px', marginBottom: 16,
          }}>
            <div style={{ fontSize: 13, color: B.rose, fontWeight: 600, marginBottom: 4 }}>
              Vehículo no encontrado
            </div>
            <div style={{ fontSize: 12, color: B.ink2 }}>
              {unitId} no está registrado en el sistema.
            </div>
            <button
              onClick={() => { setState('scanning'); startScanner() }}
              style={{
                marginTop: 12, width: '100%', padding: '10px', borderRadius: 10,
                background: B.surface, border: `1px solid ${B.hairline}`,
                color: B.ink2, fontFamily: 'var(--font-inter)', fontSize: 13, cursor: 'pointer',
                boxShadow: B.shadowSm,
              }}
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {state === 'error' && (
          <div style={{
            background: B.amberSoft, border: `1px solid ${B.amber}44`,
            borderRadius: 14, padding: '14px 16px', marginBottom: 16,
          }}>
            <div style={{ fontSize: 13, color: B.amber, fontWeight: 600, marginBottom: 4 }}>
              Sin acceso a la cámara
            </div>
            <div style={{ fontSize: 12, color: B.ink2, lineHeight: 1.5 }}>
              Permitir el acceso en ajustes del navegador, o ingresá el ID manualmente.
            </div>
          </div>
        )}

        {/* Manual entry */}
        <div style={{ marginTop: state === 'scanning' ? 0 : 4 }}>
          <div style={{ fontSize: 11, color: B.ink3, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            O ingresá el ID manualmente
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={manualId}
              onChange={e => setManualId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
              placeholder="U-0142…"
              style={{
                flex: 1, padding: '11px 14px',
                background: B.surface, border: `1.5px solid ${B.hairline}`, borderRadius: 12,
                fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink,
                outline: 'none', letterSpacing: '0.03em', boxShadow: B.shadowSm,
              }}
            />
            <button
              onClick={handleManualSearch}
              style={{
                padding: '11px 18px', borderRadius: 12,
                background: B.ink, border: 'none', color: '#fff',
                fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0%, 100% { transform: translateY(-80px); opacity: 0.4; }
          50%       { transform: translateY(80px);  opacity: 1;   }
        }
        #qr-reader video { width: 100% !important; }
        #qr-reader img   { display: none !important; }
        #qr-reader button { display: none !important; }
      `}</style>
    </div>
  )
}
