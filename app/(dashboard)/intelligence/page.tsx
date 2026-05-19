import { B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'

export default function IntelligencePage() {
  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar />
      <main className="max-w-[1400px] mx-auto px-4 pt-7 pb-24 md:px-6 md:pb-16 lg:px-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>Inteligencia</h1>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 9999, background: B.amberSoft, color: B.amber }}>BETA</span>
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '4px 0 0' }}>
              Análisis predictivo · Anomalías · Recomendaciones IA · Tendencias de flota
            </p>
          </div>
        </div>

        <div style={{
          background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`,
          padding: 48, textAlign: 'center', boxShadow: B.shadowSm,
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✨</div>
          <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: '0 0 8px' }}>
            Inteligencia Artificial — Próximamente
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: 0, maxWidth: 420, marginInline: 'auto' }}>
            Este módulo utilizará IA para detectar anomalías en la flota, predecir fallos mecánicos y recomendar optimizaciones de utilización.
          </p>
          <div style={{ marginTop: 24, display: 'inline-flex', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, padding: '6px 14px', borderRadius: 9999, background: B.amberSoft, color: B.amber, fontWeight: 500 }}>En beta privada</span>
          </div>
        </div>
      </main>
      <BentoBottomNav />
    </div>
  )
}
