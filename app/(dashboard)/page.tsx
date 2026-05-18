'use client'

import { CSSProperties, ReactNode, useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { KPICard } from '@/components/ui/KPICard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DataTable, Column } from '@/components/ui/DataTable'
import { DrillModal } from '@/components/ui/DrillModal'
import { AlertRow } from '@/components/ui/AlertRow'
import { PageHeader } from '@/components/ui/PageHeader'

// ─── Mock data ───────────────────────────────────────────────────────────────

const BRANCH_FILTERS = [
  { value: 'all',   label: 'All Branches' },
  { value: 'loc-a', label: 'Loc A' },
  { value: 'loc-b', label: 'Loc B' },
  { value: 'loc-c', label: 'Loc C' },
  { value: 'loc-d', label: 'Loc D' },
]

interface VehicleRow extends Record<string, unknown> {
  unit: string; plate: string; model: string
  location: string; status: string; days: string
}

const ALL_VEHICLES: VehicleRow[] = [
  { unit: 'U-0142', plate: 'SBQ 3812', model: 'Toyota Hilux 2022',      location: 'Loc A · PDE', status: 'Assigned',    days: '14d' },
  { unit: 'U-0219', plate: 'TKM 4491', model: 'VW Amarok 2021',          location: 'Loc B · MVC', status: 'Available',   days: '—'   },
  { unit: 'U-0087', plate: 'RGA 2201', model: 'Ford Ranger 2023',         location: 'Loc C · CAR', status: 'Maintenance', days: '3d'  },
  { unit: 'U-0334', plate: 'QBP 8871', model: 'Chevrolet S10 2020',       location: 'Loc A · PDE', status: 'Assigned',    days: '7d'  },
  { unit: 'U-0401', plate: 'SMT 6612', model: 'Mitsubishi L200 2022',     location: 'Loc D · COL', status: 'Available',   days: '—'   },
  { unit: 'U-0518', plate: 'TTG 9920', model: 'Nissan Frontier 2021',     location: 'Loc B · MVC', status: 'Inspection',  days: '1d'  },
  { unit: 'U-0623', plate: 'RHQ 1145', model: 'Toyota Hilux 2023',        location: 'Loc C · CAR', status: 'Assigned',    days: '22d' },
  { unit: 'U-0712', plate: 'SWP 4430', model: 'Ford Ranger 2022',         location: 'Loc A · PDE', status: 'Assigned',    days: '5d'  },
]

const VEHICLE_COLS: Column<VehicleRow>[] = [
  { key: 'unit',     header: 'Unit',     width: 80,  sortable: true },
  { key: 'plate',    header: 'Plate',    width: 100 },
  { key: 'model',    header: 'Model',    sortable: true },
  { key: 'location', header: 'Location' },
  { key: 'status',   header: 'Status',   width: 120,
    render: (v) => {
      const c = v === 'Assigned' ? DS.blue : v === 'Available' ? DS.green
              : v === 'Maintenance' ? DS.orange : DS.yellow
      return <StatusBadge label={String(v)} color={c} small />
    }},
  { key: 'days', header: 'Days', width: 55, align: 'right' },
]

interface AlertData {
  id: string; unit: string; plate: string; message: string
  source: 'Damage' | 'Manager'; time: string; urgent: boolean
}

const CRITICAL_ALERTS: AlertData[] = [
  { id:'1', unit:'U-0142', plate:'SBQ 3812', message:'Windshield crack — rental paused',        source:'Damage',  time:'12m ago', urgent:true  },
  { id:'2', unit:'U-0334', plate:'QBP 8871', message:'Engine overheating warning light',         source:'Damage',  time:'38m ago', urgent:true  },
  { id:'3', unit:'U-0518', plate:'TTG 9920', message:'Client reported brake noise',              source:'Manager', time:'1h ago',  urgent:false },
  { id:'4', unit:'U-0087', plate:'RGA 2201', message:'Flat tire — side of road, tow requested', source:'Damage',  time:'2h ago',  urgent:true  },
  { id:'5', unit:'U-0623', plate:'RHQ 1145', message:'Missing equipment — GPS unit',             source:'Manager', time:'3h ago',  urgent:false },
]

interface ServiceRow extends Record<string, unknown> {
  unit: string; plate: string; service: string; vehicle: string
  delta: string; level: 'CRITICAL' | 'WARNING'; overdue: boolean
}

const SERVICE_ALERTS: ServiceRow[] = [
  { unit:'U-0712', plate:'SWP 4430', service:'Oil Change',         vehicle:'Ford Ranger 2022',     delta:'-2,400 km', level:'CRITICAL', overdue:true  },
  { unit:'U-0219', plate:'TKM 4491', service:'Tire Rotation',      vehicle:'VW Amarok 2021',        delta:'-800 km',   level:'CRITICAL', overdue:true  },
  { unit:'U-0401', plate:'SMT 6612', service:'Brake Inspection',   vehicle:'Mitsubishi L200 2022',  delta:'+1,200 km', level:'WARNING',  overdue:false },
  { unit:'U-0334', plate:'QBP 8871', service:'Air Filter',         vehicle:'Chevrolet S10 2020',    delta:'+600 km',   level:'WARNING',  overdue:false },
  { unit:'U-0087', plate:'RGA 2201', service:'Transmission Fluid', vehicle:'Ford Ranger 2023',      delta:'-120 km',   level:'CRITICAL', overdue:true  },
]

const SERVICE_COLS: Column<ServiceRow>[] = [
  { key:'unit',    header:'Unit',    width:80  },
  { key:'plate',   header:'Plate',   width:95  },
  { key:'service', header:'Service'            },
  { key:'vehicle', header:'Vehicle'            },
  { key:'delta',   header:'Delta',   width:100, align:'right',
    render:(v, row) => (
      <span style={{ color: row.overdue ? DS.red : DS.yellow, fontFamily: FONTS.mono, fontSize:11 }}>
        {String(v)}
      </span>
    )},
  { key:'level', header:'Level', width:90,
    render:(v) => <StatusBadge label={String(v)} color={v === 'CRITICAL' ? DS.red : DS.yellow} small /> },
]

const LOCATIONS = [
  { id:'loc-a', code:'A', name:'Punta del Este',      city:'Maldonado',             units:342, available:198, assigned:121, maintenance:23, color:DS.blue   },
  { id:'loc-b', code:'B', name:'Montevideo Centro',   city:'Montevideo',            units:298, available:142, assigned:131, maintenance:25, color:DS.green  },
  { id:'loc-c', code:'C', name:'Carrasco',            city:'Montevideo',            units:401, available:219, assigned:156, maintenance:26, color:DS.gold   },
  { id:'loc-d', code:'D', name:'Colonia',             city:'Colonia del Sacramento',units:206, available:98,  assigned:90,  maintenance:18, color:DS.slate  },
]

interface PartRow extends Record<string, unknown> {
  unit: string; part: string; shop: string; priority: 'critical' | 'high' | 'medium'
}

const PARTS: PartRow[] = [
  { unit:'U-0087', part:'Front Brake Pads (x4)',   shop:'Taller Central', priority:'critical' },
  { unit:'U-0334', part:'Oil Filter + 5W-30 5L',   shop:'Repuestos Sur',  priority:'high'     },
  { unit:'U-0712', part:'Windshield Wiper Set',     shop:'AutoParts PDE',  priority:'medium'   },
]

const PART_COLS: Column<PartRow>[] = [
  { key:'unit', header:'Unit', width:75 },
  { key:'part', header:'Part' },
  { key:'shop', header:'Shop' },
  { key:'priority', header:'Pri', width:80,
    render:(v) => {
      const c = v === 'critical' ? DS.red : v === 'high' ? DS.orange : DS.yellow
      return <StatusBadge label={String(v)} color={c} small />
    }},
]

const CONTRACTS = [
  { id:'c1', client:'UTE',           type:'Energía',              units:87,  status:'active',   days:287, color:DS.green  },
  { id:'c2', client:'OSE',           type:'Servicios Públicos',   units:64,  status:'expiring', days:42,  color:DS.yellow },
  { id:'c3', client:'Antel',         type:'Telecomunicaciones',   units:112, status:'active',   days:481, color:DS.green  },
  { id:'c4', client:'Intendencia',   type:'Municipio',            units:43,  status:'expiring', days:28,  color:DS.yellow },
]

// ─── Modal state ─────────────────────────────────────────────────────────────

interface ModalState {
  title: string; subtitle?: string; color: string; vehicles: VehicleRow[]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [branch, setBranch] = useState('all')
  const [modal, setModal]   = useState<ModalState | null>(null)

  function openModal(title: string, subtitle: string, color: string, filter?: (v: VehicleRow) => boolean) {
    const vehicles = filter ? ALL_VEHICLES.filter(filter) : ALL_VEHICLES
    setModal({ title, subtitle, color, vehicles })
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--ds-bg)', fontFamily:FONTS.mono }}>
      <DarkNav />

      <div style={{ maxWidth:1440, margin:'0 auto', padding:'28px 36px 64px' }}>

        <PageHeader
          title="TABLERO"
          subtitle="Fleet operations overview · Updated 2 min ago"
          filters={BRANCH_FILTERS}
          activeFilter={branch}
          onFilterChange={setBranch}
        />

        {/* ── ROW 1 · KPI Cards ─────────────────────────────────────── */}
        <div style={{ display:'flex', gap:1, marginBottom:20, background:'var(--ds-border)' }}>
          <KPICard label="Total Fleet"     value="1,247" sub="47 maintenance · 31 inspection" subColor={DS.orange} color={DS.gold}
            onClick={() => openModal('TOTAL FLEET',    '1,247 registered vehicles',         DS.gold)} />
          <KPICard label="Available"       value="412"   sub="Ready to rent now"             subColor={DS.green}  color={DS.green}
            onClick={() => openModal('AVAILABLE',      '412 vehicles ready to rent',        DS.green,  v => v.status === 'Available')} />
          <KPICard label="Assigned"        value="698"   sub="Currently on rent"             subColor={DS.blue}   color={DS.blue}
            onClick={() => openModal('ASSIGNED',       '698 vehicles on active rent',       DS.blue,   v => v.status === 'Assigned')} />
          <KPICard label="Utilization"     value="73.4%" sub="Assigned ÷ total fleet"       subColor={DS.gold}   color={DS.gold}
            onClick={() => openModal('UTILIZATION',    '73.4% · Assigned ÷ Total Fleet',   DS.gold)} />
          <KPICard label="Out of Service"  value="78"    sub="47 maint · 31 inspection"     subColor={DS.red}    color={DS.red}
            onClick={() => openModal('OUT OF SERVICE', '78 vehicles currently unavailable', DS.red,    v => v.status === 'Maintenance' || v.status === 'Inspection')} />
        </div>

        {/* ── ROW 2 · Alerts ────────────────────────────────────────── */}
        <div style={{ display:'flex', gap:14, marginBottom:20, alignItems:'flex-start' }}>

          {/* Critical Alerts */}
          <Panel
            label="Critical Alerts" count={CRITICAL_ALERTS.length} color={DS.red}
            footer="VIEW ALL CRITICAL ALERTS →"
            onFooter={() => openModal('CRITICAL ALERTS', '5 vehicles require immediate attention', DS.red)}
          >
            {CRITICAL_ALERTS.map(a => (
              <AlertRow key={a.id} unit={a.unit} plate={a.plate} message={a.message}
                time={a.time} urgent={a.urgent}
                onClick={() => openModal(a.unit, a.message, DS.red)} />
            ))}
            {/* Source legend */}
            <div style={{ display:'flex', gap:10, padding:'8px 14px', borderTop:'1px solid var(--ds-border)' }}>
              <StatusBadge label="Damage"  color={DS.red}    small />
              <StatusBadge label="Manager" color={DS.orange} small />
            </div>
          </Panel>

          {/* Service Interval Alerts */}
          <Panel
            label="Service Interval Alerts" count={SERVICE_ALERTS.length} color={DS.yellow}
            footer="VIEW ALL SERVICE ALERTS →"
            onFooter={() => openModal('SERVICE ALERTS', '5 vehicles past service interval', DS.yellow)}
          >
            <DataTable columns={SERVICE_COLS} rows={SERVICE_ALERTS} alertKey="overdue"
              onRowClick={r => openModal(r.unit, r.service, DS.yellow)} />
          </Panel>
        </div>

        {/* ── ROW 3 · Fleet by Location + Parts ─────────────────────── */}
        <div style={{ display:'flex', gap:14, marginBottom:20, alignItems:'flex-start' }}>

          {/* Fleet by Location — 2/3 */}
          <div style={{ flex:2, border:'1px solid var(--ds-border)', background:'var(--ds-bg-1)' }}>
            <div style={{ padding:'14px 14px 12px', borderBottom:'1px solid var(--ds-border)' }}>
              <SectionLabel label="Fleet by Location" color={DS.blue} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'var(--ds-border)' }}>
              {LOCATIONS.map(loc => (
                <LocationCard key={loc.id} {...loc}
                  onClick={() => openModal(
                    `LOC ${loc.code} · ${loc.name.toUpperCase()}`,
                    `${loc.units} vehicles · ${loc.city}`,
                    loc.color,
                  )} />
              ))}
            </div>
          </div>

          {/* Parts Requests — 1/3 */}
          <Panel
            label="Parts Requests" count={PARTS.length} color={DS.purple}
            footer="VIEW ALL →"
            onFooter={() => openModal('PARTS REQUESTS', 'All pending parts requests', DS.purple)}
            style={{ flex:1 }}
          >
            <DataTable columns={PART_COLS} rows={PARTS}
              onRowClick={() => openModal('PARTS REQUESTS', 'All pending parts requests', DS.purple)} />
          </Panel>
        </div>

        {/* ── ROW 4 · Contracts ─────────────────────────────────────── */}
        <div style={{ border:'1px solid var(--ds-border)', background:'var(--ds-bg-1)' }}>
          <div style={{ padding:'14px 14px 12px', borderBottom:'1px solid var(--ds-border)' }}>
            <SectionLabel
              label="Long-Term Contracts"
              count={CONTRACTS.reduce((a, c) => a + c.units, 0)}
              color={DS.gold}
            />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'var(--ds-border)' }}>
            {CONTRACTS.map(c => (
              <ContractCard key={c.id} {...c}
                onClick={() => openModal(
                  c.client.toUpperCase(),
                  `${c.units} vehicles · ${c.type}`,
                  c.color,
                )} />
            ))}
          </div>
          <FooterRow label="VIEW ALL CONTRACTS →" color={DS.gold}
            onClick={() => openModal('CONTRACTS', 'All long-term fleet contracts', DS.gold)} />
        </div>
      </div>

      {/* ── DrillModal ─────────────────────────────────────────────── */}
      {modal && (
        <DrillModal title={modal.title} subtitle={modal.subtitle} color={modal.color} onClose={() => setModal(null)}>
          <DataTable
            columns={VEHICLE_COLS}
            rows={modal.vehicles.length > 0 ? modal.vehicles : ALL_VEHICLES}
            onRowClick={() => {}}
          />
        </DrillModal>
      )}
    </div>
  )
}

