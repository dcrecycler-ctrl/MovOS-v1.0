export const dynamic = 'force-dynamic'

import { B } from '@/lib/tokens'
import { getFleetStats } from '@/lib/supabase/queries/dashboard'
import { TopBar } from '@/components/layout/TopBar'
import { OperationsContent } from './OperationsContent'

export default async function OperationsPage() {
  const { data: stats } = await getFleetStats()
  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>
      <TopBar />
      <OperationsContent stats={stats} />
    </div>
  )
}
