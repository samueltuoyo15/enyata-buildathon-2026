# Dashboard Server Actions

## User Profile

### getUser()
```typescript
import { getUser } from '@/app/actions/auth'

const user = await getUser()
```

Returns:
```typescript
{
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string
  created_at: string
  updated_at: string
} | null
```

## Transaction History

### getUserTransfers(page)
```typescript
import { getUserTransfers } from '@/app/actions/transactions'

const { data, count } = await getUserTransfers(1)
```

Parameters:
- `page` (number): Page number, defaults to 1

Returns:
```typescript
{
  data: Transfer[]
  count: number
}
```

### getTransferById(id)
```typescript
import { getTransferById } from '@/app/actions/transactions'

const transfer = await getTransferById('uuid-here')
```

Parameters:
- `id` (string): Transfer UUID

Returns:
```typescript
{
  id: string
  user_id: string
  from_country: string
  to_country: string
  amount: number
  priority: 'cheapest' | 'fastest' | 'balanced' | 'safest'
  selected_route: 'bank' | 'card_rail' | 'wallet' | 'crypto'
  fee: number
  fx_rate: number
  settlement_estimate: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  interswitch_reference: string | null
  recipient_name: string
  recipient_account: string
  recipient_bank_code: string
  created_at: string
  updated_at: string
  routes: RouteComparison[]
} | null
```

## Route Comparison

### runRoutingEngine(params)
```typescript
import { runRoutingEngine } from '@/app/actions/routing'

const routes = await runRoutingEngine({
  amount: 200000,
  priority: 'fastest',
  fromCountry: 'NGN',
  toCountry: 'USD'
})

const winner = routes.find(r => r.isWinner)
```

Parameters:
```typescript
{
  amount: number
  priority: 'cheapest' | 'fastest' | 'balanced' | 'safest'
  fromCountry: string
  toCountry: string
}
```

**IMPORTANT**: `fromCountry` and `toCountry` must be currency codes (NGN, USD, GHS, etc), NOT country names.

Returns:
```typescript
ScoredRoute[] = [
  {
    type: 'bank' | 'card_rail' | 'wallet' | 'crypto'
    label: string
    fee: number
    speedMinutes: number
    reliabilityScore: number
    fxRate: number
    finalScore: number
    isWinner: boolean
    eliminationReason?: string
  }
]
```

## Transfer Execution

### executeTransfer(params)
```typescript
import { executeTransfer } from '@/app/actions/transfer'

const result = await executeTransfer({
  amount: 200000,
  fromCountry: 'Nigeria',
  toCountry: 'Ghana',
  priority: 'balanced',
  selectedRoute: winner,
  allRoutes: routes,
  recipientName: 'John Doe',
  recipientAccount: '1234567890',
  recipientBankCode: '058'
})
```

Parameters:
```typescript
{
  amount: number
  fromCountry: string
  toCountry: string
  priority: 'cheapest' | 'fastest' | 'balanced' | 'safest'
  selectedRoute: ScoredRoute
  allRoutes: ScoredRoute[]
  recipientName: string
  recipientAccount: string
  recipientBankCode: string
}
```

Returns:
```typescript
{
  success: boolean
  transferId?: string
  interswitchReference?: string
  error?: string
}
```

## Authentication

### signOut()
```typescript
import { signOut } from '@/app/actions/auth'

await signOut()
```

### getSession()
```typescript
import { getSession } from '@/app/actions/auth'

const session = await getSession()
```

Returns Supabase session object or null.

## Fee Formulas

### Bank Transfer
- Base: ₦6000
- Percentage: 3% of amount
- Random noise: -₦300 to +₦300

### Card Rail (Interswitch)
- Base: ₦2500
- Percentage: 1.5% of amount
- Random noise: -₦300 to +₦300

### Fintech Wallet
- Base: ₦3500
- Percentage: 2% of amount
- Random noise: -₦300 to +₦300

### Crypto Bridge
- Base: ₦1000
- Percentage: 0.8% of amount
- Random noise: -₦300 to +₦300

## Priority Weights

### Cheapest
- Fee: 70%
- Speed: 10%
- Reliability: 20%

### Fastest
- Fee: 20%
- Speed: 60%
- Reliability: 20%

### Balanced
- Fee: 50%
- Speed: 20%
- Reliability: 30%

### Safest
- Fee: 10%
- Speed: 10%
- Reliability: 80%
