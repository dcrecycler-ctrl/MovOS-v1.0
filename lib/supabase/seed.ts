/**
 * Seed script — run with:
 *   npx ts-node --project tsconfig.seed.json lib/supabase/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * (service role key bypasses RLS — never commit or expose it)
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env.local') })

const url     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svcKey  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!url || !svcKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(url, svcKey, {
  auth: { persistSession: false },
})

async function main() {
  console.log('🌱  Starting seed…')

  // ── 1. Locations ─────────────────────────────────────────────────────────────
  const { data: locations, error: locErr } = await supabase
    .from('locations')
    .insert([
      { name: 'Punta del Este',       city: 'Punta del Este' },
      { name: 'Montevideo Centro',     city: 'Montevideo'     },
      { name: 'Carrasco',              city: 'Montevideo'     },
      { name: 'Colonia del Sacramento', city: 'Colonia'       },
    ])
    .select('id, name')

  if (locErr) { console.error('locations:', locErr); process.exit(1) }
  console.log(`  ✓ ${locations!.length} locations`)

  const [PDE, MVD, CAR, CLN] = locations!

  // ── 2. Vendors (needed for parts_requests) ───────────────────────────────────
  const { data: vendors, error: vendErr } = await supabase
    .from('vendors')
    .insert([
      { name: 'AutoParts UY',   category: 'parts'    },
      { name: 'RepuestosPlaza', category: 'parts'    },
      { name: 'TallerNorte',    category: 'workshop' },
    ])
    .select('id, name')

  if (vendErr) { console.error('vendors:', vendErr); process.exit(1) }
  console.log(`  ✓ ${vendors!.length} vendors`)

  const [V1, V2] = vendors!

  // ── 3. Vehicles ───────────────────────────────────────────────────────────────
  const vehicleRows = [
    // Punta del Este — 6 vehicles
    { unit_id: 'PDE-001', plate: 'SBA 1234', make: 'Toyota',    model: 'Hilux',  year: 2022, category: 'pickup', status: 'available',   odometer: 42000, location_id: PDE.id },
    { unit_id: 'PDE-002', plate: 'SBA 5678', make: 'Toyota',    model: 'Corolla',year: 2023, category: 'sedan',  status: 'assigned',    odometer: 18500, location_id: PDE.id },
    { unit_id: 'PDE-003', plate: 'SCA 2233', make: 'Chevrolet', model: 'Tracker',year: 2021, category: 'suv',    status: 'maintenance', odometer: 67000, location_id: PDE.id },
    { unit_id: 'PDE-004', plate: 'SCA 4455', make: 'Ford',      model: 'Transit',year: 2020, category: 'van',    status: 'available',   odometer: 93000, location_id: PDE.id },
    { unit_id: 'PDE-005', plate: 'SCB 9900', make: 'Renault',   model: 'Duster', year: 2022, category: 'suv',    status: 'assigned',    odometer: 31200, location_id: PDE.id },
    { unit_id: 'PDE-006', plate: 'SCB 1122', make: 'Volkswagen',model: 'Gol',    year: 2023, category: 'sedan',  status: 'inspection',  odometer: 8900,  location_id: PDE.id },
    // Montevideo Centro — 5 vehicles
    { unit_id: 'MVD-001', plate: 'SBB 3344', make: 'Toyota',    model: 'Yaris',  year: 2022, category: 'sedan',  status: 'available',   odometer: 24000, location_id: MVD.id },
    { unit_id: 'MVD-002', plate: 'SBB 5566', make: 'Ford',      model: 'Ranger', year: 2021, category: 'pickup', status: 'assigned',    odometer: 58000, location_id: MVD.id },
    { unit_id: 'MVD-003', plate: 'SBC 7788', make: 'Chevrolet', model: 'Onix',   year: 2023, category: 'sedan',  status: 'available',   odometer: 12000, location_id: MVD.id },
    { unit_id: 'MVD-004', plate: 'SBC 9911', make: 'Honda',     model: 'CR-V',   year: 2022, category: 'suv',    status: 'maintenance', odometer: 71500, location_id: MVD.id },
    { unit_id: 'MVD-005', plate: 'SBD 2233', make: 'Fiat',      model: 'Cronos', year: 2021, category: 'sedan',  status: 'assigned',    odometer: 44800, location_id: MVD.id },
    // Carrasco — 5 vehicles
    { unit_id: 'CAR-001', plate: 'SBD 4455', make: 'Mercedes',  model: 'Sprinter',year: 2020, category: 'van',   status: 'available',   odometer: 115000,location_id: CAR.id },
    { unit_id: 'CAR-002', plate: 'SBD 6677', make: 'Toyota',    model: 'SW4',    year: 2022, category: 'suv',    status: 'assigned',    odometer: 36000, location_id: CAR.id },
    { unit_id: 'CAR-003', plate: 'SBE 8899', make: 'Volkswagen',model: 'Taos',   year: 2023, category: 'suv',    status: 'available',   odometer: 9400,  location_id: CAR.id },
    { unit_id: 'CAR-004', plate: 'SBE 1122', make: 'Chevrolet', model: 'S10',    year: 2021, category: 'pickup', status: 'assigned',    odometer: 62000, location_id: CAR.id },
    { unit_id: 'CAR-005', plate: 'SBF 3344', make: 'Ford',      model: 'Ecosport',year: 2022, category: 'suv',   status: 'inspection',  odometer: 28000, location_id: CAR.id },
    // Colonia — 4 vehicles
    { unit_id: 'CLN-001', plate: 'SBF 5566', make: 'Toyota',    model: 'Hilux',  year: 2021, category: 'pickup', status: 'available',   odometer: 79000, location_id: CLN.id },
    { unit_id: 'CLN-002', plate: 'SBF 7788', make: 'Renault',   model: 'Oroch',  year: 2022, category: 'pickup', status: 'assigned',    odometer: 43000, location_id: CLN.id },
    { unit_id: 'CLN-003', plate: 'SBG 9900', make: 'Volkswagen',model: 'Amarok', year: 2020, category: 'pickup', status: 'maintenance', odometer: 102000,location_id: CLN.id },
    { unit_id: 'CLN-004', plate: 'SBG 2233', make: 'Ford',      model: 'Fiesta', year: 2023, category: 'sedan',  status: 'available',   odometer: 6200,  location_id: CLN.id },
  ]

  const { data: vehicles, error: vehErr } = await supabase
    .from('vehicles')
    .insert(vehicleRows)
    .select('id, unit_id')

  if (vehErr) { console.error('vehicles:', vehErr); process.exit(1) }
  console.log(`  ✓ ${vehicles!.length} vehicles`)

  const byUnit = Object.fromEntries(vehicles!.map(v => [v.unit_id, v.id]))

  // ── 4. Manufacturer services (2–3 per vehicle, first 8 vehicles) ─────────────
  const today = new Date()
  const serviceRows = vehicles!.flatMap(({ unit_id, id }) => {
    const odo = vehicleRows.find(r => r.unit_id === unit_id)!.odometer
    return [
      {
        vehicle_id: id, service_name: 'Cambio de aceite',
        interval_km: 10000, interval_months: 6,
        last_done_odometer: odo - 8500,
        last_done_date: new Date(today.getTime() - 150 * 86400000).toISOString().split('T')[0],
        next_due_odometer: odo - 8500 + 10000,
        warning_km: 2000,
      },
      {
        vehicle_id: id, service_name: 'Filtro de aire',
        interval_km: 20000, interval_months: 12,
        last_done_odometer: odo - 16000,
        last_done_date: new Date(today.getTime() - 300 * 86400000).toISOString().split('T')[0],
        next_due_odometer: odo - 16000 + 20000,
        warning_km: 3000,
      },
    ]
  })

  const { error: svcErr } = await supabase.from('manufacturer_services').insert(serviceRows)
  if (svcErr) { console.error('manufacturer_services:', svcErr); process.exit(1) }
  console.log(`  ✓ ${serviceRows.length} service intervals`)

  // ── 5. Alerts ─────────────────────────────────────────────────────────────────
  const alertRows = [
    { vehicle_id: byUnit['PDE-003'], level: 'critical', status: 'open', source: 'carcheck', message: 'Temperatura motor elevada — revisar refrigerante' },
    { vehicle_id: byUnit['MVD-004'], level: 'critical', status: 'open', source: 'manager',  message: 'Avería eléctrica — no arranca' },
    { vehicle_id: byUnit['CLN-003'], level: 'critical', status: 'open', source: 'technician',message: 'Frenos delanteros desgastados al límite' },
    { vehicle_id: byUnit['PDE-006'], level: 'warning',  status: 'open', source: 'carcheck', message: 'Luz de check engine activada' },
    { vehicle_id: byUnit['CAR-005'], level: 'warning',  status: 'open', source: 'client',   message: 'Ruido al frenar — revisión solicitada' },
    { vehicle_id: byUnit['MVD-002'], level: 'warning',  status: 'open', source: 'carcheck', message: 'Presión de neumático baja — delantera derecha' },
    { vehicle_id: byUnit['CLN-002'], level: 'warning',  status: 'open', source: 'manager',  message: 'Vencimiento VTV próximo en 7 días' },
    { vehicle_id: byUnit['PDE-001'], level: 'warning',  status: 'open', source: 'carcheck', message: 'Batería en niveles bajos' },
  ]

  const { error: alertErr } = await supabase.from('alerts').insert(alertRows)
  if (alertErr) { console.error('alerts:', alertErr); process.exit(1) }
  console.log(`  ✓ ${alertRows.length} alerts`)

  // ── 6. Parts requests ─────────────────────────────────────────────────────────
  const partsRows = [
    { vehicle_id: byUnit['PDE-003'], vendor_id: V1.id, part_name: 'Correa distribución',  urgency: 'critical', status: 'approved' },
    { vehicle_id: byUnit['MVD-004'], vendor_id: V2.id, part_name: 'Batería 12V 70Ah',     urgency: 'high',     status: 'ordered'  },
    { vehicle_id: byUnit['CLN-003'], vendor_id: V1.id, part_name: 'Pastillas freno delantera', urgency: 'critical', status: 'requested' },
    { vehicle_id: byUnit['CAR-004'], vendor_id: V2.id, part_name: 'Filtro de aceite',     urgency: 'medium',   status: 'requested' },
    { vehicle_id: byUnit['MVD-002'], vendor_id: V1.id, part_name: 'Neumático 235/65R17',  urgency: 'high',     status: 'approved' },
    { vehicle_id: byUnit['PDE-001'], vendor_id: V2.id, part_name: 'Alternador',           urgency: 'medium',   status: 'ordered'  },
  ]

  const { error: partsErr } = await supabase.from('parts_requests').insert(partsRows)
  if (partsErr) { console.error('parts_requests:', partsErr); process.exit(1) }
  console.log(`  ✓ ${partsRows.length} parts requests`)

  // ── 7. Contracts ──────────────────────────────────────────────────────────────
  const startBase = new Date(today.getTime() - 365 * 86400000).toISOString().split('T')[0]

  const { data: contracts, error: ctErr } = await supabase
    .from('contracts')
    .insert([
      {
        client_name: 'UTE',          contract_type: 'long-term',
        start_date: startBase, end_date: new Date(today.getTime() + 180 * 86400000).toISOString().split('T')[0],
        status: 'active',   monthly_amount: 24000,
      },
      {
        client_name: 'Antel',        contract_type: 'long-term',
        start_date: startBase, end_date: new Date(today.getTime() + 210 * 86400000).toISOString().split('T')[0],
        status: 'active',   monthly_amount: 18500,
      },
      {
        client_name: 'OSE',          contract_type: 'long-term',
        start_date: startBase, end_date: new Date(today.getTime() + 42  * 86400000).toISOString().split('T')[0],
        status: 'expiring', monthly_amount: 12800,
      },
      {
        client_name: 'Intendencia',  contract_type: 'long-term',
        start_date: startBase, end_date: new Date(today.getTime() + 28  * 86400000).toISOString().split('T')[0],
        status: 'expiring', monthly_amount: 9200,
      },
    ])
    .select('id, client_name')

  if (ctErr) { console.error('contracts:', ctErr); process.exit(1) }
  console.log(`  ✓ ${contracts!.length} contracts`)

  // ── 8. Contract vehicles ──────────────────────────────────────────────────────
  const [UTE, ANTEL, OSE, INTD] = contracts!
  const cvRows = [
    // UTE — 8 vehicles
    ...[byUnit['PDE-001'], byUnit['PDE-002'], byUnit['PDE-004'], byUnit['PDE-005'],
        byUnit['MVD-001'], byUnit['MVD-003'], byUnit['CAR-003'], byUnit['CLN-004']]
      .map(vid => ({ contract_id: UTE.id, vehicle_id: vid, removed_at: null })),
    // Antel — 6 vehicles
    ...[byUnit['MVD-002'], byUnit['CAR-002'], byUnit['CAR-004'],
        byUnit['CLN-001'], byUnit['CLN-002'], byUnit['PDE-006']]
      .map(vid => ({ contract_id: ANTEL.id, vehicle_id: vid, removed_at: null })),
    // OSE — 3 vehicles
    ...[byUnit['CAR-001'], byUnit['CAR-005'], byUnit['MVD-005']]
      .map(vid => ({ contract_id: OSE.id, vehicle_id: vid, removed_at: null })),
    // Intendencia — 3 vehicles
    ...[byUnit['CLN-003'], byUnit['MVD-004'], byUnit['PDE-003']]
      .map(vid => ({ contract_id: INTD.id, vehicle_id: vid, removed_at: null })),
  ]

  const { error: cvErr } = await supabase.from('contract_vehicles').insert(cvRows)
  if (cvErr) { console.error('contract_vehicles:', cvErr); process.exit(1) }
  console.log(`  ✓ ${cvRows.length} contract-vehicle assignments`)

  console.log('\n✅  Seed complete!')
}

main().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
