import test from "node:test";
import assert from "node:assert/strict";
import { createTask, getFormulasByLevel, normalizeAttempt, validateAndRepairEvaluation } from "../src/evaluator.js";

test("createTask keeps level and support separate", () => {
  const task = createTask({
    lesson: "structure",
    level: 3,
    support: "easy",
    quantity: 1,
    variant: "academic",
  });

  assert.equal(task.config.level, 3);
  assert.equal(task.config.support, "easy");
  assert.equal(task.formulaLabel, "Concession -> cause -> result -> conclusion");
  assert.equal(task.scaffold, "Although ___, because ___, ___; therefore, ___.");
});

test("formulas can be selected by level", () => {
  const formulas = getFormulasByLevel(2);

  assert.equal(formulas.length, 3);
  assert.ok(formulas.every((formula) => formula.level === 2));
});

test("normalizeAttempt trims and collapses whitespace", () => {
  assert.equal(normalizeAttempt("  If   I commit,\nI grow. "), "If I commit, I grow.");
});

test("validateAndRepairEvaluation preserves valid exact-offset issues", () => {
  const task = createTask({ level: 1, support: "easy" });
  const attempt = "Because I train, I improve.";
  const startIndex = attempt.indexOf("Because");

  const repaired = validateAndRepairEvaluation(
    {
      status: "needs_revision",
      summary: "Good shape.",
      formula: {
        fit: "partial",
        detected: [],
        missing: [],
        misplaced: [],
        explanation: "One relation is visible.",
      },
      issues: [
        {
          id: "issue-1",
          category: "connector",
          severity: "warning",
          original: "Because",
          replacement: "Since",
          explanation: "Try a different cause marker.",
          startIndex,
          endIndex: startIndex + "Because".length,
          relationId: "cause",
          action: "optional",
        },
      ],
      correctedSentence: attempt,
      variants: [
        {
          id: "variant-1",
          variant: "clearer",
          sentence: attempt,
          changeNote: "Keeps the sentence direct.",
        },
      ],
      nextInstruction: "Rewrite with a result marker.",
    },
    attempt,
    task,
  );

  assert.equal(repaired.issues[0].original, "Because");
  assert.equal(repaired.issues[0].startIndex, 0);
  assert.equal(repaired.formula.expected.length, task.formula.length);
});

test("validateAndRepairEvaluation converts bad offsets into sentence-level feedback", () => {
  const task = createTask({ level: 1, support: "easy" });
  const attempt = "Because I train, I improve.";

  const repaired = validateAndRepairEvaluation(
    {
      status: "needs_revision",
      summary: "Check the formula.",
      formula: {
        fit: "partial",
        detected: [],
        missing: [],
        misplaced: [],
        explanation: "One relation is visible.",
      },
      issues: [
        {
          id: "bad-offset",
          category: "grammar",
          severity: "blocking",
          original: "missing text",
          replacement: "",
          explanation: "The issue does not match the span.",
          startIndex: 0,
          endIndex: 7,
          relationId: "",
          action: "rewrite",
        },
      ],
      correctedSentence: attempt,
      variants: [],
      nextInstruction: "Try again.",
    },
    attempt,
    task,
  );

  assert.equal(repaired.issues[0].category, "formula");
  assert.equal(repaired.issues[0].startIndex, 0);
  assert.equal(repaired.issues[0].endIndex, attempt.length);
});

