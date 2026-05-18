// MovOS — Spanish fleet data + theme tokens (dark + light)

const T_DARK = {
  bg:'#080808', bg1:'#0D0D0D', bg2:'#111111', bg3:'#161616',
  border:'#1C1C1C', border2:'#242424',
  text:'#E2D9C8', textDim:'#AAAAAA', muted:'#555555', dim:'#3A3A3A',
  gold:'#C8A96E', blue:'#7EB8C9', purple:'#9B7EC8',
  green:'#6DBF8E', red:'#C97E7E', orange:'#C9956E',
  yellow:'#C9B87E', lime:'#A8C96E', slate:'#7E9BC9',
  critical:'#C97E7E', warning:'#C9B87E',
  scrollThumb:'#222',
};

// Light variant: cool blue-white surfaces (no warm tint), same desaturated accent
// palette darkened to ~OKLCH L 0.45–0.52 for legibility.
const T_LIGHT = {
  bg:'#EEF2F7', bg1:'#FFFFFF', bg2:'#E8EEF5', bg3:'#DEE5EE',
  border:'#D5DCE5', border2:'#B5BFCE',
  text:'#0E1726', textDim:'#475569', muted:'#64748B', dim:'#94A3B8',
  gold:'#8F6B2A', blue:'#3D6C7C', purple:'#5F417F',
  green:'#2E7548', red:'#9E3636', orange:'#8E5524',
  yellow:'#7A671E', lime:'#5D7A1E', slate:'#3D5680',
  critical:'#9E3636', warning:'#8E7A1E',
  scrollThumb:'#B5BFCE',
};

const THEMES = { dark: T_DARK, light: T_LIGHT };

// ─── Fleet KPIs ──────────────────────────────────────────────────────
const KPIS = [
  { id:'total',     label:'FLOTA TOTAL',        value:248, sub:'ACTIVO · 4 SUCURSALES',     color:'gold' },
  { id:'available', label:'DISPONIBLES',        value:142, sub:'LISTOS PARA RENTA',          color:'green' },
  { id:'assigned',  label:'ASIGNADOS',          value:87,  sub:'EN RENTA · 12 RETORNAN HOY', color:'blue' },
  { id:'util',      label:'UTILIZACIÓN',        value:73,  unit:'%', sub:'MES · +4.2 VS ABR',color:'gold', isPct:true },
  { id:'oos',       label:'FUERA DE SERVICIO',  value:19,  sub:'8 EN TALLER · 6 ESPERA',     color:'red' },
];

// ─── Incidentes en curso (Critical Alerts) ─────────────────────────
// Each row is a vehicle out of operation pending repair scheduling.
// `source` distinguishes:
//   - CARCHECK · auto-detected via mobile inspection app at return / scan
//   - MANUAL   · entered by manager or operator from desktop
// `severity` drives urgency colour. All rows = "POR AGENDAR" by default —
// once a workshop slot is booked the row leaves this queue.
const CRITICAL_ALERTS = [
  { unit:'UY-0142', plate:'SBA 2740', model:'Chevrolet Onix 2024',  branch:'Montevideo',     source:'CARCHECK', sourceBy:'L. Mendoza · Inspector',     severity:'MAYOR',   note:'Defensa frontal · golpe en retorno',   ago:'12 MIN', color:'red',    repair:'POR AGENDAR' },
  { unit:'UY-0087', plate:'SAB 9018', model:'Fiat Cronos 2023',     branch:'Colonia',        source:'CARCHECK', sourceBy:'M. Pereira · Inspector',     severity:'CRÍTICO', note:'Parabrisas estrellado · NO RENTABLE',  ago:'48 MIN', color:'red',    repair:'POR AGENDAR' },
  { unit:'UY-0231', plate:'SCM 5588', model:'Peugeot 2008 2024',    branch:'Punta del Este', source:'MANUAL',   sourceBy:'C. Rodríguez · Gerente PDE', severity:'ALTO',    note:'Cliente reportó humo · revisar motor', ago:'2 H',    color:'orange', repair:'POR AGENDAR' },
  { unit:'UY-0018', plate:'SBK 1124', model:'Renault Duster 2023',  branch:'Salto',          source:'CARCHECK', sourceBy:'J. Silva · Inspector',       severity:'MEDIO',   note:'Rayón lateral · costado derecho',      ago:'3 H',    color:'orange', repair:'POR AGENDAR' },
  { unit:'UY-0309', plate:'STW 8770', model:'Hyundai HB20 2024',    branch:'Montevideo',     source:'MANUAL',   sourceBy:'R. Ávila · Operaciones',     severity:'ALTO',    note:'Llantas dañadas · 2 piezas',           ago:'4 H',    color:'red',    repair:'POR AGENDAR' },
];

