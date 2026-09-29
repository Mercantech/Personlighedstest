import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Clock3,
  ShieldCheck,
  Users,
  Download,
  Upload,
  RotateCcw,
  Menu,
  X,
  Brain,
  Sprout,
  Layers,
  Compass,
  Code2,
  BookOpen,
  Lightbulb,
  SlidersHorizontal,
  Trash2,
  CircleHelp,
  CheckCheck,
  LogIn,
  LogOut,
} from "lucide-react";
import {
  dimensions,
  questions,
  types,
  families,
  learningPatterns,
  groupGuide,
  aboutGuide,
  MIN_TEST_LENGTH,
  answeredPrefixCount,
} from "./data.js";
import {
  INSTRUMENT,
  validAnswers,
  makeRecord,
  exportRecords,
  parseRecords,
  mergeRecords,
  makeGroups,
  groupsCsv,
  download,
  expandTypeCodes,
  neighborTypeCodes,
  padAnswers,
  dedupeByName,
  familyForCode,
  filterRecords,
} from "./engine.js";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "./styles.css";
import { DimensionFeedback } from "./DimensionFeedback.jsx";
import { Profile } from "./ProfileGuide.jsx";
import {
  beginLogin,
  getUserProfile,
  handleAuthCallback,
  isAuthCallbackPath,
  isAdmin,
  isLoggedIn,
  logout,
  finishAuthRedirect,
} from "./auth.js";
import {
  saveCloudCollectionItem,
  saveCloudResult,
  syncFromCloud,
  deleteCloudResult,
} from "./cloud.js";
import AdminDashboard from "./AdminDashboard.jsx";
import CollectionKit from "./CollectionKit.jsx";
import CollectionFilters from "./CollectionFilters.jsx";
import SpreadBars from "./SpreadBars.jsx";
import FamilyAffinity from "./FamilyAffinity.jsx";

const KEY = "samarbejde-v1";
const DRAFT_VERSION = 2;
const icons = { Brain, Sprout, Layers, Compass };
const SCALE_VALUES = [3, 2, 1, 0, -1, -2, -3];
const SCALE_LABELS = [
  "Meget enig",
  "Enig",
  "Lidt enig",
  "Neutral",
  "Lidt uenig",
  "Uenig",
  "Meget uenig",
];
const DIM_FIGURE = {
  EI: "ENFP",
  NS: "INTJ",
  TF: "ENFJ",
  JP: "ISTJ",
  AT: "ESTP",
};
function migrateDraft(draft) {
  if (!draft || typeof draft !== "object") return undefined;
  const answers = padAnswers(draft.answers);
  if (
    !validAnswers(answers, false) ||
    typeof draft.name !== "string" ||
    draft.name.length > 80
  )
    return undefined;
  const raw = Number.isInteger(draft.page) ? draft.page : 0;
  const maxPage = questions.length - 1;
  const page =
    draft.v === DRAFT_VERSION
      ? Math.max(0, Math.min(maxPage, raw))
      : Math.max(0, Math.min(maxPage, raw <= 9 ? raw * 6 : raw));
  return { ...draft, answers, page, v: DRAFT_VERSION };
}
function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (!v) return {};
    return {
      records: parseRecords(exportRecords(v.records || [])),
      result: v.result ? parseRecords(exportRecords([v.result]))[0] : null,
      draft:
        v.instrument === INSTRUMENT ? migrateDraft(v.draft) : undefined,
    };
  } catch {
    return {
      warning:
        "Gemte data kunne ikke indlæses. Importér en sikkerhedskopi, hvis du har en. Den gamle lagring er ikke overskrevet.",
    };
  }
}
const initial = load();
const blank = () => ({
  answers: Array(questions.length).fill(null),
  page: 0,
  name: "",
  v: DRAFT_VERSION,
});
function resolveSaveName(draft, user) {
  if (user) {
    const fromAuth = (user.name || user.email || "").trim();
    return fromAuth || "Min profil";
  }
  return draft.name.trim() || "Min profil";
}
function Icon({ family, size = 42 }) {
  const Component = icons[families[family].icon];
  return <Component size={size} strokeWidth={1.6} aria-hidden="true" />;
}
function Pill({ children }) {
  return <span className="pill">{children}</span>;
}
function TypeCode({ code }) {
  const f = families[types.find((t) => t.code === code)?.family];
  return (
    <span
      className="type-code"
      style={{ color: f?.color, background: f?.pale }}
    >
      {code}
    </span>
  );
}
const FIGURE_CODES = ["INTJ", "ENFP", "ISFJ", "ESTP"];
function TypeFigure({ code, size = 200, className = "" }) {
  const type = types.find((t) => t.code === code);
  if (!type) return null;
  return (
    <span
      className={`type-figure ${className}`}
      style={{ "--family": families[type.family].color }}
      aria-hidden="true"
    >
      <img
        src={`/illustrations/${code.toLowerCase()}.svg`}
        alt=""
        width={size}
        height={size}
        loading="lazy"
      />
    </span>
  );
}

