import type {
  FleetStats,
  CriticalAlert,
  ServiceAlert,
  LocationStat,
  PartsRequest,
  ContractRow,
} from '@/lib/supabase/queries/dashboard'

export type { FleetStats, CriticalAlert, ServiceAlert, LocationStat, PartsRequest, ContractRow }

export type ModalPayload =
  | { kind: 'kpi'; kpiId: string; stats: FleetStats }
  | { kind: 'alert'; alert: CriticalAlert }
  | { kind: 'service'; alert: ServiceAlert }
  | { kind: 'branch'; branch: LocationStat }
  | { kind: 'contract'; contract: ContractRow }
  | { kind: 'part'; part: PartsRequest }
  | { kind: 'all-alerts'; title?: string; alerts: CriticalAlert[] }
  | { kind: 'all-parts'; parts: PartsRequest[] }
