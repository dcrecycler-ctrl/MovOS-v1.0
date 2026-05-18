// MovOS · Operations screen — bento style
// Operations cycle pipeline (5 stages) + Maintenance cycle (7 stages) + Workshops

const { useState: useStateOps } = React;

(function() {
const { B, SoftCard, SoftBadge, PillButton, Dot, Ring, TopBar, titleCase } = window.MovOSBento;

function OpsIcon({ kind, size=18, color }) {
  const props = { width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:color||'currentColor', strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' };
  const paths = {
    key:    <><circle cx="8" cy="15" r="4"/><path d="M10.5 12.5 21 2"/><path d="m17 6 3 3"/><path d="m18 3 3 3"/></>,
    check:  <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>,
    spray:  <><path d="M3 3h2"/><path d="M7 3h2"/><path d="M3 8h6"/><path d="M3 13h6"/><path d="M14 3v18"/><path d="M14 8h4"/><path d="M14 13h4"/><path d="M14 18h4"/></>,
    eye:    <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    wrench: <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></>,
    pause:  <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    tech:   <><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></>,
    stethoscope: <><path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3h12"/><path d="M5 5v6a3 3 0 0 0 6 0V5"/><path d="M9 18a4 4 0 0 0 4-4v-1"/><circle cx="18" cy="18" r="3"/></>,
    package: <><path d="m16 16 6-12-6-2-6 2-6-2-6 12 6 2 6-2 6 2Z"/><path d="M16 16 10 4"/></>,
    check2: <><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></>,
    flag:   <><path d="M4 22V4"/><path d="M4 4h12l-2 4 2 4H4"/></>,
  };
  return <svg {...props}>{paths[kind] || paths.check}</svg>;
}

// ─── Operations screen ──────────────────────────────────────────
function Operations() {
  const ops = window.MOVOS_OPS_CYCLE;
  const maint = window.MOVOS_MAINT_CYCLE;
  const workshops = window.MOVOS_WORKSHOPS;
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:B.bg, overflow:'hidden', fontFamily:'Inter, sans-serif', color:B.ink }}>
      <TopBar active="Operaciones" />
      <PageHead title="Operaciones" subtitle="Vista del ciclo operativo y mantenimiento" date="Lunes · 17 de mayo, 2026" />
      <div style={{ padding:'0 36px 80px' }}>
        {/* Section: Ops cycle */}
        <SectionHead title="Ciclo operativo" subtitle="5 estados · flujo del vehículo entre rentas">
          <PillButton tone="ghost" size="sm">Ver flujo completo</PillButton>
        </SectionHead>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:14, marginBottom:32 }}>
          {ops.map((s, i) => (
            <PipelineCard key={s.id} stage={s} index={i} total={ops.length} primary />
          ))}
        </div>

        {/* Section: Maintenance cycle */}
        <SectionHead title="Ciclo de mantenimiento" subtitle="7 estados · trabajo en taller">
          <SoftBadge tone="lilac">{maint.reduce((a,b)=>a+b.count,0)} vehículos en ciclo</SoftBadge>
        </SectionHead>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:10, marginBottom:32 }}>
          {maint.map((s, i) => (
            <PipelineCard key={s.id} stage={s} index={i} total={maint.length} compact />
          ))}
        </div>

        {/* Section: Workshops */}
        <SectionHead title="Talleres y proveedores" subtitle="Capacidad actual por ubicación de reparación" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14, marginBottom:14 }}>
          {workshops.map(w => <WorkshopCard key={w.id} w={w} />)}
        </div>
      </div>
    </div>
  );
}

