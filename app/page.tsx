export const dynamic = 'force-dynamic'

import { B } from '@/lib/tokens'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { DashboardContent } from '@/app/(dashboard)/DashboardContent'
import {
  getFleetStats,
  getCriticalAlerts,
  getServiceAlerts,
  getFleetByLocation,
  getPartsAlerts,
  getLongTermContracts,
} from '@/lib/supabase/queries/dashboard'

export default async function DashboardPage() {
  const [
    statsResult,
    critResult,
    svcResult,
    locResult,
    partsResult,
    contractsResult,
    profile,
  ] = await Promise.all([
    getFleetStats(),
    getCriticalAlerts(),
    getServiceAlerts(),
    getFleetByLocation(),
    getPartsAlerts(),
    getLongTermContracts(),
    (async () => {
      try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .single()
        return data
      } catch {
        return null
      }
    })(),
  ])

  const firstName = profile?.full_name?.trim().split(' ')[0] ?? ''

  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar />
      <DashboardContent
        firstName={firstName}
        stats={statsResult.data}
        criticalAlerts={critResult.data}
        serviceAlerts={svcResult.data}
        locations={locResult.data}
        parts={partsResult.data}
        contracts={contractsResult.data}
      />
    </div>
  )
}
