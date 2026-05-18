'use client'

import { CSSProperties, ReactNode, useEffect, useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { createClient } from '@/lib/supabase/client'
import { KPICard }      from '@/components/ui/KPICard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatusBadge }  from '@/components/ui/StatusBadge'
import { DataTable, Column } from '@/components/ui/DataTable'
import { DrillModal }   from '@/components/ui/DrillModal'
import { AlertRow }     from '@/components/ui/AlertRow'
import { PageHeader }   from '@/components/ui/PageHeader'
import { AppNav }       from '@/components/ui/AppNav'
import { BottomNav }    from '@/components/ui/BottomNav'
import type {
  QueryResult, FleetStats, CriticalAlert, ServiceAlert,
  LocationStat, PartsRequest, ContractRow,
} from '@/lib/supabase/queries/dashboard'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DashboardData {
  stats:         QueryResult<FleetStats>
  alerts:        QueryResult<CriticalAlert[]>
  serviceAlerts: QueryResult<ServiceAlert[]>
  locations:     QueryResult<LocationStat[]>
  parts:         QueryResult<PartsRequest[]>
  contracts:     QueryResult<ContractRow[]>
}

// ─── Modal vehicle rows ───────────────────────────────────────────────────────

interface ModalVehicle extends Record<string, unknown> {
  unit: string; plate: string; model: string
  location: string; status: string
}

const MODAL_VEHICLE_COLS: Column<ModalVehicle>[] = [
  { key: 'unit',     header: 'Unit',     width: 90,  sortable: true },
  { key: 'plate',    header: 'Plate',    width: 100 },
  { key: 'model',    header: 'Model',    sortable: true },
  { key: 'location', header: 'Location' },
  { key: 'status',   header: 'Status',  width: 120,
    render: (v) => {
      const c = v === 'assigned'    ? DS.blue
              : v === 'available'   ? DS.green
              : v === 'maintenance' ? DS.orange : DS.yellow
      return <StatusBadge label={String(v)} color={c} small />
    }},
]

interface ModalState {
  title: string; subtitle?: string; color: string
  statusFilter?: string
  vehicles: ModalVehicle[]; loading: boolean; fetchError: string | null
}

const BRANCH_FILTERS = [
  { value: 'all',   label: 'All Branches' },
  { value: 'loc-a', label: 'Loc A' },
  { value: 'loc-b', label: 'Loc B' },
  { value: 'loc-c', label: 'Loc C' },
  { value: 'loc-d', label: 'Loc D' },
]

type SARow = ServiceAlert & Record<string, unknown>

const SERVICE_COLS: Column<SARow>[] = [
  { key: 'unit',         header: 'Unit',    width: 80 },
  { key: 'plate',        header: 'Plate',   width: 95 },
  { key: 'service',      header: 'Service' },
  { key: 'vehicle',      header: 'Vehicle' },
  { key: 'deltaDisplay', header: 'Delta',   width: 110, align: 'right',
    render: (v, row) => (
      <span style={{ color: (row as SARow).overdue ? DS.red : DS.yellow, fontFamily: FONTS.mono, fontSize: 11 }}>
        {String(v)}
      </span>
    )},
  { key: 'level', header: 'Level', width: 90,
    render: (v) => <StatusBadge label={String(v)} color={v === 'CRITICAL' ? DS.red : DS.yellow} small /> },
]

type PRRow = PartsRequest & Record<string, unknown>

const PART_COLS: Column<PRRow>[] = [
  { key: 'unit', header: 'Unit', width: 75 },
  { key: 'part', header: 'Part' },
  { key: 'shop', header: 'Shop' },
  { key: 'priority', header: 'Pri', width: 80,
    render: (v) => {
      const c = v === 'critical' ? DS.red : v === 'high' ? DS.orange : DS.yellow
      return <StatusBadge label={String(v)} color={c} small />
    }},
]

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardClient({
  stats, alerts, serviceAlerts, locations, parts, contracts,
}: DashboardData) {
  const [branch, setBranch] = useState('all')
  const [modal, setModal]   = useState<ModalState | null>(null)

  useEffect(() => {
    if (!modal || !modal.loading) return
    const supabase = createClient()
    let q = supabase
      .from('vehicles')
      .select('unit_id, plate, make, model, year, status, locations(name)')
      .limit(50)
    if (modal.statusFilter) q = q.eq('status', modal.statusFilter)
    q.then(({ data, error }) => {
      setModal(prev => {
        if (!prev) return null
        if (error) return { ...prev, loading: false, fetchError: 'Could not load vehicles' }
        const vehicles: ModalVehicle[] = (data ?? []).map(v => ({
          unit:     v.unit_id,
          plate:    v.plate,
          model:    `${v.make} ${v.model} ${v.year}`,
          location: (v.locations as unknown as { name: string } | null)?.name ?? '—',
          status:   v.status,
        }))
        return { ...prev, loading: false, vehicles, fetchError: null }
      })
    })
  }, [modal?.loading, modal?.statusFilter])

  function openModal(title: string, subtitle: string, color: string, statusFilter?: string) {
    setModal({ title, subtitle, color, statusFilter, vehicles: [], loading: true, fetchError: null })
  }

  const st = stats.data

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ds-bg)', fontFamily: FONTS.mono }}>
      <AppNav active="Tablero" />

      {/* ── Page content ────────────────────────────────────────────── */}
      <div
        className="max-w-[1440px] mx-auto px-4 pt-7 pb-20 md:px-5 md:pb-16 lg:px-9"
      >
        <PageHeader
          title="TABLERO"
          subtitle="Fleet operations overview · Live data"
          filters={BRANCH_FILTERS}
          activeFilter={branch}
          onFilterChange={setBranch}
        />

        {/* ── ROW 1 · KPI Cards ──────────────────────────────────────── */}
        {stats.error && <SectionError message={stats.error} />}
        <div
          className="grid grid-cols-2 gap-px mb-5 md:grid-cols-3 lg:grid-cols-5"
          style={{ background: 'var(--ds-border)' }}
        >
          <KPICard
            label="Total Fleet"
            value={st.total.toLocaleString()}
            sub={`${st.maintenanceCount} maintenance · ${st.inspectionCount} inspection`}
            subColor={DS.orange} color={DS.gold}
            onClick={() => openModal('TOTAL FLEET', `${st.total.toLocaleString()} registered vehicles`, DS.gold)}
          />
          <KPICard
            label="Available"
            value={st.available.toLocaleString()}
            sub="Ready to rent now"
            subColor={DS.green} color={DS.green}
            onClick={() => openModal('AVAILABLE', `${st.available} vehicles ready to rent`, DS.green, 'available')}
          />
          <KPICard
            label="Assigned"
            value={st.assigned.toLocaleString()}
            sub="Currently on rent"
            subColor={DS.blue} color={DS.blue}
            onClick={() => openModal('ASSIGNED', `${st.assigned} vehicles on active rent`, DS.blue, 'assigned')}
          />
          <KPICard
            label="Utilization"
            value={`${st.utilization}%`}
            sub="Assigned ÷ total fleet"
            subColor={DS.gold} color={DS.gold}
            onClick={() => openModal('UTILIZATION', `${st.utilization}% · Assigned ÷ Total Fleet`, DS.gold)}
          />
          <KPICard
            label="Out of Service"
            value={st.outOfService.toLocaleString()}
            sub={`${st.maintenanceCount} maint · ${st.inspectionCount} inspection`}
            subColor={DS.red} color={DS.red}
            onClick={() => openModal('OUT OF SERVICE', `${st.outOfService} vehicles unavailable`, DS.red, 'maintenance')}
          />
        </div>

        {/* ── ROW 2 · Alerts ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-3.5 mb-5 md:flex-row md:items-start">

          <Panel
            label="Critical Alerts" count={alerts.data.length} color={DS.red}
            footer="VIEW ALL CRITICAL ALERTS →"
            onFooter={() => openModal('CRITICAL ALERTS', 'Open critical alerts', DS.red)}
            className="w-full md:flex-1"
          >
            {alerts.error
              ? <SectionError message={alerts.error} />
              : alerts.data.length === 0
                ? <EmptyState message="No open critical alerts" />
                : alerts.data.map(a => (
                    <AlertRow
                      key={a.id}
                      unit={a.unit} plate={a.plate} message={a.message}
                      time={a.timeAgo} urgent={a.urgent}
                      onClick={() => openModal(a.unit, a.message, DS.red)}
                    />
                  ))
            }
            <div style={{ display: 'flex', gap: 10, padding: '8px 14px', borderTop: '1px solid var(--ds-border)' }}>
              <StatusBadge label="Damage"  color={DS.red}    small />
              <StatusBadge label="Manager" color={DS.orange} small />
            </div>
          </Panel>

          <Panel
            label="Service Interval Alerts" count={serviceAlerts.data.length} color={DS.yellow}
            footer="VIEW ALL SERVICE ALERTS →"
            onFooter={() => openModal('SERVICE ALERTS', 'Vehicles past service interval', DS.yellow)}
            className="w-full md:flex-1"
          >
            {serviceAlerts.error
              ? <SectionError message={serviceAlerts.error} />
              : serviceAlerts.data.length === 0
                ? <EmptyState message="All services up to date" />
                : <DataTable
                    columns={SERVICE_COLS}
                    rows={serviceAlerts.data as SARow[]}
                    alertKey="overdue"
                    onRowClick={r => openModal(r.unit, r.service, DS.yellow)}
                  />
            }
          </Panel>
        </div>

        {/* ── ROW 3 · Fleet by Location + Parts ──────────────────────── */}
        <div className="flex flex-col gap-3.5 mb-5 items-start lg:flex-row">

          <div className="w-full lg:flex-[2]" style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>
            <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
              <SectionLabel label="Fleet by Location" color={DS.blue} />
            </div>
            {locations.error
              ? <SectionError message={locations.error} />
              : locations.data.length === 0
                ? <EmptyState message="No locations configured" />
                : <div
                    className="grid grid-cols-1 gap-px sm:grid-cols-2"
                    style={{ background: 'var(--ds-border)' }}
                  >
                    {locations.data.map(loc => (
                      <LocationCard key={loc.id} {...loc}
                        onClick={() => openModal(
                          loc.name.toUpperCase(),
                          `${loc.units} vehicles · ${loc.city}`,
                          loc.color,
                        )}
                      />
                    ))}
                  </div>
            }
          </div>

          <Panel
            label="Parts Requests" count={parts.data.length} color={DS.purple}
            footer="VIEW ALL →"
            onFooter={() => openModal('PARTS REQUESTS', 'All pending parts requests', DS.purple)}
            className="w-full lg:flex-1"
          >
            {parts.error
              ? <SectionError message={parts.error} />
              : parts.data.length === 0
                ? <EmptyState message="No pending parts requests" />
                : <DataTable
                    columns={PART_COLS}
                    rows={parts.data as PRRow[]}
                    onRowClick={() => openModal('PARTS REQUESTS', 'All pending parts requests', DS.purple)}
                  />
            }
          </Panel>
        </div>

        {/* ── ROW 4 · Contracts ──────────────────────────────────────── */}
        <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>
          <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
            <SectionLabel
              label="Long-Term Contracts"
              count={contracts.data.reduce((acc, c) => acc + c.units, 0)}
              color={DS.gold}
            />
          </div>
          {contracts.error
            ? <SectionError message={contracts.error} />
            : contracts.data.length === 0
              ? <EmptyState message="No active contracts" />
              : <div
                  className="grid grid-cols-1 gap-px sm:grid-cols-2"
                  style={{ background: 'var(--ds-border)' }}
                >
                  {contracts.data.map(c => (
                    <ContractCard key={c.id} {...c}
                      onClick={() => openModal(c.client.toUpperCase(), `${c.units} vehicles · ${c.type}`, c.color)}
                    />
                  ))}
                </div>
          }
          <FooterRow label="VIEW ALL CONTRACTS →" color={DS.gold}
            onClick={() => openModal('CONTRACTS', 'All long-term fleet contracts', DS.gold)} />
        </div>
      </div>

      {/* ── Mobile bottom nav ───────────────────────────────────────── */}
      <BottomNav active="Dashboard" />

      {/* ── DrillModal ──────────────────────────────────────────────── */}
      {modal && (
        <DrillModal
          title={modal.title}
          subtitle={modal.subtitle}
          color={modal.color}
          onClose={() => setModal(null)}
        >
          {modal.fetchError
            ? <SectionError message={modal.fetchError} />
            : modal.loading
              ? <ModalSkeleton />
              : modal.vehicles.length === 0
                ? <EmptyState message="No vehicles match this filter" />
                : <DataTable columns={MODAL_VEHICLE_COLS} rows={modal.vehicles} onRowClick={() => {}} />
          }
        </DrillModal>
      )}
    </div>
  )
}

