// MovOS — Dashboard (theme-aware: dark + light).
// Reads from window.MOVOS_* data. Modal state lives inside the artboard
// container so it doesn't escape design-canvas scaling.

const { useState, useMemo, useEffect, useRef, Fragment } = React;

// ─── Atoms ──────────────────────────────────────────────────────────
function SectionLabel({ t, color, label, count }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
      <div style={{ width:3, height:14, background:color }}></div>
      <span style={{ fontSize:9, color:t.muted, letterSpacing:'0.2em', textTransform:'uppercase' }}>{label}</span>
      {count != null && (
        <span style={{ fontSize:9, color, padding:'2px 8px', border:`1px solid ${color}55`, background:color+'18', letterSpacing:'0.1em' }}>
          {count}
        </span>
      )}
    </div>
  );
}

function Badge({ t, color, children, size=9 }) {
  return (
    <span style={{
      fontSize:size, color, padding:'2px 7px',
      border:`1px solid ${color}55`, background:color+'18',
      letterSpacing:'0.1em', textTransform:'uppercase',
      fontFamily:"'DM Mono',monospace", display:'inline-block', lineHeight:1.4,
    }}>{children}</span>
  );
}

// Hoverable card primitive — top-border accent + VIEW → on hover + bg-2 hover.
function Card({ t, color, hoverColor, padding=18, children, onClick, viewLabel='VER →', showView=true, style={} }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      onClick={onClick}
      style={{
        position:'relative', background: h?t.bg2:t.bg1,
        border:`1px solid ${t.border}`,
        borderTop:`2px solid ${h?(hoverColor||color):color}`,
        padding, cursor: onClick?'pointer':'default',
        transition:'background 0.15s, border-color 0.15s', ...style,
      }}>
      {children}
      {showView && onClick && (
        <span style={{
          position:'absolute', right:14, bottom:10,
          fontSize:9, color, letterSpacing:'0.18em', opacity: h?1:0,
          transition:'opacity 0.15s', fontFamily:"'DM Mono',monospace",
        }}>{viewLabel}</span>
      )}
    </div>
  );
}

// ─── NAV ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:'tablero',      label:'TABLERO',       active:true },
  { id:'operaciones',  label:'OPERACIONES' },
  { id:'flota',        label:'FLOTA' },
  { id:'inspecciones', label:'INSPECCIONES' },
  { id:'mantenimiento',label:'MANTENIMIENTO' },
  { id:'contratos',    label:'CONTRATOS' },
  { id:'analítica',    label:'ANALÍTICA' },
  { id:'intel',        label:'INTELIGENCIA', flag:true },
];

