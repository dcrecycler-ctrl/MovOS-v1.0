// MovOS — Uruguayan fleet data

export interface KPI {
  id: string
  label: string
  value: number
  unit?: string
  sub: string
  color: string
  isPct?: boolean
}

export interface CriticalAlert {
  unit: string
  plate: string
  model: string
  branch: string
  source: 'CARCHECK' | 'MANUAL'
  sourceBy: string
  severity: string
  note: string
  ago: string
  color: string
  repair: string
}

export interface ServiceAlert {
  unit: string
  plate: string
  model: string
  km: number
  due: string
  type: string
  branch: string
  color: string
}

export interface Branch {
  id: string
  name: string
  code: string
  total: number
  available: number
  assigned: number
  oos: number
  util: number
  color: string
}

export interface Part {
  ref: string
  part: string
  vehicle: string
  priority: string
  status: string
  eta: string
  color: string
}

export interface Contract {
  id: string
  client: string
  fleet: number
  type: string
  expires: string
  renewIn: string
  status: string
  color: string
}

export interface Vehicle {
  unit: string
  plate: string
  model: string
  category: string
  branch: string
  status: string
  statusColor: string
  km: number
  contract: string
  alert?: string
}

export const KPIS: KPI[] = [
  { id: 'total',     label: 'FLOTA TOTAL',       value: 248, sub: 'ACTIVO · 4 SUCURSALES',     color: 'gold' },
  { id: 'available', label: 'DISPONIBLES',        value: 142, sub: 'LISTOS PARA RENTA',          color: 'green' },
  { id: 'assigned',  label: 'ASIGNADOS',          value: 87,  sub: 'EN RENTA · 12 RETORNAN HOY', color: 'blue' },
  { id: 'util',      label: 'UTILIZACIÓN',        value: 73,  unit: '%', sub: 'MES · +4.2 VS ABR', color: 'gold', isPct: true },
  { id: 'oos',       label: 'FUERA DE SERVICIO',  value: 19,  sub: '8 EN TALLER · 6 ESPERA',     color: 'red' },
]

export const CRITICAL_ALERTS: CriticalAlert[] = [
  { unit: 'UY-0142', plate: 'SBA 2740', model: 'Chevrolet Onix 2024',  branch: 'Montevideo',     source: 'CARCHECK', sourceBy: 'L. Mendoza · Inspector',     severity: 'MAYOR',   note: 'Defensa frontal · golpe en retorno',   ago: '12 MIN', color: 'red',    repair: 'POR AGENDAR' },
  { unit: 'UY-0087', plate: 'SAB 9018', model: 'Fiat Cronos 2023',     branch: 'Colonia',        source: 'CARCHECK', sourceBy: 'M. Pereira · Inspector',     severity: 'CRÍTICO', note: 'Parabrisas estrellado · NO RENTABLE',  ago: '48 MIN', color: 'red',    repair: 'POR AGENDAR' },
  { unit: 'UY-0231', plate: 'SCM 5588', model: 'Peugeot 2008 2024',    branch: 'Punta del Este', source: 'MANUAL',   sourceBy: 'C. Rodríguez · Gerente PDE', severity: 'ALTO',    note: 'Cliente reportó humo · revisar motor', ago: '2 H',    color: 'orange', repair: 'POR AGENDAR' },
  { unit: 'UY-0018', plate: 'SBK 1124', model: 'Renault Duster 2023',  branch: 'Salto',          source: 'CARCHECK', sourceBy: 'J. Silva · Inspector',       severity: 'MEDIO',   note: 'Rayón lateral · costado derecho',      ago: '3 H',    color: 'orange', repair: 'POR AGENDAR' },
  { unit: 'UY-0309', plate: 'STW 8770', model: 'Hyundai HB20 2024',    branch: 'Montevideo',     source: 'MANUAL',   sourceBy: 'R. Ávila · Operaciones',     severity: 'ALTO',    note: 'Llantas dañadas · 2 piezas',           ago: '4 H',    color: 'red',    repair: 'POR AGENDAR' },
]

