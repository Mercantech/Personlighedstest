import { families } from "./data.js";
import { familyAffinity } from "./engine.js";

const COLOR_HINT = {
  analysts: "lilla",
  diplomats: "grøn",
  sentinels: "blå",
  explorers: "gul",
};

export default function FamilyAffinity({ scores, className = "" }) {
  const rows = familyAffinity(scores);
  const strongest = rows.reduce((best, row) =>
    row.percent > best.percent ? row : best,
  );

  return (
    <section
      className={`family-affinity ${className}`.trim()}
      aria-labelledby="family-affinity-title"
    >
      <div className="family-affinity-intro">
        <span className="wave-kicker">FARVEFAMILIER</span>
        <h2 id="family-affinity-title">Hvor tæt er du på hver farve?</h2>
        <p>
          De fire familier kommer fra kombinationen af information (N/S) og
          beslutning/arbejdsform. Her ser du, hvor meget dine svar trækker mod
          lilla, grøn, blå og gul — ikke kun den familie, din typebogstavs-
          profil lander i.
        </p>
      </div>
      <ul className="family-affinity-list">
        {rows.map((row) => {
          const family = families[row.key];
          const isTop = row.key === strongest.key;
          return (
            <li
              key={row.key}
              className={isTop ? "family-affinity-item top" : "family-affinity-item"}
              style={{ "--family": family.color, "--pale": family.pale }}
            >
              <div className="family-affinity-meta">
                <strong>{family.name}</strong>
                <span className="family-affinity-hint">
                  {COLOR_HINT[row.key]}
                  {isTop ? " · stærkest hos dig" : ""}
                </span>
              </div>
              <div
                className="family-affinity-track"
                role="meter"
                aria-label={`${family.name} (${COLOR_HINT[row.key]})`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={row.percent}
              >
                <span
                  className="family-affinity-fill"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
              <span className="family-affinity-pct">{row.percent}%</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
