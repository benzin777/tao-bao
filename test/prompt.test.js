import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("OpenAI evaluator prompt protects fixed task ideas from connector-only drift", async () => {
  const openai = await readFile(new URL("../src/openai.js", import.meta.url), "utf8");

  assert.match(openai, /taskContext\.fixedIdea/);
  assert.match(openai, /do not reward a sentence that changes the idea/);
  assert.match(openai, /right relation marker but changes the fixed idea/);
});