export const SERVICE_ALERTS: ServiceAlert[] = [
  { unit: 'UY-0066', plate: 'SGH 3210', model: 'Suzuki Swift 2023',   km: 48200, due: 'VENCIDO 480 KM',  type: 'SERVICIO 50K', branch: 'Montevideo',    color: 'red'    },
  { unit: 'UY-0204', plate: 'SXR 4561', model: 'VW Polo 2024',        km: 29800, due: 'VENCE EN 200 KM', type: 'SERVICIO 30K', branch: 'Colonia',       color: 'orange' },
  { unit: 'UY-0151', plate: 'SBN 7831', model: 'KIA Rio 2024',        km: 19500, due: 'VENCE EN 500 KM', type: 'SERVICIO 20K', branch: 'Punta del Este', color: 'yellow' },
  { unit: 'UY-0098', plate: 'SQW 4322', model: 'Toyota Etios 2023',   km: 39200, due: 'SOAT EN 28 DÍAS', type: 'SOAT',         branch: 'Salto',         color: 'yellow' },
  { unit: 'UY-0277', plate: 'SLP 6651', model: 'Honda HR-V 2024',     km: 9800,  due: 'ITV EN 14 DÍAS',  type: 'ITV',          branch: 'Montevideo',    color: 'orange' },
]

export const BRANCHES: Branch[] = [
  { id: 'mvd', name: 'MONTEVIDEO',     code: 'UY·01', total: 96, available: 54, assigned: 32, oos: 10, util: 78, color: 'green' },
  { id: 'col', name: 'COLONIA',        code: 'UY·02', total: 48, available: 28, assigned: 17, oos: 3,  util: 81, color: 'green' },
  { id: 'pde', name: 'PUNTA DEL ESTE', code: 'UY·03', total: 64, available: 30, assigned: 30, oos: 4,  util: 69, color: 'blue'  },
  { id: 'sal', name: 'SALTO',          code: 'UY·04', total: 40, available: 24, assigned: 14, oos: 2,  util: 64, color: 'blue'  },
]

export const PARTS: Part[] = [
  { ref: '#RF-2049', part: 'Balatas delanteras', vehicle: 'UY-0142', priority: 'URGENTE', status: 'EN TRÁNSITO', eta: 'HOY 17:00', color: 'red'    },
  { ref: '#RF-2048', part: 'Parabrisas',         vehicle: 'UY-0087', priority: 'URGENTE', status: 'COTIZANDO',   eta: 'MAÑANA',    color: 'red'    },
  { ref: '#RF-2045', part: 'Filtro de aceite',   vehicle: 'UY-0066', priority: 'ALTA',    status: 'EN STOCK',    eta: 'HOY 14:00', color: 'orange' },
  { ref: '#RF-2043', part: 'Llantas 215/55 R17', vehicle: 'UY-0309', priority: 'ALTA',    status: 'PEDIDO',      eta: '+2 DÍAS',   color: 'orange' },
  { ref: '#RF-2041', part: 'Sensor TPMS',        vehicle: 'UY-0204', priority: 'MEDIA',   status: 'EN STOCK',    eta: 'HOY',       color: 'yellow' },
  { ref: '#RF-2038', part: 'Aceite 5W-30 · 4L',  vehicle: 'UY-0151', priority: 'MEDIA',   status: 'EN STOCK',    eta: 'HOY',       color: 'yellow' },
]

export const CONTRACTS: Contract[] = [
  { id: 'C-2024-018', client: 'ANCAP · LOGÍSTICA',      fleet: 34, type: 'OPERATIVO · 36M', expires: 'AGO 2026', renewIn: '15 MESES', status: 'ACTIVO',      color: 'green'  },
  { id: 'C-2024-021', client: 'ANTEL · FLOTILLA',       fleet: 22, type: 'COMERCIAL · 24M', expires: 'JUN 2026', renewIn: '13 MESES', status: 'ACTIVO',      color: 'green'  },
  { id: 'C-2023-044', client: 'CONAPROLE DISTRIBUCIÓN', fleet: 18, type: 'EJECUTIVO · 12M', expires: 'JUL 2025', renewIn: '2 MESES',  status: 'POR RENOVAR', color: 'orange' },
  { id: 'C-2023-051', client: 'TIENDA INGLESA',         fleet: 14, type: 'COMERCIAL · 18M', expires: 'JUN 2025', renewIn: '1 MES',    status: 'VENCE PRONTO', color: 'red'   },
]