// ─── Alertas de Servicio (right col) ─────────────────────────────────
const SERVICE_ALERTS = [
  { unit:'UY-0066', plate:'SGH 3210', model:'Suzuki Swift 2023',    km:48200, due:'VENCIDO 480 KM',   type:'SERVICIO 50K', branch:'Montevideo',    color:'red'    },
  { unit:'UY-0204', plate:'SXR 4561', model:'VW Polo 2024',         km:29800, due:'VENCE EN 200 KM',  type:'SERVICIO 30K', branch:'Colonia',       color:'orange' },
  { unit:'UY-0151', plate:'SBN 7831', model:'KIA Rio 2024',         km:19500, due:'VENCE EN 500 KM',  type:'SERVICIO 20K', branch:'Punta del Este',color:'yellow' },
  { unit:'UY-0098', plate:'SQW 4322', model:'Toyota Etios 2023',    km:39200, due:'SOAT EN 28 DÍAS',  type:'SOAT',         branch:'Salto',         color:'yellow' },
  { unit:'UY-0277', plate:'SLP 6651', model:'Honda HR-V 2024',      km:9800,  due:'ITV EN 14 DÍAS',   type:'ITV',          branch:'Montevideo',    color:'orange' },
];

// ─── Sucursales (4 cards) ────────────────────────────────────────────
const BRANCHES = [
  { id:'mvd', name:'MONTEVIDEO',     code:'UY·01', total:96, available:54, assigned:32, oos:10, util:78, color:'green' },
  { id:'col', name:'COLONIA',        code:'UY·02', total:48, available:28, assigned:17, oos:3,  util:81, color:'green' },
  { id:'pde', name:'PUNTA DEL ESTE', code:'UY·03', total:64, available:30, assigned:30, oos:4,  util:69, color:'blue'  },
  { id:'sal', name:'SALTO',          code:'UY·04', total:40, available:24, assigned:14, oos:2,  util:64, color:'blue'  },
];

// ─── Refacciones (parts requests, right column of row 3) ─────────────
const PARTS = [
  { ref:'#RF-2049', part:'Balatas delanteras',  vehicle:'UY-0142', priority:'URGENTE',  status:'EN TRÁNSITO', eta:'HOY 17:00',  color:'red'    },
  { ref:'#RF-2048', part:'Parabrisas',          vehicle:'UY-0087', priority:'URGENTE',  status:'COTIZANDO',   eta:'MAÑANA',     color:'red'    },
  { ref:'#RF-2045', part:'Filtro de aceite',    vehicle:'UY-0066', priority:'ALTA',     status:'EN STOCK',    eta:'HOY 14:00',  color:'orange' },
  { ref:'#RF-2043', part:'Llantas 215/55 R17',  vehicle:'UY-0309', priority:'ALTA',     status:'PEDIDO',      eta:'+2 DÍAS',    color:'orange' },
  { ref:'#RF-2041', part:'Sensor TPMS',         vehicle:'UY-0204', priority:'MEDIA',    status:'EN STOCK',    eta:'HOY',        color:'yellow' },
  { ref:'#RF-2038', part:'Aceite 5W-30 · 4L',   vehicle:'UY-0151', priority:'MEDIA',    status:'EN STOCK',    eta:'HOY',        color:'yellow' },
];

