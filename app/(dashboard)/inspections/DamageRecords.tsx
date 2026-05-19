'use client'

import { useState } from 'react'
import { B } from '@/lib/tokens'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SectionLabel }      from '@/components/ui/SectionLabel'
import { StatusBadge }       from '@/components/ui/StatusBadge'
import { ActionButton }      from '@/components/ui/ActionButton'
import { DrillModal }        from '@/components/ui/DrillModal'

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity    = 'minor' | 'moderate' | 'major'
type RepairStatus = 'none' | 'open' | 'in_progress' | 'closed'
type Responsible  = 'client' | 'fleet' | 'unknown'

interface DamageRecord extends Record<string, unknown> {
  id: string
  unit: string; plate: string; model: string
  zone: string; type: string; severity: Severity
  rental: string; customer: string
  photos: number; repairStatus: RepairStatus
  date: string; inspector: string; notes: string
  responsible: Responsible; repairTicket: string | null
  isAlert: boolean
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_DAMAGE: DamageRecord[] = [
  {
    id: 'd1', unit: 'U-0142', plate: 'SBQ 3812', model: 'Toyota Hilux 2022',
    zone: 'Parabrisas',        type: 'Impacto chip',     severity: 'minor',
    rental: 'RES-8812', customer: 'Carlos Mendoza',  photos: 3, repairStatus: 'open',
    date: '18 May 2026', inspector: 'María González', notes: 'Pequeño chip, centro-derecha del vidrio',
    responsible: 'client', repairTicket: 'TK-0302', isAlert: false,
  },
  {
    id: 'd2', unit: 'U-0055', plate: 'SAX 4421', model: 'Renault Duster 2021',
    zone: 'Puerta delantera izq.', type: 'Rayón',         severity: 'minor',
    rental: 'RES-8799', customer: 'Roberto Herrera',  photos: 5, repairStatus: 'open',
    date: '15 May 2026', inspector: 'Luis Fernández', notes: 'Rayón de llave, aprox. 12 cm de largo',
    responsible: 'client', repairTicket: 'TK-0301', isAlert: false,
  },
  {
    id: 'd3', unit: 'U-0205', plate: 'SBH 1102', model: 'Toyota RAV4 2023',
    zone: 'Paragolpes trasero', type: 'Rozón',           severity: 'minor',
    rental: 'RES-8801', customer: 'Lucía Torres',     photos: 2, repairStatus: 'none',
    date: '17 May 2026', inspector: 'José Ramírez',   notes: 'Contacto de bajo impacto al estacionar, transferencia de pintura',
    responsible: 'client', repairTicket: null, isAlert: false,
  },
  {
    id: 'd4', unit: 'U-0033', plate: 'SAT 2290', model: 'Toyota SW4 2020',
    zone: 'Capó',               type: 'Abolladuras granizo', severity: 'moderate',
    rental: 'RES-8754', customer: 'OSE Servicios',    photos: 8, repairStatus: 'in_progress',
    date: '02 May 2026', inspector: 'María González', notes: 'Múltiples abolladuras pequeñas por granizo',
    responsible: 'fleet', repairTicket: 'TK-0297', isAlert: false,
  },
  {
    id: 'd5', unit: 'U-0088', plate: 'SBC 7751', model: 'Toyota Corolla 2023',
    zone: 'Paragolpes delantero', type: 'Abolladura colisión', severity: 'major',
    rental: 'RES-8810', customer: 'Ana Flores',       photos: 6, repairStatus: 'open',
    date: '18 May 2026', inspector: 'José Ramírez',   notes: 'Colisión de baja velocidad, paragolpes agrietado',
    responsible: 'client', repairTicket: 'TK-0303', isAlert: true,
  },
  {
    id: 'd6', unit: 'U-0119', plate: 'SBD 7730', model: 'Nissan Frontier 2022',
    zone: 'Puerta trasera izq.', type: 'Abolladura',    severity: 'moderate',
    rental: 'RES-8790', customer: 'Laura Silveira',   photos: 4, repairStatus: 'closed',
    date: '10 May 2026', inspector: 'María González', notes: 'Abolladura de estacionamiento, sin daño en pintura',
    responsible: 'client', repairTicket: 'TK-0289', isAlert: false,
  },
  {
    id: 'd7', unit: 'U-0071', plate: 'SAZ 6678', model: 'VW Amarok 2023',
    zone: 'Espejo derecho',     type: 'Tapa faltante',  severity: 'minor',
    rental: 'RES-8811', customer: 'Martín Rodríguez', photos: 1, repairStatus: 'open',
    date: '17 May 2026', inspector: 'Luis Fernández', notes: 'Tapa del espejo desprendida, mecanismo intacto',
    responsible: 'unknown', repairTicket: null, isAlert: false,
  },
  {
    id: 'd8', unit: 'U-0094', plate: 'SBB 6623', model: 'Renault Kangoo 2021',
    zone: 'Luneta',             type: 'Fisura',         severity: 'major',
    rental: 'RES-8803', customer: 'OSE Servicios',    photos: 5, repairStatus: 'in_progress',
    date: '14 May 2026', inspector: 'José Ramírez',   notes: 'Fisura completa en el tercio inferior de la luneta',
    responsible: 'client', repairTicket: 'TK-0299', isAlert: true,
  },
]

// ─── Color maps ───────────────────────────────────────────────────────────────

const SEV_COLOR: Record<Severity, string> = {
  minor:    B.amber,
  moderate: B.amber,
  major:    B.rose,
}

const REPAIR_COLOR: Record<RepairStatus, string> = {
  none:        B.sky,
  open:        B.rose,
  in_progress: B.blue,
  closed:      B.green,
}

// ─── Table columns ────────────────────────────────────────────────────────────

const COLS: Column<DamageRecord>[] = [
  { key: 'unit',         header: 'Unidad',    width: 80,  sortable: true },
  { key: 'plate',        header: 'Placa',     width: 95  },
  { key: 'zone',         header: 'Zona',      width: 150 },
  { key: 'type',         header: 'Tipo',      width: 140 },
  { key: 'severity',     header: 'Severidad', width: 100,
    render: (v) => <StatusBadge label={String(v).toUpperCase()} color={SEV_COLOR[v as Severity]} small /> },
  { key: 'rental',       header: 'Reserva',   width: 90  },
  { key: 'photos',       header: 'Fotos',     width: 65,  align: 'right',
    render: (v) => (
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: B.blue, fontWeight: 600 }}>
        {String(v)} ↗
      </span>
    )},
  { key: 'repairStatus', header: 'Reparación', width: 120,
    render: (v) => <StatusBadge label={String(v).replace('_', ' ').toUpperCase()} color={REPAIR_COLOR[v as RepairStatus]} small /> },
  { key: 'date',         header: 'Fecha',     width: 110 },
]

