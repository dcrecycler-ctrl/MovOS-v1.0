// MovOS · Fleet + Vehicle File + Contracts screens (bento)

const { useState: useStateFlt } = React;

(function() {
const { B, SoftCard, SoftBadge, PillButton, Dot, Ring, SourceIcon, TopBar, titleCase } = window.MovOSBento;

// ─── shared bits ──────────────────────────────────────────────
function PageHead({ title, subtitle, date, actions }) {
  return (
    <div style={{ padding:'36px 36px 24px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24 }}>
      <div>
        <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, fontWeight:500, marginBottom:8 }}>{date || 'Lunes · 17 de mayo, 2026'}</div>
        <h1 style={{ fontFamily:'Inter', fontSize:34, fontWeight:600, color:B.ink, letterSpacing:'-0.02em', margin:0, lineHeight:1.1 }}>{title}</h1>
        {subtitle && <p style={{ fontFamily:'Inter', fontSize:15, color:B.ink2, marginTop:8, lineHeight:1.5, maxWidth:680, margin:'8px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ display:'flex', gap:8 }}>{actions}</div>
    </div>
  );
}

function SectionHead({ title, subtitle, children }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:12, marginBottom:14 }}>
      <div>
        <h2 style={{ fontFamily:'Inter', fontSize:18, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.01em' }}>{title}</h2>
        {subtitle && <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, marginTop:4, margin:'4px 0 0' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

const STATUS_TONE = { green:'green', red:'rose', blue:'blue', gold:'amber', yellow:'amber', purple:'lilac' };

// ─── Fleet screen ──────────────────────────────────────────────
function Fleet() {
  const fleet = window.MOVOS_FLEET;
  const [activeBranch, setActiveBranch] = useStateFlt('Todas');
  const [activeStatus, setActiveStatus] = useStateFlt('Todos');
  const [activeCategory, setActiveCategory] = useStateFlt('Todas');

  const filtered = fleet.filter(v => {
    if (activeBranch !== 'Todas' && v.branch !== activeBranch) return false;
    if (activeCategory !== 'Todas' && v.category !== activeCategory) return false;
    if (activeStatus !== 'Todos') {
      const map = { 'Disponibles':'DISPONIBLE', 'Asignados':'ASIGNADO', 'Fuera de servicio':'FUERA DE SERVICIO', 'En mantenimiento':'EN MANTENIMIENTO' };
      if (v.status !== map[activeStatus]) return false;
    }
    return true;
  });

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:B.bg, overflow:'hidden', fontFamily:'Inter, sans-serif', color:B.ink }}>
      <TopBar active="Flota" />
      <PageHead title="Flota" subtitle="248 vehículos · 4 sucursales · Karve sincronizado"
        actions={<>
          <PillButton tone="ghost" size="sm">Exportar CSV</PillButton>
          <PillButton tone="ghost" size="sm">Importar Excel</PillButton>
          <PillButton tone="primary" size="sm">+ Alta de vehículo</PillButton>
        </>} />

      <div style={{ padding:'0 36px 80px', display:'grid', gridTemplateColumns:'240px 1fr', gap:20 }}>
        {/* Sidebar filters */}
        <SoftCard padding={22} style={{ alignSelf:'flex-start' }}>
          <div style={{ position:'relative', marginBottom:18 }}>
            <input placeholder="Buscar unidad, placa…" style={{
              fontFamily:'Inter', fontSize:13, padding:'9px 14px 9px 36px', width:'100%',
              background:B.surface2, border:'none', borderRadius:9999, color:B.ink, outline:'none',
            }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={B.ink3} strokeWidth="2" style={{ position:'absolute', left:14, top:11 }}>
              <circle cx="11" cy="11" r="7"></circle><path d="m20 20-3-3"></path>
            </svg>
          </div>
          <FilterGroup title="Sucursal" options={['Todas','Montevideo','Colonia','Punta del Este','Salto']}
            active={activeBranch} setActive={setActiveBranch} />
          <FilterGroup title="Estado" options={['Todos','Disponibles','Asignados','Fuera de servicio','En mantenimiento']}
            active={activeStatus} setActive={setActiveStatus} tones={['neutral','green','blue','rose','lilac']} />
          <FilterGroup title="Categoría" options={['Todas','Sedán','Compacto','SUV','Premium']}
            active={activeCategory} setActive={setActiveCategory} />
          <FilterGroup title="Contrato" options={['Todos','Renta corta','Largo plazo']} />
          <PillButton tone="ghost" size="sm">Limpiar filtros</PillButton>
        </SoftCard>

        {/* Vehicle cards (bento grid) */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontFamily:'Inter', fontSize:14, color:B.ink2 }}>
              <strong style={{ color:B.ink, fontWeight:600 }}>{filtered.length}</strong> vehículos
              {activeBranch !== 'Todas' && <span style={{ color:B.ink3 }}> · {activeBranch}</span>}
              {activeStatus !== 'Todos' && <span style={{ color:B.ink3 }}> · {activeStatus}</span>}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Inter', fontSize:12, color:B.ink3 }}>
              Ordenar por
              <SoftBadge tone="neutral">Unidad ↓</SoftBadge>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12 }}>
            {filtered.map(v => <VehicleCard key={v.unit} v={v} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, options, active, setActive, tones }) {
  return (
    <div style={{ marginBottom:20 }}>
      <h4 style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500, letterSpacing:'0.04em', textTransform:'uppercase', margin:'0 0 8px' }}>{title}</h4>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {options.map((opt, i) => (
          <div key={opt} onClick={()=>setActive && setActive(opt)}
            style={{
              padding:'7px 10px', borderRadius:8, cursor:setActive?'pointer':'default',
              background: active === opt ? B.surface2 : 'transparent',
              fontFamily:'Inter', fontSize:13, fontWeight: active === opt ? 500 : 400,
              color: active === opt ? B.ink : B.ink2,
              display:'flex', alignItems:'center', gap:8,
              transition:'background 0.15s',
            }}>
            {tones && <Dot tone={tones[i] || 'neutral'} size={6} />}
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
}

function VehicleCard({ v }) {
  const [h, setH] = useStateFlt(false);
  const tone = STATUS_TONE[v.statusColor] || 'neutral';
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        background:B.surface, borderRadius:16, padding:'16px 18px',
        boxShadow: h ? B.shadowMd : B.shadowSm, cursor:'pointer',
        transition:'box-shadow 0.2s, transform 0.2s', transform: h?'translateY(-1px)':'none',
        display:'grid', gridTemplateColumns:'auto 1fr auto', gap:14, alignItems:'center',
      }}>
      <div style={{
        width:42, height:42, borderRadius:12, background:B.surface2,
        display:'flex', alignItems:'center', justifyContent:'center', color:B.ink3, flexShrink:0,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
          <circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>
        </svg>
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ display:'flex', gap:8, alignItems:'baseline', marginBottom:3 }}>
          <span style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, letterSpacing:'-0.005em' }}>{v.unit}</span>
          <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3 }}>{v.plate}</span>
          {v.alert && <SoftBadge tone="rose" size={9}>!</SoftBadge>}
        </div>
        <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.model}</div>
        <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:3 }}>{v.branch} · {v.km.toLocaleString('es-MX')} km · {v.category}</div>
      </div>
      <div style={{ textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
        <SoftBadge tone={tone} size={10}>{v.status.toLowerCase()}</SoftBadge>
        {v.contract !== 'CORTO' && <span style={{ fontFamily:'Inter', fontSize:10, color:B.ink3 }}>{v.contract}</span>}
      </div>
    </div>
  );
}