// ─── Contratos a Largo Plazo (2-up cards) ────────────────────────────
const CONTRACTS = [
  { id:'C-2024-018', client:'ANCAP · LOGÍSTICA',       fleet:34, type:'OPERATIVO · 36M', expires:'AGO 2026', renewIn:'15 MESES', status:'ACTIVO',     color:'green'  },
  { id:'C-2024-021', client:'ANTEL · FLOTILLA',        fleet:22, type:'COMERCIAL · 24M', expires:'JUN 2026', renewIn:'13 MESES', status:'ACTIVO',     color:'green'  },
  { id:'C-2023-044', client:'CONAPROLE DISTRIBUCIÓN',  fleet:18, type:'EJECUTIVO · 12M', expires:'JUL 2025', renewIn:'2 MESES',  status:'POR RENOVAR',color:'orange' },
  { id:'C-2023-051', client:'TIENDA INGLESA',          fleet:14, type:'COMERCIAL · 18M', expires:'JUN 2025', renewIn:'1 MES',    status:'VENCE PRONTO',color:'red'   },
];

// ─── Drill-down: filtered vehicle list (per KPI) ─────────────────────
// Small but varied set so modals feel real.
const FLEET = [
  { unit:'UY-0142', plate:'SBA 2740', model:'Chevrolet Onix 2024',     category:'Sedán',     branch:'Montevideo',    status:'FUERA DE SERVICIO', statusColor:'red',    km:18420, contract:'CORTO',   alert:'DAÑO' },
  { unit:'UY-0087', plate:'SAB 9018', model:'Fiat Cronos 2023',        category:'Sedán',     branch:'Colonia',       status:'FUERA DE SERVICIO', statusColor:'red',    km:42100, contract:'CORTO',   alert:'DAÑO' },
  { unit:'UY-0211', plate:'SPL 3390', model:'Chevrolet Onix 2024',     category:'Sedán',     branch:'Punta del Este',status:'DISPONIBLE',        statusColor:'green',  km:8200,  contract:'CORTO' },
  { unit:'UY-0312', plate:'SKQ 4410', model:'Renault Logan 2024',      category:'Sedán',     branch:'Salto',         status:'ASIGNADO',          statusColor:'blue',   km:14820, contract:'CORTO' },
  { unit:'UY-0066', plate:'SGH 3210', model:'Suzuki Swift 2023',       category:'Compacto',  branch:'Montevideo',    status:'PARA SERVICIO',     statusColor:'gold',   km:48200, contract:'CORTO',   alert:'SERVICIO' },
  { unit:'UY-0204', plate:'SXR 4561', model:'VW Polo 2024',            category:'Sedán',     branch:'Colonia',       status:'DISPONIBLE',        statusColor:'green',  km:29800, contract:'CORTO' },
  { unit:'UY-0151', plate:'SBN 7831', model:'KIA Rio 2024',            category:'Compacto',  branch:'Punta del Este',status:'ASIGNADO',          statusColor:'blue',   km:19500, contract:'ANCAP' },
  { unit:'UY-0231', plate:'SCM 5588', model:'Peugeot 2008 2024',       category:'SUV',       branch:'Punta del Este',status:'EN MANTENIMIENTO',  statusColor:'purple', km:21100, contract:'CORTO',   alert:'GERENTE' },
  { unit:'UY-0018', plate:'SBK 1124', model:'Renault Duster 2023',     category:'SUV',       branch:'Salto',         status:'PARA LIMPIEZA',     statusColor:'yellow', km:33700, contract:'CORTO',   alert:'DAÑO' },
  { unit:'UY-0277', plate:'SLP 6651', model:'Honda HR-V 2024',         category:'SUV',       branch:'Montevideo',    status:'ASIGNADO',          statusColor:'blue',   km:9800,  contract:'CONAPROLE' },
  { unit:'UY-0309', plate:'STW 8770', model:'Hyundai HB20 2024',       category:'Compacto',  branch:'Montevideo',    status:'FUERA DE SERVICIO', statusColor:'red',    km:11240, contract:'CORTO',   alert:'GERENTE' },
  { unit:'UY-0098', plate:'SQW 4322', model:'Toyota Etios 2023',       category:'Compacto',  branch:'Salto',         status:'DISPONIBLE',        statusColor:'green',  km:39200, contract:'CORTO',   alert:'SERVICIO' },
  { unit:'UY-0414', plate:'SAS 2206', model:'Audi A3 2024',            category:'Premium',   branch:'Punta del Este',status:'ASIGNADO',          statusColor:'blue',   km:6400,  contract:'ANTEL' },
  { unit:'UY-0445', plate:'SPO 1986', model:'BMW 320i 2024',           category:'Premium',   branch:'Montevideo',    status:'DISPONIBLE',        statusColor:'green',  km:4800,  contract:'CORTO' },
  { unit:'UY-0388', plate:'SYU 5547', model:'VW T-Cross 2024',         category:'SUV',       branch:'Colonia',       status:'PARA INSPECCIÓN',   statusColor:'gold',   km:22300, contract:'CORTO' },
];

