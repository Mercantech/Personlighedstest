import { test } from "node:test";
import assert from "node:assert/strict";
import { dimensions, questions } from "../src/data.js";
import { makeRecord } from "../src/engine.js";
import { interpretDimension, readingGuide } from "../src/feedback.js";

test("midtpunkt og nær-midten giver en balanceret forklaring på alle dimensioner", () => {
  for (const d of dimensions) {
    for (const value of [41, 49, 50, 51, 59]) {
      const feedback = interpretDimension(d.id, value);
      assert.equal(feedback.side, "balanced");
      assert.equal(feedback.label, "Begge sider kan være relevante");
      assert.match(feedback.tendency, /midten/);
      assert(feedback.reading.length > 100);
    }
  }
});
test("ensrettede resultater fortolkes mod korrekt pol, og tærskler er symmetriske", () => {
  for (const d of dimensions) {
    for (const value of [0, 25, 26, 40, 60, 74, 75, 100]) {
      const f = interpretDimension(d.id, value);
      const side = value > 50 ? "left" : "right";
      assert.equal(f.side, side);
      assert.equal(f.label, d[side]);
      assert.equal(f.reading, f.guide[side].reading);
      assert.equal(f.action, f.guide[side].action);
      assert.equal(
        f.tendency.startsWith("Tydelig"),
        value <= 25 || value >= 75,
      );
    }
  }
});
test("ukendte dimensioner og scores uden for skalaen afvises", () => {
  for (const value of [-1, 101, null, NaN, "70", 49.5])
    assert.throws(() => interpretDimension("EI", value));
  assert.throws(() => interpretDimension("XX", 50));
});
test("læseguiden indeholder alle fem dimensioner, begge perspektiver og de personlige eksperimenter", () => {
  const record = makeRecord(
    "Test Ø",
    questions.map((q) => -3 * q.direction),
  );
  const text = readingGuide(record);
  assert(text.includes("Test Ø · ISFP"));
  assert(!text.includes("undefined"));
  for (const d of dimensions) {
    const f = interpretDimension(d.id, 0);
    assert(text.includes(d.title.toUpperCase()));
    assert(text.includes(`${d.left}: 0% · ${d.right}: 100%`));
    assert(text.includes(f.guide.left.strength));
    assert(text.includes(f.guide.right.strength));
    assert(text.includes(f.action));
    assert(text.includes(f.guide.nuance));
  }
});
