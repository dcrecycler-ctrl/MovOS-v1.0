'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { DataTable, Column } from '@/components/ui/DataTable'
import { StatusBadge }        from '@/components/ui/StatusBadge'
import { SectionLabel }       from '@/components/ui/SectionLabel'
import { ActionButton }       from '@/components/ui/ActionButton'

// ─── Mock data ────────────────────────────────────────────────────────────────

interface MfService extends Record<string, unknown> {
  id: string; name: string; intervalKm: string; intervalMonths: string
  contents: string; warningKm: string; dealer: string
  status: 'ok' | 'warning' | 'critical'; nextDue: string
}

const MFR_SERVICES: MfService[] = [
  {
    id: '1', name: '5,000 km Service',
    intervalKm: '5,000', intervalMonths: '6',
    contents: 'Engine oil + filter, multi-point inspection, fluid top-up',
    warningKm: '500', dealer: 'Toyota Punta del Este',
    status: 'warning', nextDue: '50,000 km / Oct 2026',
  },
  {
    id: '2', name: '20,000 km Service',
    intervalKm: '20,000', intervalMonths: '24',
    contents: 'Air filter, cabin filter, brake fluid, spark plugs, belts',
    warningKm: '2,000', dealer: 'Toyota Punta del Este',
    status: 'ok', nextDue: '60,000 km / Mar 2027',
  },
  {
    id: '3', name: '40,000 km Transmission',
    intervalKm: '40,000', intervalMonths: '48',
    contents: 'Transmission fluid flush, differential fluid, 4WD transfer case',
    warningKm: '5,000', dealer: 'Toyota Punta del Este',
    status: 'ok', nextDue: '80,000 km / 2028',
  },
  {
    id: '4', name: 'Annual Brake Inspection',
    intervalKm: '—', intervalMonths: '12',
    contents: 'Brake pad wear, rotor thickness, caliper condition, handbrake',
    warningKm: '—', dealer: 'Toyota Punta del Este',
    status: 'ok', nextDue: 'Sep 2026',
  },
  {
    id: '5', name: 'Timing Belt Replacement',
    intervalKm: '100,000', intervalMonths: '120',
    contents: 'Timing belt, tensioner, idler pulley, water pump',
    warningKm: '10,000', dealer: 'Toyota Punta del Este',
    status: 'ok', nextDue: '100,000 km / 2030',
  },
]

const MFR_COLS: Column<MfService>[] = [
  { key: 'name',           header: 'Service',      width: 200 },
  { key: 'intervalKm',     header: 'Interval km',  width: 100, align: 'right' },
  { key: 'intervalMonths', header: 'Months',       width: 70,  align: 'right' },
  { key: 'contents',       header: 'Contents' },
  { key: 'warningKm',      header: 'Warning',      width: 80,  align: 'right' },
  { key: 'dealer',         header: 'Dealer',       width: 160 },
  { key: 'status', header: 'Status', width: 90,
    render: (v) => {
      if (v === 'critical') return <StatusBadge label="CRITICAL" color={DS.red}    small />
      if (v === 'warning')  return <StatusBadge label="WARNING"  color={DS.yellow} small />
      return <StatusBadge label="OK" color={DS.green} small />
    }},
  { key: 'nextDue', header: 'Next Due', width: 150 },
]

// ─── Internal rules ───────────────────────────────────────────────────────────

interface Rule {
  scope: 'fleet' | 'category' | 'location' | 'vehicle'
  name: string; trigger: string; action: string; threshold: string
}

const RULES: Rule[] = [
  { scope: 'fleet',    name: 'Monthly Wash & Detail',       trigger: 'Every 30 days',     action: 'Schedule detail appointment',   threshold: '5 days'   },
  { scope: 'fleet',    name: 'Quarterly Fluid Top-Up',      trigger: 'Every 90 days',     action: 'Notify branch manager',         threshold: '7 days'   },
  { scope: 'category', name: 'Pickup Tire Rotation',        trigger: 'Every 10,000 km',   action: 'Alert workshop, create ticket', threshold: '500 km'   },
  { scope: 'category', name: 'Pickup Underbody Inspection', trigger: 'Every 20,000 km',   action: 'Schedule dealer visit',         threshold: '2,000 km' },
  { scope: 'location', name: 'Loc A Weekly Lot Check',      trigger: 'Every 7 days',      action: 'Notify operator on duty',       threshold: '1 day'    },
  { scope: 'vehicle',  name: 'GPS Battery Replacement',     trigger: 'Every 18 months',   action: 'Alert mechanic',                threshold: '30 days'  },
  { scope: 'vehicle',  name: 'Roof Rack Load Test',         trigger: 'Every 12 months',   action: 'Schedule inspection',           threshold: '14 days'  },
]

const SCOPE_COLOR: Record<Rule['scope'], string> = {
  fleet: DS.gold, category: DS.blue, location: DS.green, vehicle: DS.purple,
}

const SCOPE_ORDER: Rule['scope'][] = ['fleet', 'category', 'location', 'vehicle']

// ─── ServiceIntervalsTab ──────────────────────────────────────────────────────

