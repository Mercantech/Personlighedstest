# Mercantec Auth + cloud-resultater

Samspil kan logge ind via **Mercantec Auth** (OAuth 2.0 + PKCE) og gemme resultater i **Postgres** knyttet til brugerens stabile `sub`.

## Forudsætninger hos platform-admin

I Auth Admin er klienten **`samspil`** (public + PKCE) med fx:

- `http://localhost:5173/auth/callback`
- `http://127.0.0.1:5173/auth/callback`
- `https://16.mercantec.tech/auth/callback` (**produktion**)

Åbn appen på **http://localhost:5173/** (dev) eller **https://16.mercantec.tech/** (prod). Redirect URI beregnes automatisk som `{origin}/auth/callback`.

### Logout

**Log ud** i Samspil rydder kun lokale tokens (`sessionStorage`). Session-cookien på `auth.mercantec.tech` bevares, så næste «Log ind» typisk springer login-UI over (SSO). Central logout kræver stadig et besøg på `/signout` — det bruges ikke fra Samspil-UI’et.

Manifest: https://auth.mercantec.tech/.well-known/mercantec-auth.json

## Start lokalt

```sh
# 1) Postgres
docker compose up -d db

# 2) API
npm --prefix api ci
npm --prefix api run dev

# 3) Web (ny terminal)
npm --prefix web ci
npm --prefix web run dev
```

Åbn http://localhost:5173/ og brug **Log ind**.

## Konfiguration

| Fil | Formål |
|-----|--------|
| `.env` (rod) | Dokploy/compose: `POSTGRES_*`, `DATABASE_URL`, `CORS_ORIGIN`, `AUTH_*`, `VITE_*` — se `.env.example` |
| `web/.env` | Lokal Vite: `VITE_AUTH_CLIENT_ID`, `VITE_API_BASE_URL`, valgfri `VITE_ADMIN_ROLES` |
| `api/.env` | Lokal API: `DATABASE_URL`, `HOST`, `AUTH_*`, `CORS_ORIGIN`, `ADMIN_ROLES` |

JWT valideres på API med JWKS (`iss` + `aud=mercantec-apps`, RS256). Tokens i browseren ligger i **sessionStorage**.

## Produktion (Dokploy / 16.mercantec.tech)

Samme mønster som øvrige Mercantec-apps: Cloudflare tunnel → Traefik → `web` (nginx). `api` + `db` er kun på det interne netværk; browseren kalder `/api/*`, som nginx proxy’er til `api:3001`.

```sh
# På Dokploy-værten (dokploy-network skal findes)
docker compose up -d --build
```

Lokal fuld stack med host-porte:

```sh
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build
```

Åbn http://localhost:3000/ lokalt, eller https://16.mercantec.tech/ i produktion.

### Admin / underviser

Adgang til admin fås hvis **enten**:

1. JWT-claims `role`/`roles` matcher `ADMIN_ROLES` / `VITE_ADMIN_ROLES` (default `admin`), **eller**
2. JWT `name`, `email` eller `sub` matcher allowlisten (`ADMIN_ALLOWLIST` / `VITE_ADMIN_ALLOWLIST`). **Mathias Gaardsdal Steenberg** er indbygget på allowlisten.

Matcher → adgang til:

- `GET /api/admin/overview`
- `GET /api/admin/results`
- `DELETE /api/admin/results/:id`
- SPA-route `/#/admin`

## API (kræver Bearer)

- `GET /api/health`
- `GET /api/me`
- `GET/PUT /api/me/result` — aktuelt resultat
- `GET /api/me/results` — samling
- `PUT /api/me/results/:id` — tilføj/opdatér i samling
- `DELETE /api/me/results/:id`
- `GET /api/admin/overview` — kræver admin-rolle
- `GET /api/admin/results` — kræver admin-rolle (`currentOnly`, filtre)
- `DELETE /api/admin/results/:id` — kræver admin-rolle
