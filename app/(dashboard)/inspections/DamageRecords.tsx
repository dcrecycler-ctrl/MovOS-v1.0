'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
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
    zone: 'Windshield',      type: 'Impact chip',    severity: 'minor',
    rental: 'RES-8812', customer: 'Carlos Mendoza',  photos: 3, repairStatus: 'open',
    date: '18 May 2026', inspector: 'María González', notes: 'Small chip, center-right of glass',
    responsible: 'client', repairTicket: 'TK-0302', isAlert: false,
  },
  {
    id: 'd2', unit: 'U-0055', plate: 'SAX 4421', model: 'Renault Duster 2021',
    zone: 'Front left door', type: 'Scratch',         severity: 'minor',
    rental: 'RES-8799', customer: 'Roberto Herrera',  photos: 5, repairStatus: 'open',
    date: '15 May 2026', inspector: 'Luis Fernández', notes: 'Keying scratch, approx. 12 cm length',
    responsible: 'client', repairTicket: 'TK-0301', isAlert: false,
  },
  {
    id: 'd3', unit: 'U-0205', plate: 'SBH 1102', model: 'Toyota RAV4 2023',
    zone: 'Rear bumper',     type: 'Scuff',           severity: 'minor',
    rental: 'RES-8801', customer: 'Lucía Torres',     photos: 2, repairStatus: 'none',
    date: '17 May 2026', inspector: 'José Ramírez',   notes: 'Low-speed parking contact, paint transfer',
    responsible: 'client', repairTicket: null, isAlert: false,
  },
  {
    id: 'd4', unit: 'U-0033', plate: 'SAT 2290', model: 'Toyota SW4 2020',
    zone: 'Hood',            type: 'Hail dents',      severity: 'moderate',
    rental: 'RES-8754', customer: 'OSE Servicios',    photos: 8, repairStatus: 'in_progress',
    date: '02 May 2026', inspector: 'María González', notes: 'Multiple small dents from hail storm',
    responsible: 'fleet', repairTicket: 'TK-0297', isAlert: false,
  },
  {
    id: 'd5', unit: 'U-0088', plate: 'SBC 7751', model: 'Toyota Corolla 2023',
    zone: 'Front bumper',    type: 'Collision dent',  severity: 'major',
    rental: 'RES-8810', customer: 'Ana Flores',       photos: 6, repairStatus: 'open',
    date: '18 May 2026', inspector: 'José Ramírez',   notes: 'Low-speed collision, cracked bumper casing',
    responsible: 'client', repairTicket: 'TK-0303', isAlert: true,
  },
  {
    id: 'd6', unit: 'U-0119', plate: 'SBD 7730', model: 'Nissan Frontier 2022',
    zone: 'Rear left door',  type: 'Dent',            severity: 'moderate',
    rental: 'RES-8790', customer: 'Laura Silveira',   photos: 4, repairStatus: 'closed',
    date: '10 May 2026', inspector: 'María González', notes: 'Parking dent, no paint damage',
    responsible: 'client', repairTicket: 'TK-0289', isAlert: false,
  },
  {
    id: 'd7', unit: 'U-0071', plate: 'SAZ 6678', model: 'VW Amarok 2023',
    zone: 'Right mirror',    type: 'Missing cap',     severity: 'minor',
    rental: 'RES-8811', customer: 'Martín Rodríguez', photos: 1, repairStatus: 'open',
    date: '17 May 2026', inspector: 'Luis Fernández', notes: 'Mirror cap broken off, mechanism intact',
    responsible: 'unknown', repairTicket: null, isAlert: false,
  },
  {
    id: 'd8', unit: 'U-0094', plate: 'SBB 6623', model: 'Renault Kangoo 2021',
    zone: 'Rear window',     type: 'Crack',           severity: 'major',
    rental: 'RES-8803', customer: 'OSE Servicios',    photos: 5, repairStatus: 'in_progress',
    date: '14 May 2026', inspector: 'José Ramírez',   notes: 'Full crack across lower third of rear window',
    responsible: 'client', repairTicket: 'TK-0299', isAlert: true,
  },
]

// ─── Color maps ───────────────────────────────────────────────────────────────

const SEV_COLOR: Record<Severity, string> = {
  minor:    DS.yellow,
  moderate: DS.orange,
  major:    DS.red,
}

const REPAIR_COLOR: Record<RepairStatus, string> = {
  none:        DS.slate,
  open:        DS.red,
  in_progress: DS.blue,
  closed:      DS.green,
}

