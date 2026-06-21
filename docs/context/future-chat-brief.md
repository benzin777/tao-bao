# Future Chat Brief

Last updated: 2026-06-21

## Project

Tao Dao is a standalone English sentence-construction tutor at `/Users/dmitryb/Documents/Codex/tao-dao`.

It began as an English learning concept for mastering selected failure modules, then became a local Node/static web app with a mobile-first AI chat shell.

## Current Status

- Local git repo exists.
- Branch: `main`.
- Latest committed context pack: `aaa3359 docs: add project context pack`.
- Canonical GitHub remote: `origin` -> `https://github.com/benzin777/tao-dao.git`.
- Remote reachability: `git ls-remote --heads origin main` currently returns `Repository not found`, so the private repo may need to be created or credentials may need to be added.
- `npm test` passed after the latest app change.
- Public preview previously used a Cloudflare quick tunnel pointing to `127.0.0.1:8789`, but tunnel URLs are temporary and should be re-verified before use.
- OpenAI key is not configured on this machine unless the user adds `.env`.

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

- Bottom dock `Hint` button.
- Hint sheet with current task relation groups.
- General device groups: cause, result, contrast, concession, condition, addition, sequence, clarification, example, conclusion.
- Tapping a device inserts it into the composer.

### Structure Mode

Structure Mode trains cohesive devices and relation stacking.

Examples:

- Level 1: `cause -> result`
- Level 2: `condition -> result -> addition`
- Level 3: `concession -> cause -> result -> conclusion`

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

## Academic Frame

Structure Mode is based on:

- Cohesive devices.
- Discourse markers.
- Conjunctive adverbials.
- Relational prepositions later.
- Discourse competence.
- Conjunctive cohesion categories: additive, adversative, causal, conditional, temporal/sequential, clarification, concession, conclusion.

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

As of 2026-06-21:

- `/Users/dmitryb/Documents/Codex/tao-dao` has local git history on `main`.
- `origin` is configured as `https://github.com/benzin777/tao-dao.git`.
- GitHub returns `Repository not found` for that URL from this shell.
- `gh` is not available.
- No GitHub token is visible in env vars.
- No SSH private key is visible under `~/.ssh`.

If credentials become available, verify or create the private GitHub repo named `tao-dao` and push `main`.

## Important Next Moves

1. Configure `OPENAI_API_KEY` and test real evaluations.
2. Observe real model output and tune the prompt/schema.
3. Build richer Structure course pages.
4. Add saved attempts and progression only after the first loop is stable.
