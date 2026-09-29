# Samspil – personlighedstest

Dansk personlighedstest med fleksibel længde (mindst 30, op til 150 udsagn), 16 profiler og fokus på gruppedannelse og arbejdsmetoder i softwareudvikling.

**[Læs vejledningen i START-HER.md](START-HER.md)** – start appen, gennemfør testen, importér/eksportér resultater og tilpas indhold.

```sh
npm run setup
npm run db:up
npm run dev:api
npm run dev
```

Åbn http://127.0.0.1:5173/ (eller den adresse der står i `web/.env`).

På Windows kan `Start-Samspil.cmd` bruges. **Log ind med Mercantec Auth** for at gemme resultater på din konto (Postgres). Udkast undervejs caches i browseren. Se [AUTH.md](AUTH.md). Undervisere med admin-rolle får `/#/admin` (alle tests, overblik og styring).

## Produktion

Hostes på **https://16.mercantec.tech** via Dokploy/Traefik (Docker Compose). Se [AUTH.md](AUTH.md) og rod-`.env.example`.

```sh
docker compose up -d --build
```

## Kontrol

```sh
npm test
npm run build
```

Spørgsmål og beskrivelser findes i `web/src/data.js`; scoring og gruppedannelse i `web/src/engine.js`.
