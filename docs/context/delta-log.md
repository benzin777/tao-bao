# Delta Log

This log captures the movement of the Tao Dao project so future sessions can understand why the product looks the way it does.

## 2026-06-19 - Seed Concept

Commit: `023ab0e docs: seed English construction workbench spec`

Movement:

- Started as a private English construction workbench.
- Framed the product as constrained practice, not a generic grammar chatbot.
- Defined the first module as Structure Mode.
- Added the first product pipeline and Structure Mode specs.

Decision:

- Start with sentence construction and cohesive devices before broad grammar tutoring.

## 2026-06-19 - Result Surface And Evaluator Contract

Commit: `e70aeb1 docs: define result surface and evaluator contract`

Movement:

- Added the result-surface spec.
- Added evaluator output contract with formula fit, issues, corrected sentence, variants, and rewrite instruction.
- Mapped the product to reference tools like Grammarly, LanguageTool, Write & Improve, Hemingway, and ProWritingAid.

Decision:

- The UI must receive structured evidence, not free prose.
- Formula fit must be visibly separated from generic grammar feedback.

## 2026-06-19 - Rename To Tao Dao

Commit: `0888990 docs: rename project to tao dao`

Movement:

- Renamed the project to Tao Dao.
- Created the early static preview shell.

Decision:

- Use `tao-dao` as canonical local repo/project name.

## 2026-06-19 - Chat-First Shell

Commit: `452e55a docs: define chat-first interface shell`

Movement:

- Defined mobile AI chat as the primary interface.
- Moved lesson controls into an input-adjacent mode drawer.
- Defined top-left menu as pages/course navigation, not the lesson engine.

Decision:

- Do not build a dashboard first. Build the actual chat practice experience first.

## 2026-06-19 - Real Evaluator Scaffold

Commit: `3cf4b42 feat: add real OpenAI evaluator server scaffold`

Movement:

- Added local Node server.
- Added `.env` loading.
- Added OpenAI Responses API wrapper.
- Added structured output schema.
- Added formulas, task creation, evaluator repair, and server routes.

Decision:

- Keep the API key server-side.
- Use strict structured output for evaluator responses.

## 2026-06-19 - Mobile Chat Interface

Commit: `aa535be feat: add mobile chat practice interface`

Movement:

- Added `public/index.html`, `public/app.js`, and `public/styles.css`.
- Implemented top bar, page drawer, mode sheet, chat messages, task rendering, composer, and result rendering.
- Added tests for evaluator normalization and repair.

Decision:

- The first usable app is a mobile chat, not a landing page.

## 2026-06-19 - API Setup Documentation

Commit: `9471bda docs: document real api setup`

Movement:

- Documented `OPENAI_API_KEY`, default model, and local API routes.

Decision:

- Make real API setup explicit and keep local/no-key behavior visible.

## 2026-06-19 - Simplify Mode Controls

Commit: `71f96b8 feat: simplify mode controls`

Movement:

- Removed user-facing formula selection.
- Removed quantity and variant controls.
- Kept lesson, level, support, and temporary presentation controls.

Decision:

- The app, not the learner, chooses the exact formula from level/support.
- Quantity and variant are not first-order controls.

## 2026-06-19 - Add Cohesive Device Hints

Commit: `17e2fd3 feat: add cohesive device hints`

Movement:

- Removed presentation mode as a user-facing control.
- Added bottom-dock `Hint` button.
- Added Hint sheet with current task devices and general cohesive-device groups.
- Updated docs and tests so old removed controls are ignored.

Decision:

- Presentation is not a learner-selected mode. Tao Dao should infer useful rewrite enrichment automatically.
- Hints are a writing aid, not a second settings system.

## 2026-06-20 - Context Pack

Commit: pending at the time this entry was written.

Movement:

- Expanded README into a proper project entrypoint.
- Added `VISION.md`.
- Added `AGENTS.md`.
- Added this delta log.
- Added future-chat context brief.

Decision:

- Future chats should not reconstruct the project from scattered messages. They should start from the repo context.

## 2026-06-21 - Canonical Remote Correction

Commit: pending at the time this entry was written.

Movement:

- Corrected the local `origin` remote from `tao-bao` to `tao-dao`.
- Updated README, AGENTS, and future-chat context so the canonical project path and remote are no longer stale.
- Verified that GitHub currently returns `Repository not found` for the corrected `tao-dao` URL from this shell.

Decision:

- The project identity is `tao-dao`; `tao-bao` was a remote naming mistake and should not be carried forward. If GitHub access fails, fix repo creation or credentials instead of reverting the name.