function PipelineCard({ stage, index, total, compact, primary }) {
  const [h, setH] = useStateOps(false);
  const c = B[stage.color];
  const pct = stage.capacity ? (stage.count / stage.capacity) * 100 : (stage.count / 30) * 100;
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        background:B.surface, borderRadius:18,
        padding: compact ? 18 : 22,
        boxShadow: h ? B.shadowMd : B.shadowSm,
        cursor:'pointer', position:'relative', transition:'box-shadow 0.2s, transform 0.2s',
        transform: h ? 'translateY(-1px)' : 'none',
      }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: compact ? 14 : 18 }}>
        <div style={{
          width: compact?32:38, height: compact?32:38, borderRadius: compact?10:12,
          background:B[stage.color+'Soft'], color:c,
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <OpsIcon kind={stage.icon} size={compact?16:18} />
        </div>
        <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink4, fontWeight:500 }}>{String(index+1).padStart(2,'0')}/{String(total).padStart(2,'0')}</span>
      </div>
      <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500, letterSpacing:'0.02em', marginBottom:6 }}>
        {stage.label.toLowerCase().split(' ').map((w,i) => i===0?w.charAt(0).toUpperCase()+w.slice(1):w).join(' ')}
      </div>
      <div style={{ fontFamily:'Inter', fontSize: compact?28:38, fontWeight:600, color:B.ink, letterSpacing:'-0.03em', lineHeight:1 }}>{stage.count}</div>
      {!compact && (
        <div style={{ marginTop:14, height:3, background:B.surface2, borderRadius:9999, overflow:'hidden' }}>
          <div style={{ width:`${Math.min(pct,100)}%`, height:'100%', background:c, borderRadius:9999 }}></div>
        </div>
      )}
      <p style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop: compact?10:12, lineHeight:1.45, margin:0 }}>
        {stage.desc}
      </p>
    </div>
  );
}

function WorkshopCard({ w }) {
  const [h, setH] = useStateOps(false);
  const c = B[w.color];
  const total = w.queue + w.busy + w.done;
  const capacityPct = ((w.queue + w.busy) / w.capacity) * 100;
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        background:B.surface, borderRadius:18, padding:22,
        boxShadow: h ? B.shadowMd : B.shadowSm, cursor:'pointer',
        transition:'box-shadow 0.2s, transform 0.2s', transform: h ? 'translateY(-1px)' : 'none',
      }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <SoftBadge tone={w.color} size={10}>{w.type.toLowerCase()}</SoftBadge>
            <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink4 }}>{w.city}</span>
          </div>
          <h3 style={{ fontFamily:'Inter', fontSize:16, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.01em' }}>{w.name}</h3>
        </div>
        <Ring value={capacityPct} color={c} size={48} stroke={4} label={`${w.busy+w.queue}/${w.capacity}`} />
      </div>
      <div style={{ display:'flex', gap:0, height:6, borderRadius:9999, overflow:'hidden', background:B.surface2, marginBottom:12 }}>
        <div style={{ width: total ? `${(w.queue/total)*100}%` : 0, background:B.amber }}></div>
        <div style={{ width: total ? `${(w.busy/total)*100}%` : 0, background:B.rose }}></div>
        <div style={{ width: total ? `${(w.done/total)*100}%` : 0, background:B.green }}></div>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'Inter', fontSize:11, color:B.ink3 }}>
        <span style={{ display:'flex', alignItems:'center', gap:5 }}><Dot tone="amber" size={5}/> {w.queue} en espera</span>
        <span style={{ display:'flex', alignItems:'center', gap:5 }}><Dot tone="rose"  size={5}/> {w.busy} en taller</span>
        <span style={{ display:'flex', alignItems:'center', gap:5 }}><Dot tone="green" size={5}/> {w.done} liberados</span>
      </div>
    </div>
  );
}

