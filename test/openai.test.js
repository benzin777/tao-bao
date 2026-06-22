import test from "node:test";
import assert from "node:assert/strict";
import { createEvaluationRequestBody, evaluateWithOpenAI } from "../src/openai.js";

const minimalEvaluation = {
  status: "passed",
  summary: "Structure works.",
  formula: {
    fit: "passed",
    expected: [],
    detected: [],
    missing: [],
    misplaced: [],
    explanation: "The target relation is present.",
  },
  issues: [],
  correctedSentence: "Although practice is hard, because I repeat it, I improve; therefore, I continue.",
  variants: [],
  nextInstruction: "Rewrite it once more.",
  teacherTurn: {
    line: "The structure works.",
    correction: "Although practice is hard, because I repeat it, I improve; therefore, I continue.",
    microLesson: "Although gives concession, because gives the reason, and therefore gives the conclusion.",
    rewritePrompt: "Rewrite it once more.",
  },
};

test("OpenAI request body keeps structured output and low verbosity", () => {
  const body = createEvaluationRequestBody({
    model: "gpt-5.5",
    reasoningEffort: "high",
    task: { formulaId: "test" },
    attemptText: "Because I practice, I improve.",
  });

  assert.equal(body.model, "gpt-5.5");
  assert.deepEqual(body.reasoning, { effort: "high" });
  assert.equal(body.text.verbosity, "low");
  assert.equal(body.text.format.type, "json_schema");
  assert.equal(body.text.format.strict, true);
  assert.match(body.input[1].content, /Because I practice, I improve/);
});

test("evaluateWithOpenAI uses background mode and polls until the result completes", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });

    if (options.method === "POST") {
      return jsonResponse({
        id: "resp_123",
        status: "in_progress",
      });
    }

    return jsonResponse({
      id: "resp_123",
      status: "completed",
      output_text: JSON.stringify(minimalEvaluation),
    });
  };

  try {
    const result = await evaluateWithOpenAI({
      apiKey: "test-key",
      model: "gpt-5.5",
      reasoningEffort: "high",
      timeoutMs: 1000,
      backgroundMode: true,
      pollIntervalMs: 0,
      task: { formulaId: "test" },
      attemptText: "Although practice is hard, because I repeat it, I improve; therefore, I continue.",
    });

    const createBody = JSON.parse(calls[0].options.body);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, "https://api.openai.com/v1/responses");
    assert.equal(createBody.background, true);
    assert.equal(createBody.store, true);
    assert.equal(calls[1].url, "https://api.openai.com/v1/responses/resp_123");
    assert.equal(result.status, "passed");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

function jsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  };
}
