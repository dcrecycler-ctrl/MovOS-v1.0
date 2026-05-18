'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { KPICard }    from '@/components/ui/KPICard'
import { PageHeader } from '@/components/ui/PageHeader'
import { AppNav }     from '@/components/ui/AppNav'
import { BottomNav }  from '@/components/ui/BottomNav'
import { RepairTicketsSummary } from './RepairTicketsSummary'
import { ServiceSchedule }      from './ServiceSchedule'
import { WorkshopStatus }       from './WorkshopStatus'
import { RepairTicketList }     from './RepairTicketList'
import { MaintenanceRules }     from './MaintenanceRules'
import { CostAnalysis }         from './CostAnalysis'

const BRANCH_FILTERS = [
  { value: 'all',   label: 'All Branches' },
  { value: 'loc-a', label: 'Loc A PDE' },
  { value: 'loc-b', label: 'Loc B MVD' },
  { value: 'loc-c', label: 'Loc C CLN' },
]

export default function MaintenancePage() {
  const [branch, setBranch] = useState('all')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ds-bg)', fontFamily: FONTS.mono }}>
      <AppNav active="Mantenimiento" />

      <div className="max-w-[1440px] mx-auto px-4 pt-7 pb-20 md:px-5 md:pb-16 lg:px-9">
        <PageHeader
          title="MANTENIMIENTO"
          subtitle="Repair tickets · Service schedule · Workshop load · Cost analysis"
          filters={BRANCH_FILTERS}
          activeFilter={branch}
          onFilterChange={setBranch}
        />

        {/* ROW 1 — KPI Cards */}
        <div
          className="grid grid-cols-2 gap-px mb-5 md:grid-cols-3 lg:grid-cols-5"
          style={{ background: 'var(--ds-border)' }}
        >
          <KPICard label="Total Fleet"    value="47"   sub="8 vehicles in maintenance"  subColor={DS.orange} color={DS.gold}   />
          <KPICard label="Open Tickets"   value="8"    sub="2 critical · 3 major"       subColor={DS.red}    color={DS.red}    />
          <KPICard label="Scheduled"      value="6"    sub="Due within 30 days"         subColor={DS.yellow} color={DS.yellow} />
          <KPICard label="Workshop Load"  value="12"   sub="Vehicles at 4 shops"        subColor={DS.blue}   color={DS.blue}   />
          <KPICard label="Monthly Spend"  value="142K" sub="$UY 142,800 this month"     subColor={DS.lime}   color={DS.lime}   />
        </div>

        {/* ROW 2 — Three equal columns (horizontal scroll on tablet/mobile) */}
        <div
          className="flex gap-3.5 mb-5 items-start overflow-x-auto pb-1 lg:pb-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="flex-none w-[85vw] md:flex-1 md:w-auto md:min-w-[260px]" style={{ scrollSnapAlign: 'start' }}>
            <RepairTicketsSummary />
          </div>
          <div className="flex-none w-[85vw] md:flex-1 md:w-auto md:min-w-[260px]" style={{ scrollSnapAlign: 'start' }}>
            <ServiceSchedule />
          </div>
          <div className="flex-none w-[85vw] md:flex-1 md:w-auto md:min-w-[260px]" style={{ scrollSnapAlign: 'start' }}>
            <WorkshopStatus />
          </div>
        </div>

        {/* ROW 3 — Full width ticket list */}
        <div style={{ marginBottom: 20 }}>
          <RepairTicketList />
        </div>

        {/* ROW 4 — Rules + Cost */}
        <div className="flex flex-col gap-3.5 items-start lg:flex-row">
          <div className="w-full lg:flex-1"><MaintenanceRules /></div>
          <div className="w-full lg:flex-1"><CostAnalysis /></div>
        </div>
      </div>

      <BottomNav active="Maintenance" />
    </div>
  )
}
