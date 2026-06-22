import { EVALUATION_SCHEMA } from "./schema.js";
import { DEFAULT_OPENAI_TIMEOUT_MS } from "./config.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const BACKGROUND_POLL_INTERVAL_MS = 2000;

export async function evaluateWithOpenAI({
  apiKey,
  model,
  reasoningEffort,
  timeoutMs,
  backgroundMode = true,
  pollIntervalMs = BACKGROUND_POLL_INTERVAL_MS,
  task,
  attemptText,
}) {
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured.");
    error.statusCode = 503;
    error.expose = true;
    throw error;
  }

  const body = createEvaluationRequestBody({ model, reasoningEffort, task, attemptText });

  const controller = new AbortController();
  const requestTimeoutMs = timeoutMs || DEFAULT_OPENAI_TIMEOUT_MS;
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const payload = backgroundMode
      ? await createAndPollBackgroundResponse({
          apiKey,
          body,
          signal: controller.signal,
          pollIntervalMs,
        })
      : await createForegroundResponse({
          apiKey,
          body,
          signal: controller.signal,
        });

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
  } catch (fetchError) {
    if (fetchError?.name === "AbortError") {
      const error = new Error(
        `Evaluator timed out after ${Math.round(requestTimeoutMs / 1000)} seconds. The API is connected, but this high-quality evaluation is still running too long. Lower OPENAI_REASONING_EFFORT in .env only for diagnostics.`,
      );
      error.statusCode = 504;
      error.expose = true;
      throw error;
    }

    throw fetchError;
  } finally {
    clearTimeout(timeout);
  }
}

export function createEvaluationRequestBody({ model, reasoningEffort, task, attemptText }) {
  return {
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
}

async function createAndPollBackgroundResponse({ apiKey, body, signal, pollIntervalMs }) {
  const createPayload = await fetchOpenAIResponse({
    apiKey,
    body: {
      ...body,
      background: true,
      store: true,
    },
    signal,
  }).catch(async (error) => {
    if (!isBackgroundModeUnsupported(error)) throw error;

    return createForegroundResponse({
      apiKey,
      body,
      signal,
    });
  });

  if (!createPayload?.id || !["queued", "in_progress"].includes(createPayload.status)) {
    return createPayload;
  }

  let payload = createPayload;
  while (["queued", "in_progress"].includes(payload.status)) {
    await sleep(pollIntervalMs, signal);
    payload = await retrieveOpenAIResponse({
      apiKey,
      responseId: payload.id,
      signal,
    });
  }

  if (payload.status && payload.status !== "completed") {
    const error = new Error(payload.error?.message || `OpenAI background response ended with status ${payload.status}.`);
    error.statusCode = 502;
    error.expose = true;
    throw error;
  }

  return payload;
}

async function createForegroundResponse({ apiKey, body, signal }) {
  return fetchOpenAIResponse({
    apiKey,
    body,
    signal,
  });
}

async function fetchOpenAIResponse({ apiKey, body, signal }) {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });

  return parseOpenAIResponse(response);
}

async function retrieveOpenAIResponse({ apiKey, responseId, signal }) {
  const response = await fetch(`${OPENAI_RESPONSES_URL}/${encodeURIComponent(responseId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal,
  });

  return parseOpenAIResponse(response);
}

async function parseOpenAIResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || `OpenAI request failed with ${response.status}`);
    error.statusCode = response.status;
    error.expose = true;
    error.openaiError = payload?.error;
    throw error;
  }

  return payload;
}

function isBackgroundModeUnsupported(error) {
  if (![400, 403].includes(error?.statusCode)) return false;
  const message = `${error.message || ""} ${error.openaiError?.param || ""}`.toLowerCase();
  return message.includes("background") || message.includes("store");
}

function sleep(durationMs, signal) {
  if (signal?.aborted) {
    return Promise.reject(signal.reason || new DOMException("Aborted", "AbortError"));
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, durationMs);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout);
        reject(signal.reason || new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function createSystemPrompt() {
  return [
    "You are Tao Dao, an English sentence construction evaluator.",
    "Evaluate the learner's attempt against the selected lesson formula before judging enrichment.",
    "Preserve the learner's baseline idea and voice. Do not replace it with generic academic prose.",
    "Return only the structured output requested by the API schema.",
    "Use English only.",
    "Teacher style: concise spoken drill. Correct immediately, explain the exact construction in one practical micro-lesson, then ask the learner to rewrite now.",
    "Do not write transcript labels, long essays, or generic chatbot encouragement.",
    "The user does not select formulas, quantity, rewrite variants, tones, or presentation modes. The app selects the formula internally from level/support.",
    "Infer any useful rewrite options yourself only after the formula fit is addressed.",
    "Lesson pack: Structure Mode trains logical links between clauses. Formula fit is first. Required relations and connector placement matter before polish.",
    "Level 1 is one relation or simple dependency, Level 2 chains relation moves, Level 3 builds a layered argument.",
    "Relation groups can include addition, contrast, cause, result, condition, concession, purpose, exemplification, sequence, comparison, clarification, conclusion, alternative, emphasis, reference, and temporal links.",
    "For level 1 cause-result tasks, accept one clear cause-result link. A cause-led frame like 'Because ___, ___.' and a result-led frame like '___, so ___.' are both valid; do not require both markers in the same simple sentence.",
    "Grammar pack: mark blocking article, tense/aspect, preposition, punctuation, spelling, capitalization, and contraction errors as issues, not as optional enrichment.",
    "Article rule pack: use 'the' for a specific or already-known singular/plural noun; use 'a/an' for a new or non-specific singular count noun; use no article for plural/general ideas when appropriate.",
    "Tense rule pack: use present continuous for actions happening now or temporary current actions; use present simple for habits and general truths; in real condition clauses, use present simple in the if-clause and will/can/may in the result clause when needed.",
    "Russian-speaker watchlist: missing articles before singular count nouns, wrong present simple vs continuous, literal word order, missing auxiliary verbs, and overusing direct translation.",
    "teacherTurn.correction must repeat correctedSentence exactly.",
    "teacherTurn.microLesson must explain the specific error or construction, not merely say the sentence is better.",
    "teacherTurn.rewritePrompt must ask the learner to rewrite the sentence now so it can be checked again.",
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