// ─── Vehicle File screen ──────────────────────────────────────
const VEHICLE_TABS = [
  { id:'overview',  label:'Resumen' },
  { id:'service',   label:'Servicio' },
  { id:'qr',        label:'Código QR' },
  { id:'alerts',    label:'Alertas manuales' },
  { id:'history',   label:'Historial' },
];

function VehicleFile() {
  const v = window.MOVOS_VEHICLE_DETAIL;
  const [tab, setTab] = useStateFlt('overview');
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:B.bg, overflow:'hidden', fontFamily:'Inter, sans-serif', color:B.ink }}>
      <TopBar active="Flota" />
      {/* Vehicle hero */}
      <div style={{ padding:'28px 36px 0' }}>
        <div style={{ display:'flex', gap:8, fontFamily:'Inter', fontSize:12, color:B.ink3, marginBottom:14 }}>
          <span>Flota</span><span>›</span><span>Montevideo</span><span>›</span><span style={{ color:B.ink2, fontWeight:500 }}>{v.unit}</span>
        </div>
        <SoftCard padding={28} style={{ marginBottom:24 }}>
          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center' }}>
            <div style={{
              width:104, height:104, borderRadius:18, background:B.surface2,
              display:'flex', alignItems:'center', justifyContent:'center', color:B.ink3, flexShrink:0,
            }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                <circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>
              </svg>
            </div>
            <div>
              <div style={{ display:'flex', gap:8, marginBottom:8, alignItems:'center' }}>
                <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink4 }}>{v.plate}</span>
                <SoftBadge tone="rose" size={10}>fuera de servicio</SoftBadge>
                <SoftBadge tone="amber" size={10}>por agendar reparación</SoftBadge>
              </div>
              <h1 style={{ fontFamily:'Inter', fontSize:32, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.025em', lineHeight:1.05 }}>{v.unit} · {v.model}</h1>
              <p style={{ fontFamily:'Inter', fontSize:14, color:B.ink2, margin:'6px 0 0' }}>{v.year} · {v.color} · {v.branch} · {v.km.toLocaleString('es-MX')} km</p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <PillButton tone="ghost" size="sm">Imprimir QR</PillButton>
              <PillButton tone="ghost" size="sm">Crear alerta manual</PillButton>
              <PillButton tone="primary" size="sm">Agendar reparación →</PillButton>
            </div>
          </div>
        </SoftCard>
      </div>

      {/* Tabs */}
      <div style={{ padding:'0 36px', borderBottom:`1px solid ${B.hairline}`, display:'flex', gap:4, marginBottom:24 }}>
        {VEHICLE_TABS.map(t => (
          <div key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:'12px 16px', fontFamily:'Inter', fontSize:13,
            color: tab === t.id ? B.ink : B.ink3, fontWeight: tab === t.id ? 500 : 400,
            borderBottom: tab === t.id ? `2px solid ${B.ink}` : '2px solid transparent',
            cursor:'pointer', transition:'color 0.15s, border-color 0.15s', marginBottom:-1,
          }}>{t.label}</div>
        ))}
      </div>

      <div style={{ padding:'0 36px 80px' }}>
        {tab === 'overview'  && <VehicleOverview v={v} />}
        {tab === 'service'   && <VehicleService v={v} />}
        {tab === 'qr'        && <VehicleQR v={v} />}
        {tab === 'alerts'    && <VehicleManualAlert v={v} />}
        {tab === 'history'   && <VehicleHistory v={v} />}
      </div>
    </div>
  );
}

