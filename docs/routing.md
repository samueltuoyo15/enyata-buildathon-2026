# routing engine

file: `app/actions/routing.ts`

all these are server actions. just import them and call them from wherever.

## how it works

the engine looks at 4 different ways to send money and scores them based on what the user cares about most (speed, cost, or a balance of both). the winning option will change every time you run it because we inject some random noise into the fees and the live exchange rate changes anyway.

the 4 routes we compare:
* bank transfer
* card rail (interswitch)
* fintech wallet
* crypto bridge

the scoring math looks like this:
`score = fee_weight * normalizedFee + speed_weight * normalizedSpeed + reliability_weight * (1 - reliability)`
the lowest score wins.

priority weights:
* cheapest values fee at 0.70, speed 0.10, reliability 0.20
* fastest values fee at 0.20, speed 0.60, reliability 0.20
* balanced values fee at 0.50, speed 0.20, reliability 0.30

## `fetchFxRate(from, to)`

pulls live fx rates from exchangerate-api. it caches for an hour so we don't spam the api.

```ts
import { fetchFxRate } from '@/app/actions/routing'

const rate = await fetchFxRate('NGN', 'GHS')
// returns something like 0.031
```
if the api is down, it just falls back to 0.031 so the app doesn't break.

## `generateRoutes(params)`

spits out 4 route options with dynamic fees, speeds, and reliability scores. calls the fx rate api under the hood.

```ts
import { generateRoutes } from '@/app/actions/routing'

const routes = await generateRoutes({
  amount: 200000,
  priority: 'balanced',
})
```
returns an array of routes with everything calculated.

## `scoreRoutes(routes, priority)`

takes the generated routes and figures out the best one. it adds an `isWinner` boolean to the champ and adds an `eliminationReason` to the bad options (like if the fee is just too high).

```ts
import { scoreRoutes } from '@/app/actions/routing'

const scored = await scoreRoutes(routes, 'balanced')
```
returns the routes ranked from best to worst.

## `runRoutingEngine(params)`

this is the big one. it does the whole process from start to finish. generating the routes, grabbing the fx rate, scoring them, and giving you the final results. you only really need to call this one from the frontend.

```ts
import { runRoutingEngine } from '@/app/actions/routing'

const results = await runRoutingEngine({
  amount: 200000,
  priority: 'balanced',
})

const winner = results.find(r => r.isWinner)
```

## fee formulas

just so you know how the fake numbers are generated:
* bank is ₦6000 base + 3% of amount
* card rail is ₦2500 base + 1.5% of amount
* wallet is ₦3500 base + 2% of amount
* crypto is ₦1000 base + 0.8% of amount

every run also adds a random noise value between -₦300 and +₦300 so the ui doesn't look static.
