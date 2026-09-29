import React from "react";
import { beforeEach, afterEach, test, expect, vi } from "vitest";
import {
  render,
  screen,
  within,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { questions } from "../src/data.js";
import { makeRecord, exportRecords, INSTRUMENT } from "../src/engine.js";

vi.mock("../src/cloud.js", () => ({
  syncFromCloud: async () => null,
  saveCloudResult: async () => {},
  saveCloudCollectionItem: async () => {},
  deleteCloudResult: async () => {},
  fetchAdminOverview: async () => ({
    studentsWithProfile: 0,
    totalResults: 0,
    testsToday: 0,
    testsThisWeek: 0,
    byCode: [],
    byFamily: [],
    recent: [],
  }),
  fetchAdminResults: async () => ({ results: [], total: 0 }),
  deleteAdminResult: async () => {},
}));

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.history.replaceState({}, "", "/#/");
  vi.resetModules();
});
afterEach(cleanup);
async function mount() {
  const { App } = await import("../src/App.jsx");
  return render(<App />);
}

test("eleven kan gennemføre kort test (30), se resultat, gemme og genindlæse", async () => {
  const user = userEvent.setup();
  window.history.replaceState({}, "", "/#/test");
  await mount();
  await user.click(screen.getByRole("button", { name: "Næste" }));
  expect(screen.getByRole("alert").textContent).toContain("Vælg et svar");
  for (let i = 0; i < 30; i++) {
    const group = screen.getByRole("group");
    const answer =
      questions[i].direction > 0 ? "Meget enig" : "Meget uenig";
    await user.click(
      within(group).getByRole("radio", { name: answer, exact: true }),
    );
    if (i < 29) {
      await waitFor(
        () => {
          expect(screen.getByText(questions[i + 1].text)).toBeTruthy();
        },
        { timeout: 2500 },
      );
    }
  }
  await waitFor(
    () => {
      expect(screen.getByText(questions[30].text)).toBeTruthy();
      expect(screen.getByRole("button", { name: "Se profil nu" })).toBeTruthy();
    },
    { timeout: 2500 },
  );
  await user.clear(screen.getByLabelText(/Navn eller alias/));
  await user.type(
    screen.getByLabelText(/Navn eller alias/),
    "Test-elev ÆØÅ",
  );
  await user.click(screen.getByRole("button", { name: "Se profil nu" }));
  expect(
    await screen.findByRole("heading", { name: "Kommandør" }),
  ).toBeTruthy();
  expect(
    screen.getByRole("heading", { name: "Dine fem dimensioner" }),
  ).toBeTruthy();
  expect(screen.getByText(/Baseret på 30 udsagn/)).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: "Føj til lokal samling" }),
  );
  expect(screen.getByRole("button", { name: "Gemt i samling" }).disabled).toBe(
    true,
  );
  const persisted = JSON.parse(localStorage.getItem("samarbejde-v1"));
  expect(persisted.records).toHaveLength(1);
  expect(persisted.result.name).toBe("Test-elev ÆØÅ");
  expect(persisted.result.code).toBe("ENTJ");
  expect(persisted.result.length).toBe(30);
  cleanup();
  vi.resetModules();
  window.history.replaceState({}, "", "/#/resultat");
  await mount();
  expect(screen.getByRole("heading", { name: "Kommandør" })).toBeTruthy();
}, 120000);

test("galleri viser alle 16 lokale figurer, filtrerer og åbner softwarebeskrivelser", async () => {
  const user = userEvent.setup();
  window.history.replaceState({}, "", "/#/typer");
  await mount();
  const images = screen.getAllByRole("img", {
    name: /illustreret personlighedstype/,
  });
  expect(images).toHaveLength(16);
  expect(
    images.every((i) => i.getAttribute("src").startsWith("/illustrations/")),
  ).toBe(true);
  await user.click(
    screen.getByRole("button", { name: "Diplomater", exact: true }),
  );
  expect(
    screen.getAllByRole("img", { name: /illustreret personlighedstype/ }),
  ).toHaveLength(4);
  await user.click(screen.getByRole("link", { name: /Fortaler/ }));
  expect(await screen.findByRole("heading", { name: "Fortaler" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "I softwareprojekter" }));
  expect(
    screen.getByRole("heading", { name: "Fra præference til praksis" }),
  ).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "I samarbejdet" }));
  expect(
    screen.getByRole("heading", { name: "Giv hinanden bedre betingelser" }),
  ).toBeTruthy();
});

