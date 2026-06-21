import { createTask, getFormulasByLevel, normalizeConfig, STRUCTURE_FORMULAS } from "./formulas.js";
import { evaluateWithOpenAI } from "./openai.js";

export { createTask, getFormulasByLevel, normalizeConfig, STRUCTURE_FORMULAS };

const MAX_ATTEMPT_LENGTH = 800;

export async function evaluateAttempt({ config, task, attemptText, openai }) {
  const cleanAttempt = normalizeAttempt(attemptText);
  if (!cleanAttempt) {
    const error = new Error("Write a sentence before submitting.");
    error.statusCode = 422;
    throw error;
  }

  if (cleanAttempt.length > MAX_ATTEMPT_LENGTH) {
    const error = new Error(`Write one sentence under ${MAX_ATTEMPT_LENGTH} characters.`);
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
  const nextInstruction = coerceText(evaluation?.nextInstruction, "Rewrite the sentence using the selected formula.");
  const correctedSentence = coerceText(evaluation?.correctedSentence, attemptText);
  const safeEvaluation = {
    status: coerceEnum(evaluation?.status, ["passed", "needs_revision", "off_formula"], "needs_revision"),
    summary: coerceText(evaluation?.summary, "Review the structure, then revise the sentence."),
    formula: repairFormulaEvaluation(evaluation?.formula, task),
    issues: Array.isArray(evaluation?.issues) ? evaluation.issues : [],
    correctedSentence,
    variants: Array.isArray(evaluation?.variants) ? evaluation.variants : [],
    nextInstruction,
    teacherTurn: repairTeacherTurn(evaluation?.teacherTurn, attemptText, correctedSentence, nextInstruction),
  };

  safeEvaluation.issues = safeEvaluation.issues
    .map((issue, index) => repairIssue(issue, index, attemptText))
    .filter(Boolean)
    .sort(compareIssues);

  if (safeEvaluation.issues.length === 0 && hasMeaningfulCorrection(attemptText, safeEvaluation.correctedSentence)) {
    safeEvaluation.issues = [createCorrectionIssue(attemptText, safeEvaluation.correctedSentence)];
    if (safeEvaluation.status === "passed") {
      safeEvaluation.summary = "The structure works. Fix the English, then write it again.";
    }
  }

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

function repairTeacherTurn(teacherTurn, attemptText, correctedSentence, nextInstruction) {
  return {
    line: coerceText(teacherTurn?.line, "Check the sentence, then write it again."),
    correction: correctedSentence || attemptText,
    microLesson: coerceText(
      teacherTurn?.microLesson,
      "Keep the same idea, but make the required structure and grammar clean.",
    ),
    rewritePrompt: coerceText(teacherTurn?.rewritePrompt, nextInstruction || "Now rewrite it correctly."),
  };
}

function hasMeaningfulCorrection(attemptText, correctedSentence) {
  return normalizeAttempt(correctedSentence) !== normalizeAttempt(attemptText);
}

function createCorrectionIssue(attemptText, correctedSentence) {
  return {
    id: "issue-correction",
    category: "grammar",
    severity: "warning",
    original: attemptText,
    replacement: correctedSentence,
    explanation: "The evaluator corrected the sentence, so treat this as a real English fix before enrichment.",
    startIndex: 0,
    endIndex: attemptText.length,
    relationId: "",
    action: "rewrite",
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

function categoryOrder(category) {
  return (
    {
      formula: 0,
      connector: 1,
      grammar: 2,
      article: 3,
      tense: 4,
      preposition: 5,
      punctuation: 6,
      clarity: 7,
      enrichment: 8,
    }[category] ?? 9
  );
}

function compareIssues(a, b) {
  return categoryOrder(a.category) - categoryOrder(b.category) || severityOrder(a.severity) - severityOrder(b.severity);
}