function VehicleOverview({ v }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
      <SoftCard padding={22} style={{ gridColumn:'span 2' }}>
        <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 18px' }}>Ficha técnica</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px 28px' }}>
          {[
            ['VIN', v.vin],
            ['Motor', v.engine],
            ['Transmisión', v.transmission],
            ['Combustible', v.fuel],
            ['Categoría', v.category],
            ['Sucursal', v.branch],
            ['Ingreso a flota', v.acquired],
            ['Costo de adquisición', v.acquisitionCost],
          ].map(([k,val]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', paddingBottom:10, borderBottom:`1px solid ${B.hairline}` }}>
              <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3 }}>{k}</span>
              <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>{val}</span>
            </div>
          ))}
        </div>
      </SoftCard>

      <SoftCard padding={22}>
        <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 18px' }}>Documentación</h3>
        {[
          { label:'Seguro', val:v.insurance, expires:v.insuranceExpires, tone:'green' },
          { label:'SOAT',    val:v.soat,      expires:null, tone:'green' },
          { label:'ITV',     val:v.itv,       expires:null, tone:'green' },
          { label:'Próximo servicio', val:v.serviceNext, expires:null, tone:'amber' },
        ].map(d => (
          <div key={d.label} style={{ padding:'10px 0', borderBottom:`1px solid ${B.hairline}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
              <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3 }}>{d.label}</span>
              <Dot tone={d.tone} size={6} />
            </div>
            <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink }}>{d.val}</div>
            {d.expires && <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:3 }}>{d.expires}</div>}
          </div>
        ))}
      </SoftCard>

      <SoftCard padding={22} style={{ gridColumn:'span 3' }}>
        <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 18px' }}>Métricas del vehículo</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:24 }}>
          {[
            { l:'Kilometraje',  v:v.km.toLocaleString('es-MX'), sub:'km', tone:'blue' },
            { l:'Días en flota', v:'421',                        sub:'desde alta', tone:'sky' },
            { l:'Ingresos generados', v:'USD 9.8 K',             sub:'acumulado', tone:'green' },
            { l:'Costo mantenimiento', v:'USD 1.4 K',            sub:'acumulado', tone:'amber' },
            { l:'Score',         v:'38',                          sub:'/100 · evaluar',   tone:'rose' },
          ].map(m => (
            <div key={m.l}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                <Dot tone={m.tone} size={6} />
                <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500 }}>{m.l}</span>
              </div>
              <div style={{ fontFamily:'Inter', fontSize:24, fontWeight:600, color:B.ink, letterSpacing:'-0.02em' }}>{m.v}</div>
              <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:4 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </SoftCard>
    </div>
  );
}

function VehicleService({ v }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
      <SoftCard padding={22}>
        <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 18px' }}>Programa del manufacturador</h3>
        {[
          { km:'5 000',  done:true,  d:'Servicio inicial' },
          { km:'15 000', done:true,  d:'Aceite + filtros' },
          { km:'30 000', done:false, d:'Próximo · pendiente', active:true },
          { km:'50 000', done:false, d:'Servicio mayor' },
          { km:'75 000', done:false, d:'Revisión de bomba' },
        ].map((s, i, arr) => (
          <div key={s.km} style={{ display:'flex', gap:14, alignItems:'center', padding:'14px 0', borderBottom: i < arr.length-1 ? `1px solid ${B.hairline}`:'none' }}>
            <div style={{ width:32, height:32, borderRadius:10, background: s.done ? B.greenSoft : s.active ? B.amberSoft : B.surface2, color: s.done ? B.green : s.active ? B.amber : B.ink4, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter', fontSize:11, fontWeight:600 }}>
              {s.done ? '✓' : i+1}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'Inter', fontSize:13, fontWeight:500, color:B.ink }}>{s.km} km</div>
              <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:2 }}>{s.d}</div>
            </div>
            {s.active && <SoftBadge tone="amber" size={10}>11 580 km</SoftBadge>}
          </div>
        ))}
      </SoftCard>

      <SoftCard padding={22}>
        <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 18px' }}>Reglas internas</h3>
        <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink2, lineHeight:1.6, margin:'0 0 18px' }}>
          Reglas operativas que se aplican además del programa del manufacturador.
        </p>
        {[
          { l:'Limpieza profunda', f:'Cada 60 días o 5 000 km' },
          { l:'Revisión de llantas', f:'Cada 90 días' },
          { l:'Renovación de SOAT', f:'Anual · alerta 30 días antes' },
          { l:'ITV',                 f:'Cada 2 años · alerta 14 días antes' },
        ].map((r, i, arr) => (
          <div key={r.l} style={{ padding:'12px 0', borderBottom: i < arr.length-1 ? `1px solid ${B.hairline}` : 'none' }}>
            <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>{r.l}</div>
            <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:3 }}>{r.f}</div>
          </div>
        ))}
      </SoftCard>
    </div>
  );
}

function VehicleQR({ v }) {
  // Stylized QR code (visual placeholder, not scannable)
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
      <SoftCard padding={28}>
        <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 18px' }}>QR del vehículo</h3>
        <div style={{ display:'flex', justifyContent:'center', padding:'24px 0' }}>
          <div style={{ width:240, height:240, background:B.surface2, borderRadius:18, padding:18, display:'flex', flexDirection:'column' }}>
            <FakeQR />
            <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, textAlign:'center', marginTop:10, fontWeight:500 }}>{v.unit} · {v.plate}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
          <PillButton tone="ghost" size="sm">Descargar PNG</PillButton>
          <PillButton tone="ghost" size="sm">PDF</PillButton>
          <PillButton tone="primary" size="sm">Imprimir etiqueta</PillButton>
        </div>
      </SoftCard>
      <SoftCard padding={22}>
        <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 14px' }}>Cómo se usa</h3>
        {[
          { l:'CarCheck móvil', d:'Escaneo abre la inspección pre-entrega o post-retorno en la app del operador.' },
          { l:'Identificación rápida', d:'Cualquier miembro del equipo accede al expediente con un escaneo.' },
          { l:'Movimiento entre etapas', d:'Cambia el estado operativo del vehículo (a limpieza, mantenimiento, etc.).' },
          { l:'Sin login para operadores', d:'Sesión activa basta. Útil para entregas rápidas en sucursales secundarias.' },
        ].map(u => (
          <div key={u.l} style={{ padding:'12px 0', borderBottom:`1px solid ${B.hairline}` }}>
            <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>{u.l}</div>
            <p style={{ fontFamily:'Inter', fontSize:12, color:B.ink2, lineHeight:1.5, margin:'4px 0 0' }}>{u.d}</p>
          </div>
        ))}
      </SoftCard>
    </div>
  );
}

function FakeQR() {
  const cells = [];
  const seed = 137;
  for (let r = 0; r < 21; r++) for (let c = 0; c < 21; c++) {
    const corner =
      (r < 7 && c < 7) ? ((r === 0 || r === 6 || c === 0 || c === 6 || (r>=2 && r<=4 && c>=2 && c<=4)) ? 1 : 0) :
      (r < 7 && c > 13) ? ((r === 0 || r === 6 || c === 14 || c === 20 || (r>=2 && r<=4 && c>=16 && c<=18)) ? 1 : 0) :
      (r > 13 && c < 7) ? ((r === 14 || r === 20 || c === 0 || c === 6 || (r>=16 && r<=18 && c>=2 && c<=4)) ? 1 : 0) :
      null;
    const on = corner != null ? corner : (((r*37 + c*seed + r*c) % 7) < 3 ? 1 : 0);
    if (on) cells.push([r, c]);
  }
  const size = 200, cell = size/21;
  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ display:'block', margin:'auto' }}>
      <rect width={size} height={size} fill="#FFFFFF" rx="4"/>
      {cells.map(([r,c]) => (
        <rect key={`${r}-${c}`} x={c*cell+1} y={r*cell+1} width={cell-1.5} height={cell-1.5} fill={B.ink} rx="0.5"/>
      ))}
    </svg>
  );
}

function VehicleManualAlert({ v }) {
  return (
    <SoftCard padding={28} style={{ maxWidth:720 }}>
      <h3 style={{ fontFamily:'Inter', fontSize:16, fontWeight:600, color:B.ink, margin:'0 0 6px' }}>Crear alerta manual</h3>
      <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink2, lineHeight:1.5, margin:'0 0 24px' }}>
        Registrar un reporte manual desde escritorio. Se sumará a la bandeja de Incidentes en curso del Tablero.
      </p>
      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
        <FormField label="Nivel" >
          <div style={{ display:'flex', gap:8 }}>
            {['Crítico','Alto','Medio','Información'].map((lvl, i) => (
              <SoftBadge key={lvl} tone={['rose','amber','amber','neutral'][i]} size={11}>{lvl.toLowerCase()}</SoftBadge>
            ))}
          </div>
        </FormField>
        <FormField label="Descripción del problema">
          <textarea rows={3} placeholder="Describí qué sucedió o qué requiere atención…" style={{
            fontFamily:'Inter', fontSize:13, padding:'12px 14px', width:'100%',
            background:B.surface2, border:'none', borderRadius:12, color:B.ink, outline:'none', resize:'vertical',
          }} />
        </FormField>
        <FormField label="Acción al guardar">
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {['Mover a Fuera de servicio + crear ticket de reparación','Solo notificar al gerente','Crear recordatorio (sin cambiar estado)'].map(opt => (
              <div key={opt} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:12, background:B.surface2 }}>
                <div style={{ width:16, height:16, borderRadius:9999, border:`1.5px solid ${B.ink3}` }}></div>
                <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink2 }}>{opt}</span>
              </div>
            ))}
          </div>
        </FormField>
        <FormField label="Notificar a">
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['R. Ávila (operaciones)','C. Rodríguez (gerente PDE)','Taller MovOS Centro','+ Agregar destinatario'].map(p => (
              <SoftBadge key={p} tone={p.startsWith('+')?'neutral':'blue'}>{p}</SoftBadge>
            ))}
          </div>
        </FormField>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:8 }}>
          <PillButton tone="ghost" size="sm">Cancelar</PillButton>
          <PillButton tone="primary" size="sm">Guardar alerta →</PillButton>
        </div>
      </div>
    </SoftCard>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{ fontFamily:'Inter', fontSize:12, color:B.ink2, fontWeight:500, display:'block', marginBottom:8 }}>{label}</label>
      {children}
    </div>
  );
}

function VehicleHistory({ v }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:14 }}>
      <SoftCard padding={28}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:0 }}>Línea de tiempo · {v.events.length} eventos</h3>
          <div style={{ display:'flex', gap:6 }}>
            <SoftBadge tone="neutral">Todos</SoftBadge>
            <SoftBadge tone="rose">Daños</SoftBadge>
            <SoftBadge tone="amber">Servicio</SoftBadge>
            <SoftBadge tone="blue">Rentas</SoftBadge>
          </div>
        </div>
        {v.events.map((e, i, arr) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'auto auto 1fr auto', gap:14, alignItems:'flex-start', padding:'14px 0', borderBottom: i < arr.length-1 ? `1px solid ${B.hairline}`:'none' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <Dot tone={e.tone} size={8} />
              {i < arr.length-1 && <div style={{ width:1, flex:1, background:B.hairline }}></div>}
            </div>
            <div style={{ minWidth:80 }}>
              <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink, fontWeight:500 }}>{e.d}</div>
              <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3 }}>{e.time}</div>
            </div>
            <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink2, lineHeight:1.5, paddingTop:1 }}>{e.e}</div>
            <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3 }}>{e.actor}</span>
          </div>
        ))}
      </SoftCard>
      <SoftCard padding={22} style={{ alignSelf:'flex-start' }}>
        <h3 style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:B.ink, margin:'0 0 14px' }}>Filtros</h3>
        {['Daños','Servicios programados','Rentas (entregas/retornos)','Limpiezas','Cambios de estado','Alertas manuales'].map(f => (
          <div key={f} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0' }}>
            <div style={{ width:14, height:14, borderRadius:4, background:B.surface2, border:`1.5px solid ${B.ink3}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:B.ink2 }}>✓</div>
            <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2 }}>{f}</span>
          </div>
        ))}
      </SoftCard>
    </div>
  );
}