test("filimport er atomisk, deduplikerer, og gruppebyggeren medtager alle elever", async () => {
  const user = userEvent.setup();
  window.history.replaceState({}, "", "/#/grupper");
  const view = await mount();
  expect(screen.getByRole("button", { name: "Dan grupper" }).disabled).toBe(
    true,
  );
  const records = Array.from({ length: 9 }, (_, i) =>
    makeRecord(
      `Test-elev ${i + 1}`,
      questions.map((q, j) => ((i + j) % 7) - 3),
    ),
  );
  const file = new File([exportRecords(records)], "samling.json", {
    type: "application/json",
  });
  file.text = async () => exportRecords(records);
  const input = view.container.querySelector("input[type=file]");
  fireEvent.change(input, { target: { files: [file] } });
  await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(10));
  fireEvent.change(input, { target: { files: [file] } });
  await waitFor(() =>
    expect(screen.getByRole("status").textContent).toContain("0 nye"),
  );
  const invalid = new File(["null"], "ugyldig.json");
  invalid.text = async () => "null";
  fireEvent.change(input, { target: { files: [file, invalid] } });
  await waitFor(() =>
    expect(screen.getByRole("status").textContent).toContain("andet format"),
  );
  expect(screen.getAllByRole("row")).toHaveLength(10);
  await user.click(screen.getByRole("button", { name: "Dan grupper" }));
  expect(
    screen.getByRole("heading", { name: "3 grupper · ét fælles udgangspunkt" }),
  ).toBeTruthy();
  expect(view.container.querySelectorAll(".group-person")).toHaveLength(9);
  await user.click(
    screen.getByRole("button", { name: "Fjern Test-elev 1", exact: true }),
  );
  await user.click(screen.getByRole("button", { name: "Annuller" }));
  expect(screen.getAllByRole("row")).toHaveLength(10);
  await user.click(
    screen.getByRole("button", { name: "Fjern Test-elev 1", exact: true }),
  );
  await user.click(screen.getByRole("button", { name: "Bekræft" }));
  expect(screen.getAllByRole("row")).toHaveLength(9);
  expect(view.container.querySelectorAll(".group-person")).toHaveLength(0);
});

test("personlig feedback kan åbnes, læses med tastatur og foldes ud samlet", async () => {
  const user = userEvent.setup();
  const record = makeRecord(
    "Læsetest",
    questions.map((q) => (q.dimension === "AT" ? 0 : -3 * q.direction)),
  );
  localStorage.setItem(
    "samarbejde-v1",
    JSON.stringify({
      instrument: INSTRUMENT,
      records: [record],
      result: record,
    }),
  );
  window.history.replaceState({}, "", "/#/resultat");
  await mount();
  expect(
    screen.getByText("Du finder ofte klarhed gennem fordybelse"),
  ).toBeTruthy();
  expect(
    screen.getByText("Dine svar ligger midt mellem de to sider"),
  ).toBeTruthy();
  const open = screen.getByRole("button", {
    name: "Læs mere om energi",
    exact: true,
  });
  expect(open.getAttribute("aria-expanded")).toBe("false");
  open.focus();
  await user.keyboard("{Enter}");
  expect(
    screen
      .getByRole("button", { name: "Vis mindre om energi" })
      .getAttribute("aria-expanded"),
  ).toBe("true");
  expect(
    screen.getByRole("heading", { name: "Når I parprogrammerer" }),
  ).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: "Åbn alle forklaringer" }),
  );
  expect(
    screen.getAllByRole("heading", { name: "Hvad handler dimensionen om?" }),
  ).toHaveLength(5);
  expect(
    screen.getByRole("heading", {
      name: "Når demonstrationen ikke går som planlagt",
    }),
  ).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: /Hvordan bliver mine svar/ }),
  );
  expect(screen.getByText(/Det er hjælpekategorier/)).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: "Luk alle forklaringer" }),
  );
  expect(
    screen.queryByRole("heading", { name: "Hvad handler dimensionen om?" }),
  ).toBeNull();
  expect(
    JSON.parse(localStorage.getItem("samarbejde-v1")).result.scores,
  ).toEqual(record.scores);
});

