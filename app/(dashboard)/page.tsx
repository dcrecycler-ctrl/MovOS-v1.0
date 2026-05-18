import { Suspense } from 'react'
import { DashboardClient } from './DashboardClient'
import {
  getFleetStats,
  getCriticalAlerts,
  getServiceAlerts,
  getFleetByLocation,
  getPartsAlerts,
  getLongTermContracts,
} from '@/lib/supabase/queries/dashboard'
import { DashboardSkeleton } from './loading'

// Revalidate every 60 seconds — dashboard data is near-realtime but not live
export const revalidate = 60

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  )
}

// Async component — all six queries run in parallel; each handles its own error.
// Promise.all is intentional: if any query throws past its catch (shouldn't happen),
// the error.tsx boundary catches it. Per-section errors come back as { error: string }.
async function DashboardData() {
  const [stats, alerts, serviceAlerts, locations, parts, contracts] = await Promise.all([
    getFleetStats(),
    getCriticalAlerts(),
    getServiceAlerts(),
    getFleetByLocation(),
    getPartsAlerts(),
    getLongTermContracts(),
  ])

  return (
    <DashboardClient
      stats={stats}
      alerts={alerts}
      serviceAlerts={serviceAlerts}
      locations={locations}
      parts={parts}
      contracts={contracts}
    />
  )
}
