export const dynamic = 'force-dynamic'

import { B } from '@/lib/tokens'
import { TopBar }         from '@/components/layout/TopBar'
import { BentoBottomNav } from '@/components/ui/BentoBottomNav'
import { getFleetList, getFleetLocations } from '@/lib/supabase/queries/fleet'
import { getFleetStats } from '@/lib/supabase/queries/dashboard'
import { FleetTable } from './FleetTable'

const STATUS_OPTIONS = [
  { value: 'all',         label: 'Todos' },
  { value: 'available',   label: 'Disponible' },
  { value: 'assigned',    label: 'Asignado' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'inspection',  label: 'Inspección' },
]

const CATEGORY_OPTIONS = [
  { value: 'all',       label: 'Categorías' },
  { value: 'sedan',     label: 'Sedán' },
  { value: 'suv',       label: 'SUV' },
  { value: 'pickup',    label: 'Pickup' },
  { value: 'van',       label: 'Van' },
  { value: 'truck',     label: 'Camión' },
  { value: 'moto',      label: 'Moto' },
]

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function FleetPage({ searchParams }: PageProps) {
  const params = await searchParams
  const get = (k: string) => (Array.isArray(params[k]) ? params[k]![0] : params[k]) ?? ''

  const search   = get('q')
  const status   = get('status')
  const category = get('category')
  const location = get('location')
  const page     = parseInt(get('page') || '1', 10)
  const sort     = get('sort')
  const dir      = get('dir') as 'asc' | 'desc' | ''

  const [fleetResult, statsResult, locationsResult] = await Promise.all([
    getFleetList({ search, status, category, location, page, sort, dir: dir || 'asc' }),
    getFleetStats(),
    getFleetLocations(),
  ])

  const { vehicles, total, pageSize } = fleetResult.data
  const stats = statsResult.data
  const locations = locationsResult.data
  const totalPages = Math.ceil(total / pageSize)

  const locationOptions = [
    { value: 'all', label: 'Sucursales' },
    ...locations.map(l => ({ value: l.id, label: l.name })),
  ]

  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar />
      <main className="max-w-[1400px] mx-auto px-4 pt-7 pb-24 md:px-6 md:pb-16 lg:px-8">

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: 26, fontWeight: 600, color: B.ink, margin: 0, letterSpacing: '-0.02em' }}>Flota</h1>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: B.ink3, margin: '4px 0 0' }}>
              {total.toLocaleString()} vehículos · {locations.length} sucursales Uruguay
            </p>
          </div>
          <a
            href="/fleet/new"
            style={{
              fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 500,
              color: B.surface, background: B.ink, padding: '9px 16px', borderRadius: 9999,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            + Vehículo
          </a>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 md:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total"          value={String(stats.total)}         color={B.ink}   />
          <StatCard label="Disponibles"    value={String(stats.available)}     color={B.green} />
          <StatCard label="Asignados"      value={String(stats.assigned)}      color={B.blue}  />
          <StatCard label="Mantenimiento"  value={String(stats.maintenanceCount)} color={B.amber} />
          <StatCard label="Inspección"     value={String(stats.inspectionCount)}  color={B.amber} />
          <StatCard label="Utilización"    value={`${stats.utilization}%`}    color={B.blue}  />
        </div>

        {/* Fleet table with filters */}
        <FleetTable
          vehicles={vehicles}
          total={total}
          page={page}
          totalPages={totalPages}
          search={search}
          status={status}
          category={category}
          location={location}
          sort={sort}
          dir={dir || 'asc'}
          statusOptions={STATUS_OPTIONS}
          categoryOptions={CATEGORY_OPTIONS}
          locationOptions={locationOptions}
        />
      </main>
      <BentoBottomNav />
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: B.surface, borderRadius: 14, border: `1px solid ${B.hairline}`,
      padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 2,
      boxShadow: B.shadowSm,
    }}>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: B.ink3, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 24, fontWeight: 700, color, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{value}</span>
    </div>
  )
}
