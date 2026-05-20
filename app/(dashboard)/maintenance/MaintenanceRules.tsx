'use client'

import { useState } from 'react'
import { B } from '@/lib/tokens'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SectionLabel }      from '@/components/ui/SectionLabel'
import { StatusBadge }       from '@/components/ui/StatusBadge'
import { ActionButton }      from '@/components/ui/ActionButton'

// ─── Manufacturer schedule ────────────────────────────────────────────────────

interface MfrService extends Record<string, unknown> {
  id: string; vehicle: string; service: string
  intervalKm: string; lastDone: string; nextDue: string
  status: 'ok' | 'warning' | 'critical'
}

const MFR_SERVICES: MfrService[] = [
  { id: '1', vehicle: 'All Hilux',    service: '5,000 km Service',          intervalKm: '5,000',   lastDone: '45,000 km / Apr 2026', nextDue: '50,000 km / Oct 2026', status: 'warning'  },
  { id: '2', vehicle: 'All Toyota',   service: '20,000 km Major Service',   intervalKm: '20,000',  lastDone: '40,000 km / Jan 2026', nextDue: '60,000 km / Mar 2027', status: 'ok'       },
  { id: '3', vehicle: 'All Toyota',   service: '40,000 km Transmission',    intervalKm: '40,000',  lastDone: '40,000 km / Jan 2026', nextDue: '80,000 km / 2028',     status: 'ok'       },
  { id: '4', vehicle: 'All Fleet',    service: 'Annual Brake Inspection',   intervalKm: '—',       lastDone: 'Sep 2025',            nextDue: 'Sep 2026',             status: 'ok'       },
  { id: '5', vehicle: 'All Toyota',   service: 'Timing Belt Replacement',   intervalKm: '100,000', lastDone: '—',                   nextDue: '100,000 km / 2030',    status: 'ok'       },
  { id: '6', vehicle: 'All Renault',  service: 'Gearbox Fluid',             intervalKm: '60,000',  lastDone: '—',                   nextDue: '60,000 km / 2027',     status: 'ok'       },
]

const MFR_COLS: Column<MfrService>[] = [
  { key: 'vehicle',     header: 'Vehicle',   width: 120 },
  { key: 'service',     header: 'Service'             },
  { key: 'intervalKm',  header: 'Interval',  width: 85, align: 'right' },
  { key: 'lastDone',    header: 'Last Done', width: 160 },
  { key: 'nextDue',     header: 'Next Due',  width: 150 },
  { key: 'status', header: 'Status', width: 88,
    render: (v) => {
      if (v === 'critical') return <StatusBadge label="CRITICAL" color={B.rose}  small />
      if (v === 'warning')  return <StatusBadge label="WARNING"  color={B.amber} small />
      return <StatusBadge label="OK" color={B.green} small />
    }},
]

// ─── Internal rules ───────────────────────────────────────────────────────────

type RuleScope = 'fleet' | 'category' | 'location' | 'vehicle'

interface Rule {
  scope: RuleScope; name: string; trigger: string; interval: string; threshold: string
}

const RULES: Rule[] = [
  { scope: 'fleet',    name: 'Monthly Wash & Detail',       trigger: 'Every 30 days',   interval: '30 days',   threshold: '5 days'   },
  { scope: 'fleet',    name: 'Quarterly Fluid Check',       trigger: 'Every 90 days',   interval: '90 days',   threshold: '7 days'   },
  { scope: 'category', name: 'Pickup Tire Rotation',        trigger: 'Every 10,000 km', interval: '10,000 km', threshold: '500 km'   },
  { scope: 'category', name: 'Pickup Underbody Inspection', trigger: 'Every 20,000 km', interval: '20,000 km', threshold: '2,000 km' },
  { scope: 'location', name: 'Loc A Weekly Lot Check',      trigger: 'Every 7 days',    interval: '7 days',    threshold: '1 day'    },
  { scope: 'location', name: 'Loc B Quarterly Audit',       trigger: 'Every 90 days',   interval: '90 days',   threshold: '7 days'   },
  { scope: 'vehicle',  name: 'GPS Battery Replacement',     trigger: 'Every 18 months', interval: '18 months', threshold: '30 days'  },
  { scope: 'vehicle',  name: 'Roof Rack Load Test',         trigger: 'Every 12 months', interval: '12 months', threshold: '14 days'  },
]

const SCOPE_COLOR: Record<RuleScope, string> = {
  fleet:    B.amber,
  category: B.blue,
  location: B.green,
  vehicle:  B.lilac,
}

const SCOPE_ORDER: RuleScope[] = ['fleet', 'category', 'location', 'vehicle']

// ─── MaintenanceRules ─────────────────────────────────────────────────────────

