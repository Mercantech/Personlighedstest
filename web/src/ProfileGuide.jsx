import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BatteryLow,
  BookOpen,
  ChevronDown,
  Code2,
  Compass,
  Download,
  Flag,
  Lightbulb,
  MessageCircle,
  Sparkles,
  Sprout,
  Users,
  Zap,
} from "lucide-react";
import { families, types } from "./data.js";
import { download } from "./engine.js";
import {
  profileGuides,
  profilePreferences,
  profileReadingGuide,
} from "./profile-content.js";
import "./profiles.css";

const chapters = [
  { id: "self", label: "Kend dig selv", icon: Compass },
  { id: "learning", label: "Sådan lærer du", icon: BookOpen },
  { id: "team", label: "I samarbejdet", icon: Users },
  { id: "software", label: "I softwareprojekter", icon: Code2 },
  { id: "growth", label: "Din udvikling", icon: Sprout },
];
const darkColors = {
  analysts: "#654778",
  diplomats: "#246347",
  sentinels: "#246b7e",
  explorers: "#755713",
};

function SectionHeading({ eyebrow, title, children }) {
  return (
    <header className="pg-section-heading">
      <span className="pg-kicker">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </header>
  );
}

function ProfileContent({ type, guide, chapter }) {
  if (chapter === "self")
    return (
      <>
        <div className="pg-story-grid">
          <article className="pg-story">
            <SectionHeading
              eyebrow="01 / KEND DIG SELV"
              title="Der er mere i dig end fire bogstaver"
            />
            {guide.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          <aside className="pg-energy" aria-label="Motivation og energi">
            <span className="pg-icon">
              <Compass size={25} aria-hidden="true" />
            </span>
            <h3>Det, der driver dig</h3>
            <p>{guide.motivation}</p>
            <div>
              <h4>
                <Zap size={16} aria-hidden="true" /> Det kan give energi
              </h4>
              <p>{guide.energy}</p>
            </div>
            <div>
              <h4>
                <BatteryLow size={16} aria-hidden="true" /> Det kan koste energi
              </h4>
              <p>{guide.drain}</p>
            </div>
          </aside>
        </div>
        <section className="pg-strength-section">
          <SectionHeading
            eyebrow="DIT BIDRAG"
            title="Styrker, du kan bringe i spil"
          >
            Se efter situationer, hvor du genkender dem — og situationer, hvor
            du bruger andre sider af dig selv.
          </SectionHeading>
          <div className="pg-strength-grid">
            {type.strengths.map((strength, index) => (
              <article className="pg-strength" key={strength}>
                <span className="pg-card-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{strength}</h3>
                <p>{guide.strengths[index]}</p>
              </article>
            ))}
          </div>
        </section>
        <details className="pg-letters">
          <summary>
            Hvad betyder {type.code}?{" "}
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <p>
            Bogstaverne samler fire præferencer. Du kan bruge begge sider af
            hver dimension, og dine vaner kan ændre sig med situationen.
          </p>
          <div className="pg-letter-grid">
            {profilePreferences(type.code).map((item) => (
              <div key={item.title}>
                <span className="pg-letter">{item.letter}</span>
                <span className="pg-kicker">{item.title}</span>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          <p className="pg-caption">
            Din reaktion på pres er den femte dimension. Den vises særskilt på
            din resultatside og er ikke en del af typekoden.
          </p>
        </details>
      </>
    );

  if (chapter === "learning")
    return (
      <>
        <SectionHeading
          eyebrow="02 / SÅDAN LÆRER DU"
          title="Find en arbejdsform, der hjælper dig videre"
        >
          Prøv disse tre greb, næste gang du møder noget nyt. Læg mærke til,
          hvad der hjælper dig med at forstå og selv kunne bruge stoffet.
        </SectionHeading>
        <ol className="pg-learning-steps">
          {guide.learning.map(([title, text], index) => (
            <li key={title}>
              <span className="pg-step-number" aria-hidden="true">
                0{index + 1}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="pg-two-up">
          <article className="pg-note">
            <Lightbulb size={25} aria-hidden="true" />
            <h3>Når du sidder fast</h3>
            <p>{guide.stuck}</p>
          </article>
          <article className="pg-note pg-note-tinted">
            <MessageCircle size={25} aria-hidden="true" />
            <h3>Feedback, du kan bruge</h3>
            <p>{guide.feedback}</p>
          </article>
        </div>
      </>
    );

  if (chapter === "team")
    return (
      <>
        <SectionHeading
          eyebrow="03 / I SAMARBEJDET"
          title="Giv hinanden bedre betingelser"
        >
          Din makker kan ikke se dine intentioner. Tydelige ord og små aftaler
          gør det lettere at forstå hinandens måde at arbejde på.
        </SectionHeading>
        <div className="pg-two-up">
          <article className="pg-note pg-note-tinted">
            <Users size={25} aria-hidden="true" />
            <h3>En aftale, der kan hjælpe</h3>
            <p>{type.teamwork}</p>
          </article>
          <article className="pg-note">
            <MessageCircle size={25} aria-hidden="true" />
            <h3>Sådan kan du blive misforstået</h3>
            <p>{guide.misread}</p>
          </article>
        </div>
        <figure className="pg-conversation">
          <figcaption>
            <MessageCircle size={18} aria-hidden="true" /> Prøv at sætte ord på
            det
          </figcaption>
          <blockquote>“{guide.phrase}”</blockquote>
          <p>Brug sætningen som inspiration, og sig det med dine egne ord.</p>
        </figure>
        <div className="pg-small-note">
          <Lightbulb size={22} aria-hidden="true" />
          <p>
            Spørg din makker, hvad de har brug for, frem for at gætte ud fra
            deres profil. Prøv forskellige roller, så I begge får mulighed for
            at lære.
          </p>
        </div>
      </>
    );

  if (chapter === "software")
    return (
      <>
        <SectionHeading
          eyebrow="04 / I SOFTWAREPROJEKTER"
          title="Fra præference til praksis"
        >
          Brug eksemplet til at undersøge dine vaner. Hvordan ville du selv
          reagere, og hvad ville din gruppe have brug for?
        </SectionHeading>
        <article className="pg-scenario">
          <div className="pg-scenario-intro">
            <span className="pg-kicker">
              <Code2 size={18} aria-hidden="true" /> EN SITUATION FRA PROJEKTET
            </span>
            <h3>{guide.scenario.title}</h3>
            <p>{guide.scenario.context}</p>
          </div>
          <div className="pg-scenario-paths">
            <div>
              <span className="pg-kicker">DIN MULIGE FØRSTE IMPULS</span>
              <p>{guide.scenario.instinct}</p>
            </div>
            <div>
              <span className="pg-kicker">ET ANDET GREB AT PRØVE</span>
              <p>{guide.scenario.alternative}</p>
            </div>
          </div>
        </article>
        <div className="pg-practice">
          <span className="pg-icon">
            <Code2 size={24} aria-hidden="true" />
          </span>
          <div>
            <span className="pg-kicker">EN LILLE FAGLIG ØVELSE</span>
            <h3>Tag det med ind i koden</h3>
            <p>{type.software}</p>
          </div>
        </div>
        <p className="pg-caption">
          Alle profiler kan arbejde med frontend, backend, test og
          projektledelse. Brug øvelsen til at udvide dine erfaringer og prøve
          nye roller.
        </p>
      </>
    );

  return (
    <>
      <SectionHeading eyebrow="05 / DIN UDVIKLING" title={guide.growth.title}>
        {guide.growth.text}
      </SectionHeading>
      <div className="pg-growth-grid">
        <article className="pg-experiment">
          <span className="pg-kicker">
            <Flag size={18} aria-hidden="true" /> DIT NÆSTE LILLE EKSPERIMENT
          </span>
          <h3>Prøv det i næste projekt</h3>
          <ol>
            {guide.growth.steps.map((step, i) => (
              <li key={step}>
                <span aria-hidden="true">{i + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
          <p className="pg-experiment-end">
            Følg op med en makker: Hvad skete der, og hvad vil du gentage eller
            justere?
          </p>
        </article>
        <aside className="pg-note">
          <Compass size={26} aria-hidden="true" />
          <h3>Når en styrke fylder for meget</h3>
          <p>{type.blindspot}</p>
          <p className="pg-caption">
            Se efter, hvornår vanen hjælper, og hvornår situationen kalder på
            noget andet. Du kan øve flere måder at reagere på.
          </p>
        </aside>
      </div>
      <section className="pg-reflections">
        <SectionHeading eyebrow="ET ØJEBLIK TIL DIG" title="Hvad genkender du?">
          Vælg et spørgsmål, og tænk på en oplevelse fra din egen hverdag. Åbn
          det for lidt hjælp til at komme i gang.
        </SectionHeading>
        {guide.growth.reflections.map(([question, hint], index) => (
          <details key={question}>
            <summary>
              <span className="pg-reflection-number" aria-hidden="true">
                0{index + 1}
              </span>
              <span>{question}</span>
              <ChevronDown size={19} aria-hidden="true" />
            </summary>
            <div>
              <p>{hint}</p>
              <p className="pg-caption">
                Prøv at fuldende: “Sidst jeg oplevede det, …” og “Næste gang vil
                jeg …”. Du kan skrive videre i den profilguide, du downloader.
              </p>
            </div>
          </details>
        ))}
      </section>
    </>
  );
}

function Guide({ code, embedded }) {
  const [chapter, setChapter] = useState("self");
  const [expanded, setExpanded] = useState(!embedded);
  const panelRef = useRef(null);
  const type = types.find((item) => item.code === code);
  const guide = profileGuides[code];
  if (!type || !guide)
    return (
      <section className="page empty">
        <h1>Ingen entydig profil</h1>
        <p>
          Udforsk profilerne og brug dimensionerne til at tale om dine
          præferencer.
        </p>
        <a href="#/typer" className="button">
          Se alle typer <ArrowRight size={18} />
        </a>
      </section>
    );
  const family = families[type.family];
  const chapterIndex = chapters.findIndex((item) => item.id === chapter);
  const nextChapter = chapters[(chapterIndex + 1) % chapters.length];
  const related = types.filter(
    (item) => item.family === type.family && item.code !== code,
  );
  const panelId = `profile-chapter-${code}`;
  function next() {
    setChapter(nextChapter.id);
    panelRef.current?.focus({ preventScroll: true });
    panelRef.current?.scrollIntoView({
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }
  function saveGuide() {
    download(
      `samspil-profil-${code.toLowerCase()}.txt`,
      profileReadingGuide(code),
      "text/plain;charset=utf-8",
    );
  }
  return (
    <section
      className={`profile-guide ${embedded ? "pg-embedded" : "page"}`}
      style={{
        "--family": family.color,
        "--pale": family.pale,
        "--profile-ink": darkColors[type.family],
      }}
    >
      {!embedded && (
        <div className="pg-topbar">
          <a href="#/typer" className="back-link">
            <ArrowLeft size={17} aria-hidden="true" /> Alle personlighedstyper
          </a>
          <span>DIN GUIDE TIL SELVFORSTÅELSE</span>
        </div>
      )}
      <div className="pg-hero">
        <div className="pg-hero-copy">
          <span className="pg-family-label">
            {family.name} <span aria-hidden="true">/</span> {type.code}
          </span>
          <h1>{type.name}</h1>
          <p className="pg-tagline">{guide.tagline}</p>
          <p className="pg-description">{type.description}</p>
          <ul className="pg-traits" aria-label="Mulige styrker">
            {type.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </div>
        <div className="pg-portrait">
          <span className="pg-portrait-code" aria-hidden="true">
            {code}
          </span>
          <img
            src={`/illustrations/${code.toLowerCase()}.svg`}
            alt={`${type.name} (${code})`}
            width="300"
            height="300"
          />
        </div>
      </div>
      <div className="pg-hero-footer">
        <span>
          <BookOpen size={17} aria-hidden="true" /> 5 kapitler{" "}
          <span className="pg-meta-dot" aria-hidden="true">
            ·
          </span>{" "}
          Læs i dit eget tempo
        </span>
        <button onClick={saveGuide}>
          <Download size={17} aria-hidden="true" /> Download profilguide
        </button>
      </div>
      <div className="pg-reading-note">
        <Sparkles size={21} aria-hidden="true" />
        <p>
          <strong>Læs med nysgerrighed.</strong> En profil beskriver mulige
          præferencer. Du afgør selv, hvad du genkender — dine erfaringer, evner
          og muligheder rækker ud over typen.
        </p>
      </div>
      {embedded && (
        <button
          className="pg-expand"
          aria-expanded={expanded}
          aria-controls={`profile-reading-${code}`}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Fold profilguiden sammen" : "Læs mere om din profil"}
          <ChevronDown
            className={expanded ? "pg-turned" : ""}
            size={20}
            aria-hidden="true"
          />
        </button>
      )}
      <div id={`profile-reading-${code}`} hidden={!expanded}>
        <nav className="pg-chapters" aria-label="Profilbeskrivelse">
          {chapters.map(({ id, label, icon: Icon }) => (
            <button
              id={`profile-nav-${code}-${id}`}
              key={id}
              aria-pressed={chapter === id}
              aria-controls={panelId}
              onClick={() => setChapter(id)}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>
        <div
          className="pg-panel"
          id={panelId}
          ref={panelRef}
          tabIndex={-1}
          role="region"
          aria-labelledby={`profile-nav-${code}-${chapter}`}
        >
          <ProfileContent
            key={chapter}
            type={type}
            guide={guide}
            chapter={chapter}
          />
        </div>
        <div className="pg-next">
          <span>
            0{chapterIndex + 1} <span>/ 05 kapitler</span>
          </span>
          <button onClick={next}>
            {chapterIndex === 4
              ? "Tilbage til overblikket"
              : `Næste: ${nextChapter.label}`}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      {!embedded && (
        <>
          <section className="pg-related">
            <div>
              <span className="pg-kicker">FLERE PERSPEKTIVER</span>
              <h2>Andre sider af {family.name.toLowerCase()}</h2>
              <p>Måske genkender du også noget af dig selv her.</p>
            </div>
            <div className="pg-related-grid">
              {related.map((item) => (
                <a href={`#/typer/${item.code}`} key={item.code}>
                  <img
                    src={`/illustrations/${item.code.toLowerCase()}.svg`}
                    alt=""
                    width="75"
                    height="85"
                    loading="lazy"
                  />
                  <div>
                    <span>{item.code}</span>
                    <h3>{item.name}</h3>
                  </div>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
          <div className="pg-bottom-cta">
            <div>
              <h2>Hvad fortæller dine egne svar?</h2>
              <p>Tag testen, og udforsk nuancerne i dine fem dimensioner.</p>
            </div>
            <a href="#/test" className="button">
              Tag personlighedstesten{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </>
      )}
    </section>
  );
}

export function Profile(props) {
  return <Guide key={props.code} {...props} />;
}
