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