// ─── Shared bits ────────────────────────────────────────────────
function PageHead({ title, subtitle, date, actions }) {
  return (
    <div style={{ padding:'36px 36px 24px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24 }}>
      <div>
        <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, fontWeight:500, marginBottom:8 }}>{date || 'Lunes · 17 de mayo, 2026'}</div>
        <h1 style={{ fontFamily:'Inter', fontSize:34, fontWeight:600, color:B.ink, letterSpacing:'-0.02em', margin:0, lineHeight:1.1 }}>{title}</h1>
        {subtitle && <p style={{ fontFamily:'Inter', fontSize:15, color:B.ink2, marginTop:8, lineHeight:1.5, maxWidth:680, margin:'8px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ display:'flex', gap:8 }}>
        {actions || (
          <>
            <PillButton tone="ghost" size="sm">Exportar</PillButton>
            <PillButton tone="primary" size="sm">+ Nuevo</PillButton>
          </>
        )}
      </div>
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

// ─── Maintenance screen ─────────────────────────────────────────
function Maintenance() {
  const tickets = window.MOVOS_TICKETS;
  const maint = window.MOVOS_MAINT_CYCLE;
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:B.bg, overflow:'hidden', fontFamily:'Inter, sans-serif', color:B.ink }}>
      <TopBar active="Mantenimiento" />
      <PageHead title="Mantenimiento" subtitle="Tickets de reparación · ciclo de servicio · talleres"
        actions={<>
          <PillButton tone="ghost" size="sm">Reglas preventivas</PillButton>
          <PillButton tone="primary" size="sm">+ Nuevo ticket</PillButton>
        </>} />
      <div style={{ padding:'0 36px 80px' }}>
        {/* KPI strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:14, marginBottom:32 }}>
          {[
            { l:'Tickets activos',  v:tickets.length, tone:'rose',  sub:'Esta semana' },
            { l:'En reparación',    v:tickets.filter(t=>t.stage==='EN REPARACIÓN').length, tone:'amber', sub:'Trabajo en curso' },
            { l:'Espera refacciones', v:tickets.filter(t=>t.stage==='ESPERA REFACCIONES').length, tone:'amber', sub:'Bloqueados' },
            { l:'Liberados hoy',    v:maint.find(m=>m.id==='cleared').count, tone:'green', sub:'Vuelven a flota' },
            { l:'Costo MTD',        v:'USD 8.4 K', tone:'sky', sub:'Mayo 2026' },
          ].map(k => (
            <SoftCard key={k.l} padding={20}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, fontWeight:500 }}>{k.l}</span>
                <Dot tone={k.tone} size={6} />
              </div>
              <div style={{ fontFamily:'Inter', fontSize:32, fontWeight:600, color:B.ink, letterSpacing:'-0.03em', lineHeight:1 }}>{k.v}</div>
              <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:8 }}>{k.sub}</div>
            </SoftCard>
          ))}
        </div>

        {/* Tickets table-as-cards */}
        <SectionHead title="Tickets de reparación" subtitle={`${tickets.length} activos · ordenado por antigüedad`}>
          <div style={{ display:'flex', gap:6 }}>
            <SoftBadge tone="neutral">Todos</SoftBadge>
            <SoftBadge tone="amber">Por agendar</SoftBadge>
            <SoftBadge tone="rose">En reparación</SoftBadge>
            <SoftBadge tone="green">Liberados</SoftBadge>
          </div>
        </SectionHead>
        <SoftCard padding={0}>
          <div style={{ display:'grid', gridTemplateColumns:'90px 90px 1fr 1fr 160px 100px 100px 80px', gap:14, padding:'14px 22px', borderBottom:`1px solid ${B.hairline}` }}>
            {['Ticket','Unidad','Modelo','Falla','Etapa','Taller','Costo','Días'].map(h=>(
              <span key={h} style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500 }}>{h}</span>
            ))}
          </div>
          {tickets.map((t, i) => (
            <div key={t.id} style={{
              display:'grid', gridTemplateColumns:'90px 90px 1fr 1fr 160px 100px 100px 80px', gap:14,
              padding:'16px 22px', alignItems:'center',
              borderBottom: i < tickets.length-1 ? `1px solid ${B.hairline}` : 'none',
              cursor:'pointer', transition:'background 0.15s',
            }}
              onMouseEnter={e=>e.currentTarget.style.background=B.surface2}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2, fontWeight:500 }}>{t.id}</span>
              <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:600 }}>{t.unit}</span>
              <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink2 }}>{t.model}</span>
              <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink2 }}>{t.issue}</span>
              <SoftBadge tone={t.color} size={10}>{titleCase(t.stage)}</SoftBadge>
              <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2 }}>{t.workshop}</span>
              <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>{t.cost ? `USD ${(t.cost/1000).toFixed(1)}k` : '—'}</span>
              <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3 }}>{t.days===0 ? 'hoy' : t.days===1 ? 'ayer' : `${t.days} d`}</span>
            </div>
          ))}
        </SoftCard>
      </div>
    </div>
  );
}

