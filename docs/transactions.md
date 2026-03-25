# transaction history

file: `app/actions/transactions.ts`

grabs the history for the logged in user. everything is protected by row level security in supabase, so it's literally impossible to pull someone else's data by accident.

## `getUserTransfers(page?)`

gets a paginated list of the user's past transfers, newest stuff first.

```ts
import { getUserTransfers } from '@/app/actions/transactions'

const { data, count } = await getUserTransfers(1)
```

defaults to page 1. returns 10 items per page at most. the `count` var is the total number of records across all pages so you can do the math for your pagination component.

## `getTransferById(id)`

pulls a single transfer but also includes the full breakdown of how the routing engine scored the options for that specific transfer. you'll probably need this to build the details screen.

```ts
import { getTransferById } from '@/app/actions/transactions'

const transfer = await getTransferById('transfer-uuid')
```

the returned object has a `routes` array attached to it, sorted from best score to worst score, so `transfer.routes[0]` is always the route that actually got picked.

returns null if the transfer doesn't exist, doesn't belong to the user, or the user isn't logged in.

## the database tables

* `transfers`: one row per transfer attempt
* `route_comparisons`: exactly four rows per transfer, one for each payment rail we checked

supabase automatically handles making sure the `user_id` matches whoever is asking for the data because of the db policies we set up.
