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