function CompanionMorph({ code, beat, size = 200 }) {
  const [layers, setLayers] = useState([
    { code, beat, role: "in", settled: true },
  ]);

  useEffect(() => {
    setLayers((prev) => {
      const current = prev.find((layer) => layer.role === "in") || prev.at(-1);
      if (current.beat === beat && current.code === code) return prev;
      return [
        { ...current, role: "out", settled: false },
        { code, beat, role: "in", settled: false },
      ];
    });
    const clear = setTimeout(() => {
      setLayers((prev) =>
        prev
          .filter((layer) => layer.role === "in")
          .map((layer) => ({ ...layer, settled: true })),
      );
    }, 820);
    return () => clearTimeout(clear);
  }, [code, beat]);

  return (
    <div className="companion-morph test-immersive-figure" aria-hidden="true">
      {layers.map((layer) => (
        <span
          key={`${layer.role}-${layer.beat}-${layer.code}`}
          className={`companion-morph-layer is-${layer.role}${layer.settled ? " is-settled" : ""}`}
        >
          <span className="companion-morph-float">
            <TypeFigure code={layer.code} size={size} />
          </span>
        </span>
      ))}
    </div>
  );
}
function FigureStrip({ codes = FIGURE_CODES, size = "md", className = "" }) {
  return (
    <div className={`figure-strip figure-strip-${size} ${className}`} aria-hidden="true">
      {codes.map((code) => (
        <TypeFigure key={code} code={code} />
      ))}
    </div>
  );
}
function go(path) {
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: "instant" });
}
function useRoute() {
  const [route, set] = useState(location.hash.slice(1) || "/");
  useEffect(() => {
    const handler = () => {
      set(location.hash.slice(1) || "/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return route;
}

export function App() {
  const onCallback = isAuthCallbackPath();
  const route = useRoute();
  const [draft, setDraft] = useState(initial.draft || blank);
  const [records, setRecords] = useState(initial.records || []);
  const [result, setResult] = useState(initial.result || null);
  const [notice, setNotice] = useState(initial.warning || "");
  const [noticeAction, setNoticeAction] = useState(null);
  const [storageBlocked, setStorageBlocked] = useState(!!initial.warning);
  const [menu, setMenu] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [user, setUser] = useState(() => getUserProfile());
  const [cloudSyncedIds, setCloudSyncedIds] = useState(() => new Set());

  const flash = (text, action = null) => {
    setNotice(text);
    setNoticeAction(action);
  };

  useEffect(() => {
    if (storageBlocked || onCallback) return;
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ instrument: INSTRUMENT, draft, records, result }),
      );
    } catch {
      flash(
        "Browseren kunne ikke cache data. Eksportér dine resultater, før du lukker siden.",
      );
      setStorageBlocked(true);
    }
  }, [draft, records, result, storageBlocked, onCallback]);

  useEffect(() => {
    if (onCallback || !isLoggedIn()) {
      if (!isLoggedIn()) setUser(null);
      return;
    }
    let cancelled = false;
    setUser(getUserProfile());
    (async () => {
      try {
        const data = await syncFromCloud();
        if (cancelled || !data) return;
        if (data.current) setResult(data.current);
        const cloud = data.results || [];
        setCloudSyncedIds(new Set(cloud.map((r) => r.id)));
        setRecords((prev) => {
          const cloudIds = new Set(cloud.map((r) => r.id));
          const localOnly = prev.filter((r) => !cloudIds.has(r.id));
          return mergeRecords(cloud, localOnly);
        });
      } catch (error) {
        if (!cancelled) {
          flash(
            error.name === "TimeoutError" || error.name === "AbortError"
              ? "Sync tog for lang tid. Prøv igen for at hente din konto."
              : error.message,
            {
              label: "Prøv igen",
              run: () => window.location.reload(),
            },
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onCallback]);

  const immersive = route === "/test";
  useEffect(() => {
    if (onCallback) return;
    setMenu(false);
    document.title = `${route.startsWith("/typer") ? "Personlighedstyper" : route === "/grupper" ? "Gruppebygger" : route === "/admin" ? "Admin" : route === "/resultat" ? "Dit resultat" : route === "/software" ? "Samarbejde i software" : route === "/om" ? "Om testen" : route === "/test" ? "Din test" : "Personlighedstest"} · Samspil`;
    document.body.classList.toggle("immersive-test", immersive);
    return () => document.body.classList.remove("immersive-test");
  }, [route, immersive, onCallback]);

  const reset = () =>
    setConfirm({
      title: "Start en ny test?",
      text: "Dine nuværende testsvar nulstilles. Resultater i din samling bevares.",
      action: () => {
        setDraft(blank());
        setResult(null);
        go("/test");
      },
    });

  const complete = async () => {
    try {
      const name = resolveSaveName(draft, user);
      const length = answeredPrefixCount(draft.answers);
      if (length < MIN_TEST_LENGTH) {
        flash(
          `Besvar mindst ${MIN_TEST_LENGTH} udsagn, før du ser din profil.`,
        );
        return;
      }
      let next = result;
      if (
        !result ||
        result.name !== name ||
        result.length !== length ||
        JSON.stringify(result.answers) !== JSON.stringify(draft.answers)
      ) {
        next = makeRecord(name, draft.answers, { length });
        setResult(next);
      }
      go("/resultat");
      if (isLoggedIn() && next) {
        try {
          await saveCloudResult(next);
          setCloudSyncedIds((prev) => new Set([...prev, next.id]));
          flash("Dit resultat er gemt på din Mercantec-konto.");
        } catch (cloudError) {
          flash(`Kunne ikke gemme på kontoen: ${cloudError.message}`, {
            label: "Prøv igen",
            run: async () => {
              try {
                await saveCloudResult(next);
                setCloudSyncedIds((prev) => new Set([...prev, next.id]));
                flash("Dit resultat er gemt på din Mercantec-konto.");
              } catch (err) {
                flash(`Kunne ikke gemme på kontoen: ${err.message}`);
              }
            },
          });
        }
      } else if (next) {
        flash(
          "Resultatet er klar i denne browser. Log ind for at gemme det på din konto.",
        );
      }
    } catch (e) {
      flash(e.message);
    }
  };

  const add = async (r) => {
    try {
      setRecords(mergeRecords(records, [r]));
      if (isLoggedIn()) {
        try {
          await saveCloudCollectionItem(r);
          setCloudSyncedIds((prev) => new Set([...prev, r.id]));
          flash("Resultatet er gemt på din konto.");
        } catch (cloudError) {
          flash(`Kunne ikke gemme på kontoen: ${cloudError.message}`, {
            label: "Prøv igen",
            run: async () => {
              try {
                await saveCloudCollectionItem(r);
                setCloudSyncedIds((prev) => new Set([...prev, r.id]));
                flash("Resultatet er gemt på din konto.");
              } catch (err) {
                flash(`Kunne ikke gemme på kontoen: ${err.message}`);
              }
            },
          });
        }
      } else {
        flash(
          "Resultatet er midlertidigt i browseren. Log ind for at gemme på din konto.",
        );
      }
    } catch (e) {
      flash(e.message);
    }
  };

  if (onCallback) return <AuthCallback />;

  return (
    <>
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main").focus();
        }}
      >
        Spring til indhold
      </a>
      {!immersive && (
        <header className="header">
          <a
            className="brand"
            href="#/"
            aria-label="Samspil, til personlighedstesten"
          >
            <span className="brand-icon">
              <Users size={25} strokeWidth={2.2} />
            </span>
            <span>
              samspil<span className="brand-dot">.</span>
            </span>
          </a>
          <nav
            aria-label="Hovednavigation"
            className={menu ? "nav open" : "nav"}
          >
            {[
              ["/", "Personlighedstest"],
              ["/typer", "De 16 typer"],
              ["/software", "Software & samarbejde"],
              ["/grupper", "Gruppebygger"],
              ...(isAdmin(user) ? [["/admin", "Admin"]] : []),
            ].map(([path, label]) => (
              <a
                key={path}
                href={`#${path}`}
                className={
                  (
                    path === "/"
                      ? route === "/" ||
                        route === "/resultat" ||
                        route === "/test"
                      : route.startsWith(path)
                  )
                    ? "active"
                    : ""
                }
              >
                {label}
              </a>
            ))}
          </nav>
          <a href="#/om" className="header-about">
            <CircleHelp size={18} /> Om testen
          </a>
          <div className="header-auth">
            {user ? (
              <>
                <span className="header-user" title={user.email || user.sub}>
                  {user.name || user.email || "Bruger"}
                </span>
                <button
                  type="button"
                  className="text-button header-auth-btn"
                  onClick={() => logout()}
                >
                  <LogOut size={16} /> Log ud
                </button>
              </>
            ) : (
              <button
                type="button"
                className="button pill header-login"
                onClick={() => beginLogin()}
              >
                <LogIn size={16} /> Log ind
              </button>
            )}
          </div>
          <button
            className="icon-button menu-button"
            aria-label={menu ? "Luk menu" : "Åbn menu"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </header>
      )}
      <main
        id="main"
        tabIndex={-1}
        className={immersive ? "main-immersive" : undefined}
      >
        {route === "/" && <Home draft={draft} user={user} />}
        {route === "/test" && (
          <Test
            draft={draft}
            setDraft={setDraft}
            complete={complete}
            reset={reset}
            user={user}
          />
        )}
        {route === "/typer" && <Types />}
        {route.startsWith("/typer/") && (
          <Profile key={route} code={route.split("/")[2]} />
        )}
        {route === "/resultat" && (
          <Result
            record={result}
            onAdd={add}
            saved={records.some((r) => r.id === result?.id)}
            reset={reset}
            user={user}
          />
        )}
        {route === "/grupper" && (
          <Groups
            records={records}
            setRecords={setRecords}
            setNotice={flash}
            setConfirm={setConfirm}
            user={user}
            cloudSyncedIds={cloudSyncedIds}
            setCloudSyncedIds={setCloudSyncedIds}
            onRead={(record) => {
              setResult(record);
              go("/resultat");
            }}
          />
        )}
        {route === "/admin" && (
          <AdminDashboard
            user={user}
            setRecords={setRecords}
            setNotice={flash}
            setConfirm={setConfirm}
          />
        )}
        {route === "/software" && <Software />}
        {route === "/om" && <About />}
        {!["/", "/test", "/typer", "/resultat", "/grupper", "/admin", "/software", "/om"].includes(
          route,
        ) &&
          !route.startsWith("/typer/") && (
            <section className="page empty">
              <h1>Siden findes ikke</h1>
              <a href="#/test" className="button">
                Til testen <ArrowRight size={18} />
              </a>
            </section>
          )}
      </main>
      {!immersive && (
        <footer>
          <a className="brand footer-brand" href="#/">
            samspil.
          </a>
          <span>Kend dig selv. Forstå hinanden. Byg bedre sammen.</span>
          <a href="#/om">
            Metode & dine data <ArrowRight size={14} />
          </a>
          <p>
            Et selvstændigt undervisningsværktøj. Ikke tilknyttet
            16Personalities.
          </p>
        </footer>
      )}
      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          {noticeAction && (
            <button
              type="button"
              className="text-button toast-action"
              onClick={() => {
                const action = noticeAction;
                setNoticeAction(null);
                action.run();
              }}
            >
              {noticeAction.label}
            </button>
          )}
          <button
            className="icon-button"
            aria-label="Luk besked"
            onClick={() => {
              setNotice("");
              setNoticeAction(null);
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}
      {confirm && <Confirm {...confirm} onClose={() => setConfirm(null)} />}
    </>
  );
}
function AuthCallback() {
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    handleAuthCallback(params)
      .then(() => {
        if (cancelled) return;
        finishAuthRedirect();
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err.name === "TimeoutError" || err.name === "AbortError"
            ? "Login tog for lang tid. Tjek at API’et kører, og prøv igen."
            : err.message || "Login fejlede";
        setError(message);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <section className="page-shell empty-shell auth-callback">
      <div className="shell-intro">
        <Pill>MERCANTEC AUTH</Pill>
        <h1>{error ? "Login fejlede" : "Logger ind…"}</h1>
        <p>
          {error ||
            "Vi bytter din autorisationskode til tokens og henter din profil."}
        </p>
        {error && (
          <div className="actions">
            <a href="/#/" className="button display-cta">
              Til forsiden <ArrowRight size={18} />
            </a>
            <button
              type="button"
              className="button secondary pill"
              onClick={() => beginLogin()}
            >
              Prøv igen
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Confirm({ title, text, action, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.showModal();
  }, []);
  return (
    <dialog ref={ref} onCancel={onClose} className="confirm-dialog">
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="actions">
        <button className="button secondary" autoFocus onClick={onClose}>
          Annuller
        </button>
        <button
          className="button"
          onClick={() => {
            Promise.resolve(action()).finally(onClose);
          }}
        >
          Bekræft
        </button>
      </div>
    </dialog>
  );
}

function Home({ draft, user }) {
  const answered = answeredPrefixCount(draft.answers);
  const canSeeProfile = answered >= MIN_TEST_LENGTH;
  const remaining = questions.length - answered;

  return (
    <>
      <section className="test-hero">
        <div className="hero-side-figures" aria-hidden="true">
          <TypeFigure
            code="INTJ"
            size={200}
            className="hero-float hero-float-tl"
          />
          <TypeFigure
            code="ENFP"
            size={200}
            className="hero-float hero-float-bl"
          />
          <TypeFigure
            code="ISFJ"
            size={200}
            className="hero-float hero-float-tr"
          />
          <TypeFigure
            code="ESTP"
            size={200}
            className="hero-float hero-float-br"
          />
        </div>
        <div className="hero-core">
          <h1>
            Forskellige personligheder.
            <br />
            <span>Stærkere sammen.</span>
          </h1>
          <p>
            Lær dine arbejdspræferencer at kende – og opdag, hvad du
            <br className="desktop-break" /> bringer med ind i dit næste
            softwareprojekt.
          </p>
          <p className="length-picker-note">
            Mindst {MIN_TEST_LENGTH} udsagn for en profil. Du kan stoppe når som
            helst derefter — eller fortsætte op til {questions.length} for et
            skarpere billede.
          </p>
          <div className="hero-facts">
            <span>
              <Clock3 size={16} /> Fra ca. 5 minutter
            </span>
            <span>
              <CheckCheck size={18} /> {MIN_TEST_LENGTH}–{questions.length}{" "}
              udsagn
            </span>
            <span>
              <ShieldCheck size={17} />
              {user ? " Gemmes på din konto" : " Log ind for at gemme"}
            </span>
          </div>
          <div className="hero-cta">
            <a href="#/test" className="button display-cta">
              {answered > 0 ? "Fortsæt testen" : "Start testen"}{" "}
              <ArrowRight size={18} />
            </a>
            {answered > 0 && (
              <p className="hero-cta-note">
                Du har svaret på {answered}
                {canSeeProfile
                  ? ` udsagn${remaining > 0 ? ` · ${remaining} tilbage` : ""}`
                  : ` af ${MIN_TEST_LENGTH} (minimum til profil)`}
                .
              </p>
            )}
            {canSeeProfile && (
              <a href="#/resultat" className="text-button">
                Se din nuværende profil <ArrowRight size={16} />
              </a>
            )}
          </div>
        </div>
        <div className="steps">
          <article className="step blue">
            <TypeFigure code="ISFJ" size={220} className="step-figure" />
            <div className="step-copy">
              <Pill>TRIN 01</Pill>
              <h2>Vær dig selv</h2>
              <p>
                Svar ud fra din hverdag. Der er ingen rigtige eller forkerte
                svar.
              </p>
            </div>
          </article>
          <article className="step green">
            <TypeFigure code="ENFP" size={220} className="step-figure" />
            <div className="step-copy">
              <Pill>TRIN 02</Pill>
              <h2>Opdag din profil</h2>
              <p>
                Efter {MIN_TEST_LENGTH} udsagn kan du se din profil — og svare
                flere for at skærpe den.
              </p>
            </div>
          </article>
          <article className="step purple">
            <TypeFigure code="INTJ" size={220} className="step-figure" />
            <div className="step-copy">
              <Pill>TRIN 03</Pill>
              <h2>Byg bedre sammen</h2>
              <p>
                Brug jeres forskelle til at tale om roller, kode og godt
                samarbejde.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="wave-section band-explorers about-note">
        <div className="wave-inner test-reflection">
          <Lightbulb size={29} />
          <div>
            <h3>En samtalestarter, ikke en facitliste.</h3>
            <p>
              Din profil beskriver præferencer – ikke dine evner. Du kan udvikle
              dig og trives i mange forskellige roller.
            </p>
          </div>
          <a href="#/om">
            Sådan virker testen <ArrowRight size={17} />
          </a>
        </div>
      </section>
      <section className="bottom-cta">
        <FigureStrip size="sm" codes={["INFJ", "ENTP", "ESFJ"]} />
        <Pill>FRA SVAR TIL SAMTALE</Pill>
        <h2>
          Klar til at møde
          <br />
          de 16 perspektiver?
        </h2>
        <p>
          Udforsk profilerne, mens du svarer – eller gem dem til, når din egen
          type er klar.
        </p>
        <div className="actions">
          <a href="#/test" className="button display-cta">
            {answered > 0 ? "Fortsæt testen" : "Start testen"}{" "}
            <ArrowRight size={18} />
          </a>
          <a href="#/typer" className="button secondary pill">
            Se typegalleriet
          </a>
        </div>
      </section>
    </>
  );
}

function Test({ draft, setDraft, complete, reset, user }) {
  const [error, setError] = useState("");
  const [leaving, setLeaving] = useState(false);
  const advanceRef = useRef(null);
  const lastIndex = questions.length - 1;
  const count = answeredPrefixCount(draft.answers);
  const index = Math.max(
    0,
    Math.min(lastIndex, Number.isInteger(draft.page) ? draft.page : 0),
  );
  const q = questions[index];
  const dim = dimensions.find((d) => d.id === q.dimension);
  const figureCode = DIM_FIGURE[q.dimension] || "ENFP";
  const answered = draft.answers[index] !== null;
  const progress = (count / questions.length) * 100;
  const ring = 2 * Math.PI * 42;
  const canFinish = count >= MIN_TEST_LENGTH;
  const loggedIn = Boolean(user);
  const showNameField = canFinish && !loggedIn;

  useEffect(() => () => clearTimeout(advanceRef.current), []);

  const goTo = (nextIndex) => {
    if (leaving) return;
    setLeaving(true);
    clearTimeout(advanceRef.current);
    const target = Math.max(0, Math.min(lastIndex, nextIndex));
    advanceRef.current = setTimeout(() => {
      setDraft((current) => ({
        ...current,
        page: target,
        v: DRAFT_VERSION,
      }));
      setLeaving(false);
      setError("");
    }, 360);
  };

  const answer = (value) => {
    if (leaving) return;
    const answers = [...draft.answers];
    answers[index] = value;
    const nextDraft = { ...draft, answers, v: DRAFT_VERSION };
    setDraft(nextDraft);
    setError("");
    if (index < lastIndex) {
      setLeaving(true);
      clearTimeout(advanceRef.current);
      advanceRef.current = setTimeout(() => {
        setDraft({
          ...nextDraft,
          page: index + 1,
          v: DRAFT_VERSION,
        });
        setLeaving(false);
      }, 360);
    }
  };

  const tryComplete = () => {
    const prefix = answeredPrefixCount(draft.answers);
    if (prefix < MIN_TEST_LENGTH) {
      setError(`Besvar mindst ${MIN_TEST_LENGTH} udsagn, før du ser din profil.`);
      return;
    }
    complete();
  };

  const submit = (e) => {
    e.preventDefault();
    if (draft.answers[index] === null) {
      setError("Vælg et svar, før du går videre.");
      document.querySelector(`#${q.id} input`)?.focus({ preventScroll: true });
      return;
    }
    if (index < lastIndex) {
      goTo(index + 1);
      return;
    }
    tryComplete();
  };

  return (
    <section
      className="test-immersive"
      style={{ "--dimension-color": dim?.color || "var(--teal)" }}
    >
      <div className="test-immersive-bar">
        <a
          className="brand test-immersive-brand"
          href="#/"
          aria-label="Luk testen og gå til forsiden"
        >
          <span className="brand-icon">
            <Users size={22} strokeWidth={2.2} />
          </span>
          <span>
            samspil<span className="brand-dot">.</span>
          </span>
        </a>
        <div className="test-progress-ring" aria-hidden="true">
          <svg viewBox="0 0 100 100" width="56" height="56">
            <circle className="test-progress-bg" cx="50" cy="50" r="42" />
            <circle
              className="test-progress-fg"
              cx="50"
              cy="50"
              r="42"
              style={{
                strokeDasharray: `${ring}`,
                strokeDashoffset: `${ring - (progress / 100) * ring}`,
                stroke: dim?.color || "var(--teal)",
              }}
            />
          </svg>
          <span>
            <strong>{count}</strong>
            <small>/{questions.length}</small>
          </span>
        </div>
        <button
          type="button"
          className="icon-button test-immersive-close"
          aria-label="Luk testen"
          onClick={() => go("/")}
        >
          <X size={22} />
        </button>
      </div>

      <div className="test-immersive-stage">
        <CompanionMorph code={figureCode} beat={index} size={200} />
        <div className="test-immersive-copy">
          <span className="eyebrow">
            UDSAGN {index + 1} AF {questions.length}
            {dim ? ` · ${dim.title.toUpperCase()}` : ""}
            {count >= MIN_TEST_LENGTH ? " · PROFIL KLAR" : ""}
          </span>
        </div>
        <div className="test-milestones" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => {
            const mark = MIN_TEST_LENGTH + i * 30;
            return (
              <span
                key={mark}
                className={
                  count >= mark ? "done" : count >= mark - 30 ? "active" : ""
                }
              />
            );
          })}
        </div>
        <form className="test-immersive-form" onSubmit={submit}>
          <fieldset
            id={q.id}
            className={`question focus-question ${answered ? "answered" : ""} ${leaving ? "is-leaving" : "is-entering"}`}
            key={q.id}
          >
            <legend>
              <span className="question-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              {q.text}
            </legend>
            <div className="scale">
              <span className="agree scale-label">Enig</span>
              <div className="scale-options">
                {SCALE_VALUES.map((value, j) => (
                  <label
                    className={`choice ${value > 0 ? "positive" : value < 0 ? "negative" : "neutral"} size-${Math.abs(value)}`}
                    key={value}
                    title={SCALE_LABELS[j]}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={value}
                      checked={draft.answers[index] === value}
                      aria-label={SCALE_LABELS[j]}
                      onChange={() => answer(value)}
                    />
                    <span>
                      <Check size={22} strokeWidth={2.5} />
                    </span>
                  </label>
                ))}
              </div>
              <span className="disagree scale-label">Uenig</span>
            </div>
          </fieldset>
          {showNameField && (
            <div className="name-field">
              <label htmlFor="student-name">
                Navn eller alias <span>(valgfrit)</span>
              </label>
              <input
                id="student-name"
                maxLength={80}
                value={draft.name}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    name: e.target.value,
                    v: DRAFT_VERSION,
                  })
                }
                placeholder="Fx Elev 12"
              />
              <p>Vises på dit resultat og i den fil, du selv vælger at dele.</p>
            </div>
          )}
          {canFinish && loggedIn && (
            <p className="auth-save-note">
              Resultatet gemmes som{" "}
              <strong>{resolveSaveName(draft, user)}</strong>.
            </p>
          )}
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <div className="test-actions">
            <button
              type="button"
              className="text-button"
              disabled={index === 0 || leaving}
              onClick={() => goTo(index - 1)}
            >
              <ArrowLeft size={18} /> Tilbage
            </button>
            <div className="test-actions-end">
              {canFinish && index < lastIndex && (
                <button
                  type="button"
                  className="button pill"
                  disabled={leaving}
                  onClick={tryComplete}
                >
                  Se profil nu <ArrowRight size={19} />
                </button>
              )}
              {index === lastIndex ? (
                <button
                  type="submit"
                  className="button pill"
                  disabled={leaving || count < MIN_TEST_LENGTH}
                >
                  Se min profil <ArrowRight size={19} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="button pill secondary"
                  disabled={leaving}
                >
                  Næste <ArrowRight size={19} />
                </button>
              )}
            </div>
          </div>
        </form>
        <div className="test-footnote">
          <span>
            <ShieldCheck size={16} /> Udkast caches i browseren
            {count < MIN_TEST_LENGTH
              ? ` · ${MIN_TEST_LENGTH - count} til profil`
              : count < questions.length
                ? " · du kan stoppe eller fortsætte"
                : ""}
            .
          </span>
          {count > 0 && (
            <button className="text-button" onClick={reset}>
              <RotateCcw size={14} /> Start forfra
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function Types() {
  const [filter, setFilter] = useState("all");
  return (
    <section className="types-page">
      <div className="page-intro types-intro">
        <Pill>16 PERSPEKTIVER PÅ SAMARBEJDE</Pill>
        <h1>Personlighedstyper</h1>
        <p>
          Udforsk profilerne. Genkend en styrke, bliv nysgerrig på en forskel,
          <br className="desktop-break" /> og tag samtalen med ind i dit team.
        </p>
        <a href="#/test" className="button types-test-link">
          Find din personlighedstype <ArrowRight size={18} />
        </a>
      </div>
      <div className="filters" aria-label="Filtrér typer">
        {[
          ["all", "Alle 16 typer"],
          ...Object.entries(families).map(([k, f]) => [k, f.name]),
        ].map(([key, label]) => (
          <button
            key={key}
            className={filter === key ? "selected" : ""}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>
      {Object.entries(families)
        .filter(([k]) => filter === "all" || filter === k)
        .map(([key, f]) => (
          <section
            className={`family-section family-${key}`}
            key={key}
            style={{ "--family": f.color, "--pale": f.pale }}
          >
            <div className="family-heading">
              <h2>{f.name}</h2>
              <p>{f.intro}</p>
            </div>
            <div className="type-grid">
              {types
                .filter((t) => t.family === key)
                .map((t) => (
                  <a
                    href={`#/typer/${t.code}`}
                    className="type-card"
                    key={t.code}
                  >
                    <div className="type-art">
                      <img
                        src={`/illustrations/${t.code.toLowerCase()}.svg`}
                        alt={`${t.name} (${t.code}) – illustreret personlighedstype`}
                        width="300"
                        height="300"
                        loading={key === "analysts" ? "eager" : "lazy"}
                      />
                    </div>
                    <div className="type-card-copy">
                      <h3>{t.name}</h3>
                      <TypeCode code={t.code} />
                      <p>{t.description}</p>
                      <span className="type-link">
                        Mød {t.name.toLowerCase()} <ArrowRight size={17} />
                      </span>
                    </div>
                  </a>
                ))}
            </div>
          </section>
        ))}
      <section className="bottom-cta types-bottom-cta">
        <FigureStrip size="sm" codes={["INTP", "ENFJ", "ISTJ"]} />
        <Pill>FRA TYPE TIL TEAM</Pill>
        <h2>
          Forskellige styrker.
          <br />
          Et fælles projekt.
        </h2>
        <p>
          Tag din profil med ind i gruppen, og tal om, hvordan I bedst bygger
          noget sammen.
        </p>
        <div className="actions">
          <a href="#/test" className="button">
            Tag testen <ArrowRight size={18} />
          </a>
          <a href="#/grupper" className="button secondary">
            Åbn gruppebyggeren <Users size={18} />
          </a>
        </div>
      </section>
    </section>
  );
}
function Result({ record, onAdd, saved, reset, user }) {
  if (!record)
    return (
      <section className="page-shell empty-shell">
        <div className="shell-intro">
          <FigureStrip size="lg" codes={["INFP"]} className="empty-figure" />
          <Pill>DIN PROFIL VENTER</Pill>
          <h1>
            Din profil starter
            <br />
            med dig
          </h1>
          <p>
            Gennemfør testen for at se dit resultat. Gemte profiler finder du i
            gruppebyggeren.
          </p>
          <div className="actions">
            <a href="#/test" className="button display-cta">
              Fortsæt testen <ArrowRight size={18} />
            </a>
            <a href="#/grupper" className="button secondary pill">
              Se samling
            </a>
          </div>
        </div>
      </section>
    );
  const type = types.find((t) => t.code === record.code);
  return (
    <section className="page result-page">
      <div className="result-topline">
        <Pill>
          <CheckCheck size={15} /> DIN TEST ER GENNEMFØRT
        </Pill>
        <span>{record.name}</span>
      </div>
      {record.length < 60 && (
        <aside className="balanced-note short-test-note">
          <Lightbulb size={22} />
          <div>
            <strong>
              Baseret på {record.length} udsagn
              {record.length < 60
                ? " — mere usikkerhed tæt på midten."
                : "."}
            </strong>
            <p>
              Du kan svare flere udsagn (op til {questions.length}) og få en
              opdateret vurdering.
            </p>
          </div>
        </aside>
      )}
      {record.length >= 60 && record.length < questions.length && (
        <aside className="balanced-note short-test-note">
          <Lightbulb size={22} />
          <div>
            <strong>Baseret på {record.length} udsagn.</strong>
            <p>
              Fortsæt gerne — flere svar kan skærpe placeringen på
              dimensionerne.
            </p>
          </div>
        </aside>
      )}
      {!user && (
        <aside className="balanced-note short-test-note">
          <LogIn size={22} />
          <div>
            <strong>Gem resultatet på din konto</strong>
            <p>
              Log ind med Mercantec Auth, så resultatet følger dig på tværs af
              enheder. Uden login ligger det kun midlertidigt i denne browser.
            </p>
            <button type="button" className="button pill" onClick={beginLogin}>
              Log ind <ArrowRight size={16} />
            </button>
          </div>
        </aside>
      )}
      {type ? (
        <>
          <Profile code={record.code} embedded />
          {record.balanced && (
            <aside className="balanced-note">
              <Lightbulb size={22} />
              <div>
                <strong>Én eller flere dimensioner ligger tæt på midten.</strong>
                <p>
                  Det er ofte dér, der er mest at snakke om. Start med dem i
                  læseguiden nedenfor — begge sider kan være relevante for dig.
                </p>
              </div>
              <a href="#dimensions-title" className="text-button">
                Se dimensionerne <ArrowRight size={16} />
              </a>
            </aside>
          )}
        </>
      ) : (
        <MidProfile code={record.code} />
      )}
      <FamilyAffinity scores={record.scores} />
      <DimensionFeedback key={record.id} record={record} />
      <section className="save-panel">
        <div>
          <h2>Tag din profil med videre</h2>
          <p>
            Download en resultatfil til din underviser, eller føj den til
            samlingen på denne computer.
          </p>
          <small>
            Filen indeholder dit navn/alias, alle svar, resultat og tidspunkt.
            Del den kun med dem, du ønsker.
          </small>
        </div>
        <div className="save-actions">
          {record.length < questions.length && (
            <a href="#/test" className="button pill">
              Svar flere udsagn <ArrowRight size={17} />
            </a>
          )}
          <button
            className="button pill"
            onClick={() =>
              download("samspil-resultat.json", exportRecords([record]))
            }
          >
            <Download size={18} /> Download resultat
          </button>
          <button
            className="button secondary pill"
            disabled={saved}
            onClick={() => onAdd(record)}
          >
            {saved ? <Check size={18} /> : <Users size={18} />}
            {saved ? "Gemt i samling" : "Føj til lokal samling"}
          </button>
        </div>
      </section>
      <button className="text-button" onClick={reset}>
        <RotateCcw size={16} /> Tag testen igen
      </button>
    </section>
  );
}

function MidProfile({ code }) {
  const all = expandTypeCodes(code);
  const neighbors = neighborTypeCodes(code, 4);
  const xCount = [...code].filter((ch) => ch === "X").length;
  const slots = dimensions.slice(0, 4).map((dim, i) => ({
    letter: code[i],
    dim,
    isX: code[i] === "X",
  }));

  return (
    <section className="mid-profile">
      <div className="mid-profile-hero">
        <FigureStrip codes={neighbors} size="md" className="mid-hero-figures" />
        <Pill>FLERE SIDER I DIG</Pill>
        <h1>
          Din profil rummer
          <br />
          <span>flere sider</span>
        </h1>
        <p className="mid-lead">
          {xCount === 1
            ? "Du ligger præcis midt på én dimension — så din kode har et X. Det er ikke en fejl. Det betyder, at du kan trække på begge poler."
            : `Du ligger præcis midt på ${xCount} dimensioner — derfor har din kode ${xCount} X’er. Det er ikke en fejl. Det betyder, at flere sider af dig kan være lige relevante.`}
        </p>
        <div className="mid-code" aria-label={`Typekode ${code}`}>
          {slots.map(({ letter, dim, isX }) => (
            <div
              key={dim.id}
              className={`mid-code-slot${isX ? " is-x" : ""}`}
              style={{ "--slot": dim.color }}
            >
              <strong>{letter}</strong>
              <span>{dim.title}</span>
              <small>
                {isX
                  ? `${dim.left} · ${dim.right}`
                  : letter === dim.id[0]
                    ? dim.left
                    : dim.right}
              </small>
            </div>
          ))}
        </div>
      </div>

      <div className="mid-neighbors">
        <div className="mid-neighbors-copy">
          <span className="eyebrow">PROFILER DU STÅR MELLEM</span>
          <h2>
            {all.length === 2
              ? "To retninger, der begge kan passe dig"
              : all.length <= 4
                ? "Retninger, der alle kan passe dig"
                : "Et udsnit af retninger, der kan passe dig"}
          </h2>
          <p>
            Udforsk figurerne nedenfor. Brug dem som spejl — ikke som facit — og
            læs bagefter dine fem dimensioner for den præcise nuancering.
          </p>
        </div>
        <div className="mid-neighbor-grid">
          {neighbors.map((neighbor) => {
            const t = types.find((item) => item.code === neighbor);
            const family = families[t?.family];
            return (
              <a
                key={neighbor}
                href={`#/typer/${neighbor}`}
                className="mid-neighbor-card"
                style={{ "--family": family?.color, "--pale": family?.pale }}
              >
                <div className="mid-neighbor-art">
                  <img
                    src={`/illustrations/${neighbor.toLowerCase()}.svg`}
                    alt={`${t?.name || neighbor} – illustreret personlighedstype`}
                    width={160}
                    height={160}
                  />
                </div>
                <TypeCode code={neighbor} />
                <strong>{t?.name || neighbor}</strong>
                <span>
                  Se profilen <ArrowRight size={15} />
                </span>
              </a>
            );
          })}
        </div>
        {all.length > neighbors.length && (
          <p className="mid-more">
            Plus {all.length - neighbors.length} andre mulige retninger —{" "}
            <a href="#/typer">udforsk hele typegalleriet</a>.
          </p>
        )}
      </div>

      <div className="mid-guide">
        <Lightbulb size={28} />
        <div>
          <h3>Midtpunkt er en styrke i projektet</h3>
          <p>
            Når du kan se begge sider, bliver du ofte den, der oversætter mellem
            holdkammerater. Vælg bevidste aftaler: hvornår trækker du den ene
            vej, og hvornår den anden?
          </p>
        </div>
        <div className="actions">
          <a href="#dimensions-title" className="button pill">
            Læs dine dimensioner <ArrowRight size={18} />
          </a>
          <a href="#/typer" className="button secondary pill">
            Typegalleriet
          </a>
        </div>
      </div>
    </section>
  );
}

function Groups({
  records,
  setRecords,
  setNotice,
  setConfirm,
  onRead,
  user,
  cloudSyncedIds,
  setCloudSyncedIds,
}) {
  const [size, setSize] = useState(4);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("");
  const [code, setCode] = useState("");
  const [hasX, setHasX] = useState("");
  const [minLength, setMinLength] = useState(null);
  const [maxLength, setMaxLength] = useState(null);
  const [seed, setSeed] = useState(1);
  const [selected, setSelected] = useState(null);
  const [groupMode, setGroupMode] = useState("variety");
  const [lockA, setLockA] = useState("");
  const [lockB, setLockB] = useState("");
  const [sepA, setSepA] = useState("");
  const [sepB, setSepB] = useState("");
  const fileRef = useRef(null);
  const importFiles = async (e) => {
    const input = e.target;
    const files = [...input.files];
    try {
      if (files.reduce((n, f) => n + f.size, 0) > 5_000_000)
        throw new Error("Vælg højst 5 MB resultatfiler ad gangen.");
      const batches = await Promise.all(
        files.map(async (f) => parseRecords(await f.text())),
      );
      let updated = records;
      for (const batch of batches) updated = mergeRecords(updated, batch);
      setRecords(updated);
      setGroups([]);
      setNotice(
        `${updated.length - records.length} nye resultater importeret. Dubletter med samme id blev sprunget over.`,
      );
    } catch (err) {
      setNotice(err.message);
    }
    input.value = "";
  };
  const visible = filterRecords(records, {
    search,
    family,
    code,
    hasX,
    minLength,
    maxLength,
    typesList: types,
  });
  const removeRecord = (r) => {
    setConfirm({
      title: `Fjern ${r.name}?`,
      text: user
        ? "Resultatet fjernes fra din konto og denne enheds cache."
        : "Resultatet fjernes fra denne enheds cache. Eksporterede filer ændres ikke.",
      action: async () => {
        try {
          if (user) {
            await deleteCloudResult(r.id);
            setCloudSyncedIds((prev) => {
              const next = new Set(prev);
              next.delete(r.id);
              return next;
            });
          }
          setRecords(records.filter((item) => item.id !== r.id));
          setGroups([]);
          setNotice(
            user
              ? "Resultatet er fjernet fra din konto."
              : "Resultatet er fjernet fra cachen.",
          );
        } catch (err) {
          setNotice(err.message, {
            label: "Prøv igen",
            run: () => removeRecord(r),
          });
        }
      },
    });
  };
  const runDedupe = () => {
    const { kept, removed } = dedupeByName(records);
    if (!removed.length) {
      setNotice("Ingen ældre dubletter med samme navn.");
      return;
    }
    setConfirm({
      title: `Fjern ${removed.length} ældre profiler?`,
      text: "Beholder den nyeste profil pr. navn i den lokale samling.",
      action: () => {
        setRecords(kept);
        setGroups([]);
        setNotice(`${removed.length} ældre profiler fjernet.`);
      },
    });
  };
  const formGroups = () => {
    const next = makeGroups(visible, size, seed, {
      mode: groupMode,
      lockIds: [lockA, lockB].filter(Boolean),
      separateIds: [sepA, sepB].filter(Boolean),
      familyOf: (r) => familyForCode(r.code, types),
    });
    setGroups(next);
    setSeed(seed + 1);
  };
  const printGroupCards = () => {
    const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
    if (!win) return;
    const cards = groups
      .map(
        (group, i) =>
          `<article style="break-inside:avoid;border:1px solid #ccc;padding:1rem;margin:0 0 1rem;border-radius:8px">
            <h2>Gruppe ${i + 1}</h2>
            <ul>${group
              .map((r) => {
                const fam = familyForCode(r.code, types);
                const color = fam ? families[fam].color : "#333";
                return `<li style="margin:.4rem 0"><span style="display:inline-block;width:.75rem;height:.75rem;border-radius:50%;background:${color};margin-right:.4rem"></span>${r.name} · <strong>${r.code}</strong></li>`;
              })
              .join("")}</ul>
          </article>`,
      )
      .join("");
    win.document.write(`<!doctype html><html lang="da"><head><meta charset="utf-8"/><title>Gruppekort</title>
<style>body{font-family:Georgia,serif;padding:1.5rem;color:#1a1a1a} h1{margin-top:0}</style></head>
<body><h1>Samspil · gruppekort</h1>${cards}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };
  return (
    <section className="page-shell groups-page">
      <div className="shell-intro groups-intro">
        <Pill>
          <Users size={15} /> TIL UNDERVISEREN
        </Pill>
        <h1>
          Gode grupper begynder
          <br />
          med nysgerrighed.
        </h1>
        <p>
          Saml holdets profiler, forstå forskellen på ens og blandede grupper,
          og brug værktøjet som et startpunkt – ikke som facit. Den endelige
          beslutning tager I sammen ud fra faglige mål, relationer og ønsker.
        </p>
        <FigureStrip
          className="groups-intro-figures"
          codes={["ENTP", "ISFJ", "ENFJ", "ESTP"]}
        />
      </div>

      <CollectionKit compact />

      <div className="groups-stats-wrap">
        <div className="group-stats">
          <article>
            <span>Profiler i samlingen</span>
            <strong>{records.length.toString().padStart(2, "0")}</strong>
          </article>
          <article>
            <span>Efter filter</span>
            <strong>
              {visible.length.toString().padStart(2, "0")}
            </strong>
          </article>
          <article>
            <span>Opbevaring</span>
            <strong className="local-stat">
              <ShieldCheck size={25} />
              {user ? " Din konto" : " Browser-cache"}
            </strong>
          </article>
        </div>
        <p className="account-status-banner">
          {user
            ? isAdmin(user)
              ? "Som admin kan du også hente alle tests fra Admin-dashboardet."
              : "Profiler synces til din Mercantec-konto. De er ikke delt med et hold endnu."
            : "Udkast og midlertidige resultater caches i denne browser. Log ind for at gemme på din konto."}
        </p>
      </div>

      <div className="pattern-stack group-guide-stack">
        {groupGuide.map((section, i) => (
          <section
            className={`wave-section pattern-band ${section.band} ${i % 2 === 1 ? "pattern-flip" : ""}`}
            key={section.name}
          >
            <div className="wave-inner">
              <div className="pattern-copy">
                <div className="pattern-heading">
                  <span className="wave-kicker">
                    0{i + 1} · {section.name}
                  </span>
                  <h2>{section.title}</h2>
                </div>
                <p className="pattern-lead">{section.lead}</p>
                <ul className="pattern-points">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="experiment">
                  <strong>Prøv det med holdet</strong>
                  <span>{section.try}</span>
                </div>
              </div>
              <div className="pattern-visual">
                <TypeFigure
                  code={section.figure}
                  size={320}
                  className="pattern-figure"
                />
                <span className="pattern-number" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="wave-section band-diplomats">
        <div className="wave-inner groups-tool-inner">
          <div className="groups-tool-heading">
            <div>
              <span className="wave-kicker">SAMLING & FORSLAG</span>
              <h2>Din lokale samling</h2>
              <p>
                Importér JSON-filer, hent fra Admin, eller brug den lokale cache.
                Filtrér samlingen, se spredningen, og dan grupper med variation
                eller familier samlet.
              </p>
            </div>
            <TypeFigure code="INFJ" size={180} className="groups-tool-figure" />
          </div>
          <div className="collection-heading">
            <div>
              <h3>Importerede profiler</h3>
              <p>Én eller flere resultatfiler ad gangen.</p>
            </div>
            <div className="actions">
              <input
                type="file"
                multiple
                accept=".json,application/json"
                ref={fileRef}
                onChange={importFiles}
                hidden
              />
              <button
                className="button secondary pill"
                disabled={!records.length}
                onClick={() =>
                  download("samspil-samling.json", exportRecords(records))
                }
              >
                <Download size={17} /> Eksportér samling
              </button>
              <button
                className="button pill"
                onClick={() => fileRef.current.click()}
              >
                <Upload size={17} /> Importér resultater
              </button>
            </div>
          </div>
          {!records.length ? (
            <div className="empty-collection">
              <FigureStrip size="md" codes={["ENTJ", "ISFP", "ESFP"]} />
              <h3>Her begynder jeres fælles overblik</h3>
              <p>
                Bed eleverne tage testen via indsamlingskittet —
                <br />
                eller importér JSON-filer her, når I er klar til at danne
                grupper.
              </p>
              <button
                className="text-button"
                onClick={() => fileRef.current.click()}
              >
                Vælg resultatfiler <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <>
              <CollectionFilters
                search={search}
                setSearch={setSearch}
                family={family}
                setFamily={setFamily}
                code={code}
                setCode={setCode}
                hasX={hasX}
                setHasX={setHasX}
                minLength={minLength}
                setMinLength={setMinLength}
                maxLength={maxLength}
                setMaxLength={setMaxLength}
                onDedupe={runDedupe}
              />
              <SpreadBars records={visible} />
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Navn / alias</th>
                      <th>Profil</th>
                      <th>Udsagn</th>
                      <th>Test gennemført</th>
                      <th>Konto</th>
                      <th>
                        <span className="sr-only">Handlinger</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <button
                            className="name-button"
                            onClick={() => setSelected(r)}
                          >
                            {r.name}
                          </button>
                        </td>
                        <td>
                          <TypeCode code={r.code} />
                        </td>
                        <td>{r.length ?? "—"}</td>
                        <td>
                          {new Date(r.createdAt).toLocaleDateString("da-DK")}
                        </td>
                        <td>
                          {user && cloudSyncedIds?.has(r.id) ? (
                            <span className="sync-badge">På konto</span>
                          ) : user ? (
                            <span className="sync-badge pending">Cache</span>
                          ) : (
                            <span className="sync-badge pending">Cache</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="icon-button"
                            aria-label={`Fjern ${r.name}`}
                            onClick={() => removeRecord(r)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!visible.length && (
                  <p className="empty-search">
                    Ingen profiler matcher dine filtre.
                  </p>
                )}
              </div>
            </>
          )}
          <div className="group-builder">
            <div className="builder-title">
              <span className="builder-icon">
                <SlidersHorizontal size={25} />
              </span>
              <div>
                <h2>Lav et gruppeforslag</h2>
                <p>
                  Bruger den filtrerede liste ({visible.length} profiler). Vælg
                  variation eller familier samlet, og lås eller adskil op til to
                  elever.
                </p>
              </div>
            </div>
            <div className="builder-controls builder-controls-wide">
              <label htmlFor="group-size">
                Højst antal pr. gruppe
                <select
                  id="group-size"
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setGroups([]);
                  }}
                >
                  {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} personer
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="group-mode">
                Fordeling
                <select
                  id="group-mode"
                  value={groupMode}
                  onChange={(e) => {
                    setGroupMode(e.target.value);
                    setGroups([]);
                  }}
                >
                  <option value="variety">Variation (bland)</option>
                  <option value="family">Familier samlet</option>
                </select>
              </label>
              <label htmlFor="lock-a">
                Lås sammen
                <select
                  id="lock-a"
                  value={lockA}
                  onChange={(e) => setLockA(e.target.value)}
                >
                  <option value="">—</option>
                  {visible.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="lock-b">
                med
                <select
                  id="lock-b"
                  value={lockB}
                  onChange={(e) => setLockB(e.target.value)}
                >
                  <option value="">—</option>
                  {visible
                    .filter((r) => r.id !== lockA)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                </select>
              </label>
              <label htmlFor="sep-a">
                Adskil
                <select
                  id="sep-a"
                  value={sepA}
                  onChange={(e) => setSepA(e.target.value)}
                >
                  <option value="">—</option>
                  {visible.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="sep-b">
                fra
                <select
                  id="sep-b"
                  value={sepB}
                  onChange={(e) => setSepB(e.target.value)}
                >
                  <option value="">—</option>
                  {visible
                    .filter((r) => r.id !== sepA)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                </select>
              </label>
              <button
                className="button pill"
                disabled={visible.length < 2}
                onClick={formGroups}
              >
                {groups.length ? "Lav et nyt forslag" : "Dan grupper"}{" "}
                <ArrowRight size={18} />
              </button>
            </div>
            <p className="builder-explanation">
              Faglige færdigheder, relationer og ønsker indgår ikke. Ved få
              elever kan en gruppe bestå af én person. Brug guiden ovenfor til
              at justere forslaget, før I låser holdene.
            </p>
          </div>
        </div>
      </section>

      {selected && (
        <RecordDialog
          record={selected}
          onClose={() => setSelected(null)}
          onRead={onRead}
        />
      )}

      {groups.length > 0 && (
        <section className="wave-section band-analysts generated-groups">
          <div className="wave-inner">
            <div className="collection-heading">
              <div>
                <h2>{groups.length} grupper · ét fælles udgangspunkt</h2>
                <p>
                  Tal om fordelingen: Er der variation nok? Mangler en familie?
                  Justér sammen i den eksporterede fil.
                </p>
              </div>
              <div className="actions">
                <button
                  className="button secondary pill"
                  onClick={printGroupCards}
                >
                  Print gruppekort
                </button>
                <button
                  className="button secondary pill"
                  onClick={() =>
                    download(
                      "samspil-grupper.csv",
                      groupsCsv(groups),
                      "text/csv;charset=utf-8",
                    )
                  }
                >
                  <Download size={17} /> Download grupper (CSV)
                </button>
              </div>
            </div>
            <div className="group-grid">
              {groups.map((group, i) => (
                <article className="group-card" key={i}>
                  <div className="group-card-heading">
                    <h3>Gruppe {i + 1}</h3>
                    <span>{group.length} personer</span>
                  </div>
                  {group.map((r) => (
                    <div className="group-person" key={r.id}>
                      <span>{r.name}</span>
                      <TypeCode code={r.code} />
                    </div>
                  ))}
                  <div className="group-prompt">
                    <Lightbulb size={18} />
                    <p>
                      Begynd med: Hvordan vil vi give feedback og fordele tid
                      til samtale og fordybelse?
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="wave-section band-explorers about-note groups-close">
        <div className="wave-inner software-close-inner">
          <TypeFigure
            code="INTP"
            size={220}
            className="software-close-figure"
          />
          <div>
            <h3>Profiler er et sprog – ikke en dom.</h3>
            <p>
              Samlingen findes kun i denne browser. Eksportér en sikkerhedskopi,
              inden du rydder browserdata. Brug typen til at starte samtalen om
              samarbejde, og supplér altid med elevernes ønsker, faglige
              erfaring og kendskab til hinanden.
            </p>
          </div>
        </div>
      </section>

      <section className="bottom-cta">
        <FigureStrip size="sm" codes={["INTJ", "ESFJ", "ESTP"]} />
        <Pill>FRA HOLD TIL HANDLING</Pill>
        <h2>
          Tag indsigten med
          <br />
          ind i projektet.
        </h2>
        <p>
          Brug profilerne til at tale om roller, feedback og gode
          arbejdsbetingelser i softwarearbejdet.
        </p>
        <div className="actions">
          <a href="#/software" className="button display-cta">
            Software & samarbejde <ArrowRight size={18} />
          </a>
          <a href="#/typer" className="button secondary pill">
            Se typegalleriet
          </a>
        </div>
      </section>
    </section>
  );
}
function RecordDialog({ record, onClose, onRead }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.showModal();
  }, []);
  return (
    <dialog ref={ref} className="record-dialog" onCancel={onClose}>
      <div className="collection-heading">
        <h2>{record.name}</h2>
        <button
          className="icon-button"
          aria-label="Luk profil"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <TypeCode code={record.code} />
      <button
        className="button record-read-more"
        onClick={() => onRead(record)}
      >
        <BookOpen size={17} /> Læs hele min feedback <ArrowRight size={17} />
      </button>
      {dimensions.map((d, i) => (
        <div className="record-dimension" key={d.id}>
          <strong>{d.title}</strong>
          <p>
            {d.left}: {record.scores[i]}% · {d.right}: {100 - record.scores[i]}%
          </p>
        </div>
      ))}
      <button
        className="button secondary"
        onClick={() =>
          download("samspil-resultat.json", exportRecords([record]))
        }
      >
        <Download size={17} /> Download resultat
      </button>
    </dialog>
  );
}
function Software() {
  const bands = [
    "band-analysts",
    "band-diplomats",
    "band-sentinels",
    "band-explorers",
  ];
  return (
    <section className="page-shell software-page">
      <div className="shell-intro software-intro">
        <Pill>
          <Code2 size={16} /> FRA INDSIGT TIL PRAKSIS
        </Pill>
        <h1>
          Bedre kode starter
          <br />
          også mellem mennesker.
        </h1>
        <p>
          Personlighed siger noget om, hvordan I gerne arbejder – ikke om, hvem
          der må kode, teste eller facilitere. Her får I fire konkrete
          arbejdsmønstre, I kan bruge i softwareprojekter, når I vil omsætte
          forskelle til aftaler.
        </p>
        <FigureStrip
          className="software-intro-figures"
          codes={["ENTP", "INTJ", "ESTJ", "ENFJ"]}
        />
      </div>
      <div className="pattern-stack">
        {learningPatterns.map((pattern, i) => (
          <section
            className={`wave-section pattern-band ${bands[i]} ${i % 2 === 1 ? "pattern-flip" : ""}`}
            key={pattern.name}
          >
            <div className="wave-inner">
              <div className="pattern-copy">
                <div className="pattern-heading">
                  <span className="wave-kicker">
                    0{i + 1} · {pattern.name}
                  </span>
                  <h2>{pattern.title}</h2>
                </div>
                <p className="pattern-lead">{pattern.lead}</p>
                <ul className="pattern-points">
                  {pattern.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="experiment">
                  <strong>Prøv det i næste sprint</strong>
                  <span>{pattern.try}</span>
                </div>
              </div>
              <div className="pattern-visual">
                <TypeFigure
                  code={pattern.figure}
                  size={320}
                  className="pattern-figure"
                />
                <span className="pattern-number" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
            </div>
          </section>
        ))}
      </div>
      <section className="wave-section band-explorers about-note software-close">
        <div className="wave-inner software-close-inner">
          <TypeFigure code="ISFP" size={220} className="software-close-figure" />
          <div>
            <h3>Roller er noget, I øver – ikke noget, testen tildeler.</h3>
            <p>
              Lad alle prøve at kode, teste, facilitere og præsentere. Brug
              profilen til at finde gode arbejdsbetingelser: hvornår I har brug
              for stille fordybelse, hvornår I har brug for hurtig sparring, og
              hvordan I giver feedback, der faktisk kan bruges.
            </p>
          </div>
        </div>
      </section>
      <section className="bottom-cta">
        <FigureStrip size="sm" codes={["ENFP", "ISTJ", "ENTP"]} />
        <Pill>FRA AFTALE TIL HOLD</Pill>
        <h2>
          Klar til at danne
          <br />
          grupper med omtanke?
        </h2>
        <p>
          Saml profiler, og brug forskellene som startpunkt for samtalen
          – ikke som facit.
        </p>
        <div className="actions">
          <a href="#/grupper" className="button display-cta">
            Åbn gruppebyggeren <ArrowRight size={18} />
          </a>
          <a href="#/test" className="button secondary pill">
            Tag testen
          </a>
        </div>
      </section>
    </section>
  );
}
function About() {
  return (
    <section className="page-shell about-page">
      <div className="shell-intro about-intro">
        <Pill>METODE & GENNEMSIGTIGHED</Pill>
        <h1>
          Et sprog for forskelle.
          <br />
          Plads til at udvikle sig.
        </h1>
        <p>
          Samspil er et selvstændigt refleksionsværktøj til elever, studerende
          og undervisere. Her kan du læse, hvordan profilen beregnes, hvad den
          må bruges til, hvordan grupper foreslås, og hvor dine data bliver.
        </p>
        <FigureStrip
          className="about-intro-figures"
          codes={["INTJ", "INFP", "ISTJ", "ESTP"]}
        />
      </div>
      <div className="pattern-stack about-guide-stack">
        {aboutGuide.map((section, i) => (
          <section
            className={`wave-section pattern-band ${section.band} ${i % 2 === 1 ? "pattern-flip" : ""}`}
            key={section.name}
          >
            <div className="wave-inner">
              <div className="pattern-copy">
                <div className="pattern-heading">
                  <span className="wave-kicker">
                    0{i + 1} · {section.name}
                  </span>
                  <h2>{section.title}</h2>
                </div>
                <p className="pattern-lead">{section.lead}</p>
                {section.link && (
                  <p className="about-ref-link">
                    Reference:{" "}
                    <a
                      href={section.link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {section.link.label}
                    </a>
                  </p>
                )}
                <ul className="pattern-points">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="experiment">
                  <strong>Tag det med dig</strong>
                  <span>{section.try}</span>
                </div>
              </div>
              <div className="pattern-visual">
                <TypeFigure
                  code={section.figure}
                  size={320}
                  className="pattern-figure"
                />
                <span className="pattern-number" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
            </div>
          </section>
        ))}
      </div>
      <section className="wave-section band-explorers about-note about-close">
        <div className="wave-inner software-close-inner">
          <TypeFigure
            code="ESFJ"
            size={220}
            className="software-close-figure"
          />
          <div>
            <h3>Gennemsigtighed gør samtalen bedre.</h3>
            <p>
              Når I kender metoden, begrænsningerne og datareglerne, er det
              lettere at bruge profilerne som et fælles sprog – uden at lade
              bogstaverne bestemme, hvem der må hvad i projektet.
            </p>
          </div>
        </div>
      </section>
      <section className="bottom-cta">
        <FigureStrip size="sm" codes={["INFJ", "ESTJ", "ISFP"]} />
        <Pill>KLAR TIL AT BEGYNDE?</Pill>
        <h2>
          Find din profil.
          <br />
          Forstå hinanden.
        </h2>
        <p>
          Tag testen, udforsk de 16 typer, og bring samtalen med ind i jeres
          næste projekt.
        </p>
        <div className="actions">
          <a href="#/test" className="button display-cta">
            Tag testen <ArrowRight size={18} />
          </a>
          <a href="#/typer" className="button secondary pill">
            Se typegalleriet
          </a>
        </div>
      </section>
    </section>
  );
}