test("en gemt elevprofil åbner den fulde læseguide fra samlingen", async () => {
  const user = userEvent.setup();
  const record = makeRecord("Gemte elev", Array(60).fill(0));
  localStorage.setItem(
    "samarbejde-v1",
    JSON.stringify({ instrument: INSTRUMENT, records: [record] }),
  );
  window.history.replaceState({}, "", "/#/grupper");
  await mount();
  await user.click(
    screen.getByRole("button", { name: "Gemte elev", exact: true }),
  );
  await user.click(
    screen.getByRole("button", { name: "Læs hele min feedback" }),
  );
  expect(
    await screen.findByRole("heading", { name: "Dine fem dimensioner" }),
  ).toBeTruthy();
  expect(
    screen.getAllByText("Dine svar ligger midt mellem de to sider"),
  ).toHaveLength(5);
  expect(JSON.parse(localStorage.getItem("samarbejde-v1")).result.id).toBe(
    record.id,
  );
});

test("X-profil viser midter-hero med nabotyper og figurer", async () => {
  const answers = questions.map((q) => {
    const index = ["EI", "NS", "TF", "JP", "AT"].indexOf(q.dimension);
    if (index === 0) return 0;
    return q.direction * ("ISFJ"[index] === q.dimension[0] ? 3 : -3);
  });
  const record = makeRecord("Hybrid-elev", answers);
  expect(record.code).toBe("XSFJ");
  localStorage.setItem(
    "samarbejde-v1",
    JSON.stringify({
      instrument: INSTRUMENT,
      records: [],
      result: record,
    }),
  );
  window.history.replaceState({}, "", "/#/resultat");
  await mount();
  expect(
    screen.getByRole("heading", { name: /Din profil rummer/ }),
  ).toBeTruthy();
  expect(screen.getByText(/PROFILER DU STÅR MELLEM/i)).toBeTruthy();
  expect(screen.getByRole("link", { name: /Konsul/ })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Beskytter/ })).toBeTruthy();
  expect(
    screen.getAllByRole("img", { name: /illustreret personlighedstype/ })
      .length,
  ).toBeGreaterThanOrEqual(2);
  expect(
    screen.getByRole("link", { name: /Læs dine dimensioner/ }),
  ).toBeTruthy();
});

test("profilguiden giver adgang til læring, refleksion og en ny profils eget indhold", async () => {
  const user = userEvent.setup();
  window.history.replaceState({}, "", "/#/typer/INFJ");
  await mount();
  const nav = screen.getByRole("navigation", { name: "Profilbeskrivelse" });
  expect(
    screen.getByRole("heading", { name: "Det, der driver dig" }),
  ).toBeTruthy();
  await user.click(screen.getByText("Hvad betyder INFJ?"));
  expect(screen.getByRole("heading", { name: "Introvert" })).toBeTruthy();
  await user.click(within(nav).getByRole("button", { name: "Sådan lærer du" }));
  expect(
    screen.getByRole("heading", { name: "Find et menneskeligt formål" }),
  ).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: "Næste: I samarbejdet" }),
  );
  const panel = screen.getByRole("region", { name: "I samarbejdet" });
  expect(document.activeElement).toBe(panel);
  expect(
    within(panel).getByText(/Jeg er bekymret for, hvem denne løsning overser/),
  ).toBeTruthy();
  const growthButton = within(nav).getByRole("button", {
    name: "Din udvikling",
  });
  growthButton.focus();
  await user.keyboard("{Enter}");
  const question = screen.getByText(
    "Hvilken bekymring har jeg ikke sagt højt?",
  );
  const details = question.closest("details");
  expect(details.open).toBe(false);
  await user.click(question);
  expect(details.open).toBe(true);
  expect(
    within(details).getByText(/Prøv at gøre den til en konkret observation/),
  ).toBeTruthy();
  await user.click(screen.getByRole("link", { name: "INFP Mægler" }));
  expect(
    await screen.findByRole("heading", { name: "Mægler", level: 1 }),
  ).toBeTruthy();
  expect(
    screen
      .getByRole("button", { name: "Kend dig selv" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen.getByText(/Et valg behøver ikke være et farvel til dine værdier/),
  ).toBeTruthy();
  expect(
    screen.queryByRole("heading", {
      name: "Del din bekymring, mens den stadig er lille",
    }),
  ).toBeNull();
});

