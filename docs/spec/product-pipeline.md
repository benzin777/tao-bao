# Product Pipeline Spec

## Objective

Create a mode-based English sentence construction workbench for learners who want to master selected failure modules before expanding to more lessons.

The first product is not a broad AI tutor. It is a constrained practice loop for sentence structure.

## Borrowed Product Method

```text
Ecosystem -> Classification -> Surface -> Implementation
```

## Ecosystem

```text
English Construction Workbench
`-- Lesson System
    `-- Structure Mode
        `-- Session
            `-- Task
            `-- Attempt
            `-- Result
            `-- Revision
```

## Classification

| Object | Class | Meaning |
| --- | --- | --- |
| Lesson | Mode | The grammar/logical system being trained. |
| Structure Level | Complexity | The linguistic sophistication required. |
| Support | Scaffolding | How much help the app gives before the learner writes. |
| Quantity | Workload | Number of attempts in the session. |
| Variant | Style target | Neutral, formal, academic, or creative enrichment. |
| Task | Prompt | A constrained instruction produced from the selected lesson settings. |
| Attempt | Learner output | The learner's sentence, kept as the baseline. |
| Result | Feedback surface | Formula fit, correction, explanation, upgrade, and rewrite request. |
| Revision | New attempt | Learner response after feedback. |

## Core Session Flow

```text
1. Select Lesson
2. Select Structure Level
3. Select Support
4. Select Quantity
5. Select Variant
6. Generate Task
7. Learner Writes Attempt
8. Submit
9. Formula Check
10. Grammar/Mechanics Check
11. Logic/Fluency Check
12. Variants Suggested
13. Learner Revises
14. Pass / Retry / Next Task
```

## MVP Controls

| Control | Values | Notes |
| --- | --- | --- |
| Lesson | Structure | Only Structure in MVP. |
| Level | 1, 2, 3 | Complexity of logical relation stack. |
| Support | Easy, Normal, Hard | Amount of scaffolding. Not the same as Level. |
| Quantity | 1, 3, 5 | Session length. |
| Variant | Neutral, Formal, Academic, Creative | Controls enrichment, not correction. |

## Result Page Anatomy

### Header

- Current lesson.
- Level and support.
- Formula target.
- Status: Passed / Needs Revision / Off Formula.

### Attempt Panel

- Learner sentence as submitted.
- Highlighted spans for formula, grammar, punctuation, connector placement, and style.
- Hover/click issue details.

### Feedback Rail

Ordered cards:

1. Formula Fit
2. Required Fixes
3. Logic Upgrade
4. Style Variant
5. Rewrite Prompt

### Variant Strip

Optional transformations:

- More direct.
- More formal.
- More academic.
- More creative.
- More concise.
- More layered.

### Revision Box

The learner rewrites the same sentence. The system compares the revision against the original attempt and prior feedback.

## Feedback Priority

The first result must not behave like a generic proofreader. Feedback order is fixed:

```text
Formula fit > target lesson errors > blocking grammar > fluency > style enrichment
```

## Data Contract Draft

```ts
type LessonMode = "structure";
type StructureLevel = 1 | 2 | 3;
type SupportLevel = "easy" | "normal" | "hard";
type Variant = "neutral" | "formal" | "academic" | "creative";

interface SessionConfig {
  lesson: LessonMode;
  level: StructureLevel;
  support: SupportLevel;
  quantity: 1 | 3 | 5;
  variant: Variant;
}

interface FormulaStep {
  id: string;
  relation:
    | "addition"
    | "contrast"
    | "cause"
    | "result"
    | "condition"
    | "concession"
    | "clarification"
    | "conclusion";
  expectedMarkers: string[];
  required: boolean;
}

interface Task {
  id: string;
  config: SessionConfig;
  formula: FormulaStep[];
  instruction: string;
  scaffold?: string;
  sourceIdea?: string;
}

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
    | "style";
  severity: "blocking" | "warning" | "suggestion";
  original: string;
  replacement?: string;
  explanation: string;
  startIndex: number;
  endIndex: number;
  relationId?: string;
}

interface AttemptResult {
  taskId: string;
  attemptText: string;
  formulaFit: "passed" | "partial" | "failed";
  score: {
    formula: number;
    correctness: number;
    fluency: number;
    style: number;
  };
  issues: FeedbackIssue[];
  correctedSentence: string;
  upgradedVariants: Record<Variant | "concise" | "layered", string>;
  rewriteInstruction: string;
}
```

## Non-Goals For MVP

- No live browser-extension correction.
- No speech/pronunciation.
- No broad essay grading.
- No full CEFR placement test.
- No learner profile/outfit yet.
- No gamified streaks or leaderboards.
- No prepositions/articles/tenses modes until Structure Mode proves the loop.

