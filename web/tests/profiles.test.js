import test from "node:test";
import assert from "node:assert/strict";
import { types } from "../src/data.js";
import {
  profileGuides,
  profilePreferences,
  profileReadingGuide,
} from "../src/profile-content.js";

test("alle 16 profiler har eget indhold til alle fem kapitler", () => {
  assert.deepEqual(
    Object.keys(profileGuides).sort(),
    types.map((t) => t.code).sort(),
  );
  const scenarios = new Set();
  for (const type of types) {
    const guide = profileGuides[type.code];
    assert.equal(guide.intro.length, 2, type.code);
    assert.equal(guide.strengths.length, type.strengths.length, type.code);
    assert.equal(guide.learning.length, 3, type.code);
    assert.equal(guide.growth.steps.length, 3, type.code);
    assert.equal(guide.growth.reflections.length, 3, type.code);
    for (const text of [
      guide.tagline,
      guide.motivation,
      guide.energy,
      guide.drain,
      guide.stuck,
      guide.feedback,
      guide.misread,
      guide.phrase,
      ...guide.intro,
      ...guide.strengths,
      ...guide.learning.flat(),
      ...Object.values(guide.scenario),
      guide.growth.title,
      guide.growth.text,
      ...guide.growth.steps,
      ...guide.growth.reflections.flat(),
    ]) {
      assert.equal(typeof text, "string", type.code);
      assert.ok(text.trim().length > 10, `${type.code}: manglende beskrivelse`);
    }
    scenarios.add(guide.scenario.context);
  }
  assert.equal(scenarios.size, 16);
});

test("forklaringer af typebogstaver følger den korrekte pol, også S og N", () => {
  assert.deepEqual(
    profilePreferences("ISTJ").map((p) => p.label),
    ["Introvert", "Observerende", "Analytisk", "Struktureret"],
  );
  assert.deepEqual(
    profilePreferences("ENFP").map((p) => p.label),
    ["Ekstrovert", "Intuitiv", "Værdiorienteret", "Udforskende"],
  );
  assert.equal(profilePreferences("INFJ").length, 4);
});

test("download indeholder hele profilguiden, alle refleksioner og nuancering", () => {
  for (const type of types) {
    const guide = profileGuides[type.code];
    const text = profileReadingGuide(type.code);
    assert.ok(text.includes(type.name.toUpperCase()));
    assert.ok(text.includes(guide.intro[1]));
    assert.ok(text.includes(guide.feedback));
    assert.ok(text.includes(guide.misread));
    assert.ok(text.includes(guide.scenario.alternative));
    assert.ok(text.includes(guide.growth.steps[2]));
    guide.growth.reflections
      .flat()
      .forEach((part) => assert.ok(text.includes(part)));
    assert.ok(text.includes("ikke evner eller en fast identitet"));
    assert.ok(text.includes("reaktion på pres"));
    assert.equal((text.match(/Mine noter:/g) || []).length, 3);
    assert.ok(!text.includes("undefined"));
  }
  assert.throws(() => profileReadingGuide("XXXX"), /Ukendt profil/);
});
