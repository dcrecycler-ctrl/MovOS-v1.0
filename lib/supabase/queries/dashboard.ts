import { createClient } from '@/lib/supabase/server'
import { DS } from '@/lib/tokens'

// ─── Generic result wrapper ───────────────────────────────────────────────────
// All query functions return this — callers never throw, only check .error
export interface QueryResult<T> {
  data: T
  error: string | null
}

// ─── Exported types ───────────────────────────────────────────────────────────

export interface FleetStats {
  total: number
  available: number
  assigned: number
  outOfService: number
  maintenanceCount: number
  inspectionCount: number
  utilization: number          // percentage, 1 decimal
}

export interface CriticalAlert {
  id: string
  unit: string
  plate: string
  message: string
  source: string
  timeAgo: string
  urgent: boolean              // true = level is 'critical'
}

export interface ServiceAlert {
  id: string
  unit: string
  plate: string
  service: string
  vehicle: string              // "Make Model Year"
  deltaKm: number              // negative = overdue
  deltaDisplay: string         // e.g. "-2,400 km" or "+1,200 km"
  level: 'CRITICAL' | 'WARNING'
  overdue: boolean
}

export interface LocationStat {
  id: string
  name: string
  city: string
  units: number
  available: number
  assigned: number
  maintenance: number
  color: string                // from DS palette, assigned by index
}

export interface PartsRequest {
  id: string
  unit: string
  part: string
  shop: string
  priority: 'critical' | 'high' | 'medium' | 'low'
}

export interface ContractRow {
  id: string
  client: string
  type: string
  units: number                // active vehicle assignments
  status: 'active' | 'expiring' | 'expired' | 'cancelled'
  days: number                 // days until end_date (negative = past)
  color: string                // DS.green for active, DS.yellow for expiring
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const m  = Math.floor(ms / 60_000)
  if (m < 60)  return `${m}m ago`
  const h  = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// Deterministic accent color per location index — cycles through DS palette
const LOC_COLORS = [DS.blue, DS.green, DS.gold, DS.slate, DS.purple, DS.orange]
const locColor = (i: number) => LOC_COLORS[i % LOC_COLORS.length]

const URGENCY_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

// ─── getFleetStats ────────────────────────────────────────────────────────────

export async function getFleetStats(): Promise<QueryResult<FleetStats>> {
  try {
    const supabase = await createClient()

    // Five parallel HEAD queries — only counts, no row data transferred
    const [total, available, assigned, maintenance, inspection] = await Promise.all([
      supabase.from('vehicles').select('*', { count: 'exact', head: true }),
      supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'available'),
      supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'assigned'),
      supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'maintenance'),
      supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'inspection'),
    ])

    if (total.error) throw total.error

    const t = total.count        ?? 0
    const a = available.count    ?? 0
    const s = assigned.count     ?? 0
    const m = maintenance.count  ?? 0
    const i = inspection.count   ?? 0

    return {
      data: {
        total: t,
        available: a,
        assigned: s,
        outOfService: m + i,
        maintenanceCount: m,
        inspectionCount: i,
        utilization: t > 0 ? Math.round((s / t) * 1000) / 10 : 0,
      },
      error: null,
    }
  } catch (e) {
    console.error('[dashboard] getFleetStats:', e)
    return {
      data: { total: 0, available: 0, assigned: 0, outOfService: 0, maintenanceCount: 0, inspectionCount: 0, utilization: 0 },
      error: 'Could not load fleet statistics',
    }
  }
}

// ─── getCriticalAlerts ────────────────────────────────────────────────────────

export async function getCriticalAlerts(): Promise<QueryResult<CriticalAlert[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('alerts')
      .select(`
        id, message, source, level, created_at,
        vehicles ( unit_id, plate )
      `)
      .eq('status', 'open')
      .in('level', ['critical', 'warning'])
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    const rows: CriticalAlert[] = (data ?? []).map(a => {
      const v = a.vehicles as unknown as { unit_id: string; plate: string } | null
      return {
        id:      a.id,
        unit:    v?.unit_id ?? '—',
        plate:   v?.plate   ?? '—',
        message: a.message,
        source:  a.source,
        timeAgo: timeAgo(a.created_at),
        urgent:  a.level === 'critical',
      }
    })

    return { data: rows, error: null }
  } catch (e) {
    console.error('[dashboard] getCriticalAlerts:', e)
    return { data: [], error: 'Could not load critical alerts' }
  }
}

// ─── getServiceAlerts ─────────────────────────────────────────────────────────

