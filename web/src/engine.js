import {
  dimensions,
  questions,
  selectQuestions,
  normalizeTestLength,
  answeredPrefixCount,
  MIN_TEST_LENGTH,
} from "./data.js";

export const SCHEMA = 1;
// Ændres automatisk, hvis spørgsmål, polretning eller rækkefølge ændres.
export const INSTRUMENT =
  "samarbejde-" +
  [...JSON.stringify(questions)]
    .reduce(
      (h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0,
      2166136261,
    )
    .toString(16);

export function padAnswers(answers) {
  const next = Array(questions.length).fill(null);
  if (!Array.isArray(answers)) return next;
  for (let i = 0; i < Math.min(answers.length, questions.length); i++) {
    next[i] = answers[i];
  }
  return next;
}

export function validAnswers(answers, complete = true, length) {
  const padded = padAnswers(answers);
  if (!complete) {
    return padded.every(
      (a) => a === null || (Number.isInteger(a) && a >= -3 && a <= 3),
    );
  }
  const prefix = answeredPrefixCount(padded);
  const required = normalizeTestLength(length ?? prefix);
  if (prefix < required) return false;
  return true;
}

export function score(answers, { length } = {}) {
  const padded = padAnswers(answers);
  const prefix = answeredPrefixCount(padded);
  if (prefix < MIN_TEST_LENGTH) {
    throw new Error(
      `Besvar mindst ${MIN_TEST_LENGTH} udsagn (du har ${prefix}).`,
    );
  }
  const len = normalizeTestLength(length ?? prefix);
  if (prefix < len) {
    throw new Error(
      `Besvar mindst ${len} udsagn i træk (du har ${prefix}).`,
    );
  }
  const active = selectQuestions(len);
  const scores = dimensions.map((d) => {
    const items = active
      .map((q, i) => ({ ...q, answer: padded[i] }))
      .filter((q) => q.dimension === d.id);
    const sum = items.reduce((n, q) => n + q.direction * q.answer, 0);
    return Math.round(50 + (sum / (items.length * 3)) * 50);
  });
  const code = scores
    .slice(0, 4)
    .map((s, i) => (s === 50 ? "X" : dimensions[i].id[s > 50 ? 0 : 1]))
    .join("");
  return {
    code,
    scores,
    balanced: scores.slice(0, 4).some((s) => Math.abs(s - 50) < 10),
    length: len,
  };
}

/** Udvider en kode med X til alle gyldige 4-bogstavsprofiler (kartesisk produkt). */
export function expandTypeCodes(code) {
  if (typeof code !== "string" || code.length !== 4) return [];
  const axes = ["EI", "NS", "TF", "JP"];
  const upper = code.toUpperCase();
  for (let i = 0; i < 4; i++) {
    const ch = upper[i];
    if (ch !== "X" && ch !== axes[i][0] && ch !== axes[i][1]) return [];
  }
  return axes.reduce(
    (acc, axis, i) => {
      const ch = upper[i];
      const choices = ch === "X" ? [axis[0], axis[1]] : [ch];
      return acc.flatMap((prefix) => choices.map((letter) => prefix + letter));
    },
    [""],
  );
}

/** Vælger op til `limit` naboprofiler, spredt jævnt når der er mange. */
export function neighborTypeCodes(code, limit = 4) {
  const all = expandTypeCodes(code);
  if (all.length <= limit) return all;
  const step = all.length / limit;
  return Array.from({ length: limit }, (_, i) =>
    all[Math.floor(i * step + step / 2)],
  );
}

export function makeRecord(name, answers, { length } = {}) {
  if (!name.trim() || name.trim().length > 80)
    throw new Error("Skriv et navn eller alias på højst 80 tegn.");
  const padded = padAnswers(answers);
  const len = normalizeTestLength(length ?? answeredPrefixCount(padded));
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    instrument: INSTRUMENT,
    answers: padded,
    ...score(padded, { length: len }),
  };
}
export function exportRecords(records) {
  return JSON.stringify(
    { schema: SCHEMA, instrument: INSTRUMENT, records },
    null,
    2,
  );
}
export function parseRecords(text) {
  if (text.length > 5_000_000)
    throw new Error("Filen er for stor. Grænsen er 5 MB.");
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      "Filen er ikke gyldig JSON. Brug en resultatfil eksporteret fra denne app.",
    );
  }
  if (
    !data ||
    data.schema !== SCHEMA ||
    data.instrument !== INSTRUMENT ||
    !Array.isArray(data.records) ||
    data.records.length > 1000
  )
    throw new Error(
      "Filen har et andet format eller en anden spørgsmålsversion. Brug samme version af testen.",
    );
  const ids = new Set();
  return data.records.map((r) => {
    const length = normalizeTestLength(r.length);
    const answers = padAnswers(r.answers);
    if (
      !r ||
      typeof r.id !== "string" ||
      !/^[\w-]{1,80}$/.test(r.id) ||
      ids.has(r.id) ||
      typeof r.name !== "string" ||
      !r.name.trim() ||
      r.name.length > 80 ||
      r.instrument !== INSTRUMENT ||
      typeof r.createdAt !== "string" ||
      Number.isNaN(Date.parse(r.createdAt)) ||
      !validAnswers(answers, true, length)
    )
      throw new Error(
        "En eller flere resultater er ugyldige eller har gentagne id’er. Intet blev importeret.",
      );
    ids.add(r.id);
    return {
      id: r.id,
      name: r.name.trim(),
      createdAt: r.createdAt,
      instrument: INSTRUMENT,
      answers,
      ...score(answers, { length }),
    };
  });
}
export function mergeRecords(existing, incoming) {
  const seen = new Set(existing.map((r) => r.id));
  const added = incoming.filter((r) => !seen.has(r.id));
  if (existing.length + added.length > 1000)
    throw new Error(
      "Der er plads til højst 1.000 resultater i en lokal samling.",
    );
  return [...existing, ...added];
}

