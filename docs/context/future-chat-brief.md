# Future Chat Brief

Last updated: 2026-06-22

## Project

Tao Dao is a standalone English sentence-construction tutor at `/Users/dmitryb/Documents/Codex/tao-dao`.

It began as an English learning concept for mastering selected failure modules, then became a local Node/static web app with a mobile-first AI chat shell.

## Current Status

- Local git repo exists.
- Branch: `main`.
- Latest committed context pack: `aaa3359 docs: add project context pack`.
- GitHub remote: `origin` -> `https://github.com/benzin777/tao-bao.git`.
- Remote reachability: push to GitHub succeeded on 2026-06-22. The local product folder remains `tao-dao`; the GitHub repository is named `tao-bao`.
- `npm test` passed after the latest app change.
- Structure Mode now has 24 source-backed formulas: 8 per level.
- Public preview previously used a Cloudflare quick tunnel pointing to `127.0.0.1:8789`, but tunnel URLs are temporary and should be re-verified before use.
- OpenAI key is configured only when `.env` contains `OPENAI_API_KEY`.
- The quality default is `gpt-5.5` with medium reasoning, `OPENAI_TIMEOUT_MS=300000`, and `OPENAI_BACKGROUND_MODE=true`; use high reasoning deliberately only when calibration proves the extra latency is worth it.
- The 2026-06-22 investigation found that a real `/api/evaluate` calibration attempt timed out with 504 under the current quality settings. Do not judge evaluator quality from shell health alone.
- Next-work research is captured in `docs/context/investigation-2026-06-22.md`; it covers curriculum depth, result surface, live calibration, lesson pages, progress loop, and GitHub/deploy.

## Current App

The app is a no-framework Node project.

```text
public/index.html
public/app.js
public/styles.css
src/server.js
src/config.js
src/formulas.js
src/openai.js
src/schema.js
src/evaluator.js
test/evaluator.test.js
```

The browser talks only to local API routes:

- `GET /api/health`
- `GET /api/formulas`
- `POST /api/task`
- `POST /api/evaluate`

## Main Product Decisions

### Chat First

The app should feel like an AI mobile chat. It should not start as a course dashboard, landing page, or generic writing editor.

### Mode / Level / Support

The learner selects:

- Mode/Lesson: Structure for MVP.
- Difficulty Level: complexity of the target sentence structure.
- Support: amount of scaffolding, independent from structure level.

### Removed Controls

The user explicitly removed:

- Formula selection.
- Quantity selection.
- Variant selection.
- Tone/presentation selection.

The app chooses the formula internally and infers rewrite enrichment automatically.

### Hint Button

The user wanted a Hint button showing groups of cohesive devices that make sense.

Implemented:

- Top-bar `Hint` button.
- Hint sheet with current task relation groups.
- General device groups: cause, result, contrast, concession, condition, addition, sequence, purpose, temporal, comparison, clarification, exemplification, emphasis, reference, conclusion.
- Tapping a device inserts it into the composer.

### Random Pattern

Structure tasks are selected randomly from the current level's formula pool. The top-bar reroll button asks the backend for a different pattern when the level has alternatives.

Task cards show backend metadata:

- Level.
- Pattern index, current-level count, and total Structure inventory count.
- Relation stack.

When the learner has not typed or submitted an attempt, mode changes and rerolls replace the draft task card instead of duplicating it in the chat.

### Course Pages

The side menu opens wiki-style course pages in a dedicated reader surface, not as chat messages. Current pages:

- Structure course.
- Level map.
- Connector sheet.
- Future lessons.

Pages are reference/course objects around the chat. They should not become the active practice loop or a dashboard.

### Structure Mode

Structure Mode trains cohesive devices and relation stacking.

Examples:

- Level 1: `cause -> result`
- Level 2: `condition -> result -> addition`
- Level 3: `concession -> cause -> result -> conclusion`

Current inventory:

- Level 1: 8 single-relation/simple-dependency patterns.
- Level 2: 8 chained-relation patterns.
- Level 3: 8 layered-argument patterns.

Support:

- Easy: formula plus scaffold.
- Normal: formula named, scaffold hidden.
- Hard: communicative goal only.

### Evaluator Doctrine

The evaluator must check:

```text
Formula fit > target lesson errors > blocking grammar > fluency > optional enrichment
```

This ordering is important. Tao Dao is not Grammarly with lessons attached; the lesson formula is the first judge.

### Teacher Turn

The result should feel like a concise spoken drill, not a report:

- show the learner sentence as the object,
- correct immediately when English is wrong,
- explain the exact construction or grammar point in short English,
- ask the learner to rewrite now.

If the model returns a corrected sentence but no issue, the repair layer creates a sentence-level grammar issue so the correction is not hidden as optional enrichment.

## Academic Frame

Structure Mode is based on:

- Cohesive devices.
- Discourse markers.
- Conjunctive adverbials.
- Relational prepositions later.
- Discourse competence.
- Conjunctive cohesion categories: additive, adversative, causal, conditional, temporal/sequential, purpose, exemplification, comparison, emphasis, reference, clarification, concession, conclusion.

## Future Lesson Families

The user identified three starting systems:

1. Structure and cohesive devices.
2. Prepositions plus articles/determiners.
3. Time/tense/aspect.

Do not expand into lesson 2 or 3 until Structure Mode proves the loop.

## Design Direction

Borrow from Webstar's discipline, not its product identity:

- Calm, restrained, Apple-like mobile controls.
- Sophisticated but not decorative.
- No marketing hero.
- No generic course dashboard.
- No nested cards.
- Chat shell first.

## GitHub / Repo State

As of 2026-06-22:

- `/Users/dmitryb/Documents/Codex/tao-dao` has local git history on `main`.
- `origin` is configured as `https://github.com/benzin777/tao-bao.git`.
- GitHub push to `tao-bao` succeeded from this shell.
- `gh` is available and authenticated in this environment.

Do not point `origin` back to `tao-dao` unless the GitHub repository is deliberately renamed or recreated.

## Important Next Moves

1. Build a live evaluator calibration harness before prompt tuning; include passing, formula-fail, and grammar-blocker examples across Level 1/2/3.
2. Run measured `/api/evaluate` checks against the expanded 24-pattern curriculum.
3. Tune prompt/schema only from observed failures, especially timeout behavior under `gpt-5.5` medium reasoning and background mode.
4. Upgrade the annotated result surface after calibration data exists.
5. Add task-scoped attempt/revision state before saved attempts or analytics.
6. Keep GitHub pushed before deploy work; remote access is currently unblocked through `benzin777/tao-bao`.