test("den dybe profilguide kan foldes ud på resultatet uden at ændre elevens data", async () => {
  const user = userEvent.setup();
  const record = makeRecord(
    "Profiltest",
    questions.map((q) => -3 * q.direction),
  );
  localStorage.setItem(
    "samarbejde-v1",
    JSON.stringify({
      instrument: INSTRUMENT,
      records: [record],
      result: record,
    }),
  );
  window.history.replaceState({}, "", "/#/resultat");
  await mount();
  expect(
    screen.getByRole("heading", { name: "Dine fem dimensioner" }),
  ).toBeTruthy();
  expect(
    screen.queryByRole("navigation", { name: "Profilbeskrivelse" }),
  ).toBeNull();
  await user.click(
    screen.getByRole("button", { name: "Læs mere om din profil" }),
  );
  expect(
    screen.getByRole("navigation", { name: "Profilbeskrivelse" }),
  ).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "I softwareprojekter" }));
  expect(
    screen.getByRole("heading", {
      name: "Når en lille detalje bliver til en stor smagsdiskussion",
    }),
  ).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: "Fold profilguiden sammen" }),
  );
  expect(
    screen.queryByRole("heading", { name: "Fra præference til praksis" }),
  ).toBeNull();
  expect(
    screen.getByRole("heading", { name: "Dine fem dimensioner" }),
  ).toBeTruthy();
  const persisted = JSON.parse(localStorage.getItem("samarbejde-v1"));
  expect(persisted.result).toEqual(record);
  expect(persisted.records).toEqual([record]);
});

function fakeJwt(payload) {
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `hdr.${body}.sig`;
}

test("logget ind springer navnefelt over og gemmer under Auth-navn", async () => {
  const user = userEvent.setup();
  sessionStorage.setItem(
    "samspil_access_token",
    fakeJwt({
      sub: "user-1",
      name: "Auth Elev",
      email: "elev@mercantec.dk",
    }),
  );
  localStorage.setItem(
    "samarbejde-v1",
    JSON.stringify({
      instrument: INSTRUMENT,
      draft: {
        v: 2,
        name: "",
        page: 29,
        answers: [
          ...Array.from({ length: 29 }, (_, i) =>
            questions[i].direction > 0 ? 3 : -3,
          ),
          null,
          ...Array(120).fill(null),
        ],
      },
      records: [],
      result: null,
    }),
  );
  window.history.replaceState({}, "", "/#/test");
  await mount();
  expect(screen.queryByLabelText(/Navn eller alias/)).toBeNull();
  const group = screen.getByRole("group");
  const answer =
    questions[29].direction > 0 ? "Meget enig" : "Meget uenig";
  await user.click(
    within(group).getByRole("radio", { name: answer, exact: true }),
  );
  await waitFor(
    () => {
      const btn = screen.getByRole("button", { name: "Se profil nu" });
      expect(btn).toBeTruthy();
      expect(btn.disabled).toBe(false);
      expect(screen.getByText(/Resultatet gemmes som/)).toBeTruthy();
    },
    { timeout: 2500 },
  );
  expect(screen.queryByLabelText(/Navn eller alias/)).toBeNull();
  expect(screen.getByText("Auth Elev")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Se profil nu" }));
  expect(
    await screen.findByRole("heading", { name: "Kommandør" }, { timeout: 8000 }),
  ).toBeTruthy();
  const persisted = JSON.parse(localStorage.getItem("samarbejde-v1"));
  expect(persisted.result.name).toBe("Auth Elev");
  expect(persisted.result.length).toBe(30);
}, 60000);

test("uden admin-rolle skjules Admin-nav, gruppebygger har indsamlingskit", async () => {
  window.history.replaceState({}, "", "/#/grupper");
  await mount();
  expect(screen.queryByRole("link", { name: "Admin" })).toBeNull();
  expect(
    screen.getByRole("heading", { name: "Sådan indsamler du" }),
  ).toBeTruthy();
  expect(screen.getByRole("button", { name: /Kopiér test-link/ })).toBeTruthy();

  window.location.hash = "#/admin";
  await waitFor(() => {
    expect(
      screen.getByText(/kræver en underviserrolle/i),
    ).toBeTruthy();
  });
});

