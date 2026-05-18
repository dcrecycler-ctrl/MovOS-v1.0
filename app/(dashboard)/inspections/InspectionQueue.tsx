'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SectionLabel }      from '@/components/ui/SectionLabel'
import { StatusBadge }       from '@/components/ui/StatusBadge'
import { ActionButton }      from '@/components/ui/ActionButton'
import { DrillModal }        from '@/components/ui/DrillModal'

// ─── Types ────────────────────────────────────────────────────────────────────

type InspType   = 'pickup' | 'return' | 'periodic'
type InspStatus = 'pending' | 'in_progress' | 'completed'

interface QueueItem extends Record<string, unknown> {
  id: string
  unit: string; plate: string; model: string
  type: InspType; customer: string; scheduled: string
  branch: string; status: InspStatus
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_QUEUE: QueueItem[] = [
  { id: 'i1', unit: 'U-0142', plate: 'SBQ 3812', model: 'Hilux 2022',     type: 'return',   customer: 'Carlos Mendoza',    scheduled: '09:00', branch: 'Loc A PDE', status: 'in_progress' },
  { id: 'i2', unit: 'U-0087', plate: 'SBC 1243', model: 'Corolla 2023',   type: 'pickup',   customer: 'Ana Flores',        scheduled: '09:30', branch: 'Loc A PDE', status: 'pending'     },
  { id: 'i3', unit: 'U-0201', plate: 'SBF 9912', model: 'RAV4 2023',      type: 'periodic', customer: '—',                 scheduled: '10:00', branch: 'Loc B MVD', status: 'pending'     },
  { id: 'i4', unit: 'U-0055', plate: 'SAX 4421', model: 'Duster 2021',    type: 'pickup',   customer: 'Roberto Herrera',   scheduled: '10:30', branch: 'Loc A PDE', status: 'pending'     },
  { id: 'i5', unit: 'U-0119', plate: 'SBD 7730', model: 'Frontier 2022',  type: 'return',   customer: 'Laura Silveira',    scheduled: '11:00', branch: 'Loc C CLN', status: 'pending'     },
  { id: 'i6', unit: 'U-0033', plate: 'SAT 2290', model: 'SW4 2020',       type: 'periodic', customer: '—',                 scheduled: '11:30', branch: 'Loc B MVD', status: 'pending'     },
  { id: 'i7', unit: 'U-0178', plate: 'SBG 5514', model: 'Amarok 2023',    type: 'pickup',   customer: 'Martín Rodríguez',  scheduled: '13:00', branch: 'Loc A PDE', status: 'pending'     },
  { id: 'i8', unit: 'U-0094', plate: 'SBB 6623', model: 'Kangoo 2021',    type: 'return',   customer: 'OSE Servicios',     scheduled: '14:00', branch: 'Loc A PDE', status: 'pending'     },
]

// ─── Colors ───────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<InspStatus, string> = {
  pending:     DS.yellow,
  in_progress: DS.blue,
  completed:   DS.green,
}

const TYPE_COLOR: Record<InspType, string> = {
  pickup:   DS.green,
  return:   DS.orange,
  periodic: DS.purple,
}

// ─── Filter config ────────────────────────────────────────────────────────────

const FILTERS: { id: InspType | 'all'; label: string }[] = [
  { id: 'all',      label: 'All'      },
  { id: 'pickup',   label: 'Pickup'   },
  { id: 'return',   label: 'Return'   },
  { id: 'periodic', label: 'Periodic' },
]

// ─── Table columns ────────────────────────────────────────────────────────────

const COLS: Column<QueueItem>[] = [
  { key: 'unit',      header: 'Unit',      width: 80,  sortable: true },
  { key: 'plate',     header: 'Plate',     width: 95  },
  { key: 'model',     header: 'Model',     width: 130 },
  { key: 'type',      header: 'Type',      width: 90,
    render: (v) => <StatusBadge label={String(v).toUpperCase()} color={TYPE_COLOR[v as InspType]} small /> },
  { key: 'customer',  header: 'Customer'  },
  { key: 'scheduled', header: 'Scheduled', width: 80, align: 'right' },
  { key: 'branch',    header: 'Branch',    width: 100 },
  { key: 'status',    header: 'Status',    width: 115,
    render: (v) => <StatusBadge label={String(v).replace('_', ' ').toUpperCase()} color={STATUS_COLOR[v as InspStatus]} small /> },
]

// ─── InspectionQueue ──────────────────────────────────────────────────────────

