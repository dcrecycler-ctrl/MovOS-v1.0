import { B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'

export default function OperationsPage() {
  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar />
      <main className="max-w-[1400px] mx-auto px-4 pt-7 pb-24 md:px-6 md:pb-16 lg:px-8">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>Operaciones</h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '4px 0 0' }}>
            Despacho · Reservas · Devoluciones · Estado en tiempo real
          </p>
        </div>

        <div style={{
          background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`,
          padding: 48, textAlign: 'center', boxShadow: B.shadowSm,
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
          <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 18, fontWeight: 600, color: B.ink, margin: '0 0 8px' }}>
            Módulo en desarrollo
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: 0, maxWidth: 400, marginInline: 'auto' }}>
            El módulo de operaciones estará disponible próximamente. Incluirá despacho de vehículos, gestión de reservas y devoluciones.
          </p>
        </div>
      </main>
      <BentoBottomNav />
    </div>
  )
}
