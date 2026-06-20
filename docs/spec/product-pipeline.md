# Product Pipeline Spec

## Objective

Create a mode-based English sentence construction workbench for learners who want to master selected failure modules before expanding to more lessons.

The first product is not a broad AI tutor. It is a constrained practice loop for sentence structure.

The primary interface is a full-screen AI chat. The lesson engine lives inside chat turns and compact drawers, not a traditional education dashboard.

## Borrowed Product Method

```text
Ecosystem -> Classification -> Surface -> Implementation
```

## Ecosystem

```text
Tao Dao
`-- Chat Shell
    |-- Input Dock
    |-- Mode Drawer
    |-- Page / Project Drawer
    `-- Lesson System
        `-- Structure Mode
            `-- Session
                `-- Task
                `-- Attempt
                `-- Result Message
                `-- Revision
```

## Classification

| Object | Class | Meaning |
| --- | --- | --- |
| Lesson | Mode | The grammar/logical system being trained. |
| Structure Level | Complexity | The linguistic sophistication required. |
| Support | Scaffolding | How much help the app gives before the learner writes. |
| Hint Groups | Learning aid | Cohesive-device groups the learner can open while writing. |
| Task | Prompt | A constrained instruction produced from the selected lesson settings. |
| Attempt | Learner output | The learner's sentence, kept as the baseline. |
| Result | Feedback surface | Formula fit, correction, explanation, upgrade, and rewrite request. |
| Revision | New attempt | Learner response after feedback. |
| Chat Shell | Surface | The full-screen AI chat that contains the lesson loop. |
| Input Dock | Control Origin | Text input plus mode, hint, and send controls. |
| Mode Drawer | Control Sheet | Lesson, level, and support. |
| Page Drawer | Navigation | Course material, lesson subpages, saved writing later, and later projects. |

## Core Session Flow

```text
1. Select Lesson
2. Select Structure Level
3. Select Support
4. Generate Task
5. Open hints if needed
6. Learner Writes Attempt
7. Submit
8. Formula Check
9. Grammar/Mechanics Check
10. Logic/Fluency Check
11. Automatic enrichment suggested when useful
12. Learner Revises
13. Pass / Retry / Next Task
```

## MVP Controls

| Control | Values | Notes |
| --- | --- | --- |
| Lesson | Structure | Only Structure in MVP. |
| Level | 1, 2, 3 | Complexity of logical relation stack. |
| Support | Easy, Normal, Hard | Amount of scaffolding. Not the same as Level. |
| Hint | Device groups | Opens current-task devices plus the general cohesion inventory. Not a setting. |

## Interface Shell

The MVP surface is chat-first:

```text
Top-left menu -> course pages / lessons
Main display  -> AI chat
Bottom dock   -> mode, input, send
Mode drawer   -> slides from the input dock
Result        -> structured assistant message inside chat
```

The app can later add desktop rails, but the mobile mental model remains the source of truth.

## Result Message Anatomy

### Header / Status Line

- Current lesson.
- Level and support.
- Formula target.
- Status: Passed / Needs Revision / Off Formula.

### Attempt Block

- Learner sentence as submitted.
- Highlighted spans for formula, grammar, punctuation, connector placement, and enrichment.
- Hover/click issue details.

### Feedback Stack

Ordered cards:

1. Formula Fit
2. Required Fixes
3. Logic Upgrade
4. Automatic Enrichment
5. Rewrite Prompt

### Automatic Enrichment

Optional rewrite improvements selected by Tao Dao after formula fit and required fixes are handled. These are not learner settings.

### Revision Input

The learner rewrites in the bottom chat input. The system compares the revision against the original attempt and prior feedback.

## Feedback Priority

The first result must not behave like a generic proofreader. Feedback order is fixed:

```text
Formula fit > target lesson errors > blocking grammar > fluency > optional enrichment
```

## Data Contract Draft

```ts
type LessonMode = "structure";
type StructureLevel = 1 | 2 | 3;
type SupportLevel = "easy" | "normal" | "hard";

interface SessionConfig {
  lesson: LessonMode;
  level: StructureLevel;
  support: SupportLevel;
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
    | "enrichment";
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
    enrichment: number;
  };
  issues: FeedbackIssue[];
  correctedSentence: string;
  upgradedVariants: string[];
  rewriteInstruction: string;
}
```

## Non-Goals For MVP

- No live browser-extension correction.
- No separate education dashboard before the chat shell works.
- No speech/pronunciation.
- No broad essay grading.
- No full CEFR placement test.
- No learner profile/outfit yet.
- No gamified streaks or leaderboards.
- No prepositions/articles/tenses modes until Structure Mode proves the loop.
