'use client'

import { useState } from 'react'
import { B } from '@/lib/tokens'
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
  pending:     B.amber,
  in_progress: B.blue,
  completed:   B.green,
}

const TYPE_COLOR: Record<InspType, string> = {
  pickup:   B.green,
  return:   B.amber,
  periodic: B.lilac,
}

// ─── Filter config ────────────────────────────────────────────────────────────

const FILTERS: { id: InspType | 'all'; label: string }[] = [
  { id: 'all',      label: 'Todos'     },
  { id: 'pickup',   label: 'Recogida'  },
  { id: 'return',   label: 'Devolución'},
  { id: 'periodic', label: 'Periódica' },
]

// ─── Table columns ────────────────────────────────────────────────────────────

const COLS: Column<QueueItem>[] = [
  { key: 'unit',      header: 'Unidad',    width: 80,  sortable: true },
  { key: 'plate',     header: 'Placa',     width: 95  },
  { key: 'model',     header: 'Modelo',    width: 130 },
  { key: 'type',      header: 'Tipo',      width: 100,
    render: (v) => <StatusBadge label={String(v).toUpperCase()} color={TYPE_COLOR[v as InspType]} small /> },
  { key: 'customer',  header: 'Cliente'  },
  { key: 'scheduled', header: 'Hora',      width: 80, align: 'right' },
  { key: 'branch',    header: 'Sucursal',  width: 100 },
  { key: 'status',    header: 'Estado',    width: 120,
    render: (v) => <StatusBadge label={String(v).replace('_', ' ').toUpperCase()} color={STATUS_COLOR[v as InspStatus]} small /> },
]

// ─── InspectionQueue ──────────────────────────────────────────────────────────

export function InspectionQueue() {
  const [filter,   setFilter]   = useState<InspType | 'all'>('all')
  const [selected, setSelected] = useState<QueueItem | null>(null)

  const rows = filter === 'all' ? MOCK_QUEUE : MOCK_QUEUE.filter(r => r.type === filter)
  const pending = rows.filter(r => r.status !== 'completed').length

  return (
    <div style={{ background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`, overflow: 'hidden', boxShadow: B.shadowSm }}>

      {/* Header + filter tabs */}
      <div style={{ padding: '18px 20px 0', borderBottom: `1px solid ${B.hairline}` }}>
        <div style={{ marginBottom: 14 }}>
          <SectionLabel label="Cola de Inspección" count={pending} color={B.blue} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {FILTERS.map(f => {
              const active = filter === f.id
              return (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  height: 36, padding: '0 14px',
                  fontSize: 13, fontFamily: 'var(--font-inter)', fontWeight: active ? 600 : 400,
                  color:      active ? B.ink : B.ink3,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${active ? B.blue : 'transparent'}`,
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'color 0.1s, border-color 0.1s',
                }}>
                  {f.label}
                </button>
              )
            })}
          </div>
          <span style={{ flexShrink: 0, fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink3, paddingRight: 20 }}>
            {rows.length} inspección{rows.length !== 1 ? 'es' : ''}
          </span>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={COLS} rows={rows} onRowClick={r => setSelected(r)} />

      {/* Detail modal */}
      {selected && (
        <DrillModal
          title={`${selected.unit} · Inspección ${String(selected.type).toUpperCase()}`}
          subtitle={`${selected.model} · ${selected.plate} · Programada ${selected.scheduled}`}
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
  { label: 'Exterior',       zones: ['Paragolpes delantero', 'Capó', 'Puerta conductor', 'Puerta pasajero', 'Puertas traseras', 'Maletero', 'Paragolpes trasero', 'Techo'] },
  { label: 'Vidrios',        zones: ['Parabrisas', 'Luneta', 'Espejos laterales (2)'] },
  { label: 'Interior',       zones: ['Asientos', 'Tablero', 'Alfombras', 'Cielo raso'] },
  { label: 'Mecánica',       zones: ['Neumáticos (4)', 'Frenos', 'Motor', 'Niveles de fluidos'] },
  { label: 'Combustible',    zones: ['Lectura actual requerida'] },
  { label: 'Odómetro',       zones: ['Lectura actual requerida'] },
  { label: 'Accesorios',     zones: ['Gato y triángulo', 'Documentos en guantera'] },
]

function InspectionDetail({ item, onClose }: { item: QueueItem; onClose: () => void }) {
  const [started, setStarted] = useState(item.status === 'in_progress')

  const DETAIL_ROWS = [
    { label: 'Unidad',      value: String(item.unit) },
    { label: 'Placa',       value: String(item.plate) },
    { label: 'Modelo',      value: String(item.model) },
    { label: 'Tipo',        value: String(item.type).toUpperCase() },
    { label: 'Cliente',     value: String(item.customer) },
    { label: 'Sucursal',    value: String(item.branch) },
    { label: 'Hora',        value: String(item.scheduled) },
    { label: 'Estado',      value: String(item.status).replace('_', ' ').toUpperCase() },
  ]

  return (
    <div>
      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', borderRadius: 12, overflow: 'hidden', border: `1px solid ${B.hairline}`, marginBottom: 20 }}>
        {DETAIL_ROWS.flatMap((row, idx) => [
          <div key={`${row.label}-l`} style={{
            padding: '9px 14px',
            background: idx % 2 === 0 ? B.surface2 : B.surface,
            fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink3,
          }}>
            {row.label}
          </div>,
          <div key={`${row.label}-v`} style={{
            padding: '9px 14px',
            background: idx % 2 === 0 ? B.surface2 : B.surface,
            fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink,
            borderLeft: `1px solid ${B.hairline}`,
          }}>
            {row.value}
          </div>,
        ])}
      </div>

      {/* Checklist */}
      <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.ink3, marginBottom: 10 }}>
        Lista de verificación
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
        {CHECKLIST_SECTIONS.map(section => (
          <div key={section.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            background: B.surface, border: `1px solid ${B.hairline}`, borderRadius: 10,
            padding: '10px 14px', gap: 12,
          }}>
            <span style={{ fontSize: 13, fontFamily: 'var(--font-inter)', fontWeight: 500, color: B.ink, flexShrink: 0 }}>
              {section.label}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'flex-end' }}>
              {section.zones.map(z => (
                <span key={z} style={{
                  fontSize: 10, fontFamily: 'var(--font-inter)', color: B.ink3,
                  background: B.surface2, padding: '2px 8px',
                  border: `1px solid ${B.hairline}`, borderRadius: 9999,
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
          ? <ActionButton label="Iniciar Inspección"    color={B.green} onClick={() => setStarted(true)} />
          : <ActionButton label="Completar Inspección"  color={B.blue}  onClick={onClose} />
        }
        <ActionButton label="Cancelar" color={B.rose} secondary onClick={onClose} />
      </div>
    </div>
  )
}
