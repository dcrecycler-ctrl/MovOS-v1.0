// MovOS · Variant C — Soft bento SaaS redesign.
// Same data, same screens, same Spanish copy. New aesthetic:
//   - Warm light theme (#F7F5F0 base)
//   - Bento grid with mixed card sizes
//   - Inter sans, generous whitespace
//   - Pill badges, rounded cards, very soft shadows
//   - No tables — everything is a card

const { useState: useStateB, useMemo: useMemoB, useEffect: useEffectB } = React;

const B = {
  // Even lighter cool-white base — almost white, just enough blue to differ
  // from card surfaces and zero warmth.
  bg:        '#F2F6FA',
  surface:   '#FFFFFF',
  surface2:  '#F0F4FA',
  surface3:  '#EAF0F6',
  ink:       '#0E1726',
  ink2:      '#475569',
  ink3:      '#94A3B8',
  ink4:      '#CBD5E1',
  hairline:  'rgba(14,23,38,0.05)',
  // Muted, low-chroma accents — never alarming.
  blue:      '#6F8AC9',
  blueSoft:  '#E7ECF6',
  green:     '#7AAA88',
  greenSoft: '#E5EFE7',
  amber:     '#D0A364',
  amberSoft: '#F4EBD7',
  rose:      '#C68585',
  roseSoft:  '#F2E2E0',
  lilac:     '#9C8EC0',
  lilacSoft: '#ECE8F2',
  sky:       '#85A7BD',
  skySoft:   '#E3ECF1',
  ochre:     '#8FA0B8',   // repurposed: cool slate (no warm ochre anywhere)
  ochreSoft: '#E9EDF2',
  shadowSm:  '0 1px 2px rgba(14,23,38,0.04)',
  shadowMd:  '0 1px 2px rgba(14,23,38,0.04), 0 8px 24px rgba(14,23,38,0.05)',
  shadowLg:  '0 1px 2px rgba(14,23,38,0.04), 0 24px 56px rgba(14,23,38,0.07)',
  radius:    18,
  radiusSm:  12,
  radiusLg:  24,
};

// ─── Atoms ──────────────────────────────────────────────────────────
function SoftCard({ children, padding=24, span, rowSpan, tint, big=false, onClick, style={} }) {
  const [h, setH] = useStateB(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        gridColumn: span ? `span ${span}` : undefined,
        gridRow:    rowSpan ? `span ${rowSpan}` : undefined,
        background: tint || B.surface,
        borderRadius: big ? B.radiusLg : B.radius,
        padding,
        boxShadow: h && onClick ? B.shadowMd : B.shadowSm,
        transform: h && onClick ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        ...style,
      }}>
      {children}
    </div>
  );
}

function SoftBadge({ tone='neutral', children, size=11 }) {
  const map = {
    blue:    [B.blue,  B.blueSoft],
    green:   [B.green, B.greenSoft],
    amber:   [B.amber, B.amberSoft],
    rose:    [B.rose,  B.roseSoft],
    lilac:   [B.lilac, B.lilacSoft],
    sky:     [B.sky,   B.skySoft],
    ochre:   [B.ochre, B.ochreSoft],
    neutral: [B.ink2,  '#F0EDE5'],
  };
  const [fg, bg] = map[tone] || map.neutral;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      fontSize:size, fontWeight:500, color:fg, background:bg,
      padding:'4px 10px', borderRadius:9999, lineHeight:1.3, letterSpacing:'-0.005em',
    }}>{children}</span>
  );
}

function Dot({ tone='blue', size=6 }) {
  const map = { blue:B.blue, green:B.green, amber:B.amber, rose:B.rose, lilac:B.lilac, sky:B.sky, ochre:B.ochre };
  return <span style={{ width:size, height:size, borderRadius:9999, background:map[tone]||B.blue, display:'inline-block', flexShrink:0 }}></span>;
}

function PillButton({ tone='primary', size='md', children, onClick }) {
  const isPrimary = tone === 'primary';
  const isDanger = tone === 'danger';
  const [h, setH] = useStateB(false);
  const padding = size === 'sm' ? '7px 14px' : '10px 18px';
  const fs = size === 'sm' ? 12 : 13;
  let bg, fg, border;
  if (isPrimary) { bg = h ? '#0E1726' : '#1A2538'; fg = '#FFFFFF'; border = 'transparent'; }
  else if (isDanger) { bg = h ? B.roseSoft : B.surface; fg = B.rose; border = h ? B.rose+'55' : B.hairline; }
  else { bg = h ? B.surface : 'transparent'; fg = B.ink2; border = B.hairline; }
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      fontFamily:'Inter, sans-serif', fontSize:fs, fontWeight:500, letterSpacing:'-0.005em',
      color:fg, background:bg, border:`1px solid ${border}`, padding, borderRadius:9999,
      cursor:'pointer', transition:'background 0.15s, color 0.15s, border-color 0.15s',
    }}>{children}</button>
  );
}

function Sparkline({ values, color, height=44 }) {
  const w = 120, h = height;
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v,i) => {
    const x = (i / (values.length-1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3;
    return [x, y];
  });
  const d = pts.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const fillD = d + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display:'block' }}>
      <path d={fillD} fill={color} opacity="0.12"></path>
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={color}></circle>
    </svg>
  );
}

