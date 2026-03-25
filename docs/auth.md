# auth stuff

we're using next.js 14 server actions + supabase auth (google oauth only). 

forget about rest endpoints for auth. you basically just import these functions in your client components and let next.js do the heavy lifting behind the scenes. the only actual http route we hit is the oauth callback.

## calling server actions from the frontend

```tsx
'use client'

import { signInWithGoogle, signOut, getUser } from '@/app/actions/auth'

// just call them straight up like normal functions
await signInWithGoogle()
await signOut()
const profile = await getUser()
```

## google oauth flow

### 1. starting the login - `signInWithGoogle()`

file: `app/actions/auth.ts`

this kicks off the google login redirect. hook it up to a form action or a button. 

```tsx
import { signInWithGoogle } from '@/app/actions/auth'

<form action={signInWithGoogle}>
  <button type="submit">sign in with google</button>
</form>
```

what happens:
1. user goes to the google consent screen
2. google sends them back to `/auth/callback?code=...`
3. supabase swaps the code for a session
4. user lands on `/dashboard`
5. profile gets created automatically in the db if it's their first time

### 2. the callback route - `GET /auth/callback`

file: `app/auth/callback/route.ts`

this is the only real http route we have for auth. supabase redirects here after google gives the thumbs up. you don't call this manually at all.

make sure `http://localhost:3000/auth/callback` is added to the allowed redirect urls in your supabase dashboard under authentication -> url configuration.

## `signOut()`

file: `app/actions/auth.ts`

kills the supabase session and drops the user back at the homepage.

```tsx
import { signOut } from '@/app/actions/auth'

<form action={signOut}>
  <button type="submit">sign out</button>
</form>
```

## `getSession()`

file: `app/actions/auth.ts`

grabs the current session so you can check if someone is logged in. returns null if they aren't.

```tsx
import { getSession } from '@/app/actions/auth'

const session = await getSession()
// you got session.user, session.access_token, etc.
```

## `getUser()`

file: `app/actions/auth.ts`

snags the full profile record from the db for whoever is currently logged in. returns null if unauthenticated.

```tsx
import { getUser } from '@/app/actions/auth'

const profile = await getUser()
```

## protecting routes

protected pages so far are `/dashboard`, `/transfer`, and `/transactions`.

we got a `middleware.ts` file at the root that checks every request. if someone tries to hit those pages without being logged in, it drops them back at the homepage. so you don't need to manually check auth in your page components.

## environment config

you need these set up:

- `NEXT_PUBLIC_SUPABASE_URL` (your project url)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (public anon key, safe to expose)
- `NEXT_PUBLIC_SITE_URL` (`http://localhost:3000` locally)