// ─── Page-local components ────────────────────────────────────────────────────

function DarkNav() {
  const NAV = ['Tablero', 'Operaciones', 'Flota', 'Inspecciones', 'Mantenimiento', 'Contratos', 'Analítica']

  const nav: CSSProperties = {
    position: 'sticky', top: 0, zIndex: 100,
    height: 52, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 36px',
    background: 'var(--ds-bg-1)',
    borderBottom: '1px solid var(--ds-border)',
  }

  return (
    <nav style={nav}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:24 }}>
        <span style={{ fontSize:22, fontFamily:FONTS.display, color:DS.gold, letterSpacing:'0.08em', lineHeight:1 }}>
          MOVOS
        </span>
        <div style={{ display:'flex', gap:2 }}>
          {NAV.map((item, i) => (
            <a key={item} href="#" style={{
              fontSize: 10, fontFamily: FONTS.mono, textTransform: 'uppercase',
              letterSpacing: '0.08em', padding: '6px 12px',
              color: i === 0 ? DS.gold : 'var(--ds-dim)',
              background: i === 0 ? `${DS.gold}1C` : 'transparent',
              border: i === 0 ? `1px solid ${DS.gold}54` : '1px solid transparent',
              textDecoration: 'none',
              transition: 'color 0.12s',
            }}>
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {/* Bell */}
        <button style={{
          position:'relative', width:32, height:32, background:'transparent',
          border:'1px solid var(--ds-border)', borderRadius:0, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ds-dim)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span style={{
            position:'absolute', top:6, right:6, width:6, height:6,
            background:DS.red, borderRadius:'50%',
          }} />
        </button>

        {/* Admin label */}
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          padding:'4px 12px 4px 8px', border:'1px solid var(--ds-border)',
        }}>
          <div style={{
            width:22, height:22, background:`${DS.gold}1C`,
            border:`1px solid ${DS.gold}54`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:9, fontFamily:FONTS.mono, color:DS.gold, letterSpacing:'0.06em',
          }}>
            RA
          </div>
          <span style={{ fontSize:9, fontFamily:FONTS.mono, color:'var(--ds-dim)', letterSpacing:'0.08em', textTransform:'uppercase' }}>
            Admin
          </span>
        </div>
      </div>
    </nav>
  )
}

