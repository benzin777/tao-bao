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

Superseded on 2026-06-22: the reachable GitHub repository is `benzin777/tao-bao`, while the local product folder remains `tao-dao`.

Movement:

- Corrected the local `origin` remote from `tao-bao` to `tao-dao`.
- Updated README, AGENTS, and future-chat context so the canonical project path and remote are no longer stale.
- Verified that GitHub currently returns `Repository not found` for the corrected `tao-dao` URL from this shell.

Historical decision, superseded:

- The project identity is `tao-dao`; `tao-bao` was a remote naming mistake and should not be carried forward. If GitHub access fails, fix repo creation or credentials instead of reverting the name.

## 2026-06-21 - Teacher Turn And Input Repair

Commit: pending at the time this entry was written.

Movement:

- Kept the quality default on `gpt-5.5` with high reasoning, but added OpenAI/client timeouts so the app does not hang silently.
- Added an explicit teacher-turn contract with correction, micro-lesson, and rewrite prompt.
- Changed result rendering away from report-like `Formula: passed` chips toward sentence-first correction inside chat.
- Added Enter-to-submit while preserving Shift+Enter for a newline.
- Fixed the composer focus state so the rounded input shell is the focus target.
- Restored the Level 1 cause-result rule as one cause-result link, not a requirement to use both cause and result markers.
- Added a repair guard: when the evaluator returns a corrected sentence but no issue, Tao Dao creates a sentence-level grammar issue so real fixes are not treated as optional enrichment.
- Added request and attempt size limits so bad input cannot silently create oversized evaluator calls.

Decision:

- The MVP should feel like a live sentence-construction teacher before it grows analytics or progress pages. Loop counts and success pipeline belong later, after the sentence/correction/rewrite loop feels reliable.

## 2026-06-21 - Minimal Mobile Chrome

Commit: pending at the time this entry was written.

Movement:

- Removed the visible title, session subtitle, and model/API pill from the mobile top bar.
- Reduced the page drawer affordance to a two-line menu icon.
- Changed the Mode control to a gear icon.
- Moved Hint beside the answer/send area in the bottom dock.
- Removed hard header/dock divider lines in favor of softer translucent surfaces.

Decision:

- The practice sentence and answer dock should carry the interface. Header metadata is not actionable enough to deserve first-row visual weight in the mobile MVP.

## 2026-06-21 - Random Pattern Control

Commit: pending at the time this entry was written.

Movement:

- Moved Hint from the bottom dock to the top bar.
- Added a top-bar randomize control for rerolling the current Structure pattern.
- Changed task creation from fixed first formula to random formula selection inside the selected level.
- Added backend task metadata for level, pattern index, total patterns in the level, and relation stack.
- Changed draft task behavior so rerolling or switching mode replaces the current task when the learner has not typed or submitted yet.

Decision:

- The learner still chooses only level/support, but the exact formula should vary. The pattern pool belongs in backend metadata; the UI should show enough of it to prove the task is not a hard-coded default.

## 2026-06-21 - Wiki-Style Page Reader

Commit: pending at the time this entry was written.

Movement:

- Changed side-menu course material from chat-injected blurbs into a dedicated full-height page reader.
- Added structured pages for Structure course, Level map, Connector sheet, and Future lessons.
- Added static coverage so the drawer keeps a reader surface and does not regress to course messages in the chat thread.
- Corrected stale interface docs around Hint and the page drawer.

Decision:

- Course pages are reference objects around the chat, not assistant turns. The chat remains the practice surface; the reader holds Notion/wiki-like lesson material.

## 2026-06-22 - Source-Backed Curriculum Run Prep

Commit: pending at the time this entry was written.

Movement:

- Verified localhost health, OpenAI key presence, and the current test suite before expanding curriculum work.
- Confirmed the active Structure pool is still 9 formulas total, with 3 patterns per level.
- Added `docs/context/source-backed-curriculum-prep.md` as the next-run handoff for a source-backed Structure curriculum expansion.
- Anchored the next expansion to CEFR, Cambridge Grammar, and Purdue OWL references before adding more formulas.

Decision:

- The next implementation slice should expand the curriculum/data model before more UI polish. More formulas should be source-backed and test-covered, not added as loose examples.

## 2026-06-22 - Six-Lane Investigation

Commit: pending at the time this entry was written.

Movement:

- Added `docs/context/investigation-2026-06-22.md` to audit curriculum depth, result surface, live evaluator calibration, source-backed lesson pages, progress loop, and GitHub/deploy as separate work lanes.
- Rechecked the active Structure inventory and confirmed it is still only 9 formulas: 3 per level.
- Attempted real `/api/evaluate` calibration and hit a 504 timeout under the current `gpt-5.5` high-reasoning settings.
- Captured the implementation order: curriculum/data model first, expanded formulas second, calibration harness before prompt tuning, result UI after curriculum stability, progress loop after the tutor turn is stable.

Decision:

- The root product gap is curriculum depth, but live evaluation latency is now a measured risk. The next slice should be source-backed curriculum expansion plus tests, followed by a calibration harness, not another visual polish pass.

## 2026-06-22 - GitHub Remote Reality

Commit: pending at the time this entry was written.

Movement:

- Confirmed the existing GitHub repository is `https://github.com/benzin777/tao-bao.git`.
- Updated local `origin` from `tao-dao` to `tao-bao`.
- Pushed local `main` successfully to GitHub.
- Updated project context so future sessions preserve the distinction between local product identity (`tao-dao`) and remote repository name (`tao-bao`).

Decision:

- Keep the local project and product named Tao Dao / `tao-dao`. Use `benzin777/tao-bao` as the GitHub remote until the repository is deliberately renamed.

## 2026-06-22 - Source-Backed Curriculum Expansion

Commit: pending at the time this entry was written.

Movement:

- Expanded Structure Mode from 9 formulas to 24 formulas: 8 per level.
- Added curriculum metadata to formulas: lesson, relation stack, scenario, punctuation rule, evaluator guidance, device groups, and source refs.
- Extended the structured-output relation enum for purpose, exemplification, sequence, comparison, emphasis, reference, and temporal relations.
- Expanded hint and wiki page material so the learner-facing reference layer matches the backend curriculum.
- Added tests for level counts, relation coverage, curriculum metadata, task metadata, and page/hint material.

Decision:

- Curriculum depth is no longer the immediate bottleneck. The next bottleneck is measured evaluator calibration across the expanded formula pool, especially timeout and prompt/schema behavior under `gpt-5.5` high reasoning.

## 2026-06-22 - Evaluator Timeout Hardening

Commit: pending at the time this entry was written.

Movement:

- Reproduced a real Level 1 `/api/evaluate` call successfully in about 12 seconds, proving the API path is connected.
- Reproduced a Level 3 high-reasoning evaluation timing out at 180 seconds, proving the bottleneck is long-running evaluator latency rather than a missing API connection.
- Moved the evaluator default to a 300-second local window.
- Enabled OpenAI Responses API background mode by default, with foreground fallback if background mode is not supported.
- Exposed evaluator timeout and background-mode status through `/api/health`.
- Added tests for timeout normalization, background-mode config, client timeout coordination, OpenAI request body shape, and background polling.

Decision:

- Keep `gpt-5.5` with high reasoning as the quality target. Use background mode and longer local timeout for reliability before lowering reasoning effort. Lower effort remains a diagnostic lever, not the default product behavior.