export function familyForCode(code, typesList) {
  const exact = typesList.find((t) => t.code === code);
  if (exact) return exact.family;
  const expanded = expandTypeCodes(code);
  if (!expanded.length) return null;
  const familiesFound = [
    ...new Set(
      expanded
        .map((c) => typesList.find((t) => t.code === c)?.family)
        .filter(Boolean),
    ),
  ];
  return familiesFound.length === 1 ? familiesFound[0] : null;
}

/**
 * Hvor tæt scores ligger på de fire farvefamilier (NT/NF/SJ/SP).
 * scores[1]=N%, scores[2]=T%, scores[3]=J% (samme konvention som score()).
 * Returnerer procenter der summerer til 100.
 */
export function familyAffinity(scores) {
  if (!Array.isArray(scores) || scores.length < 4) {
    return [
      { key: "analysts", percent: 25 },
      { key: "diplomats", percent: 25 },
      { key: "sentinels", percent: 25 },
      { key: "explorers", percent: 25 },
    ];
  }
  const n = Math.max(0, Math.min(100, Number(scores[1]) || 0));
  const t = Math.max(0, Math.min(100, Number(scores[2]) || 0));
  const j = Math.max(0, Math.min(100, Number(scores[3]) || 0));
  const s = 100 - n;
  const f = 100 - t;
  const p = 100 - j;
  const raw = [
    { key: "analysts", weight: n * t }, // NT — lilla
    { key: "diplomats", weight: n * f }, // NF — grøn
    { key: "sentinels", weight: s * j }, // SJ — blå
    { key: "explorers", weight: s * p }, // SP — gul
  ];
  const total = raw.reduce((sum, row) => sum + row.weight, 0);
  if (total <= 0) {
    return raw.map((row) => ({ key: row.key, percent: 25 }));
  }
  const rounded = raw.map((row) => ({
    key: row.key,
    percent: Math.round((row.weight / total) * 100),
  }));
  // Ret afrunding så sum = 100
  const drift = 100 - rounded.reduce((sum, row) => sum + row.percent, 0);
  if (drift !== 0) {
    const richest = rounded.reduce((best, row, i) =>
      row.percent > rounded[best].percent ? i : best,
    0);
    rounded[richest].percent += drift;
  }
  return rounded;
}

