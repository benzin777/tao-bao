import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(__dirname, "..");
export const PUBLIC_DIR = path.join(ROOT_DIR, "public");

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
    openaiModel: process.env.OPENAI_MODEL || "gpt-5.4-mini",
    reasoningEffort: process.env.OPENAI_REASONING_EFFORT || "low",
    openaiTimeoutMs: Number(process.env.OPENAI_TIMEOUT_MS || 45000),
  };
}
