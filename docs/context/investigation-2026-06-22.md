# Investigation: Tao Dao Next Work

Date: 2026-06-22

This investigation covers the six open product lanes before implementation:

1. Curriculum depth
2. Result surface
3. Live evaluator calibration
4. Source-backed lesson pages
5. Progress loop
6. GitHub/deploy

## Current Verified State

- Local app is running at `http://127.0.0.1:8789`.
- `/api/health` returns `ok: true`, model `gpt-5.5`, and `hasOpenAIKey: true`.
- `npm test` passes with 14 tests.
- Git branch is `main`.
- Remote was later corrected to `https://github.com/benzin777/tao-bao.git` and pushed successfully on 2026-06-22.
- Structure Mode originally had 9 live formulas: 3 per level. It was later expanded to 24 formulas: 8 per level.
- A live `/api/evaluate` calibration attempt timed out at the app's server timeout boundary.

## 1. Curriculum Depth

### External Findings

CEFR supports Tao Dao's core structure thesis. The progression from basic connectors to controlled use of cohesive devices and organisational patterns maps naturally to Tao Dao's Level 1, Level 2, and Level 3 ladder.

Cambridge Grammar supports the classification layer:

- Discourse markers connect, organise, manage writing/speaking, and express attitude.
- Writing markers include groups such as sequencing, addition, contrast, and conclusion.
- Conjunctions and linking words include coordinating conjunctions and subordinating conjunctions, including temporal subordinators.

Purdue OWL supports punctuation as a structural rule, not a cosmetic rule:

- Introductory dependent clauses such as `because`, `although`, and `if` usually create comma obligations.
- Conjunctive adverbs such as `however`, `therefore`, and `moreover` often require a semicolon or new sentence when linking independent clauses.

### Local Findings

The current formula model is too flat:

- `src/formulas.js` holds a small hard-coded list.
- `src/schema.js` relation enum is missing several groups needed for real coverage, including `purpose`, `exemplification`, `sequence`, `comparison`, `emphasis`, `reference`, and `temporal`.
- `public/app.js` has hint groups, but they are static UI data, not a shared curriculum source.

### Recommendation

Build a source-backed curriculum layer before adding more patterns. This was implemented as a 24-pattern Structure inventory.

Target first expansion:

- Level 1: 6-8 patterns.
- Level 2: 6-8 patterns.
- Level 3: 6-8 patterns.

Do not expose formula choice to the learner. The backend can become richer while the UI remains constrained.

## 2. Result Surface

### External Findings

Grammarly's useful lesson is not the brand style; it is the evidence structure:

- Inline underlines by category.
- Different suggestion classes such as correctness, clarity, engagement, and delivery.
- A detail surface explaining why a marked span matters.

LanguageTool gives a practical issue-object model:

- `offset`
- `length`
- `message`
- `replacements`
- `sentence`
- `rule.category`
- `issueType`

Hemingway proves readability can be marked separately from correctness. This matters for Tao Dao because a Level 3 sentence may be complex on purpose; complexity should not automatically mean failure.

Write & Improve is the strongest pedagogical guardrail: cautious feedback, not too many marks at once, and revision-focused guidance.

### Local Findings

The current result UI is functional but basic:

- `annotateText` renders spans with `title`, but there is no real popover.
- No visible legend.
- No selected issue state.
- No issue navigation.
- No apply/ignore/explain controls.
- No separate formula evidence rail.
- The sentence block exists, but it is not yet the dominant Grammarly-like anchor.

### Recommendation

After curriculum data is stable, build a real annotated result surface:

1. Sentence anchor with marks.
2. Compact legend.
3. Tap/hover issue popover.
4. Issue list grouped by `formula`, `required fixes`, `clarity`, `enrichment`.
5. Teacher turn stays first and concise.

Do not build a full desktop report page yet.

## 3. Live Evaluator Calibration

### External Findings

OpenAI docs support the current API direction:

- Reasoning models perform better through the Responses API.
- Structured Outputs with `strict: true` are appropriate for stable JSON contracts.
- Schema quality matters: clear key names and evals are recommended.
- Evals need test data and testing criteria.

### Local Findings

The code already uses:

- Responses API
- strict JSON schema
- high reasoning effort
- `gpt-5.5`
- server-side API key
- local timeout and repair layer

But the first live calibration run timed out:

```text
/api/evaluate failed: 504
Evaluator timed out. Try again with a shorter sentence, or lower OPENAI_REASONING_EFFORT in .env.
```

This happened on a normal calibration attempt, not a long essay. That means live quality cannot yet be judged only by the happy path.

### Recommendation

Before prompt tuning, create a calibration harness:

- 3 passing examples per level.
- 3 formula-fail examples per level.
- 3 grammar-blocker examples per level.
- Expected status, formula fit, issue category, and corrected sentence behavior.

Then run calibration in two modes:

1. Current quality mode: `gpt-5.5`, high reasoning.
2. Diagnostic mode only if needed: lower effort or shorter schema to isolate timeout cause.

Do not silently downgrade the product model. First measure where the timeout comes from.

## 4. Source-Backed Lesson Pages

### External Findings

Useful page-source anchors:

- Structure/cohesion: CEFR + Cambridge discourse markers/linking words.
- Punctuation: Purdue OWL commas, semicolons, conjunctive adverbs.
- Articles/determiners: Cambridge `a/an and the`, determiners.
- Time/tense/aspect: Cambridge present perfect, present simple/continuous, time expressions.
- Prepositions: Cambridge prepositions and common mistake pages.

