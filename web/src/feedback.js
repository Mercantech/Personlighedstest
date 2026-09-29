import { dimensions } from "./data.js";

// Pædagogiske fortolkninger af selvrapporterede præferencer. Scoringen ændres ikke.
export const dimensionGuides = {
  EI: {
    question: "Hvor får du energi, og hvordan finder du frem til dine tanker?",
    overview:
      "Energi handler om dit foretrukne samspil mellem kontakt og fordybelse. Nogle finder deres tanker, mens de taler med andre. Andre vil gerne tænke færdigt i fred, før de deler. Begge tilgange kan bidrage til et godt projekt, og dit behov kan skifte i løbet af dagen.",
    nuance:
      "Introversion siger ikke, at du er genert, og ekstroversion siger ikke, at du altid vil tale. Dimensionen handler om arbejdsbetingelser og energi, ikke om hvor god du er til mennesker.",
    left: {
      headline: "Du tænker gerne i samspil med andre",
      reading:
        "Dine svar peger mod, at samtaler og fælles aktivitet ofte hjælper dig i gang. Du kan opdage, hvad du egentlig mener, mens du forklarer det højt. Du vil måske gerne vende en fejl med en makker, før du undersøger den alene.",
      strength:
        "Du kan sætte en samtale i gang, gøre overvejelser synlige og opdage misforståelser, før gruppen arbejder i hver sin retning.",
      watch:
        "Når du tænker højt, kan en foreløbig idé blive opfattet som en beslutning. Hurtige svar kan også komme til at fylde den tid, andre bruger på at tænke.",
      action:
        "Start næste møde med to minutters stille notater. Del derefter dine tanker, og spørg de andre, hvad de nåede frem til, før I vælger en løsning.",
    },
    right: {
      headline: "Du finder ofte klarhed gennem fordybelse",
      reading:
        "Dine svar peger mod, at ro og tid til at tænke ofte hjælper dig. Du foretrækker måske at undersøge en opgave eller skrive et forslag ned, før du tager diskussionen. Mange afbrydelser kan gøre det svært at holde fast i en tankegang.",
      strength:
        "Du kan give gruppen gennemtænkte perspektiver, opdage detaljer under koncentreret arbejde og formulere komplekse tanker præcist.",
      watch:
        "Hvis du først deler, når tanken er helt færdig, kan de andre komme til at mangle dit perspektiv undervejs. Din stilhed kan blive læst som enighed.",
      action:
        "Bed om dagsordenen før næste møde. Skriv ét forslag og ét spørgsmål, og aftal et tidspunkt i mødet, hvor du deler dem, også selv om de stadig er foreløbige.",
    },
    balanced: {
      reading:
        "Dine svar ligger tæt mellem fælles aktivitet og individuel fordybelse. Du kan have forskellige behov afhængigt af opgaven, menneskene og tidspunktet. Overvej, hvornår en samtale hjælper dig, og hvornår du får mest ud af at tænke selv.",
      action:
        "Afprøv en arbejdsblok alene og en med en makker på to lignende opgaver. Læg mærke til både energi, forståelse og kvalitet, og brug erfaringen til at planlægge næste gang.",
    },
    scenario: {
      title: "Når I parprogrammerer",
      situation:
        "I er kørt fast i en fejl, og den ene begynder straks at foreslå løsninger, mens den anden har brug for at læse koden.",
      agreement:
        "Giv først plads til et par minutters undersøgelse. Lad derefter begge forklare deres hypotese. Skift mellem stille læsning og fælles afprøvning i stedet for at forvente samme tempo hele tiden.",
    },
    reflection: [
      "Hvornår går jeg fra en arbejdsdag med mere energi, end jeg startede med?",
      "Hvordan kan jeg gøre mit behov for samtale eller ro tydeligt for min gruppe?",
    ],
  },
  NS: {
    question: "Hvilken information lægger du først mærke til?",
    overview:
      "Information handler om, hvad du tager udgangspunkt i, når du skal forstå noget nyt. En intuitiv tilgang begynder ofte med muligheder, mønstre og den store sammenhæng. En observerende tilgang begynder ofte med konkrete erfaringer, detaljer og det, der kan efterprøves.",
    nuance:
      "Begge tilgange kan være kreative og grundige. Forskellen handler om, hvor du typisk begynder – ikke om din intelligens, fantasi eller tekniske kunnen.",
    left: {
      headline: "Du får øje på mønstre og muligheder",
      reading:
        "Dine svar peger mod, at du ofte søger idéen bag detaljerne. Du kan blive optaget af, hvad en løsning kunne udvikle sig til, eller hvordan et problem hænger sammen med noget, du har set før. En overordnet model kan hjælpe dig med at lære et nyt emne.",
      strength:
        "Du kan forbinde idéer, udfordre vante antagelser og hjælpe gruppen med at se alternative løsninger og langsigtede konsekvenser.",
      watch:
        "En spændende fremtidig mulighed kan få mere opmærksomhed end det konkrete behov her og nu. Detaljer og praktiske begrænsninger kan blive opdaget sent.",
      action:
        "Vælg én antagelse fra jeres løsningsidé. Skriv, hvad I forventer at se, og lav et lille eksperiment eller en prototype, der kan bekræfte eller udfordre den.",
    },
    right: {
      headline: "Du bygger forståelse på noget konkret",
      reading:
        "Dine svar peger mod, at eksempler, erfaringer og observerbare detaljer ofte hjælper dig med at forstå en opgave. Du spørger måske efter, hvad systemet præcis skal gøre, eller vil gerne se et fungerende eksempel, før du generaliserer.",
      strength:
        "Du kan gøre uklare krav konkrete, opdage afvigelser og holde gruppens løsning forbundet med det, der faktisk skal fungere for brugeren.",
      watch:
        "En kendt løsning kan virke så tryg, at en ny mulighed ikke bliver undersøgt. Det kan være svært at engagere sig i en idé, der endnu ikke har et konkret eksempel.",
      action:
        "Tag én velkendt løsning og spørg: Hvilken anden tilgang kunne også virke? Byg det mindste eksempel, der gør den nye mulighed konkret nok til at vurdere.",
    },
    balanced: {
      reading:
        "Dine svar ligger tæt mellem mønstre og konkrete observationer. Måske vil du både forstå idéen og se den virke i praksis. Læg mærke til, om din tilgang ændrer sig, når emnet er velkendt, eller når du lærer noget helt nyt.",
      action:
        "Beskriv næste opgave på to måder: først som et overordnet princip og derefter som et konkret input og output. Brug forskellene til at finde det, I endnu ikke forstår.",
    },
    scenario: {
      title: "Når I vælger arkitektur",
      situation:
        "En i gruppen vil bygge en fleksibel løsning til fremtidige funktioner. En anden vil først have den aktuelle brugerhistorie til at virke.",
      agreement:
        "Skriv både det aktuelle behov og de fremtidige antagelser ned. Lav den mindste løsning, der opfylder behovet, og aftal, hvilke tegn der senere vil gøre en mere generel løsning relevant.",
    },
    reflection: [
      "Hvad har jeg brug for først, når jeg skal lære et nyt framework: principper eller et eksempel?",
      "Hvornår hjalp mit blik for helheden eller detaljen gruppen – og hvad overså jeg?",
    ],
  },
  TF: {
    question: "Hvad vejer tungest, når du skal træffe en beslutning?",
    overview:
      "Beslutninger handler om de hensyn, du typisk bringer frem først. En analytisk tilgang søger sammenhængende argumenter, tydelige kriterier og konsekvens. En værdiorienteret tilgang undersøger, hvordan valget påvirker mennesker, relationer og det, der er vigtigt for dem.",
    nuance:
      "Alle kan bruge logik og tage hensyn til mennesker. Et analytisk resultat måler ikke intelligens, og et værdiorienteret resultat måler ikke, hvor omsorgsfuld du er.",
    left: {
      headline: "Du søger tydelige argumenter og kriterier",
      reading:
        "Dine svar peger mod, at du ofte vil forstå begrundelsen for et valg og kunne sammenligne løsninger på et klart grundlag. Du kan opleve en faglig diskussion som en måde at forbedre idéen på, selv når tonen er direkte.",
      strength:
        "Du kan gøre beslutninger efterprøvelige, få øje på modstridende krav og hjælpe gruppen med at adskille antagelser fra dokumentation.",
      watch:
        "Et argument kan være korrekt og stadig blive svært at tage imod. Hvis menneskers bekymringer behandles som irrelevante, kan vigtige erfaringer og behov gå tabt.",
      action:
        "Skriv næste review-kommentar i tre led: Hvad ser du i koden? Hvilken konsekvens kan det have? Hvilket spørgsmål eller forslag kan hjælpe din makker videre?",
    },
    right: {
      headline: "Du undersøger betydningen for mennesker",
      reading:
        "Dine svar peger mod, at menneskers oplevelser og værdier ofte har stor vægt i dine beslutninger. Du vil måske først vide, hvem en løsning hjælper, og hvem den gør hverdagen sværere for. Gruppens måde at være uenig på kan også betyde meget for dig.",
      strength:
        "Du kan opdage oversete brugerbehov, inddrage flere perspektiver og hjælpe gruppen med at træffe beslutninger, som andre kan forstå og arbejde med.",
      watch:
        "Et ønske om at bevare en god relation kan gøre nødvendig kritik svær at sige højt. Enighed kan komme til at skjule et problem, der kræver et tydeligt valg.",
      action:
        "Når noget bekymrer dig, forbind hensynet til et konkret kriterium: Hvem påvirkes, hvad bliver vanskeligt, og hvordan kan I undersøge, om en ændring hjælper?",
    },
    balanced: {
      reading:
        "Dine svar ligger tæt mellem tydelige kriterier og menneskelige hensyn. Du kan opleve, at vægtningen afhænger af, hvad beslutningen handler om. Undersøg, hvordan du håndterer en situation, hvor en teknisk fordel har en ulempe for en bruger eller medstuderende.",
      action:
        "Lav to kolonner til næste beslutning: tekniske konsekvenser og konsekvenser for mennesker. Vælg sammen, hvilke hensyn der er vigtigst i netop denne situation.",
    },
    scenario: {
      title: "Når I giver code review",
      situation:
        "Et pull request løser opgaven, men er svært at vedligeholde. En i gruppen vil kræve en ændring med det samme; en anden er optaget af, hvordan forfatteren vil opleve kritikken.",
      agreement:
        "Aftal fælles kvalitetskriterier, og knyt feedbacken til koden og dens konsekvenser. Giv samtidig plads til at forklare valget og finde en realistisk vej videre sammen.",
    },
    reflection: [
      "Hvilket hensyn nævner jeg typisk først, når vi er uenige?",
      "Hvordan kan jeg være både tydelig om et problem og hjælpsom over for personen?",
    ],
  },
  JP: {
    question: "Hvor meget plan og åbenhed har du brug for undervejs?",
    overview:
      "Arbejdsform handler om, hvordan du foretrækker at organisere fremdrift. En struktureret tilgang søger overblik, aftaler og afslutning. En udforskende tilgang søger fleksibilitet, nye indsigter og muligheden for at ændre retning, mens arbejdet udvikler sig.",
    nuance:
      "En udforskende præference betyder ikke, at du er upålidelig, og en struktureret præference betyder ikke, at du er ufleksibel. I softwareprojekter er der ofte brug for både en tydelig retning og plads til at lære.",
    left: {
      headline: "Du får ro af retning og tydelige aftaler",
      reading:
        "Dine svar peger mod, at du gerne vil vide, hvad næste skridt er, og hvornår noget er færdigt. En opgaveliste, aftalt ansvar eller en plan kan frigøre opmærksomhed til selve arbejdet. Uafklarede beslutninger kan føles som noget, der står i vejen.",
      strength:
        "Du kan gøre fremdrift synlig, opdage afhængigheder og hjælpe gruppen med at få opgaver helt færdige i stedet for at have mange halvfærdige spor.",
      watch:
        "En beslutning kan blive lukket, før I har undersøgt den vigtigste usikkerhed. En ændring i planen kan føles som et problem, selv når den bygger på ny viden.",
      action:
        "Planlæg næste opgave med et tydeligt mål og et åbent løsningsrum. Aftal ét tidspunkt, hvor I vurderer ny viden og må ændre planen med en konkret begrundelse.",
    },
    right: {
      headline: "Du lærer gerne gennem afprøvning og tilpasning",
      reading:
        "Dine svar peger mod, at du trives med at kunne justere din tilgang, når du opdager noget nyt. Du kan få idéer under selve arbejdet og vil måske gerne prøve flere veje, før du vælger. En meget detaljeret plan kan opleves som en begrænsning.",
      strength:
        "Du kan opdage nye muligheder, reagere på ændrede krav og finde veje videre, når en oprindelig løsning ikke virker.",
      watch:
        "Når nye muligheder bliver ved med at dukke op, kan afslutning og fælles overblik blive presset. Andre kan blive usikre på, hvad de kan regne med, hvis retningen ændres uden en aftale.",
      action:
        "Giv næste undersøgelse en tidsramme og et konkret resultat: fx 30 minutter til to muligheder, derefter en anbefaling. Gem nye sidespor i en liste til senere.",
    },
    balanced: {
      reading:
        "Dine svar ligger tæt mellem planlægning og fleksibilitet. Du kan have brug for faste aftaler om målet og frihed til at vælge vejen. Overvej, hvilke dele af en opgave du gerne vil have afklaret, og hvilke du helst vil udforske undervejs.",
      action:
        "Del næste plan i to: Det ved vi og aftaler nu; det skal vi undersøge. Giv hver undersøgelse en tidsramme og et tidspunkt, hvor I vælger næste skridt.",
    },
    scenario: {
      title: "Når et sprint ændrer retning",
      situation:
        "Midt i et sprint opdager I en bedre måde at løse opgaven på. En i gruppen vil holde fast i planen; en anden vil ændre løsningen straks.",
      agreement:
        "Sammenlign værdien af ændringen med tiden og risikoen ved at skifte. Bevar et fælles sprintmål, og gør både beslutningen og det arbejde, I eventuelt udskyder, synligt.",
    },
    reflection: [
      "Hvilke aftaler gør det lettere for mig at komme i gang?",
      "Hvornår hjælper det mig at holde fast – og hvornår hjælper det at skifte retning?",
    ],
  },
  AT: {
    question: "Hvordan oplever du usikkerhed, fejl og feedback?",
    overview:
      "Reaktion på pres handler om, hvordan du selv beskriver dine reaktioner på usikkerhed og vurdering. En rolig tendens kan vise sig som tillid til egen vurdering og evne til at lægge fejl fra sig. En selvgranskende tendens kan vise sig som flere genovervejelser og større opmærksomhed på feedback.",
    nuance:
      "Dette er en refleksion over dine svar, ikke en vurdering af din mentale sundhed eller modstandskraft. Søvn, erfaring, opgavens sværhedsgrad og trygheden i gruppen kan påvirke oplevelsen. Dimensionen ændrer ikke din firebogstavsprofil og indgår ikke i gruppeforslagene.",
    left: {
      headline: "Du beskriver ofte ro og tillid til egen vurdering",
      reading:
        "Dine svar peger mod, at du som regel kan gå videre, når noget ikke lykkes, og vise arbejde, før det er perfekt. Det kan gøre det lettere at eksperimentere og tage imod en ny opgave, hvor du endnu ikke ved, om din første idé holder.",
      strength:
        "Du kan hjælpe med at bevare arbejdsro, sætte et mislykket forsøg i perspektiv og gøre det lettere for gruppen at prøve igen.",
      watch:
        "Din egen ro fortæller ikke nødvendigvis, hvordan de andre har det. Du kan også komme til at gå hurtigt videre fra feedback, som fortjener en ekstra undersøgelse.",
      action:
        "Efter næste demonstration: skriv én ting, der virkede, og én konkret ændring fra feedbacken. Spørg også gruppen, hvad der stadig føles usikkert.",
    },
    right: {
      headline: "Du beskriver mange overvejelser om din indsats",
      reading:
        "Dine svar peger mod, at usikkerhed og feedback kan fylde i dine tanker. Du genovervejer måske valg eller lægger mærke til forskellen mellem dit eget og andres arbejde. Det kan være hjælpsomt at gøre forventninger og næste skridt tydelige.",
      strength:
        "Din opmærksomhed på forbedringer kan hjælpe dig med at stille spørgsmål, søge feedback og opdage ting, du gerne vil lære mere om.",
      watch:
        "Hvis du bliver ved med at genvurdere en afsluttet opgave, kan det være svært at bruge feedbacken til et afgrænset næste skridt. Meget høje krav til dig selv kan gøre det svært at vise et tidligt udkast.",
      action:
        "Aftal med en makker, hvad “godt nok til feedback” betyder for næste udkast. Bed om feedback på ét konkret spørgsmål, og vælg derefter én forbedring ad gangen.",
    },
    balanced: {
      reading:
        "Dine svar ligger tæt mellem ro og selvgranskning. Du kan reagere forskelligt på en kendt opgave og på noget, du skal lære for første gang. Se efter, hvilke rammer der gør det lettere at bede om hjælp og bruge feedback.",
      action:
        "Tænk på to nylige opgaver: én, hvor du var tryg, og én, hvor du var usikker. Hvad var forskelligt i forventninger, tid, erfaring og støtte fra andre?",
    },
    scenario: {
      title: "Når demonstrationen ikke går som planlagt",
      situation:
        "En funktion fejler under jeres demo. En i gruppen er klar til at gå videre, mens en anden stadig tænker meget over, hvad fejlen siger om indsatsen.",
      agreement:
        "Skil observationen fra fortolkningen: Hvad skete der konkret, og hvad ved I endnu ikke? Aftal et lille næste skridt og en kort opfølgning, så både læring og usikkerhed får plads.",
    },
    reflection: [
      "Hvilken feedback gør det lettere for mig at tage næste skridt?",
      "Hvad kan jeg bede gruppen eller underviseren om, når en opgave føles uklar?",
    ],
  },
};

