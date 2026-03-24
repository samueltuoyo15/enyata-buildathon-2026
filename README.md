# Hackathon Project

yo so this is our hackathon build. we're running Next.js 14 because it actually works on termux without breaking everything(allegedly).

## what we're using
- next.js 14 (app router)
- typescript
- tailwind
- api routes and server actions for backend stuff

## run it

```bash
pnpm run dev
```

if it breaks on termux just do this instead:
```bash
NEXT_DISABLE_SWC=1 pnpm run dev
```

then hit up localhost:3000

## how it's organized

```
app/
├── api/hello/        - example api endpoint
├── actions.ts        - server actions go here
├── page.tsx          - homepage
└── layout.tsx        - main layout wrapper
```

## backend stuff

we got api routes at `/api/hello` that handle GET and POST. server actions are in `actions.ts` - use those for form submissions and server-side logic.

## heads up for termux

don't use turbopack, it won't work. if the compiler acts weird just disable swc with that env variable above. also keep it simple - heavy image stuff and experimental features might cause problems.

## deploy it

```bash
pnpm run build
pnpm start
```
