# Tao Dao Agent Instructions

This file is the first context file for future Codex/agent sessions in `/Users/dmitryb/Documents/Codex/tao-dao`.

## Project Identity

Tao Dao is a standalone English sentence-construction tutor. It is not part of Webstar, but it borrows Webstar's discipline: ecosystem before surface, classification before design, proof over decoration, and calm tool-like UI.

## Required Reading For Substantial Work

Before product/UI/API changes, read:

1. `README.md`
2. `VISION.md`
3. `docs/context/future-chat-brief.md`
4. The relevant spec in `docs/spec/`

For Structure Mode changes, also read:

- `docs/spec/structure-mode.md`
- `docs/spec/evaluator-contract.md`

For UI shell changes, also read:

- `docs/spec/interface-shell.md`
- `docs/spec/result-surface.md`

## Current Commands

```bash
npm start
npm test
```

Do not run production builds unless a future build system exists and the user explicitly asks for a production build.

## Current Runtime

- Node ESM project.
- No frontend framework.
- Static files in `public/`.
- Local API server in `src/server.js`.
- Default port: `8789`.
- Default OpenAI model: `gpt-5.4-mini`.
- API key is loaded from `.env` as `OPENAI_API_KEY`.

## Product Rules

- The app is a constrained practice loop, not a generic chatbot.
- The learner selects lesson, level, and support.
- The app selects the exact formula internally.
- The learner does not select formula, quantity, variant, tone, or presentation mode.
- Hint is a learning aid, not a setting.
- Formula fit is checked before grammar, fluency, or enrichment.
- Preserve the learner's baseline idea and voice.
- Do not lead with rare vocabulary.

## UI Rules

- Mobile chat is the primary surface.
- Bottom dock contains Mode, Hint, composer, and send.
- Mode sheet controls only lesson/level/support.
- Hint sheet shows current task devices and general cohesive-device groups.
- Page drawer stores educational material and future lesson pages.
- Do not turn the first screen into a landing page or dashboard.
- Do not add nested cards inside cards.

## Documentation Rules

- Record major product decisions in `docs/context/delta-log.md` or a new ADR under `docs/decisions/`.
- Keep README as the human entrypoint.
- Keep `docs/context/future-chat-brief.md` dense and current for future sessions.
- If a feature changes the learner-facing mental model, update `VISION.md` and the relevant spec.

## Git Rules

- Local repo exists on `main`.
- Commit completed slices.
- Do not rewrite history unless the user explicitly asks.
- Canonical GitHub remote is `origin` -> `https://github.com/benzin777/tao-dao.git`.
- If GitHub returns `Repository not found`, do not switch back to `tao-bao`; create or authenticate access to `tao-dao`.

## Known Constraints

- `gh` GitHub CLI is not available in the shell at the time this file was written.
- No GitHub token is available in environment variables.
- Existing `.ssh` only shows `config` and `known_hosts`, not a private key.
- The local `origin` URL is configured as `tao-dao`, but GitHub currently returns `Repository not found` from this shell.
- Real evaluation requires `OPENAI_API_KEY`; without it, the app shell runs but evaluation returns the configured "No key" path.

## Near-Term Priorities

1. Add a real OpenAI key locally and test live evaluation.
2. Improve result visualization after real model responses are observed.
3. Add course pages for Structure Mode before expanding to prepositions/articles/tenses.