function Ring({ value, size=64, stroke=6, color=B.blue, label }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const off = C * (1 - value/100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} stroke={B.hairline} strokeWidth={stroke} fill="none"></circle>
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off}
        transform={`rotate(-90 ${size/2} ${size/2})`}></circle>
      {label && <text x={size/2} y={size/2+5} textAnchor="middle"
        fontFamily="Inter" fontSize={size>=64?16:13} fontWeight="600" fill={B.ink}>{label}</text>}
    </svg>
  );
}

// ─── Top bar ────────────────────────────────────────────────────────
function TopBar({ active='Tablero' }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'20px 36px', borderBottom:`1px solid ${B.hairline}`,
      background:B.bg, position:'sticky', top:0, zIndex:5,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:36 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:9, background:B.ink, color:B.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter', fontSize:13, fontWeight:700, letterSpacing:'-0.02em' }}>M</div>
          <span style={{ fontFamily:'Inter', fontSize:16, fontWeight:600, color:B.ink, letterSpacing:'-0.01em' }}>MovOS</span>
        </div>
        <nav style={{ display:'flex', gap:6 }}>
          {[
            'Tablero','Operaciones','Flota','Inspecciones','Mantenimiento','Contratos','Analítica','Inteligencia',
          ].map(label => {
            const a = label === active;
            return (
              <a key={label} style={{
                fontFamily:'Inter', fontSize:13, fontWeight: a?500:400,
                color: a ? B.ink : B.ink3,
                padding:'8px 14px', borderRadius:9999,
                background: a ? B.surface : 'transparent',
                boxShadow: a ? B.shadowSm : 'none',
                textDecoration:'none', cursor:'pointer',
                display:'flex', alignItems:'center', gap:6,
              }}>
                {label}
                {label === 'Inteligencia' && <span style={{ fontSize:9, padding:'1px 6px', borderRadius:9999, background:B.amberSoft, color:B.amber, fontWeight:500, letterSpacing:'0.02em' }}>admin</span>}
              </a>
            );
          })}
        </nav>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ position:'relative', width:240 }}>
          <input placeholder="Buscar vehículo, placa, contrato…" style={{
            fontFamily:'Inter', fontSize:13, padding:'9px 14px 9px 36px', width:'100%',
            background:B.surface, border:`1px solid ${B.hairline}`, borderRadius:9999,
            color:B.ink, outline:'none',
          }} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={B.ink3} strokeWidth="2" style={{ position:'absolute', left:14, top:11 }}>
            <circle cx="11" cy="11" r="7"></circle><path d="m20 20-3-3"></path>
          </svg>
        </div>
        <button style={{
          width:38, height:38, borderRadius:9999, background:B.surface,
          border:`1px solid ${B.hairline}`, color:B.ink2, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          <span style={{ position:'absolute', top:6, right:6, width:8, height:8, background:B.rose, borderRadius:9999, border:`2px solid ${B.surface}` }}></span>
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 12px 6px 6px', background:B.surface, borderRadius:9999, border:`1px solid ${B.hairline}` }}>
          <div style={{ width:28, height:28, borderRadius:9999, background:B.blueSoft, color:B.blue, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter', fontWeight:600, fontSize:12 }}>RA</div>
          <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>Rocío Ávila</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page header ────────────────────────────────────────────────────
function PageHeader() {
  return (
    <div style={{ padding:'36px 36px 24px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24 }}>
      <div>
        <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, fontWeight:500, marginBottom:8 }}>Lunes · 17 de mayo, 2026</div>
        <h1 style={{ fontFamily:'Inter', fontSize:34, fontWeight:600, color:B.ink, letterSpacing:'-0.02em', margin:0, lineHeight:1.1 }}>
          Buenos días, Rocío.
        </h1>
        <p style={{ fontFamily:'Inter', fontSize:15, color:B.ink2, marginTop:8, lineHeight:1.5, maxWidth:560 }}>
          Tu flota opera con normalidad. Hay <span style={{ color:B.rose, fontWeight:500 }}>5 incidentes</span> que requieren atención y <span style={{ color:B.amber, fontWeight:500 }}>3 contratos</span> por renovar este trimestre.
        </p>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <PillButton tone="ghost" size="sm">Exportar</PillButton>
        <PillButton tone="primary" size="sm">+ Nuevo registro</PillButton>
      </div>
    </div>
  );
}

// ─── KPI bento ──────────────────────────────────────────────────────
const KPI_TREND = [62, 66, 64, 70, 68, 71, 73];

function KPIBento({ openModal }) {
  const kpis = window.MOVOS_KPIS;
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'repeat(12, 1fr)',
      gridAutoRows:'118px', gap:14, marginBottom:14,
    }}>
      {/* Hero: Utilización */}
      <SoftCard span={5} rowSpan={2} padding={28} big
        onClick={()=>openModal({ kind:'kpi', kpi: kpis.find(k=>k.id==='util') })}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, fontWeight:500, marginBottom:4 }}>Utilización de flota</div>
            <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink4, fontWeight:400 }}>Mes en curso</div>
          </div>
          <SoftBadge tone="green">↑ 4.2 pts vs abril</SoftBadge>
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:30 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
            <span style={{ fontFamily:'Inter', fontSize:72, fontWeight:600, color:B.ink, letterSpacing:'-0.04em', lineHeight:0.9 }}>73</span>
            <span style={{ fontFamily:'Inter', fontSize:28, fontWeight:500, color:B.ink2, letterSpacing:'-0.02em' }}>%</span>
          </div>
          <Sparkline values={KPI_TREND} color={B.blue} height={56} />
        </div>
        <div style={{ marginTop:18, padding:'14px 16px', background:B.surface2, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Dot tone="green" />
            <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink2 }}>Por encima de la meta trimestral (70%)</span>
          </div>
          <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3 }}>Ver detalle →</span>
        </div>
      </SoftCard>

      {/* Available + Assigned (row 1) */}
      <SoftCard span={4} onClick={()=>openModal({ kind:'kpi', kpi: kpis.find(k=>k.id==='available') })}>
        <SmallKPI label="Disponibles" value="142" tone="green" delta="↑ 8 hoy" sub="Listos para renta" />
      </SoftCard>
      <SoftCard span={3} onClick={()=>openModal({ kind:'kpi', kpi: kpis.find(k=>k.id==='assigned') })}>
        <SmallKPI label="Asignados" value="87" tone="blue" delta="12 vuelven hoy" />
      </SoftCard>

      {/* Total + OOS (row 2) */}
      <SoftCard span={4} onClick={()=>openModal({ kind:'kpi', kpi: kpis.find(k=>k.id==='total') })}>
        <SmallKPI label="Flota total" value="248" tone="sky" delta="4 sucursales" sub="Activos en operación" />
      </SoftCard>
      <SoftCard span={3} onClick={()=>openModal({ kind:'kpi', kpi: kpis.find(k=>k.id==='oos') })}>
        <SmallKPI label="Fuera de servicio" value="19" tone="rose" delta="8 en taller · 6 espera" />
      </SoftCard>
    </div>
  );
}

