import { EVALUATION_SCHEMA } from "./schema.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export async function evaluateWithOpenAI({ apiKey, model, reasoningEffort, task, attemptText }) {
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

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || `OpenAI request failed with ${response.status}`);
    error.statusCode = response.status;
    throw error;
  }

  const outputText = extractOutputText(payload);
  if (!outputText) {
    const error = new Error("OpenAI response did not include text output.");
    error.statusCode = 502;
    throw error;
  }

  try {
    return JSON.parse(outputText);
  } catch (parseError) {
    const error = new Error("OpenAI response was not valid JSON.");
    error.statusCode = 502;
    error.cause = parseError;
    throw error;
  }
}

function createSystemPrompt() {
  return [
    "You are Tao Dao, an English sentence construction evaluator.",
    "Evaluate the learner's attempt against the selected lesson formula before judging style.",
    "Preserve the learner's baseline idea and voice. Do not replace it with generic academic prose.",
    "Return only the structured output requested by the API schema.",
    "The user no longer selects formulas, quantity, or a single style variant. The app selects the formula internally from level/support.",
    "If task.config.styleModes contains values, make rewritten options reflect those selected style changes. If it is empty, infer the most useful options yourself.",
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
