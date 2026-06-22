import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(__dirname, "..");
export const PUBLIC_DIR = path.join(ROOT_DIR, "public");
export const DEFAULT_OPENAI_TIMEOUT_MS = 300000;
export const DEFAULT_OPENAI_REASONING_EFFORT = "medium";

export function loadDotEnv(filePath = path.join(ROOT_DIR, ".env")) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function getRuntimeConfig() {
  loadDotEnv();

  return {
    port: Number(process.env.PORT || 8789),
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    openaiModel: process.env.OPENAI_MODEL || "gpt-5.5",
    reasoningEffort: normalizeOpenAIReasoningEffort(process.env.OPENAI_REASONING_EFFORT),
    openaiTimeoutMs: normalizeOpenAITimeoutMs(process.env.OPENAI_TIMEOUT_MS),
    openaiBackgroundMode: normalizeOpenAIBackgroundMode(process.env.OPENAI_BACKGROUND_MODE),
  };
}

export function normalizeOpenAIReasoningEffort(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["none", "low", "medium", "high", "xhigh"].includes(normalized)
    ? normalized
    : DEFAULT_OPENAI_REASONING_EFFORT;
}

export function normalizeOpenAITimeoutMs(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_OPENAI_TIMEOUT_MS;
}

export function normalizeOpenAIBackgroundMode(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return !["0", "false", "no", "off"].includes(normalized);
}
