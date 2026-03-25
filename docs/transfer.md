# transfer execution

file: `app/actions/transfer.ts`

this handles the actual money movement. it saves the transfer to the database, logs the routing comparison results, hits the interswitch api, and updates the status.

## `executeTransfer(params)`

call this when the user clicks 'execute best route' on the ui.

```ts
import { executeTransfer } from '@/app/actions/transfer'

const result = await executeTransfer({
  amount: 200000,
  fromCountry: 'NG',
  toCountry: 'GH',
  priority: 'balanced',
  selectedRoute: winner,     // the winning route from the engine
  allRoutes: allScoredRoutes, // the full result array from the engine
  recipientName: 'samuel tuoyo',
  recipientAccount: '1234567890',
  recipientBankCode: '058',
})
```

if it works, it returns an object with `success: true` and the interswitch transaction reference. if it fails it returns `success: false` and an error string.

behind the scenes it:
1. checks if the user is actually signed in
2. creates a new transfer record set to processing
3. saves the route comparisons so we can show them later
4. grabs a fresh token from interswitch
5. tells interswitch to send the money
6. marks the transfer as completed or failed based on the api response

## `getTransferStatus(reference)`

pings interswitch to see what's up with a transaction. use the reference you got back from `executeTransfer`.

```ts
import { getTransferStatus } from '@/app/actions/transfer'

const status = await getTransferStatus('TXN_839483938')
```

## interswitch setup

just some quick notes on the interswitch integration:
* we're using basic oauth2 client credentials flow
* amount gets converted to kobo automatically before sending (multiply by 100)
* currency code is hardcoded to 566 for naira
* we hit the sandbox environment

needs these env vars to work:
* `INTERSWITCH_CLIENT_ID`
* `INTERSWITCH_CLIENT_SECRET`
* `INTERSWITCH_BASE_URL` (usually `https://sandbox.interswitchng.com`)

## transfer statuses

the status goes from `pending` to `processing` basically instantly when you call execute, then changes to either `completed` or `failed` depending on whether interswitch liked the request or not.
