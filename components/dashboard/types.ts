import { KPI, CriticalAlert, ServiceAlert, Branch, Contract, Part } from '@/lib/data'

export type ModalPayload =
  | { kind: 'kpi'; kpi: KPI }
  | { kind: 'alert'; alert: CriticalAlert }
  | { kind: 'service'; alert: ServiceAlert }
  | { kind: 'branch'; branch: Branch }
  | { kind: 'contract'; contract: Contract }
  | { kind: 'part'; part: Part }
  | { kind: 'all-alerts'; title?: string }
  | { kind: 'all-parts' }