function NavBar({ t }) {
  return (
    <div style={{
      height:52, background:t.bg1, borderBottom:`1px solid ${t.border}`,
      display:'flex', alignItems:'center', padding:'0 24px', gap:24, position:'sticky', top:0, zIndex:5,
    }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
        <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:t.gold, letterSpacing:'0.1em', lineHeight:1 }}>MovOS</span>
        <span style={{ fontSize:8, color:t.dim, letterSpacing:'0.2em' }}>v3.4</span>
      </div>
      <div style={{ width:1, height:24, background:t.border }}></div>
      <div style={{ display:'flex', gap:0 }}>
        {NAV_ITEMS.map(n => (
          <div key={n.id} style={{
            padding:'14px 14px', fontSize:10, letterSpacing:'0.15em',
            color: n.active?t.text:t.muted,
            borderBottom: n.active?`2px solid ${t.gold}`:'2px solid transparent',
            cursor:'pointer', display:'flex', alignItems:'center', gap:6,
          }}>
            {n.label}
            {n.flag && <span style={{ fontSize:7, color:t.gold, border:`1px solid ${t.gold}66`, padding:'1px 4px', letterSpacing:'0.1em' }}>ADMIN</span>}
          </div>
        ))}
      </div>
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:6, height:6, background:t.green, animation:'movos-pulse 2s infinite' }}></div>
          <span style={{ fontSize:9, color:t.muted, letterSpacing:'0.15em' }}>EN VIVO</span>
        </div>
        <div style={{ position:'relative', fontSize:10, color:t.textDim, letterSpacing:'0.1em' }}>
          ALERTAS
          <span style={{ position:'absolute', top:-6, right:-14, fontSize:8, color:t.red, padding:'1px 5px', border:`1px solid ${t.red}55`, background:t.red+'18', fontFamily:"'DM Mono',monospace" }}>5</span>
        </div>
        <div style={{ fontSize:10, color:t.muted, letterSpacing:'0.1em' }}>R. ÁVILA</div>
        <div style={{ width:28, height:28, border:`1px solid ${t.border2}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:t.gold, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:'0.05em' }}>RA</div>
      </div>
    </div>
  );
}

// ─── PAGE HEADER ────────────────────────────────────────────────────
function PageHeader({ t }) {
  const branches = ['TODAS','MONTEVIDEO','COLONIA','PUNTA DEL ESTE','SALTO'];
  const [active, setActive] = useState('TODAS');
  return (
    <div style={{ padding:'24px 32px 0', borderBottom:`1px solid ${t.border}` }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:18 }}>
        <div>
          <div style={{ fontSize:9, color:t.muted, letterSpacing:'0.2em', marginBottom:6 }}>VISTA OPERATIVA · ADMINISTRACIÓN</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:38, color:t.text, letterSpacing:'0.06em', fontWeight:400, lineHeight:1 }}>TABLERO</h1>
            <span style={{ fontSize:11, color:t.muted, letterSpacing:'0.08em' }}>Lunes · 17 May 2026 · 09:42</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={btnSecondary(t)}>EXPORTAR CSV</button>
          <button style={btnPrimary(t, t.gold)}>+ NUEVO REGISTRO</button>
        </div>
      </div>
      <div style={{ display:'flex', gap:0, alignItems:'center' }}>
        <span style={{ fontSize:9, color:t.dim, letterSpacing:'0.2em', marginRight:14 }}>SUCURSAL</span>
        {branches.map(b => (
          <div key={b} onClick={()=>setActive(b)}
            style={{
              padding:'10px 14px', fontSize:10, letterSpacing:'0.12em',
              color: active===b ? t.gold : t.muted,
              borderBottom: active===b ? `2px solid ${t.gold}` : '2px solid transparent',
              cursor:'pointer', transition:'color 0.15s, border-color 0.15s',
            }}>{b}</div>
        ))}
      </div>
    </div>
  );
}

function btnPrimary(t, color) {
  return {
    fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.12em',
    color, background:color+'24', border:`1px solid ${color}66`,
    padding:'9px 14px', cursor:'pointer', textTransform:'uppercase',
    transition:'background 0.15s',
  };
}
function btnSecondary(t) {
  return {
    fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.12em',
    color:t.muted, background:'transparent', border:`1px solid ${t.border2}`,
    padding:'9px 14px', cursor:'pointer', textTransform:'uppercase',
    transition:'color 0.15s, border-color 0.15s',
  };
}

// ─── ROW 1 · KPI ─────────────────────────────────────────────────────
function KPIRow({ t, openModal }) {
  const kpis = window.MOVOS_KPIS;
  return (
    <div>
      <SectionLabel t={t} color={t.gold} label="INDICADORES DE FLOTA · HOY" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10 }}>
        {kpis.map(k => {
          const c = t[k.color];
          return (
            <Card key={k.id} t={t} color={c} padding={20}
              onClick={()=>openModal({ kind:'kpi', kpi:k })}>
              <div style={{ fontSize:9, color:t.muted, letterSpacing:'0.2em', marginBottom:14 }}>{k.label}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:48, color:c, letterSpacing:'0.04em', lineHeight:1 }}>{k.value}</span>
                {k.unit && <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:c, letterSpacing:'0.05em' }}>{k.unit}</span>}
              </div>
              {k.isPct && (
                <div style={{ marginTop:10, height:2, background:t.bg3, position:'relative' }}>
                  <div style={{ width:`${k.value}%`, height:'100%', background:c }}></div>
                </div>
              )}
              <div style={{ fontSize:10, color:t.muted, letterSpacing:'0.1em', marginTop:10 }}>{k.sub}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── ROW 2 · ALERTS ─────────────────────────────────────────────────
function AlertsRow({ t, openModal }) {
  const crit = window.MOVOS_CRITICAL_ALERTS;
  const svc = window.MOVOS_SERVICE_ALERTS;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
      <AlertCard t={t} color={t.red} title="ALERTAS CRÍTICAS" subtitle="DAÑO · GERENTE · ÚLTIMAS 6H" count={crit.length} openModal={openModal}
        rows={crit.map(a => ({
          ...a, leftColor: t[a.color],
          left: <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:t.text, letterSpacing:'0.06em', lineHeight:1 }}>{a.unit}</div>
            <div style={{ fontSize:10, color:t.muted, marginTop:3 }}>{a.plate} · {a.model}</div>
          </div>,
          mid: <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-start' }}>
            <Badge t={t} color={t[a.color]}>{a.source} · {a.severity}</Badge>
            <span style={{ fontSize:10, color:t.textDim, lineHeight:1.4 }}>{a.note}</span>
          </div>,
          right: <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:9, color:t.muted, letterSpacing:'0.1em' }}>{a.branch}</div>
            <div style={{ fontSize:9, color:t[a.color], letterSpacing:'0.15em', marginTop:4 }}>HACE {a.ago}</div>
          </div>,
          onClick: ()=>openModal({ kind:'alert', alert:a }),
        }))}
      />
      <AlertCard t={t} color={t.warning} title="ALERTAS DE SERVICIO" subtitle="MANUFACTURADOR · REGLAS INTERNAS" count={svc.length} openModal={openModal}
        rows={svc.map(a => ({
          ...a, leftColor: t[a.color],
          left: <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:t.text, letterSpacing:'0.06em', lineHeight:1 }}>{a.unit}</div>
            <div style={{ fontSize:10, color:t.muted, marginTop:3 }}>{a.plate} · {a.model}</div>
          </div>,
          mid: <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-start' }}>
            <Badge t={t} color={t[a.color]}>{a.type}</Badge>
            <span style={{ fontSize:10, color:t.textDim }}>{a.km.toLocaleString('es-MX')} km · {a.due}</span>
          </div>,
          right: <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:9, color:t.muted, letterSpacing:'0.1em' }}>{a.branch}</div>
            <div style={{ fontSize:9, color:t[a.color], letterSpacing:'0.15em', marginTop:4 }}>{a.due.includes('VENCIDO')?'ATRASADO':'PROGRAMAR'}</div>
          </div>,
          onClick: ()=>openModal({ kind:'service', alert:a }),
        }))}
      />
    </div>
  );
}

function AlertCard({ t, color, title, subtitle, count, rows, openModal }) {
  return (
    <div style={{ background:t.bg1, border:`1px solid ${t.border}`, borderTop:`2px solid ${color}` }}>
      <div style={{ padding:'14px 18px', borderBottom:`1px solid ${t.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color, letterSpacing:'0.08em', lineHeight:1 }}>{title}</div>
          <div style={{ fontSize:9, color:t.dim, letterSpacing:'0.15em', marginTop:5 }}>{subtitle}</div>
        </div>
        <Badge t={t} color={color}>{count} ACTIVAS</Badge>
      </div>
      <div>
        {rows.map((r, i) => <AlertRow key={i} t={t} {...r} />)}
        <div onClick={()=>openModal({ kind:'all-alerts', title })}
          style={{ padding:'12px 18px', textAlign:'center', fontSize:9, color, letterSpacing:'0.2em', cursor:'pointer', borderTop:`1px solid ${t.border}` }}
          onMouseEnter={e=>e.currentTarget.style.background=t.bg2}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          VER TODAS LAS ALERTAS →
        </div>
      </div>
    </div>
  );
}

