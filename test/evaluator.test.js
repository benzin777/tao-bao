import test from "node:test";
import assert from "node:assert/strict";
import {
  createTask,
  evaluateAttempt,
  getFormulasByLevel,
  normalizeAttempt,
  normalizeConfig,
  validateAndRepairEvaluation,
} from "../src/evaluator.js";

test("createTask keeps level and support separate", () => {
  const task = createTask({
    lesson: "structure",
    level: 3,
    support: "easy",
  });

  assert.equal(task.config.level, 3);
  assert.equal(task.config.support, "easy");
  assert.equal("styleModes" in task.config, false);
  assert.equal(task.formulaLabel, "Concession -> cause -> result -> conclusion");
  assert.equal(task.scaffold, "Although ___, because ___, ___; therefore, ___.");
});

test("level 1 cause-result accepts one cause-result connector contract", () => {
  const task = createTask({
    lesson: "structure",
    level: 1,
    support: "easy",
  });

  assert.equal(task.formulaLabel, "Cause -> result");
  assert.equal(task.formula.length, 1);
  assert.deepEqual(task.formula[0].expectedMarkers, ["because", "as", "since", "so", "therefore", "thus"]);
  assert.match(task.evaluationGuidance, /Accept either/);
});

test("normalizeConfig removes removed user-facing controls", () => {
  const config = normalizeConfig({
    level: 2,
    support: "hard",
    quantity: 5,
    variant: "creative",
    formulaId: "contrast",
    styleModes: ["formal", "formal", "unknown", "concise"],
  });

  assert.deepEqual(config, {
    lesson: "structure",
    level: 2,
    support: "hard",
  });
});

test("formulas can be selected by level", () => {
  const formulas = getFormulasByLevel(2);

  assert.equal(formulas.length, 3);
  assert.ok(formulas.every((formula) => formula.level === 2));
});

test("normalizeAttempt trims and collapses whitespace", () => {
  assert.equal(normalizeAttempt("  If   I commit,\nI grow. "), "If I commit, I grow.");
});

test("evaluateAttempt rejects oversized sentence attempts before OpenAI", async () => {
  await assert.rejects(
    evaluateAttempt({
      config: { level: 1, support: "easy" },
      attemptText: "x".repeat(801),
      openai: {
        apiKey: "unused",
        model: "unused",
        reasoningEffort: "unused",
      },
    }),
    /under 800 characters/,
  );
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

test("validateAndRepairEvaluation keeps formula issues before grammar issues", () => {
  const task = createTask({ level: 1, support: "easy" });
  const attempt = "I train because";

  const repaired = validateAndRepairEvaluation(
    {
      status: "needs_revision",
      summary: "Fix the structure.",
      formula: {
        fit: "partial",
        detected: [],
        missing: [],
        misplaced: [],
        explanation: "The result side is missing.",
      },
      issues: [
        {
          id: "grammar-1",
          category: "grammar",
          severity: "blocking",
          original: "because",
          replacement: "",
          explanation: "The connector is stranded.",
          startIndex: 8,
          endIndex: 15,
          relationId: "",
          action: "rewrite",
        },
        {
          id: "formula-1",
          category: "formula",
          severity: "warning",
          original: attempt,
          replacement: "",
          explanation: "Add a result clause.",
          startIndex: 0,
          endIndex: attempt.length,
          relationId: "cause",
          action: "rewrite",
        },
      ],
      correctedSentence: attempt,
      variants: [],
      nextInstruction: "Add the result.",
    },
    attempt,
    task,
  );

  assert.equal(repaired.issues[0].category, "formula");
  assert.equal(repaired.issues[1].category, "grammar");
});

test("validateAndRepairEvaluation surfaces hidden corrected-sentence fixes", () => {
  const task = createTask({ level: 1, support: "easy" });
  const attempt = "because im hungry, I eat";

  const repaired = validateAndRepairEvaluation(
    {
      status: "passed",
      summary: "Good cause-result structure.",
      formula: {
        fit: "passed",
        detected: [],
        missing: [],
        misplaced: [],
        explanation: "The cause-result link is present.",
      },
      issues: [],
      correctedSentence: "Because I'm hungry, I eat.",
      variants: [],
      nextInstruction: "Rewrite the corrected sentence.",
    },
    attempt,
    task,
  );

  assert.equal(repaired.status, "passed");
  assert.equal(repaired.issues.length, 1);
  assert.equal(repaired.issues[0].category, "grammar");
  assert.equal(repaired.issues[0].original, attempt);
  assert.equal(repaired.issues[0].replacement, "Because I'm hungry, I eat.");
  assert.equal(repaired.teacherTurn.correction, "Because I'm hungry, I eat.");
});
