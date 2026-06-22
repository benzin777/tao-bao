import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("page drawer has a dedicated reader surface", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

  assert.match(html, /id="pageReader"/);
  assert.match(html, /id="readerBody"/);
  assert.match(html, /id="pageReader"[^>]*inert/);
  assert.match(app, /function openReaderPage/);
  assert.match(app, /removeAttribute\("inert"\)/);
  assert.match(app, /setAttribute\("inert", ""\)/);
  assert.doesNotMatch(app, /kind: "material"/);
});

test("page data is initialized before the app renders the default reader page", async () => {
  const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

  assert.ok(app.indexOf("const COURSE_PAGES") < app.indexOf("init();"));
});

test("hint and page material include the expanded structure relation groups", async () => {
  const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
  const requiredTerms = [
    "Purpose",
    "Exemplification",
    "Sequence",
    "Comparison",
    "Emphasis",
    "Reference",
    "Temporal",
  ];

  for (const term of requiredTerms) {
    assert.match(app, new RegExp(term), `Missing relation material for ${term}`);
  }

  assert.match(app, /CEFR/);
  assert.match(app, /Cambridge/);
  assert.match(app, /Purdue/);
});

test("client evaluator timeout follows the server health timeout", async () => {
  const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

  assert.match(app, /evaluateTimeoutMs: 310000/);
  assert.match(app, /health\.openaiTimeoutMs/);
  assert.match(app, /state\.evaluateTimeoutMs = Math\.max\(95000, Number\(health\.openaiTimeoutMs\) \+ 10000\)/);
  assert.match(app, /timeoutMs: state\.evaluateTimeoutMs/);
  assert.doesNotMatch(app, /\/api\/evaluate[\s\S]{0,500}timeoutMs:\s*95000/);
});