// ─── Table columns ────────────────────────────────────────────────────────────

const COLS: Column<DamageRecord>[] = [
  { key: 'unit',         header: 'Unit',     width: 80,  sortable: true },
  { key: 'plate',        header: 'Plate',    width: 95  },
  { key: 'zone',         header: 'Zone',     width: 150 },
  { key: 'type',         header: 'Type',     width: 140 },
  { key: 'severity',     header: 'Severity', width: 90,
    render: (v) => <StatusBadge label={String(v).toUpperCase()} color={SEV_COLOR[v as Severity]} small /> },
  { key: 'rental',       header: 'Rental',   width: 90  },
  { key: 'photos',       header: 'Photos',   width: 65,  align: 'right',
    render: (v) => (
      <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: DS.blue }}>
        {String(v)} ↗
      </span>
    )},
  { key: 'repairStatus', header: 'Repair',   width: 105,
    render: (v) => <StatusBadge label={String(v).replace('_', ' ').toUpperCase()} color={REPAIR_COLOR[v as RepairStatus]} small /> },
  { key: 'date',         header: 'Date',     width: 110 },
]

// ─── Car damage map SVG ───────────────────────────────────────────────────────

const ZONE_POSITIONS: Record<string, { x: number; y: number }> = {
  'Front bumper':    { x: 80, y: 22  },
  'Hood':            { x: 80, y: 68  },
  'Windshield':      { x: 80, y: 116 },
  'Roof':            { x: 80, y: 176 },
  'Rear window':     { x: 80, y: 236 },
  'Trunk':           { x: 80, y: 284 },
  'Rear bumper':     { x: 80, y: 338 },
  'Front left door': { x: 36, y: 150 },
  'Rear left door':  { x: 36, y: 196 },
  'Front right door':{ x: 124, y: 150 },
  'Rear right door': { x: 124, y: 196 },
  'Right mirror':    { x: 144, y: 114 },
  'Left mirror':     { x: 16,  y: 114 },
}

function CarDamageMap({ zone }: { zone: string }) {
  const pos = ZONE_POSITIONS[zone]

  return (
    <svg viewBox="0 0 160 370" width={130} height={300} style={{ display: 'block' }}>
      {/* Body */}
      <rect x="24" y="8"   width="112" height="354" fill={DS.bg2}    stroke={DS.border2} strokeWidth="1" />

      {/* Front bumper */}
      <rect x="24" y="8"   width="112" height="28"  fill={DS.bg3}    stroke={DS.border}  strokeWidth="0.5" />
      {/* Hood */}
      <rect x="24" y="36"  width="112" height="62"  fill={DS.bg2}    stroke={DS.border}  strokeWidth="0.5" />
      {/* Windshield */}
      <rect x="34" y="98"  width="92"  height="36"  fill={DS.bg3}    stroke={DS.border}  strokeWidth="0.5" />
      {/* Cabin / roof */}
      <rect x="34" y="134" width="92"  height="84"  fill={DS.bg3}    stroke={DS.border}  strokeWidth="0.5" />
      {/* Door divider line */}
      <line x1="34" y1="176" x2="126" y2="176" stroke={DS.border} strokeWidth="0.5" />
      {/* Rear window */}
      <rect x="34" y="218" width="92"  height="36"  fill={DS.bg3}    stroke={DS.border}  strokeWidth="0.5" />
      {/* Trunk */}
      <rect x="24" y="254" width="112" height="68"  fill={DS.bg2}    stroke={DS.border}  strokeWidth="0.5" />
      {/* Rear bumper */}
      <rect x="24" y="322" width="112" height="40"  fill={DS.bg3}    stroke={DS.border}  strokeWidth="0.5" />

      {/* Wheels */}
      <rect x="0"   y="58"  width="22" height="50"  fill={DS.bg3} stroke={DS.border2} strokeWidth="1" />
      <rect x="138" y="58"  width="22" height="50"  fill={DS.bg3} stroke={DS.border2} strokeWidth="1" />
      <rect x="0"   y="262" width="22" height="50"  fill={DS.bg3} stroke={DS.border2} strokeWidth="1" />
      <rect x="138" y="262" width="22" height="50"  fill={DS.bg3} stroke={DS.border2} strokeWidth="1" />

      {/* Mirrors */}
      <rect x="10"  y="108" width="14" height="16"  fill={DS.bg3} stroke={DS.border} strokeWidth="0.5" />
      <rect x="136" y="108" width="14" height="16"  fill={DS.bg3} stroke={DS.border} strokeWidth="0.5" />

      {/* Direction labels */}
      <text x="80" y="7"   textAnchor="middle" fontSize="5.5" fill={DS.muted} fontFamily="monospace">FRONT</text>
      <text x="80" y="368" textAnchor="middle" fontSize="5.5" fill={DS.muted} fontFamily="monospace">REAR</text>

      {/* Damage marker */}
      {pos && (
        <>
          <circle cx={pos.x} cy={pos.y} r="9" fill={`${DS.red}40`} stroke={DS.red} strokeWidth="1.5" />
          <line x1={pos.x - 4.5} y1={pos.y - 4.5} x2={pos.x + 4.5} y2={pos.y + 4.5} stroke={DS.red} strokeWidth="1.5" />
          <line x1={pos.x + 4.5} y1={pos.y - 4.5} x2={pos.x - 4.5} y2={pos.y + 4.5} stroke={DS.red} strokeWidth="1.5" />
        </>
      )}
    </svg>
  )
}

