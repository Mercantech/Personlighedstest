# QA – uddybende elevfeedback, 2026-09-16

## Omfang

Denne kontrol dækker den nye læseguide på resultatsiden, mobilbredden og adgangen fra en gemt profil. Den er ikke en pixel-for-pixel-godkendelse af hele sitet eller den tidligere typeoversigt.

Visuel retning: den eksisterende Samspil-side i `web/src/App.jsx` og `web/src/styles.css`. De nye feedbackblokke følger samme Inter-typografi, dimensionsfarver, knapper og rolige kort. Brugeren bad om mere forklarende indhold, ikke et nyt eksternt visuelt mål.

## Browserkontrol

- Resultatsiden åbnet i den tilgængelige browser på `http://127.0.0.1:5173/#/resultat`.
- Udfoldning og lukning af energi samt udfoldning af reaktion på pres afprøvet.
- Genvej til en dimension kontrolleret: åbner den, flytter fokus til overskriften og ruller frem.
- Desktop: personligt resumé, skala, begge poler og videre læsning inspiceret.
- Mobil: skala, badges, tekstombrydning og læs-mere-kontrol inspiceret.
- Ingen konsolfejl ved afsluttende kontrol.
- Dokumentation i de lokalt ignorerede filer `artifacts/feedback-desktop.png` og `artifacts/feedback-mobile.png`. Disse screenshots må ikke publiceres som generiske demoer: de viser den lokale profils resultater.

## Fund og rettelser

- **[P2, rettet] Mobilbredden gav vandret rulning.** Browserens mobile viewport blev målt til 341 CSS-pixels, mens sidens tidligere minimumsbredde var 360. Minimum ændret til 320. Efterkontrol: både dokumentets bredde og rullebredde er 341; ingen vandret rulning.
- **[P3, rettet] Overskriftens fokusramme.** Fokusringen vises nu ved `:focus-visible`, så tastaturnavigation har en markering uden at tilføje en permanent ramme til overskriften.
- Typografi: længere forklaringer har læsbar linjeafstand og adskilte overskrifter; mobilens polbeskrivelser går i én kolonne.
- Farver: de fem eksisterende farver genbruges; betydningen fremgår også som tekst og tal.
- Indhold: begge poler, nær-midten-resultater, betydningen af procenter og begrænsninger beskrives. Reaktion på pres fremstilles ikke som en klinisk vurdering.
- Billeder: eksisterende profilillustrationer er bevaret; ingen nye billeder er tilføjet i denne ændring.

## Automatiske kontroller

- 13 domænetests bestået: scoring, import/eksport, gruppedannelse, symmetrisk feedback, grænser nær midten og læseguide.
- 5 UI-tests bestået: fuldt elevforløb, typegalleri, filimport/gruppedannelse, tastaturstyret fordybelse og åbning af en gemt profil.
- Den lange test af 60 svar fik en grænse på 30 sekunder efter en timeout ved 15. Seneste gennemløb bestod på cirka 12 sekunder.
- Produktionsbuild og 4 skabelon-/Worker-tests bestået efter den sidste CSS-rettelse.

## Resterende afgrænsning

Ingen formel skærmlæseraudit eller automatisk farvekontrastaudit udført. Browserens download-dialog er ikke afprøvet i denne runde; læseguidens indhold er testet, og eksporten bruger den eksisterende downloadfunktion.

final result: passed
