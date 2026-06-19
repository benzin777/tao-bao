# English Construction Workbench

Private local research and product spec for a mode-based English sentence construction tutor.

## Status

This repository is a product/spec shell. No application framework has been selected yet.

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

