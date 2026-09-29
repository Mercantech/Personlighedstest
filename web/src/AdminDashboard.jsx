import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  LayoutDashboard,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { families, types } from "./data.js";
import {
  deleteAdminResult,
  fetchAdminOverview,
  fetchAdminResults,
} from "./cloud.js";
import { filterRecords, mergeRecords } from "./engine.js";
import CollectionKit from "./CollectionKit.jsx";
import CollectionFilters from "./CollectionFilters.jsx";
import SpreadBars from "./SpreadBars.jsx";
import { isAdmin } from "./auth.js";

function TypeCode({ code }) {
  return <span className="type-code">{code}</span>;
}

function go(hash) {
  window.location.hash = hash;
}

export default function AdminDashboard({
  user,
  setRecords,
  setNotice,
  setConfirm,
}) {
  const [overview, setOverview] = useState(null);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentOnly, setCurrentOnly] = useState(true);
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("");
  const [code, setCode] = useState("");
  const [hasX, setHasX] = useState("");
  const [minLength, setMinLength] = useState(null);
  const [maxLength, setMaxLength] = useState(null);
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [ov, list] = await Promise.all([
        fetchAdminOverview(),
        fetchAdminResults({
          currentOnly,
          q: search,
          code,
          family,
          hasX,
          minLength: minLength ?? undefined,
          maxLength: maxLength ?? undefined,
          limit: 200,
        }),
      ]);
      setOverview(ov);
      setResults(list.results || []);
      setTotal(list.total ?? 0);
    } catch (err) {
      setError(err.message || "Kunne ikke hente data");
    } finally {
      setLoading(false);
    }
  }, [currentOnly, search, code, family, hasX, minLength, maxLength]);

  useEffect(() => {
    if (!isAdmin(user)) return;
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [user, load]);

  const visible = useMemo(
    () =>
      filterRecords(results, {
        search,
        family,
        code,
        hasX,
        minLength,
        maxLength,
        typesList: types,
      }),
    [results, search, family, code, hasX, minLength, maxLength],
  );

  if (!isAdmin(user)) {
    return (
      <section className="page-shell admin-page">
        <div className="shell-intro">
          <h1>Admin</h1>
          <p>Denne side kræver en underviserrolle i Mercantec Auth.</p>
          <a href="#/" className="button">
            Til forsiden
          </a>
        </div>
      </section>
    );
  }

  const toGroupRecord = (r) => ({
    id: r.id,
    name: r.name,
    code: r.code,
    scores: r.scores,
    balanced: r.balanced,
    length: r.length,
    createdAt: r.createdAt,
    instrument: r.instrument,
    answers: r.answers || [],
  });

  const addToGroups = (rows) => {
    const incoming = rows.map(toGroupRecord);
    setRecords((prev) => {
      try {
        return mergeRecords(prev, incoming);
      } catch (err) {
        setNotice(err.message);
        return prev;
      }
    });
    setNotice(`${incoming.length} profiler klar i gruppebyggeren.`);
    go("/grupper");
  };

  const loadAllToGroups = () => {
    setRecords(visible.map(toGroupRecord));
    setNotice(
      `${visible.length} aktuelle profiler indlæst i gruppebyggeren.`,
    );
    go("/grupper");
  };

  const removeResult = (r) => {
    setConfirm({
      title: `Slet ${r.name}?`,
      text: "Resultatet slettes fra databasen for eleven.",
      action: async () => {
        try {
          await deleteAdminResult(r.id);
          setNotice("Resultatet er slettet.");
          load();
        } catch (err) {
          setNotice(err.message);
        }
      },
    });
  };

  const famMax = Math.max(
    1,
    ...(overview?.byFamily?.map((f) => f.count) || [1]),
  );

  return (
    <section className="page-shell admin-page">
      <div className="shell-intro groups-intro">
        <span className="pill">
          <LayoutDashboard size={15} /> ADMIN
        </span>
        <h1>
          Overblik over
          <br />
          alle tests.
        </h1>
        <p>
          Se hvem der har taget testen, fordelingen på holdet, og send
          profiler videre til gruppebyggeren.
        </p>
      </div>

      <CollectionKit />

      <div className="admin-toolbar">
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={currentOnly}
            onChange={(e) => setCurrentOnly(e.target.checked)}
          />
          Kun aktuelle profiler (én pr. elev)
        </label>
        <button
          type="button"
          className="button secondary pill"
          onClick={load}
          disabled={loading}
        >
          <RefreshCw size={16} /> Opdater
        </button>
        <button
          type="button"
          className="button pill"
          disabled={!visible.length}
          onClick={loadAllToGroups}
        >
          <Users size={16} /> Indlæs til gruppebygger <ArrowRight size={16} />
        </button>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      {overview ? (
        <div className="admin-kpis">
          <article>
            <span>Elever med profil</span>
            <strong>{overview.studentsWithProfile}</strong>
          </article>
          <article>
            <span>Tests i alt</span>
            <strong>{overview.totalResults}</strong>
          </article>
          <article>
            <span>I dag</span>
            <strong>{overview.testsToday}</strong>
          </article>
          <article>
            <span>Seneste 7 dage</span>
            <strong>{overview.testsThisWeek}</strong>
          </article>
        </div>
      ) : null}

      {overview?.byFamily ? (
        <section className="admin-family-overview" aria-label="Familiefordeling">
          <h2>Familiefordeling (aktuelle)</h2>
          <ul className="spread-bar-list">
            {overview.byFamily.map((row) => (
              <li key={row.family}>
                <span className="spread-bar-label">
                  {families[row.family]?.name || row.family}
                </span>
                <span
                  className="spread-bar-track"
                  style={{
                    "--family": families[row.family]?.color || "#666",
                  }}
                >
                  <span
                    className="spread-bar-fill"
                    style={{ width: `${(row.count / famMax) * 100}%` }}
                  />
                </span>
                <span className="spread-bar-count">{row.count}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <SpreadBars
        records={visible}
        title="Spredning i den filtrerede liste"
      />

      <section className="admin-table-section wave-section band-sentinels">
        <div className="wave-inner">
          <div className="collection-heading">
            <div>
              <h2>Alle tests</h2>
              <p>
                {loading
                  ? "Henter…"
                  : `${visible.length} vist · ${total} i databasen (filter)`}
              </p>
            </div>
          </div>
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
            showDedupe={false}
          />
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Navn</th>
                  <th>Email</th>
                  <th>Profil</th>
                  <th>Udsagn</th>
                  <th>Dato</th>
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
                        type="button"
                        className="name-button"
                        onClick={() => setPreview(r)}
                      >
                        {r.name}
                      </button>
                    </td>
                    <td>{r.email || "—"}</td>
                    <td>
                      <TypeCode code={r.code} />
                      {r.balanced ? (
                        <span className="sync-badge pending"> midte</span>
                      ) : null}
                    </td>
                    <td>{r.length ?? "—"}</td>
                    <td>
                      {new Date(r.createdAt).toLocaleDateString("da-DK")}
                    </td>
                    <td className="admin-row-actions">
                      <button
                        type="button"
                        className="button secondary pill"
                        onClick={() => addToGroups([r])}
                      >
                        Til grupper
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`Slet ${r.name}`}
                        onClick={() => removeResult(r)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && !visible.length ? (
              <p className="empty-search">Ingen tests matcher filtrene.</p>
            ) : null}
          </div>
        </div>
      </section>

      {overview?.recent?.length ? (
        <section className="admin-recent">
          <h2>Seneste aktivitet</h2>
          <ul>
            {overview.recent.map((r) => (
              <li key={r.id}>
                <strong>{r.name}</strong> · {r.code} ·{" "}
                {new Date(r.createdAt).toLocaleString("da-DK")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {preview ? (
        <dialog className="record-dialog" open onCancel={() => setPreview(null)}>
          <div className="collection-heading">
            <h2>{preview.name}</h2>
            <button
              type="button"
              className="icon-button"
              aria-label="Luk"
              onClick={() => setPreview(null)}
            >
              ×
            </button>
          </div>
          <p>
            <TypeCode code={preview.code} /> · {preview.length} udsagn
            {preview.email ? ` · ${preview.email}` : ""}
          </p>
          {Array.isArray(preview.scores)
            ? preview.scores.slice(0, 4).map((s, i) => (
                <p key={i}>
                  Score {i + 1}: {s}%
                </p>
              ))
            : null}
          {!String(preview.code).includes("X") ? (
            <a
              className="button"
              href={`#/typer/${preview.code}`}
              onClick={() => setPreview(null)}
            >
              Åbn typeguide <ArrowRight size={16} />
            </a>
          ) : null}
        </dialog>
      ) : null}
    </section>
  );
}