// ─── Operations cycle (5 stages) ─────────────────────────────────
const OPS_CYCLE = [
  { id:'assigned',  label:'ASIGNADOS',        count:87,  capacity:248, color:'blue',   icon:'key',     desc:'En renta · 12 retornan hoy' },
  { id:'available', label:'DISPONIBLES',      count:142, capacity:248, color:'green',  icon:'check',   desc:'Listos para entregar' },
  { id:'cleaning',  label:'PARA LIMPIEZA',    count:14,  capacity:248, color:'sky',    icon:'spray',   desc:'Post-retorno · pendiente' },
  { id:'inspect',   label:'PARA INSPECCIÓN',  count:11,  capacity:248, color:'ochre',  icon:'eye',     desc:'CarCheck pre-entrega' },
  { id:'service',   label:'EN SERVICIO',      count:19,  capacity:248, color:'rose',   icon:'wrench',  desc:'8 en taller · 6 espera' },
];

// ─── Maintenance cycle (7 stages) ────────────────────────────────
const MAINT_CYCLE = [
  { id:'wait',      label:'EN ESPERA',         count:6,  color:'amber',  icon:'pause',  desc:'Diagnóstico pendiente' },
  { id:'tech',      label:'ASIGNADO A TÉCNICO',count:4,  color:'blue',   icon:'tech',   desc:'En revisión' },
  { id:'diag',      label:'DIAGNÓSTICO',       count:3,  color:'lilac',  icon:'stethoscope', desc:'Pruebas en curso' },
  { id:'parts',     label:'ESPERA REFACCIONES',count:5,  color:'amber',  icon:'package', desc:'Pedidos en tránsito' },
  { id:'repair',    label:'EN REPARACIÓN',     count:7,  color:'rose',   icon:'wrench',  desc:'Trabajo activo' },
  { id:'post',      label:'POST-INSPECCIÓN',   count:2,  color:'sky',    icon:'check2',  desc:'Validación final' },
  { id:'cleared',   label:'LIBERADOS HOY',     count:3,  color:'green',  icon:'flag',    desc:'Vuelven a flota' },
];

// ─── Repair locations (workshops) ────────────────────────────────
const WORKSHOPS = [
  { id:'mvd-int',   name:'Taller MovOS Centro',  type:'INTERNO',     city:'Montevideo',     queue:8, busy:5, done:12, capacity:16, color:'green' },
  { id:'pde-int',   name:'Taller MovOS Punta',   type:'INTERNO',     city:'Punta del Este', queue:3, busy:2, done:4,  capacity:8,  color:'green' },
  { id:'chevy-mvd', name:'Chevrolet Sevel',      type:'DEALER',      city:'Montevideo',     queue:2, busy:3, done:6,  capacity:12, color:'blue'  },
  { id:'vw-mvd',    name:'VW Santa Rosa',        type:'DEALER',      city:'Montevideo',     queue:1, busy:2, done:3,  capacity:10, color:'blue'  },
  { id:'renault-c', name:'Renault Colonia',      type:'DEALER',      city:'Colonia',        queue:0, busy:1, done:2,  capacity:6,  color:'blue'  },
  { id:'spec-bdy',  name:'Carrocerías Pereyra',  type:'ESPECIALISTA',city:'Montevideo',     queue:1, busy:1, done:1,  capacity:4,  color:'lilac' },
];

