// MovOS · Analytics + Intelligence screens (bento)

const { useState: useStateInt } = React;

(function() {
const { B, SoftCard, SoftBadge, PillButton, Dot, Ring, Sparkline, TopBar } = window.MovOSBento;

// ─── shared bits ─────────────────────────────────────────────
function PageHead({ title, subtitle, date, badge, actions }) {
  return (
    <div style={{ padding:'36px 36px 24px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24 }}>
      <div>
        <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, fontWeight:500, marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
          {date || 'Lunes · 17 de mayo, 2026'}
          {badge}
        </div>
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

// ─── Soft area chart (no library) ────────────────────────────
function AreaChart({ series, height=180, color }) {
  const w = 600, h = height, pad = 24;
  const max = Math.max(...series.flatMap(s => s.data)) * 1.15;
  const min = 0;
  const points = (data) => data.map((v, i) => {
    const x = pad + (i / (data.length-1)) * (w - pad*2);
    const y = h - pad - ((v - min) / (max - min)) * (h - pad*2);
    return [x, y];
  });
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display:'block' }}>
      {/* y gridlines */}
      {[0.25, 0.5, 0.75].map(g => (
        <line key={g} x1={pad} x2={w-pad} y1={pad + g*(h-pad*2)} y2={pad + g*(h-pad*2)} stroke={B.hairline} strokeWidth="1" />
      ))}
      {series.map((s, si) => {
        const pts = points(s.data);
        const d = pts.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
        const fillD = d + ` L ${w-pad} ${h-pad} L ${pad} ${h-pad} Z`;
        const c = B[s.color || color || 'blue'];
        return (
          <g key={s.label}>
            <path d={fillD} fill={c} opacity={0.08}></path>
            <path d={d} stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
          </g>
        );
      })}
      {/* x labels */}
      {['Ene','Feb','Mar','Abr','May'].map((m, i) => (
        <text key={m} x={pad + (i/4)*(w-pad*2)} y={h-4} textAnchor="middle"
          fontFamily="Inter" fontSize="10" fill={B.ink3}>{m}</text>
      ))}
    </svg>
  );
}

function BarChart({ data, height=180, color }) {
  const w = 600, h = height, pad = 24;
  const max = Math.max(...data.map(d => d.value)) * 1.15;
  const barW = ((w - pad*2) / data.length) * 0.6;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display:'block' }}>
      {[0.25, 0.5, 0.75].map(g => (
        <line key={g} x1={pad} x2={w-pad} y1={pad + g*(h-pad*2)} y2={pad + g*(h-pad*2)} stroke={B.hairline} strokeWidth="1" />
      ))}
      {data.map((d, i) => {
        const x = pad + (i / data.length) * (w - pad*2) + ((w - pad*2) / data.length - barW) / 2;
        const y = h - pad - (d.value / max) * (h - pad*2);
        const bh = (d.value / max) * (h - pad*2);
        const c = B[d.color || color || 'blue'];
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={bh} fill={c} opacity={0.85} rx="3"></rect>
            <text x={x + barW/2} y={h-4} textAnchor="middle" fontFamily="Inter" fontSize="10" fill={B.ink3}>{d.label}</text>
            <text x={x + barW/2} y={y - 6} textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="600" fill={B.ink}>{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Analytics screen ─────────────────────────────────────────
function Analytics() {
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:B.bg, overflow:'hidden', fontFamily:'Inter, sans-serif', color:B.ink }}>
      <TopBar active="Analítica" />
      <PageHead title="Analítica" subtitle="Utilización, costos y tendencias de la flota · últimos 5 meses"
        actions={<>
          <SoftBadge tone="neutral">Últimos 5 meses</SoftBadge>
          <PillButton tone="ghost" size="sm">Cambiar período</PillButton>
          <PillButton tone="primary" size="sm">Exportar reporte</PillButton>
        </>} />
      <div style={{ padding:'0 36px 80px' }}>
        {/* Strategic KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:14, marginBottom:32 }}>
          {[
            { l:'Utilización promedio', v:'73%', delta:'+4.2 pts', tone:'green', sub:'vs abr' },
            { l:'Ingreso mensual',       v:'USD 184 K', delta:'+8.1%', tone:'green', sub:'mayo MTD' },
            { l:'Costo mantenimiento',   v:'USD 8.4 K', delta:'-3.2%', tone:'green', sub:'vs abr' },
            { l:'Tiempo en taller',      v:'2.8 d',     delta:'+0.4 d',tone:'amber', sub:'mediana' },
            { l:'Calidad inspecciones',  v:'94%',       delta:'+1.1 pts', tone:'green', sub:'aprobadas a la primera' },
          ].map(k => (
            <SoftCard key={k.l} padding={20}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, fontWeight:500 }}>{k.l}</span>
                <SoftBadge tone={k.tone} size={10}>{k.delta}</SoftBadge>
              </div>
              <div style={{ fontFamily:'Inter', fontSize:30, fontWeight:600, color:B.ink, letterSpacing:'-0.03em', lineHeight:1 }}>{k.v}</div>
              <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:8 }}>{k.sub}</div>
            </SoftCard>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
          <SoftCard padding={26}>
            <SectionHead title="Utilización por categoría" subtitle="% de flota en renta · evolución mensual">
              <div style={{ display:'flex', gap:12, fontFamily:'Inter', fontSize:11, color:B.ink3 }}>
                <span style={{ display:'flex', alignItems:'center', gap:6 }}><Dot tone="blue" size={6} /> Sedán</span>
                <span style={{ display:'flex', alignItems:'center', gap:6 }}><Dot tone="green" size={6} /> Compacto</span>
                <span style={{ display:'flex', alignItems:'center', gap:6 }}><Dot tone="amber" size={6} /> SUV</span>
                <span style={{ display:'flex', alignItems:'center', gap:6 }}><Dot tone="lilac" size={6} /> Premium</span>
              </div>
            </SectionHead>
            <AreaChart height={220} series={[
              { label:'Sedán',    data:[62, 65, 68, 70, 73], color:'blue'  },
              { label:'Compacto', data:[68, 70, 72, 74, 76], color:'green' },
              { label:'SUV',      data:[58, 60, 64, 66, 68], color:'amber' },
              { label:'Premium',  data:[78, 80, 82, 84, 88], color:'lilac' },
            ]} />
          </SoftCard>
          <SoftCard padding={26}>
            <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 8px' }}>Distribución de flota</h3>
            <p style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, margin:'0 0 22px' }}>248 vehículos por categoría</p>
            {[
              { l:'Sedán',     v:104, tone:'blue'  },
              { l:'Compacto',  v:78,  tone:'green' },
              { l:'SUV',       v:52,  tone:'amber' },
              { l:'Premium',   v:14,  tone:'lilac' },
            ].map(c => (
              <div key={c.l} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink2 }}>{c.l}</span>
                  <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>{c.v}</span>
                </div>
                <div style={{ height:6, background:B.surface2, borderRadius:9999, overflow:'hidden' }}>
                  <div style={{ width:`${(c.v/248)*100}%`, height:'100%', background:B[c.tone], borderRadius:9999 }}></div>
                </div>
              </div>
            ))}
          </SoftCard>
        </div>

        {/* Bars row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
          <SoftCard padding={26}>
            <SectionHead title="Comparativa por sucursal" subtitle="Utilización promedio · mayo 2026" />
            <BarChart data={[
              { label:'Mvd', value:78, color:'green' },
              { label:'Col', value:81, color:'green' },
              { label:'PDE', value:69, color:'blue'  },
              { label:'Sal', value:64, color:'blue'  },
            ]} />
          </SoftCard>
          <SoftCard padding={26}>
            <SectionHead title="Costo de mantenimiento por sucursal" subtitle="USD · mayo MTD" />
            <BarChart data={[
              { label:'Mvd', value:4200, color:'rose'  },
              { label:'Col', value:1800, color:'amber' },
              { label:'PDE', value:1600, color:'amber' },
              { label:'Sal', value:800,  color:'green' },
            ]} />
          </SoftCard>
        </div>

        {/* Hotspots */}
        <SoftCard padding={26}>
          <SectionHead title="Hallazgos del período" subtitle="Patrones detectados automáticamente" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
            {[
              { tone:'green', icon:'↑', t:'Utilización en Premium +4 pts', d:'BMW 320i y Audi A3 con demanda sostenida en Punta del Este.' },
              { tone:'amber', icon:'!', t:'Daños CarCheck +18%',           d:'Aumento en reportes post-retorno · concentrado en sucursal Aeropuerto cuando había contrato corporativo activo.' },
              { tone:'rose',  icon:'↓', t:'Suzuki Swift fuera de meta',    d:'Util 62% (meta 70%). Edad alta · evaluar venta o reasignación al norte.' },
            ].map(h => (
              <div key={h.t} style={{ padding:18, borderRadius:14, background:B.surface2 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{ width:28, height:28, borderRadius:9, background:B[h.tone+'Soft'], color:B[h.tone], display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter', fontWeight:600 }}>{h.icon}</div>
                  <h4 style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:B.ink, margin:0 }}>{h.t}</h4>
                </div>
                <p style={{ fontFamily:'Inter', fontSize:12, color:B.ink2, lineHeight:1.6, margin:0 }}>{h.d}</p>
              </div>
            ))}
          </div>
        </SoftCard>
      </div>
    </div>
  );
}

// ─── Intelligence screen ──────────────────────────────────────
function Intelligence() {
  const vehicles = window.MOVOS_INTEL_VEHICLES;
  const [tab, setTab] = useStateInt('overview');
  const recMap = { HOLD:'green', EVALUATE:'amber', SELL:'rose' };
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:B.bg, overflow:'hidden', fontFamily:'Inter, sans-serif', color:B.ink }}>
      <TopBar active="Inteligencia" />
      <PageHead title="Inteligencia" subtitle="Análisis estratégico de la flota · solo administradores"
        badge={<SoftBadge tone="amber">acceso restringido</SoftBadge>}
        actions={<>
          <PillButton tone="ghost" size="sm">Exportar a directorio</PillButton>
          <PillButton tone="primary" size="sm">Programar comité</PillButton>
        </>} />
      <div style={{ padding:'0 36px 80px' }}>
        {/* Strategic KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:14, marginBottom:24 }}>
          {[
            { l:'Score flota',         v:'68', sub:'/100 · saludable', tone:'green' },
            { l:'Candidatos a venta',  v:'2',  sub:'score < 50',       tone:'rose'  },
            { l:'A evaluar',           v:'2',  sub:'declive sostenido',tone:'amber' },
            { l:'Ingreso mes',         v:'USD 184 K', sub:'+8.1% vs abr', tone:'green' },
            { l:'Costo mant. mes',     v:'USD 8.4 K', sub:'-3.2% vs abr', tone:'green' },
            { l:'Utilización promedio',v:'73%', sub:'+4.2 pts vs abr',  tone:'green' },
          ].map(k => (
            <SoftCard key={k.l} padding={18}>
              <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500 }}>{k.l}</span>
              <div style={{ fontFamily:'Inter', fontSize:26, fontWeight:600, color:B.ink, letterSpacing:'-0.02em', marginTop:8, lineHeight:1 }}>{k.v}</div>
              <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:8 }}>
                <Dot tone={k.tone} size={5} />
                <span style={{ fontFamily:'Inter', fontSize:10, color:B.ink3 }}>{k.sub}</span>
              </div>
            </SoftCard>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:24, borderBottom:`1px solid ${B.hairline}` }}>
          {[
            { id:'overview', label:'Resumen' },
            { id:'shop',     label:'Tiempo en taller' },
            { id:'revenue',  label:'Ingresos y utilización' },
            { id:'sell',     label:'Recomendaciones' },
          ].map(t => (
            <div key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:'12px 16px', fontFamily:'Inter', fontSize:13,
              color: tab === t.id ? B.ink : B.ink3, fontWeight: tab === t.id ? 500 : 400,
              borderBottom: tab === t.id ? `2px solid ${B.ink}` : '2px solid transparent',
              cursor:'pointer', marginBottom:-1,
            }}>{t.label}</div>
          ))}
        </div>

        {tab === 'overview' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
            <SoftCard padding={26}>
              <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 18px' }}>Mejores desempeños</h3>
              {vehicles.slice(0,5).map(v => (
                <div key={v.unit} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:`1px solid ${B.hairline}` }}>
                  <Ring value={v.score} color={B[recMap[v.rec]]} size={42} stroke={4} label={`${v.score}`} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>{v.unit}</div>
                    <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:2 }}>{v.model}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'Inter', fontSize:12, color:B.green, fontWeight:500 }}>{v.trend}</div>
                  </div>
                </div>
              ))}
            </SoftCard>
            <SoftCard padding={26}>
              <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 18px' }}>Mayor tiempo en taller</h3>
              {[...vehicles].sort((a,b)=>b.shop-a.shop).slice(0,5).map(v => (
                <div key={v.unit} style={{ padding:'12px 0', borderBottom:`1px solid ${B.hairline}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>{v.unit} · {v.model}</span>
                    <span style={{ fontFamily:'Inter', fontSize:13, color:B.rose, fontWeight:500 }}>{v.shop} d</span>
                  </div>
                  <div style={{ height:4, background:B.surface2, borderRadius:9999 }}>
                    <div style={{ width:`${Math.min(v.shop/30*100, 100)}%`, height:'100%', background:B.rose, borderRadius:9999 }}></div>
                  </div>
                </div>
              ))}
            </SoftCard>
            <SoftCard padding={26}>
              <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 18px' }}>Acción requerida</h3>
              {vehicles.filter(v => v.rec !== 'HOLD').map(v => (
                <div key={v.unit} style={{ padding:'14px 16px', background:B[recMap[v.rec]+'Soft'], borderRadius:12, marginBottom:8 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>{v.unit} · {v.model}</span>
                    <SoftBadge tone={recMap[v.rec]} size={10}>{v.rec === 'SELL' ? 'vender' : 'evaluar'}</SoftBadge>
                  </div>
                  <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink2 }}>Score {v.score} · util {v.util}% · {v.shop} d en taller</div>
                </div>
              ))}
            </SoftCard>
          </div>
        )}

        {tab === 'shop' && (
          <SoftCard padding={0}>
            <div style={{ display:'grid', gridTemplateColumns:'90px 1fr 90px 110px 130px 110px 100px', gap:14, padding:'14px 22px', borderBottom:`1px solid ${B.hairline}` }}>
              {['Unidad','Modelo','Score','Util.','Costo mant.','Días taller','Recomendación'].map(h=>(
                <span key={h} style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500 }}>{h}</span>
              ))}
            </div>
            {[...vehicles].sort((a,b)=>b.shop-a.shop).map((v, i, arr) => (
              <div key={v.unit} style={{
                display:'grid', gridTemplateColumns:'90px 1fr 90px 110px 130px 110px 100px', gap:14,
                padding:'14px 22px', alignItems:'center',
                borderBottom: i < arr.length-1 ? `1px solid ${B.hairline}` : 'none',
              }}>
                <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:600 }}>{v.unit}</span>
                <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink2 }}>{v.model}</span>
                <SoftBadge tone={recMap[v.rec]} size={10}>{v.score}</SoftBadge>
                <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2 }}>{v.util}%</span>
                <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2 }}>USD {(v.shop * 240).toLocaleString('es-MX')}</span>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ flex:1, height:4, background:B.surface2, borderRadius:9999 }}>
                    <div style={{ width:`${Math.min(v.shop/30*100,100)}%`, height:'100%', background:B.rose, borderRadius:9999 }}></div>
                  </div>
                  <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2 }}>{v.shop} d</span>
                </div>
                <SoftBadge tone={recMap[v.rec]} size={10}>{v.rec === 'HOLD' ? 'mantener' : v.rec === 'SELL' ? 'vender' : 'evaluar'}</SoftBadge>
              </div>
            ))}
          </SoftCard>
        )}

        {tab === 'revenue' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <SoftCard padding={26}>
              <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 18px' }}>Top ingresos del mes</h3>
              {[...vehicles].sort((a,b)=>parseFloat(b.revenue.replace(/[^\d.]/g,''))-parseFloat(a.revenue.replace(/[^\d.]/g,''))).slice(0,7).map(v => (
                <div key={v.unit} style={{ padding:'12px 0', borderBottom:`1px solid ${B.hairline}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink }}>{v.unit} · {v.model}</span>
                    <span style={{ fontFamily:'Inter', fontSize:13, color:B.green, fontWeight:500 }}>{v.revenue}</span>
                  </div>
                  <div style={{ height:4, background:B.surface2, borderRadius:9999 }}>
                    <div style={{ width:`${(parseFloat(v.revenue.replace(/[^\d.]/g,''))/4200)*100}%`, height:'100%', background:B.green, borderRadius:9999 }}></div>
                  </div>
                </div>
              ))}
            </SoftCard>
            <SoftCard padding={26}>
              <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 18px' }}>Tasa de utilización</h3>
              {[...vehicles].sort((a,b)=>b.util-a.util).slice(0,7).map(v => (
                <div key={v.unit} style={{ padding:'12px 0', borderBottom:`1px solid ${B.hairline}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ fontFamily:'Inter', fontSize:13, color:B.ink }}>{v.unit} · {v.model}</span>
                    <span style={{ fontFamily:'Inter', fontSize:13, color:B.blue, fontWeight:500 }}>{v.util}%</span>
                  </div>
                  <div style={{ height:4, background:B.surface2, borderRadius:9999 }}>
                    <div style={{ width:`${v.util}%`, height:'100%', background:B.blue, borderRadius:9999 }}></div>
                  </div>
                </div>
              ))}
            </SoftCard>
          </div>
        )}

        {tab === 'sell' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
            {[
              { rec:'SELL',     label:'Vender ahora',  tone:'rose',  reason:'Score bajo, días en taller > 20, tendencia negativa.' },
              { rec:'EVALUATE', label:'A evaluar',     tone:'amber', reason:'Declive sostenido en utilización. Decisión en el próximo comité.' },
              { rec:'HOLD',     label:'Mantener',      tone:'green', reason:'Rinde por encima de meta. Mantener en flota.' },
            ].map(group => {
              const matches = vehicles.filter(v => v.rec === group.rec);
              return (
                <div key={group.rec}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                    <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:0 }}>{group.label}</h3>
                    <SoftBadge tone={group.tone}>{matches.length}</SoftBadge>
                  </div>
                  <p style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, margin:'0 0 14px', lineHeight:1.5 }}>{group.reason}</p>
                  {matches.map(v => (
                    <SoftCard key={v.unit} padding={20} style={{ marginBottom:10 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                        <Ring value={v.score} color={B[group.tone]} size={52} stroke={5} label={`${v.score}`} />
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:'Inter', fontSize:14, color:B.ink, fontWeight:600 }}>{v.unit}</div>
                          <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, marginTop:2 }}>{v.model}</div>
                        </div>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, marginBottom:14 }}>
                        <Mini l="util" v={`${v.util}%`} />
                        <Mini l="ingreso" v={v.revenue} />
                        <Mini l="taller" v={`${v.shop} d`} />
                      </div>
                      <PillButton tone="ghost" size="sm">Ver expediente</PillButton>
                    </SoftCard>
                  ))}
                  {matches.length === 0 && (
                    <div style={{ padding:'40px 20px', textAlign:'center', fontFamily:'Inter', fontSize:13, color:B.ink3, background:B.surface2, borderRadius:14 }}>
                      Sin vehículos en esta categoría.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Mini({ l, v }) {
  return (
    <div>
      <div style={{ fontFamily:'Inter', fontSize:10, color:B.ink3, marginBottom:3 }}>{l}</div>
      <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:500 }}>{v}</div>
    </div>
  );
}

window.MovOSAnalytics    = Analytics;
window.MovOSIntelligence = Intelligence;
})();
