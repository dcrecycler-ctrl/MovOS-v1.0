'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { KPICard }    from '@/components/ui/KPICard'
import { PageHeader } from '@/components/ui/PageHeader'
import { AppNav }     from '@/components/ui/AppNav'
import { BottomNav }  from '@/components/ui/BottomNav'
import { InspectionQueue } from './InspectionQueue'
import { TodaySummary }    from './TodaySummary'
import { BeforeAfterRow }  from './BeforeAfterRow'
import { DamageRecords }   from './DamageRecords'

const BRANCH_FILTERS = [
  { value: 'all',   label: 'All Branches' },
  { value: 'loc-a', label: 'Loc A PDE' },
  { value: 'loc-b', label: 'Loc B MVD' },
  { value: 'loc-c', label: 'Loc C CLN' },
]

export default function InspectionsPage() {
  const [branch, setBranch] = useState('all')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ds-bg)', fontFamily: FONTS.mono }}>
      <AppNav active="Inspecciones" />

      <div className="max-w-[1440px] mx-auto px-4 pt-7 pb-20 md:px-5 md:pb-16 lg:px-9">
        <PageHeader
          title="INSPECCIONES"
          subtitle="Inspection queue · Damage tracking · Before / after"
          filters={BRANCH_FILTERS}
          activeFilter={branch}
          onFilterChange={setBranch}
        />

        {/* ROW 1 — KPI Cards */}
        <div
          className="grid grid-cols-2 gap-px mb-5 md:grid-cols-3 lg:grid-cols-5"
          style={{ background: 'var(--ds-border)' }}
        >
          <KPICard label="Total Fleet"    value="47"   sub="14 vehicles due for inspection" subColor={DS.orange} color={DS.gold}  />
          <KPICard label="Available"      value="18"   sub="Ready to rent now"              subColor={DS.green}  color={DS.green} />
          <KPICard label="Assigned"       value="21"   sub="Currently on rent"              subColor={DS.blue}   color={DS.blue}  />
          <KPICard label="Utilization"    value="45%"  sub="Assigned ÷ total fleet"         subColor={DS.gold}   color={DS.gold}  />
          <KPICard label="Out of Service" value="8"    sub="3 maint · 5 inspection"         subColor={DS.red}    color={DS.red}   />
        </div>

        {/* ROW 2 — Queue (60%) + Summary (40%) */}
        <div className="flex flex-col gap-3.5 mb-5 items-start lg:flex-row">
          <div className="w-full lg:flex-[3]">
            <InspectionQueue />
          </div>
          <div className="w-full lg:flex-[2]">
            <TodaySummary />
          </div>
        </div>

        {/* ROW 3 — Before / After */}
        <div style={{ marginBottom: 20 }}>
          <BeforeAfterRow />
        </div>

        {/* ROW 4 — Damage Records */}
        <DamageRecords />
      </div>

      <BottomNav active="Operations" />
    </div>
  )
}
