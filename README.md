# Tao Dao

Tao Dao is a private English sentence-construction tutor: a mobile-first AI chat that trains one selected language failure module at a time. The current MVP focuses on Structure Mode, where the learner practices logical sentence patterns such as `cause -> result`, `condition -> result -> addition`, and `concession -> cause -> result -> conclusion`.

The product is not a generic grammar chatbot. It is a constrained writing workbench: the app gives a task, the learner writes from their own baseline, and the evaluator checks whether the sentence satisfies the selected linguistic structure before correcting grammar or suggesting enrichment.

## Current State

- Local project path: `/Users/dmitryb/Documents/Codex/tao-dao`
- Local git repo: yes, branch `main`
- GitHub remote: `origin` -> `https://github.com/benzin777/tao-bao.git`
- Remote reachability: pushed successfully to GitHub on 2026-06-22.
- Runtime: no-framework Node server plus static mobile UI
- API provider: OpenAI Responses API through the local server
- Default model: `gpt-5.5`
- OpenAI key status on this machine: not configured unless `.env` contains `OPENAI_API_KEY`

## Quick Start

```bash
cd /Users/dmitryb/Documents/Codex/tao-dao
cp .env.example .env
# add OPENAI_API_KEY to .env
npm start
```

Open the local app at:

```text
http://127.0.0.1:8789
```

Run tests:

```bash
npm test
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Starts the local Tao Dao server. |
| `npm test` | Runs the Node test suite. |
| `PORT=8789 npm start` | Starts the server on the phone-preview port used during early testing. |

## Environment

Create `.env` from `.env.example`.

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.5
OPENAI_REASONING_EFFORT=high
PORT=8789
OPENAI_TIMEOUT_MS=90000
```

The API key stays server-side. The browser only calls local `/api/*` endpoints.

## Product Thesis

Learners do not first need rare vocabulary. They need control over the small grammatical and discourse systems that make English sound coherent.

Tao Dao teaches by isolating one system, creating constrained tasks, and giving corrective feedback against that system. The first system is cohesion: how connectors and relation markers turn isolated clauses into a logical sentence.

## Core Loop

```text
Select mode -> receive task -> write attempt -> submit -> result -> revise -> resubmit
```

Current MVP controls:

| Control | Meaning |
| --- | --- |
| Lesson | `Structure` only for MVP. |
| Level | Structure complexity: 1, 2, or 3. |
| Support | Scaffolding: Easy, Normal, or Hard. |
| Hint | Opens cohesive-device groups while writing. |

Removed controls:

- Formula selection: Tao Dao chooses the formula internally from level/support.
- Quantity: not needed for the first loop.
- Variant/tone selection: Tao Dao infers rewrite enrichment automatically after formula fit.

## Structure Mode

Level and Support are separate.

```text
Level = how complex the target sentence structure is.
Support = how much scaffolding the learner receives.
```

Examples:

| Level | Formula | Example Shape |
| --- | --- | --- |
| 1 | `cause -> result` | `Because ___, ___.` |
| 2 | `condition -> result -> addition` | `If ___, ___, and ___.` |
| 3 | `concession -> cause -> result -> conclusion` | `Although ___, because ___, ___; therefore, ___.` |

Support modes:

| Support | Behavior |
| --- | --- |
| Easy | Shows the formula and fillable scaffold. |
| Normal | Names the formula but hides the full frame. |
| Hard | Gives a communicative goal without showing the frame. |

## Current Interface

The app is an AI mobile chat shell.

```text
Top-left menu -> wiki-style course pages / lessons
Main display  -> chat
Top bar       -> pages, Hint, randomize pattern
Bottom dock   -> Mode, input, send
Mode sheet    -> lesson, level, support
Hint sheet    -> current formula devices plus general device groups
Page reader   -> Structure notes, level map, connector sheet, future lesson notes
Result        -> structured assistant message inside chat
```

The UI intentionally borrows restraint from Webstar's design method, but Tao Dao is a separate project.

## Architecture

```text
public/
  index.html       mobile chat shell
  app.js           client state, task flow, hint sheet, rendering
  styles.css       mobile-first interface styling

src/
  server.js        static server and JSON API routes
  config.js        .env loading and runtime config
  formulas.js      lesson config, formula inventory, task creation
  openai.js        OpenAI Responses API call and evaluator prompt
  schema.js        strict structured-output schema
  evaluator.js     attempt normalization and evaluator repair layer

test/
  evaluator.test.js

docs/
  spec/            product, interface, result, structure, evaluator specs
  research/        external reference map
  context/         future-chat brief and delta log
```

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Reports server status, selected model, and whether an OpenAI key is configured. |
| `GET /api/formulas?level=1` | Returns formulas for a structure level. |
| `POST /api/task` | Creates a Structure Mode task from `lesson`, `level`, and `support`. |
| `POST /api/evaluate` | Sends the learner attempt to the OpenAI evaluator and returns structured feedback. |

Current guardrails:

- JSON request bodies are limited to 64 KB.
- Sentence attempts are limited to 800 characters.

## Feedback Priority

The result must not behave like a generic proofreader or a generic chat answer.

```text
Formula fit > target lesson errors > blocking grammar > fluency > optional enrichment
```

This ordering is the core product difference. A grammatically correct sentence can still fail if it does not satisfy the selected structure.

The assistant turn should stay practical: show the learner sentence, correct immediately when needed, explain the exact construction briefly, then ask for a rewrite.

## Documentation Map

Start here in future sessions:

| File | Use |
| --- | --- |
| `AGENTS.md` | Operating rules for future Codex/agent sessions. |
| `VISION.md` | Product vision, values, and long-term direction. |
| `docs/context/future-chat-brief.md` | Compressed project memory and current state. |
| `docs/context/delta-log.md` | Chronological decision and build log. |
| `docs/spec/product-pipeline.md` | Product object model and session flow. |
| `docs/spec/interface-shell.md` | Mobile chat, mode sheet, hint sheet, and page drawer rules. |
| `docs/spec/structure-mode.md` | Structure Mode pedagogy and formula inventory. |
| `docs/spec/evaluator-contract.md` | Structured evaluator contract and validation rules. |
| `docs/research/reference-map.md` | External product/research references to avoid reinvention. |

## Non-Goals For The MVP

- No broad essay grading.
- No generic chatbot mode.
- No live browser-extension correction.
- No learner outfit/progress profile yet.
- No gamified badges/streaks yet.
- No prepositions/articles/tenses modes until Structure Mode proves the loop.
- No visible tone or presentation-mode selector.

## GitHub Status

The local project identity is `tao-dao`; the existing GitHub repository is named `tao-bao`.

```bash
git remote -v
```

Expected remote:

```bash
origin  https://github.com/benzin777/tao-bao.git (fetch)
origin  https://github.com/benzin777/tao-bao.git (push)
```

Current caveat: the repository name on GitHub does not match the local product folder name. Keep the local folder as `tao-dao`, but push to `tao-bao` unless the remote repository is deliberately renamed.

If the remote ever needs to be recreated:

```bash
git remote set-url origin https://github.com/benzin777/tao-bao.git
git push -u origin main
```
