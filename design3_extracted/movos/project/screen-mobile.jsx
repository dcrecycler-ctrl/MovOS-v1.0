// MovOS · Mobile (CarCheck) — phone frame with 3 representative screens
// 1. Tareas (operator home) · 2. CarCheck inspection · 3. Mapa de daños

const { useState: useStateMob } = React;

(function() {
const { B, SoftBadge, PillButton, Dot, SourceIcon } = window.MovOSBento;

// ─── Phone frame ────────────────────────────────────────────
function PhoneFrame({ children, title }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
      <div style={{
        width:393, height:820,
        background:'#0E1726', borderRadius:48,
        padding:11, boxShadow:'0 2px 4px rgba(14,23,38,0.08), 0 30px 80px rgba(14,23,38,0.18)',
        position:'relative',
      }}>
        {/* Notch */}
        <div style={{
          position:'absolute', top:24, left:'50%', transform:'translateX(-50%)',
          width:115, height:30, background:'#0E1726', borderRadius:9999, zIndex:3,
          display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:10,
        }}>
          <div style={{ width:8, height:8, borderRadius:9999, background:'#2A3445' }}></div>
        </div>
        <div style={{
          width:'100%', height:'100%', borderRadius:38, overflow:'hidden',
          background:B.bg, position:'relative',
          display:'flex', flexDirection:'column',
        }}>
          {/* Status bar */}
          <div style={{
            height:48, padding:'12px 28px 0', display:'flex',
            justifyContent:'space-between', alignItems:'flex-start',
            fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:600,
          }}>
            <span>9:42</span>
            <span style={{ display:'flex', gap:5, alignItems:'center' }}>
              <Signal /><Wifi /><Battery />
            </span>
          </div>
          {children}
        </div>
      </div>
      {title && <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink2, fontWeight:500 }}>{title}</div>}
    </div>
  );
}

function Signal() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11"><g fill={B.ink}>
      <rect x="0" y="7" width="3" height="4" rx="0.5"/>
      <rect x="4" y="5" width="3" height="6" rx="0.5"/>
      <rect x="8" y="3" width="3" height="8" rx="0.5"/>
      <rect x="12" y="0" width="3" height="11" rx="0.5"/>
    </g></svg>
  );
}
function Wifi() {
  return <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke={B.ink} strokeWidth="1.2" strokeLinecap="round"><path d="M1 4 a10 10 0 0 1 14 0"/><path d="M3.5 6.5 a6 6 0 0 1 9 0"/><path d="M6 9 a3 3 0 0 1 4 0"/><circle cx="8" cy="11" r="0.7" fill={B.ink}/></svg>;
}
function Battery() {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12">
      <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke={B.ink} strokeWidth="1" opacity="0.4"/>
      <rect x="2" y="2" width="14" height="8" rx="1.5" fill={B.ink}/>
      <rect x="23" y="4" width="2" height="4" rx="1" fill={B.ink} opacity="0.4"/>
    </svg>
  );
}

// ─── Bottom nav ─────────────────────────────────────────────
function BottomNav({ active='tareas' }) {
  const items = [
    { id:'tareas',     l:'Tareas',    icon: <NavIcon kind="tasks" /> },
    { id:'flota',      l:'Flota',     icon: <NavIcon kind="fleet" /> },
    { id:'inspect',    l:'Inspeccionar', icon: <NavIcon kind="scan" /> },
    { id:'mant',       l:'Mantener',  icon: <NavIcon kind="wrench" /> },
    { id:'alertas',    l:'Alertas',   icon: <NavIcon kind="bell" /> },
  ];
  return (
    <div style={{
      borderTop:`1px solid ${B.hairline}`, background:B.surface,
      padding:'10px 12px 26px', display:'flex', justifyContent:'space-around',
    }}>
      {items.map(it => {
        const a = it.id === active;
        return (
          <div key={it.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, minWidth:60, opacity: a?1:0.5 }}>
            <div style={{ color: a ? B.ink : B.ink3, display:'flex', padding:6 }}>{it.icon}</div>
            <span style={{ fontFamily:'Inter', fontSize:10, color: a ? B.ink : B.ink3, fontWeight: a?600:500 }}>{it.l}</span>
          </div>
        );
      })}
    </div>
  );
}

