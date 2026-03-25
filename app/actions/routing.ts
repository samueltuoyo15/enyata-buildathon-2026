'use server'

import type { Priority, Route, RouteType, ScoredRoute } from '@/lib/types'

const PRIORITY_WEIGHTS: Record<Priority, { fee: number; speed: number; reliability: number }> = {
  cheapest: { fee: 0.70, speed: 0.10, reliability: 0.20 },
  fastest:  { fee: 0.20, speed: 0.60, reliability: 0.20 },
  balanced: { fee: 0.50, speed: 0.20, reliability: 0.30 },
  safest:   { fee: 0.10, speed: 0.10, reliability: 0.80 },
}

const ROUTE_CONFIG: Record<
  RouteType,
  {
    label: string
    baseFee: number
    feePercent: number
    baseSpeed: number
    speedVariance: number
    reliability: number
  }
> = {
  bank: {
    label: 'Bank Transfer',
    baseFee: 6000,
    feePercent: 0.030,
    baseSpeed: 1440,
    speedVariance: 120,
    reliability: 0.88,
  },
  card_rail: {
    label: 'Card Rail (Interswitch)',
    baseFee: 2500,
    feePercent: 0.015,
    baseSpeed: 2,
    speedVariance: 1,
    reliability: 0.95,
  },
  wallet: {
    label: 'Fintech Wallet',
    baseFee: 3500,
    feePercent: 0.020,
    baseSpeed: 15,
    speedVariance: 5,
    reliability: 0.82,
  },
  crypto: {
    label: 'Crypto Bridge',
    baseFee: 1000,
    feePercent: 0.008,
    baseSpeed: 10,
    speedVariance: 8,
    reliability: 0.72,
  },
}

function noise(range: number): number {
  return Math.floor(Math.random() * range * 2) - range
}

export async function fetchFxRate(from = 'NGN', to = 'GHS'): Promise<number> {
  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${from}/${to}`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    return data.conversion_rate ?? 0.031
  } catch {
    return 0.031
  }
}

interface RouteParams {
  amount: number
  priority: Priority
  fromCurrency?: string
  toCurrency?: string
}

export async function generateRoutes(params: RouteParams): Promise<Route[]> {
  const { amount, fromCurrency = 'NGN', toCurrency = 'GHS' } = params
  const fxRate = await fetchFxRate(fromCurrency, toCurrency)

  return (Object.keys(ROUTE_CONFIG) as RouteType[]).map((type) => {
    const config = ROUTE_CONFIG[type]
    const fee = config.baseFee + config.feePercent * amount + noise(300)
    const speedMinutes = config.baseSpeed + noise(config.speedVariance)
    const reliabilityScore = Math.min(1, Math.max(0, config.reliability + noise(2) / 100))

    return {
      type,
      label: config.label,
      fee: Math.max(500, Math.round(fee)),
      speedMinutes: Math.max(1, speedMinutes),
      reliabilityScore: parseFloat(reliabilityScore.toFixed(3)),
      fxRate,
    }
  })
}

export async function scoreRoutes(routes: Route[], priority: Priority): Promise<ScoredRoute[]> {
  const weights = PRIORITY_WEIGHTS[priority]
  const maxFee = Math.max(...routes.map((r) => r.fee))
  const maxSpeed = Math.max(...routes.map((r) => r.speedMinutes))

  const scored: ScoredRoute[] = routes.map((route) => {
    const normalizedFee = route.fee / maxFee
    const normalizedSpeed = route.speedMinutes / maxSpeed
    const finalScore =
      weights.fee * normalizedFee +
      weights.speed * normalizedSpeed +
      weights.reliability * (1 - route.reliabilityScore)

    let eliminationReason: string | undefined
    if (route.type === 'bank' && route.fee > 5000) eliminationReason = 'High transfer fee'
    if (route.type === 'crypto' && route.reliabilityScore < 0.75)
      eliminationReason = 'Low reliability score'

    return {
      ...route,
      finalScore: parseFloat(finalScore.toFixed(4)),
      isWinner: false,
      eliminationReason,
    }
  })

  scored.sort((a, b) => a.finalScore - b.finalScore)
  scored[0].isWinner = true

  return scored
}

export async function runRoutingEngine(params: RouteParams): Promise<ScoredRoute[]> {
  const routes = await generateRoutes(params)
  return scoreRoutes(routes, params.priority)
}