// ─── Car damage map SVG ───────────────────────────────────────────────────────

const ZONE_POSITIONS: Record<string, { x: number; y: number }> = {
  'Paragolpes delantero':  { x: 80, y: 22  },
  'Capó':                  { x: 80, y: 68  },
  'Parabrisas':            { x: 80, y: 116 },
  'Techo':                 { x: 80, y: 176 },
  'Luneta':                { x: 80, y: 236 },
  'Maletero':              { x: 80, y: 284 },
  'Paragolpes trasero':    { x: 80, y: 338 },
  'Puerta delantera izq.': { x: 36, y: 150 },
  'Puerta trasera izq.':   { x: 36, y: 196 },
  'Puerta delantera der.': { x: 124, y: 150 },
  'Puerta trasera der.':   { x: 124, y: 196 },
  'Espejo derecho':        { x: 144, y: 114 },
  'Espejo izquierdo':      { x: 16,  y: 114 },
}

function CarDamageMap({ zone }: { zone: string }) {
  const pos = ZONE_POSITIONS[zone]

  return (
    <svg viewBox="0 0 160 370" width={130} height={300} style={{ display: 'block' }}>
      {/* Body */}
      <rect x="24" y="8"   width="112" height="354" fill={B.surface2} stroke={B.hairline} strokeWidth="1" />

      {/* Front bumper */}
      <rect x="24" y="8"   width="112" height="28"  fill={B.surface3} stroke={B.hairline} strokeWidth="0.5" />
      {/* Hood */}
      <rect x="24" y="36"  width="112" height="62"  fill={B.surface2} stroke={B.hairline} strokeWidth="0.5" />
      {/* Windshield */}
      <rect x="34" y="98"  width="92"  height="36"  fill={B.surface3} stroke={B.hairline} strokeWidth="0.5" />
      {/* Cabin / roof */}
      <rect x="34" y="134" width="92"  height="84"  fill={B.surface3} stroke={B.hairline} strokeWidth="0.5" />
      {/* Door divider line */}
      <line x1="34" y1="176" x2="126" y2="176" stroke={B.hairline} strokeWidth="0.5" />
      {/* Rear window */}
      <rect x="34" y="218" width="92"  height="36"  fill={B.surface3} stroke={B.hairline} strokeWidth="0.5" />
      {/* Trunk */}
      <rect x="24" y="254" width="112" height="68"  fill={B.surface2} stroke={B.hairline} strokeWidth="0.5" />
      {/* Rear bumper */}
      <rect x="24" y="322" width="112" height="40"  fill={B.surface3} stroke={B.hairline} strokeWidth="0.5" />

      {/* Wheels */}
      <rect x="0"   y="58"  width="22" height="50"  fill={B.surface3} stroke={B.ink4} strokeWidth="1" />
      <rect x="138" y="58"  width="22" height="50"  fill={B.surface3} stroke={B.ink4} strokeWidth="1" />
      <rect x="0"   y="262" width="22" height="50"  fill={B.surface3} stroke={B.ink4} strokeWidth="1" />
      <rect x="138" y="262" width="22" height="50"  fill={B.surface3} stroke={B.ink4} strokeWidth="1" />

      {/* Mirrors */}
      <rect x="10"  y="108" width="14" height="16"  fill={B.surface3} stroke={B.hairline} strokeWidth="0.5" />
      <rect x="136" y="108" width="14" height="16"  fill={B.surface3} stroke={B.hairline} strokeWidth="0.5" />

      {/* Direction labels */}
      <text x="80" y="7"   textAnchor="middle" fontSize="5.5" fill={B.ink3} fontFamily="var(--font-inter)">FRENTE</text>
      <text x="80" y="368" textAnchor="middle" fontSize="5.5" fill={B.ink3} fontFamily="var(--font-inter)">ATRÁS</text>

      {/* Damage marker */}
      {pos && (
        <>
          <circle cx={pos.x} cy={pos.y} r="9" fill={`${B.rose}40`} stroke={B.rose} strokeWidth="1.5" />
          <line x1={pos.x - 4.5} y1={pos.y - 4.5} x2={pos.x + 4.5} y2={pos.y + 4.5} stroke={B.rose} strokeWidth="1.5" />
          <line x1={pos.x + 4.5} y1={pos.y - 4.5} x2={pos.x - 4.5} y2={pos.y + 4.5} stroke={B.rose} strokeWidth="1.5" />
        </>
      )}
    </svg>
  )
}

