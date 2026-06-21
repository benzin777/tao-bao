import { EVALUATION_SCHEMA } from "./schema.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export async function evaluateWithOpenAI({ apiKey, model, reasoningEffort, timeoutMs, task, attemptText }) {
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured.");
    error.statusCode = 503;
    error.expose = true;
    throw error;
  }

  const body = {
    model,
    reasoning: {
      effort: reasoningEffort,
    },
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "tao_dao_evaluation",
        strict: true,
        schema: EVALUATION_SCHEMA,
      },
    },
    input: [
      {
        role: "system",
        content: createSystemPrompt(),
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            task,
            attemptText,
          },
          null,
          2,
        ),
      },
    ],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs || 45000);

  let response;
  try {
    response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (fetchError) {
    const error = new Error(
      fetchError?.name === "AbortError"
        ? "Evaluator timed out. Try again, or use a faster model in .env."
        : "Evaluator request failed. Check the OpenAI key and network connection.",
    );
    error.statusCode = fetchError?.name === "AbortError" ? 504 : 502;
    error.expose = true;
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || `OpenAI request failed with ${response.status}`);
    error.statusCode = response.status;
    error.expose = true;
    throw error;
  }

  const outputText = extractOutputText(payload);
  if (!outputText) {
    const error = new Error("OpenAI response did not include text output.");
    error.statusCode = 502;
    error.expose = true;
    throw error;
  }

  try {
    return JSON.parse(outputText);
  } catch (parseError) {
    const error = new Error("OpenAI response was not valid JSON.");
    error.statusCode = 502;
    error.expose = true;
    error.cause = parseError;
    throw error;
  }
}

function createSystemPrompt() {
  return [
    "You are Tao Dao, an English sentence construction evaluator.",
    "Evaluate the learner's attempt against the selected lesson formula before judging enrichment.",
    "Preserve the learner's baseline idea and voice. Do not replace it with generic academic prose.",
    "Return only the structured output requested by the API schema.",
    "The user does not select formulas, quantity, rewrite variants, tones, or presentation modes. The app selects the formula internally from level/support.",
    "Infer any useful rewrite options yourself only after the formula fit is addressed.",
    "For level 1 cause-result tasks, accept one clear cause-result link. A cause-led frame like 'Because ___, ___.' and a result-led frame like '___, so ___.' are both valid; do not require both markers in the same simple sentence.",
    "If the input is unrelated, too short, or cannot satisfy the task, mark the formula as failed and give one concrete rewrite instruction.",
    "Feedback priority: formula fit, target connector use, blocking grammar, fluency, optional enrichment.",
    "For every issue, use exact character offsets against attemptText. If an issue is sentence-level, use startIndex 0, endIndex attemptText.length, original attemptText, and action rewrite.",
  ].join(" ");
}

function extractOutputText(payload) {
  if (typeof payload.output_text === "string") return payload.output_text;

  const chunks = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") chunks.push(content.text);
      if (typeof content.output_text === "string") chunks.push(content.output_text);
    }
  }

  return chunks.join("").trim();
}
