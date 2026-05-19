import { createClient } from '@/lib/supabase/server'
import { QueryResult } from './dashboard'

export interface VehicleRow {
  id: string
  unit_id: string
  plate: string
  make: string
  model: string
  year: number
  category: string
  status: 'available' | 'assigned' | 'maintenance' | 'inspection' | 'retired'
  odometer: number
  location_id: string
  location_name: string
}

export interface FleetListResult {
  vehicles: VehicleRow[]
  total: number
  page: number
  pageSize: number
}

export interface FleetFilters {
  search?: string
  status?: string
  category?: string
  location?: string
  page?: number
  sort?: string
  dir?: 'asc' | 'desc'
}

export async function getFleetList(filters: FleetFilters = {}): Promise<QueryResult<FleetListResult>> {
  try {
    const supabase = await createClient()
    const pageSize = 50
    const page = Math.max(1, filters.page ?? 1)
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('vehicles')
      .select(`
        id, unit_id, plate, make, model, year, category, status, odometer,
        locations ( id, name )
      `, { count: 'exact' })

    if (filters.search) {
      const s = filters.search.replace(/'/g, "''")
      query = query.or(`unit_id.ilike.%${s}%,plate.ilike.%${s}%,make.ilike.%${s}%,model.ilike.%${s}%`)
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }
    if (filters.location && filters.location !== 'all') {
      query = query.eq('location_id', filters.location)
    }

    const sortCol = ['unit_id', 'plate', 'make', 'status', 'odometer', 'year'].includes(filters.sort ?? '')
      ? filters.sort!
      : 'unit_id'
    query = query.order(sortCol, { ascending: (filters.dir ?? 'asc') === 'asc' })
    query = query.range(offset, offset + pageSize - 1)

    const { data, error, count } = await query
    if (error) throw error

    type LocRow = { id: string; name: string } | null
    const vehicles: VehicleRow[] = (data ?? []).map(v => ({
      id:            v.id,
      unit_id:       v.unit_id,
      plate:         v.plate,
      make:          v.make,
      model:         v.model,
      year:          v.year,
      category:      v.category,
      status:        v.status,
      odometer:      v.odometer,
      location_id:   (v.locations as unknown as LocRow)?.id ?? '',
      location_name: (v.locations as unknown as LocRow)?.name ?? '—',
    }))

    return { data: { vehicles, total: count ?? 0, page, pageSize }, error: null }
  } catch (e) {
    console.error('[fleet] getFleetList:', e)
    return { data: { vehicles: [], total: 0, page: 1, pageSize: 50 }, error: 'Could not load fleet' }
  }
}

export async function getFleetLocations(): Promise<QueryResult<{ id: string; name: string }[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('locations')
      .select('id, name')
      .order('name', { ascending: true })
    if (error) throw error
    return { data: data ?? [], error: null }
  } catch (e) {
    console.error('[fleet] getFleetLocations:', e)
    return { data: [], error: 'Could not load locations' }
  }
}
