import { test } from "node:test";
import assert from "node:assert/strict";
import {
  dimensions,
  questions,
  types,
  MIN_TEST_LENGTH,
  selectQuestions,
  answeredPrefixCount,
} from "../src/data.js";
import {
  score,
  validAnswers,
  makeRecord,
  exportRecords,
  parseRecords,
  mergeRecords,
  makeGroups,
  groupsCsv,
  expandTypeCodes,
  neighborTypeCodes,
  padAnswers,
  filterRecords,
  dedupeByName,
  familyForCode,
  collectionSpread,
  familyAffinity,
} from "../src/engine.js";

test("150 unikke spørgsmål, ligelig dækning og modsatrettede udsagn", () => {
  assert.equal(questions.length, 150);
  assert.equal(new Set(questions.map((q) => q.id)).size, 150);
  for (const dimension of dimensions) {
    const subset = questions.filter((q) => q.dimension === dimension.id);
    assert.equal(subset.length, 30);
    assert.equal(subset.filter((q) => q.direction === 1).length, 15);
    assert.equal(subset.filter((q) => q.direction === -1).length, 15);
  }
});

test("fleksibel længde: prefix 30–150 scorer, under 30 afvises", () => {
  assert.equal(MIN_TEST_LENGTH, 30);
  assert.throws(() => score(Array(29).fill(0)));
  for (const length of [30, 47, 60, 123, 150]) {
    const answers = padAnswers(Array(length).fill(0));
    assert.equal(answeredPrefixCount(answers), length);
    const result = score(answers, { length });
    assert.equal(result.code, "XXXX");
    assert.equal(result.length, length);
    assert.equal(selectQuestions(length).length, length);
  }
});

test("alle 16 profiler kan nås for 30, 60, 123 og 150", () => {
  assert.equal(types.length, 16);
  for (const length of [30, 60, 123, 150]) {
    for (const type of types) {
      const answers = padAnswers(
        selectQuestions(length).map((q) => {
          const index = dimensions.findIndex((d) => d.id === q.dimension);
          return (
            q.direction *
            (index === 4 || type.code[index] === q.dimension[0] ? 3 : -3)
          );
        }),
      );
      const result = score(answers, { length });
      assert.equal(result.code, type.code);
      assert.equal(result.balanced, false);
      assert.equal(result.length, length);
      assert(result.scores.every((s) => s === 0 || s === 100));
    }
  }
});

test("neutral og konsekvent enighed giver en ærlig midterprofil", () => {
  assert.deepEqual(score(Array(60).fill(0)), {
    code: "XXXX",
    scores: [50, 50, 50, 50, 50],
    balanced: true,
    length: 60,
  });
  assert.equal(score(Array(60).fill(3)).code, "XXXX");
  assert.equal(score(Array(123).fill(0), { length: 123 }).length, 123);
});

test("X-koder ekspanderes til naboprofiler", () => {
  assert.deepEqual(expandTypeCodes("XSFJ"), ["ESFJ", "ISFJ"]);
  assert.deepEqual(expandTypeCodes("EXTJ"), ["ENTJ", "ESTJ"]);
  assert.equal(expandTypeCodes("XXXX").length, 16);
  assert.deepEqual(neighborTypeCodes("XSFJ"), ["ESFJ", "ISFJ"]);
  assert.equal(neighborTypeCodes("XXXX", 4).length, 4);
  assert.deepEqual(expandTypeCodes("????"), []);
});

test("ufuldstændige og ugyldige besvarelser afvises", () => {
  for (const answers of [
    [],
    Array(60).fill(null),
    Array(60).fill(4),
    Array(60).fill("1"),
    Array(60).fill(0.5),
  ])
    assert.throws(() => score(answers));
  assert(validAnswers(Array(60).fill(null), false));
  assert(validAnswers(Array(30).fill(0), true, 30));
  assert(!validAnswers(Array(30).fill(0), true, 60));
});

test("import/eksport bevarer svar og genberegner manipulerede scorer", () => {
  const record = makeRecord(
    "Test ÆØÅ",
    questions.map((q) => q.direction * 2),
    { length: 150 },
  );
  const manipulated = { ...record, code: "ISTP", scores: [2, 4, 6, 8, 10] };
  const result = parseRecords(exportRecords([manipulated]));
  assert.deepEqual(result, [record]);
  assert.equal(mergeRecords([record], result).length, 1);
  assert.equal(
    mergeRecords([record], [
      makeRecord(record.name, record.answers, { length: 150 }),
    ]).length,
    2,
  );
});

