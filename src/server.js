import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { getRuntimeConfig, PUBLIC_DIR } from "./config.js";
import { createTask, evaluateAttempt, getFormulasByLevel, STRUCTURE_FORMULAS } from "./evaluator.js";

const runtime = getRuntimeConfig();

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (url.pathname === "/api/health" && request.method === "GET") {
      return sendJson(response, 200, {
        ok: true,
        model: runtime.openaiModel,
        hasOpenAIKey: Boolean(runtime.openaiApiKey),
      });
    }

    if (url.pathname === "/api/formulas" && request.method === "GET") {
      const level = Number(url.searchParams.get("level") || 1);
      return sendJson(response, 200, {
        formulas: getFormulasByLevel(level),
      });
    }

    if (url.pathname === "/api/task" && request.method === "POST") {
      const body = await readJson(request);
      return sendJson(response, 200, {
        task: createTask(body?.config),
        formulas: STRUCTURE_FORMULAS,
      });
    }

    if (url.pathname === "/api/evaluate" && request.method === "POST") {
      const body = await readJson(request);
      const result = await evaluateAttempt({
        config: body?.config,
        task: body?.task,
        attemptText: body?.attemptText,
        openai: {
          apiKey: runtime.openaiApiKey,
          model: runtime.openaiModel,
          reasoningEffort: runtime.reasoningEffort,
        },
      });

      return sendJson(response, 200, { result });
    }

    if (request.method === "GET") {
      return serveStatic(url.pathname, response);
    }

    sendJson(response, 405, {
      error: "Method not allowed.",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    sendJson(response, statusCode, {
      error: statusCode >= 500 ? "Server error." : error.message,
    });
  }
});

server.listen(runtime.port, "0.0.0.0", () => {
  console.log(`Tao Dao running at http://127.0.0.1:${runtime.port}`);
  console.log(`OpenAI model: ${runtime.openaiModel}`);
  console.log(`OpenAI key configured: ${runtime.openaiApiKey ? "yes" : "no"}`);
});

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function serveStatic(urlPathname, response) {
  const requestPath = decodeURIComponent(urlPathname === "/" ? "/index.html" : urlPathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    return sendJson(response, 403, { error: "Forbidden." });
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return sendJson(response, 404, { error: "Not found." });
  }

  response.writeHead(200, {
    "Content-Type": contentTypeFor(filePath),
    "Cache-Control": "no-store",
  });
  fs.createReadStream(filePath).pipe(response);
}

function contentTypeFor(filePath) {
  const extension = path.extname(filePath);
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".svg": "image/svg+xml",
    }[extension] || "application/octet-stream"
  );
}