function SmallKPI({ label, value, tone, delta, sub, inkColor }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', height:'100%' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, fontWeight:500 }}>{label}</span>
        <SoftBadge tone={tone} size={10}>{delta}</SoftBadge>
      </div>
      <div>
        <div style={{ fontFamily:'Inter', fontSize:36, fontWeight:600, color:inkColor||B.ink, letterSpacing:'-0.03em', lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, marginTop:6 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Alerts bento ───────────────────────────────────────────────────
// Critical alerts = vehicles awaiting repair scheduling. Source is either
// CARCHECK (auto-detected via the mobile inspection app on return) or
// MANUAL (logged by a manager from desktop). Each row's CTA on hover is
// "Agendar reparación →".
function AlertsBento({ openModal }) {
  const crit = window.MOVOS_CRITICAL_ALERTS;
  const svc = window.MOVOS_SERVICE_ALERTS;
  const toneMap = { red:'rose', orange:'amber', yellow:'amber', green:'green' };
  return (
    <div style={{ display:'grid', gridTemplateColumns:'7fr 5fr', gap:14, marginBottom:14 }}>
      <SoftCard padding={26}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
          <div>
            <h2 style={{ fontFamily:'Inter', fontSize:18, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.01em' }}>Incidentes en curso</h2>
            <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, marginTop:4 }}>Vehículos detenidos · por agendar reparación para volver a disponible</p>
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <SoftBadge tone="rose">{crit.length} por agendar</SoftBadge>
          </div>
        </div>
        {/* Source legend strip — communicates the two entry points without taking column space per row */}
        <div style={{ display:'flex', gap:14, padding:'10px 0 14px', borderBottom:`1px solid ${B.hairline}`, marginBottom:6, fontFamily:'Inter', fontSize:11, color:B.ink3 }}>
          <span style={{ display:'flex', alignItems:'center', gap:6 }}>
            <SourceIcon source="CARCHECK" tone="blue" size={16} />
            CarCheck · inspección al retorno
          </span>
          <span style={{ display:'flex', alignItems:'center', gap:6 }}>
            <SourceIcon source="MANUAL" tone="lilac" size={16} />
            Manual · reporte de gerencia
          </span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {crit.map(a => {
            const t = toneMap[a.color] || 'amber';
            const sourceTone = a.source === 'CARCHECK' ? 'blue' : 'lilac';
            return (
              <div key={a.unit} onClick={()=>openModal({ kind:'alert', alert:a })}
                onMouseEnter={e=>{ e.currentTarget.style.background = B.surface2; e.currentTarget.querySelector('[data-cta]').style.opacity = 1; }}
                onMouseLeave={e=>{ e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('[data-cta]').style.opacity = 0; }}
                style={{
                  display:'grid', gridTemplateColumns:'auto 1fr auto', gap:16,
                  alignItems:'center', padding:'14px 16px', borderRadius:14,
                  cursor:'pointer', transition:'background 0.15s', position:'relative',
                }}>
                <div style={{
                  width:42, height:42, borderRadius:12, background:B[sourceTone+'Soft'],
                  display:'flex', alignItems:'center', justifyContent:'center', color:B[sourceTone],
                  flexShrink:0,
                }}>
                  <SourceIcon source={a.source} tone={sourceTone} />
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, letterSpacing:'-0.005em' }}>{a.unit}</span>
                    <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3 }}>· {a.plate}</span>
                    <SoftBadge tone={t} size={10}>{a.severity.toLowerCase()}</SoftBadge>
                    <SoftBadge tone={sourceTone} size={10}>{a.source === 'CARCHECK' ? 'CarCheck' : 'Manual'}</SoftBadge>
                  </div>
                  <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {a.note}
                  </div>
                </div>
                <div style={{ textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                  <SoftBadge tone="amber" size={10}>{a.repair.toLowerCase()}</SoftBadge>
                  <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3 }}>{a.branch} · hace {a.ago.toLowerCase()}</div>
                  <span data-cta style={{ fontFamily:'Inter', fontSize:11, color:B.ink, fontWeight:500, opacity:0, transition:'opacity 0.15s', marginTop:2 }}>Agendar reparación →</span>
                </div>
              </div>
            );
          })}
        </div>
        <div onClick={()=>openModal({ kind:'all-alerts', title:'Incidentes en curso' })}
          style={{ marginTop:10, padding:'10px', textAlign:'center', fontFamily:'Inter', fontSize:13, color:B.ink2, fontWeight:500, cursor:'pointer', borderRadius:10 }}
          onMouseEnter={e=>e.currentTarget.style.background=B.surface2}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          Ver bandeja completa de incidentes →
        </div>
      </SoftCard>

      <SoftCard padding={26}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <h2 style={{ fontFamily:'Inter', fontSize:18, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.01em' }}>Próximos servicios</h2>
            <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, marginTop:4 }}>Programa del manufacturador · 14 días</p>
          </div>
          <SoftBadge tone="amber">{svc.length} pendientes</SoftBadge>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {svc.slice(0,4).map(a => {
            const t = toneMap[a.color] || 'amber';
            const overdue = a.due.includes('VENCIDO');
            return (
              <div key={a.unit} onClick={()=>openModal({ kind:'service', alert:a })}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, background:B.surface2, cursor:'pointer' }}>
                <div>
                  <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink }}>{a.unit}</div>
                  <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, marginTop:2 }}>{a.model.split(' ').slice(0,2).join(' ')} · {a.km.toLocaleString('es-MX')} km</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <SoftBadge tone={t} size={10}>{overdue?'Vencido':'Programar'}</SoftBadge>
                  <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:4 }}>{a.due.replace('VENCIDO ','').replace('VENCE EN ','en ').toLowerCase()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </SoftCard>
    </div>
  );
}