// ─── Damage detail (inside modal) ────────────────────────────────────────────

function DamageDetail({ record, onClose }: { record: DamageRecord; onClose: () => void }) {
  const DETAIL_ROWS = [
    { label: 'Unidad',       value: record.unit },
    { label: 'Placa',        value: record.plate },
    { label: 'Zona',         value: record.zone },
    { label: 'Tipo',         value: record.type },
    { label: 'Severidad',    value: record.severity.toUpperCase() },
    { label: 'Responsable',  value: record.responsible.toUpperCase() },
    { label: 'Reserva',      value: record.rental },
    { label: 'Cliente',      value: record.customer },
    { label: 'Inspector',    value: record.inspector },
    { label: 'Fecha',        value: record.date },
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Left — car damage map */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.ink3, marginBottom: 8 }}>
            Mapa de daño
          </div>
          <div style={{ border: `1px solid ${B.hairline}`, background: B.surface, borderRadius: 12, padding: 12, display: 'inline-block' }}>
            <CarDamageMap zone={record.zone} />
          </div>
          <div style={{ marginTop: 6, fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.rose }}>
            ✕ {record.zone}
          </div>
        </div>

        {/* Right — details */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Detail grid */}
          <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.ink3, marginBottom: 8 }}>
            Detalles del Daño
          </div>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${B.hairline}`, marginBottom: 16 }}>
            {DETAIL_ROWS.map((row, idx) => (
              <div key={row.label} style={{
                display: 'grid', gridTemplateColumns: '110px 1fr',
                borderBottom: idx < DETAIL_ROWS.length - 1 ? `1px solid ${B.hairline}` : 'none',
              }}>
                <div style={{
                  padding: '8px 12px',
                  background: idx % 2 === 0 ? B.surface2 : B.surface,
                  fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3,
                }}>
                  {row.label}
                </div>
                <div style={{
                  padding: '8px 12px',
                  background: idx % 2 === 0 ? B.surface2 : B.surface,
                  fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink,
                  borderLeft: `1px solid ${B.hairline}`,
                }}>
                  {row.value}
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.ink3, marginBottom: 8 }}>
              Notas
            </div>
            <div style={{
              fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink2,
              lineHeight: 1.6, padding: '10px 14px',
              border: `1px solid ${B.hairline}`, background: B.surface2, borderRadius: 10,
            }}>
              {record.notes}
            </div>
          </div>

          {/* Repair ticket */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.ink3, marginBottom: 8 }}>
              Ticket de Reparación
            </div>
            {record.repairTicket ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                border: `1px solid ${B.blue}40`, background: B.blueSoft, borderRadius: 10,
              }}>
                <span style={{ fontSize: 13, fontFamily: 'var(--font-dm-mono)', fontWeight: 700, color: B.blue }}>
                  {record.repairTicket}
                </span>
                <StatusBadge
                  label={record.repairStatus.replace('_', ' ').toUpperCase()}
                  color={REPAIR_COLOR[record.repairStatus]}
                  small
                />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink3 }}>
                  Sin ticket abierto
                </span>
                <ActionButton label="Abrir Ticket" color={B.amber} onClick={() => {}} />
              </div>
            )}
          </div>

          {/* Evidence photos */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.ink3, marginBottom: 8 }}>
              Evidencia Fotográfica ({record.photos})
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Array.from({ length: record.photos }).map((_, i) => (
                <div key={i} style={{
                  width: 56, height: 56,
                  background: B.surface2,
                  border: `1px solid ${B.hairline}`,
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink3,
                  flexShrink: 0, cursor: 'pointer',
                }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <ActionButton label="Exportar Evidencia" color={B.amber}          onClick={() => {}} />
            <ActionButton label="Cerrar"              color={B.amber} secondary onClick={onClose} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── DamageRecords ────────────────────────────────────────────────────────────

export function DamageRecords() {
  const [selected, setSelected] = useState<DamageRecord | null>(null)

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <SectionLabel label="Registro de Daños" count={MOCK_DAMAGE.length} color={B.rose} />
      </div>

      <div style={{ background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`, overflow: 'hidden', boxShadow: B.shadowSm }}>
        <DataTable
          columns={COLS}
          rows={MOCK_DAMAGE}
          onRowClick={r => setSelected(r)}
          alertKey="isAlert"
        />
      </div>

      {selected && (
        <DrillModal
          title={`${selected.unit} · INFORME DE DAÑO`}
          subtitle={`${selected.zone} · ${selected.type} · ${selected.date}`}
          color={SEV_COLOR[selected.severity]}
          onClose={() => setSelected(null)}
        >
          <DamageDetail record={selected} onClose={() => setSelected(null)} />
        </DrillModal>
      )}
    </div>
  )
}