export function MaintenanceRules() {
  const [layer, setLayer]       = useState<'manufacturer' | 'internal'>('manufacturer')
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <SectionLabel label="Maintenance Rules" color={B.amber} />
      </div>

      {/* Layer toggle */}
      <div style={{ display: 'flex', gap: 1, marginBottom: 16, background: B.surface3, width: 'fit-content', borderRadius: 8, overflow: 'hidden' }}>
        {(['manufacturer', 'internal'] as const).map(l => (
          <button key={l} onClick={() => setLayer(l)} style={{
            height: 36, padding: '0 20px',
            fontSize: 12, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.06em',
            color:      layer === l ? B.amber : B.ink2,
            background: layer === l ? `${B.amber}14` : B.surface,
            border:     `1px solid ${layer === l ? B.amber : B.hairline}`,
            cursor: 'pointer',
          }}>
            {l === 'manufacturer' ? 'Manufacturer Booklet' : 'Internal Rules'}
          </button>
        ))}
      </div>

      {layer === 'manufacturer' && (
        <div>
          <div style={{ border: `1px solid ${B.hairline}`, borderRadius: 10, overflow: 'hidden' }}>
            <DataTable columns={MFR_COLS} rows={MFR_SERVICES} />
          </div>
          <div style={{ marginTop: 8, fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3 }}>
            WARNING = within warning threshold · CRITICAL = overdue or past due date
          </div>
        </div>
      )}

      {layer === 'internal' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, letterSpacing: '0.04em' }}>
              VEHICLE &gt; LOCATION &gt; CATEGORY &gt; FLEET-WIDE
            </div>
            <ActionButton label="+ Add Rule" color={B.amber} onClick={() => setShowForm(f => !f)} />
          </div>

          {/* Add form (inline) */}
          {showForm && (
            <div style={{ border: `1px solid ${B.amber}54`, borderTop: `2px solid ${B.amber}`, background: `${B.amber}08`, borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-inter)', fontWeight: 600, color: B.amber, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                New Internal Rule
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                {[
                  { label: 'Rule Name',        ph: 'e.g. Monthly wash' },
                  { label: 'Scope',            ph: 'fleet / category / …' },
                  { label: 'Trigger',          ph: 'e.g. Every 30 days' },
                  { label: 'Alert Threshold',  ph: 'e.g. 5 days' },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      {f.label}
                    </div>
                    <input placeholder={f.ph} style={{
                      width: '100%', height: 32, padding: '0 10px',
                      fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink,
                      background: B.surface, border: `1px solid ${B.hairline}`,
                      borderRadius: 6, outline: 'none',
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <ActionButton label="Guardar Regla" color={B.amber} onClick={() => setShowForm(false)} />
                <ActionButton label="Cancelar"      color={B.amber} secondary onClick={() => setShowForm(false)} />
              </div>
            </div>
          )}

          {/* Rules grouped by scope */}
          {SCOPE_ORDER.map(scope => {
            const rules = RULES.filter(r => r.scope === scope)
            if (!rules.length) return null
            const color = SCOPE_COLOR[scope]
            return (
              <div key={scope} style={{ marginBottom: 14 }}>
                <div style={{ marginBottom: 8 }}>
                  <SectionLabel
                    label={`${scope.charAt(0).toUpperCase() + scope.slice(1)}-Level Rules`}
                    count={rules.length} color={color}
                  />
                </div>
                <div style={{ border: `1px solid ${B.hairline}`, borderRadius: 10, overflow: 'hidden' }}>
                  {rules.map((rule, i) => (
                    <div key={rule.name} style={{
                      display: 'grid', gridTemplateColumns: '200px 140px 100px 80px',
                      alignItems: 'center',
                      borderBottom: i < rules.length - 1 ? `1px solid ${B.hairline}` : 'none',
                      background: B.surface,
                    }}>
                      <div style={{ padding: '9px 12px', borderRight: `1px solid ${B.hairline}` }}>
                        <div style={{ fontSize: 13, fontFamily: 'var(--font-inter)', color: B.ink, marginBottom: 2 }}>{rule.name}</div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 500, color, textTransform: 'uppercase' }}>{rule.scope}</div>
                      </div>
                      <div style={{ padding: '9px 12px', borderRight: `1px solid ${B.hairline}` }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, marginBottom: 2 }}>TRIGGER</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink2 }}>{rule.trigger}</div>
                      </div>
                      <div style={{ padding: '9px 12px', borderRight: `1px solid ${B.hairline}` }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, marginBottom: 2 }}>INTERVAL</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--font-inter)', color: B.ink2 }}>{rule.interval}</div>
                      </div>
                      <div style={{ padding: '9px 12px' }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-inter)', color: B.ink3, marginBottom: 2 }}>ALERT</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--font-inter)', color: B.amber }}>{rule.threshold}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