// CarCheck = mobile/scan glyph · Manual = pencil/document glyph
function SourceIcon({ source, tone='blue', size=18 }) {
  if (source === 'MANUAL') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    );
  }
  // CarCheck — phone-with-scan-line
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="2" width="12" height="20" rx="2"></rect>
      <path d="M6 10h12"></path>
      <path d="M10 18h4"></path>
    </svg>
  );
}

// ─── Sucursales bento (mixed sizes) ─────────────────────────────────
function SucursalesBento({ openModal }) {
  const branches = window.MOVOS_BRANCHES;
  const parts = window.MOVOS_PARTS;
  const toneFor = u => u >= 75 ? 'green' : u >= 65 ? 'blue' : 'amber';
  const titleCase = s => s.split(' ').map(w => w.charAt(0)+w.slice(1).toLowerCase()).join(' ');
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(12, 1fr)', gap:14, marginBottom:14 }}>
      {/* Section heading bar */}
      <div style={{ gridColumn:'span 12', display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:8 }}>
        <div>
          <h2 style={{ fontFamily:'Inter', fontSize:18, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.01em' }}>Sucursales</h2>
          <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, marginTop:4 }}>Utilización actual · 4 ubicaciones en Uruguay</p>
        </div>
        <PillButton tone="ghost" size="sm">Ver mapa</PillButton>
      </div>

      {/* Featured: Montevideo (HQ, largest) — spans 7 cols */}
      {(() => {
        const b = branches[0]; // Montevideo
        const tone = toneFor(b.util);
        return (
          <SoftCard span={7} padding={26} onClick={()=>openModal({ kind:'branch', branch:b })}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:22 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <SoftBadge tone="blue" size={10}>Sede principal</SoftBadge>
                  <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink4 }}>{b.code}</span>
                </div>
                <h3 style={{ fontFamily:'Inter', fontSize:24, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.02em' }}>{titleCase(b.name)}</h3>
                <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, marginTop:6, margin:0 }}>Departamento de Montevideo</p>
              </div>
              <Ring value={b.util} color={B[tone]} size={76} label={`${b.util}%`} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:0 }}>
              {[
                { l:'Total',      v:b.total,      tone:'sky'   },
                { l:'Disponibles',v:b.available,  tone:'green' },
                { l:'Asignados',  v:b.assigned,   tone:'blue'  },
                { l:'Inactivos',  v:b.oos,        tone:'rose'  },
              ].map((s, i) => (
                <div key={s.l} style={{ paddingLeft: i?20:0, borderLeft: i?`1px solid ${B.hairline}`:'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                    <Dot tone={s.tone} size={6} />
                    <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500 }}>{s.l}</span>
                  </div>
                  <div style={{ fontFamily:'Inter', fontSize:28, fontWeight:600, color:B.ink, letterSpacing:'-0.02em' }}>{s.v}</div>
                </div>
              ))}
            </div>
          </SoftCard>
        );
      })()}

      {/* Colonia — span 5 (row 1, right) */}
      {(() => {
        const b = branches[1]; const tone = toneFor(b.util);
        return (
          <SoftCard span={5} padding={24} onClick={()=>openModal({ kind:'branch', branch:b })}>
            <BranchCardBody b={b} tone={tone} titleCase={titleCase} />
          </SoftCard>
        );
      })()}

      {/* Punta del Este — span 6 (row 2 left) */}
      {(() => {
        const b = branches[2]; const tone = toneFor(b.util);
        return (
          <SoftCard span={6} padding={24} onClick={()=>openModal({ kind:'branch', branch:b })}>
            <BranchCardBody b={b} tone={tone} titleCase={titleCase} accentNote="Temporada alta · enero" />
          </SoftCard>
        );
      })()}

      {/* Salto — span 6 (row 2 right) */}
      {(() => {
        const b = branches[3]; const tone = toneFor(b.util);
        return (
          <SoftCard span={6} padding={24} onClick={()=>openModal({ kind:'branch', branch:b })}>
            <BranchCardBody b={b} tone={tone} titleCase={titleCase} accentNote="Litoral norte" />
          </SoftCard>
        );
      })()}

      {/* Parts request — wide bento card */}
      <SoftCard span={12} padding={26}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <h2 style={{ fontFamily:'Inter', fontSize:18, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.01em' }}>Refacciones en camino</h2>
            <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, marginTop:4 }}>Pedidos activos · {parts.length} solicitudes</p>
          </div>
          <PillButton tone="ghost" size="sm" onClick={()=>openModal({ kind:'all-parts' })}>Ver almacén</PillButton>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12 }}>
          {parts.slice(0,6).map(p => {
            const tone = toneMapBento[p.color] || 'amber';
            return (
              <div key={p.ref} onClick={()=>openModal({ kind:'part', part:p })}
                style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:14, background:B.surface2, cursor:'pointer' }}>
                <div style={{ width:38, height:38, borderRadius:11, background:B[tone+'Soft'], display:'flex', alignItems:'center', justifyContent:'center', color:B[tone], flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 3h5v5"></path><path d="M21 3 11 13"></path><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path>
                  </svg>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:500, color:B.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.part}</div>
                  <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:2 }}>{p.vehicle} · {p.eta.toLowerCase()}</div>
                </div>
                <SoftBadge tone={tone} size={10}>{p.priority.toLowerCase()}</SoftBadge>
              </div>
            );
          })}
        </div>
      </SoftCard>
    </div>
  );
}

