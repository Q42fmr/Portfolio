import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

function loadData() {
  const window = {};
  vm.runInNewContext(readFileSync(new URL("../assets/js/data.js", import.meta.url), "utf8"), { window });
  return window.PORTFOLIO;
}

const data = loadData();
const repoRoot = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));

test("clips are sorted by `from` (non-decreasing)", () => {
  for (let i = 1; i < data.clips.length; i++) {
    assert.ok(
      data.clips[i - 1].from <= data.clips[i].from,
      `clip ${data.clips[i - 1].id} (${data.clips[i - 1].from}) should not come after ${data.clips[i].id} (${data.clips[i].from})`
    );
  }
});

test("every clip category exists in categories", () => {
  const categoryIds = new Set(data.categories.map((c) => c.id));
  for (const clip of data.clips) {
    assert.ok(categoryIds.has(clip.category), `clip ${clip.id} has unknown category "${clip.category}"`);
  }
});

test("every non-null clip position exists in positions", () => {
  const positionIds = new Set(data.positions.map((p) => p.id));
  for (const clip of data.clips) {
    if (clip.position !== null) {
      assert.ok(positionIds.has(clip.position), `clip ${clip.id} has unknown position "${clip.position}"`);
    }
  }
});

test("every images:true clip has desktop and mobile images on disk", () => {
  for (const clip of data.clips) {
    if (clip.images) {
      const desktop = path.join(repoRoot, "assets", "img", "projects", `${clip.id}-desktop.jpg`);
      const mobile = path.join(repoRoot, "assets", "img", "projects", `${clip.id}-mobile.jpg`);
      assert.ok(existsSync(desktop), `missing ${desktop}`);
      assert.ok(existsSync(mobile), `missing ${mobile}`);
    }
  }
});

test("every clip text field used (title, tagline, what, result) has both ua and en", () => {
  const fields = ["title", "tagline", "what", "result"];
  for (const clip of data.clips) {
    for (const field of fields) {
      const value = clip[field];
      assert.ok(value && typeof value === "object", `clip ${clip.id} field ${field} should be a language object`);
      assert.ok(typeof value.ua === "string" && value.ua.length > 0, `clip ${clip.id} field ${field}.ua missing`);
      assert.ok(typeof value.en === "string" && value.en.length > 0, `clip ${clip.id} field ${field}.en missing`);
    }
  }
});
