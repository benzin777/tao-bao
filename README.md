# Tao Dao

Private local research and product spec for a mode-based English sentence construction tutor.

## Status

This repository now contains the V0 app shell and server.

Run it with:

```bash
cp .env.example .env
# add OPENAI_API_KEY to .env
npm start
```

The default model is `gpt-5.5`. The API key stays server-side; the browser only calls local `/api/*` endpoints.

## Product Thesis

Build a constrained writing practice workbench, not a generic grammar chatbot.

The learner selects a lesson mode, structure level, support level, and quantity. The app assigns a task, the learner writes a sentence, and the result page checks the attempt against the selected linguistic formula before correcting grammar or style.

## Borrowed Discipline

This is not a Webstar product. It borrows Webstar's working method:

- Ecosystem before surface.
- Classification before design.
- Proof over decoration.
- Calm, restrained product UI.
- Correct naming to prevent feature drift.

## Core References

- Write & Improve: task -> write -> feedback -> revise practice loop.
- Grammarly: visible suggestions, goals, category scores, result sidebar.
- LanguageTool: structured issue objects with offsets, replacements, categories, and rules.
- TextChecker / Open Grammarly / Scramble: open-source interaction and prompt-command patterns.

## MVP

First mode only:

```text
Lesson: Structure
Level: 1 / 2 / 3
Support: Easy / Normal / Hard
Quantity: 1 / 3 / 5 attempts
Variant: neutral / formal / academic / creative
```

No live correction in the first build. The first loop is submit-based:

```text
Select mode -> receive task -> write attempt -> submit -> result -> revise -> resubmit
```

## API Notes

- `POST /api/task` creates the current Structure Mode task.
- `POST /api/evaluate` sends the learner attempt to OpenAI through the server.
- `GET /api/health` reports whether the server has an OpenAI key configured.
- `OPENAI_REASONING_EFFORT` defaults to `high` for quality; set it to `xhigh` only if slower, more expensive responses are acceptable.
