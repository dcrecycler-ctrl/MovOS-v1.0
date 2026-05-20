'use client'

import { CSSProperties, useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { MockVehicle, MockDocument } from './mock-data'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysRemaining(expiry: string): number {
  return Math.floor((new Date(expiry).getTime() - Date.now()) / 86_400_000)
}

function expiryColor(days: number): string {
  if (days < 0)  return DS.red
  if (days <= 30) return DS.yellow
  return DS.green
}

// ─── Primitive components ─────────────────────────────────────────────────────

function SectionBlock({ label, color = DS.gold, children }: {
  label: string; color?: string; children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 14 }}>
        <SectionLabel label={label} color={color} />
      </div>
      {children}
    </div>
  )
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1px 0', background: 'var(--ds-border)' }}>
      {children}
    </div>
  )
}

function FieldRow({ label, value, accent }: { label: string; value?: string | number; accent?: string }) {
  return (
    <>
      <div style={{
        padding: '9px 14px', background: 'var(--ds-bg-1)',
        fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        display: 'flex', alignItems: 'center',
      }}>
        {label}
      </div>
      <div style={{
        padding: '9px 14px', background: 'var(--ds-bg-1)',
        fontSize: 11, fontFamily: FONTS.mono,
        color: accent ?? 'var(--ds-text)',
        display: 'flex', alignItems: 'center',
      }}>
        {value ?? <span style={{ color: 'var(--ds-faint)' }}>—</span>}
      </div>
    </>
  )
}

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      role="switch"
      aria-checked={on}
      style={{
        width: 38, height: 20, cursor: 'pointer',
        background: on ? DS.gold : 'var(--ds-bg-3)',
        border: `1px solid ${on ? DS.gold : 'var(--ds-border)'}`,
        borderRadius: 0,
        display: 'flex', alignItems: 'center', padding: '0 3px',
        transition: 'background 0.15s, border-color 0.15s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 12, height: 12,
        background: on ? 'var(--ds-bg)' : 'var(--ds-muted)',
        transition: 'transform 0.15s',
        transform: on ? 'translateX(18px)' : 'translateX(0)',
        flexShrink: 0,
      }} />
    </div>
  )
}

