export const LESSONS = {
  structure: {
    id: "structure",
    label: "Structure",
  },
};

export const STRUCTURE_FORMULAS = [
  {
    id: "cause-result",
    level: 1,
    label: "Cause -> result",
    steps: [
      relationStep("cause", ["because", "as", "since"]),
      relationStep("result", ["so", "therefore", "thus"]),
    ],
    easyScaffold: "Because ___, ___.",
    sourceIdea: "Practice makes improvement visible.",
  },
  {
    id: "contrast",
    level: 1,
    label: "Contrast",
    steps: [relationStep("contrast", ["but", "however", "yet", "although"])],
    easyScaffold: "___, but ___.",
    sourceIdea: "The method feels simple, but it changes the result.",
  },
  {
    id: "condition-result",
    level: 1,
    label: "Condition -> result",
    steps: [
      relationStep("condition", ["if", "provided that", "as long as"]),
      relationStep("result", ["will", "so", "therefore"]),
    ],
    easyScaffold: "If ___, ___.",
    sourceIdea: "Commitment creates progress.",
  },
  {
    id: "condition-result-addition",
    level: 2,
    label: "Condition -> result -> addition",
    steps: [
      relationStep("condition", ["if", "provided that", "as long as"]),
      relationStep("result", ["will", "so", "therefore"]),
      relationStep("addition", ["and", "also", "moreover", "furthermore"]),
    ],
    easyScaffold: "If ___, ___, and ___.",
    sourceIdea: "Consistent effort improves skill and compounds results.",
  },
  {
    id: "cause-result-contrast",
    level: 2,
    label: "Cause -> result -> contrast",
    steps: [
      relationStep("cause", ["because", "as", "since"]),
      relationStep("result", ["therefore", "so", "thus"]),
      relationStep("contrast", ["however", "but", "yet", "nevertheless"]),
    ],
    easyScaffold: "Because ___, ___; however, ___.",
    sourceIdea: "The method works, but progress can feel slow.",
  },
  {
    id: "contrast-clarification",
    level: 2,
    label: "Contrast -> clarification",
    steps: [
      relationStep("contrast", ["but", "however", "yet"]),
      relationStep("clarification", ["in other words", "that is", "to put it simply"]),
    ],
    easyScaffold: "___, but ___; in other words, ___.",
    sourceIdea: "Correct grammar is not the same as connected speech.",
  },
  {
    id: "concession-cause-result-conclusion",
    level: 3,
    label: "Concession -> cause -> result -> conclusion",
    steps: [
      relationStep("concession", ["although", "even though", "while"]),
      relationStep("cause", ["because", "as", "since"]),
      relationStep("result", ["therefore", "so", "thus"]),
      relationStep("conclusion", ["therefore", "ultimately", "in the end"]),
    ],
    easyScaffold: "Although ___, because ___, ___; therefore, ___.",
    sourceIdea: "Small progress becomes powerful over time.",
  },
  {
    id: "condition-contrast-clarification-result",
    level: 3,
    label: "Condition -> contrast -> clarification -> result",
    steps: [
      relationStep("condition", ["if"]),
      relationStep("contrast", ["yet", "but", "however"]),
      relationStep("clarification", ["in other words", "that is"]),
      relationStep("result", ["so", "therefore"]),
    ],
    easyScaffold: "If ___, ___ yet ___; in other words, ___, so ___.",
    sourceIdea: "Ignoring connectors makes speech correct but disconnected.",
  },
  {
    id: "cause-contrast-result-alternative",
    level: 3,
    label: "Cause -> contrast -> result -> alternative",
    steps: [
      relationStep("cause", ["since", "because", "as"]),
      relationStep("contrast", ["whereas", "while"]),
      relationStep("result", ["consequently", "therefore", "so"]),
      relationStep("alternative", ["rather than", "instead of", "alternatively"]),
    ],
    easyScaffold: "Since ___ whereas ___, ___; consequently, ___ rather than ___.",
    sourceIdea: "Acting early creates advantage while waiting creates loss.",
  },
];

function relationStep(relation, expectedMarkers) {
  return {
    id: relation,
    relation,
    expectedMarkers,
    required: true,
  };
}

export function normalizeConfig(config = {}) {
  const lesson = config.lesson === "structure" ? "structure" : "structure";
  const level = normalizeInteger(config.level, [1, 2, 3], 1);
  const support = ["easy", "normal", "hard"].includes(config.support) ? config.support : "easy";

  return { lesson, level, support };
}

export function getFormulaById(formulaId) {
  return STRUCTURE_FORMULAS.find((formula) => formula.id === formulaId);
}

export function getDefaultFormula(level) {
  return STRUCTURE_FORMULAS.find((formula) => formula.level === level) || STRUCTURE_FORMULAS[0];
}

export function getFormulasByLevel(level) {
  return STRUCTURE_FORMULAS.filter((formula) => formula.level === Number(level));
}

export function createTask(inputConfig = {}) {
  const config = normalizeConfig(inputConfig);
  const selectedFormula = getDefaultFormula(config.level);

  return {
    id: `task-${Date.now()}`,
    config: {
      ...config,
      formulaId: selectedFormula.id,
    },
    formula: selectedFormula.steps,
    formulaId: selectedFormula.id,
    formulaLabel: selectedFormula.label,
    sourceIdea: selectedFormula.sourceIdea,
    instruction: createInstruction(config, selectedFormula),
    scaffold: config.support === "easy" ? selectedFormula.easyScaffold : "",
  };
}

function createInstruction(config, formula) {
  if (config.support === "easy") {
    return "Write one sentence using the selected structure. Fill the frame without changing the logic.";
  }

  if (config.support === "normal") {
    return `Write one sentence using the selected level ${config.level} structure. Keep the logic clear and connected.`;
  }

  return `Make this idea sound intelligent and logically connected: "${formula.sourceIdea}" Use the selected level ${config.level} structure without being shown the frame.`;
}

function normalizeInteger(value, allowed, fallback) {
  const parsed = Number(value);
  return allowed.includes(parsed) ? parsed : fallback;
}
