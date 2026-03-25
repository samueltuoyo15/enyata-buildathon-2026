export type Priority = 'cheapest' | 'fastest' | 'balanced' | 'safest'

export type RouteType = 'bank' | 'card_rail' | 'wallet' | 'crypto'

export type TransferStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Route {
  type: RouteType
  label: string
  fee: number
  speedMinutes: number
  reliabilityScore: number
  fxRate: number
}

export interface ScoredRoute extends Route {
  finalScore: number
  isWinner: boolean
  eliminationReason?: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string
  created_at: string
  updated_at: string
}

export interface Transfer {
  id: string
  user_id: string
  from_country: string
  to_country: string
  amount: number
  priority: Priority
  selected_route: RouteType
  fee: number
  fx_rate: number
  settlement_estimate: number
  status: TransferStatus
  interswitch_reference: string | null
  recipient_name: string
  recipient_account: string
  recipient_bank_code: string
  created_at: string
  updated_at: string
}

export interface RouteComparison {
  id: string
  transfer_id: string
  route_type: RouteType
  fee: number
  speed_minutes: number
  reliability_score: number
  fx_rate: number
  final_score: number
  is_winner: boolean
  created_at: string
}

export interface TransferWithRoutes extends Transfer {
  routes: RouteComparison[]
}

export interface ExecuteTransferParams {
  amount: number
  fromCountry: string
  toCountry: string
  priority: Priority
  selectedRoute: ScoredRoute
  allRoutes: ScoredRoute[]
  recipientName: string
  recipientAccount: string
  recipientBankCode: string
}

export interface TransferResult {
  success: boolean
  transferId?: string
  interswitchReference?: string
  error?: string
}