function BranchCardBody({ b, tone, titleCase, accentNote }) {
  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:18 }}>
        <div>
          <h3 style={{ fontFamily:'Inter', fontSize:17, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.01em' }}>{titleCase(b.name)}</h3>
          <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink4, marginTop:3 }}>{b.code}{accentNote ? ' · '+accentNote : ''}</div>
        </div>
        <Ring value={b.util} color={B[tone]} size={56} stroke={5} label={`${b.util}`} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <SmallStat label="Total"    value={b.total}     tone="sky"   />
        <SmallStat label="Disp."    value={b.available} tone="green" />
        <SmallStat label="Asig."    value={b.assigned}  tone="blue"  />
        <SmallStat label="Inact."   value={b.oos}       tone="rose"  />
      </div>
    </div>
  );
}

const toneMapBento = { red:'rose', orange:'amber', yellow:'amber', green:'green', blue:'blue' };

function SmallStat({ label, value, tone }) {
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
        <Dot tone={tone} size={5} />
        <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500 }}>{label}</span>
      </div>
      <div style={{ fontFamily:'Inter', fontSize:18, fontWeight:600, color:B.ink, letterSpacing:'-0.01em' }}>{value}</div>
    </div>
  );
}

// ─── Contratos bento ────────────────────────────────────────────────
function ContractsBento({ openModal }) {
  const contracts = window.MOVOS_CONTRACTS;
  const toneFor = c => c.color === 'green' ? 'green' : c.color === 'orange' ? 'amber' : 'rose';
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:14, marginTop:8 }}>
        <div>
          <h2 style={{ fontFamily:'Inter', fontSize:18, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.01em' }}>Contratos a largo plazo</h2>
          <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, marginTop:4 }}>Clientes corporativos · {contracts.length} activos</p>
        </div>
        <PillButton tone="ghost" size="sm">Ver todos</PillButton>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
        {contracts.map(c => {
          const tone = toneFor(c);
          return (
            <SoftCard key={c.id} padding={26} onClick={()=>openModal({ kind:'contract', contract:c })}>
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
  );
}

// ─── Modal (soft variant) ───────────────────────────────────────────
function SoftModal({ modal, close }) {
  if (!modal) return null;
  let title, subtitle, body, tone='blue';

  if (modal.kind === 'kpi') {
    const k = modal.kpi;
    tone = k.color === 'green' ? 'green' : k.color === 'red' ? 'rose' : k.color === 'blue' ? 'blue' : 'ochre';
    title = k.label.charAt(0)+k.label.slice(1).toLowerCase();
    subtitle = `${k.value}${k.unit||''} · ${k.sub.toLowerCase()}`;
    body = <SoftFleetList filter={k.id} />;
  } else if (modal.kind === 'alert') {
    const a = modal.alert; tone = 'rose';
    title = `Incidente · ${a.unit}`;
    subtitle = `${a.plate} · ${a.model} · ${a.branch}`;
    body = <SoftAlertDetail alert={a} />;
  } else if (modal.kind === 'service') {
    const a = modal.alert; tone = 'amber';
    title = `Servicio · ${a.unit}`;
    subtitle = `${a.plate} · ${a.model}`;
    body = <SoftServiceDetail alert={a} />;
  } else if (modal.kind === 'branch') {
    const b = modal.branch; tone = 'blue';
    title = b.name.charAt(0)+b.name.slice(1).toLowerCase();
    subtitle = `${b.code} · ${b.total} vehículos · ${b.util}% utilización`;
    body = <SoftFleetList filter={`branch:${b.name}`} />;
  } else if (modal.kind === 'contract') {
    const c = modal.contract; tone = c.color === 'green' ? 'green' : 'amber';
    title = c.client.charAt(0)+c.client.slice(1).toLowerCase();
    subtitle = `${c.id} · ${c.type.toLowerCase()} · vence ${c.expires}`;
    body = <SoftContractDetail contract={c} />;
  } else if (modal.kind === 'part') {
    const p = modal.part; tone = toneMapBento[p.color] || 'amber';
    title = `Pedido ${p.ref}`;
    subtitle = `${p.part} · ${p.vehicle}`;
    body = <SoftPartDetail part={p} />;
  } else if (modal.kind === 'all-alerts') {
    tone = 'rose'; title = modal.title || 'Incidentes'; subtitle = 'Bandeja completa · últimas 24 horas';
    body = <SoftFleetList filter="alerts" />;
  } else if (modal.kind === 'all-parts') {
    tone = 'amber'; title='Almacén de refacciones'; subtitle='Pedidos activos · movimientos del día';
    body = <SoftAllParts />;
  }

  return (
    <div onClick={close} style={{
      position:'absolute', inset:0, background:'rgba(14,23,38,0.28)',
      backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      padding:'60px 40px', zIndex:50, overflow:'auto',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'92%', maxWidth:980, background:B.surface,
        borderRadius:24, boxShadow:B.shadowLg, overflow:'hidden',
      }}>
        <div style={{ padding:'28px 32px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:`1px solid ${B.hairline}` }}>
          <div>
            <SoftBadge tone={tone} size={11}>Detalle</SoftBadge>
            <h2 style={{ fontFamily:'Inter', fontSize:26, fontWeight:600, color:B.ink, margin:'10px 0 6px', letterSpacing:'-0.02em' }}>{title}</h2>
            <p style={{ fontFamily:'Inter', fontSize:14, color:B.ink3, margin:0 }}>{subtitle}</p>
          </div>
          <button onClick={close} style={{
            width:36, height:36, borderRadius:9999, background:B.surface2,
            border:'none', color:B.ink2, fontSize:18, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>✕</button>
        </div>
        <div style={{ padding:'28px 32px' }}>{body}</div>
      </div>
    </div>
  );
}

function SoftFleetList({ filter }) {
  const fleet = window.MOVOS_FLEET;
  const rows = (() => {
    if (filter === 'total') return fleet;
    if (filter === 'available') return fleet.filter(v => v.status === 'DISPONIBLE');
    if (filter === 'assigned')  return fleet.filter(v => v.status === 'ASIGNADO');
    if (filter === 'util')      return fleet.filter(v => v.status === 'ASIGNADO');
    if (filter === 'oos')       return fleet.filter(v => v.status === 'FUERA DE SERVICIO' || v.status === 'EN MANTENIMIENTO');
    if (filter === 'alerts')    return fleet.filter(v => v.alert);
    if (filter.startsWith('branch:')) return fleet.filter(v => v.branch.toUpperCase().includes(filter.slice(7).split(' ')[0]));
    return fleet;
  })();
  const statusTone = { green:'green', red:'rose', blue:'blue', gold:'ochre', yellow:'amber', purple:'lilac' };
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {['Todas','Montevideo','Colonia','Punta del Este','Salto'].map((b,i)=>(
            <span key={b} style={{
              fontFamily:'Inter', fontSize:12, fontWeight:500,
              padding:'6px 12px', borderRadius:9999,
              color: i===0?B.ink:B.ink2,
              background: i===0?B.surface2:'transparent',
              border:`1px solid ${i===0?B.hairline:'transparent'}`,
              cursor:'pointer',
            }}>{b}</span>
          ))}
        </div>
        <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink3 }}>{rows.length} vehículos</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10 }}>
        {rows.map(v => (
          <div key={v.unit} style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'14px 16px', background:B.surface2, borderRadius:14,
          }}>
            <div>
              <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, letterSpacing:'-0.005em' }}>{v.unit} · {v.plate}</div>
              <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, marginTop:3 }}>{v.model} · {v.branch}</div>
            </div>
            <SoftBadge tone={statusTone[v.statusColor]||'neutral'} size={10}>
              {v.status.toLowerCase()}
            </SoftBadge>
          </div>
        ))}
      </div>
    </div>
  );
}