// ─── Repair tickets ─────────────────────────────────────────────
const TICKETS = [
  { id:'T-3382', unit:'UY-0142', model:'Chevrolet Onix',    issue:'Defensa frontal',          stage:'EN REPARACIÓN',     workshop:'Carrocerías Pereyra',  priority:'ALTA',    days:1, cost:14800, color:'rose'  },
  { id:'T-3381', unit:'UY-0087', model:'Fiat Cronos',       issue:'Parabrisas',               stage:'ESPERA REFACCIONES',workshop:'VW Santa Rosa',        priority:'ALTA',    days:2, cost:8200,  color:'amber' },
  { id:'T-3379', unit:'UY-0231', model:'Peugeot 2008',      issue:'Revisión motor · humo',    stage:'DIAGNÓSTICO',       workshop:'Taller MovOS Centro',  priority:'ALTA',    days:1, cost:null,  color:'lilac' },
  { id:'T-3376', unit:'UY-0018', model:'Renault Duster',    issue:'Rayón costado derecho',    stage:'EN ESPERA',         workshop:'Carrocerías Pereyra',  priority:'MEDIA',   days:0, cost:null,  color:'amber' },
  { id:'T-3374', unit:'UY-0309', model:'Hyundai HB20',      issue:'Cambio de llantas · 2 pz', stage:'ASIGNADO A TÉCNICO',workshop:'Taller MovOS Centro',  priority:'ALTA',    days:0, cost:9600,  color:'blue'  },
  { id:'T-3371', unit:'UY-0066', model:'Suzuki Swift',      issue:'Servicio 50 000 km',       stage:'POST-INSPECCIÓN',   workshop:'Taller MovOS Centro',  priority:'MEDIA',   days:1, cost:6400,  color:'sky'   },
  { id:'T-3368', unit:'UY-0414', model:'Audi A3',           issue:'Pastillas + discos',       stage:'EN REPARACIÓN',     workshop:'Chevrolet Sevel',      priority:'BAJA',    days:2, cost:12200, color:'rose'  },
];

// ─── Inspecciones (queue) ───────────────────────────────────────
const INSPECTIONS = [
  { id:'I-9210', unit:'UY-0445', model:'BMW 320i',           kind:'PRE-ENTREGA', branch:'Montevideo',     inspector:'L. Mendoza',  status:'EN CURSO',   stepsDone:3, stepsTotal:5, color:'blue'  },
  { id:'I-9209', unit:'UY-0277', model:'Honda HR-V',         kind:'POST-RETORNO',branch:'Montevideo',     inspector:'J. Silva',    status:'EN CURSO',   stepsDone:2, stepsTotal:5, color:'blue'  },
  { id:'I-9208', unit:'UY-0388', model:'VW T-Cross',         kind:'PRE-ENTREGA', branch:'Colonia',        inspector:'M. Pereira',  status:'EN ESPERA',  stepsDone:0, stepsTotal:5, color:'amber' },
  { id:'I-9207', unit:'UY-0151', model:'KIA Rio',            kind:'POST-RETORNO',branch:'Punta del Este', inspector:'C. Rodríguez',status:'COMPLETA',   stepsDone:5, stepsTotal:5, color:'green', findings:2 },
  { id:'I-9206', unit:'UY-0211', model:'Chevrolet Onix',     kind:'PRE-ENTREGA', branch:'Punta del Este', inspector:'L. Mendoza',  status:'COMPLETA',   stepsDone:5, stepsTotal:5, color:'green', findings:0 },
  { id:'I-9205', unit:'UY-0204', model:'VW Polo',            kind:'POST-RETORNO',branch:'Colonia',        inspector:'M. Pereira',  status:'COMPLETA',   stepsDone:5, stepsTotal:5, color:'green', findings:1 },
];

