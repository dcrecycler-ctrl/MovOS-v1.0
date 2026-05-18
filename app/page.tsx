'use client'

import { useState } from 'react'
import { B } from '@/lib/tokens'
import { TopBar } from '@/components/layout/TopBar'
import { KPIBento } from '@/components/dashboard/KPIBento'
import { AlertsBento } from '@/components/dashboard/AlertsBento'
import { SucursalesBento } from '@/components/dashboard/SucursalesBento'
import { ContractsBento } from '@/components/dashboard/ContractsBento'
import { SoftModal } from '@/components/dashboard/SoftModal'
import { ModalPayload } from '@/components/dashboard/types'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'

export default function DashboardPage() {
  const [modal, setModal] = useState<ModalPayload | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar active="Tablero" />

      <main className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-7 pb-24 md:pb-16">
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>Tablero</h1>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '4px 0 0' }}>
              Mayo 2025 · Flota activa en 4 sucursales Uruguay
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 9999,
              background: B.surface, border: `1px solid ${B.hairline}`,
              boxShadow: B.shadowSm,
              fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              1–31 mayo 2025
            </div>
          </div>
        </div>

        {/* KPI bento row */}
        <KPIBento openModal={setModal} />

        {/* Alerts bento row */}
        <AlertsBento openModal={setModal} />

        {/* Sucursales bento row */}
        <SucursalesBento openModal={setModal} />

        {/* Contracts bento row */}
        <ContractsBento openModal={setModal} />
      </main>

      {/* Modal overlay */}
      <SoftModal modal={modal} onClose={() => setModal(null)} />

      {/* Mobile bottom nav */}
      <BentoBottomNav active="tablero" />
    </div>
  )
}