function AlertRow({ t, leftColor, left, mid, right, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'grid', gridTemplateColumns:'150px 1fr 140px', gap:14,
        padding:'12px 18px', alignItems:'center',
        borderBottom:`1px solid ${t.border}`,
        borderLeft: t._hideLeftBorders ? `2px solid transparent` : `2px solid ${leftColor}`,
        background: h?t.bg2:'transparent', cursor:'pointer', transition:'background 0.15s',
      }}>
      {left}{mid}{right}
    </div>
  );
}

// ─── ROW 3 · SUCURSALES + REFACCIONES ───────────────────────────────
function BranchesPartsRow({ t, openModal }) {
  const branches = window.MOVOS_BRANCHES;
  const parts = window.MOVOS_PARTS;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>
      <div>
        <SectionLabel t={t} color={t.blue} label="SUCURSALES · UTILIZACIÓN ACTUAL" count={branches.length} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
          {branches.map(b => {
            const c = t[b.color];
            return (
              <Card key={b.id} t={t} color={c} padding={16} onClick={()=>openModal({ kind:'branch', branch:b })}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:t.text, letterSpacing:'0.06em', lineHeight:1 }}>{b.name}</div>
                  <span style={{ fontSize:8, color:t.dim, letterSpacing:'0.15em', fontFamily:"'DM Mono',monospace" }}>{b.code}</span>
                </div>
                <div style={{ marginTop:14, display:'flex', alignItems:'baseline', gap:6 }}>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:34, color:c, letterSpacing:'0.04em', lineHeight:1 }}>{b.util}</span>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:c, letterSpacing:'0.05em' }}>%</span>
                  <span style={{ fontSize:8, color:t.muted, marginLeft:'auto', letterSpacing:'0.15em' }}>UTILIZACIÓN</span>
                </div>
                <div style={{ marginTop:8, height:2, background:t.bg3 }}>
                  <div style={{ width:`${b.util}%`, height:'100%', background:c }}></div>
                </div>
                <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
                  {[
                    { l:'TOT',  v:b.total,     c:t.muted },
                    { l:'DISP', v:b.available, c:t.green },
                    { l:'ASG',  v:b.assigned,  c:t.blue  },
                    { l:'OOS',  v:b.oos,       c:t.red   },
                  ].map(s => (
                    <div key={s.l}>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:s.c, letterSpacing:'0.04em', lineHeight:1 }}>{s.v}</div>
                      <div style={{ fontSize:8, color:t.dim, letterSpacing:'0.15em', marginTop:3 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      <div>
        <SectionLabel t={t} color={t.orange} label="REFACCIONES · PEDIDOS ACTIVOS" count={parts.length} />
        <div style={{ background:t.bg1, border:`1px solid ${t.border}`, borderTop:`2px solid ${t.orange}` }}>
          <div style={{ display:'grid', gridTemplateColumns:'70px 1fr 70px', gap:10, padding:'9px 14px', background:t.bg2, borderBottom:`1px solid ${t.border}` }}>
            {['REF','REFACCIÓN','ETA'].map(h => (
              <div key={h} style={{ fontSize:8, color:t.dim, letterSpacing:'0.18em' }}>{h}</div>
            ))}
          </div>
          {parts.map((p, i) => <PartRow key={i} t={t} p={p} onClick={()=>openModal({ kind:'part', part:p })} />)}
          <div onClick={()=>openModal({ kind:'all-parts' })}
            style={{ padding:'10px 14px', textAlign:'center', fontSize:9, color:t.orange, letterSpacing:'0.2em', cursor:'pointer' }}
            onMouseEnter={e=>e.currentTarget.style.background=t.bg2}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            VER ALMACÉN COMPLETO →
          </div>
        </div>
      </div>
    </div>
  );
}

function PartRow({ t, p, onClick }) {
  const [h, setH] = useState(false);
  const c = t[p.color];
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'grid', gridTemplateColumns:'70px 1fr 70px', gap:10,
        padding:'10px 14px', alignItems:'center',
        borderBottom:`1px solid ${t.border}`,
        borderLeft: t._hideLeftBorders ? `2px solid transparent` : `2px solid ${c}`,
        background: h?t.bg2:'transparent', cursor:'pointer', transition:'background 0.15s',
      }}>
      <div style={{ fontSize:9, color:t.muted, letterSpacing:'0.08em' }}>{p.ref}</div>
      <div>
        <div style={{ fontSize:11, color:t.text }}>{p.part}</div>
        <div style={{ fontSize:9, color:t.muted, letterSpacing:'0.08em', marginTop:3 }}>{p.vehicle} · {p.status}</div>
      </div>
      <div style={{ textAlign:'right', fontSize:9, color:c, letterSpacing:'0.1em' }}>{p.eta}</div>
    </div>
  );
}

