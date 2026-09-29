import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Code2,
  Download,
  Lightbulb,
  MessageCircle,
} from "lucide-react";
import { dimensions, types } from "./data.js";
import { interpretDimension, readingGuide } from "./feedback.js";
import { download } from "./engine.js";
import "./feedback.css";

export function DimensionFeedback({ record }) {
  const [expanded, setExpanded] = useState([]);
  const [showMethod, setShowMethod] = useState(false);
  const allOpen = expanded.length === dimensions.length;
  const type = types.find((t) => t.code === record.code);
  function jump(id) {
    setExpanded((current) =>
      current.includes(id) ? current : [...current, id],
    );
    const target = document.getElementById(`dimension-${id}`);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }
  return (
    <section
      className="dimension-section feedback-section"
      aria-labelledby="dimensions-title"
    >
      <div className="feedback-intro-row">
        <div className="feedback-intro">
          <span className="eyebrow">DIN PERSONLIGE LÆSEGUIDE</span>
          <h2 id="dimensions-title">Dine fem dimensioner</h2>
          <p>
            Bag dine typebogstaver ligger fem forskellige sider af din
            arbejdsstil. Her kan du undersøge, hvad dine svar peger på, og
            hvordan du kan bruge dem i hverdagen.
          </p>
          <p>
            Læs med dine egne erfaringer i baghovedet: Hvad genkender du? Hvad
            afhænger af situationen? Du kan tage noget med fra begge sider af
            hver dimension.
          </p>
        </div>
        {type && (
          <div className="feedback-figure">
            <img
              src={`/illustrations/${type.code.toLowerCase()}.svg`}
              alt=""
              width="240"
              height="240"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      <div className="feedback-reading-help">
        <CircleHelp size={22} aria-hidden="true" />
        <div>
          <h3>Sådan læser du procenterne</h3>
          <p>
            En fordeling på fx 70% / 30% viser, hvilken side dine svar samlet
            hælder mod. Det er en placering på vores svarskala – ikke en
            karakter eller et mål for dine evner. Tæt på 50/50 kan beskrivelser
            fra begge sider være særligt relevante. Farvefamilierne ovenfor
            viser, hvor tæt dine svar samlet ligger på lilla, grøn, blå og gul.
          </p>
          <button
            className="text-button"
            aria-expanded={showMethod}
            aria-controls="score-explanation"
            onClick={() => setShowMethod(!showMethod)}
          >
            {showMethod
              ? "Skjul forklaringen"
              : "Hvordan bliver mine svar til et resultat?"}{" "}
            <ChevronDown size={15} className={showMethod ? "rotated" : ""} />
          </button>
          <div
            id="score-explanation"
            hidden={!showMethod}
            className="score-explanation"
          >
            <p>
              Hver dimension bygger på 12 udsagn. Svarene vægtes lige, og nogle
              udsagn vender mod den modsatte side. Summen omsættes til en skala
              fra 0 til 100. 41–59 kalder vi tæt på midten; fra 60 hælder
              svarene mod en side, og fra 75 kalder vi tendensen tydelig. Det er
              hjælpekategorier i denne app, ikke videnskabeligt validerede
              grænser.
            </p>
            <p>
              En score på 100 betyder, at alle svar i dimensionen pegede længst
              muligt mod samme side. Det betyder ikke, at du altid handler
              sådan. De første fire dimensioner giver typebogstaverne; ved
              præcis 50 vises X. Reaktion på pres vises separat.
            </p>
            <a href="#/om">
              Læs om testens metode <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
      <nav className="dimension-jumps" aria-label="Læs om en dimension">
        {dimensions.map((d, i) => {
          const f = interpretDimension(d.id, record.scores[i]);
          return (
            <button
              key={d.id}
              onClick={() => jump(d.id)}
              style={{ "--dimension-color": d.color }}
            >
              <span className="dimension-jump-number">0{i + 1}</span>
              <span>
                <strong>{d.title}</strong>
                <small>
                  {f.balanced
                    ? "Tæt på midten"
                    : `${Math.max(record.scores[i], 100 - record.scores[i])}% ${f.label.toLowerCase()}`}
                </small>
              </span>
              <ChevronDown size={15} />
            </button>
          );
        })}
      </nav>
      <div className="reading-controls">
        <span>
          <BookOpen size={16} /> Udforsk én dimension ad gangen
        </span>
        <button
          className="text-button"
          onClick={() =>
            setExpanded(allOpen ? [] : dimensions.map((d) => d.id))
          }
        >
          {allOpen ? "Luk alle forklaringer" : "Åbn alle forklaringer"}{" "}
          <ChevronDown size={16} className={allOpen ? "rotated" : ""} />
        </button>
      </div>
      <div className="feedback-dimensions">
        {dimensions.map((d, i) => {
          const value = record.scores[i];
          const feedback = interpretDimension(d.id, value);
          const open = expanded.includes(d.id);
          return (
            <article
              className="feedback-dimension"
              key={d.id}
              style={{ "--dimension-color": d.color }}
              aria-labelledby={`dimension-${d.id}`}
            >
              <div className="feedback-card-top">
                <span className="dimension-kicker">
                  DIMENSION 0{i + 1}{" "}
                  <span>
                    /{" "}
                    {d.id === "AT"
                      ? "SUPPLERENDE PERSPEKTIV"
                      : `${d.id[0]} · ${d.id[1]}`}
                  </span>
                </span>
                <span className="tendency-badge">{feedback.tendency}</span>
              </div>
              <h3 id={`dimension-${d.id}`} tabIndex={-1}>
                {d.title}
              </h3>
              <p className="dimension-question">{feedback.guide.question}</p>
              <div className="feedback-score">
                <div className="feedback-score-labels">
                  <span>
                    <strong>{value}%</strong>
                    <span>{d.left}</span>
                  </span>
                  <span>
                    <strong>{100 - value}%</strong>
                    <span>{d.right}</span>
                  </span>
                </div>
                <div className="feedback-score-track" aria-hidden="true">
                  <span style={{ width: `${value}%` }} />
                  <i />
                </div>
                <div className="feedback-score-caption">
                  <span>To sider af samme dimension</span>
                  <span>Midtpunkt: 50/50</span>
                </div>
              </div>
              <div className="your-reading">
                <span className="eyebrow">HVAD DINE SVAR KAN FORTÆLLE</span>
                <h4>{feedback.heading}</h4>
                <p>{feedback.reading}</p>
              </div>
              <button
                className="dimension-expand"
                aria-expanded={open}
                aria-controls={`dimension-detail-${d.id}`}
                onClick={() =>
                  setExpanded((current) =>
                    open
                      ? current.filter((id) => id !== d.id)
                      : [...current, d.id],
                  )
                }
              >
                <span>
                  <BookOpen size={18} />
                  {open
                    ? `Vis mindre om ${d.title.toLowerCase()}`
                    : `Læs mere om ${d.title.toLowerCase()}`}
                </span>
                <ChevronDown className={open ? "rotated" : ""} size={19} />
              </button>
              <div
                className="dimension-detail"
                id={`dimension-detail-${d.id}`}
                hidden={!open}
              >
                <section className="dimension-meaning">
                  <h4>Hvad handler dimensionen om?</h4>
                  <p>{feedback.guide.overview}</p>
                </section>
                <div className="pole-comparison">
                  {["left", "right"].map((side) => (
                    <section
                      className={`pole-description ${feedback.side === side ? "emphasized" : ""}`}
                      key={side}
                    >
                      <div className="pole-heading">
                        <h4>{d[side]}</h4>
                        {feedback.side === side && (
                          <span>
                            <Check size={12} /> Din tendens
                          </span>
                        )}
                      </div>
                      <p>{feedback.guide[side].reading}</p>
                      <h5>Det kan du bidrage med</h5>
                      <p>{feedback.guide[side].strength}</p>
                      <h5>Vær opmærksom på</h5>
                      <p>{feedback.guide[side].watch}</p>
                    </section>
                  ))}
                </div>
                <section className="dimension-scenario">
                  <span className="eyebrow">
                    <Code2 size={16} /> I ET SOFTWAREPROJEKT
                  </span>
                  <h4>{feedback.guide.scenario.title}</h4>
                  <p>{feedback.guide.scenario.situation}</p>
                  <div className="shared-agreement">
                    <strong>En aftale, I kan prøve</strong>
                    <p>{feedback.guide.scenario.agreement}</p>
                  </div>
                </section>
                <div className="practice-reflection">
                  <section className="dimension-practice">
                    <Lightbulb size={24} />
                    <h4>Dit næste lille eksperiment</h4>
                    <p>{feedback.action}</p>
                  </section>
                  <section className="dimension-reflection">
                    <MessageCircle size={24} />
                    <h4>Spørg dig selv</h4>
                    <ul>
                      {feedback.guide.reflection.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </section>
                </div>
                <p className="dimension-nuance">
                  <CircleHelp size={17} />
                  {feedback.guide.nuance}
                </p>
              </div>
            </article>
          );
        })}
      </div>
      <section className="reading-takeaway">
        <div>
          <span className="eyebrow">FRA INDSIGT TIL HANDLING</span>
          <h3>Vælg én ting, du vil afprøve.</h3>
          <p>
            Du behøver ikke ændre alt på én gang. Find en beskrivelse, du
            genkender, vælg et lille eksperiment, og tal med din gruppe om, hvad
            I oplevede bagefter.
          </p>
          <ol>
            <li>
              <strong>Genkend:</strong> Find et konkret eksempel fra dit eget
              arbejde.
            </li>
            <li>
              <strong>Afprøv:</strong> Lav en tydelig aftale for næste opgave.
            </li>
            <li>
              <strong>Følg op:</strong> Hvad hjalp dig og de andre?
            </li>
          </ol>
        </div>
        <div className="reading-save">
          <BookOpen size={32} />
          <h4>Læs videre i dit eget tempo</h4>
          <p>
            Gem alle fem forklaringer med dine scorer som en tekstfil. Filen
            indeholder dit navn/alias og din profil.
          </p>
          <button
            className="button secondary pill"
            onClick={() =>
              download(
                "samspil-laeseguide.txt",
                readingGuide(record),
                "text/plain;charset=utf-8",
              )
            }
          >
            <Download size={16} /> Gem min læseguide
          </button>
          <a className="text-button" href="#/software">
            Flere øvelser til samarbejdet <ArrowRight size={15} />
          </a>
        </div>
      </section>
    </section>
  );
}
