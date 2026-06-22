# Source-Backed Curriculum Prep

Date: 2026-06-22

## Current Verified Runtime

- Local app is running at `http://127.0.0.1:8789`.
- `/api/health` returns `ok: true`, model `gpt-5.5`, and `hasOpenAIKey: true`.
- `npm test` passes with 14 tests.
- Git branch is `main`, ahead of `origin/main` locally. The exact count can change until GitHub access is fixed.

## Problem To Solve Next

The product philosophy is bigger than the active curriculum.

The live app now has a wiki-style page reader and a working Structure Mode loop, but the backend formula pool is still shallow:

- Level 1 has 3 patterns.
- Level 2 has 3 patterns.
- Level 3 has 3 patterns.

This makes the random pattern control feel real technically, but limited pedagogically.

## Source Anchors

Use these sources as the first authority layer for the next Structure Mode expansion:

| Source | Use In Tao Dao |
| --- | --- |
| Council of Europe CEFR Table 3 | Ground the level ladder: basic connectors at low levels, controlled use of organisational patterns and cohesive devices at higher levels. |
| Cambridge Grammar: discourse markers | Ground the idea that markers connect, organise, manage writing/speaking, and have functional jobs rather than only dictionary meanings. |
| Cambridge Grammar: conjunctions and linking words | Ground conjunction/linking-word categories, especially coordinating and subordinating conjunctions. |
| Purdue OWL: commas after introductions | Ground punctuation obligations around introductory clauses and sentence-opening connectors. |

Working URLs:

- https://www.coe.int/en/web/common-european-framework-reference-languages/table-3-cefr-3.3-common-reference-levels-qualitative-aspects-of-spoken-language-use
- https://dictionary.cambridge.org/grammar/british-grammar/discourse-markers-so-right-okay
- https://dictionary.cambridge.org/grammar/british-grammar/conjunctions-and-linking-words
- https://owl.purdue.edu/owl/general_writing/punctuation/commas/commas_after_introductions.html

## Curriculum Data Target

Before adding many more formulas, split the current flat formula list into a curriculum-shaped model.

Recommended shape:

```js
{
  id,
  lesson: "structure",
  level,
  relationStack,
  label,
  scaffold,
  sourceIdea,
  scenario,
  deviceGroups,
  punctuationRule,
  evaluationGuidance,
  sourceRefs
}
```

Required relation groups for the next slice:

- addition
- contrast
- cause
- result
- condition
- concession
- purpose
- exemplification
- sequence
- comparison
- clarification
- conclusion

Do not activate prepositions/articles/time as separate modes in this slice. They can appear as future lesson pages or correction categories only.

## First Expansion Target

Move from 9 formulas to 18-24 formulas.

Suggested distribution:

- Level 1: 6-8 one-relation patterns.
- Level 2: 6-8 two-move patterns.
- Level 3: 6-8 layered patterns.

The learner should still see only the selected task and helpful hints. The backend can know more than the UI reveals.

## Implementation Checklist

1. Add a curriculum module or expand `src/formulas.js` without changing public controls.
2. Extend the relation enum in `src/schema.js` before formulas use new relation names.
3. Add tests that assert formula counts by level and relation coverage.
4. Update hint groups so new relation groups have device examples.
5. Update the page reader content to reflect the expanded Structure curriculum.
6. Keep `/api/task` and `/api/formulas` contracts compatible unless there is a deliberate contract update.
7. Run real `/api/evaluate` checks only after formula data and schema validation pass locally.

Note: a 2026-06-22 live calibration attempt against `/api/evaluate` timed out with 504 under the current `gpt-5.5` high-reasoning settings. Keep the quality model as the target, but add a measured calibration harness before treating evaluator behavior as proven.

## Acceptance Criteria

- `npm test` passes.
- `/api/formulas?level=1`, `level=2`, and `level=3` each return a meaningfully larger pool.
- Randomize avoids repeating the current formula when alternatives exist.
- Task metadata still reports level, pattern index, pattern count, and relation stack.
- Page reader explains the new relation groups without turning the home surface into a dashboard.
- No new user-facing controls are added for formula, tone, quantity, or variant.

## Non-Goals

- No progress dashboard yet.
- No saved attempts yet.
- No generic chatbot mode.
- No active Time, Articles, or Prepositions mode yet.
- No production deployment work in this slice.
