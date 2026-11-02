import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function loadRender() {
  const window = {};
  vm.runInNewContext(readFileSync(new URL("../assets/js/render.js", import.meta.url), "utf8"), { window });
  return window.PortfolioRender;
}
const R = loadRender();

test("t() picks language and falls back to ua", () => {
  assert.equal(R.t({ ua: "Привіт", en: "Hello" }, "en"), "Hello");
  assert.equal(R.t({ ua: "Привіт" }, "en"), "Привіт");
  assert.equal(R.t("plain", "en"), "plain");
});

test("monthIndex is monotonic across year boundary", () => {
  assert.equal(R.monthIndex("2021-12") + 1, R.monthIndex("2022-01"));
});

const span = (clip, now) => ({ ...R.ganttSpan(clip, now) });

test("ganttSpan maps range start to column 1 and one-month clips to span 1", () => {
  assert.deepEqual(span({ from: "2021-09", to: "2021-09" }, "2026-11"), { col: 1, span: 1 });
  assert.deepEqual(span({ from: "2026-08", to: "2026-09" }, "2026-11"), { col: 60, span: 2 });
});

test("ganttSpan treats to:null as now and clamps to range end", () => {
  assert.deepEqual(span({ from: "2026-11", to: null }, "2026-11"), { col: 63, span: 1 });
  assert.deepEqual(span({ from: "2026-10", to: "2027-06" }, "2026-11"), { col: 62, span: 3 });
});

test("formatTimecode clamps and formats", () => {
  assert.equal(R.formatTimecode(0, 90), "00:00:00");
  assert.equal(R.formatTimecode(0.5, 90), "00:00:45");
  assert.equal(R.formatTimecode(1.7, 90), "00:01:30");
  assert.equal(R.formatTimecode(-1, 90), "00:00:00");
});

test("countProjects ignores job clips", () => {
  assert.equal(R.countProjects([{ kind: "job" }, { kind: "project" }, { kind: "project" }]), 2);
});

test("visibleClipIds filters by category, 'all' returns everything", () => {
  const clips = [{ id: "a", category: "web" }, { id: "b", category: "qa" }];
  assert.deepEqual(R.visibleClipIds(clips, "qa"), ["b"]);
  assert.deepEqual(R.visibleClipIds(clips, "all"), ["a", "b"]);
});

test("clipMarkup renders links and images only when present", () => {
  const cats = { demo: { id: "demo", label: { ua: "Demo", en: "Demo" } } };
  const base = {
    id: "x", kind: "project", category: "demo", from: "2026-08", to: "2026-08", nda: false,
    title: { ua: "Назва", en: "Title" }, tagline: { ua: "т", en: "t" }, what: { ua: "щ", en: "w" }, result: { ua: "р", en: "r" },
    tags: ["HTML"], siteUrl: "portfolio/x/", githubUrl: null, images: true
  };
  const html = R.clipMarkup(base, 0, 15, "ua", ".", cats);
  assert.match(html, /id="clip-x"/);
  assert.match(html, /href="\.\/portfolio\/x\/"/);
  assert.match(html, /x-desktop\.jpg/);
  assert.doesNotMatch(html, /GitHub/);
  const noImg = R.clipMarkup({ ...base, images: false, siteUrl: null, githubUrl: "https://g" }, 0, 15, "en", "..", cats);
  assert.doesNotMatch(noImg, /collage/);
  assert.match(noImg, /href="https:\/\/g"/);
});

test("clipMarkup keeps external siteUrl absolute and prefixes relative ones", () => {
  const cats = { web: { id: "web", label: { ua: "Web", en: "Web" } } };
  const clip = {
    id: "v", kind: "project", category: "web", from: "2026-10", to: "2026-10", nda: false,
    title: { ua: "V" }, tagline: { ua: "" }, what: { ua: "" }, result: { ua: "" }, tags: [],
    siteUrl: "https://ext/", githubUrl: null, images: false
  };
  assert.match(R.clipMarkup(clip, 1, 2, "ua", "..", cats), /href="https:\/\/ext\/"/);
});

test("clipMarkup escapes HTML in text fields", () => {
  const cats = { web: { id: "web", label: { ua: "Web", en: "Web" } } };
  const clip = {
    id: "e", kind: "project", category: "web", from: "2026-10", to: "2026-10", nda: false,
    title: { ua: "<b>x</b>" }, tagline: { ua: "" }, what: { ua: "a & b" }, result: { ua: "" }, tags: ["<i>"],
    siteUrl: null, githubUrl: null, images: false
  };
  const html = R.clipMarkup(clip, 0, 1, "ua", ".", cats);
  assert.doesNotMatch(html, /<b>x<\/b>/);
  assert.match(html, /&lt;b&gt;x&lt;\/b&gt;/);
  assert.match(html, /a &amp; b/);
  assert.match(html, /&lt;i&gt;/);
});

test("clipMarkup renders the NDA chip for nda:true", () => {
  const cats = { web: { id: "web", label: { ua: "Web", en: "Web" } } };
  const clip = {
    id: "n", kind: "job", category: "web", from: "2025-09", to: "2026-10", nda: true,
    title: { ua: "T" }, tagline: { ua: "" }, what: { ua: "" }, result: { ua: "" }, tags: [],
    siteUrl: null, githubUrl: null, images: false
  };
  const ua = R.clipMarkup(clip, 0, 1, "ua", ".", cats);
  assert.match(ua, /під NDA/);
  const en = R.clipMarkup(clip, 0, 1, "en", ".", cats);
  assert.match(en, /under NDA/);
  const noNda = R.clipMarkup({ ...clip, nda: false }, 0, 1, "ua", ".", cats);
  assert.doesNotMatch(noNda, /під NDA/);
});

test("clipMarkup renders «тепер»/\"now\" when to:null", () => {
  const cats = { web: { id: "web", label: { ua: "Web", en: "Web" } } };
  const clip = {
    id: "o", kind: "job", category: "web", from: "2025-09", to: null, nda: false,
    title: { ua: "T" }, tagline: { ua: "" }, what: { ua: "" }, result: { ua: "" }, tags: [],
    siteUrl: null, githubUrl: null, images: false
  };
  assert.match(R.clipMarkup(clip, 0, 1, "ua", ".", cats), /тепер/);
  assert.match(R.clipMarkup(clip, 0, 1, "en", ".", cats), /now/);
});