function SoftAlertDetail({ alert }) {
  const tone = alert.color === 'red' ? 'rose' : 'amber';
  const sourceTone = alert.source === 'CARCHECK' ? 'blue' : 'lilac';
  const sourceLabel = alert.source === 'CARCHECK' ? 'CarCheck · inspección móvil' : 'Manual · reporte de gerencia';
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:24 }}>
      <div>
        <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
          <SoftBadge tone={sourceTone}>
            <SourceIcon source={alert.source} tone={sourceTone} size={11} />
            {sourceLabel}
          </SoftBadge>
          <SoftBadge tone={tone}>severidad · {alert.severity.toLowerCase()}</SoftBadge>
          <SoftBadge tone="amber">{alert.repair.toLowerCase()}</SoftBadge>
        </div>
        <p style={{ fontFamily:'Inter', fontSize:15, color:B.ink, lineHeight:1.6, margin:'0 0 8px' }}>{alert.note}</p>
        <p style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, margin:'0 0 22px' }}>Reportado por <strong style={{ color:B.ink2, fontWeight:500 }}>{alert.sourceBy}</strong> · hace {alert.ago.toLowerCase()}</p>
        <h4 style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:B.ink2, marginBottom:12, letterSpacing:'-0.005em' }}>Acciones aplicadas automáticamente</h4>
        {[
          { t:'Vehículo movido a Fuera de servicio', when:'hace '+alert.ago.toLowerCase(), tone:'rose' },
          { t:'Ticket de reparación #T-3382 creado', when:'hace '+alert.ago.toLowerCase(), tone:'lilac' },
          { t:'Notificación al gerente regional',    when:'hace '+alert.ago.toLowerCase(), tone:'blue' },
        ].map((s,i)=>(
          <div key={i} style={{ display:'flex', gap:14, alignItems:'center', padding:'12px 14px', background:B.surface2, borderRadius:12, marginBottom:8 }}>
            <div style={{ width:22, height:22, borderRadius:9999, background:B[s.tone+'Soft'], color:B[s.tone], display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>✓</div>
            <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink, flex:1 }}>{s.t}</span>
            <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3 }}>{s.when}</span>
          </div>
        ))}
      </div>
      <div>
        <h4 style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:B.ink2, margin:'0 0 12px' }}>Próximo paso · agendar</h4>
        <div style={{ background:B.amberSoft, borderRadius:14, padding:'14px 16px', marginBottom:14 }}>
          <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink, lineHeight:1.5, margin:0 }}>
            El vehículo permanecerá en <strong>Fuera de servicio</strong> hasta agendar reparación en taller. Una vez completada, vuelve a <strong style={{ color:B.green }}>Disponible</strong>.
          </p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <PillButton tone="primary">Agendar reparación →</PillButton>
          <PillButton tone="ghost">Ver expediente completo</PillButton>
          <PillButton tone="ghost">Contactar a {alert.sourceBy.split(' ').slice(0,2).join(' ')}</PillButton>
          <PillButton tone="danger">Marcar como resuelto</PillButton>
        </div>
        <h4 style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:B.ink2, margin:'24px 0 12px' }}>Historial reciente</h4>
        {[
          { d:'17 may', e:'Daño reportado · '+alert.severity.toLowerCase(), tone:'rose' },
          { d:'12 may', e:'Limpieza completada',              tone:'amber' },
          { d:'09 may', e:'Retorno de renta · L. Ortiz',      tone:'blue'  },
          { d:'04 may', e:'Servicio 30 000 km',               tone:'sky'   },
        ].map((h,i)=>(
          <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom: i<3 ? `1px solid ${B.hairline}` : 'none' }}>
            <Dot tone={h.tone} size={6} />
            <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, width:50 }}>{h.d}</span>
            <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink2 }}>{h.e}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SoftServiceDetail({ alert }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
      <div>
        <div style={{ background:B.surface2, borderRadius:18, padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14 }}>
            <div style={{ fontFamily:'Inter', fontSize:44, fontWeight:600, color:B.ink, letterSpacing:'-0.02em', lineHeight:1 }}>{alert.km.toLocaleString('es-MX')}</div>
            <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink3 }}>km recorridos</div>
          </div>
          <div style={{ height:6, background:B.surface, borderRadius:9999, overflow:'hidden', marginBottom:8 }}>
            <div style={{ width:'82%', height:'100%', background:B.amber, borderRadius:9999 }}></div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'Inter', fontSize:11, color:B.ink3 }}>
            <span>Última: 40 000 km</span><span>Próxima: 50 000 km</span>
          </div>
        </div>
        <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink2, lineHeight:1.7, marginTop:18 }}>
          <strong style={{ color:B.ink }}>{alert.type.toLowerCase()}</strong> requerido por programa del manufacturador. Incluye cambio de aceite, filtros, revisión de frenos y rotación de llantas.
        </p>
      </div>
      <div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
          <PillButton tone="primary">Reservar en Taller MovOS</PillButton>
          <PillButton tone="ghost">Enviar a dealer oficial</PillButton>
          <PillButton tone="ghost">Posponer</PillButton>
        </div>
        <div style={{ background:B.amberSoft, borderRadius:14, padding:'14px 16px' }}>
          <div style={{ fontFamily:'Inter', fontSize:12, fontWeight:600, color:B.amber, marginBottom:6 }}>Recomendación</div>
          <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink2, lineHeight:1.6, margin:0 }}>Programa en las próximas 48 horas. El vehículo está actualmente disponible y no compromete utilización.</p>
        </div>
      </div>
    </div>
  );
}