// ─── Page-local display components ───────────────────────────────────────────

function Panel({
  label, count, color, footer, onFooter, children, style, className,
}: {
  label: string; count?: number; color: string
  footer?: string; onFooter?: () => void
  children: ReactNode; style?: CSSProperties; className?: string
}) {
  return (
    <div
      className={className}
      style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)', display: 'flex', flexDirection: 'column', ...style }}
    >
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)', flexShrink: 0 }}>
        <SectionLabel label={label} count={count} color={color} />
      </div>
      <div style={{ flex: 1 }}>{children}</div>
      {footer && <FooterRow label={footer} color={color} onClick={onFooter} />}
    </div>
  )
}

function FooterRow({ label, color, onClick }: { label: string; color: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 36, borderTop: '1px solid var(--ds-border)',
        fontSize: 9, fontFamily: FONTS.mono, textTransform: 'uppercase',
        letterSpacing: '0.1em', color,
        background: hovered ? `${color}14` : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.15s',
      }}
    >
      {label}
    </div>
  )
}

function LocationCard({
  name, city, units, available, assigned, maintenance, color, onClick,
}: LocationStat & { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  const pct = units > 0 ? assigned / units : 0
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '16px 18px 14px',
        borderTop: `2px solid ${color}`,
        background: hovered ? 'var(--ds-bg-2)' : 'var(--ds-bg-1)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontFamily: FONTS.display, color: 'var(--ds-text)', letterSpacing: '0.04em', lineHeight: 1 }}>{name}</div>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-dim)', marginTop: 2 }}>{city}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 32, fontFamily: FONTS.display, color: 'var(--ds-text)', lineHeight: 1 }}>{units}</div>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.06em' }}>units</div>
        </div>
      </div>
      <div style={{ height: 2, background: 'var(--ds-border)', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <Stat label="Available"   value={available}   color={DS.green}  />
        <Stat label="Assigned"    value={assigned}    color={DS.blue}   />
        <Stat label="Maintenance" value={maintenance} color={DS.orange} />
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 14, fontFamily: FONTS.display, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function ContractCard({
  client, type, units, status, days, color, onClick,
}: ContractRow & { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  const expiring = status === 'expiring'
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderTop: `2px solid ${color}`,
        background: hovered ? 'var(--ds-bg-2)' : 'var(--ds-bg-1)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.15s', gap: 16,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ fontSize: 18, fontFamily: FONTS.display, color: 'var(--ds-text)', letterSpacing: '0.04em', lineHeight: 1 }}>{client}</div>
          <StatusBadge label={expiring ? 'EXPIRING' : 'ACTIVE'} color={color} small />
        </div>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-dim)', marginBottom: 8 }}>{type}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {days >= 0 ? 'Expires in' : 'Expired'}
          </span>
          <span style={{ fontSize: 11, fontFamily: FONTS.mono, color }}>
            {Math.abs(days)} days
          </span>
          {expiring && (
            <span style={{ fontSize: 8, fontFamily: FONTS.mono, color: DS.red, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              · ACTION REQUIRED
            </span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 36, fontFamily: FONTS.display, color, lineHeight: 1 }}>{units}</div>
        <div style={{ fontSize: 8, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>vehicles</div>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      padding: '28px 16px', textAlign: 'center',
      fontSize: 10, fontFamily: FONTS.mono,
      color: 'var(--ds-muted)',
      textTransform: 'uppercase', letterSpacing: '0.08em',
    }}>
      {message}
    </div>
  )
}

function SectionError({ message }: { message: string }) {
  return (
    <div style={{
      margin: 12, padding: '10px 14px',
      borderLeft: `2px solid ${DS.red}`,
      fontSize: 10, fontFamily: FONTS.mono,
      color: DS.red, letterSpacing: '0.04em',
    }}>
      Failed to load · {message}
    </div>
  )
}

function ModalSkeleton() {
  return (
    <div style={{ padding: '12px 0' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          height: 44, borderBottom: '1px solid var(--ds-border)',
          display: 'flex', alignItems: 'center', gap: 16, padding: '0 12px',
        }}>
          <SkeletonBox w={70} />
          <SkeletonBox w={90} />
          <SkeletonBox w={160} />
          <SkeletonBox w={100} />
          <SkeletonBox w={80} />
        </div>
      ))}
    </div>
  )
}

function SkeletonBox({ w }: { w: number }) {
  return (
    <div style={{
      width: w, height: 10,
      background: 'var(--ds-border-2)',
      borderRadius: 0, flexShrink: 0,
      opacity: 0.6,
    }} />
  )
}