// ─── Karve · contratos cortos (rentas del día) ──────────────────
const KARVE_TODAY = [
  { time:'08:30', kind:'ENTREGA',  client:'María Fernández',    unit:'UY-0211', plate:'SPL 3390', model:'Chevrolet Onix', branch:'Punta del Este', days:7,  status:'CONFIRMADA' },
  { time:'09:15', kind:'RETORNO',  client:'Tomás Ribeiro',      unit:'UY-0312', plate:'SKQ 4410', model:'Renault Logan',  branch:'Salto',          days:5,  status:'INSPECCIÓN'  },
  { time:'10:00', kind:'ENTREGA',  client:'Laura Bonomi',       unit:'UY-0445', plate:'SPO 1986', model:'BMW 320i',       branch:'Montevideo',     days:3,  status:'PRE-CHECK'   },
  { time:'11:30', kind:'RETORNO',  client:'A. Cohen + Sra.',    unit:'UY-0277', plate:'SLP 6651', model:'Honda HR-V',     branch:'Montevideo',     days:14, status:'INSPECCIÓN'  },
  { time:'14:00', kind:'ENTREGA',  client:'Diego Pereyra',      unit:'UY-0098', plate:'SQW 4322', model:'Toyota Etios',   branch:'Salto',          days:2,  status:'CONFIRMADA' },
  { time:'17:30', kind:'RETORNO',  client:'Antel · Flotilla',   unit:'UY-0414', plate:'SAS 2206', model:'Audi A3',        branch:'Punta del Este', days:30, status:'PROGRAMADA' },
];

// ─── Vehículo seleccionado · expediente completo (UY-0142) ──────
const VEHICLE_DETAIL = {
  unit:'UY-0142', plate:'SBA 2740', model:'Chevrolet Onix LTZ', year:2024, color:'Plata Crystal',
  vin:'9BGKL69D0PG264821', engine:'1.0 Turbo · 116 hp', transmission:'CVT', fuel:'Nafta · Súper 95',
  acquired:'12 Mar 2024', acquisitionCost:'USD 24 500', branch:'Montevideo', category:'Sedán económico',
  km:18420, status:'FUERA DE SERVICIO', statusColor:'rose',
  contract:'Renta corta', lastDriver:'L. Ortiz · cliente directo',
  insurance:'Sancor Seguros · pol. SC-22084', insuranceExpires:'Jul 2026',
  soat:'BSE · vence Ago 2026', itv:'Vence Mar 2027',
  serviceNext:'30 000 km · cambio de aceite + filtros',
  events: [
    { d:'17 may 2026', time:'09:24', e:'Incidente CarCheck · defensa frontal',      tone:'rose',  actor:'L. Mendoza' },
    { d:'17 may 2026', time:'09:25', e:'Movido a Fuera de servicio (auto)',         tone:'rose',  actor:'Sistema' },
    { d:'17 may 2026', time:'09:25', e:'Ticket T-3382 creado · Carrocerías Pereyra',tone:'lilac', actor:'Sistema' },
    { d:'12 may 2026', time:'14:30', e:'Limpieza completada',                       tone:'amber', actor:'P. Núñez' },
    { d:'09 may 2026', time:'18:05', e:'Retorno de renta · 7 días',                 tone:'blue',  actor:'L. Ortiz' },
    { d:'02 may 2026', time:'08:00', e:'Entrega · contrato corto',                  tone:'green', actor:'L. Ortiz' },
    { d:'04 abr 2026', time:'10:00', e:'Servicio 15 000 km · taller MovOS Centro',  tone:'sky',   actor:'Taller MVD' },
    { d:'12 mar 2024', time:'09:00', e:'Alta de vehículo · ingreso a flota',        tone:'green', actor:'Compras' },
  ],
};