function SoftContractDetail({ contract }) {
  const tone = contract.color === 'green' ? 'green' : contract.color === 'orange' ? 'amber' : 'rose';
  const sample = window.MOVOS_FLEET.slice(0, 4);
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10, marginBottom:24 }}>
        {[
          { l:'Vehículos', v:contract.fleet, tone:'blue' },
          { l:'En uso',    v:Math.round(contract.fleet*0.88), tone:'green' },
          { l:'Inactivos', v:Math.round(contract.fleet*0.12), tone:'amber' },
          { l:'Renueva',   v:contract.renewIn.toLowerCase(), tone, isText:true },
        ].map(s => (
          <div key={s.l} style={{ background:B.surface2, borderRadius:14, padding:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
              <Dot tone={s.tone} size={6} />
              <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500 }}>{s.l}</span>
            </div>
            <div style={{ fontFamily:'Inter', fontSize:s.isText?16:26, fontWeight:600, color:B.ink, letterSpacing:'-0.02em' }}>{s.v}</div>
          </div>
        ))}
      </div>
      <h4 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, marginBottom:14 }}>Vehículos asignados · {sample.length}</h4>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10 }}>
        {sample.map(v => (
          <div key={v.unit} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:B.surface2, borderRadius:14 }}>
            <div>
              <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink }}>{v.unit}</div>
              <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, marginTop:2 }}>{v.model} · {v.branch}</div>
            </div>
            <SoftBadge tone="blue" size={10}>{v.status.toLowerCase()}</SoftBadge>
          </div>
        ))}
      </div>
    </div>
  );
}

