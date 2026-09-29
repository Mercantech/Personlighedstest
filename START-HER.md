# Samspil – personlighedstest og gruppedannelse

En dansk webapp inspireret af 16Personalities’ testforløb. Spørgsmål, 16 profilbeskrivelser og softwareeksempler er egne tekster. Typeoversigten bruger genkendelige typenavne og lokale kopier af referenceillustrationerne. Se `web/THIRD-PARTY-NOTICES.md` for illustrationernes oprindelse og rettighedsstatus. Ingen proprietær scoring fra referencesiden er inkluderet.

## Kom i gang

Du skal bruge Node.js 22.12 eller nyere, npm og (til konto-gemning) Docker til Postgres. Kør fra projektets rod:

```sh
npm run setup
npm run db:up
npm run dev:api
npm run dev
```

Åbn **http://127.0.0.1:5173/** (eller den redirect-URI der står i `web/.env`). På Windows kan `Start-Samspil.cmd` bruges.

**Log ind** med Mercantec Auth for at gemme resultater på din konto. Se [AUTH.md](AUTH.md). Udkast undervejs caches i browseren, så du kan fortsætte testen. Har din JWT admin-rolle (`ADMIN_ROLES` / `VITE_ADMIN_ROLES`), vises **Admin** i menuen.

## Produktion (16.mercantec.tech)

På Dokploy: `docker compose up -d --build` (kræver eksternt netværk `dokploy-network`). Auth-redirect `https://16.mercantec.tech/auth/callback` skal være tilladt for klienten `samspil`. Kopiér `.env.example` til `.env` og sæt secrets.

Lokal Docker-stack med porte: `docker compose -f docker-compose.yml -f docker-compose.local.yml up --build` → http://localhost:3000/

## Elevernes forløb

1. Svar udsagn ét ad gangen på `/#/test`. Efter **mindst 30** kan du se din profil; du kan fortsætte op til **150** og få en opdateret vurdering.
2. Svar ud fra hverdagen. Fremdrift caches automatisk i browseren.
3. Er du logget ind, springes navnefeltet over, og resultatet gemmes på din konto. Ellers kan du angive et valgfrit alias og blive bedt om at logge ind for varig gemning.
4. Se profilen, de fem dimensionsscorer og softwareeksempler. **Download resultat** giver en JSON-backup du kan dele med underviseren.

Under **De 16 typer** har hver profil kapitler om selvforståelse, læring, samarbejde, softwareprojekter og udvikling. På resultatsiden åbnes de med **Læs mere om din profil**.

## Underviserens forløb

1. Åbn **Gruppebygger**, og importér elevernes JSON-filer (eller brug profiler fra din egen konto-samling efter sync).
2. Gennemse resultaterne. Klik på et navn for dimensionsscorer. Dubletter med samme id springes over ved import.
3. Vælg højst antal personer pr. gruppe, og vælg **Dan grupper**. **Lav et nyt forslag** bruger en anden blanding.
4. Download gruppefordelingen som CSV. Justér fordelingen sammen med eleverne.
5. **Eksportér samling** som JSON-backup.

Gruppeforslagene er midlertidige indtil eksport. For loggede brugere er Postgres sandhed for resultater; browseren cacher for hurtig genindlæsning.

## Tilpas indhold og regler

| Fil | Indhold |
| --- | --- |
| `web/src/data.js` | Spørgsmålsbank (30 pr. dimension), polretninger, dimensioner, 16 beskrivelser |
| `web/src/engine.js` | Scoring, versionskontrol, import, eksport og gruppedannelse |
| `web/src/feedback.js` | Forklaringer, scoretilpasset feedback og læseguide |
| `web/src/DimensionFeedback.jsx` | Interaktiv læseguide på resultatsiden |
| `web/src/profile-content.js` | Dybe tekster for alle 16 profiler |
| `web/src/App.jsx` | Testforløb, profiler, samling og øvrige sider |
| `api/` | Auth-proxy, JWT-validering og Postgres-lagring |

Ved ændring af spørgsmål beregnes en ny `INSTRUMENT`-hash. Gamle resultatfiler afvises ved import.

## Metode

Hver dimension har op til 30 udsagn (halvdelen med modsat polretning). Du svarer mindst 30 i alt (runde-robin på tværs af dimensioner) og kan fortsætte op til 150. Scoren pr. dimension er `round(50 + sum / (n×3) * 50)` hvor `n` er antal besvarede i dimensionen.

Dette er et undervisningsværktøj, ikke en valideret psykologisk test. Brug profiler som samtalestartere – ikke som mål for evner eller eneste grundlag for gruppefordeling.

## Byg og kontrollér

```sh
npm test
npm --prefix web run test:ui
npm run build
```
