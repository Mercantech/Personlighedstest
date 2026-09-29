import { families, types } from "./data.js";

const HAS_X_OPTIONS = [
  { value: "", label: "Alle profiler" },
  { value: "yes", label: "Med X" },
  { value: "no", label: "Uden X" },
  { value: "balanced", label: "Kun midte (balanceret)" },
];

export default function CollectionFilters({
  search,
  setSearch,
  family,
  setFamily,
  code,
  setCode,
  hasX,
  setHasX,
  minLength,
  setMinLength,
  maxLength,
  setMaxLength,
  onDedupe,
  showDedupe = true,
}) {
  return (
    <div className="collection-filters" role="search" aria-label="Filtrér samling">
      <input
        className="search"
        placeholder="Søg efter navn, alias eller profil…"
        aria-label="Søg i samlingen"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="collection-filter-row">
        <label>
          Familie
          <select
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            aria-label="Filtrér på familie"
          >
            <option value="">Alle</option>
            {Object.entries(families).map(([key, f]) => (
              <option key={key} value={key}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type
          <select
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-label="Filtrér på typekode"
          >
            <option value="">Alle</option>
            {types.map((t) => (
              <option key={t.code} value={t.code}>
                {t.code}
              </option>
            ))}
          </select>
        </label>
        <label>
          X / midte
          <select
            value={hasX}
            onChange={(e) => setHasX(e.target.value)}
            aria-label="Filtrér på X eller midte"
          >
            {HAS_X_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Min. udsagn
          <input
            type="number"
            min={30}
            max={150}
            value={minLength ?? ""}
            placeholder="30"
            onChange={(e) =>
              setMinLength(e.target.value === "" ? null : Number(e.target.value))
            }
            aria-label="Minimum antal udsagn"
          />
        </label>
        <label>
          Maks. udsagn
          <input
            type="number"
            min={30}
            max={150}
            value={maxLength ?? ""}
            placeholder="150"
            onChange={(e) =>
              setMaxLength(e.target.value === "" ? null : Number(e.target.value))
            }
            aria-label="Maksimum antal udsagn"
          />
        </label>
        {showDedupe && onDedupe ? (
          <button type="button" className="button secondary pill" onClick={onDedupe}>
            Fjern ældre med samme navn
          </button>
        ) : null}
      </div>
    </div>
  );
}