export function interpretDimension(id, value) {
  const dimension = dimensions.find((d) => d.id === id);
  if (!dimension || !Number.isInteger(value) || value < 0 || value > 100)
    throw new Error("Ukendt dimension eller ugyldig score.");
  const guide = dimensionGuides[id];
  const balanced = Math.abs(value - 50) < 10;
  const side = balanced ? "balanced" : value > 50 ? "left" : "right";
  const dominant = Math.max(value, 100 - value);
  const label = balanced ? "Begge sider kan være relevante" : dimension[side];
  return {
    dimension,
    guide,
    side,
    balanced,
    label,
    heading: balanced
      ? value === 50
        ? "Dine svar ligger midt mellem de to sider"
        : "Dine svar ligger tæt på midten"
      : guide[side].headline,
    tendency: balanced
      ? "Tæt på midten"
      : dominant >= 75
        ? `Tydelig tendens mod ${label.toLowerCase()}`
        : `Du hælder mod ${label.toLowerCase()}`,
    reading: guide[side].reading,
    action: guide[side].action,
  };
}

export function readingGuide(record) {
  const lines = [
    `SAMSPIL · DIN PERSONLIGE LÆSEGUIDE`,
    `${record.name} · ${record.code}`,
    "",
    "Et øjebliksbillede af dine selvrapporterede præferencer. Brug forklaringerne til refleksion, og vælg selv, hvad du genkender.",
    "Procenterne viser placering på svarskalaen, ikke evner eller sikkerhed. Begge sider af hver dimension kan være nyttige.",
    "",
  ];
  dimensions.forEach((d, i) => {
    const f = interpretDimension(d.id, record.scores[i]);
    lines.push(
      d.title.toUpperCase(),
      `${d.left}: ${record.scores[i]}% · ${d.right}: ${100 - record.scores[i]}%`,
      d.id === "AT"
        ? "Vises separat fra typekoden og bruges ikke til gruppeforslag."
        : "",
      f.guide.overview,
      "",
      f.heading,
      f.reading,
      "",
    );
    for (const side of ["left", "right"])
      lines.push(
        d[side].toUpperCase(),
        f.guide[side].reading,
        `Muligt bidrag: ${f.guide[side].strength}`,
        `Vær opmærksom på: ${f.guide[side].watch}`,
        "",
      );
    lines.push(
      f.guide.scenario.title,
      f.guide.scenario.situation,
      `En fælles aftale: ${f.guide.scenario.agreement}`,
      "",
      "PRØV DET I NÆSTE PROJEKT",
      f.action,
      "",
      "SPØRG DIG SELV",
      ...f.guide.reflection.map((q) => `• ${q}`),
      "",
      f.guide.nuance,
      "",
      "────────────────────────────────",
      "",
    );
  });
  return lines.join("\n");
}