export function filterRecords(
  records,
  {
    search = "",
    family = "",
    code = "",
    hasX = "",
    minLength = null,
    maxLength = null,
    typesList = [],
  } = {},
) {
  const q = search.trim().toLowerCase();
  return records.filter((r) => {
    if (q && !`${r.name} ${r.code}`.toLowerCase().includes(q)) return false;
    if (code && String(r.code).toUpperCase() !== String(code).toUpperCase())
      return false;
    if (family) {
      const expanded = expandTypeCodes(r.code);
      const hit = (expanded.length ? expanded : [r.code]).some(
        (c) => typesList.find((t) => t.code === c)?.family === family,
      );
      if (!hit) return false;
    }
    if (hasX === "yes" && !String(r.code).includes("X")) return false;
    if (hasX === "no" && String(r.code).includes("X")) return false;
    if (hasX === "balanced" && !r.balanced) return false;
    const len = r.length ?? 60;
    if (minLength != null && Number.isFinite(minLength) && len < minLength)
      return false;
    if (maxLength != null && Number.isFinite(maxLength) && len > maxLength)
      return false;
    return true;
  });
}

/** Behold nyeste pr. normaliseret navn. Returnerer { kept, removed }. */
export function dedupeByName(records) {
  const byName = new Map();
  for (const r of records) {
    const key = r.name.trim().toLowerCase();
    const prev = byName.get(key);
    if (!prev || Date.parse(r.createdAt) > Date.parse(prev.createdAt)) {
      byName.set(key, r);
    }
  }
  const kept = records.filter((r) => byName.get(r.name.trim().toLowerCase()) === r);
  const keptIds = new Set(kept.map((r) => r.id));
  const removed = records.filter((r) => !keptIds.has(r.id));
  return { kept, removed };
}

export function collectionSpread(records, typesList = []) {
  const familyCounts = {
    analysts: 0,
    diplomats: 0,
    sentinels: 0,
    explorers: 0,
  };
  const dimSums = [0, 0, 0, 0];
  let n = 0;
  for (const r of records) {
    const fam = familyForCode(r.code, typesList);
    if (fam && familyCounts[fam] != null) familyCounts[fam]++;
    if (Array.isArray(r.scores) && r.scores.length >= 4) {
      for (let i = 0; i < 4; i++) dimSums[i] += r.scores[i];
      n++;
    }
  }
  return {
    families: familyCounts,
    dimensionAverages: n
      ? dimSums.map((s) => Math.round(s / n))
      : [50, 50, 50, 50],
    count: records.length,
  };
}

/**
 * @param {object[]} records
 * @param {number} size
 * @param {number} seed
 * @param {{ mode?: 'variety'|'family', lockIds?: string[], separateIds?: string[], familyOf?: (r)=>string|null }} [options]
 */
