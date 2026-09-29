# Prototype Instructions

## Projektets aftalte retning

- Dansk undervisningsværktøj til elever/studerende og softwareprojekter.
- **DB-first:** loggede brugere gemmer aktuelt resultat og samling i Postgres via Mercantec Auth (`AUTH.md`, JWT `sub`). localStorage er cache/draft til test undervejs. JSON-import/eksport og CSV-gruppeforslag findes stadig til backup og deling. Ingen fælles hold-/invite-hosting i denne version. **Undtagelse:** brugere med admin-rolle (`ADMIN_ROLES` / `VITE_ADMIN_ROLES`) **eller** på allowlisten (`ADMIN_ALLOWLIST`; Mathias Gaardsdal Steenberg er indbygget) kan se og styre alle tests via `/#/admin`. Produktion: **https://16.mercantec.tech** (Dokploy/Docker Compose).
- Bevar den etablerede Samspil-navigation og testside. Typegalleriet skal ligge visuelt tættere på https://www.16personalities.com/da/personlighedstyper med fire farvefamilier og figurillustrationer (brugerens feedback 2026-09-15).
- Bevar egne spørgsmål, beskrivelser og scoringsregler. Referenceillustrationers oprindelse findes i THIRD-PARTY-NOTICES.md og public/illustrations/sources.json.
- Resultatsiden skal give udførlig, elevvenlig feedback, især om de fem dimensioner. Forklar begge poler og elevens score, tilbyd fordybelse, og forbind indsigterne til softwareprojekter (brugerens feedback 2026-09-16). Midter-/X-profiler skal have en lige så indbydende resultatsoplevelse som klare firebogstavsprofiler, med nabotyper og figurer (brugerens feedback 2026-09-16). Vis også tæthed til de fire farvefamilier (lilla/grøn/blå/gul) som procentfordeling (brugerens feedback 2026-09-20).
- Alle 16 profiler skal have dybe, særskilte beskrivelser, som hjælper elever med selvforståelse. Prioritér et indbydende visuelt design med de eksisterende figurer, farvefamilier og overskuelige kapitler. Brug konkrete eksempler fra læring, samarbejde og software, og giv refleksion og små udviklingsøvelser (brugerens feedback 2026-09-16).
- Øvrige sider (forside/test, resultat, grupper, software, om) skal følge typegalleriets visuelle sprog: pastelflader, bølgeovergange, display-typografi og afrundede CTA’er. Bevar spørgeskemaets skala (−3…+3) og scoring; farvesektionér ikke spørgsmålene (brugerens feedback 2026-09-16).
- Personlighedstesten er ét spørgsmål ad gangen med **fleksibel længde**: mindst **30** udsagn for en profil, op til **150** (banken har 30 pr. dimension). Eleven kan stoppe undervejs, se profilen og senere svare flere for en opdateret vurdering. Soft overgang, progress og figur-følgesvend efter dimension. Besvarelsen ligger på `/test` som fuldskærmsoplevelse; forsiden (`/`) er landing med CTA (brugerens feedback 2026-09-16).
- Loggede brugere (Mercantec Auth) ser ikke navnefeltet; resultatet gemmes under Auth-profilens `name`, ellers `email`, ellers «Min profil». Anonyme brugere beholder valgfrit navnefelt (brugerens feedback 2026-09-16).
- Hele produktet skal føles som `/typer`: bløde former uden hårde kort-rammer, pastel-flader, og figurillustrationer som visuelt anker på forsiden, tomme states, CTA’er, feedback og profilguide (brugerens feedback 2026-09-16).
- Gruppebyggeren skal forklare teorien bag hold: hvornår variation hjælper, hvornår ens profiler kan bruges, hvordan familier og komplementære præferencer kan samtale – uden at love “perfekte” match (brugerens feedback 2026-09-16). Undervisere har indsamlingskit (link/QR), samlingsfiltre, anonymiseret spredning og gruppekontrol (variation vs. familier, lås/adskil, printbare kort).

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