// ─── Inspections screen ─────────────────────────────────────────
function Inspections() {
  const insp = window.MOVOS_INSPECTIONS;
  const active = insp.filter(i => i.status === 'EN CURSO');
  const pending = insp.filter(i => i.status === 'EN ESPERA');
  const done = insp.filter(i => i.status === 'COMPLETA');
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:B.bg, overflow:'hidden', fontFamily:'Inter, sans-serif', color:B.ink }}>
      <TopBar active="Inspecciones" />
      <PageHead title="Inspecciones" subtitle="Pre-entrega y post-retorno · sincronizado con CarCheck móvil"
        actions={<>
          <PillButton tone="ghost" size="sm">Configurar checklist</PillButton>
          <PillButton tone="primary" size="sm">+ Programar inspección</PillButton>
        </>} />
      <div style={{ padding:'0 36px 80px' }}>
        {/* Status overview */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:32 }}>
          {[
            { l:'En curso', v:active.length, tone:'blue',  sub:'Inspectores activos' },
            { l:'En espera', v:pending.length, tone:'amber', sub:'Por iniciar' },
            { l:'Completas hoy', v:done.length, tone:'green', sub:'Últimas 24 horas' },
            { l:'Hallazgos detectados', v:done.reduce((a,b)=>a+(b.findings||0),0), tone:'rose', sub:'Daños · sin agendar 1' },
          ].map(k => (
            <SoftCard key={k.l} padding={20}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, fontWeight:500 }}>{k.l}</span>
                <Dot tone={k.tone} size={6} />
              </div>
              <div style={{ fontFamily:'Inter', fontSize:36, fontWeight:600, color:B.ink, letterSpacing:'-0.03em', lineHeight:1 }}>{k.v}</div>
              <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:8 }}>{k.sub}</div>
            </SoftCard>
          ))}
        </div>

        {/* Active inspections */}
        <SectionHead title="Inspecciones en curso" subtitle="Inspectores en campo · progreso en tiempo real" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14, marginBottom:32 }}>
          {active.map(i => (
            <SoftCard key={i.id} padding={22}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                <div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                    <SoftBadge tone="blue" size={10}>{i.kind === 'PRE-ENTREGA' ? 'pre-entrega' : 'post-retorno'}</SoftBadge>
                    <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink4 }}>{i.id}</span>
                  </div>
                  <h3 style={{ fontFamily:'Inter', fontSize:18, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.015em' }}>{i.unit} · {i.model}</h3>
                  <p style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, margin:'6px 0 0' }}>{i.branch} · inspector {i.inspector}</p>
                </div>
                <span style={{ fontFamily:'Inter', fontSize:14, color:B.ink, fontWeight:600 }}>{i.stepsDone}/{i.stepsTotal}</span>
              </div>
              {/* Step progress */}
              <div style={{ display:'flex', gap:6 }}>
                {['Odómetro+Comb.', 'Checklist', 'Mapa daños', 'Fotos', 'Firma'].map((step, idx) => {
                  const isDone = idx < i.stepsDone;
                  const isActive = idx === i.stepsDone;
                  return (
                    <div key={step} style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
                      <div style={{
                        height:4, borderRadius:9999,
                        background: isDone ? B.green : isActive ? B.blue : B.surface2,
                      }}></div>
                      <span style={{ fontFamily:'Inter', fontSize:10, color: isActive?B.ink:B.ink3, fontWeight: isActive?500:400 }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </SoftCard>
          ))}
        </div>

        {/* Recent completed */}
        <SectionHead title="Completadas recientemente" subtitle="Sincronizadas desde CarCheck móvil" />
        <SoftCard padding={0}>
          {[...done, ...pending].map((i, idx, arr) => (
            <div key={i.id} style={{
              display:'grid', gridTemplateColumns:'90px 1fr 120px 130px 160px 80px 100px', gap:14,
              padding:'14px 22px', alignItems:'center',
              borderBottom: idx < arr.length-1 ? `1px solid ${B.hairline}` : 'none',
              cursor:'pointer', transition:'background 0.15s',
            }}
              onMouseEnter={e=>e.currentTarget.style.background=B.surface2}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2 }}>{i.id}</span>
              <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>{i.unit} · {i.model}</span>
              <SoftBadge tone={i.color} size={10}>{i.status.toLowerCase()}</SoftBadge>
              <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2 }}>{i.kind.toLowerCase()}</span>
              <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2 }}>{i.branch}</span>
              <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2 }}>{i.inspector.split(' ')[0]}</span>
              {i.findings != null ? (
                <SoftBadge tone={i.findings ? 'rose' : 'green'} size={10}>{i.findings} hallazgos</SoftBadge>
              ) : (
                <span></span>
              )}
            </div>
          ))}
        </SoftCard>
      </div>
    </div>
  );
}

window.MovOSOperations  = Operations;
window.MovOSMaintenance = Maintenance;
window.MovOSInspections = Inspections;
})();
