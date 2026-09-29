import { types, families, dimensions } from "./data.js";

// Egne, pædagogiske beskrivelser. Eksemplerne er invitationer til refleksion,
// ikke individuelle vurderinger eller forudsigelser af elevens evner.
export const profileGuides = {
  INTJ: {
    tagline: "Du ser det, der kan hænge bedre sammen.",
    intro: [
      "Måske begynder du at tegne en løsning i hovedet, allerede mens opgaven bliver præsenteret. Du bliver optaget af, hvordan delene påvirker hinanden, og om den hurtige løsning også holder senere. Det kan give dig lyst til at forstå hele systemet, før du skriver den første linje kode.",
      "Din selvstændighed kan være en styrke, men andre kan have svært ved at følge en tanke, som har udviklet sig i stilhed. Når du deler dine mellemregninger, bliver dit overblik noget, gruppen kan bygge videre på. Du behøver ikke have en færdig plan for at bidrage.",
    ],
    motivation:
      "At forstå et komplekst problem og finde en gennemtænkt vej frem, som også giver mening på længere sigt.",
    energy:
      "Fordybelse, faglige spørgsmål og frihed til at undersøge en idé ordentligt.",
    drain:
      "Beslutninger uden en begrundelse og mange afbrydelser midt i en tankegang.",
    strengths: [
      "Du kan forbinde krav, kode og konsekvenser og opdage, når én ændring påvirker flere dele af projektet.",
      "Du kan holde øje med projektets retning, også når gruppen er optaget af dagens lille problem.",
      "Du kan udfordre en løsning med konkrete argumenter og hjælpe gruppen med at gøre sine valg tydelige.",
    ],
    learning: [
      [
        "Find den røde tråd",
        "Tegn, hvordan et nyt begreb hænger sammen med noget, du allerede kender. Hvilket problem løser det?",
      ],
      [
        "Byg et lille bevis",
        "Afprøv din forklaring i et minimalt program. Lad resultatet vise, om din model faktisk holder.",
      ],
      [
        "Del det ufærdige",
        "Forklar din model for en makker, før alle detaljer er på plads. Brug spørgsmålene til at opdage huller.",
      ],
    ],
    stuck:
      "Hvis du bliver ved med at designe, så vælg én antagelse, der kan testes på 20 minutter. Mere overblik kommer også fra at bygge.",
    feedback:
      "Bed om et konkret modargument: Hvilken antagelse i min løsning er mest usikker, og hvordan kan vi undersøge den?",
    misread:
      "Når du siger lidt eller hurtigt peger på en svaghed, kan andre tro, at du har afvist dem. Fortæl først, hvad du prøver at opnå, og hvad der allerede fungerer i deres idé.",
    phrase:
      "Jeg har en foreløbig model. Vil I hjælpe mig med at finde det, jeg har overset?",
    scenario: {
      title: "Når arkitekturen fylder mere end den første funktion",
      context:
        "Gruppen skal bygge en lille studieapp. Du kan se behov for en fleksibel struktur, mens din makker vil have én skærm til at virke i dag.",
      instinct:
        "Du kan få lyst til at afklare hele systemet først, så I slipper for at bygge det om senere.",
      alternative:
        "Tegn det nødvendige overblik på ti minutter, og byg derefter én funktion sammen. Notér, hvilke fremtidige behov der er gæt, og revurdér dem efter afprøvningen.",
    },
    growth: {
      title: "Gør din tanke til noget, andre kan deltage i",
      text: "Dit næste skridt kan være at dele tidligere. En ufuldstændig skitse giver andre mulighed for at påvirke løsningen, mens den stadig er åben.",
      steps: [
        "Vælg en idé, du stadig arbejder på.",
        "Vis en skitse og nævn én ting, du er usikker på.",
        "Spørg en makker, hvad de ville ændre, og afprøv forslaget.",
      ],
      reflections: [
        [
          "Hvornår hjælper mit overblik gruppen?",
          "Find et øjeblik, hvor du gjorde et komplekst valg lettere at forstå.",
        ],
        [
          "Hvornår bliver min plan for stor?",
          "Tænk på en opgave, hvor du kunne have lært noget ved at bygge en mindre version først.",
        ],
        [
          "Hvad vil jeg dele tidligere næste gang?",
          "Vælg en skitse, antagelse eller tvivl, som en makker kan hjælpe dig med.",
        ],
      ],
    },
  },
  INTP: {
    tagline: "Du vil forstå, hvad der ligger bag.",
    intro: [
      "Et svar bliver måske først interessant for dig, når du forstår, hvorfor det virker. Du kan få lyst til at undersøge et særtilfælde eller stille det spørgsmål, som får en velkendt forklaring til at vakle. I undervisningen kan det åbne for dyb forståelse, men også føre dig langt væk fra den oprindelige opgave.",
      "Du behøver ikke vælge mellem nysgerrighed og fremdrift. Når du gør dit spørgsmål konkret og deler dine opdagelser undervejs, kan gruppen få glæde af din undersøgelse. Det er også en faglig færdighed at sige: Det ved vi nok om til at tage næste skridt.",
    ],
    motivation:
      "At opdage et princip, der forklarer noget, som før virkede tilfældigt eller selvmodsigende.",
    energy:
      "Åbne spørgsmål, tid til at undersøge og samtaler, hvor det er tilladt at ændre mening.",
    drain:
      "Udenadslære uden sammenhæng og at skulle vælge, før spørgsmålet er ordentligt forstået.",
    strengths: [
      "Du kan skille et argument ad og finde en antagelse, som ellers ville være gået ubemærket hen.",
      "Du kan følge et spørgsmål længere end det første svar og opdage en nyttig alternativ forklaring.",
      "Du kan gøre en svær mekanisme forståelig ved at finde det princip, der binder detaljerne sammen.",
    ],
    learning: [
      [
        "Stil ét præcist spørgsmål",
        "Skriv, hvad du ikke forstår, som et spørgsmål, der kan besvares med et eksempel eller en afprøvning.",
      ],
      [
        "Prøv at modbevise det",
        "Lav et lille eksempel, hvor din forklaring måske ikke virker. Undersøg forskellen mellem forventning og resultat.",
      ],
      [
        "Saml din opdagelse",
        "Skriv tre linjer: mit spørgsmål, hvad jeg fandt, og hvad det betyder for opgaven.",
      ],
    ],
    stuck:
      "Hvis du åbner flere og flere spor, så læg de ekstra spørgsmål på en liste. Afslut først det spørgsmål, der blokerer gruppens næste skridt.",
    feedback:
      "Bed om hjælp til at forbinde din analyse med opgaven: Hvilken del af min forklaring kan I bruge, og hvad mangler for at komme videre?",
    misread:
      "Mange spørgsmål kan lyde som modstand, selv når du er interesseret. Sig, at du prøver at forstå, og markér forskellen mellem en afgørende fejl og en spændende detalje.",
    phrase:
      "Jeg undersøger én usikkerhed. Om 20 minutter deler jeg det, der har betydning for vores valg.",
    scenario: {
      title: "Når én fejl åbner ti nye spørgsmål",
      context:
        "En test fejler. Du finder en interessant detalje i biblioteket, men gruppen mangler en løsning inden dagens fælles gennemgang.",
      instinct:
        "Du kan få lyst til at forstå hele mekanismen, før du foreslår en rettelse.",
      alternative:
        "Skil den nødvendige rettelse fra den dybere undersøgelse. Genskab fejlen, afprøv en lille løsning, og gem dit ekstra spørgsmål til en aftalt undersøgelse senere.",
    },
    growth: {
      title: "Giv din nysgerrighed et tydeligt slutpunkt",
      text: "Et lille færdigt resultat gør dine idéer tilgængelige for andre. Prøv at definere, hvad du vil vide, før du begynder at undersøge.",
      steps: [
        "Skriv det ene spørgsmål, der er vigtigst lige nu.",
        "Aftal en tidsramme og et konkret resultat med en makker.",
        "Del konklusionen, også hvis den indeholder noget, du stadig ikke ved.",
      ],
      reflections: [
        [
          "Hvilket spørgsmål hjalp mig virkelig videre?",
          "Vælg et spørgsmål, der ændrede din forståelse eller gruppens løsning.",
        ],
        [
          "Hvordan mærker jeg, at jeg er på et sidespor?",
          "Se efter øjeblikket, hvor din undersøgelse ikke længere ændrer den aktuelle beslutning.",
        ],
        [
          "Hvad er færdigt nok til at dele?",
          "Beskriv et lille resultat, som andre kan bruge uden at kende hele din undersøgelse.",
        ],
      ],
    },
  },
  ENTJ: {
    tagline: "Du får øje på retningen — og næste skridt.",
    intro: [
      "Når en opgave er uklar, får du måske lyst til at skabe et mål, vælge en vej og få arbejdet i gang. Du kan opleve, at en beslutning giver mere energi end endnu en runde overvejelser. I en gruppe kan det skabe retning, især når ingen ved, hvor de skal begynde.",
      "Din tydelighed virker bedst, når andre også kan påvirke retningen. Nogle skal tænke sig om, før de siger imod, og stilhed er ikke altid enighed. Du kan udvikle dit samarbejde ved at skabe plads til de spørgsmål, der gør planen bedre, før tempoet stiger.",
    ],
    motivation:
      "At omsætte en ambitiøs idé til et resultat, som gruppen kan se og arbejde målrettet hen imod.",
    energy: "Tydelige mål, ansvar og samtaler, der fører til et konkret valg.",
    drain:
      "Uklare prioriteringer og møder, hvor I gentager problemet uden at aftale næste skridt.",
    strengths: [
      "Du kan hjælpe gruppen med at vælge det vigtigste, når mange opgaver konkurrerer om tiden.",
      "Du kan gøre et uklart valg konkret og få øje på, hvad der skal til for at komme videre.",
      "Du kan forbinde menneskers opgaver, så gruppen arbejder mod et fælles mål frem for hver sin retning.",
    ],
    learning: [
      [
        "Sæt et læringsmål",
        "Beskriv, hvad du selv skal kunne forklare eller udføre, når du er færdig med opgaven.",
      ],
      [
        "Prøv det i praksis",
        "Brug det nye stof til en afgrænset udfordring, hvor du kan se, om din forståelse holder.",
      ],
      [
        "Invitér et modargument",
        "Bed en makker udfordre din løsning. Undersøg deres argument, før du forsvarer din første plan.",
      ],
    ],
    stuck:
      "Hvis du bliver utålmodig, så undersøg, om gruppen mangler viden, tryghed eller en beslutning. De tre problemer kræver forskellige næste skridt.",
    feedback:
      "Bed om et konkret eksempel på din virkning: Hvornår hjalp mit tempo jer, og hvornår gjorde det sværere at bidrage?",
    misread:
      "Et hurtigt forslag kan blive hørt som en ordre. Fortæl, hvad der er til diskussion, og lad andre formulere deres løsning, før du samler op.",
    phrase:
      "Her er mit forslag til retning. Hvad ser I, som kan gøre det bedre eller få os til at vælge anderledes?",
    scenario: {
      title: "Når planen er klar, men gruppen ikke er med endnu",
      context:
        "Du har fordelt sprintets opgaver. En makker siger meget lidt, og senere viser det sig, at de ikke forstod den løsning, I valgte.",
      instinct:
        "Du kan få lyst til at forklare planen hurtigere eller overtage den opgave, der er gået i stå.",
      alternative:
        "Bed først makkeren forklare, hvor de er usikre. Justér planen sammen og aftal et lille næste skridt, som de selv ejer. Følg op uden at overtage.",
    },
    growth: {
      title: "Lad andres input ændre din plan",
      text: "At invitere deltagelse handler også om at lade sig påvirke. Øv dig i at undersøge et andet forslag, før du vurderer det.",
      steps: [
        "Lad alle skrive et forslag før næste beslutning.",
        "Spørg ind til en andens idé, før du præsenterer din egen.",
        "Fortæl bagefter, hvilket input der ændrede din forståelse.",
      ],
      reflections: [
        [
          "Hvornår gav min tydelighed andre mere råderum?",
          "Find en situation, hvor et klart mål gjorde det lettere for en makker at handle selv.",
        ],
        [
          "Hvordan reagerer jeg, når nogen arbejder langsommere?",
          "Overvej, om forskellen skyldes tempo, forståelse eller behov for en anden arbejdsform.",
        ],
        [
          "Hvem har endnu ikke påvirket vores retning?",
          "Tænk på, hvordan du konkret kan få deres perspektiv frem ved næste beslutning.",
        ],
      ],
    },
  },
  ENTP: {
    tagline: "Du finder muligheder i det, andre tager for givet.",
    intro: [
      "Du får måske energi, når nogen siger: Sådan plejer vi at gøre. Det kan vække lysten til at vende problemet om og undersøge en helt anden løsning. Du tænker ofte videre gennem diskussionen, og en skør idé kan være dit første skridt mod noget brugbart.",
      "For dig kan en indvending være et tegn på engagement. Andre kan høre den som et nej til deres arbejde. Når du gør din hensigt tydelig og hjælper med at vælge mellem mulighederne, bliver din idérigdom lettere at bruge. En idé får også værdi gennem det, I faktisk afslutter.",
    ],
    motivation:
      "At udfordre en antagelse og opdage en mulighed, som gruppen ikke havde overvejet.",
    energy:
      "Åbne problemer, levende idéudveksling og frihed til at afprøve en uventet løsning.",
    drain:
      "Rutine uden et tydeligt formål og regler, som ingen kan forklare begrundelsen for.",
    strengths: [
      "Du kan få flere løsningsmuligheder frem, når gruppen har låst sig fast på den første idé.",
      "Du kan stille spørgsmål ved en antagelse og hjælpe gruppen med at undersøge, om den faktisk holder.",
      "Du kan skifte retning, når ny viden viser, at et andet spor er mere lovende.",
    ],
    learning: [
      [
        "Sammenlign to løsninger",
        "Brug det samme lille problem til at undersøge to tilgange. Hvad gør de hver især lettere?",
      ],
      [
        "Gør debatten konkret",
        "Afprøv en uenighed i kode eller et eksempel, så I får andet end argumenter at vælge ud fra.",
      ],
      [
        "Luk én sløjfe",
        "Skriv, hvilken løsning du vælger nu, hvorfor og hvad der kunne få dig til at ændre mening.",
      ],
    ],
    stuck:
      "Når en ny idé virker mere spændende end den næsten færdige opgave, så skriv den ned. Afslut én lille leverance, før du åbner et nyt spor.",
    feedback:
      "Spørg, om dine spørgsmål var hjælpsomme: Hvilken indvending gjorde løsningen bedre, og hvilken tog os væk fra opgaven?",
    misread:
      "Når du argumenterer for flere sider, kan andre blive usikre på, hvad du egentlig mener. Sig, om du undersøger en mulighed, tester et argument eller foreslår en ny beslutning.",
    phrase:
      "Jeg vil gerne udfordre én antagelse. Bagefter vælger vi en løsning og giver den en reel chance.",
    scenario: {
      title: "Når en ny idé dukker op lige før aflevering",
      context:
        "Gruppens løsning virker næsten. Du opdager et andet værktøj, som kunne gøre projektet mere spændende, men der er kun to dage tilbage.",
      instinct:
        "Du kan få lyst til at skifte værktøj med det samme, fordi mulighederne virker større.",
      alternative:
        "Undersøg, hvilket konkret problem skiftet løser, og hvad det koster. Gem idéen som et senere forsøg, hvis den ikke er nødvendig for den aktuelle levering.",
    },
    growth: {
      title: "Giv én af dine idéer tid til at blive færdig",
      text: "Du kan øve vedholdenhed uden at opgive nysgerrigheden. Adskil tiden, hvor I åbner muligheder, fra tiden, hvor I fører et valg ud i livet.",
      steps: [
        "Vælg én idé og aftal, hvad en lille færdig version indeholder.",
        "Parkér nye forslag på en liste, mens du bygger.",
        "Afslut og vis versionen, før du beslutter, hvad der skal ændres.",
      ],
      reflections: [
        [
          "Hvilken af mine idéer blev faktisk brugt?",
          "Se på, hvad der gjorde det muligt at omsætte idéen til handling.",
        ],
        [
          "Hvornår hjælper min lyst til debat?",
          "Sammenlign en samtale, der gav klarhed, med en samtale, der skabte forvirring.",
        ],
        [
          "Hvad gør det tilfredsstillende at afslutte?",
          "Vælg en lille levering, hvor du hurtigt kan se eller høre, hvad andre får ud af den.",
        ],
      ],
    },
  },
  INFJ: {
    tagline: "Du leder efter meningen bag det, I skaber.",
    intro: [
      "Du lægger måske mærke til forbindelsen mellem en opgave og de mennesker, den skal hjælpe. Før du engagerer dig helt, vil du gerne forstå, hvorfor arbejdet er vigtigt. Du kan samle små indtryk til et større billede og få øje på et behov, der endnu ikke er blevet sagt højt.",
      "Dit blik for sammenhæng kan give gruppen retning. Men en bekymring hjælper først andre, når den bliver delt. Du må gerne sige noget, før du har formuleret det perfekt. Og du behøver ikke bære ansvaret for, at projektet både bliver meningsfuldt, vellykket og godt for alle.",
    ],
    motivation:
      "At bruge din faglighed til noget, der har en tydelig betydning for andre mennesker.",
    energy:
      "Fordybelse med et formål og samtaler, hvor der er plads til at lytte og forstå.",
    drain:
      "Overfladiske løsninger på vigtige problemer og at holde bekymringer for dig selv for længe.",
    strengths: [
      "Du kan forbinde en enkelt funktion med den større oplevelse og spørge, om løsningen faktisk hjælper brugeren.",
      "Du kan give plads til en makkers tanker og opdage spørgsmål, som en hurtig diskussion overser.",
      "Du kan minde gruppen om, hvem I bygger for, når tekniske detaljer tager al opmærksomheden.",
    ],
    learning: [
      [
        "Find et menneskeligt formål",
        "Knyt det nye stof til en konkret situation: Hvem får glæde af, at jeg forstår det her?",
      ],
      [
        "Skab dit eget overblik",
        "Tegn sammenhængen mellem begreberne, og giv dig selv lidt ro til at formulere, hvad du endnu ikke forstår.",
      ],
      [
        "Tal med én først",
        "Afprøv din forklaring med en makker, og brug deres spørgsmål til at gøre din tanke mere konkret.",
      ],
    ],
    stuck:
      "Hvis du venter på, at opgaven føles helt rigtig, så vælg ét lille behov, du kan arbejde med nu. Meningen kan blive tydeligere undervejs.",
    feedback:
      "Bed om en konkret kobling mellem intention og resultat: Jeg ville gøre dette lettere for brugeren. Hvor lykkes det, og hvor gør det ikke?",
    misread:
      "Når du holder en bekymring tilbage, kan andre tro, at du er enig. Del det, du har lagt mærke til, som en observation, gruppen kan undersøge, frem for en færdig konklusion om andre.",
    phrase:
      "Jeg er bekymret for, hvem denne løsning overser. Kan vi undersøge det sammen, før vi beslutter os?",
    scenario: {
      title: "Når en funktion virker, men en bruger bliver glemt",
      context:
        "Gruppen har lavet en tilmeldingsside. Den fungerer teknisk, men du opdager, at en ny elev måske ikke forstår ordene eller ved, hvad næste skridt er.",
      instinct:
        "Du kan få lyst til at gentænke hele oplevelsen eller holde bekymringen tilbage for ikke at forsinke gruppen.",
      alternative:
        "Peg på ét konkret sted, hvor brugeren kan gå i stå. Lad en person prøve opgaven, og brug observationen til at vælge en lille forbedring sammen.",
    },
    growth: {
      title: "Del din bekymring, mens den stadig er lille",
      text: "Du kan gøre dit blik for mennesker mere brugbart ved at sætte konkrete ord på det tidligt. Gruppen behøver ikke dele hele din intuition for at undersøge et eksempel.",
      steps: [
        "Skriv én observation uden at gætte på andres hensigter.",
        "Del den som et spørgsmål ved næste fælles gennemgang.",
        "Aftal én afprøvning, og se, hvad den faktisk viser.",
      ],
      reflections: [
        [
          "Hvornår føltes en opgave meningsfuld?",
          "Beskriv, hvem arbejdet hjalp, og hvad din egen indsats ændrede.",
        ],
        [
          "Hvilken bekymring har jeg ikke sagt højt?",
          "Prøv at gøre den til en konkret observation, som andre kan forstå.",
        ],
        [
          "Hvad er mit ansvar, og hvad er fælles?",
          "Vælg én ting, du vil bede gruppen om at tage ansvar for sammen med dig.",
        ],
      ],
    },
  },
  INFP: {
    tagline: "Du vil skabe noget, du kan stå inde for.",
    intro: [
      "Du bliver måske særligt optaget af en opgave, når den hænger sammen med noget, du synes er vigtigt. Du kan forestille dig, hvordan forskellige mennesker vil opleve en løsning, og finde en personlig eller kreativ vinkel, som gør arbejdet meningsfuldt. Friheden til at prøve din egen vej kan betyde meget.",
      "Når flere hensyn føles vigtige, kan det være svært at vælge. Et valg behøver ikke være et farvel til dine værdier. Du kan øve dig i at omsætte det, du vil beskytte, til ét konkret krav og en lille handling. Så bliver din omtanke synlig i det, I bygger.",
    ],
    motivation:
      "At skabe noget, der stemmer med dine værdier og gør en reel forskel for nogen.",
    energy:
      "Kreativt råderum, tid til refleksion og oplevelsen af, at dit perspektiv bliver taget alvorligt.",
    drain:
      "At arbejde mod et mål, du ikke forstår meningen med, eller at skulle vælge mellem vigtige hensyn uden samtale.",
    strengths: [
      "Du kan forestille dig brugerens oplevelse og stille spørgsmål til behov, som ikke er tydelige i kravene.",
      "Du kan finde en anderledes løsning ved at kombinere en personlig idé med det problem, gruppen skal løse.",
      "Du kan gøre gruppen opmærksom på, hvilke værdier der ligger i en tilsyneladende rent teknisk beslutning.",
    ],
    learning: [
      [
        "Vælg et eksempel, du bryder dig om",
        "Brug et emne eller en bruger, du er nysgerrig på, når du øver et nyt teknisk begreb.",
      ],
      [
        "Gør idéen lille nok",
        "Vælg én funktion, som udtrykker det vigtigste i din idé, og byg den før resten.",
      ],
      [
        "Sæt ord på dit valg",
        "Forklar, hvilket behov du ville møde, og spørg en makker, om løsningen faktisk gør det.",
      ],
    ],
    stuck:
      "Hvis alle muligheder føles vigtige, så spørg: Hvem vil vi hjælpe først? Vælg et foreløbigt fokus, og gem de andre hensyn synligt til senere.",
    feedback:
      "Fortæl, hvad du gerne vil have respons på. Bed om et eksempel fra løsningen, så du kan arbejde med feedbacken uden at gætte på, hvad der menes.",
    misread:
      "Når du tøver med et kompromis, kan andre tro, at du ikke vil videre. Forklar den konkrete værdi, du vil bevare, og foreslå en mindre version, som stadig respekterer den.",
    phrase:
      "Det vigtige for mig er, at brugeren føler sig forstået. Hvad er den mindste løsning, der kan hjælpe med det?",
    scenario: {
      title: "Når I ikke kan bygge alt det, der betyder noget",
      context:
        "I laver en app til studiestart. Du vil gerne støtte flere forskellige behov, men gruppen har kun tid til én funktion.",
      instinct:
        "Du kan få svært ved at vælge, fordi hver prioritering også føles som at vælge nogen fra.",
      alternative:
        "Vælg én konkret brugersituation til første version. Skriv de øvrige behov ned, og forklar, hvordan I vil undersøge dem, når I har lært af den første afprøvning.",
    },
    growth: {
      title: "Lad en lille handling bære en stor værdi",
      text: "Et realistisk første skridt kan stadig være tro mod det, du synes er vigtigt. Prøv at gøre din intention til noget, en bruger kan opleve.",
      steps: [
        "Skriv én værdi, du gerne vil beskytte i projektet.",
        "Omsæt den til et konkret krav, som I kan afprøve.",
        "Vis en lille løsning, og spørg, om værdien kan mærkes.",
      ],
      reflections: [
        [
          "Hvad gjorde denne opgave vigtig for mig?",
          "Sæt ord på den værdi eller oplevelse, du gerne ville skabe.",
        ],
        [
          "Hvornår blev mit ideal svært at arbejde med?",
          "Overvej, hvilken mindre version du kunne have afprøvet tidligere.",
        ],
        [
          "Hvilket kompromis kan jeg godt stå inde for?",
          "Skeln mellem det, der er afgørende, og det, der kan vente til næste version.",
        ],
      ],
    },
  },
  ENFJ: {
    tagline: "Du ser, hvad mennesker kan få til at lykkes sammen.",
    intro: [
      "Du opdager måske hurtigt, hvem der har fået taletid, og hvem der endnu ikke er kommet ind i arbejdet. Det kan falde dig naturligt at samle gruppen om et fælles mål og hjælpe andre med at få øje på deres bidrag. Et projekt føles ofte bedst, når både opgaven og menneskerne udvikler sig.",
      "Din opmærksomhed på gruppen kan blive krævende, hvis du begynder at tage ansvar for alles motivation. Du må gerne have dine egne læringsmål og lade en uenighed stå åben lidt. Andre vokser også ved selv at tage ansvar, formulere deres behov og finde en vej videre.",
    ],
    motivation:
      "At opleve, at gruppen bliver dygtigere sammen, og at alle får mulighed for at bidrage meningsfuldt.",
    energy:
      "Fælles retning, ærlige samtaler og at se en makker få mod på noget nyt.",
    drain:
      "Uafklarede spændinger og følelsen af, at du alene skal holde både humør og fremdrift oppe.",
    strengths: [
      "Du kan skabe en samtale, hvor flere perspektiver kommer frem, og hjælpe gruppen med at samle det vigtigste.",
      "Du kan forbinde en svær opgave med et fælles formål, som giver andre lyst til at være med.",
      "Du kan bemærke, når en makker mangler plads eller støtte, og invitere dem ind uden at tale for dem.",
    ],
    learning: [
      [
        "Gør dit eget mål synligt",
        "Skriv, hvad du selv vil lære, før du hjælper med at fordele gruppens opgaver.",
      ],
      [
        "Forklar på skift",
        "Brug en makker til at skiftes til at forklare stoffet. Begge skal få tid til selv at prøve.",
      ],
      [
        "Bed om faglig modstand",
        "Invitér en makker til at stille et svært spørgsmål til din løsning, også hvis I ellers er enige.",
      ],
    ],
    stuck:
      "Hvis din dag går med at hjælpe alle andre, så book en konkret opgave til din egen fordybelse. Aftal, hvem der håndterer gruppens spørgsmål imens.",
    feedback:
      "Spørg både til samarbejdet og din faglighed: Hvad i min løsning bør jeg ændre? Gør det tydeligt, at et kritisk svar er velkomment.",
    misread:
      "Når du hurtigt hjælper eller samler op, kan andre opleve, at du overtager deres problem. Spørg, om de ønsker et råd, en makker eller bare tid til selv at prøve.",
    phrase:
      "Jeg vil gerne støtte dig. Har du brug for et spørgsmål, et forslag eller lidt plads til at finde din egen løsning?",
    scenario: {
      title: "Når du bliver gruppens faste problemløser",
      context:
        "To makkere er uenige, en tredje er gået i stå, og din egen funktion er stadig ikke færdig. Alle kommer til dig.",
      instinct:
        "Du kan få lyst til at hjælpe alle med det samme og udsætte dit eget arbejde.",
      alternative:
        "Saml de fælles spørgsmål kort, og fordel ansvaret. Lad de to uenige beskrive deres forslag for hinanden. Aftal derefter en uforstyrret periode til din egen opgave.",
    },
    growth: {
      title: "Giv plads til både dig selv og gruppen",
      text: "Du kan støtte samarbejdet ved at gøre ansvaret fælles. Prøv at hjælpe andre med at handle selv, samtidig med at du beskytter dit eget læringsmål.",
      steps: [
        "Vælg én faglig opgave, du selv vil fordybe dig i.",
        "Aftal, hvem der ellers tager ansvar for spørgsmål og opfølgning.",
        "Spørg bagefter, om alle fik mere ejerskab — også dig.",
      ],
      reflections: [
        [
          "Hvornår hjælper jeg, og hvornår overtager jeg?",
          "Tænk på, hvem der stod for næste handling, efter du havde hjulpet.",
        ],
        [
          "Hvad vil jeg selv kunne efter dette projekt?",
          "Beskriv et fagligt mål, som kræver, at du også får tid til at øve dig.",
        ],
        [
          "Hvilken uenighed kan gruppen lære af?",
          "Overvej, hvordan I kan undersøge forskellen uden straks at skabe enighed.",
        ],
      ],
    },
  },
  ENFP: {
    tagline: "Du får nye muligheder til at føles levende.",
    intro: [
      "En samtale kan måske sætte en hel kæde af idéer i gang hos dig. Du får øje på forbindelser mellem mennesker, behov og muligheder og kan gøre en ny retning let at forestille sig. Når der er plads til at udforske, kan din begejstring få flere med ind i arbejdet.",
      "Det kan være sværere at holde energien, når projektet kræver gentagelser og afslutning. Det gør ikke de første idéer mindre værdifulde. Du kan hjælpe dig selv ved at forbinde de små, kedelige opgaver med det menneske eller formål, der gjorde projektet interessant i begyndelsen.",
    ],
    motivation:
      "At udforske muligheder sammen med andre og skabe noget, der føles både nyt og meningsfuldt.",
    energy:
      "Idéudveksling, variation og mødet med mennesker, som ser verden fra en anden vinkel.",
    drain:
      "Lange perioder med ensartede opgaver, især når forbindelsen til projektets formål bliver uklar.",
    strengths: [
      "Du kan gøre et projekt nærværende og hjælpe gruppen med at mærke, hvorfor det er værd at arbejde på.",
      "Du kan forbinde idéer fra forskellige sammenhænge og foreslå en løsning, som ingen endnu har set.",
      "Du kan invitere nye perspektiver ind og justere din idé, når en samtale åbner en anden mulighed.",
    ],
    learning: [
      [
        "Forbind stoffet med en idé",
        "Brug et nyt begreb til en lille funktion, du selv har lyst til at se i verden.",
      ],
      [
        "Tænk højt med en makker",
        "Fortæl, hvad du tror, og bed makkeren stille spørgsmål. Skriv den vigtigste opdagelse ned bagefter.",
      ],
      [
        "Afslut i små bidder",
        "Del øvelsen op i synlige resultater, så du får feedback undervejs og kan se din fremgang.",
      ],
    ],
    stuck:
      "Hvis du starter mere, end du afslutter, så vælg dagens ene vigtigste levering. Gem de andre idéer et sted, hvor du ved, at de ikke bliver glemt.",
    feedback:
      "Bed om hjælp til at prioritere: Hvilken del af min idé gør mest for brugeren, og hvad kan jeg lade ligge indtil videre?",
    misread:
      "Din begejstring for et nyt forslag kan lyde som et løfte om at bygge det hele. Fortæl, om du drømmer højt eller indgår en aftale, og saml beslutningerne skriftligt.",
    phrase:
      "Jeg har flere idéer, men lad os vælge én, vi kan gøre færdig og vise i dag.",
    scenario: {
      title: "Når workshoppen giver flere idéer end arbejdsdage",
      context:
        "Gruppen har en tavle fuld af muligheder. Alle er begejstrede, men ingen ved, hvilken funktion I skal starte på.",
      instinct:
        "Du kan få lyst til at kombinere de bedste idéer til en endnu større løsning.",
      alternative:
        "Vælg én brugersituation og én lille prototype. Gem resten på en senere-liste, og aftal, hvem der følger op på detaljerne sammen med dig.",
    },
    growth: {
      title: "Før begejstringen hele vejen til en lille levering",
      text: "Afslutning bliver lettere at holde fast i, når resultatet er synligt og meningsfuldt. Brug en makker og en lille deadline til at støtte din egen opfølgning.",
      steps: [
        "Vælg en lille funktion, der tydeligt hjælper en bruger.",
        "Aftal en kort fælles gennemgang, når den er færdig.",
        "Luk de sidste detaljer, og vis resultatet, før du starter noget nyt.",
      ],
      reflections: [
        [
          "Hvad gav mig mest energi i projektet?",
          "Se efter både mennesker, opgaver og arbejdsformer, som hjalp dig i gang.",
        ],
        [
          "Hvilken lille detalje gjorde idéen brugbar?",
          "Tænk på noget, der først virkede kedeligt, men fik betydning for det færdige resultat.",
        ],
        [
          "Hvilken aftale hjælper mig med at følge op?",
          "Vælg et tidspunkt og en makker, så opfølgningen bliver konkret.",
        ],
      ],
    },
  },
  ISTJ: {
    tagline: "Du gør det grundigt. Så andre kan regne med det.",
    intro: [
      "Du begynder måske med at læse opgaven ordentligt og finde ud af, hvad der faktisk forventes. Konkrete aftaler og eksempler giver dig noget at arbejde ud fra. Du kan finde tilfredshed i at få detaljerne til at stemme og levere det, du har sagt ja til, også når opgaven kræver tålmodighed.",
      "Din grundighed kan skabe tryghed i gruppen. Samtidig kan nye metoder virke unødigt usikre, hvis den kendte løsning fungerer. Du kan bruge din sans for kvalitet til at undersøge det nye: Aftal et lille forsøg og tydelige kriterier, så erfaringen får lov at påvirke dit valg.",
    ],
    motivation:
      "At løse en opgave ordentligt og vide, at både løsningen og de fælles aftaler holder.",
    energy:
      "Tydelige forventninger, ro til at arbejde og konkrete tegn på, at du gør fremskridt.",
    drain:
      "Aftaler, der bliver ændret uden forklaring, og uklare krav, som først bliver præcise ved aflevering.",
    strengths: [
      "Du kan følge en opgave til dørs og gøre det lettere for gruppen at stole på de aftaler, I indgår.",
      "Du kan opdage det manglende tilfælde eller den lille uoverensstemmelse, som ellers først viser sig hos brugeren.",
      "Du kan gøre arbejdet gentageligt med klare trin, testcases og dokumentation, som andre kan følge.",
    ],
    learning: [
      [
        "Start med et gennemarbejdet eksempel",
        "Følg et lille eksempel og forklar, hvad hvert trin gør, før du ændrer noget.",
      ],
      [
        "Variér én ting ad gangen",
        "Skift et input eller et krav, og undersøg, hvordan resultatet ændrer sig. Skriv din opdagelse ned.",
      ],
      [
        "Prøv uden opskriften",
        "Løs en lignende opgave uden at kigge. Brug bagefter eksemplet til at finde det, du mangler at forstå.",
      ],
    ],
    stuck:
      "Hvis du mangler en præcis opskrift, så skriv, hvad du ved, og hvad der er uklart. Aftal én antagelse, du kan arbejde ud fra og kontrollere bagefter.",
    feedback:
      "Bed om et konkret kvalitetskriterium: Hvad i min løsning er godt nok, og hvilket eksempel viser, hvad jeg skal forbedre?",
    misread:
      "Når du spørger til detaljer eller risiko, kan andre høre et nej til deres idé. Forklar, hvad du vil sikre, og foreslå en afprøvning, der kan gøre jer klogere.",
    phrase:
      "Jeg vil gerne forstå risikoen. Kan vi teste den nye metode på én lille opgave, før vi vælger?",
    scenario: {
      title: "Når gruppen vil prøve et nyt værktøj",
      context:
        "Du kender en metode, der virker. En makker foreslår et nyt værktøj, men I ved endnu ikke, om det passer til opgaven.",
      instinct:
        "Du kan få lyst til at holde fast i det kendte for at beskytte tid og kvalitet.",
      alternative:
        "Aftal en kort afprøvning med samme lille opgave i begge værktøjer. Sammenlign forståelighed, fejl og tidsforbrug, og vælg ud fra det, I observerer.",
    },
    growth: {
      title: "Gør plads til et forsøg, du kan lære af",
      text: "Grundighed og nysgerrighed kan støtte hinanden. Brug din systematik til at undersøge en ny tilgang i en størrelse, hvor risikoen er overskuelig.",
      steps: [
        "Vælg én ny metode til en afgrænset opgave.",
        "Skriv på forhånd, hvad der vil tælle som en forbedring.",
        "Afprøv metoden og fortæl gruppen, hvad du lærte — også hvis du ændrede mening.",
      ],
      reflections: [
        [
          "Hvornår gjorde min grundighed en forskel?",
          "Find et konkret eksempel på en fejl, uklarhed eller risiko, du hjalp med at håndtere.",
        ],
        [
          "Hvornår bliver en god rutine en begrænsning?",
          "Tænk på en situation, hvor du fulgte vanen uden at undersøge, om den stadig passede.",
        ],
        [
          "Hvad ville gøre et nyt forsøg trygt nok?",
          "Beskriv en tidsramme, et kriterium eller en makker, som kan hjælpe dig i gang.",
        ],
      ],
    },
  },
  ISFJ: {
    tagline: "Du får øje på det, der får hverdagen til at fungere.",
    intro: [
      "Du bemærker måske, at en makker mangler noget, før de selv beder om hjælp. Du kan huske aftaler, følge op på detaljer og gøre en praktisk indsats, som holder gruppens arbejde sammen. Det føles ofte godt, når din hjælp gør det lettere for nogen at komme videre.",
      "Noget af dit bidrag kan blive usynligt, netop fordi du får tingene til at fungere. Hvis du altid tager støtteopgaverne, risikerer dine egne læringsmål at komme bagefter. Du må gerne gøre din indsats tydelig og vælge en opgave, hvor du selv er den, der skal have hjælp til at lære.",
    ],
    motivation:
      "At gøre en konkret forskel for mennesker og være med til at skabe en hverdag, andre kan føle sig trygge i.",
    energy:
      "Tillidsfulde samarbejder, praktiske opgaver med mening og tydelig anerkendelse af det, der bliver gjort.",
    drain:
      "At være den faste hjælper uden tid til egne opgaver, eller at bidrag bliver taget som en selvfølge.",
    strengths: [
      "Du kan opdage et konkret behov og hjælpe på en måde, som gør en makkers eller brugers næste skridt lettere.",
      "Du kan holde fast i en opgave, også når den ikke længere er ny, og få de sidste nødvendige detaljer med.",
      "Du kan huske, hvad der blev aftalt, og samle løse ender op, som ellers ville skabe problemer senere.",
    ],
    learning: [
      [
        "Se et konkret eksempel",
        "Få demonstreret et lille forløb, og skriv de vigtigste trin med dine egne ord.",
      ],
      [
        "Tag selv hænderne på",
        "Prøv opgaven selv, mens en makker stiller spørgsmål i stedet for at overtage tastaturet.",
      ],
      [
        "Vælg en ny udfordring",
        "Tag ansvar for en lille del, du endnu ikke kan. Aftal støtte, så du får lov at lære undervejs.",
      ],
    ],
    stuck:
      "Hvis du siger ja til endnu en hjælpeopgave, så kig først på din egen læring. Aftal, hvad der skal flyttes eller deles, før du tager mere ind.",
    feedback:
      "Bed om feedback på din faglige opgave, også når andre roser dig for at være hjælpsom. Spørg, hvad du konkret kan øve næste gang.",
    misread:
      "Når du løser små problemer uden at nævne dem, kan gruppen tro, at du har masser af tid. Gør støttearbejdet synligt på tavlen, og sig, hvad det betyder for dine andre opgaver.",
    phrase:
      "Jeg kan hjælpe med det her, hvis vi fordeler noget andet. Jeg vil også gerne have tid til at lære denne del selv.",
    scenario: {
      title: "Når alle kommer videre — undtagen dig",
      context:
        "Du har hjulpet med opsætning, noter og fejlbeskeder. Gruppen er godt i gang, men du har endnu ikke fået arbejdet med din egen kodeopgave.",
      instinct:
        "Du kan få lyst til lige at hjælpe én gang mere og klare din egen opgave senere.",
      alternative:
        "Skriv støtteopgaverne på tavlen. Fordel de resterende mellem jer, og vælg en faglig opgave med en makker, der støtter dig uden at overtage.",
    },
    growth: {
      title: "Giv din egen læring en synlig plads",
      text: "Omsorg for gruppen kan godt gå sammen med tydelige grænser. Dine læringsmål er en del af projektet og skal også have tid og opmærksomhed.",
      steps: [
        "Skriv én faglig ting, du vil lære i denne uge.",
        "Sæt en opgave med dit navn på tavlen, og aftal tid til den.",
        "Fortæl ved opfølgningen både, hvad du bidrog med, og hvad du lærte.",
      ],
      reflections: [
        [
          "Hvilket af mit arbejde er svært for andre at se?",
          "Nævn de små handlinger, der gjorde det lettere for gruppen at fungere.",
        ],
        [
          "Hvornår sagde jeg ja, selv om jeg manglede tid?",
          "Formulér en venlig sætning, der gør din grænse og dit eget behov tydeligt.",
        ],
        [
          "Hvad vil jeg gerne være nybegynder i?",
          "Vælg en udfordring, hvor du selv kan bede om støtte i stedet for altid at give den.",
        ],
      ],
    },
  },
  ESTJ: {
    tagline: "Du skaber overblik, der bliver til handling.",
    intro: [
      "Du får måske hurtigt øje på, hvad der skal gøres, hvem der skal gøre det, og hvornår I skal være færdige. Klare aftaler gør det lettere for dig at arbejde, og du kan hjælpe gruppen med at omsætte et løst mål til konkrete opgaver. Det kan skabe ro, når projektet ellers virker uoverskueligt.",
      "En god plan bliver bedre, når den kan ændres af det, I lærer. Hvis du holder for fast i den oprindelige aftale, kan nye problemer blive svære at sige højt. Du kan bruge din tydelighed til både at følge op og skabe plads til, at en makker melder ærligt ud.",
    ],
    motivation:
      "At få et fælles mål til at lykkes gennem klare aftaler, ansvar og synlig fremdrift.",
    energy:
      "Opgaver, der bliver afsluttet, tydelige roller og et fælles overblik over, hvad der mangler.",
    drain: "Gentagne uklarheder om ansvar og aftaler, som ingen følger op på.",
    strengths: [
      "Du kan dele et stort mål op i opgaver, så gruppen får en konkret vej fra idé til aflevering.",
      "Du kan gøre forventninger tydelige og hjælpe andre med at vide, hvad de har ansvar for.",
      "Du kan følge op og få de sidste opgaver afsluttet, så projektet bliver til et brugbart resultat.",
    ],
    learning: [
      [
        "Gør målet konkret",
        "Beskriv, hvad du skal kunne gøre med det nye stof, og find en øvelse, der viser det.",
      ],
      [
        "Øv med tydelige kriterier",
        "Afprøv løsningen og kontrollér, om den opfylder kravene. Undersøg også, hvorfor den virker.",
      ],
      [
        "Revurdér fremgangsmåden",
        "Spørg, hvad øvelsen lærte dig, som du ikke vidste, da du lavede planen. Tilpas næste skridt.",
      ],
    ],
    stuck:
      "Hvis en plan bliver ved med at skride, så undersøg usikkerheden bag opgaverne. En kort fælles afklaring kan hjælpe mere end en strammere deadline.",
    feedback:
      "Bed om både resultat og proces: Var aftalen tydelig, og var der noget, der gjorde det svært at fortælle mig, at planen ikke holdt?",
    misread:
      "Tæt opfølgning kan opleves som kontrol, hvis formålet er uklart. Forklar, at du vil fjerne blokeringer, og lad den ansvarlige makker foreslå næste skridt.",
    phrase:
      "Hvad har vi lært siden planen blev lavet, og hvilken del skal vi justere for at komme godt videre?",
    scenario: {
      title: "Når en opgave tager længere tid end aftalt",
      context:
        "En makker har ikke afsluttet en opgave, og den blokerer resten af gruppen. Opgaven viste sig at indeholde noget, ingen havde prøvet før.",
      instinct:
        "Du kan få lyst til at fastholde tidsplanen eller overtage for at sikre fremdriften.",
      alternative:
        "Undersøg først, hvad der er blevet svært. Del opgaven mindre, find en makker til afklaring, og opdatér planen, så både læring og afhængigheder bliver synlige.",
    },
    growth: {
      title: "Brug planen som noget, I lærer med",
      text: "Tydelige aftaler er stærke, når de kan rumme ny viden. Prøv at koble din opfølgning til, hvad gruppen har opdaget, før du spørger til status.",
      steps: [
        "Start næste opfølgning med: Hvad overraskede os?",
        "Vælg én opgave, der skal ændres på baggrund af svaret.",
        "Aftal en ny, realistisk næste handling med den, der ejer opgaven.",
      ],
      reflections: [
        [
          "Hvornår skabte min struktur ro?",
          "Find en aftale, der gjorde det lettere for andre at arbejde selvstændigt.",
        ],
        [
          "Hvornår skulle planen have ændret sig?",
          "Se efter ny viden, som I kendte, men endnu ikke havde taget konsekvensen af.",
        ],
        [
          "Hvordan gør jeg det let at melde et problem?",
          "Formulér et spørgsmål, der inviterer til ærlighed uden at placere skyld.",
        ],
      ],
    },
  },
  ESFJ: {
    tagline: "Du binder mennesker og aftaler sammen.",
    intro: [
      "Du lægger måske mærke til, om gruppen har forstået hinanden, og om alle ved, hvad de skal gøre. Du kan gøre samarbejdet mere nærværende ved at følge op, dele information og huske de aftaler, der får hverdagen til at fungere. Det kan betyde meget for dig, at ingen står udenfor.",
      "Et godt fællesskab behøver ikke være enige om alt. Hvis du hurtigt forsøger at skabe harmoni, kan et vigtigt fagligt spørgsmål forsvinde. Du kan bruge din sans for kommunikation til at gøre uenighed tryg: Tal om løsningen, giv konkrete eksempler, og lad flere forslag blive undersøgt.",
    ],
    motivation:
      "At skabe et samarbejde, hvor alle ved, at de hører til, og hvor aftaler bliver fulgt op.",
    energy:
      "Fælles opgaver, tydelig kontakt og at kunne se, hvordan dit bidrag hjælper andre.",
    drain:
      "Manglende svar, usagte forventninger og tvivl om, hvorvidt gruppen faktisk er enige.",
    strengths: [
      "Du kan få mennesker til at finde sammen om en opgave og gøre det lettere at bede hinanden om hjælp.",
      "Du kan følge op på aftaler og sikre, at vigtig information når frem til dem, der skal bruge den.",
      "Du kan oversætte en beslutning til et fælles sprog, så flere ved, hvad den betyder i praksis.",
    ],
    learning: [
      [
        "Lær i en konkret sammenhæng",
        "Brug et eksempel fra gruppens projekt, så du kan se, hvor den nye viden skal bruges.",
      ],
      [
        "Forklar for hinanden",
        "Skift mellem at vise løsningen og stille spørgsmål. Tjek, at du selv kan gentage opgaven bagefter.",
      ],
      [
        "Opsøg det svære spørgsmål",
        "Bed en makker finde en situation, hvor din løsning ikke virker. Brug det som en fælles undersøgelse.",
      ],
    ],
    stuck:
      "Hvis du venter på, at alle bliver enige, så aftal, hvordan I vil vælge. To små afprøvninger kan gøre beslutningen lettere end endnu en runde meninger.",
    feedback:
      "Gør det let at være ærlig: Nævn selv en ting, du er usikker på, og bed om et konkret forbedringsforslag til netop den del.",
    misread:
      "Når du spørger, om alle er enige, kan nogen nikke for at bevare den gode stemning. Bed i stedet hver person nævne en fordel og en bekymring ved forslaget.",
    phrase:
      "Vi kan godt være uenige og stadig arbejde godt sammen. Hvilken indvending skal vi undersøge, før vi vælger?",
    scenario: {
      title: "Når alle nikker, men ingen har sagt sin tvivl højt",
      context:
        "Gruppen vælger et design. Der er hurtigt enighed, men bagefter fortæller en makker dig, at de synes, det bliver svært for brugeren.",
      instinct:
        "Du kan få lyst til at berolige makkeren eller løse bekymringen mellem jer, så gruppens stemning ikke bliver påvirket.",
      alternative:
        "Invitér bekymringen tilbage i gruppen som et konkret spørgsmål. Lad alle nævne et muligt problem, og afprøv det vigtigste med en brugeropgave.",
    },
    growth: {
      title: "Gør plads til en hjælpsom uenighed",
      text: "Du kan skabe tryghed ved at vise, at kritik af en løsning er en del af samarbejdet. Øv dig i at invitere et modargument uden straks at løse forskellen.",
      steps: [
        "Vælg en beslutning, gruppen endnu ikke har låst.",
        "Lad alle skrive én bekymring, før I taler sammen.",
        "Undersøg en bekymring og fortæl, hvordan den påvirkede jeres valg.",
      ],
      reflections: [
        [
          "Hvornår hjalp jeg nogen med at komme med?",
          "Beskriv en konkret handling, der gjorde det lettere for en makker at bidrage.",
        ],
        [
          "Hvornår sagde jeg ja for hurtigt?",
          "Overvej, hvad du egentlig havde brug for at få afklaret, før du tilsluttede dig.",
        ],
        [
          "Hvordan kan jeg invitere ærlig feedback?",
          "Formulér et spørgsmål, der er lettere at svare på end: Er det fint?",
        ],
      ],
    },
  },
  ISTP: {
    tagline: "Du finder ud af det ved at få hænderne i det.",
    intro: [
      "Du får måske mest lyst til at lære, når du kan prøve noget af og se, hvad der sker. Et problem bliver konkret, når du kan skille det ad, ændre én ting og følge resultatet. Du kan have det godt med at arbejde selvstændigt og lade en fungerende løsning vise, hvad du har fundet ud af.",
      "Andre ser ikke nødvendigvis den undersøgelse, der ligger bag din løsning. Når du fortæller, hvad du prøvede, og hvorfor det virkede, bliver din opdagelse til fælles viden. Du kan bevare din praktiske tilgang og samtidig gøre det lettere for en makker at lære sammen med dig.",
    ],
    motivation:
      "At forstå, hvordan noget virker, ved selv at undersøge det og løse et konkret problem.",
    energy:
      "Praktiske udfordringer, arbejdsro og frihed til at afprøve en løsning direkte.",
    drain:
      "Lange samtaler uden en afprøvning og detaljerede instruktioner, før du har set selve problemet.",
    strengths: [
      "Du kan undersøge en fejl trin for trin og finde det mindste eksempel, der viser, hvad der går galt.",
      "Du kan omsætte et spørgsmål til en afprøvning og lade resultatet udfordre din første forklaring.",
      "Du kan fokusere på det konkrete næste skridt, når en løsning bryder sammen og gruppen mangler en vej frem.",
    ],
    learning: [
      [
        "Start med noget, der kan prøves",
        "Kør et lille program eller følg et konkret eksempel, før du læser alle detaljer.",
      ],
      [
        "Ændr én ting",
        "Gæt på resultatet, ændr ét input eller én linje, og undersøg forskellen. Brug den til at forstå princippet.",
      ],
      [
        "Forklar opdagelsen",
        "Vis en makker, hvad du ændrede, og hvorfor det virkede. Lad dem gentage forsøget selv.",
      ],
    ],
    stuck:
      "Hvis du prøver mange ændringer uden overblik, så stop og skriv din hypotese. Skift én ting ad gangen, så du ved, hvad der faktisk gjorde forskellen.",
    feedback:
      "Bed en makker forsøge at bruge eller forklare din løsning uden hjælp. Det viser, hvor du mangler en kommentar, en test eller en tydeligere forklaring.",
    misread:
      "Når du arbejder stille og går direkte til løsningen, kan andre opleve, at de ikke er inviteret med. Fortæl kort, hvad du undersøger, og giv dem noget konkret at bidrage med.",
    phrase:
      "Jeg tror, fejlen opstår her. Vil du følge mit forsøg og sige, hvis min forklaring ikke hænger sammen?",
    scenario: {
      title: "Når du har rettet fejlen, men ingen ved hvordan",
      context:
        "Du får hurtigt en funktion til at virke igen. Dagen efter møder en makker en lignende fejl og starter undersøgelsen helt forfra.",
      instinct:
        "Du kan få lyst til bare at rette fejlen igen, fordi det er hurtigere end at forklare den.",
      alternative:
        "Lav det mindste eksempel på fejlen sammen. Skriv årsagen og rettelsen ned, og tilføj en test, der viser problemet, så opdagelsen bliver brugbar næste gang.",
    },
    growth: {
      title: "Lad andre følge din vej til løsningen",
      text: "En forklaring behøver ikke være lang for at gøre en forskel. Giv din makker adgang til det vigtigste, du opdagede, mens du prøvede dig frem.",
      steps: [
        "Vælg en fejl eller opgave, du netop har løst.",
        "Skriv tre linjer: problemet, årsagen og løsningen.",
        "Lad en makker følge forklaringen, og tilføj det, de savner.",
      ],
      reflections: [
        [
          "Hvilket forsøg lærte mig mest?",
          "Beskriv forskellen mellem det, du forventede, og det, du faktisk så.",
        ],
        [
          "Hvad ved jeg, som kun ligger i mit hoved?",
          "Vælg én opdagelse, som ville spare en makker tid, hvis du skrev den ned.",
        ],
        [
          "Hvordan kan jeg invitere andre ind i min undersøgelse?",
          "Find en lille opgave, hvor I kan skiftes til at foreslå og afprøve en forklaring.",
        ],
      ],
    },
  },
  ISFP: {
    tagline: "Du mærker forskellen i de små detaljer.",
    intro: [
      "Du lægger måske mærke til, hvordan noget opleves, før du kan forklare præcis hvorfor. En formulering, en bevægelse eller en lille detalje kan gøre en løsning behagelig eller besværlig. Du kan få lyst til at gøre idéen konkret og lade det, du skaber, vise din tanke.",
      "Din fornemmelse er et godt udgangspunkt for en undersøgelse. Når du forbinder den med et observerbart behov, får andre lettere ved at arbejde videre med den. Du behøver ikke finde de perfekte fagord først: To eksempler og en konkret brugeropgave kan sige meget.",
    ],
    motivation:
      "At skabe noget konkret, som føles gennemtænkt og gør oplevelsen bedre for den, der bruger det.",
    energy:
      "Praktisk kreativitet, plads til din egen tilgang og at kunne se eller mærke resultatet af arbejdet.",
    drain:
      "At skulle forsvare en fornemmelse uden eksempler og at få alle detaljer bestemt, før du selv kan prøve.",
    strengths: [
      "Du kan bemærke en detalje i brugerens oplevelse, som gør en funktion lettere eller mere behagelig at bruge.",
      "Du kan justere løsningen undervejs, når du ser, hvordan den faktisk virker i en konkret situation.",
      "Du kan give en idé form gennem et eksempel, som andre kan reagere på og bygge videre med.",
    ],
    learning: [
      [
        "Se det i brug",
        "Undersøg en konkret løsning, og læg mærke til, hvad brugeren gør, og hvad der sker bagefter.",
      ],
      [
        "Lav din egen variant",
        "Ændr en lille del og prøv den af. Sammenlign oplevelsen med den oprindelige version.",
      ],
      [
        "Sæt ord på forskellen",
        "Beskriv, hvad der blev lettere eller sværere. Knyt din observation til det faglige begreb, I arbejder med.",
      ],
    ],
    stuck:
      "Hvis du ved, at noget føles forkert, men ikke kan forklare det, så vis to varianter. Bed en makker udføre samme opgave i begge og se, hvad der sker.",
    feedback:
      "Bed om observationer før smagsdomme: Hvor tøvede du? Hvad troede du, der ville ske? Brug svaret til at vælge én ændring.",
    misread:
      "Når du siger, at noget føles bedre, kan andre høre det som personlig smag. Vis, hvilken forskel ændringen gør for en bruger, og vær nysgerrig på, om din fornemmelse holder.",
    phrase:
      "Jeg vil gerne vise to versioner. Lad os se, hvilken der gør opgaven tydeligst for brugeren.",
    scenario: {
      title: "Når en lille detalje bliver til en stor smagsdiskussion",
      context:
        "Du vil ændre en knap og dens tekst, fordi den nuværende version virker uklar. Gruppen mener, at den allerede fungerer.",
      instinct:
        "Du kan få lyst til at ændre den selv eller trække dit forslag tilbage, fordi begrundelsen er svær at forklare.",
      alternative:
        "Vis de to varianter, og giv en makker en konkret opgave uden forklaring. Se efter tøven eller fejl, og vælg ud fra oplevelsen frem for, hvem der argumenterer mest.",
    },
    growth: {
      title: "Giv din fornemmelse et konkret eksempel",
      text: "Du kan gøre din opmærksomhed på oplevelser til fælles viden. Øv dig i at forbinde det, du bemærker, med en handling, andre kan se.",
      steps: [
        "Vælg én detalje, du mener kunne fungere bedre.",
        "Lav to små varianter og en ens opgave til begge.",
        "Se en person prøve, og skriv, hvad du faktisk observerede.",
      ],
      reflections: [
        [
          "Hvilken detalje opdagede jeg før de andre?",
          "Beskriv, hvilken betydning den havde for oplevelsen, ikke kun hvordan den så ud.",
        ],
        [
          "Hvornår blev min fornemmelse bekræftet eller udfordret?",
          "Tænk på en afprøvning, hvor brugerens handling overraskede dig.",
        ],
        [
          "Hvad vil hjælpe mig med at forklare mit valg?",
          "Vælg et eksempel, et begreb eller en observation, som kan gøre dit argument tydeligt.",
        ],
      ],
    },
  },
  ESTP: {
    tagline: "Du skaber bevægelse ved at prøve dig frem.",
    intro: [
      "Du tænker måske: Lad os prøve, når gruppen har talt længe om mulighederne. Du kan hurtigt få øje på en vej til et konkret resultat og justere undervejs, når noget ændrer sig. En afprøvning giver dig noget virkeligt at reagere på og kan bringe energi ind i et projekt, der er gået i stå.",
      "Den første løsning fortæller ikke altid hele historien. Det, der virker i demonstrationen, kan fejle ved et andet input eller være svært at overtage. Du kan bevare dit tempo og samtidig gøre løsningen mere robust ved at bygge et lille kvalitetstjek ind, før du går videre.",
    ],
    motivation:
      "At få noget til at ske og lære af den virkelige reaktion på en konkret løsning.",
    energy:
      "Tydelige udfordringer, hurtig afprøvning og plads til at handle, når en mulighed opstår.",
    drain:
      "Lange overvejelser uden en beslutning og planer, som ikke kan tilpasses det, I opdager undervejs.",
    strengths: [
      "Du kan hjælpe gruppen fra snak til en lille afprøvning, som giver jer noget konkret at lære af.",
      "Du kan justere din tilgang, når virkeligheden viser sig at være anderledes end det, I forventede.",
      "Du kan få en tidlig version frem, så problemer og muligheder bliver synlige, mens der stadig er tid til at reagere.",
    ],
    learning: [
      [
        "Vælg en konkret udfordring",
        "Brug det nye stof til at få én lille ting til at fungere, så du hurtigt kan se resultatet.",
      ],
      [
        "Prøv et svært tilfælde",
        "Skift input, fjern noget eller gør opgaven lidt sværere. Undersøg, hvor din første løsning holder op med at virke.",
      ],
      [
        "Stop og forklar",
        "Sæt ord på, hvorfor løsningen virker, før du går videre. En makkers spørgsmål kan afsløre, hvad du har sprunget over.",
      ],
    ],
    stuck:
      "Hvis du bliver ved med at lappe på samme problem, så stop og undersøg årsagen. Et lille reproducerbart eksempel kan spare dig for mange hurtige gæt.",
    feedback:
      "Bed en makker finde ét tilfælde, som kan få din løsning til at fejle. Brug det til at forbedre løsningen, mens opgaven stadig er frisk.",
    misread:
      "Dit tempo kan få andre til at føle, at beslutningen allerede er taget. Fortæl, om det, du bygger, er et forsøg eller den valgte løsning, og aftal hvornår I vurderer det sammen.",
    phrase:
      "Jeg kan lave et lille forsøg nu. Bagefter tjekker vi sammen, hvad der virker, og hvad der stadig mangler.",
    scenario: {
      title: "Når demoen virker, men løsningen ikke er færdig",
      context:
        "Du har hurtigt bygget en funktion, der gemmer data. Den fungerer med dit eksempel, men gruppen har endnu ikke prøvet tomme felter eller afbrudt forbindelse.",
      instinct:
        "Du kan få lyst til at kalde opgaven færdig og begynde på den næste spændende funktion.",
      alternative:
        "Aftal et kort tjek med en makker: ét normalt forløb, ét forkert input og én fejl udefra. Ret det vigtigste, og skriv tydeligt, hvad der stadig er åbent.",
    },
    growth: {
      title: "Læg et lille kvalitetstjek ind i dit tempo",
      text: "Kvalitet behøver ikke vente til sidst. En fast, kort pause før næste opgave kan gøre dine hurtige resultater lettere at stole på og arbejde videre med.",
      steps: [
        "Vælg tre tilfælde, din næste funktion skal kunne håndtere.",
        "Byg den lille løsning, og afprøv alle tre med en makker.",
        "Ret eller notér åbne problemer, før I markerer opgaven som færdig.",
      ],
      reflections: [
        [
          "Hvornår fik min handlekraft gruppen videre?",
          "Find en afprøvning, som gav viden, I ikke kunne have diskuteret jer frem til.",
        ],
        [
          "Hvad overså jeg i farten?",
          "Tænk på et input, et hensyn eller en makker, der havde brug for mere opmærksomhed.",
        ],
        [
          "Hvilket lille tjek vil jeg gøre til en vane?",
          "Vælg et tjek, der passer ind i din arbejdsrytme og har en tydelig værdi.",
        ],
      ],
    },
  },
  ESFP: {
    tagline: "Du gør arbejdet levende og får andre med.",
    intro: [
      "Du lægger måske mærke til reaktionerne i rummet: Hvad vækker interesse, hvem er med, og hvornår mister gruppen energi? Du kan gøre et abstrakt projekt konkret gennem en demonstration eller en fælles afprøvning. At se nogen bruge det, I har lavet, kan være en stærk kilde til motivation.",
      "Noget vigtigt arbejde giver først feedback senere. Tests, forberedelse og stille fordybelse kan derfor kræve en mere bevidst ramme. Du kan gøre også de opgaver nærværende ved at dele dem op i små resultater og aftale, hvornår du viser, hvad du har lært.",
    ],
    motivation:
      "At skabe noget, mennesker kan opleve, og mærke, at dit bidrag gør en forskel her og nu.",
    energy:
      "Fælles handling, konkrete eksempler og direkte respons fra mennesker, der prøver løsningen.",
    drain:
      "Lange, usynlige opgaver uden respons og arbejde, hvor du har svært ved at mærke formålet.",
    strengths: [
      "Du kan bemærke, hvordan andre reagerer i øjeblikket, og hjælpe gruppen med at tilpasse forklaringen eller tempoet.",
      "Du kan gøre en funktion forståelig ved at vise den i brug og forbinde den med en konkret hverdagssituation.",
      "Du kan skabe energi omkring en fælles opgave og gøre det lettere for andre at deltage i afprøvningen.",
    ],
    learning: [
      [
        "Se et virkeligt forløb",
        "Start med en demonstration, og forbind det nye stof med en konkret handling og dens resultat.",
      ],
      [
        "Prøv sammen og på egen hånd",
        "Øv først med en makker, og gentag derefter opgaven alene, så du mærker, hvad du selv kan.",
      ],
      [
        "Vis, hvad du fandt ud af",
        "Lav en kort demonstration og forklar én vigtig opdagelse. Brug spørgsmålene som næste læringsmål.",
      ],
    ],
    stuck:
      "Hvis en stor opgave føles usynlig, så vælg et delresultat til de næste 25 minutter. Aftal et kort tidspunkt, hvor du kan vise din fremgang bagefter.",
    feedback:
      "Spørg ud over den første reaktion: Kunne du løse opgaven? Hvor blev du i tvivl? Det giver mere at arbejde med end ros alene.",
    misread:
      "Når du skaber god stemning og demonstrerer meget, kan andre overse din faglige indsats. Vis også dine valg, udfordringer og begrundelser, så arbejdet bag resultatet bliver tydeligt.",
    phrase:
      "Lad os se nogen prøve funktionen. Jeg vil især vide, hvor de bliver i tvivl, så vi kan forbedre næste version.",
    scenario: {
      title: "Når en god demo skjuler det, I mangler at lære",
      context:
        "Du viser gruppens løsning, og de andre virker begejstrede. Men ingen har selv prøvet at gennemføre opgaven uden din forklaring.",
      instinct:
        "Du kan få lyst til at tage den positive reaktion som tegn på, at funktionen er klar.",
      alternative:
        "Lad en person styre mus og tastatur uden hjælp. Se, hvor de tøver, og vælg én forbedring. Brug derefter lidt ro til at gennemføre ændringen før næste fremvisning.",
    },
    growth: {
      title: "Gør fordybelsen synlig i små skridt",
      text: "Du kan støtte dit fokus ved at forbinde arbejdsro med et resultat, der kan vises. Prøv at give både koncentration og fælles respons en fast plads.",
      steps: [
        "Vælg én lille opgave og et synligt tegn på, at den er løst.",
        "Arbejd uforstyrret i 25 minutter, og skriv spørgsmål ned undervejs.",
        "Vis resultatet til en makker, og vælg derefter dit næste fokus.",
      ],
      reflections: [
        [
          "Hvornår gjorde min tilstedeværelse en forskel?",
          "Find et øjeblik, hvor du hjalp nogen med at forstå, deltage eller få lyst til at prøve.",
        ],
        [
          "Hvad lærte jeg af en faktisk brugerhandling?",
          "Skeln mellem, hvad personen sagde om løsningen, og hvad de kunne gøre med den.",
        ],
        [
          "Hvad gør det lettere for mig at fordybe mig?",
          "Beskriv et sted, en tidsramme eller et lille mål, der giver dig ro til at afslutte.",
        ],
      ],
    },
  },
};