function SoftPartDetail({ part }) {
  const tone = toneMapBento[part.color] || 'amber';
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:24 }}>
        {[
          { l:'Prioridad', v:part.priority.toLowerCase(), tone },
          { l:'Estado',    v:part.status.toLowerCase(),   tone:'blue' },
          { l:'ETA',       v:part.eta.toLowerCase(),       tone:'ochre' },
        ].map(s => (
          <div key={s.l} style={{ background:B.surface2, borderRadius:14, padding:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
              <Dot tone={s.tone} size={6} />
              <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500 }}>{s.l}</span>
            </div>
            <div style={{ fontFamily:'Inter', fontSize:18, fontWeight:600, color:B.ink, letterSpacing:'-0.01em' }}>{s.v}</div>
          </div>
        ))}
      </div>
      <h4 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, marginBottom:14 }}>Línea de tiempo</h4>
      {[
        { d:'09:24', t:'Solicitud creada',                 tone:'ochre' },
        { d:'09:31', t:'Aprobada por R. Ávila',            tone:'green' },
        { d:'10:02', t:'Pedido a proveedor · Sasa Repuestos MVD',tone:'blue'  },
        { d:'12:18', t:'En camino · seguimiento DHL #4029', tone:'lilac', active:true },
        { d:'17:00', t:'Entrega · Taller MovOS Centro',     tone:'neutral' },
      ].map((e,i)=>(
        <div key={i} style={{ display:'flex', gap:14, alignItems:'center', padding:'12px 0', borderBottom: i<4 ? `1px solid ${B.hairline}` : 'none' }}>
          <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, width:50 }}>{e.d}</span>
          <Dot tone={e.tone} size={8} />
          <span style={{ fontFamily:'Inter', fontSize:14, color: e.active?B.ink:B.ink2, fontWeight: e.active?500:400 }}>{e.t}</span>
        </div>
      ))}
    </div>
  );
}

function SoftAllParts() {
  const parts = window.MOVOS_PARTS;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10 }}>
      {parts.map(p => {
        const tone = toneMapBento[p.color] || 'amber';
        return (
          <div key={p.ref} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:B.surface2, borderRadius:14 }}>
            <div>
              <div style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink }}>{p.part}</div>
              <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, marginTop:2 }}>{p.ref} · {p.vehicle} · {p.eta.toLowerCase()}</div>
            </div>
            <SoftBadge tone={tone} size={10}>{p.priority.toLowerCase()}</SoftBadge>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────
function DashboardBento({ initialModal=null }) {
  const [modal, setModal] = useStateB(initialModal);
  const close = () => setModal(null);

  useEffectB(() => {
    if (!modal) return;
    function onKey(e){ if (e.key === 'Escape') close(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal]);

  return (
    <div style={{
      position:'relative', width:'100%', height:'100%',
      background:B.bg, overflow:'hidden',
      fontFamily:'Inter, -apple-system, sans-serif', color:B.ink,
    }}>
      <TopBar />
      <PageHeader />
      <div style={{ padding:'0 36px 80px' }}>
        <KPIBento openModal={setModal} />
        <AlertsBento openModal={setModal} />
        <SucursalesBento openModal={setModal} />
        <ContractsBento openModal={setModal} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'24px 4px 0', marginTop:16, borderTop:`1px solid ${B.hairline}` }}>
          <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink4, display:'flex', gap:20 }}>
            <span>MovOS · v3.4.1</span>
            <span>Sincronización Karve ✓</span>
            <span>Actualizado 09:42</span>
          </div>
          <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink4 }}>RentaUY · Montevideo</div>
        </div>
      </div>
      <SoftModal modal={modal} close={close} />
    </div>
  );
}

window.MovOSDashboardBento = DashboardBento;

// Expose primitives so other screen files can reuse them.
window.MovOSBento = {
  B, SoftCard, SoftBadge, PillButton, Dot, Ring, Sparkline, SourceIcon,
  TopBar, // for screens that want the full top bar
  // helpers
  titleCase: s => s.split(' ').map(w => w.charAt(0)+w.slice(1).toLowerCase()).join(' '),
};
