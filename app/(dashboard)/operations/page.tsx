'use client'

import { useState } from 'react'
import { B } from '@/lib/tokens'
import { TopBar }         from '@/components/layout/TopBar'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'
import { SectionLabel }   from '@/components/ui/SectionLabel'
import { StatusBadge }    from '@/components/ui/StatusBadge'
import { ActionButton }   from '@/components/ui/ActionButton'
import { DataTable, Column } from '@/components/ui/DataTable'
import { DrillModal }     from '@/components/ui/DrillModal'

// ─── Types ────────────────────────────────────────────────────────────────────

type DispatchStatus = 'listo' | 'pendiente' | 'demorado'
type ReturnStatus   = 'a-tiempo' | 'tardanza' | 'completada'
type RentalStatus   = 'activa' | 'por-vencer' | 'extendida'

interface DispatchItem {
  id: string; unit: string; plate: string; model: string
  customer: string; reservation: string
  scheduled: string; branch: string; status: DispatchStatus; fuel: number
}

interface ReturnItem {
  id: string; unit: string; plate: string; model: string
  customer: string; reservation: string
  scheduled: string; branch: string; status: ReturnStatus
  fuelReturn: number; kmAdded: number
}

interface RentalRow extends Record<string, unknown> {
  id: string; unit: string; plate: string; model: string
  customer: string; branch: string
  start: string; end: string; daysLeft: number
  status: RentalStatus
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const DISPATCH: DispatchItem[] = [
  { id: 'dp1', unit: 'PDE-002', plate: 'SBA 5678', model: 'Toyota Corolla 2023',  customer: 'Diego Herrera',    reservation: 'RES-9201', scheduled: '09:00', branch: 'Punta del Este',   status: 'listo',     fuel: 100 },
  { id: 'dp2', unit: 'MVD-001', plate: 'SBB 3344', model: 'Toyota Yaris 2022',    customer: 'Valentina Suárez', reservation: 'RES-9202', scheduled: '09:30', branch: 'Montevideo Centro', status: 'listo',     fuel: 100 },
  { id: 'dp3', unit: 'CAR-003', plate: 'SBE 8899', model: 'Volkswagen Taos 2023', customer: 'UTE Servicios',    reservation: 'RES-9203', scheduled: '10:00', branch: 'Carrasco',         status: 'pendiente', fuel: 80  },
  { id: 'dp4', unit: 'PDE-005', plate: 'SCB 9900', model: 'Renault Duster 2022',  customer: 'Facundo Méndez',   reservation: 'RES-9204', scheduled: '10:30', branch: 'Punta del Este',   status: 'pendiente', fuel: 100 },
  { id: 'dp5', unit: 'CLN-004', plate: 'SBG 2233', model: 'Ford Fiesta 2023',     customer: 'Ana Lima',         reservation: 'RES-9205', scheduled: '11:00', branch: 'Colonia',          status: 'demorado',  fuel: 95  },
  { id: 'dp6', unit: 'MVD-003', plate: 'SBC 7788', model: 'Chevrolet Onix 2023',  customer: 'Martín Castro',    reservation: 'RES-9206', scheduled: '11:30', branch: 'Montevideo Centro', status: 'listo',     fuel: 100 },
]

const RETURNS: ReturnItem[] = [
  { id: 'rt1', unit: 'PDE-001', plate: 'SBA 1234', model: 'Toyota Hilux 2022',   customer: 'Carlos Mendoza',  reservation: 'RES-9180', scheduled: '09:00', branch: 'Punta del Este',   status: 'completada', fuelReturn: 45, kmAdded: 1284 },
  { id: 'rt2', unit: 'MVD-005', plate: 'SBD 2233', model: 'Fiat Cronos 2021',    customer: 'Laura Silveira',  reservation: 'RES-9182', scheduled: '10:00', branch: 'Montevideo Centro', status: 'a-tiempo',   fuelReturn: 70, kmAdded: 620  },
  { id: 'rt3', unit: 'CAR-002', plate: 'SBD 6677', model: 'Toyota SW4 2022',     customer: 'OSE Servicios',   reservation: 'RES-9177', scheduled: '10:30', branch: 'Carrasco',         status: 'tardanza',   fuelReturn: 22, kmAdded: 2100 },
  { id: 'rt4', unit: 'CLN-002', plate: 'SBF 7788', model: 'Renault Oroch 2022',  customer: 'Roberto Herrera', reservation: 'RES-9185', scheduled: '11:30', branch: 'Colonia',          status: 'a-tiempo',   fuelReturn: 55, kmAdded: 890  },
  { id: 'rt5', unit: 'PDE-006', plate: 'SCB 1122', model: 'Volkswagen Gol 2023', customer: 'Lucía Torres',    reservation: 'RES-9190', scheduled: '14:00', branch: 'Punta del Este',   status: 'a-tiempo',   fuelReturn: 80, kmAdded: 430  },
]

const RENTALS: RentalRow[] = [
  { id: 'r1',  unit: 'PDE-002', plate: 'SBA 5678', model: 'Toyota Corolla 2023',  customer: 'Diego Herrera',     branch: 'Punta del Este',   start: '18 May', end: '25 May', daysLeft: 7,  status: 'activa'    },
  { id: 'r2',  unit: 'MVD-002', plate: 'SBB 5566', model: 'Ford Ranger 2021',     customer: 'Antel S.A.',        branch: 'Montevideo Centro', start: '10 May', end: '20 May', daysLeft: 2,  status: 'por-vencer'},
  { id: 'r3',  unit: 'CAR-002', plate: 'SBD 6677', model: 'Toyota SW4 2022',      customer: 'OSE Servicios',     branch: 'Carrasco',         start: '05 May', end: '19 May', daysLeft: 1,  status: 'por-vencer'},
  { id: 'r4',  unit: 'CLN-002', plate: 'SBF 7788', model: 'Renault Oroch 2022',   customer: 'Roberto Herrera',   branch: 'Colonia',          start: '12 May', end: '22 May', daysLeft: 4,  status: 'activa'    },
  { id: 'r5',  unit: 'PDE-005', plate: 'SCB 9900', model: 'Renault Duster 2022',  customer: 'Facundo Méndez',    branch: 'Punta del Este',   start: '14 May', end: '28 May', daysLeft: 10, status: 'activa'    },
  { id: 'r6',  unit: 'MVD-005', plate: 'SBD 2233', model: 'Fiat Cronos 2021',     customer: 'Laura Silveira',    branch: 'Montevideo Centro', start: '01 May', end: '19 May', daysLeft: 1,  status: 'por-vencer'},
  { id: 'r7',  unit: 'CAR-004', plate: 'SBE 1122', model: 'Chevrolet S10 2021',   customer: 'UTE Servicios',     branch: 'Carrasco',         start: '08 May', end: '30 May', daysLeft: 12, status: 'activa'    },
  { id: 'r8',  unit: 'CLN-001', plate: 'SBF 5566', model: 'Toyota Hilux 2021',    customer: 'Valentina Suárez',  branch: 'Colonia',          start: '15 May', end: '01 Jun', daysLeft: 14, status: 'extendida' },
  { id: 'r9',  unit: 'MVD-002', plate: 'SBB 5566', model: 'Ford Ranger 2021',     customer: 'Martín Castro',     branch: 'Montevideo Centro', start: '17 May', end: '24 May', daysLeft: 6,  status: 'activa'    },
  { id: 'r10', unit: 'PDE-001', plate: 'SBA 1234', model: 'Toyota Hilux 2022',    customer: 'Diego Herrera',     branch: 'Punta del Este',   start: '16 May', end: '23 May', daysLeft: 5,  status: 'activa'    },
]

// ─── Color maps ───────────────────────────────────────────────────────────────

const DISPATCH_COLOR: Record<DispatchStatus, string> = {
  listo:     B.green,
  pendiente: B.amber,
  demorado:  B.rose,
}

const RETURN_COLOR: Record<ReturnStatus, string> = {
  'a-tiempo':  B.green,
  'tardanza':  B.rose,
  'completada': B.sky,
}

const RENTAL_COLOR: Record<RentalStatus, string> = {
  activa:      B.blue,
  'por-vencer': B.amber,
  extendida:   B.lilac,
}

// ─── Rental table columns ────────────────────────────────────────────────────

const RENTAL_COLS: Column<RentalRow>[] = [
  { key: 'unit',     header: 'Unidad',   width: 90,  sortable: true },
  { key: 'plate',    header: 'Placa',    width: 95 },
  { key: 'model',    header: 'Modelo',   width: 160 },
  { key: 'customer', header: 'Cliente' },
  { key: 'branch',   header: 'Sucursal', width: 150 },
  { key: 'start',    header: 'Inicio',   width: 85 },
  { key: 'end',      header: 'Fin',      width: 85 },
  { key: 'daysLeft', header: 'Días',     width: 60, align: 'right',
    render: (v) => {
      const n = Number(v)
      const c = n <= 1 ? B.rose : n <= 3 ? B.amber : B.green
      return <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, fontWeight: 700, color: c }}>{n}</span>
    }},
  { key: 'status',   header: 'Estado',   width: 110,
    render: (v) => <StatusBadge label={String(v).replace('-', ' ').toUpperCase()} color={RENTAL_COLOR[v as RentalStatus]} small /> },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OperationsPage() {
  const [dispatchModal, setDispatchModal] = useState<DispatchItem | null>(null)
  const [returnModal,   setReturnModal]   = useState<ReturnItem   | null>(null)

  const pendingDispatch = DISPATCH.filter(d => d.status !== 'listo').length
  const completedReturns = RETURNS.filter(r => r.status === 'completada').length

  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar />
      <main className="max-w-[1400px] mx-auto px-4 pt-7 pb-24 md:px-6 md:pb-16 lg:px-8">

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>Operaciones</h1>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '4px 0 0' }}>
              Despacho · Devoluciones · Reservas activas · Estado en tiempo real
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 9999, background: B.surface, border: `1px solid ${B.hairline}`, boxShadow: B.shadowSm }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={B.ink3} strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: B.ink2 }}>Hoy</span>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 md:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Despachos Hoy"    value={String(DISPATCH.length)}         sub={`${DISPATCH.filter(d=>d.status==='listo').length} listos`}       color={B.green} />
          <StatCard label="Pendientes"        value={String(pendingDispatch)}          sub="por preparar"                                                    color={B.amber} />
          <StatCard label="Devoluciones Hoy" value={String(RETURNS.length)}           sub={`${completedReturns} completadas`}                               color={B.blue}  />
          <StatCard label="Tardanzas"         value={String(RETURNS.filter(r=>r.status==='tardanza').length)} sub="vehículos con retraso"                   color={B.rose}  />
          <StatCard label="Activas"           value={String(RENTALS.length)}          sub={`${RENTALS.filter(r=>r.status==='por-vencer').length} por vencer`} color={B.ink2}  />
        </div>

        {/* Dispatch + Returns row */}
        <div className="grid grid-cols-1 gap-3.5 mb-3.5 lg:grid-cols-2">

          {/* Dispatch queue */}
          <div style={{ background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`, overflow: 'hidden', boxShadow: B.shadowSm }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${B.hairline}` }}>
              <SectionLabel label="Cola de Despacho" count={pendingDispatch} color={B.amber} />
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, margin: '4px 0 0' }}>Entregas programadas para hoy</p>
            </div>
            {DISPATCH.map((item, i) => (
              <div
                key={item.id}
                onClick={() => setDispatchModal(item)}
                style={{
                  display: 'grid', gridTemplateColumns: '72px 1fr 64px 100px',
                  alignItems: 'center', gap: '0 12px', padding: '11px 20px',
                  borderBottom: i < DISPATCH.length - 1 ? `1px solid ${B.hairline}` : 'none',
                  borderLeft: `2px solid ${DISPATCH_COLOR[item.status]}`,
                  cursor: 'pointer', transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = B.surface2)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, fontWeight: 700, color: B.amber }}>{item.unit}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.customer}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>{item.model}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: B.ink2, textAlign: 'right' }}>{item.scheduled}</span>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <StatusBadge label={item.status.toUpperCase()} color={DISPATCH_COLOR[item.status]} small />
                </div>
              </div>
            ))}
          </div>

          {/* Today's returns */}
          <div style={{ background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`, overflow: 'hidden', boxShadow: B.shadowSm }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${B.hairline}` }}>
              <SectionLabel label="Devoluciones del Día" count={RETURNS.filter(r => r.status !== 'completada').length} color={B.blue} />
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, margin: '4px 0 0' }}>{completedReturns} de {RETURNS.length} procesadas</p>
            </div>
            {RETURNS.map((item, i) => (
              <div
                key={item.id}
                onClick={() => setReturnModal(item)}
                style={{
                  display: 'grid', gridTemplateColumns: '72px 1fr 80px 100px',
                  alignItems: 'center', gap: '0 12px', padding: '11px 20px',
                  borderBottom: i < RETURNS.length - 1 ? `1px solid ${B.hairline}` : 'none',
                  borderLeft: `2px solid ${RETURN_COLOR[item.status]}`,
                  cursor: 'pointer', transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = B.surface2)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, fontWeight: 700, color: B.amber }}>{item.unit}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500, color: B.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.customer}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>{item.model}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FuelDot pct={item.fuelReturn} />
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: B.ink3 }}>{item.fuelReturn}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <StatusBadge label={item.status.replace('-', ' ').toUpperCase()} color={RETURN_COLOR[item.status]} small />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active rentals — full width */}
        <div style={{ background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`, overflow: 'hidden', boxShadow: B.shadowSm }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${B.hairline}` }}>
            <SectionLabel label="Reservas Activas" count={RENTALS.filter(r => r.status === 'por-vencer').length} color={B.amber} />
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: B.ink3, margin: '4px 0 0' }}>
              {RENTALS.length} vehículos en alquiler · {RENTALS.filter(r => r.status === 'por-vencer').length} vencen pronto
            </p>
          </div>
          <DataTable columns={RENTAL_COLS} rows={RENTALS} />
        </div>

      </main>

      {/* Dispatch modal */}
      {dispatchModal && (
        <DrillModal
          title={`${dispatchModal.unit} · Despacho`}
          subtitle={`${dispatchModal.model} · ${dispatchModal.plate} · ${dispatchModal.reservation}`}
          color={DISPATCH_COLOR[dispatchModal.status]}
          onClose={() => setDispatchModal(null)}
        >
          <DetailGrid rows={[
            { label: 'Unidad',      value: dispatchModal.unit },
            { label: 'Placa',       value: dispatchModal.plate },
            { label: 'Modelo',      value: dispatchModal.model },
            { label: 'Reserva',     value: dispatchModal.reservation },
            { label: 'Cliente',     value: dispatchModal.customer },
            { label: 'Hora',        value: dispatchModal.scheduled },
            { label: 'Sucursal',    value: dispatchModal.branch },
            { label: 'Combustible', value: `${dispatchModal.fuel}%` },
            { label: 'Estado',      value: dispatchModal.status.toUpperCase() },
          ]} />
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <ActionButton label="Confirmar Despacho" color={B.green}  onClick={() => setDispatchModal(null)} />
            <ActionButton label="Cerrar"              color={B.ink3} secondary onClick={() => setDispatchModal(null)} />
          </div>
        </DrillModal>
      )}

      {/* Return modal */}
      {returnModal && (
        <DrillModal
          title={`${returnModal.unit} · Devolución`}
          subtitle={`${returnModal.model} · ${returnModal.plate} · ${returnModal.reservation}`}
          color={RETURN_COLOR[returnModal.status]}
          onClose={() => setReturnModal(null)}
        >
          <DetailGrid rows={[
            { label: 'Unidad',       value: returnModal.unit },
            { label: 'Placa',        value: returnModal.plate },
            { label: 'Modelo',       value: returnModal.model },
            { label: 'Reserva',      value: returnModal.reservation },
            { label: 'Cliente',      value: returnModal.customer },
            { label: 'Hora',         value: returnModal.scheduled },
            { label: 'Sucursal',     value: returnModal.branch },
            { label: 'Combustible',  value: `${returnModal.fuelReturn}%` },
            { label: 'Km añadidos',  value: `${returnModal.kmAdded.toLocaleString()} km` },
            { label: 'Estado',       value: returnModal.status.replace('-', ' ').toUpperCase() },
          ]} />
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <ActionButton label="Procesar Devolución" color={B.blue}  onClick={() => setReturnModal(null)} />
            <ActionButton label="Cerrar"               color={B.ink3} secondary onClick={() => setReturnModal(null)} />
          </div>
        </DrillModal>
      )}

      <BentoBottomNav />
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ background: B.surface, borderRadius: 14, border: `1px solid ${B.hairline}`, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: B.shadowSm }}>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 28, fontWeight: 700, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3 }}>{sub}</span>
    </div>
  )
}

function FuelDot({ pct }: { pct: number }) {
  const color = pct < 20 ? B.rose : pct < 40 ? B.amber : B.green
  return (
    <div style={{ width: 28, height: 6, background: B.surface3, borderRadius: 9999, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 9999 }} />
    </div>
  )
}

function DetailGrid({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${B.hairline}` }}>
      {rows.map((row, idx) => (
        <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', borderBottom: idx < rows.length - 1 ? `1px solid ${B.hairline}` : 'none' }}>
          <div style={{ padding: '9px 14px', background: idx % 2 === 0 ? B.surface2 : B.surface, fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3 }}>
            {row.label}
          </div>
          <div style={{ padding: '9px 14px', background: idx % 2 === 0 ? B.surface2 : B.surface, fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink, borderLeft: `1px solid ${B.hairline}` }}>
            {row.value}
          </div>
        </div>
      ))}
    </div>
  )
}