test("forkert version, null, ugyldigt format og dublet-id’er afvises atomisk", () => {
  const record = makeRecord("Test", Array(60).fill(0));
  for (const text of [
    "{",
    "null",
    "{}",
    exportRecords([record, record]),
    exportRecords([{ ...record, answers: [0] }]),
    exportRecords([{ ...record, instrument: "other" }]),
    exportRecords([{ ...record, createdAt: "invalid" }]),
    exportRecords([{ ...record, name: "" }]),
  ])
    assert.throws(() => parseRecords(text));
});

test("grupper mister eller gentager aldrig elever og holder størrelse og balance", () => {
  for (let n = 2; n <= 100; n++) {
    const records = Array.from({ length: n }, (_, i) =>
      makeRecord(
        `Test ${i}`,
        questions.map((q, j) => ((i + j) % 7) - 3),
        { length: 60 },
      ),
    );
    for (let size = 2; size <= 8; size++) {
      const groups = makeGroups(records, size, 42);
      assert.equal(groups.flat().length, n);
      assert.equal(new Set(groups.flat().map((r) => r.id)).size, n);
      assert(groups.every((g) => g.length > 0 && g.length <= size));
      assert(
        Math.max(...groups.map((g) => g.length)) -
          Math.min(...groups.map((g) => g.length)) <=
          1,
      );
      assert.deepEqual(makeGroups(records, size, 42), groups);
    }
  }
});

test("tomme samlinger giver ingen grupper, ugyldige størrelser afvises", () => {
  assert.deepEqual(makeGroups([], 3), []);
  assert.throws(() => makeGroups([makeRecord("A", Array(60).fill(0))], 1));
});

test("samlingsfiltre, dedupe og spredning", () => {
  const a = makeRecord("Anna", Array(60).fill(3));
  const b = {
    ...makeRecord("anna", Array(60).fill(0)),
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
  };
  const c = makeRecord("Bo", questions.map((q) => q.direction * 3), {
    length: 60,
  });
  const filtered = filterRecords([a, b, c], {
    family: "analysts",
    typesList: types,
  });
  assert(filtered.every((r) => familyForCode(r.code, types) === "analysts" || expandTypeCodes(r.code).some((code) => types.find((t) => t.code === code)?.family === "analysts")));
  const { kept, removed } = dedupeByName([a, b, c]);
  assert.equal(kept.length, 2);
  assert.equal(removed.length, 1);
  assert.equal(removed[0].id, b.id);
  const spread = collectionSpread([a, c], types);
  assert.equal(spread.count, 2);
  assert.equal(typeof spread.dimensionAverages[0], "number");
});

test("gruppekontrol: lås, adskil og familie-mode", () => {
  const records = Array.from({ length: 8 }, (_, i) =>
    makeRecord(
      `Elev ${i}`,
      questions.map((q, j) => ((i + j) % 7) - 3),
      { length: 60 },
    ),
  );
  const locked = makeGroups(records, 4, 7, {
    mode: "variety",
    lockIds: [records[0].id, records[1].id],
    familyOf: (r) => familyForCode(r.code, types),
  });
  const lockGroup = locked.find((g) => g.some((m) => m.id === records[0].id));
  assert(lockGroup.some((m) => m.id === records[1].id));

  const separated = makeGroups(records, 4, 11, {
    separateIds: [records[0].id, records[1].id],
    familyOf: (r) => familyForCode(r.code, types),
  });
  const sepGroup = separated.find((g) => g.some((m) => m.id === records[0].id));
  assert(!sepGroup.some((m) => m.id === records[1].id));

  const familyGroups = makeGroups(records, 4, 3, {
    mode: "family",
    familyOf: (r) => familyForCode(r.code, types),
  });
  assert.equal(familyGroups.flat().length, 8);
});

test("CSV undgår formel-injection og bevarer danske tegn", () => {
  const r = makeRecord('=SUM(1;2) "ÆØÅ"', Array(60).fill(0));
  const csv = groupsCsv([[r]]);
  assert.match(csv, /'=SUM\(1;2\) ""ÆØÅ""/);
  assert.match(csv, /XXXX/);
});

test("familyAffinity summerer til 100 og favoriserer den matchende familie", () => {
  const even = familyAffinity([50, 50, 50, 50, 50]);
  assert.equal(
    even.reduce((n, row) => n + row.percent, 0),
    100,
  );
  assert.ok(even.every((row) => row.percent === 25));

  const nt = familyAffinity([50, 90, 90, 50, 50]);
  const analysts = nt.find((row) => row.key === "analysts");
  assert.ok(analysts.percent >= 40);
  assert.equal(
    nt.reduce((n, row) => n + row.percent, 0),
    100,
  );

  const sj = familyAffinity([50, 10, 50, 90, 50]);
  const sentinels = sj.find((row) => row.key === "sentinels");
  assert.ok(sentinels.percent >= 40);
});
