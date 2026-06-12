# Find Your Job Frontend

Vite + React + TypeScript frontend for Find Your Job. It lives in this folder so it can run and deploy independently from the Go backend.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

By default, the app expects the backend API to be available at `http://localhost:8080`.

## Build

```bash
npm run build
```

## Type-check

```bash
npx tsc --noEmit
```

## Environment variables

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

| Variable            | Purpose                          | Local default           |
| ------------------- | -------------------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Base URL for the Go backend API. | `http://localhost:8080` |

## Vercel deployment

Use `frontend` as the Vercel project root. Configure `VITE_API_BASE_URL` in Vercel with the deployed backend API URL, then use the default install and build commands:

- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: Vercel should detect the Vite/TanStack build output automatically.
