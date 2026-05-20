import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OperatorProfile {
  id: string
  full_name: string
  role: string
  location_id: string | null
  location_name: string
}

export interface OperatorVehicle {
  id: string
  unit_id: string
  plate: string
  make: string
  model: string
  year: number
  category: string
  status: string
  odometer: number
  location_name: string
}

export interface InspectionRecord {
  id: string
  vehicle_id: string
  type: string
  status: string
  odometer: number | null
  fuel_level: number | null
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getOperatorProfile(userId: string): Promise<OperatorProfile | null> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role, location_id, locations(name)')
      .eq('id', userId)
      .single()
    if (!data) return null
    return {
      id:            data.id,
      full_name:     data.full_name ?? 'Usuario',
      role:          data.role ?? 'operator',
      location_id:   data.location_id,
      location_name: (data.locations as unknown as { name: string } | null)?.name ?? 'Sucursal',
    }
  } catch {
    return null
  }
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export async function getVehicleByUnitId(unitId: string): Promise<OperatorVehicle | null> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('vehicles')
      .select('id, unit_id, plate, make, model, year, category, status, odometer, locations(name)')
      .eq('unit_id', unitId)
      .single()
    if (!data) return null
    return {
      id:            data.id,
      unit_id:       data.unit_id,
      plate:         data.plate,
      make:          data.make,
      model:         data.model,
      year:          data.year,
      category:      data.category,
      status:        data.status,
      odometer:      data.odometer,
      location_name: (data.locations as unknown as { name: string } | null)?.name ?? '—',
    }
  } catch {
    return null
  }
}

export async function getVehicleById(id: string): Promise<OperatorVehicle | null> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('vehicles')
      .select('id, unit_id, plate, make, model, year, category, status, odometer, locations(name)')
      .eq('id', id)
      .single()
    if (!data) return null
    return {
      id:            data.id,
      unit_id:       data.unit_id,
      plate:         data.plate,
      make:          data.make,
      model:         data.model,
      year:          data.year,
      category:      data.category,
      status:        data.status,
      odometer:      data.odometer,
      location_name: (data.locations as unknown as { name: string } | null)?.name ?? '—',
    }
  } catch {
    return null
  }
}

// ─── Inspections ──────────────────────────────────────────────────────────────

export async function createInspection(vehicleId: string, inspectorId: string, type: string): Promise<string | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('inspections')
      .insert({
        vehicle_id:   vehicleId,
        inspector_id: inspectorId,
        type,
        status:       'in_progress',
        created_at:   new Date().toISOString(),
      })
      .select('id')
      .single()
    if (error) throw error
    return data?.id ?? null
  } catch {
    return null
  }
}

export async function saveOdometerAndFuel(inspectionId: string, odometer: number, fuelLevel: number): Promise<void> {
  try {
    const supabase = createClient()
    await supabase
      .from('inspections')
      .update({ odometer, fuel_level: fuelLevel })
      .eq('id', inspectionId)
  } catch {}
}

export async function saveChecklistItem(inspectionId: string, itemName: string, response: 'ok' | 'issue' | 'na'): Promise<void> {
  try {
    const supabase = createClient()
    await supabase
      .from('inspection_checklist')
      .upsert({
        inspection_id: inspectionId,
        item_name:     itemName,
        response,
        updated_at:    new Date().toISOString(),
      }, { onConflict: 'inspection_id,item_name' })
  } catch {}
}

export async function saveDamageRecord(data: {
  inspectionId: string
  vehicleId: string
  zoneId: string
  zoneLabel: string
  damageType: string
  severity: string
  notes: string
}): Promise<string | null> {
  try {
    const supabase = createClient()
    const { data: row } = await supabase
      .from('damage_records')
      .insert({
        inspection_id: data.inspectionId,
        vehicle_id:    data.vehicleId,
        zone_id:       data.zoneId,
        zone_label:    data.zoneLabel,
        damage_type:   data.damageType,
        severity:      data.severity,
        notes:         data.notes,
        created_at:    new Date().toISOString(),
      })
      .select('id')
      .single()
    return row?.id ?? null
  } catch {
    return null
  }
}

export async function uploadInspectionPhoto(
  inspectionId: string,
  zone: string,
  file: File
): Promise<string | null> {
  try {
    const supabase = createClient()
    const path = `inspections/${inspectionId}/${zone}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage
      .from('inspection-photos')
      .upload(path, file, { upsert: true })
    if (error) throw error
    const { data: urlData } = supabase.storage.from('inspection-photos').getPublicUrl(path)
    return urlData.publicUrl
  } catch {
    return null
  }
}

export async function completeInspection(
  inspectionId: string,
  vehicleId: string,
  customerName: string,
  signatureDataUrl: string,
  hasMajorDamage: boolean
): Promise<void> {
  try {
    const supabase = createClient()
    await supabase
      .from('inspections')
      .update({
        status:        'completed',
        customer_name: customerName,
        completed_at:  new Date().toISOString(),
      })
      .eq('id', inspectionId)

    if (hasMajorDamage) {
      await supabase
        .from('vehicles')
        .update({ status: 'maintenance' })
        .eq('id', vehicleId)

      await supabase.from('repair_tickets').insert({
        vehicle_id:     vehicleId,
        inspection_id:  inspectionId,
        severity:       'major',
        status:         'open',
        created_at:     new Date().toISOString(),
      })
    }

    await supabase.from('vehicle_events').insert({
      vehicle_id: vehicleId,
      type:       'inspection_completed',
      data:       { inspection_id: inspectionId, has_major_damage: hasMajorDamage },
      created_at: new Date().toISOString(),
    })
  } catch {}
}

// ─── Maintenance ──────────────────────────────────────────────────────────────

export async function moveToMaintenance(
  vehicleId: string,
  operatorId: string,
  stage: string,
  notes: string
): Promise<void> {
  try {
    const supabase = createClient()
    await supabase
      .from('vehicles')
      .update({ status: 'maintenance' })
      .eq('id', vehicleId)

    await supabase.from('maintenance_moves').insert({
      vehicle_id:  vehicleId,
      operator_id: operatorId,
      stage,
      notes,
      created_at:  new Date().toISOString(),
    })

    await supabase.from('vehicle_events').insert({
      vehicle_id: vehicleId,
      type:       'moved_to_maintenance',
      data:       { stage, notes, operator_id: operatorId },
      created_at: new Date().toISOString(),
    })
  } catch {}
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export async function createOperatorAlert(data: {
  vehicleId: string
  level: 'info' | 'warning' | 'critical'
  message: string
  source: string
}): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.from('alerts').insert({
      vehicle_id: data.vehicleId,
      level:      data.level,
      message:    data.message,
      source:     data.source,
      status:     'open',
      created_at: new Date().toISOString(),
    })

    await supabase.from('vehicle_events').insert({
      vehicle_id: data.vehicleId,
      type:       'alert_created',
      data:       { level: data.level, message: data.message },
      created_at: new Date().toISOString(),
    })
  } catch {}
}
