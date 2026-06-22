import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("health endpoint exposes evaluator runtime quality settings", async () => {
  const server = await readFile(new URL("../src/server.js", import.meta.url), "utf8");

  assert.match(server, /reasoningEffort: runtime\.reasoningEffort/);
  assert.match(server, /openaiTimeoutMs: runtime\.openaiTimeoutMs/);
  assert.match(server, /openaiBackgroundMode: runtime\.openaiBackgroundMode/);
});