export function InspectionQueue() {
  const [filter,   setFilter]   = useState<InspType | 'all'>('all')
  const [selected, setSelected] = useState<QueueItem | null>(null)

  const rows = filter === 'all' ? MOCK_QUEUE : MOCK_QUEUE.filter(r => r.type === filter)
  const pending = rows.filter(r => r.status !== 'completed').length

  return (
    <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>

      {/* Header + filter tabs */}
      <div style={{ padding: '14px 14px 0', borderBottom: '1px solid var(--ds-border)' }}>
        <div style={{ marginBottom: 10 }}>
          <SectionLabel label="Inspection Queue" count={pending} color={DS.blue} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {FILTERS.map(f => {
              const active = filter === f.id
              return (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  height: 32, padding: '0 16px',
                  fontSize: 9, fontFamily: FONTS.mono, textTransform: 'uppercase', letterSpacing: '0.08em',
                  color:      active ? DS.blue : 'var(--ds-dim)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: active ? `2px solid ${DS.blue}` : '2px solid transparent',
                  cursor: 'pointer', flexShrink: 0,
                }}>
                  {f.label}
                </button>
              )
            })}
          </div>
          <span style={{ flexShrink: 0, fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', paddingRight: 14, letterSpacing: '0.06em' }}>
            {rows.length} inspection{rows.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={COLS} rows={rows} onRowClick={r => setSelected(r)} />

      {/* Detail modal */}
      {selected && (
        <DrillModal
          title={`${selected.unit} · ${String(selected.type).toUpperCase()} INSPECTION`}
          subtitle={`${selected.model} · ${selected.plate} · Scheduled ${selected.scheduled}`}
          color={TYPE_COLOR[selected.type]}
          onClose={() => setSelected(null)}
        >
          <InspectionDetail item={selected} onClose={() => setSelected(null)} />
        </DrillModal>
      )}
    </div>
  )
}

// ─── Inspection detail (inside modal) ────────────────────────────────────────

const CHECKLIST_SECTIONS = [
  { label: 'Exterior condition',  zones: ['Front bumper', 'Hood', 'Driver door', 'Pass. door', 'Rear doors', 'Trunk', 'Rear bumper', 'Roof'] },
  { label: 'Glass & mirrors',     zones: ['Windshield', 'Rear glass', 'Side mirrors (2)'] },
  { label: 'Interior',            zones: ['Seats', 'Dashboard', 'Carpets', 'Ceiling liner'] },
  { label: 'Mechanical',          zones: ['Tires (4)', 'Brakes', 'Engine bay', 'Fluid levels'] },
  { label: 'Fuel level',          zones: ['Current reading required'] },
  { label: 'Odometer',            zones: ['Current reading required'] },
  { label: 'Accessories',         zones: ['Jack & triangle', 'Documents in glove box'] },
]

function InspectionDetail({ item, onClose }: { item: QueueItem; onClose: () => void }) {
  const [started, setStarted] = useState(item.status === 'in_progress')

  const DETAIL_ROWS = [
    { label: 'Unit ID',   value: String(item.unit) },
    { label: 'Plate',     value: String(item.plate) },
    { label: 'Model',     value: String(item.model) },
    { label: 'Type',      value: String(item.type).toUpperCase() },
    { label: 'Customer',  value: String(item.customer) },
    { label: 'Branch',    value: String(item.branch) },
    { label: 'Scheduled', value: String(item.scheduled) },
    { label: 'Status',    value: String(item.status).replace('_', ' ').toUpperCase() },
  ]

  return (
    <div style={{ padding: '20px 24px' }}>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 1, background: 'var(--ds-border)', marginBottom: 20 }}>
        {DETAIL_ROWS.flatMap(row => [
          <div key={`${row.label}-l`} style={{
            padding: '8px 12px', background: 'var(--ds-bg-1)',
            fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {row.label}
          </div>,
          <div key={`${row.label}-v`} style={{
            padding: '8px 12px', background: 'var(--ds-bg-1)',
            fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-text)',
          }}>
            {row.value}
          </div>,
        ])}
      </div>

      {/* Checklist */}
      <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        Inspection Checklist
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--ds-border)', marginBottom: 20 }}>
        {CHECKLIST_SECTIONS.map(section => (
          <div key={section.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            background: 'var(--ds-bg-1)', padding: '10px 14px', gap: 12,
          }}>
            <span style={{ fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-text)', flexShrink: 0 }}>
              {section.label}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'flex-end' }}>
              {section.zones.map(z => (
                <span key={z} style={{
                  fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)',
                  background: 'var(--ds-bg-2)', padding: '2px 6px',
                  border: '1px solid var(--ds-border)', letterSpacing: '0.06em',
                }}>
                  {z}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        {!started
          ? <ActionButton label="Start Inspection"    color={DS.green} onClick={() => setStarted(true)} />
          : <ActionButton label="Complete Inspection" color={DS.blue}  onClick={onClose} />
        }
        <ActionButton label="Cancel" color={DS.red} secondary onClick={onClose} />
      </div>
    </div>
  )
}
