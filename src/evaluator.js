import { createTask, getFormulasByLevel, normalizeConfig, STRUCTURE_FORMULAS } from "./formulas.js";
import { evaluateWithOpenAI } from "./openai.js";

export { createTask, getFormulasByLevel, normalizeConfig, STRUCTURE_FORMULAS };

export async function evaluateAttempt({ config, task, attemptText, openai }) {
  const cleanAttempt = normalizeAttempt(attemptText);
  if (!cleanAttempt) {
    const error = new Error("Write a sentence before submitting.");
    error.statusCode = 422;
    throw error;
  }

  const activeTask = task?.formula ? task : createTask(config);
  const evaluation = await evaluateWithOpenAI({
    ...openai,
    task: activeTask,
    attemptText: cleanAttempt,
  });

  return validateAndRepairEvaluation(evaluation, cleanAttempt, activeTask);
}

export function normalizeAttempt(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function validateAndRepairEvaluation(evaluation, attemptText, task) {
  const safeEvaluation = {
    status: coerceEnum(evaluation?.status, ["passed", "needs_revision", "off_formula"], "needs_revision"),
    summary: coerceText(evaluation?.summary, "Review the structure, then revise the sentence."),
    formula: repairFormulaEvaluation(evaluation?.formula, task),
    issues: Array.isArray(evaluation?.issues) ? evaluation.issues : [],
    correctedSentence: coerceText(evaluation?.correctedSentence, attemptText),
    variants: Array.isArray(evaluation?.variants) ? evaluation.variants : [],
    nextInstruction: coerceText(evaluation?.nextInstruction, "Rewrite the sentence using the selected formula."),
  };

  safeEvaluation.issues = safeEvaluation.issues
    .map((issue, index) => repairIssue(issue, index, attemptText))
    .filter(Boolean)
    .sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity));

  safeEvaluation.variants = safeEvaluation.variants
    .map((variant, index) => repairVariant(variant, index))
    .filter(Boolean)
    .slice(0, 6);

  if (safeEvaluation.variants.length === 0) {
    safeEvaluation.variants = [
      {
        id: "variant-clearer",
        variant: "clearer",
        sentence: safeEvaluation.correctedSentence,
        changeNote: "Uses the corrected sentence as the clearer baseline.",
      },
    ];
  }

  return safeEvaluation;
}

function repairFormulaEvaluation(formula, task) {
  return {
    fit: coerceEnum(formula?.fit, ["passed", "partial", "failed"], "partial"),
    expected: task.formula || [],
    detected: Array.isArray(formula?.detected) ? formula.detected : [],
    missing: Array.isArray(formula?.missing) ? formula.missing : [],
    misplaced: Array.isArray(formula?.misplaced) ? formula.misplaced : [],
    explanation: coerceText(formula?.explanation, "The sentence needs to match the selected formula."),
  };
}

function repairIssue(issue, index, attemptText) {
  const startIndex = Number.isInteger(issue?.startIndex) ? issue.startIndex : 0;
  const endIndex = Number.isInteger(issue?.endIndex) ? issue.endIndex : attemptText.length;
  const inRange = startIndex >= 0 && endIndex >= startIndex && endIndex <= attemptText.length;
  const original = coerceText(issue?.original, inRange ? attemptText.slice(startIndex, endIndex) : attemptText);

  if (!inRange) return null;
  if (attemptText.slice(startIndex, endIndex) !== original) {
    return {
      id: `issue-${index}`,
      category: "formula",
      severity: "warning",
      original: attemptText,
      replacement: "",
      explanation: coerceText(issue?.explanation, "This feedback applies to the whole sentence."),
      startIndex: 0,
      endIndex: attemptText.length,
      relationId: "",
      action: "rewrite",
    };
  }

  const category = coerceEnum(
    issue?.category,
    ["formula", "connector", "grammar", "article", "preposition", "tense", "punctuation", "clarity", "enrichment"],
    "formula",
  );

  return {
    id: coerceText(issue?.id, `issue-${index}`),
    category,
    severity: coerceEnum(issue?.severity, ["blocking", "warning", "suggestion"], "warning"),
    original,
    replacement: coerceText(issue?.replacement, ""),
    explanation: coerceText(issue?.explanation, "Revise this part."),
    startIndex,
    endIndex,
    relationId: coerceText(issue?.relationId, ""),
    action: coerceEnum(issue?.action, ["rewrite", "apply", "notice", "optional"], "rewrite"),
  };
}

function repairVariant(variant, index) {
  const sentence = coerceText(variant?.sentence, "");
  if (!sentence) return null;

  return {
    id: coerceText(variant?.id, `variant-${index}`),
    variant: coerceEnum(variant?.variant, ["clearer", "formal", "academic", "creative", "concise", "layered"], "clearer"),
    sentence,
    changeNote: coerceText(variant?.changeNote, "Refines the sentence while preserving the idea."),
  };
}

function coerceEnum(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function coerceText(value, fallback) {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function severityOrder(severity) {
  return { blocking: 0, warning: 1, suggestion: 2 }[severity] ?? 3;
}