export function profilePreferences(code) {
  return dimensions.slice(0, 4).map((dimension, index) => {
    const letter = code[index];
    return {
      letter,
      title: dimension.title,
      label: letter === dimension.id[0] ? dimension.left : dimension.right,
      description: dimension.description,
    };
  });
}

export function profileReadingGuide(code) {
  const type = types.find((item) => item.code === code);
  const guide = profileGuides[code];
  if (!type || !guide) throw new Error("Ukendt profil");
  return [
    `SAMSPIL · ${type.name.toUpperCase()} (${code})`,
    families[type.family].name,
    guide.tagline,
    "En profilguide til refleksion. Brug egne erfaringer til at vurdere, hvad du genkender. Profilen beskriver mulige præferencer, ikke evner eller en fast identitet.",
    "KEND DIG SELV",
    ...guide.intro,
    `Det driver dig: ${guide.motivation}`,
    `Det kan give energi: ${guide.energy}`,
    `Det kan koste energi: ${guide.drain}`,
    ...type.strengths.map(
      (title, index) => `${title}: ${guide.strengths[index]}`,
    ),
    "SÅDAN LÆRER DU",
    ...guide.learning.map(([title, text], i) => `${i + 1}. ${title}: ${text}`),
    `Når du sidder fast: ${guide.stuck}`,
    `Feedback: ${guide.feedback}`,
    "I SAMARBEJDET",
    type.teamwork,
    guide.misread,
    `Prøv at sige: ${guide.phrase}`,
    "I SOFTWAREPROJEKTER",
    guide.scenario.title,
    guide.scenario.context,
    `En mulig første impuls: ${guide.scenario.instinct}`,
    `Et andet greb: ${guide.scenario.alternative}`,
    type.software,
    "DIN UDVIKLING",
    guide.growth.title,
    guide.growth.text,
    `Vær opmærksom på: ${type.blindspot}`,
    ...guide.growth.steps.map((step, i) => `${i + 1}. ${step}`),
    ...guide.growth.reflections.map(
      ([question, hint]) =>
        `${question}\n${hint}\nMine noter: ______________________________`,
    ),
    "BAG BOGSTAVERNE",
    ...profilePreferences(code).map(
      (p) => `${p.letter} · ${p.label}: ${p.description}`,
    ),
    "De fire bogstaver er en forenkling. Dine fem dimensioner på resultatsiden viser flere nuancer, herunder din reaktion på pres.",
  ].join("\n\n");
}