// ─── ROW 4 · CONTRATOS ──────────────────────────────────────────────
function ContractsRow({ t, openModal }) {
  const contracts = window.MOVOS_CONTRACTS;
  return (
    <div>
      <SectionLabel t={t} color={t.orange} label="CONTRATOS A LARGO PLAZO" count={contracts.length} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
        {contracts.map(c => {
          const cc = t[c.color];
          return (
            <Card key={c.id} t={t} color={cc} padding={18} onClick={()=>openModal({ kind:'contract', contract:c })}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:9, color:t.dim, letterSpacing:'0.18em', marginBottom:5 }}>{c.id}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:t.text, letterSpacing:'0.06em', lineHeight:1 }}>{c.client}</div>
                </div>
                <Badge t={t} color={cc}>{c.status}</Badge>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, alignItems:'end' }}>
                <div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:38, color:cc, letterSpacing:'0.04em', lineHeight:1 }}>{c.fleet}</div>
                  <div style={{ fontSize:9, color:t.dim, letterSpacing:'0.18em', marginTop:5 }}>VEHÍCULOS</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:t.textDim }}>{c.type}</div>
                  <div style={{ fontSize:9, color:t.dim, letterSpacing:'0.18em', marginTop:5 }}>MODALIDAD</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:t.textDim }}>{c.expires}</div>
                  <div style={{ fontSize:9, color:cc, letterSpacing:'0.18em', marginTop:5 }}>VENCE EN {c.renewIn}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── MODAL ──────────────────────────────────────────────────────────
