import { families, dimensions } from "./data.js";
import { collectionSpread } from "./engine.js";
import { types } from "./data.js";

export default function SpreadBars({ records, title = "Holdets spredning" }) {
  if (!records?.length) return null;
  const spread = collectionSpread(records, types);
  const famMax = Math.max(1, ...Object.values(spread.families));

  return (
    <section className="spread-bars" aria-label={title}>
      <div className="spread-bars-heading">
        <span className="wave-kicker">ANONYMISERET OVERBLIK</span>
        <h2>{title}</h2>
        <p>
          Fordeling uden navne — {spread.count} profiler. Brug det til at se,
          om holdet mangler en farvefamilie eller en pol.
        </p>
      </div>
      <div className="spread-bars-grid">
        <div>
          <h3>Familier</h3>
          <ul className="spread-bar-list">
            {Object.entries(spread.families).map(([key, count]) => (
              <li key={key}>
                <span className="spread-bar-label">{families[key].name}</span>
                <span
                  className="spread-bar-track"
                  style={{ "--family": families[key].color }}
                >
                  <span
                    className="spread-bar-fill"
                    style={{ width: `${(count / famMax) * 100}%` }}
                  />
                </span>
                <span className="spread-bar-count">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Gennemsnit pr. dimension</h3>
          <ul className="spread-bar-list">
            {dimensions.slice(0, 4).map((d, i) => {
              const avg = spread.dimensionAverages[i];
              return (
                <li key={d.id}>
                  <span className="spread-bar-label">
                    {d.id[0]}/{d.id[1]}
                  </span>
                  <span className="spread-bar-track dim-track">
                    <span
                      className="spread-bar-fill dim-fill"
                      style={{ width: `${avg}%` }}
                    />
                    <span className="spread-mid" aria-hidden="true" />
                  </span>
                  <span className="spread-bar-count">{avg}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
