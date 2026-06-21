# Evaluator Contract

## Objective

Define the contract between the AI evaluator and the UI before implementation.

The UI must receive structured evidence, not prose. The evaluator can produce explanations, but the response shape must remain stable.

## Evaluation Order

```text
1. Normalize attempt
2. Detect formula relation steps
3. Check connector placement
4. Detect blocking grammar/mechanics issues
5. Evaluate fluency and logic
6. Produce correction and variants
7. Produce one next rewrite instruction
```

## Request Shape

```ts
interface EvaluationRequest {
  task: Task;
  attemptText: string;
  attemptNumber: number;
  previousFeedback?: AttemptResult;
}
```

## Response Shape

```ts
interface EvaluationResponse {
  status: "passed" | "needs_revision" | "off_formula";
  summary: string;
  formula: FormulaEvaluation;
  issues: FeedbackIssue[];
  correctedSentence: string;
  variants: SentenceVariant[];
  nextInstruction: string;
  teacherTurn: TeacherTurn;
}

interface FormulaEvaluation {
  fit: "passed" | "partial" | "failed";
  expected: FormulaStep[];
  detected: DetectedRelation[];
  missing: FormulaStep[];
  misplaced: DetectedRelation[];
  explanation: string;
}

interface DetectedRelation {
  relationId: string;
  relation: FormulaStep["relation"];
  marker: string;
  textSpan: {
    startIndex: number;
    endIndex: number;
    text: string;
  };
  confidence: number;
}

interface SentenceVariant {
  id: string;
  variant: "clearer" | "formal" | "academic" | "creative" | "concise" | "layered";
  sentence: string;
  changeNote: string;
}

interface TeacherTurn {
  line: string;
  correction: string;
  microLesson: string;
  rewritePrompt: string;
}
```

## Issue Contract

All issues must use exact offsets against the learner's submitted text.

```ts
interface FeedbackIssue {
  id: string;
  category:
    | "formula"
    | "connector"
    | "grammar"
    | "article"
    | "preposition"
    | "tense"
    | "punctuation"
    | "clarity"
    | "enrichment";
  severity: "blocking" | "warning" | "suggestion";
  original: string;
  replacement?: string;
  explanation: string;
  startIndex: number;
  endIndex: number;
  relationId?: string;
  action: "rewrite" | "apply" | "notice" | "optional";
}
```

## Validation Rules

Before rendering, the application must validate:

1. `original` equals `attemptText.slice(startIndex, endIndex)`.
2. Index ranges are non-overlapping or intentionally grouped.
3. Required formula issues have a `relationId`.
4. Blocking issues appear before optional enrichment issues.
5. Variants do not contradict the selected formula.
6. Corrected sentence preserves the learner's baseline idea.
7. `teacherTurn.correction` matches `correctedSentence`.

If validation fails, the UI should not render faulty inline offsets. It should fall back to sentence-level feedback.

## Anti-Drift Rules

The evaluator must not:

- Turn every answer into a long essay.
- Rewrite correct sentences only for taste.
- Praise enrichment before formula fit.
- Replace the learner's voice with generic academic prose.
- Hide the selected formula.
- Use unsupported labels.
- Return raw markdown as the only output.
- Hide real grammar, article, tense, punctuation, or capitalization corrections inside optional rewrite variants.
- Explain like a generic chatbot instead of giving a concise teacher-style correction and rewrite cue.

## Prompting Implication

The eventual API call should use structured outputs or equivalent schema validation. Prose-only output is unacceptable for the result page.

## Later Integration Options

| Option | Use |
| --- | --- |
| LLM-only evaluator | Fastest MVP for formula + grammar + variants. Requires strict schema validation. |
| LanguageTool or Harper pre-pass | Adds deterministic grammar/mechanics checks. Useful later if AI corrections drift. |
| Hybrid evaluator | Deterministic grammar engine + LLM formula/variant engine. Best long-term path. |

## MVP Recommendation

Start with an LLM-only evaluator with strict structured output and local validation.

Reason:

- Formula fit is the product's core and existing grammar engines do not understand the lesson formula.
- Grammar engines can be added later as a second pass.
- The submit-based flow reduces the risk of live correction latency and bad underlines.

## Teacher-Turn Rule

The result must feel like a practical spoken drill, not a report.

Required behavior:

1. Correct immediately when the sentence needs a real fix.
2. Explain the exact construction or error in short English.
3. Ask the learner to rewrite now so the next attempt can be checked.
4. Preserve the learner's baseline idea.

The UI can still render issues and variants, but the teacher turn is the primary chat response.