function Modal({ t, modal, close }) {
  if (!modal) return null;

  let title, subtitle, color, body;

  if (modal.kind === 'kpi') {
    const k = modal.kpi;
    color = t[k.color];
    title = k.label;
    subtitle = `${k.value}${k.unit||''} · ${k.sub}`;
    body = <FilteredFleet t={t} filter={k.id} />;
  } else if (modal.kind === 'alert') {
    const a = modal.alert;
    color = t[a.color];
    title = `INCIDENTE · ${a.unit}`;
    subtitle = `${a.plate} · ${a.model} · ${a.branch}`;
    body = <AlertDetail t={t} alert={a} />;
  } else if (modal.kind === 'service') {
    const a = modal.alert;
    color = t[a.color];
    title = `SERVICIO · ${a.unit}`;
    subtitle = `${a.plate} · ${a.model} · ${a.branch}`;
    body = <ServiceDetail t={t} alert={a} />;
  } else if (modal.kind === 'branch') {
    const b = modal.branch;
    color = t[b.color];
    title = `SUCURSAL ${b.name}`;
    subtitle = `${b.code} · ${b.total} vehículos · ${b.util}% utilización`;
    body = <FilteredFleet t={t} filter={`branch:${b.name}`} />;
  } else if (modal.kind === 'contract') {
    const c = modal.contract;
    color = t[c.color];
    title = `CONTRATO · ${c.client}`;
    subtitle = `${c.id} · ${c.type} · vence ${c.expires}`;
    body = <ContractDetail t={t} contract={c} />;
  } else if (modal.kind === 'part') {
    const p = modal.part;
    color = t[p.color];
    title = `PEDIDO ${p.ref}`;
    subtitle = `${p.part} · ${p.vehicle}`;
    body = <PartDetail t={t} part={p} />;
  } else if (modal.kind === 'all-alerts') {
    color = t.red; title = modal.title || 'ALERTAS'; subtitle = 'BANDEJA COMPLETA · ÚLTIMAS 24 H';
    body = <FilteredFleet t={t} filter="alerts" />;
  } else if (modal.kind === 'all-parts') {
    color = t.orange; title='ALMACÉN DE REFACCIONES'; subtitle='PEDIDOS ACTIVOS · MOVIMIENTOS DEL DÍA';
    body = <AllParts t={t} />;
  }

  return (
    <div onClick={close}
      style={{
        position:'absolute', inset:0, background:'rgba(0,0,0,0.88)',
        display:'flex', alignItems:'flex-start', justifyContent:'center',
        padding:'60px 40px', zIndex:50, overflow:'auto',
      }}>
      <div onClick={e=>e.stopPropagation()}
        style={{
          width:'92%', maxWidth:1100, background:t.bg1,
          border:`1px solid ${t.border2}`, borderTop:`2px solid ${color}`,
        }}>
        <div style={{ padding:'18px 24px', borderBottom:`1px solid ${t.border}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, color, letterSpacing:'0.06em', lineHeight:1 }}>{title}</div>
            <div style={{ fontSize:11, color:t.muted, marginTop:6, letterSpacing:'0.08em' }}>{subtitle}</div>
          </div>
          <button onClick={close} style={{
            width:28, height:28, background:'transparent', border:`1px solid ${t.border2}`,
            color:t.muted, fontSize:14, cursor:'pointer', fontFamily:'monospace',
          }}>✕</button>
        </div>
        <div style={{ padding:24 }}>{body}</div>
      </div>
    </div>
  );
}

// ─── Modal bodies ───────────────────────────────────────────────────

function applyFilter(fleet, filter) {
  if (filter === 'total') return fleet;
  if (filter === 'available') return fleet.filter(v => v.status === 'DISPONIBLE');
  if (filter === 'assigned')  return fleet.filter(v => v.status === 'ASIGNADO');
  if (filter === 'util')      return fleet.filter(v => v.status === 'ASIGNADO');
  if (filter === 'oos')       return fleet.filter(v => v.status === 'FUERA DE SERVICIO' || v.status === 'EN MANTENIMIENTO');
  if (filter === 'alerts')    return fleet.filter(v => v.alert);
  if (filter.startsWith('branch:')) {
    const name = filter.slice(7);
    return fleet.filter(v => v.branch.toUpperCase().includes(name.split(' ')[0]));
  }
  return fleet;
}

function FilteredFleet({ t, filter }) {
  const fleet = window.MOVOS_FLEET;
  const rows = applyFilter(fleet, filter);
  const [sort, setSort] = useState({ col:'unit', dir:'asc' });
  const sorted = useMemo(()=>{
    const r = [...rows];
    r.sort((a,b) => {
      const av = a[sort.col], bv = b[sort.col];
      if (av==null) return 1; if (bv==null) return -1;
      return (av>bv?1:av<bv?-1:0) * (sort.dir==='asc'?1:-1);
    });
    return r;
  }, [rows, sort]);
  function setCol(col) {
    setSort(s => s.col===col ? { col, dir:s.dir==='asc'?'desc':'asc' } : { col, dir:'asc' });
  }
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ display:'flex', gap:6 }}>
          {['TODAS','MONTEVIDEO','COLONIA','PUNTA DEL ESTE','SALTO'].map((b,i)=>(
            <span key={b} style={{
              fontSize:9, padding:'4px 9px', letterSpacing:'0.12em',
              color: i===0?t.gold:t.muted,
              border: `1px solid ${i===0?t.gold+'66':t.border2}`,
              background: i===0?t.gold+'18':'transparent', cursor:'pointer',
            }}>{b}</span>
          ))}
        </div>
        <span style={{ fontSize:10, color:t.muted, letterSpacing:'0.12em' }}>{sorted.length} VEHÍCULOS</span>
      </div>
      <div style={{ border:`1px solid ${t.border}` }}>
        <div style={{ display:'grid', gridTemplateColumns:'110px 110px 1fr 100px 130px 90px 100px', gap:14, padding:'10px 16px', background:t.bg2, borderBottom:`1px solid ${t.border}` }}>
          {[
            { l:'UNIDAD',     k:'unit'   },
            { l:'PLACAS',     k:'plate'  },
            { l:'MODELO',     k:'model'  },
            { l:'CATEGORÍA',  k:'category' },
            { l:'SUCURSAL',   k:'branch' },
            { l:'KM',         k:'km'     },
            { l:'ESTADO',     k:'status' },
          ].map(h => (
            <div key={h.k} onClick={()=>setCol(h.k)} style={{
              fontSize:8, color: sort.col===h.k?t.gold:t.dim,
              letterSpacing:'0.18em', cursor:'pointer',
            }}>{h.l} {sort.col===h.k && (sort.dir==='asc'?'▲':'▼')}</div>
          ))}
        </div>
        {sorted.map(v => <VehicleRow key={v.unit} t={t} v={v} />)}
        {sorted.length===0 && (
          <div style={{ padding:'40px', textAlign:'center', color:t.dim, fontSize:12 }}>
            No hay vehículos que coincidan con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}

function VehicleRow({ t, v }) {
  const [h, setH] = useState(false);
  const c = t[v.statusColor];
  const ac = v.alert ? t.red : null;
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:'grid', gridTemplateColumns:'110px 110px 1fr 100px 130px 90px 100px', gap:14,
        padding:'11px 16px', alignItems:'center', borderBottom:`1px solid ${t.border}`,
        borderLeft: (ac && !t._hideLeftBorders) ? `2px solid ${ac}` : '2px solid transparent',
        background: h?t.bg2:'transparent', cursor:'pointer', transition:'background 0.15s',
      }}>
      <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:t.gold, letterSpacing:'0.06em' }}>{v.unit}</span>
      <span style={{ fontSize:10, color:t.textDim, letterSpacing:'0.08em' }}>{v.plate}</span>
      <span style={{ fontSize:11, color:t.text }}>{v.model}</span>
      <span style={{ fontSize:10, color:t.muted }}>{v.category}</span>
      <span style={{ fontSize:10, color:t.muted, letterSpacing:'0.05em' }}>{v.branch}</span>
      <span style={{ fontSize:10, color:t.textDim, fontFamily:"'DM Mono',monospace" }}>{v.km.toLocaleString('es-MX')}</span>
      <Badge t={t} color={c} size={9}>{v.status}</Badge>
    </div>
  );
}

function AlertDetail({ t, alert }) {
  const c = t[alert.color];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:18 }}>
      <div>
        <SectionLabel t={t} color={c} label="DETALLE DEL INCIDENTE" />
        <div style={{ background:t.bg, border:`1px solid ${t.border}`, padding:18 }}>
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            <Badge t={t} color={c}>{alert.source}</Badge>
            <Badge t={t} color={c}>SEVERIDAD · {alert.severity}</Badge>
          </div>
          <div style={{ fontSize:12, color:t.text, lineHeight:1.7, marginBottom:18 }}>{alert.note}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, fontSize:10 }}>
            <DetailRow t={t} l="REPORTÓ" v="L. Mendoza · Inspector" />
            <DetailRow t={t} l="HACE" v={alert.ago} />
            <DetailRow t={t} l="SUCURSAL" v={alert.branch} />
            <DetailRow t={t} l="ASIGNADO A" v="Taller MovOS · Montevideo" />
          </div>
        </div>
        <div style={{ marginTop:18 }}>
          <SectionLabel t={t} color={t.purple} label="ACCIONES AUTOMÁTICAS APLICADAS" />
          {[
            { t:'Vehículo movido a FUERA DE SERVICIO', when:'Hace '+alert.ago, color:t.red },
            { t:'Ticket de reparación #T-3382 creado',  when:'Hace '+alert.ago, color:t.purple },
            { t:'Notificación enviada a gerente regional', when:'Hace '+alert.ago, color:t.blue },
          ].map((s,i)=>(
            <div key={i} style={{ display:'flex', gap:12, padding:'10px 14px', borderBottom:`1px solid ${t.border}`, borderLeft:`2px solid ${s.color}`, background:t.bg }}>
              <span style={{ fontSize:10, color:t.green }}>✓</span>
              <span style={{ fontSize:11, color:t.textDim, flex:1 }}>{s.t}</span>
              <span style={{ fontSize:9, color:t.dim, letterSpacing:'0.12em' }}>{s.when}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <SectionLabel t={t} color={t.gold} label="ACCIONES" />
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <button style={btnPrimary(t, c)}>ABRIR EXPEDIENTE COMPLETO →</button>
          <button style={btnPrimary(t, t.purple)}>VER TICKET DE REPARACIÓN →</button>
          <button style={btnPrimary(t, t.blue)}>CONTACTAR INSPECTOR</button>
          <button style={btnSecondary(t)}>MARCAR COMO RESUELTO</button>
        </div>
        <div style={{ marginTop:20 }}>
          <SectionLabel t={t} color={t.slate} label="HISTORIAL DEL VEHÍCULO" />
          {[
            { d:'17 MAY', e:'Daño reportado · '+alert.severity, c:t.red },
            { d:'12 MAY', e:'Limpieza completada',              c:t.yellow },
            { d:'09 MAY', e:'Retorno de renta · L. Ortiz',      c:t.blue },
            { d:'04 MAY', e:'Servicio 30 000 km',               c:t.gold },
          ].map((h,i)=>(
            <div key={i} style={{ display:'flex', gap:12, padding:'9px 0', borderBottom:`1px solid ${t.border}` }}>
              <span style={{ fontSize:9, color:h.c, width:50, letterSpacing:'0.1em' }}>{h.d}</span>
              <span style={{ fontSize:11, color:t.textDim, flex:1 }}>{h.e}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceDetail({ t, alert }) {
  const c = t[alert.color];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
      <div>
        <SectionLabel t={t} color={c} label="INTERVALOS DE SERVICIO" />
        <div style={{ background:t.bg, border:`1px solid ${t.border}`, padding:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42, color:c, letterSpacing:'0.04em', lineHeight:1 }}>{alert.km.toLocaleString('es-MX')}</div>
            <div style={{ fontSize:10, color:t.muted, letterSpacing:'0.15em' }}>KM ACTUAL</div>
          </div>
          <div style={{ height:2, background:t.bg3, marginBottom:6 }}>
            <div style={{ width:'82%', height:'100%', background:c }}></div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:t.dim, letterSpacing:'0.12em' }}>
            <span>ÚLT. 40 000 km</span><span>PRÓX. 50 000 km</span>
          </div>
          <div style={{ marginTop:18, fontSize:11, color:t.textDim, lineHeight:1.7 }}>
            <strong style={{ color:c }}>{alert.type}</strong> requerido por programa del manufacturador. Incluye: cambio de aceite, filtros (aire, aceite, cabina), revisión de frenos y rotación de llantas.
          </div>
        </div>
      </div>
      <div>
        <SectionLabel t={t} color={t.gold} label="PROGRAMAR" />
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <button style={btnPrimary(t, t.gold)}>RESERVAR EN TALLER MOVOS →</button>
          <button style={btnPrimary(t, t.blue)}>ENVIAR A DEALER OFICIAL →</button>
          <button style={btnSecondary(t)}>POSPONER (REQUIERE JUSTIFICACIÓN)</button>
        </div>
        <div style={{ marginTop:18, padding:14, background:t.bg, border:`1px solid ${t.border}`, borderLeft:`2px solid ${t.warning}` }}>
          <div style={{ fontSize:9, color:t.warning, letterSpacing:'0.18em', marginBottom:6 }}>RECOMENDACIÓN</div>
          <div style={{ fontSize:11, color:t.textDim, lineHeight:1.7 }}>Programar en las próximas 48 h. El vehículo está actualmente disponible y no compromete utilización.</div>
        </div>
      </div>
    </div>
  );
}

function ContractDetail({ t, contract }) {
  const fleet = window.MOVOS_FLEET.filter(v => v.contract.toUpperCase().includes(contract.client.split(' ')[1] || contract.client.split(' ')[0]));
  const sample = fleet.length ? fleet : window.MOVOS_FLEET.slice(0,3);
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:18 }}>
        {[
          { l:'VEHÍCULOS', v:contract.fleet, c:t[contract.color] },
          { l:'EN USO',    v:Math.round(contract.fleet*0.88), c:t.blue },
          { l:'INACTIVOS', v:Math.round(contract.fleet*0.12), c:t.yellow },
          { l:'RENOVAR',   v:contract.renewIn, c:t.orange, isText:true },
        ].map(s => (
          <div key={s.l} style={{ background:t.bg, border:`1px solid ${t.border}`, borderTop:`2px solid ${s.c}`, padding:14 }}>
            <div style={{ fontSize:9, color:t.muted, letterSpacing:'0.18em', marginBottom:10 }}>{s.l}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:s.isText?18:32, color:s.c, letterSpacing:'0.04em', lineHeight:1 }}>{s.v}</div>
          </div>
        ))}
      </div>
      <SectionLabel t={t} color={t[contract.color]} label="VEHÍCULOS ASIGNADOS" count={sample.length} />
      <div style={{ border:`1px solid ${t.border}` }}>
        <div style={{ display:'grid', gridTemplateColumns:'110px 110px 1fr 130px 100px', gap:14, padding:'10px 16px', background:t.bg2 }}>
          {['UNIDAD','PLACAS','MODELO','SUCURSAL','ESTADO'].map(h=>(
            <div key={h} style={{ fontSize:8, color:t.dim, letterSpacing:'0.18em' }}>{h}</div>
          ))}
        </div>
        {sample.map(v => {
          const c = t[v.statusColor];
          return (
            <div key={v.unit} style={{ display:'grid', gridTemplateColumns:'110px 110px 1fr 130px 100px', gap:14, padding:'11px 16px', alignItems:'center', borderBottom:`1px solid ${t.border}` }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:t.gold, letterSpacing:'0.06em' }}>{v.unit}</span>
              <span style={{ fontSize:10, color:t.textDim }}>{v.plate}</span>
              <span style={{ fontSize:11, color:t.text }}>{v.model}</span>
              <span style={{ fontSize:10, color:t.muted }}>{v.branch}</span>
              <Badge t={t} color={c}>{v.status}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PartDetail({ t, part }) {
  const c = t[part.color];
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:18 }}>
        {[
          { l:'PRIORIDAD', v:part.priority, c },
          { l:'ESTADO',    v:part.status,   c:t.blue },
          { l:'ETA',       v:part.eta,      c:t.gold },
        ].map(s => (
          <div key={s.l} style={{ background:t.bg, border:`1px solid ${t.border}`, borderTop:`2px solid ${s.c}`, padding:14 }}>
            <div style={{ fontSize:9, color:t.muted, letterSpacing:'0.18em', marginBottom:10 }}>{s.l}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:s.c, letterSpacing:'0.04em', lineHeight:1 }}>{s.v}</div>
          </div>
        ))}
      </div>
      <SectionLabel t={t} color={c} label="LÍNEA DE TIEMPO" />
      {[
        { d:'09:24', t:'Solicitud creada',           c:t.gold },
        { d:'09:31', t:'Aprobada por R. Ávila',      c:t.green },
        { d:'10:02', t:'Pedido a proveedor · Sasa Repuestos MVD', c:t.blue },
        { d:'12:18', t:'En camino · seguimiento DHL #4029', c:t.purple, active:true },
        { d:'17:00', t:'Entrega estimada · Taller MovOS Centro', c:t.dim },
      ].map((e,i)=>(
        <div key={i} style={{ display:'flex', gap:14, padding:'10px 0', borderBottom:`1px solid ${t.border}` }}>
          <span style={{ fontSize:10, color:t.muted, fontFamily:"'DM Mono',monospace", width:50 }}>{e.d}</span>
          <span style={{ width:8, height:8, background:e.c, marginTop:5, flexShrink:0 }}></span>
          <span style={{ fontSize:11, color: e.active?t.text:t.textDim, flex:1 }}>{e.t}</span>
        </div>
      ))}
    </div>
  );
}

function AllParts({ t }) {
  const parts = window.MOVOS_PARTS;
  return (
    <div style={{ border:`1px solid ${t.border}` }}>
      <div style={{ display:'grid', gridTemplateColumns:'90px 1fr 110px 110px 120px 100px', gap:14, padding:'10px 16px', background:t.bg2 }}>
        {['REF','REFACCIÓN','UNIDAD','PRIORIDAD','ESTADO','ETA'].map(h=>(
          <div key={h} style={{ fontSize:8, color:t.dim, letterSpacing:'0.18em' }}>{h}</div>
        ))}
      </div>
      {parts.map(p => {
        const c = t[p.color];
        return (
          <div key={p.ref} style={{ display:'grid', gridTemplateColumns:'90px 1fr 110px 110px 120px 100px', gap:14, padding:'11px 16px', alignItems:'center', borderBottom:`1px solid ${t.border}`, borderLeft:`2px solid ${c}` }}>
            <span style={{ fontSize:10, color:t.muted }}>{p.ref}</span>
            <span style={{ fontSize:11, color:t.text }}>{p.part}</span>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:t.gold, letterSpacing:'0.06em' }}>{p.vehicle}</span>
            <Badge t={t} color={c}>{p.priority}</Badge>
            <span style={{ fontSize:10, color:t.textDim }}>{p.status}</span>
            <span style={{ fontSize:10, color:c, letterSpacing:'0.1em' }}>{p.eta}</span>
          </div>
        );
      })}
    </div>
  );
}

function DetailRow({ t, l, v }) {
  return (
    <div>
      <div style={{ fontSize:8, color:t.dim, letterSpacing:'0.2em', marginBottom:5 }}>{l}</div>
      <div style={{ fontSize:11, color:t.textDim }}>{v}</div>
    </div>
  );
}

// ─── MAIN DASHBOARD ─────────────────────────────────────────────────
function Dashboard({ theme='dark', density='comfortable', showLeftBorders=true, accentKey='gold', initialModal=null }) {
  let t = window.MOVOS_THEMES[theme];
  // Accent override: swap the gold-anchored brand color but keep all other
  // semantic colors intact (red/green/blue stay legible status signals).
  if (accentKey && accentKey !== 'gold') {
    t = { ...t, gold: t[accentKey] || t.gold };
  }
  // showLeftBorders=false collapses alert left-borders into a plain border —
  // exposes the spec rule by letting the viewer feel its loss.
  if (!showLeftBorders) {
    t = { ...t, _hideLeftBorders: true };
  }
  const [modal, setModal] = useState(initialModal);
  const close = () => setModal(null);

  // press Esc inside artboard (focus mode also forwards Esc)
  useEffect(() => {
    if (!modal) return;
    function onKey(e){ if (e.key === 'Escape') close(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal]);

  const sectionGap = density === 'compact' ? 20 : 28;

  return (
    <div style={{
      position:'relative', width:'100%', height:'100%',
      background:t.bg, color:t.text, overflow:'hidden',
      fontFamily:"'DM Mono','Courier New',monospace",
    }}>
      <NavBar t={t} />
      <PageHeader t={t} />
      <div style={{ padding:`24px 32px 40px`, display:'flex', flexDirection:'column', gap:sectionGap }}>
        <KPIRow t={t} openModal={setModal} />
        <AlertsRow t={t} openModal={setModal} />
        <BranchesPartsRow t={t} openModal={setModal} />
        <ContractsRow t={t} openModal={setModal} />
        <Footer t={t} />
      </div>
      <Modal t={t} modal={modal} close={close} />
    </div>
  );
}

function Footer({ t }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:`1px solid ${t.border}`, paddingTop:18, marginTop:8 }}>
      <div style={{ display:'flex', gap:18, fontSize:9, color:t.dim, letterSpacing:'0.15em' }}>
        <span>MovOS · v3.4.1</span>
        <span>SINC. KARVE · OK</span>
        <span>ÚLT. ACTUALIZACIÓN · 09:42:18</span>
      </div>
      <div style={{ fontSize:9, color:t.dim, letterSpacing:'0.15em' }}>RENTAUY · MONTEVIDEO</div>
    </div>
  );
}

window.MovOSDashboard = Dashboard;