// ─── Contracts screen ─────────────────────────────────────────
function Contracts() {
  const long = window.MOVOS_CONTRACTS;
  const today = window.MOVOS_KARVE_TODAY;
  const [tab, setTab] = useStateFlt('long');
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:B.bg, overflow:'hidden', fontFamily:'Inter, sans-serif', color:B.ink }}>
      <TopBar active="Contratos" />
      <PageHead title="Contratos" subtitle="Renta corta sincronizada vía Karve · contratos corporativos a largo plazo"
        actions={<>
          <PillButton tone="ghost" size="sm">Forzar sincronización Karve</PillButton>
          <PillButton tone="primary" size="sm">+ Nuevo contrato</PillButton>
        </>} />
      <div style={{ padding:'0 36px 80px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:24, borderBottom:`1px solid ${B.hairline}` }}>
          {[
            { id:'long',  label:'Largo plazo', count:long.length },
            { id:'short', label:'Renta corta · hoy', count:today.length },
          ].map(t => (
            <div key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:'12px 16px', fontFamily:'Inter', fontSize:13,
              color: tab === t.id ? B.ink : B.ink3, fontWeight: tab === t.id ? 500 : 400,
              borderBottom: tab === t.id ? `2px solid ${B.ink}` : '2px solid transparent',
              cursor:'pointer', marginBottom:-1, display:'flex', gap:8, alignItems:'center',
            }}>
              {t.label}
              <span style={{ fontSize:11, color:B.ink3, padding:'2px 8px', borderRadius:9999, background:tab===t.id?B.surface2:'transparent' }}>{t.count}</span>
            </div>
          ))}
        </div>

        {tab === 'long' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:24 }}>
              {[
                { l:'Contratos activos', v:long.length, tone:'green' },
                { l:'Vehículos en contratos', v:long.reduce((a,b)=>a+b.fleet,0), tone:'blue' },
                { l:'Por renovar (90 d)', v:long.filter(c=>c.color!=='green').length, tone:'amber' },
                { l:'Ingreso mensual', v:'USD 84 K', tone:'sky' },
              ].map(k => (
                <SoftCard key={k.l} padding={20}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                    <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, fontWeight:500 }}>{k.l}</span>
                    <Dot tone={k.tone} size={6} />
                  </div>
                  <div style={{ fontFamily:'Inter', fontSize:32, fontWeight:600, color:B.ink, letterSpacing:'-0.03em' }}>{k.v}</div>
                </SoftCard>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
              {long.map(c => {
                const tone = c.color === 'green' ? 'green' : c.color === 'orange' ? 'amber' : 'rose';
                return (
                  <SoftCard key={c.id} padding={26}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                      <div>
                        <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink4, fontWeight:500, marginBottom:6 }}>{c.id}</div>
                        <h3 style={{ fontFamily:'Inter', fontSize:20, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.015em' }}>{c.client.charAt(0)+c.client.slice(1).toLowerCase()}</h3>
                        <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, marginTop:6 }}>{c.type.toLowerCase()}</div>
                      </div>
                      <SoftBadge tone={tone}>{c.status.toLowerCase()}</SoftBadge>
                    </div>
                    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24 }}>
                      <div>
                        <div style={{ fontFamily:'Inter', fontSize:44, fontWeight:600, color:B.ink, letterSpacing:'-0.03em', lineHeight:1 }}>{c.fleet}</div>
                        <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, marginTop:6 }}>vehículos asignados</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>{c.expires}</div>
                        <div style={{ fontFamily:'Inter', fontSize:12, color:B[tone], marginTop:4 }}>renueva en {c.renewIn.toLowerCase()}</div>
                      </div>
                    </div>
                  </SoftCard>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'short' && (
          <div>
            <SoftCard padding={20} style={{ background:B.blueSoft, marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:B.surface, color:B.blue, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>Sincronización Karve activa</div>
                    <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink2, marginTop:2 }}>Última sincronización hace 47 segundos · sin errores</div>
                  </div>
                </div>
                <PillButton tone="ghost" size="sm">Ver log</PillButton>
              </div>
            </SoftCard>
            <SoftCard padding={0}>
              <div style={{ display:'grid', gridTemplateColumns:'70px 100px 1fr 1fr 110px 130px 90px 110px', gap:14, padding:'14px 22px', borderBottom:`1px solid ${B.hairline}` }}>
                {['Hora','Tipo','Cliente','Vehículo','Placa','Sucursal','Días','Estado'].map(h=>(
                  <span key={h} style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500 }}>{h}</span>
                ))}
              </div>
              {today.map((t, i, arr) => (
                <div key={t.time+t.unit} style={{
                  display:'grid', gridTemplateColumns:'70px 100px 1fr 1fr 110px 130px 90px 110px', gap:14,
                  padding:'16px 22px', alignItems:'center',
                  borderBottom: i < arr.length-1 ? `1px solid ${B.hairline}` : 'none',
                }}>
                  <span style={{ fontFamily:'Inter', fontSize:14, color:B.ink, fontWeight:600 }}>{t.time}</span>
                  <SoftBadge tone={t.kind === 'ENTREGA' ? 'green' : 'blue'} size={10}>{t.kind.toLowerCase()}</SoftBadge>
                  <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink2 }}>{t.client}</span>
                  <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink2 }}>{t.unit} · {t.model}</span>
                  <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3 }}>{t.plate}</span>
                  <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2 }}>{t.branch}</span>
                  <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink }}>{t.days} d</span>
                  <SoftBadge tone={t.status === 'CONFIRMADA' ? 'green' : t.status === 'INSPECCIÓN' ? 'blue' : 'amber'} size={10}>
                    {t.status.toLowerCase()}
                  </SoftBadge>
                </div>
              ))}
            </SoftCard>
          </div>
        )}
      </div>
    </div>
  );
}

window.MovOSFleet       = Fleet;
window.MovOSVehicleFile = VehicleFile;
window.MovOSContracts   = Contracts;
})();