function Panel({
  label, count, color, footer, onFooter, children, style,
}: {
  label: string; count?: number; color: string
  footer?: string; onFooter?: () => void
  children: ReactNode; style?: CSSProperties
}) {
  return (
    <div style={{ flex:1, border:'1px solid var(--ds-border)', background:'var(--ds-bg-1)', display:'flex', flexDirection:'column', ...style }}>
      <div style={{ padding:'14px 14px 12px', borderBottom:'1px solid var(--ds-border)', flexShrink:0 }}>
        <SectionLabel label={label} count={count} color={color} />
      </div>
      <div style={{ flex:1 }}>{children}</div>
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
        display:'flex', alignItems:'center', justifyContent:'center',
        height:36, borderTop:'1px solid var(--ds-border)',
        fontSize:9, fontFamily:FONTS.mono, textTransform:'uppercase',
        letterSpacing:'0.1em', color,
        background: hovered ? `${color}14` : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        transition:'background 0.15s',
      }}
    >
      {label}
    </div>
  )
}

function LocationCard({
  code, name, city, units, available, assigned, maintenance, color, onClick,
}: {
  code:string; name:string; city:string; units:number
  available:number; assigned:number; maintenance:number
  color:string; onClick?:() => void
}) {
  const [hovered, setHovered] = useState(false)
  const utilPct = units > 0 ? (assigned / units) : 0

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding:'16px 18px 14px',
        borderTop:`2px solid ${color}`,
        background: hovered ? 'var(--ds-bg-2)' : 'var(--ds-bg-1)',
        cursor: onClick ? 'pointer' : 'default',
        transition:'background 0.15s',
      }}
    >
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
        <div>
          <div style={{ fontSize:9, fontFamily:FONTS.mono, color:'var(--ds-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>
            LOC {code}
          </div>
          <div style={{ fontSize:15, fontFamily:FONTS.display, color:'var(--ds-text)', letterSpacing:'0.04em', lineHeight:1 }}>
            {name}
          </div>
          <div style={{ fontSize:9, fontFamily:FONTS.mono, color:'var(--ds-dim)', marginTop:2 }}>
            {city}
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:32, fontFamily:FONTS.display, color:'var(--ds-text)', lineHeight:1 }}>
            {units}
          </div>
          <div style={{ fontSize:9, fontFamily:FONTS.mono, color:'var(--ds-muted)', letterSpacing:'0.06em' }}>
            units
          </div>
        </div>
      </div>

      {/* Utilization bar */}
      <div style={{ height:2, background:'var(--ds-border)', borderRadius:2, marginBottom:10, overflow:'hidden' }}>
        <div style={{ width:`${utilPct * 100}%`, height:'100%', background:color, borderRadius:2 }} />
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:16 }}>
        <Stat label="Available"   value={available}   color={DS.green}  />
        <Stat label="Assigned"    value={assigned}     color={DS.blue}   />
        <Stat label="Maintenance" value={maintenance}  color={DS.orange} />
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label:string; value:number; color:string }) {
  return (
    <div>
      <div style={{ fontSize:14, fontFamily:FONTS.display, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:8, fontFamily:FONTS.mono, color:'var(--ds-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:2 }}>
        {label}
      </div>
    </div>
  )
}

function ContractCard({
  client, type, units, status, days, color, onClick,
}: {
  client:string; type:string; units:number
  status:string; days:number; color:string; onClick?:() => void
}) {
  const [hovered, setHovered] = useState(false)
  const isExpiring = status === 'expiring'

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'16px 20px',
        borderTop:`2px solid ${color}`,
        background: hovered ? 'var(--ds-bg-2)' : 'var(--ds-bg-1)',
        cursor: onClick ? 'pointer' : 'default',
        transition:'background 0.15s',
        gap:16,
      }}
    >
      {/* Left */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
          <div style={{ fontSize:18, fontFamily:FONTS.display, color:'var(--ds-text)', letterSpacing:'0.04em', lineHeight:1 }}>
            {client}
          </div>
          <StatusBadge label={isExpiring ? 'EXPIRING' : 'ACTIVE'} color={color} small />
        </div>
        <div style={{ fontSize:9, fontFamily:FONTS.mono, color:'var(--ds-dim)', letterSpacing:'0.04em', marginBottom:8 }}>
          {type}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:9, fontFamily:FONTS.mono, color:'var(--ds-muted)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
            Expires in
          </span>
          <span style={{ fontSize:11, fontFamily:FONTS.mono, color, fontWeight:500 }}>
            {days} days
          </span>
          {isExpiring && (
            <span style={{ fontSize:8, fontFamily:FONTS.mono, color:DS.red, letterSpacing:'0.06em', textTransform:'uppercase' }}>
              · ACTION REQUIRED
            </span>
          )}
        </div>
      </div>

      {/* Right — vehicle count */}
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <div style={{ fontSize:36, fontFamily:FONTS.display, color, lineHeight:1 }}>{units}</div>
        <div style={{ fontSize:8, fontFamily:FONTS.mono, color:'var(--ds-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:2 }}>
          vehicles
        </div>
      </div>
    </div>
  )
}