function EquipmentRow({
  label, on, onChange, children,
}: {
  label: string; on: boolean; onChange: () => void; children?: React.ReactNode
}) {
  return (
    <div style={{ border: '1px solid var(--ds-border)', marginBottom: 1 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', background: on ? `${DS.gold}0A` : 'var(--ds-bg-1)',
      }}>
        <span style={{ fontSize: 10, fontFamily: FONTS.mono, color: on ? DS.gold : 'var(--ds-dim)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <ToggleSwitch on={on} onChange={onChange} />
      </div>
      {on && children && (
        <div style={{ borderTop: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

function ExtraFields({ fields }: { fields: { label: string; value: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1px 0', background: 'var(--ds-border)' }}>
      {fields.map(f => (
        <FieldRow key={f.label} label={f.label} value={f.value} />
      ))}
    </div>
  )
}

// ─── ProfileTab ───────────────────────────────────────────────────────────────

export function ProfileTab({ vehicle, documents }: { vehicle: MockVehicle; documents: MockDocument[] }) {
  const [eq, setEq] = useState({
    gps:            vehicle.hasGps,
    dashcam:        vehicle.hasDashcam,
    tollTag:        vehicle.hasTollTag,
    towHook:        vehicle.hasTowHook,
    isofix:         vehicle.hasIsofix,
    wheelchairLift: vehicle.hasWheelchairLift,
    roofRack:       vehicle.hasRoofRack,
    refrigeration:  vehicle.hasRefrigeration,
    workVan:        vehicle.hasWorkVan,
  })

  function toggle(key: keyof typeof eq) {
    setEq(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div style={{ maxWidth: 860 }}>

      {/* ── Identity ── */}
      <SectionBlock label="Identificación" color={DS.gold}>
        <FieldGrid>
          <FieldRow label="ID Unidad"          value={vehicle.unitId}      accent={DS.gold} />
          <FieldRow label="VIN"                value={vehicle.vin} />
          <FieldRow label="Patente"            value={vehicle.plate} />
          <FieldRow label="Marca"              value={vehicle.make} />
          <FieldRow label="Modelo"             value={vehicle.model} />
          <FieldRow label="Año"                value={vehicle.year} />
          <FieldRow label="Color"              value={vehicle.color} />
          <FieldRow label="Categoría"          value={vehicle.category} />
          <FieldRow label="Sucursal"           value={vehicle.locationName} />
          <FieldRow label="Fecha de Adquisición" value={new Date(vehicle.acquisitionDate).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: 'numeric' })} />
          <FieldRow label="Costo de Adquisición" value={`USD ${vehicle.acquisitionCost.toLocaleString()}`} />
          <FieldRow label="Odómetro"           value={`${vehicle.odometer.toLocaleString()} km`} />
        </FieldGrid>
      </SectionBlock>

      {/* ── Mechanical ── */}
      <SectionBlock label="Mecánica" color={DS.blue}>
        <FieldGrid>
          <FieldRow label="Tipo de Motor"    value={vehicle.engineType} />
          <FieldRow label="Cilindrada"       value={vehicle.displacement} />
          <FieldRow label="Transmisión"      value={vehicle.transmission} />
          <FieldRow label="Tracción"         value={vehicle.driveType} />
          <FieldRow label="Combustible"      value={vehicle.fuelType} />
          <FieldRow label="Cap. Tanque"      value={`${vehicle.tankCapacity} L`} />
          <FieldRow label="Neumáticos"       value={vehicle.tireSize} />
          <FieldRow label="Pasajeros"        value={`${vehicle.seatingCapacity} asientos`} />
          <FieldRow label="Vol. Carga"       value={vehicle.cargoVolume} />
          <FieldRow label="Cap. Remolque"    value={vehicle.towRating} />
        </FieldGrid>
      </SectionBlock>

      {/* ── Special Equipment ── */}
      <SectionBlock label="Equipamiento Especial" color={DS.purple}>
        <div style={{ fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', letterSpacing: '0.06em', marginBottom: 10 }}>
          ACTIVAR PARA HABILITAR — DESBLOQUEA INTERVALOS VINCULADOS
        </div>

        <EquipmentRow label="GPS" on={eq.gps} onChange={() => toggle('gps')}>
          <ExtraFields fields={[
            { label: 'Proveedor',      value: vehicle.gpsProvider },
            { label: 'ID Dispositivo', value: vehicle.gpsDeviceId },
          ]} />
        </EquipmentRow>

        <EquipmentRow label="Cámara de a Bordo" on={eq.dashcam} onChange={() => toggle('dashcam')}>
          <ExtraFields fields={[
            { label: 'Canales',        value: vehicle.dashcamChannels },
            { label: 'Almacenamiento', value: vehicle.dashcamStorage  },
          ]} />
        </EquipmentRow>

        <EquipmentRow label="Tag de Peaje" on={eq.tollTag} onChange={() => toggle('tollTag')}>
          <ExtraFields fields={[{ label: 'ID Tag', value: 'Sin configurar' }]} />
        </EquipmentRow>

        <EquipmentRow label="Gancho de Arrastre" on={eq.towHook} onChange={() => toggle('towHook')}>
          <ExtraFields fields={[{ label: 'Capacidad', value: vehicle.towHookCapacity }]} />
        </EquipmentRow>

        <EquipmentRow label="Anclajes ISOFIX" on={eq.isofix} onChange={() => toggle('isofix')}>
          <ExtraFields fields={[{ label: 'Posiciones', value: 'Fila trasera — 2 puntos' }]} />
        </EquipmentRow>

        <EquipmentRow label="Rampa Silla de Ruedas" on={eq.wheelchairLift} onChange={() => toggle('wheelchairLift')}>
          <ExtraFields fields={[
            { label: 'Capacidad', value: 'Sin configurar' },
            { label: 'Marca',     value: 'Sin configurar' },
          ]} />
        </EquipmentRow>

        <EquipmentRow label="Portaequipajes" on={eq.roofRack} onChange={() => toggle('roofRack')}>
          <ExtraFields fields={[{ label: 'Carga Máx.', value: vehicle.roofRackLoad }]} />
        </EquipmentRow>

        <EquipmentRow label="Unidad de Refrigeración" on={eq.refrigeration} onChange={() => toggle('refrigeration')}>
          <ExtraFields fields={[
            { label: 'Rango Temp.', value: 'Sin configurar' },
            { label: 'Marca',       value: 'Sin configurar' },
          ]} />
        </EquipmentRow>

        <EquipmentRow label="Acond. Furgón" on={eq.workVan} onChange={() => toggle('workVan')}>
          <ExtraFields fields={[
            { label: 'Tipo de Acond.',       value: 'Sin configurar' },
            { label: 'Fecha de Instalación', value: 'Sin configurar' },
          ]} />
        </EquipmentRow>
      </SectionBlock>

      {/* ── Documentos ── */}
      <SectionBlock label="Documentos" color={DS.green}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--ds-border)' }}>
          {documents.map(doc => {
            const days = daysRemaining(doc.expiry)
            const color = expiryColor(days)
            return (
              <div key={doc.type} style={{
                display: 'grid', gridTemplateColumns: '200px 1fr auto auto',
                alignItems: 'center', gap: '0 0',
                background: 'var(--ds-bg-1)',
              }}>
                <div style={{ padding: '10px 14px', fontSize: 9, fontFamily: FONTS.mono, color: 'var(--ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {doc.type}
                </div>
                <div style={{ padding: '10px 14px', fontSize: 11, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>
                  {doc.issuer}
                </div>
                <div style={{ padding: '10px 14px', fontSize: 10, fontFamily: FONTS.mono, color: 'var(--ds-dim)' }}>
                  Exp: {new Date(doc.expiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <div style={{ padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 9, fontFamily: FONTS.mono, letterSpacing: '0.06em',
                    color, border: `1px solid ${color}54`, background: `${color}1C`,
                    padding: '2px 7px',
                  }}>
                    {days < 0 ? `VENCIDO hace ${Math.abs(days)}d` : `${days}d restantes`}
                  </span>
                  <a href={doc.fileUrl} style={{ fontSize: 9, fontFamily: FONTS.mono, color: DS.blue, letterSpacing: '0.06em', textDecoration: 'none' }}>
                    VER ↗
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </SectionBlock>

      {/* ── Last Service ── */}
      <SectionBlock label="Último Servicio" color={DS.orange}>
        <FieldGrid>
          <FieldRow label="Tipo de Servicio" value={vehicle.lastServiceType} />
          <FieldRow label="Fecha"            value={new Date(vehicle.lastServiceDate).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: 'numeric' })} />
          <FieldRow label="Odómetro"         value={`${vehicle.lastServiceOdometer.toLocaleString()} km`} />
          <FieldRow label="Concesionario"    value={vehicle.lastServiceDealer} />
          <FieldRow label="Ref. Sello"       value={vehicle.lastServiceStamp} />
          <FieldRow label="Documento"        value="service-record-apr2026.pdf" accent={DS.blue} />
        </FieldGrid>
      </SectionBlock>

      {/* ── Odometer & Fuel ── */}
      <SectionBlock label="Odómetro y Combustible" color={DS.slate}>
        <FieldGrid>
          <FieldRow label="Odómetro Actual"    value={`${vehicle.odometer.toLocaleString()} km`} accent={DS.gold} />
          <FieldRow label="Odómetro de Ingreso" value={`${vehicle.odometerAtEntry.toLocaleString()} km`} />
          <FieldRow label="km en Flota"         value={`${(vehicle.odometer - vehicle.odometerAtEntry).toLocaleString()} km`} />
          <FieldRow label="Último Nivel Comb."  value={`${vehicle.fuelLevel}%`} accent={vehicle.fuelLevel > 50 ? DS.green : vehicle.fuelLevel > 25 ? DS.yellow : DS.red} />
        </FieldGrid>
      </SectionBlock>

    </div>
  )
}