export function ServiceIntervalsTab() {
  const [layer, setLayer]   = useState<'manufacturer' | 'internal'>('manufacturer')
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      {/* Layer toggle */}
      <div style={{ display: 'flex', gap: 1, marginBottom: 24, background: 'var(--ds-border)', width: 'fit-content' }}>
        {(['manufacturer', 'internal'] as const).map(l => (
          <button key={l} onClick={() => setLayer(l)} style={{
            height: 36, padding: '0 20px',
            fontSize: 10, fontFamily: FONTS.mono, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: layer === l ? DS.gold : 'var(--ds-dim)',
            background: layer === l ? `${DS.gold}14` : 'var(--ds-bg-1)',
            border: `1px solid ${layer === l ? DS.gold : 'var(--ds-border)'}`,
            cursor: 'pointer',
          }}>
            {l === 'manufacturer' ? 'Manufacturer Booklet' : 'Internal Rules'}
          </button>
        ))}
      </div>

      {layer === 'manufacturer' && (
        <div>
          {/* Header + add button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <SectionLabel label="Manufacturer Service Schedule" color={DS.gold} />
            <ActionButton label="+ Add Service Row" color={DS.gold} onClick={() => setShowForm(f => !f)} />
          </div>

          {/* Add form (inline) */}
          {showForm && (
            <div style={{ border: `1px solid ${DS.gold}54`, borderTop: `2px solid ${DS.gold}`, background: `${DS.gold}08`, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontFamily: FONTS.mono, color: DS.gold, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                New Service Entry — from Manufacturer Booklet
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                {[
                  { label: 'Service Name', placeholder: 'e.g. 30,000 km Major Service' },
                  { label: 'Interval km',  placeholder: 'e.g. 30000' },
                  { label: 'Interval Months', placeholder: 'e.g. 36' },
                  { label: 'Warning km',   placeholder: 'e.g. 3000' },
                  { label: 'Authorized Dealer', placeholder: 'e.g. Toyota PDE' },
                  { label: 'Last Service Odometer', placeholder: 'e.g. 30000' },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                      {f.label}
                    </div>
                    <input
                      placeholder={f.placeholder}
                      style={{
                        width: '100%', height: 32, padding: '0 10px',
                        fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-text)',
                        background: 'var(--ds-bg-1)', border: '1px solid var(--ds-border)',
                        borderRadius: 0, outline: 'none',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Service Contents</div>
                <textarea placeholder="Describe what this service includes..." style={{ width: '100%', height: 56, padding: '8px 10px', fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-text)', background: 'var(--ds-bg-1)', border: '1px solid var(--ds-border)', borderRadius: 0, outline: 'none', resize: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <ActionButton label="Save Entry"  color={DS.gold} onClick={() => setShowForm(false)} />
                <ActionButton label="Cancel"      color={DS.gold} secondary onClick={() => setShowForm(false)} />
              </div>
            </div>
          )}

          <div style={{ border: '1px solid var(--ds-border)' }}>
            <DataTable columns={MFR_COLS} rows={MFR_SERVICES} />
          </div>

          <div style={{ marginTop: 10, fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.06em' }}>
            WARNING = within warning threshold · CRITICAL = overdue or past due date
          </div>
        </div>
      )}

      {layer === 'internal' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <SectionLabel label="Internal Service Rules" color={DS.purple} />
          </div>
          <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.06em', marginBottom: 20 }}>
            RULES ARE APPLIED IN ORDER: VEHICLE &gt; LOCATION &gt; CATEGORY &gt; FLEET-WIDE
          </div>

          {SCOPE_ORDER.map(scope => {
            const rules = RULES.filter(r => r.scope === scope)
            if (!rules.length) return null
            const color = SCOPE_COLOR[scope]
            return (
              <div key={scope} style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 10 }}>
                  <SectionLabel label={`${scope.charAt(0).toUpperCase() + scope.slice(1)}-Level Rules`} color={color} count={rules.length} />
                </div>
                <div style={{ border: '1px solid var(--ds-border)' }}>
                  {rules.map((rule, i) => (
                    <div key={rule.name} style={{
                      display: 'grid', gridTemplateColumns: '220px 180px 1fr 100px',
                      alignItems: 'center', gap: 0,
                      borderBottom: i < rules.length - 1 ? '1px solid var(--ds-border)' : 'none',
                      background: 'var(--ds-bg-1)',
                    }}>
                      <div style={{ padding: '10px 14px', borderRight: '1px solid var(--ds-border)' }}>
                        <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-text)', marginBottom: 2 }}>{rule.name}</div>
                        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{rule.scope}</div>
                      </div>
                      <div style={{ padding: '10px 14px', borderRight: '1px solid var(--ds-border)', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>
                        <span style={{ color: 'var(--ds-muted)', fontSize: 9, display: 'block', marginBottom: 2 }}>TRIGGER</span>
                        {rule.trigger}
                      </div>
                      <div style={{ padding: '10px 14px', borderRight: '1px solid var(--ds-border)', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>
                        <span style={{ color: 'var(--ds-muted)', fontSize: 9, display: 'block', marginBottom: 2 }}>ACTION</span>
                        {rule.action}
                      </div>
                      <div style={{ padding: '10px 14px', fontSize: 10, fontFamily: FONTS.mono, color: DS.yellow }}>
                        <span style={{ color: 'var(--ds-muted)', fontSize: 9, display: 'block', marginBottom: 2 }}>ALERT</span>
                        {rule.threshold}
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