export function makeGroups(records, size = 4, seed = 1, options = {}) {
  if (!Number.isInteger(size) || size < 2 || size > 8)
    throw new Error("Gruppestørrelsen skal være mellem 2 og 8.");
  if (records.length < 2) return [];
  const mode = options.mode === "family" ? "family" : "variety";
  const lockIds = (options.lockIds || []).filter(Boolean).slice(0, 2);
  const separateIds = (options.separateIds || []).filter(Boolean).slice(0, 2);
  const familyOf =
    options.familyOf ||
    ((r) => (typeof r.family === "string" ? r.family : null));

  const count = Math.ceil(records.length / size);
  const capacities = Array.from(
    { length: count },
    (_, i) =>
      Math.floor(records.length / count) + (i < records.length % count ? 1 : 0),
  );
  let state = seed >>> 0;
  const random = () =>
    (state = (Math.imul(1664525, state) + 1013904223) >>> 0) / 4294967296;
  const pool = [...records];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const groups = Array.from({ length: count }, () => []);
  const distance = (a, b) =>
    a.scores.slice(0, 4).reduce((n, s, i) => n + (s - b.scores[i]) ** 2, 0);

  const placed = new Set();
  const place = (person, preferIndex = null, { allowBreakSeparate = false } = {}) => {
    if (placed.has(person.id)) return;
    const sepPartner =
      separateIds.length === 2
        ? separateIds.find((id) => id !== person.id)
        : null;
    const candidates = groups
      .map((members, i) => ({
        i,
        fill: members.length / capacities[i],
        variety: members.length
          ? members.reduce((sum, p) => sum + distance(person, p), 0) /
            members.length
          : 0,
        familyScore: (() => {
          const fam = familyOf(person);
          if (!fam || !members.length) return 0;
          return members.filter((m) => familyOf(m) === fam).length / members.length;
        })(),
      }))
      .filter((g) => groups[g.i].length < capacities[g.i])
      .filter((g) => {
        if (!sepPartner || allowBreakSeparate) return true;
        return !groups[g.i].some((m) => m.id === sepPartner);
      });
    if (!candidates.length) {
      const open = groups
        .map((members, i) => ({ i, fill: members.length / capacities[i] }))
        .filter((g) => groups[g.i].length < capacities[g.i])
        .filter((g) => {
          if (!sepPartner) return true;
          return !groups[g.i].some((m) => m.id === sepPartner);
        });
      open.sort((a, b) => a.fill - b.fill || a.i - b.i);
      if (open[0]) {
        groups[open[0].i].push(person);
        placed.add(person.id);
        return;
      }
      // Sidste udvej: placér alligevel (kan bryde adskil ved ekstrem kapacitet)
      const anyOpen = groups
        .map((members, i) => ({ i, fill: members.length / capacities[i] }))
        .filter((g) => groups[g.i].length < capacities[g.i]);
      anyOpen.sort((a, b) => a.fill - b.fill || a.i - b.i);
      if (anyOpen[0]) {
        groups[anyOpen[0].i].push(person);
        placed.add(person.id);
      }
      return;
    }
    if (preferIndex != null && candidates.some((c) => c.i === preferIndex)) {
      groups[preferIndex].push(person);
      placed.add(person.id);
      return;
    }
    if (mode === "family") {
      candidates.sort(
        (a, b) =>
          b.familyScore - a.familyScore || a.fill - b.fill || a.i - b.i,
      );
    } else {
      candidates.sort(
        (a, b) => a.fill - b.fill || b.variety - a.variety || a.i - b.i,
      );
    }
    groups[candidates[0].i].push(person);
    placed.add(person.id);
  };

  // Adskil først — én i hver ende — så constraint ikke presses af fyldte grupper
  if (separateIds.length === 2 && count >= 2) {
    const pair = separateIds
      .map((id) => pool.find((p) => p.id === id))
      .filter(Boolean);
    if (pair.length === 2) {
      place(pair[0], 0);
      place(pair[1], count - 1);
    }
  }

  if (lockIds.length === 2) {
    const locked = lockIds
      .map((id) => pool.find((p) => p.id === id))
      .filter(Boolean);
    if (locked.length === 2) {
      place(locked[0]);
      const gi = groups.findIndex((g) => g.some((m) => m.id === locked[0].id));
      place(locked[1], gi >= 0 ? gi : null);
    }
  }

  for (const person of pool) place(person);
  return groups;
}
const cell = (value) =>
  '"' +
  String(value)
    .replace(/^[=+\-@\t\r]/, "'$&")
    .replaceAll('"', '""') +
  '"';
export function groupsCsv(groups) {
  return (
    "\uFEFF" +
    [
      [
        "Gruppe",
        "Navn eller alias",
        "Profil",
        "E (%)",
        "N (%)",
        "T (%)",
        "J (%)",
      ],
      ...groups.flatMap((g, i) =>
        g.map((r) => [i + 1, r.name, r.code, ...r.scores.slice(0, 4)]),
      ),
    ]
      .map((row) => row.map(cell).join(";"))
      .join("\r\n")
  );
}
export function download(name, content, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