// ─── Intelligence · vehicle performance scores ──────────────────
const INTEL_VEHICLES = [
  { unit:'UY-0445', model:'BMW 320i',           score:92, util:88, revenue:'USD 4 200', shop:2,  rec:'HOLD',     trend:'+12%' },
  { unit:'UY-0277', model:'Honda HR-V',         score:88, util:84, revenue:'USD 3 100', shop:3,  rec:'HOLD',     trend:'+8%'  },
  { unit:'UY-0414', model:'Audi A3',            score:84, util:82, revenue:'USD 3 800', shop:4,  rec:'HOLD',     trend:'+5%'  },
  { unit:'UY-0211', model:'Chevrolet Onix',     score:78, util:78, revenue:'USD 1 900', shop:1,  rec:'HOLD',     trend:'+3%'  },
  { unit:'UY-0204', model:'VW Polo',            score:71, util:74, revenue:'USD 1 700', shop:5,  rec:'HOLD',     trend:'+1%'  },
  { unit:'UY-0066', model:'Suzuki Swift',       score:58, util:62, revenue:'USD 1 200', shop:14, rec:'EVALUATE', trend:'-6%'  },
  { unit:'UY-0309', model:'Hyundai HB20',       score:54, util:58, revenue:'USD 1 100', shop:18, rec:'EVALUATE', trend:'-9%'  },
  { unit:'UY-0087', model:'Fiat Cronos',        score:42, util:48, revenue:'USD 980',   shop:24, rec:'SELL',     trend:'-15%' },
  { unit:'UY-0142', model:'Chevrolet Onix',     score:38, util:44, revenue:'USD 920',   shop:28, rec:'SELL',     trend:'-19%' },
];

// ─── Mobile · tareas del operador (CarCheck app) ───────────────
const MOBILE_TASKS = [
  { id:'M-1', kind:'ENTREGA',  unit:'UY-0445', time:'10:00', client:'Laura Bonomi',     status:'PENDIENTE', urgency:'high' },
  { id:'M-2', kind:'RETORNO',  unit:'UY-0277', time:'11:30', client:'A. Cohen + Sra.', status:'PENDIENTE', urgency:'high' },
  { id:'M-3', kind:'LIMPIEZA', unit:'UY-0151', time:'12:15', client:null,               status:'PENDIENTE', urgency:'med'  },
  { id:'M-4', kind:'ENTREGA',  unit:'UY-0098', time:'14:00', client:'Diego Pereyra',    status:'PENDIENTE', urgency:'med'  },
  { id:'M-5', kind:'INSPECCIÓN',unit:'UY-0204',time:'08:00', client:null,               status:'COMPLETA',  urgency:'done' },
];

// Expose to window for cross-script access (Babel scripts don't share scope).
Object.assign(window, {
  MOVOS_THEMES: THEMES,
  MOVOS_KPIS: KPIS,
  MOVOS_CRITICAL_ALERTS: CRITICAL_ALERTS,
  MOVOS_SERVICE_ALERTS: SERVICE_ALERTS,
  MOVOS_BRANCHES: BRANCHES,
  MOVOS_PARTS: PARTS,
  MOVOS_CONTRACTS: CONTRACTS,
  MOVOS_FLEET: FLEET,
  MOVOS_OPS_CYCLE: OPS_CYCLE,
  MOVOS_MAINT_CYCLE: MAINT_CYCLE,
  MOVOS_WORKSHOPS: WORKSHOPS,
  MOVOS_TICKETS: TICKETS,
  MOVOS_INSPECTIONS: INSPECTIONS,
  MOVOS_KARVE_TODAY: KARVE_TODAY,
  MOVOS_VEHICLE_DETAIL: VEHICLE_DETAIL,
  MOVOS_INTEL_VEHICLES: INTEL_VEHICLES,
  MOVOS_MOBILE_TASKS: MOBILE_TASKS,
});