function NavIcon({ kind, size=22 }) {
  const p = { width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.7, strokeLinecap:'round', strokeLinejoin:'round' };
  switch(kind) {
    case 'tasks':  return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 10h8M8 14h5"/></svg>;
    case 'fleet':  return <svg {...p}><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>;
    case 'scan':   return <svg {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 11h18"/><path d="M9 4h6"/></svg>;
    case 'wrench': return <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></svg>;
    case 'bell':   return <svg {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
    default: return null;
  }
}

// ─── Tareas (home) screen ────────────────────────────────────
function TareasScreen() {
  const tasks = window.MOVOS_MOBILE_TASKS;
  const pending = tasks.filter(t => t.status === 'PENDIENTE');
  const done = tasks.filter(t => t.status === 'COMPLETA');
  return (
    <>
      <div style={{ flex:1, overflowY:'hidden', padding:'8px 20px 16px' }}>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink3, fontWeight:500, marginBottom:4 }}>Lun 17 may · 09:42</div>
          <h1 style={{ fontFamily:'Inter', fontSize:24, fontWeight:600, color:B.ink, letterSpacing:'-0.02em', margin:0 }}>Hola, Luis.</h1>
          <p style={{ fontFamily:'Inter', fontSize:13, color:B.ink2, margin:'4px 0 0' }}>Tenés <strong>{pending.length} tareas pendientes</strong> en Montevideo.</p>
        </div>

        {/* Quick stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:20 }}>
          {[
            { l:'Hoy',   v:pending.length, tone:'blue' },
            { l:'Urgentes', v:pending.filter(p=>p.urgency==='high').length, tone:'rose' },
            { l:'Listas', v:done.length, tone:'green' },
          ].map(s => (
            <div key={s.l} style={{ background:B.surface, borderRadius:14, padding:'14px 12px', boxShadow:B.shadowSm }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:6 }}>
                <Dot tone={s.tone} size={5} />
                <span style={{ fontFamily:'Inter', fontSize:10, color:B.ink3, fontWeight:500 }}>{s.l}</span>
              </div>
              <div style={{ fontFamily:'Inter', fontSize:22, fontWeight:600, color:B.ink, letterSpacing:'-0.02em' }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Scan CTA */}
        <div style={{ background:B.ink, borderRadius:16, padding:'18px 18px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:B.shadowMd }}>
          <div>
            <div style={{ fontFamily:'Inter', fontSize:13, color:'rgba(255,255,255,0.7)', fontWeight:500 }}>Acción rápida</div>
            <div style={{ fontFamily:'Inter', fontSize:16, color:'#FFF', fontWeight:600, letterSpacing:'-0.01em', marginTop:4 }}>Escanear QR del vehículo →</div>
          </div>
          <div style={{ width:44, height:44, borderRadius:14, background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFF' }}>
            <NavIcon kind="scan" size={22} />
          </div>
        </div>

        {/* Pending tasks */}
        <h3 style={{ fontFamily:'Inter', fontSize:14, fontWeight:600, color:B.ink, margin:'0 0 10px' }}>Pendientes</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {pending.map(t => (
            <div key={t.id} style={{ background:B.surface, borderRadius:14, padding:'14px 16px', boxShadow:B.shadowSm, display:'flex', alignItems:'center', gap:14 }}>
              <div style={{
                width:44, height:44, borderRadius:12,
                background: t.urgency === 'high' ? B.roseSoft : B.blueSoft,
                color: t.urgency === 'high' ? B.rose : B.blue,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>
                <TaskIcon kind={t.kind} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                  <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, fontWeight:500, textTransform:'lowercase' }}>{t.kind.toLowerCase()}</span>
                  <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3 }}>· {t.time}</span>
                </div>
                <div style={{ fontFamily:'Inter', fontSize:14, color:B.ink, fontWeight:600 }}>{t.unit}</div>
                {t.client && <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink2, marginTop:2 }}>{t.client}</div>}
              </div>
              <div style={{ color:B.ink3 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="tareas" />
    </>
  );
}

function TaskIcon({ kind }) {
  const p = { width:20, height:20, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.7, strokeLinecap:'round', strokeLinejoin:'round' };
  switch(kind) {
    case 'ENTREGA':   return <svg {...p}><path d="M5 12V7a5 5 0 0 1 10 0v5"/><rect x="3" y="12" width="14" height="9" rx="1"/></svg>;
    case 'RETORNO':   return <svg {...p}><path d="m9 14-4-4 4-4"/><path d="M5 10h11a5 5 0 0 1 5 5v0"/></svg>;
    case 'LIMPIEZA':  return <svg {...p}><path d="M3 3h2M7 3h2M3 8h6M3 13h6M14 3v18M14 8h4M14 13h4M14 18h4"/></svg>;
    case 'INSPECCIÓN':return <svg {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
    default: return null;
  }
}

// ─── CarCheck inspection screen ─────────────────────────────
function CarCheckScreen() {
  return (
    <>
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {/* Header */}
        <div style={{ padding:'4px 20px 16px', borderBottom:`1px solid ${B.hairline}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <button style={{ width:30, height:30, borderRadius:9999, background:B.surface, border:'none', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:B.shadowSm, color:B.ink2 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <SoftBadge tone="blue" size={11}>pre-entrega</SoftBadge>
            <span style={{ fontFamily:'Inter', fontSize:11, color:B.ink3 }}>I-9210</span>
          </div>
          <h1 style={{ fontFamily:'Inter', fontSize:20, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.02em' }}>UY-0445 · BMW 320i</h1>
          <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, marginTop:4 }}>SPO 1986 · Montevideo Centro</div>
          {/* Step progress */}
          <div style={{ display:'flex', gap:5, marginTop:14 }}>
            {['Odómetro','Checklist','Daños','Fotos','Firma'].map((s, i) => (
              <div key={s} style={{ flex:1 }}>
                <div style={{ height:4, borderRadius:9999, background: i < 3 ? B.green : i === 3 ? B.blue : B.surface2 }}></div>
                <div style={{ fontFamily:'Inter', fontSize:9, color: i === 3 ? B.ink : B.ink3, fontWeight: i === 3 ? 600 : 400, marginTop:4 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Body — Step 4 Fotos */}
        <div style={{ flex:1, overflow:'hidden', padding:'18px 20px' }}>
          <h2 style={{ fontFamily:'Inter', fontSize:16, fontWeight:600, color:B.ink, margin:'0 0 4px' }}>Fotos · paso 4 de 5</h2>
          <p style={{ fontFamily:'Inter', fontSize:12, color:B.ink2, margin:'0 0 16px', lineHeight:1.5 }}>
            Capturá 4 ángulos · mínimo 1 requerida para guardar.
          </p>

          {/* Odo + Combustible mini summary */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
            <div style={{ background:B.surface, borderRadius:12, padding:'12px 14px', boxShadow:B.shadowSm }}>
              <div style={{ fontFamily:'Inter', fontSize:10, color:B.ink3, fontWeight:500, marginBottom:4 }}>Odómetro</div>
              <div style={{ fontFamily:'Inter', fontSize:18, color:B.ink, fontWeight:600, letterSpacing:'-0.02em' }}>4 821 <span style={{ fontSize:11, color:B.ink3, fontWeight:500 }}>km</span></div>
            </div>
            <div style={{ background:B.surface, borderRadius:12, padding:'12px 14px', boxShadow:B.shadowSm }}>
              <div style={{ fontFamily:'Inter', fontSize:10, color:B.ink3, fontWeight:500, marginBottom:6 }}>Combustible</div>
              <div style={{ display:'flex', gap:2, height:8 }}>
                {[1,1,1,1,1,1,0,0].map((on,i) => (
                  <div key={i} style={{ flex:1, background: on ? B.amber : B.surface2, borderRadius:2 }}></div>
                ))}
              </div>
              <div style={{ fontFamily:'Inter', fontSize:10, color:B.ink3, marginTop:4 }}>6/8 · 3/4 de tanque</div>
            </div>
          </div>

          {/* Photo grid */}
          <h3 style={{ fontFamily:'Inter', fontSize:13, fontWeight:600, color:B.ink, margin:'0 0 8px' }}>Fotos del vehículo</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8, marginBottom:14 }}>
            {[
              { taken:true, label:'Frente' },
              { taken:true, label:'Atrás' },
              { taken:false, label:'Lat. izq.' },
              { taken:false, label:'Lat. der.' },
            ].map(p => (
              <div key={p.label} style={{
                aspectRatio:'1/1.1', borderRadius:10,
                background: p.taken ? B.surface : B.surface2,
                border: p.taken ? 'none' : `1.5px dashed ${B.ink4}`,
                boxShadow: p.taken ? B.shadowSm : 'none',
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4,
                color: p.taken ? B.green : B.ink3,
              }}>
                {p.taken ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/></svg>
                )}
                <span style={{ fontFamily:'Inter', fontSize:9, color: p.taken ? B.ink2 : B.ink3, fontWeight:500 }}>{p.label}</span>
              </div>
            ))}
          </div>

          {/* Damage map mini */}
          <div style={{ background:B.surface, borderRadius:14, padding:14, boxShadow:B.shadowSm, marginBottom:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <span style={{ fontFamily:'Inter', fontSize:12, color:B.ink2, fontWeight:500 }}>Daños registrados</span>
              <SoftBadge tone="green" size={10}>sin daños</SoftBadge>
            </div>
            <CarTopDown small />
          </div>

          {/* CTA */}
          <PillButton tone="primary">Continuar a firma →</PillButton>
        </div>
      </div>
      <BottomNav active="inspect" />
    </>
  );
}

// ─── Damage map screen (with bottom sheet) ──────────────────
function DamageMapScreen() {
  return (
    <>
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', position:'relative' }}>
        <div style={{ padding:'4px 20px 14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <button style={{ width:30, height:30, borderRadius:9999, background:B.surface, border:'none', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:B.shadowSm, color:B.ink2 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <SoftBadge tone="blue" size={11}>post-retorno</SoftBadge>
          </div>
          <h1 style={{ fontFamily:'Inter', fontSize:20, fontWeight:600, color:B.ink, margin:0, letterSpacing:'-0.02em' }}>Mapa de daños</h1>
          <div style={{ fontFamily:'Inter', fontSize:12, color:B.ink3, marginTop:4 }}>UY-0142 · Tocá la zona con daño</div>
          {/* Tab strip */}
          <div style={{ display:'flex', gap:6, marginTop:14 }}>
            {['Diagrama','Daños (1)','Fotos'].map((t, i) => (
              <div key={t} style={{
                padding:'8px 14px', fontFamily:'Inter', fontSize:12,
                borderRadius:9999, background: i===0 ? B.ink : 'transparent',
                color: i===0 ? '#FFF' : B.ink2, fontWeight:500,
                border: i===0 ? 'none' : `1px solid ${B.hairline}`,
              }}>{t}</div>
            ))}
          </div>
        </div>
        <div style={{ flex:1, padding:'20px 20px 0', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
          <CarTopDown damaged />
        </div>
        {/* Bottom sheet: damage entry */}
        <div style={{
          background:B.surface, borderRadius:'24px 24px 0 0',
          padding:'18px 20px 16px',
          boxShadow:'0 -8px 24px rgba(14,23,38,0.10)',
          borderTop:`1px solid ${B.hairline}`,
        }}>
          <div style={{ width:40, height:4, background:B.ink4, borderRadius:9999, margin:'0 auto 14px' }}></div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div>
              <div style={{ fontFamily:'Inter', fontSize:13, color:B.ink, fontWeight:600 }}>Defensa frontal</div>
              <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink3, marginTop:2 }}>Zona FR-01 · seleccionada</div>
            </div>
            <SoftBadge tone="rose" size={10}>nuevo</SoftBadge>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink2, fontWeight:500, marginBottom:6 }}>Tipo de daño</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {['Golpe','Rayón','Abolladura','Rotura'].map((d,i) => (
                <SoftBadge key={d} tone={i===0?'rose':'neutral'} size={11}>{d}</SoftBadge>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontFamily:'Inter', fontSize:11, color:B.ink2, fontWeight:500, marginBottom:6 }}>Severidad</div>
            <div style={{ display:'flex', gap:6 }}>
              {['Leve','Medio','Mayor'].map((s,i) => (
                <div key={s} style={{
                  flex:1, padding:'9px 0', textAlign:'center',
                  borderRadius:9999, fontFamily:'Inter', fontSize:12, fontWeight:500,
                  background: i===2 ? B.roseSoft : B.surface2,
                  color: i===2 ? B.rose : B.ink2,
                  border: i===2 ? `1px solid ${B.rose}55` : 'none',
                }}>{s}</div>
              ))}
            </div>
          </div>
          {/* Auto-action warning */}
          <div style={{ background:B.amberSoft, borderRadius:12, padding:'12px 14px', marginBottom:14 }}>
            <div style={{ fontFamily:'Inter', fontSize:11, color:B.amber, fontWeight:600, marginBottom:4 }}>⚠ Daño mayor · acción automática</div>
            <p style={{ fontFamily:'Inter', fontSize:11, color:B.ink2, lineHeight:1.5, margin:0 }}>Al guardar: vehículo a Fuera de servicio, ticket de reparación y alerta a gerente.</p>
          </div>
          <PillButton tone="primary">Guardar daño →</PillButton>
        </div>
      </div>
    </>
  );
}

// ─── Top-down car SVG ───────────────────────────────────────
function CarTopDown({ small, damaged }) {
  const w = small ? 260 : 320;
  const h = small ? 130 : 480;
  return (
    <svg width={w} height={h} viewBox="0 0 200 380">
      {/* Body */}
      <path d="M50 30 Q60 10 100 10 Q140 10 150 30 L155 80 L155 280 Q155 340 100 360 Q45 340 45 280 L45 80 Z" fill={B.surface2} stroke={B.ink4} strokeWidth="1.5"/>
      {/* Windshield */}
      <path d="M60 40 Q65 30 100 30 Q135 30 140 40 L138 80 L62 80 Z" fill={B.surface3} stroke={B.ink4} strokeWidth="1"/>
      {/* Rear window */}
      <path d="M65 280 L135 280 L138 320 Q120 340 100 342 Q80 340 62 320 Z" fill={B.surface3} stroke={B.ink4} strokeWidth="1"/>
      {/* Roof */}
      <rect x="62" y="80" width="76" height="200" fill={B.surface3} stroke={B.ink4} strokeWidth="1"/>
      {/* Side mirrors */}
      <ellipse cx="42" cy="90" rx="6" ry="4" fill={B.surface2} stroke={B.ink4} strokeWidth="1"/>
      <ellipse cx="158" cy="90" rx="6" ry="4" fill={B.surface2} stroke={B.ink4} strokeWidth="1"/>
      {/* Headlights */}
      <ellipse cx="65" cy="22" rx="6" ry="4" fill={B.surface} stroke={B.ink4} strokeWidth="1"/>
      <ellipse cx="135" cy="22" rx="6" ry="4" fill={B.surface} stroke={B.ink4} strokeWidth="1"/>
      {/* Damage marker */}
      {damaged && (
        <>
          <circle cx="100" cy="20" r="20" fill={B.rose} opacity="0.18"/>
          <circle cx="100" cy="20" r="12" fill={B.rose} stroke={B.surface} strokeWidth="2"/>
          <text x="100" y="24" textAnchor="middle" fontFamily="Inter" fontSize="12" fontWeight="700" fill="#FFF">!</text>
        </>
      )}
      {/* Compass labels */}
      {!small && (
        <>
          <text x="100" y="-3" textAnchor="middle" fontFamily="Inter" fontSize="8" fill={B.ink3}>FRENTE</text>
          <text x="100" y="378" textAnchor="middle" fontFamily="Inter" fontSize="8" fill={B.ink3}>TRASERA</text>
          <text x="20" y="185" textAnchor="middle" fontFamily="Inter" fontSize="8" fill={B.ink3} transform="rotate(-90 20 185)">IZQ</text>
          <text x="180" y="185" textAnchor="middle" fontFamily="Inter" fontSize="8" fill={B.ink3} transform="rotate(90 180 185)">DER</text>
        </>
      )}
    </svg>
  );
}

// ─── Public: Mobile triptych ─────────────────────────────────
function MobileTriptych() {
  return (
    <div style={{
      width:'100%', height:'100%', background:B.bg, overflow:'hidden',
      fontFamily:'Inter, sans-serif', padding:'40px',
      display:'flex', justifyContent:'center', alignItems:'flex-start', gap:36,
    }}>
      <PhoneFrame title="Tareas del día (home)"><TareasScreen /></PhoneFrame>
      <PhoneFrame title="CarCheck · inspección"><CarCheckScreen /></PhoneFrame>
      <PhoneFrame title="Mapa de daños · daño nuevo"><DamageMapScreen /></PhoneFrame>
    </div>
  );
}

window.MovOSMobile = MobileTriptych;
})();