Oxford-style learner explanations can help tone and readability, but the first source base should prioritize CEFR, Cambridge Grammar, and Purdue OWL because they map directly to rules and examples.

### Local Findings

The page reader exists and works, but `COURSE_PAGES` is still static content inside `public/app.js`.

The content is useful as a first-pass orientation, but not yet a real source-backed course layer.

### Recommendation

Move toward structured lesson-page data:

```js
{
  id,
  title,
  summary,
  sourceRefs,
  sections,
  examples,
  activeLesson,
  futureMode
}
```

Keep pages educational until their task generator and evaluator contract exist. Do not activate Time, Articles, or Prepositions as practice modes yet.

## 5. Progress Loop

### External Findings

Write & Improve supports:

- write
- get feedback
- revise
- resubmit
- progress graph
- staged feedback instead of overwhelming the learner

LanguageTool Statistics supports:

- productivity tracking
- error-type tracking
- writing consistency

ProWritingAid supports:

- summary report
- drill-down reports
- transition/readability/sentence-structure analysis

### Local Findings

Tao Dao currently has no durable progress loop:

- `state.messages` is in-memory only.
- No `attemptNumber` is passed through the server request.
- `previousFeedback` exists in the evaluator spec but is not implemented in the runtime path.
- No local storage or database.
- No saved attempts.
- No success pipeline.

### Recommendation

Do not build a full learner profile yet.

First progress slice should be local and task-scoped:

- attempt number
- revision count
- previous result for current task
- task status: `draft`, `needs_revision`, `passed`
- simple "loop" indicator in the result or task message

Only after that should saved attempts or analytics exist.

## 6. GitHub / Deploy

### External Findings

GitHub docs support the normal path:

- Create or authenticate the remote repository.
- Push local commits with `git push origin main`.
- GitHub CLI can create repositories with `gh repo create` when authenticated.

Cloudflare Tunnel can publish a local service through a hostname, but that is not the same as production hosting.

OpenAI production guidance reinforces:

- secure API keys
- environment variables or secret management
- scaling plan
- monitoring
- safety/testing before production

### Local Findings

Remote state at the time of this investigation:

```text
origin  https://github.com/benzin777/tao-dao.git
remote: Repository not found.
```

Later correction: the existing GitHub repository is `https://github.com/benzin777/tao-bao.git`; after switching `origin` to that URL, `main` pushed successfully.

The app runs locally, but it is not production-ready:

- no durable storage
- no hosted process manager
- no production secret manager
- no domain/TLS setup
- no deployment target
- no monitoring

### Recommendation

Order:

1. Keep `origin` on the reachable `tao-bao` repository unless GitHub is deliberately renamed.
2. Keep Cloudflare Tunnel only for previews.
3. Pick real hosting only after evaluator latency and storage needs are understood.

Do not treat the Mac as production just because localhost works.

## Recommended Implementation Order

1. Calibration harness and measured evaluator runs.
2. Prompt/schema tuning from measured failures.
3. Result surface upgrade.
4. Task-scoped progress loop.
5. Deploy planning.

## Immediate Next Slice

Implemented:

**Source-backed Structure curriculum expansion**

Acceptance:

- relation enum supports required groups
- formula pool expanded from 9 to 24
- tests assert level counts and relation coverage
- hint groups align with curriculum
- page reader explains the expanded groups
- no new user-facing formula/tone/quantity controls

Next slice: evaluator calibration harness across the expanded curriculum.

## Sources

- CEFR Table 3: https://www.coe.int/en/web/common-european-framework-reference-languages/table-3-cefr-3.3-common-reference-levels-qualitative-aspects-of-spoken-language-use
- Cambridge discourse markers: https://dictionary.cambridge.org/grammar/british-grammar/discourse-markers-so-right-okay
- Cambridge conjunctions/linking words: https://dictionary.cambridge.org/grammar/british-grammar/conjunctions-and-linking-words
- Cambridge articles: https://dictionary.cambridge.org/grammar/british-grammar/a-an-and-the
- Cambridge present perfect: https://dictionary.cambridge.org/grammar/british-grammar/present-perfect-simple-i-have-worked
- Cambridge prepositions: https://dictionary.cambridge.org/grammar/british-grammar/prepositions
- Purdue commas after introductions: https://owl.purdue.edu/owl/general_writing/punctuation/commas/commas_after_introductions.html
- Purdue commas vs semicolons: https://owl.purdue.edu/owl/general_writing/punctuation/commas/commas_vs_semicolons.html
- Write & Improve: https://help.writeandimprove.com/en/articles/1104369-how-does-write-improve-work
- Grammarly categories: https://www.grammarly.com/blog/product/better-writing-with-grammarly/
- LanguageTool output shape: https://learn.microsoft.com/en-us/connectors/languagetoolip/
- Hemingway highlighted issues: https://hemingwayapp.com/help/docs/highlighted-issues
- LanguageTool statistics: https://languagetool.org/insights/post/statistics-feature/
- ProWritingAid reports: https://prowritingaid.com/features/writing-reports
- OpenAI Structured Outputs: https://platform.openai.com/docs/guides/structured-outputs
- OpenAI text generation / Responses API: https://platform.openai.com/docs/guides/text?api-mode=responses
- OpenAI evals: https://platform.openai.com/docs/guides/evals
- OpenAI production best practices: https://platform.openai.com/docs/guides/production-best-practices
- GitHub push docs: https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository
- GitHub CLI repo create: https://cli.github.com/manual/gh_repo_create
- Cloudflare Tunnel setup: https://developers.cloudflare.com/tunnel/setup/
