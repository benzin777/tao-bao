import test from "node:test";
import assert from "node:assert/strict";
import {
  createTask,
  evaluateAttempt,
  getFormulasByLevel,
  normalizeAttempt,
  normalizeConfig,
  STRUCTURE_FORMULAS,
  validateAndRepairEvaluation,
} from "../src/evaluator.js";
import { CURRICULUM_SOURCES, RELATION_GROUPS } from "../src/formulas.js";

const REQUIRED_RELATIONS = [
  "addition",
  "contrast",
  "cause",
  "result",
  "condition",
  "concession",
  "purpose",
  "exemplification",
  "sequence",
  "comparison",
  "clarification",
  "conclusion",
];

test("createTask keeps level and support separate", () => {
  const task = createTask(
    {
      lesson: "structure",
      level: 3,
      support: "easy",
    },
    {
      random: () => 0,
    },
  );

  assert.equal(task.config.level, 3);
  assert.equal(task.config.support, "easy");
  assert.equal("styleModes" in task.config, false);
  assert.equal(task.formulaLabel, "Concession -> cause -> result -> conclusion");
  assert.equal(task.scaffold, "Although ___, because ___, ___; therefore, ___.");
});

test("level 1 cause-result accepts one cause-result connector contract", () => {
  const task = createTask(
    {
      lesson: "structure",
      level: 1,
      support: "easy",
    },
    {
      random: () => 0,
    },
  );

  assert.equal(task.formulaLabel, "Cause -> result");
  assert.equal(task.formula.length, 1);
  assert.deepEqual(task.formula[0].expectedMarkers, ["because", "as", "since", "so", "therefore", "thus"]);
  assert.match(task.evaluationGuidance, /Accept either/);
});

test("createTask can select a non-default formula from the selected level", () => {
  const task = createTask(
    {
      lesson: "structure",
      level: 2,
      support: "easy",
    },
    {
      random: () => 0.99,
    },
  );

  assert.equal(task.config.level, 2);
  assert.notEqual(task.formulaId, getFormulasByLevel(2)[0].id);
  assert.equal(task.formulaMeta.formulaIndex, getFormulasByLevel(2).length);
  assert.equal(task.formulaMeta.formulaCount, getFormulasByLevel(2).length);
});

test("createTask reroll avoids the previous formula when alternatives exist", () => {
  const task = createTask(
    {
      lesson: "structure",
      level: 1,
      support: "easy",
    },
    {
      avoidFormulaId: "cause-result",
      random: () => 0,
    },
  );

  assert.equal(task.config.level, 1);
  assert.notEqual(task.formulaId, "cause-result");
  assert.equal(task.formulaLabel, "Contrast");
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

  assert.ok(formulas.length >= 6);
  assert.ok(formulas.length <= 8);
  assert.ok(formulas.every((formula) => formula.level === 2));
});

test("structure curriculum has source-backed depth at every level", () => {
  for (const level of [1, 2, 3]) {
    const formulas = getFormulasByLevel(level);

    assert.ok(formulas.length >= 6, `Level ${level} should have at least 6 formulas`);
    assert.ok(formulas.length <= 8, `Level ${level} should stay focused at 8 formulas or fewer`);
  }

  assert.ok(STRUCTURE_FORMULAS.length >= 18);
  assert.ok(STRUCTURE_FORMULAS.length <= 24);
});

test("structure curriculum covers the required relation groups", () => {
  const covered = new Set(STRUCTURE_FORMULAS.flatMap((formula) => formula.steps.map((step) => step.relation)));

  for (const relation of REQUIRED_RELATIONS) {
    assert.ok(covered.has(relation), `Missing relation group: ${relation}`);
  }
});

test("structure formulas carry curriculum metadata for the task and evaluator", () => {
  for (const formula of STRUCTURE_FORMULAS) {
    assert.equal(formula.lesson, "structure");
    assert.deepEqual(
      formula.relationStack,
      formula.steps.map((step) => step.relation),
    );
    assert.ok(formula.scenario, `${formula.id} needs a scenario`);
    assert.ok(formula.punctuationRule, `${formula.id} needs punctuation guidance`);
    assert.ok(formula.evaluationGuidance, `${formula.id} needs evaluator guidance`);
    assert.ok(Array.isArray(formula.sourceRefs), `${formula.id} needs source refs`);
    assert.ok(formula.sourceRefs.length > 0, `${formula.id} needs at least one source ref`);
  }
});

test("structure formula metadata references known curriculum sources and relations", () => {
  const sourceIds = new Set(Object.keys(CURRICULUM_SOURCES));
  const relationIds = new Set(RELATION_GROUPS);

  for (const formula of STRUCTURE_FORMULAS) {
    for (const sourceRef of formula.sourceRefs) {
      assert.ok(sourceIds.has(sourceRef), `${formula.id} references unknown source ${sourceRef}`);
    }

    for (const step of formula.steps) {
      assert.ok(relationIds.has(step.relation), `${formula.id} uses unknown relation ${step.relation}`);
    }
  }
});

test("createTask exposes curriculum metadata without changing learner controls", () => {
  const task = createTask(
    {
      lesson: "structure",
      level: 3,
      support: "normal",
      formulaId: "ignored-user-control",
      quantity: 10,
      tone: "academic",
    },
    {
      random: () => 0.2,
    },
  );

  assert.deepEqual(Object.keys(task.config).sort(), ["formulaId", "lesson", "level", "support"]);
  assert.equal(task.formulaMeta.level, 3);
  assert.ok(Array.isArray(task.formulaMeta.relations));
  assert.ok(task.formulaMeta.relations.length >= 3);
  assert.ok(task.formulaMeta.punctuationRule);
  assert.ok(task.formulaMeta.sourceRefs.length > 0);
  assert.ok(task.evaluationGuidance);
  assert.equal(task.scaffold, "");
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