// ─── Damage detail (inside modal) ────────────────────────────────────────────

function DamageDetail({ record, onClose }: { record: DamageRecord; onClose: () => void }) {
  const DETAIL_ROWS = [
    { label: 'Unit ID',     value: record.unit },
    { label: 'Plate',       value: record.plate },
    { label: 'Zone',        value: record.zone },
    { label: 'Type',        value: record.type },
    { label: 'Severity',    value: record.severity.toUpperCase() },
    { label: 'Responsible', value: record.responsible.toUpperCase() },
    { label: 'Rental',      value: record.rental },
    { label: 'Customer',    value: record.customer },
    { label: 'Inspector',   value: record.inspector },
    { label: 'Date',        value: record.date },
  ]

  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Left — car damage map */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Damage Map
          </div>
          <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)', padding: 12, display: 'inline-block' }}>
            <CarDamageMap zone={record.zone} />
          </div>
          <div style={{ marginTop: 6, fontSize: 9, fontFamily: FONTS.mono, color: DS.red, letterSpacing: '0.04em' }}>
            ✕ {record.zone}
          </div>
        </div>

        {/* Right — details */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Detail grid */}
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Damage Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 1, background: 'var(--ds-border)', marginBottom: 16 }}>
            {DETAIL_ROWS.flatMap(row => [
              <div key={`${row.label}-l`} style={{
                padding: '7px 10px', background: 'var(--ds-bg-1)',
                fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)',
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>
                {row.label}
              </div>,
              <div key={`${row.label}-v`} style={{
                padding: '7px 10px', background: 'var(--ds-bg-1)',
                fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-text)',
              }}>
                {row.value}
              </div>,
            ])}
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Notes
            </div>
            <div style={{
              fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-dim)',
              lineHeight: 1.6, padding: '8px 10px',
              border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)',
            }}>
              {record.notes}
            </div>
          </div>

          {/* Repair ticket */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Repair Ticket
            </div>
            {record.repairTicket ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px',
                border: `1px solid ${DS.blue}54`, background: `${DS.blue}08`,
              }}>
                <span style={{ fontSize: 11, fontFamily: FONTS.mono, color: DS.blue }}>
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
                <span style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-muted)' }}>
                  No ticket opened yet
                </span>
                <ActionButton label="Open Ticket" color={DS.orange} onClick={() => {}} />
              </div>
            )}
          </div>

          {/* Evidence photos */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Evidence Photos ({record.photos})
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Array.from({ length: record.photos }).map((_, i) => (
                <div key={i} style={{
                  width: 56, height: 56,
                  background: 'var(--ds-bg-3)',
                  border: '1px solid var(--ds-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)',
                  flexShrink: 0, cursor: 'pointer',
                }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <ActionButton label="Export Evidence" color={DS.gold}          onClick={() => {}} />
            <ActionButton label="Close"           color={DS.gold} secondary onClick={onClose} />
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
      <div style={{ marginBottom: 12 }}>
        <SectionLabel label="Damage Records" count={MOCK_DAMAGE.length} color={DS.red} />
      </div>

      <div style={{ border: '1px solid var(--ds-border)' }}>
        <DataTable
          columns={COLS}
          rows={MOCK_DAMAGE}
          onRowClick={r => setSelected(r)}
          alertKey="isAlert"
        />
      </div>

      {selected && (
        <DrillModal
          title={`${selected.unit} · DAMAGE REPORT`}
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