export async function getServiceAlerts(): Promise<QueryResult<ServiceAlert[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('manufacturer_services')
      .select(`
        id, service_name, next_due_odometer, warning_km,
        vehicles ( unit_id, plate, make, model, year, odometer )
      `)
      .not('next_due_odometer', 'is', null)
      .order('next_due_odometer', { ascending: true })
      .limit(50)

    if (error) throw error

    type V = { unit_id: string; plate: string; make: string; model: string; year: number; odometer: number }

    const rows: ServiceAlert[] = (data ?? [])
      .flatMap(ms => {
        const v = ms.vehicles as unknown as V | null
        if (!v || ms.next_due_odometer === null) return []
        const delta   = ms.next_due_odometer - v.odometer
        const warnKm  = ms.warning_km ?? 2000
        if (delta > warnKm) return []           // not yet in warning window
        const overdue = delta <= 0
        return [{
          id:           ms.id,
          unit:         v.unit_id,
          plate:        v.plate,
          service:      ms.service_name,
          vehicle:      `${v.make} ${v.model} ${v.year}`,
          deltaKm:      delta,
          deltaDisplay: overdue
            ? `-${Math.abs(delta).toLocaleString()} km`
            : `+${delta.toLocaleString()} km`,
          level:  (overdue || delta < warnKm / 2) ? 'CRITICAL' as const : 'WARNING' as const,
          overdue,
        }]
      })
      .sort((a, b) => a.deltaKm - b.deltaKm)

    return { data: rows, error: null }
  } catch (e) {
    console.error('[dashboard] getServiceAlerts:', e)
    return { data: [], error: 'Could not load service alerts' }
  }
}

// ─── getFleetByLocation ───────────────────────────────────────────────────────

export async function getFleetByLocation(): Promise<QueryResult<LocationStat[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('locations')
      .select(`
        id, name, city,
        vehicles ( status )
      `)
      .order('name', { ascending: true })

    if (error) throw error

    const rows: LocationStat[] = (data ?? []).map((loc, idx) => {
      const vs = (loc.vehicles as { status: string }[]) ?? []
      return {
        id:          loc.id,
        name:        loc.name,
        city:        loc.city,
        units:       vs.length,
        available:   vs.filter(v => v.status === 'available').length,
        assigned:    vs.filter(v => v.status === 'assigned').length,
        maintenance: vs.filter(v => v.status === 'maintenance').length,
        color:       locColor(idx),
      }
    })

    return { data: rows, error: null }
  } catch (e) {
    console.error('[dashboard] getFleetByLocation:', e)
    return { data: [], error: 'Could not load location data' }
  }
}

// ─── getPartsAlerts ───────────────────────────────────────────────────────────

export async function getPartsAlerts(): Promise<QueryResult<PartsRequest[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('parts_requests')
      .select(`
        id, part_name, urgency,
        vehicles ( unit_id ),
        vendors  ( name )
      `)
      .in('status', ['requested', 'approved', 'ordered'])
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    const rows: PartsRequest[] = (data ?? [])
      .map(pr => {
        const v      = pr.vehicles as unknown as { unit_id: string } | null
        const vendor = pr.vendors  as unknown as { name: string }    | null
        return {
          id:       pr.id,
          unit:     v?.unit_id  ?? '—',
          part:     pr.part_name,
          shop:     vendor?.name ?? '—',
          priority: pr.urgency as PartsRequest['priority'],
        }
      })
      .sort((a, b) => (URGENCY_RANK[a.priority] ?? 3) - (URGENCY_RANK[b.priority] ?? 3))

    return { data: rows, error: null }
  } catch (e) {
    console.error('[dashboard] getPartsAlerts:', e)
    return { data: [], error: 'Could not load parts requests' }
  }
}

// ─── getLongTermContracts ─────────────────────────────────────────────────────

export async function getLongTermContracts(): Promise<QueryResult<ContractRow[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('contracts')
      .select(`
        id, client_name, contract_type, end_date, status,
        contract_vehicles ( id, removed_at )
      `)
      .in('status', ['active', 'expiring'])
      .order('end_date', { ascending: true })

    if (error) throw error

    const rows: ContractRow[] = (data ?? []).map(c => {
      const cvs    = (c.contract_vehicles as { id: string; removed_at: string | null }[]) ?? []
      const active = cvs.filter(cv => cv.removed_at === null).length
      const days   = Math.floor((new Date(c.end_date).getTime() - Date.now()) / 86_400_000)
      const status = c.status as ContractRow['status']
      return {
        id:     c.id,
        client: c.client_name,
        type:   c.contract_type,
        units:  active,
        status,
        days,
        color: status === 'active' ? DS.green : DS.yellow,
      }
    })

    return { data: rows, error: null }
  } catch (e) {
    console.error('[dashboard] getLongTermContracts:', e)
    return { data: [], error: 'Could not load contracts' }
  }
}
