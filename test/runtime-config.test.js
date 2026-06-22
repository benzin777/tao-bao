import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_OPENAI_TIMEOUT_MS,
  normalizeOpenAIBackgroundMode,
  normalizeOpenAITimeoutMs,
} from "../src/config.js";

test("OpenAI evaluator timeout defaults to the quality-safe 300 second window", () => {
  assert.equal(DEFAULT_OPENAI_TIMEOUT_MS, 300000);
  assert.equal(normalizeOpenAITimeoutMs(undefined), 300000);
  assert.equal(normalizeOpenAITimeoutMs(""), 300000);
  assert.equal(normalizeOpenAITimeoutMs("not-a-number"), 300000);
  assert.equal(normalizeOpenAITimeoutMs("0"), 300000);
});

test("OpenAI evaluator timeout can still be configured explicitly", () => {
  assert.equal(normalizeOpenAITimeoutMs("60000"), 60000);
});

test("OpenAI background mode is enabled unless explicitly disabled", () => {
  assert.equal(normalizeOpenAIBackgroundMode(undefined), true);
  assert.equal(normalizeOpenAIBackgroundMode("true"), true);
  assert.equal(normalizeOpenAIBackgroundMode("1"), true);
  assert.equal(normalizeOpenAIBackgroundMode("false"), false);
  assert.equal(normalizeOpenAIBackgroundMode("0"), false);
  assert.equal(normalizeOpenAIBackgroundMode("off"), false);
});
