// MovOS — design canvas mount. Variant C (bento) is the chosen direction.
// Now extended to ALL screens of the platform.

function MovOSApp() {
  const t = window.useTweaks(window.MOVOS_TWEAK_DEFAULTS);

  return (
    <div style={{display:'contents'}}>
      <DesignCanvas>
        {/* ── Tablero (Dashboard) ───────────────────────────── */}
        <DCSection
          id="movos-bento"
          title="Tablero · admin (home)"
          subtitle="Panel principal · KPIs, incidentes, sucursales, refacciones, contratos"
        >
          <DCArtboard id="bento" label="Tablero · bento" width={1480} height={2750}>
            <window.MovOSDashboardBento />
          </DCArtboard>
        </DCSection>

        {/* ── Operaciones / Mantenimiento / Inspecciones ───── */}
        <DCSection
          id="ops"
          title="Operaciones · mantenimiento · inspecciones"
          subtitle="Pipelines del ciclo operativo y del taller, queue de inspecciones CarCheck"
        >
          <DCArtboard id="operations" label="Operaciones · ciclos" width={1480} height={1500}>
            <window.MovOSOperations />
          </DCArtboard>
          <DCArtboard id="maintenance" label="Mantenimiento · tickets" width={1480} height={1300}>
            <window.MovOSMaintenance />
          </DCArtboard>
          <DCArtboard id="inspections" label="Inspecciones · CarCheck" width={1480} height={1400}>
            <window.MovOSInspections />
          </DCArtboard>
        </DCSection>

        {/* ── Flota / Vehículo / Contratos ─────────────────── */}
        <DCSection
          id="fleet"
          title="Flota · expediente del vehículo · contratos"
          subtitle="Lista filtrable, ficha completa por vehículo, contratos corporativos + Karve"
        >
          <DCArtboard id="fleet" label="Flota · lista con filtros" width={1480} height={1400}>
            <window.MovOSFleet />
          </DCArtboard>
          <DCArtboard id="vehicle" label="Vehículo · UY-0142" width={1480} height={1500}>
            <window.MovOSVehicleFile />
          </DCArtboard>
          <DCArtboard id="contracts" label="Contratos · largo + corto" width={1480} height={1500}>
            <window.MovOSContracts />
          </DCArtboard>
        </DCSection>

        {/* ── Analítica / Inteligencia ──────────────────────── */}
        <DCSection
          id="strategic"
          title="Analítica · inteligencia"
          subtitle="Tendencias operativas y vista estratégica de la flota"
        >
          <DCArtboard id="analytics" label="Analítica · 5 meses" width={1480} height={1700}>
            <window.MovOSAnalytics />
          </DCArtboard>
          <DCArtboard id="intelligence" label="Inteligencia · admin only" width={1480} height={1500}>
            <window.MovOSIntelligence />
          </DCArtboard>
        </DCSection>

        {/* ── Mobile CarCheck ───────────────────────────────── */}
        <DCSection
          id="mobile"
          title="CarCheck · app móvil del operador"
          subtitle="Triptych — tareas del día, inspección en curso, mapa de daños con bottom-sheet"
        >
          <DCArtboard id="mobile" label="CarCheck móvil" width={1400} height={920}>
            <window.MovOSMobile />
          </DCArtboard>
        </DCSection>

        {/* ── Estados de drill-down (modales del tablero) ──── */}
        <DCSection
          id="states"
          title="Drill-down activos sobre el tablero"
          subtitle="Estados con modales abiertos · referencia del patrón"
        >
          <DCArtboard id="bento-alert" label="Incidente · daño mayor" width={1480} height={2750}>
            <window.MovOSDashboardBento
              initialModal={{ kind:'alert', alert: window.MOVOS_CRITICAL_ALERTS[0] }}
            />
          </DCArtboard>
          <DCArtboard id="bento-contract" label="Contrato · ANCAP" width={1480} height={2750}>
            <window.MovOSDashboardBento
              initialModal={{ kind:'contract', contract: window.MOVOS_CONTRACTS[0] }}
            />
          </DCArtboard>
          <DCArtboard id="bento-branch" label="Sucursal · Montevideo" width={1480} height={2750}>
            <window.MovOSDashboardBento
              initialModal={{ kind:'branch', branch: window.MOVOS_BRANCHES[0] }}
            />
          </DCArtboard>
        </DCSection>

        {/* ── Referencia · spec-faithful dark + light ───────── */}
        <DCSection
          id="movos-spec"
          title="Referencia · spec-faithful original"
          subtitle="Versiones estrictas según design system MovOS (dark · light cool)"
        >
          <DCArtboard id="dark" label="A · DARK (spec-faithful)" width={1480} height={1640}>
            <window.MovOSDashboard
              theme="dark"
              density={t.density}
              showLeftBorders={t.showLeftBorders}
              accentKey={t.accent}
            />
          </DCArtboard>
          <DCArtboard id="light" label="B · LIGHT (cool)" width={1480} height={1640}>
            <window.MovOSDashboard
              theme="light"
              density={t.density}
              showLeftBorders={t.showLeftBorders}
              accentKey={t.accent}
            />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <window.TweaksPanel title="Tweaks · MovOS">
        <window.TweakSection title="Densidad">
          <window.TweakRadio
            label="Espaciado"
            options={[
              { value:'comfortable', label:'Normal' },
              { value:'compact',     label:'Compacto' },
            ]}
            value={t.density}
            onChange={v => t.setTweak('density', v)}
          />
        </window.TweakSection>
        <window.TweakSection title="Reglas visuales (variantes dark/light)">
          <window.TweakToggle
            label="Borde izquierdo en alertas"
            value={t.showLeftBorders}
            onChange={v => t.setTweak('showLeftBorders', v)}
          />
        </window.TweakSection>
        <window.TweakSection title="Acento global (variantes dark/light)">
          <window.TweakColor
            label="Color principal"
            options={['#C8A96E','#A8C96E','#7E9BC9','#9B7EC8']}
            value={
              t.accent === 'gold'  ? '#C8A96E' :
              t.accent === 'lime'  ? '#A8C96E' :
              t.accent === 'slate' ? '#7E9BC9' :
                                     '#9B7EC8'
            }
            onChange={hex => {
              const map = { '#C8A96E':'gold', '#A8C96E':'lime', '#7E9BC9':'slate', '#9B7EC8':'purple' };
              t.setTweak('accent', map[hex] || 'gold');
            }}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MovOSApp />);
