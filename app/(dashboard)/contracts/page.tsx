'use client'

import { useState } from 'react'
import { DS, FONTS } from '@/lib/tokens'
import { KPICard }    from '@/components/ui/KPICard'
import { PageHeader } from '@/components/ui/PageHeader'
import { AppNav }     from '@/components/ui/AppNav'
import { BottomNav }  from '@/components/ui/BottomNav'
import { LongTermContracts } from './LongTermContracts'
import { KarveSync }         from './KarveSync'
import { VehiclesByContract } from './VehiclesByContract'
import { RenewalTimeline }    from './RenewalTimeline'
import { ContractRevenue }    from './ContractRevenue'

const BRANCH_FILTERS = [
  { value: 'all',   label: 'All Branches' },
  { value: 'loc-a', label: 'Loc A PDE' },
  { value: 'loc-b', label: 'Loc B MVD' },
  { value: 'loc-c', label: 'Loc C CLN' },
]

export default function ContractsPage() {
  const [branch, setBranch] = useState('all')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ds-bg)', fontFamily: FONTS.mono }}>
      <AppNav active="Contratos" />

      <div className="max-w-[1400px] mx-auto px-4 pt-7 pb-20 md:px-6 md:pb-16 lg:px-8">
        <PageHeader
          title="CONTRATOS"
          subtitle="Long-term contracts · Karve short-term sync · Renewal calendar"
          filters={BRANCH_FILTERS}
          activeFilter={branch}
          onFilterChange={setBranch}
        />

        {/* ROW 1 — 6 KPI Cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 w-full overflow-hidden md:grid-cols-3 lg:grid-cols-6">
          <KPICard label="Total Contracts"       value="4"    sub="4 contracts registered"           subColor={DS.gold}   color={DS.gold}   />
          <KPICard label="Active"                value="2"    sub="UTE · Antel"                      subColor={DS.green}  color={DS.green}  />
          <KPICard label="Expiring Soon"         value="2"    sub="OSE 42d · Intendencia 28d"        subColor={DS.yellow} color={DS.yellow} />
          <KPICard label="Vehicles Assigned"     value="306"  sub="Across all 4 contracts"           subColor={DS.blue}   color={DS.blue}   />
          <KPICard label="Monthly Revenue"       value="$64K" sub="$64,000 / month combined"         subColor={DS.green}  color={DS.green}  />
          <KPICard label="Avg Contract Duration" value="18m"  sub="Average across active contracts"  subColor={DS.slate}  color={DS.slate}  />
        </div>

        {/* ROW 2 — Contracts (60%) + Karve (40%) */}
        <div className="flex flex-col gap-3.5 mb-5 items-start lg:flex-row">
          <div className="w-full lg:flex-[3]"><LongTermContracts /></div>
          <div className="w-full lg:flex-[2]"><KarveSync /></div>
        </div>

        {/* ROW 3 — Vehicles by Contract */}
        <div style={{ marginBottom: 20 }}>
          <VehiclesByContract />
        </div>

        {/* ROW 4 — Timeline + Revenue */}
        <div className="flex flex-col gap-3.5 items-start lg:flex-row">
          <div className="w-full lg:flex-1"><RenewalTimeline /></div>
          <div className="w-full lg:flex-1"><ContractRevenue /></div>
        </div>
      </div>

      <BottomNav active="Contracts" />
    </div>
  )
}