export const FLEET: Vehicle[] = [
  { unit: 'UY-0142', plate: 'SBA 2740', model: 'Chevrolet Onix 2024',  category: 'Sedán',    branch: 'Montevideo',     status: 'FUERA DE SERVICIO', statusColor: 'red',    km: 18420, contract: 'CORTO',       alert: 'DAÑO' },
  { unit: 'UY-0087', plate: 'SAB 9018', model: 'Fiat Cronos 2023',     category: 'Sedán',    branch: 'Colonia',        status: 'FUERA DE SERVICIO', statusColor: 'red',    km: 42100, contract: 'CORTO',       alert: 'DAÑO' },
  { unit: 'UY-0211', plate: 'SPL 3390', model: 'Chevrolet Onix 2024',  category: 'Sedán',    branch: 'Punta del Este', status: 'DISPONIBLE',        statusColor: 'green',  km: 8200,  contract: 'CORTO' },
  { unit: 'UY-0312', plate: 'SKQ 4410', model: 'Renault Logan 2024',   category: 'Sedán',    branch: 'Salto',          status: 'ASIGNADO',          statusColor: 'blue',   km: 14820, contract: 'CORTO' },
  { unit: 'UY-0066', plate: 'SGH 3210', model: 'Suzuki Swift 2023',    category: 'Compacto', branch: 'Montevideo',     status: 'PARA SERVICIO',     statusColor: 'gold',   km: 48200, contract: 'CORTO',       alert: 'SERVICIO' },
  { unit: 'UY-0204', plate: 'SXR 4561', model: 'VW Polo 2024',         category: 'Sedán',    branch: 'Colonia',        status: 'DISPONIBLE',        statusColor: 'green',  km: 29800, contract: 'CORTO' },
  { unit: 'UY-0151', plate: 'SBN 7831', model: 'KIA Rio 2024',         category: 'Compacto', branch: 'Punta del Este', status: 'ASIGNADO',          statusColor: 'blue',   km: 19500, contract: 'ANCAP' },
  { unit: 'UY-0231', plate: 'SCM 5588', model: 'Peugeot 2008 2024',    category: 'SUV',      branch: 'Punta del Este', status: 'EN MANTENIMIENTO',  statusColor: 'purple', km: 21100, contract: 'CORTO',       alert: 'GERENTE' },
  { unit: 'UY-0018', plate: 'SBK 1124', model: 'Renault Duster 2023',  category: 'SUV',      branch: 'Salto',          status: 'PARA LIMPIEZA',     statusColor: 'yellow', km: 33700, contract: 'CORTO',       alert: 'DAÑO' },
  { unit: 'UY-0277', plate: 'SLP 6651', model: 'Honda HR-V 2024',      category: 'SUV',      branch: 'Montevideo',     status: 'ASIGNADO',          statusColor: 'blue',   km: 9800,  contract: 'CONAPROLE' },
  { unit: 'UY-0309', plate: 'STW 8770', model: 'Hyundai HB20 2024',    category: 'Compacto', branch: 'Montevideo',     status: 'FUERA DE SERVICIO', statusColor: 'red',    km: 11240, contract: 'CORTO',       alert: 'GERENTE' },
  { unit: 'UY-0098', plate: 'SQW 4322', model: 'Toyota Etios 2023',    category: 'Compacto', branch: 'Salto',          status: 'DISPONIBLE',        statusColor: 'green',  km: 39200, contract: 'CORTO',       alert: 'SERVICIO' },
  { unit: 'UY-0414', plate: 'SAS 2206', model: 'Audi A3 2024',         category: 'Premium',  branch: 'Punta del Este', status: 'ASIGNADO',          statusColor: 'blue',   km: 6400,  contract: 'ANTEL' },
  { unit: 'UY-0445', plate: 'SPO 1986', model: 'BMW 320i 2024',        category: 'Premium',  branch: 'Montevideo',     status: 'DISPONIBLE',        statusColor: 'green',  km: 4800,  contract: 'CORTO' },
  { unit: 'UY-0388', plate: 'SYU 5547', model: 'VW T-Cross 2024',      category: 'SUV',      branch: 'Colonia',        status: 'PARA INSPECCIÓN',   statusColor: 'gold',   km: 22300, contract: 'CORTO' },
]

export const KPI_SPARKLINE = [62, 66, 64, 70, 68, 71, 73]
