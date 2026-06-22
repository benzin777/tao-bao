export const LESSONS = {
  structure: {
    id: "structure",
    label: "Structure",
  },
};

export const CURRICULUM_SOURCES = {
  "cefr-table-3": "CEFR Table 3: coherence, cohesion, organisational patterns, connectors, and cohesive devices.",
  "cambridge-discourse-markers": "Cambridge Grammar: discourse markers connect, organise, manage, and signal attitude.",
  "cambridge-linking-words": "Cambridge Grammar: conjunctions and linking words include coordinating and subordinating links.",
  "cambridge-time-conjunctions": "Cambridge Grammar: time conjunctions connect actions or events to points in time.",
  "purdue-commas-introductions": "Purdue OWL: introductory clauses and words usually create comma obligations.",
  "purdue-sentence-patterns": "Purdue OWL: dependent and independent clause patterns determine punctuation.",
};

export const RELATION_GROUPS = [
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
  "alternative",
  "emphasis",
  "reference",
  "temporal",
];

export const STRUCTURE_FORMULAS = [
  formula({
    id: "cause-result",
    level: 1,
    label: "Cause -> result",
    steps: [
      relationStep("cause", ["because", "as", "since", "so", "therefore", "thus"]),
    ],
    easyScaffold: "Because ___, ___.",
    sourceIdea: "Practice makes improvement visible.",
    scenario: "Explain why one action creates one outcome.",
    punctuationRule: "If the cause clause starts the sentence, use a comma before the main clause.",
    evaluationGuidance:
      "Accept either one clear cause-led frame or one clear result-led frame as the cause-result link.",
    sourceRefs: ["cefr-table-3", "cambridge-linking-words", "purdue-commas-introductions"],
  }),
  formula({
    id: "contrast",
    level: 1,
    label: "Contrast",
    steps: [relationStep("contrast", ["but", "however", "yet", "although"])],
    easyScaffold: "___, but ___.",
    sourceIdea: "The method feels simple, but it changes the result.",
    scenario: "Show that two ideas push against each other.",
    punctuationRule: "Use a comma before but/yet when they connect two full clauses.",
    evaluationGuidance: "Look for one real contrast, not only the word but inserted between similar ideas.",
    sourceRefs: ["cefr-table-3", "cambridge-discourse-markers", "cambridge-linking-words"],
  }),
  formula({
    id: "condition-result",
    level: 1,
    label: "Condition -> result",
    steps: [
      relationStep("condition", ["if", "provided that", "as long as"]),
      relationStep("result", ["will", "so", "therefore"]),
    ],
    easyScaffold: "If ___, ___.",
    sourceIdea: "Commitment creates progress.",
    scenario: "Make one result depend on one condition.",
    punctuationRule: "When the if-clause opens the sentence, use a comma before the result clause.",
    evaluationGuidance: "Accept present simple in the condition clause with a clear future or modal result.",
    sourceRefs: ["cambridge-linking-words", "purdue-commas-introductions"],
  }),
  formula({
    id: "addition",
    level: 1,
    label: "Addition",
    steps: [relationStep("addition", ["and", "also", "moreover", "furthermore"])],
    easyScaffold: "___, and ___.",
    sourceIdea: "A small habit improves skill and builds confidence.",
    scenario: "Add one supporting point to the first idea.",
    punctuationRule: "Use a comma before and when it joins two full independent clauses.",
    evaluationGuidance: "Check that the second clause adds a related point instead of repeating the first.",
    sourceRefs: ["cambridge-discourse-markers", "cambridge-linking-words"],
  }),
  formula({
    id: "sequence",
    level: 1,
    label: "Sequence",
    steps: [relationStep("sequence", ["first", "then", "next", "finally"])],
    easyScaffold: "First, ___; then, ___.",
    sourceIdea: "A clear process makes practice easier to repeat.",
    scenario: "Put two actions in a logical order.",
    punctuationRule: "Use commas after sentence-opening sequence markers such as first and then.",
    evaluationGuidance: "Check that the order matters and the markers do not describe unrelated actions.",
    sourceRefs: ["cambridge-discourse-markers", "purdue-commas-introductions"],
  }),
  formula({
    id: "purpose",
    level: 1,
    label: "Purpose",
    steps: [relationStep("purpose", ["to", "in order to", "so that"])],
    easyScaffold: "To ___, ___.",
    sourceIdea: "The learner changes the method to get a better result.",
    scenario: "Explain the goal behind an action.",
    punctuationRule: "Use a comma after an introductory purpose phrase when it comes before the main clause.",
    evaluationGuidance: "Check that the purpose phrase answers why the action is done.",
    sourceRefs: ["cambridge-linking-words", "purdue-commas-introductions"],
  }),
  formula({
    id: "exemplification",
    level: 1,
    label: "Exemplification",
    steps: [relationStep("exemplification", ["for example", "for instance", "such as", "namely"])],
    easyScaffold: "___; for example, ___.",
    sourceIdea: "A concrete example makes the general idea easier to understand.",
    scenario: "Support a general statement with one example.",
    punctuationRule: "Use a semicolon or new sentence before for example when it introduces a full clause.",
    evaluationGuidance: "Check that the example proves or illustrates the first idea.",
    sourceRefs: ["cambridge-discourse-markers", "purdue-sentence-patterns"],
  }),
  formula({
    id: "comparison",
    level: 1,
    label: "Comparison",
    steps: [relationStep("comparison", ["like", "as", "similar to", "compared with"])],
    easyScaffold: "___, like ___.",
    sourceIdea: "A known habit can explain a new learning method.",
    scenario: "Make one idea clearer by comparing it with another.",
    punctuationRule: "Use commas only when the comparison phrase is extra, not essential to the meaning.",
    evaluationGuidance: "Check that the comparison clarifies the idea rather than distracting from it.",
    sourceRefs: ["cefr-table-3", "cambridge-discourse-markers"],
  }),
  formula({
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
    scenario: "Show a condition, its result, and one added benefit.",
    punctuationRule: "Use a comma after an opening if-clause and before and if it joins a full second result.",
    evaluationGuidance: "Check for a condition, a direct result, and an added related benefit.",
    sourceRefs: ["cambridge-linking-words", "purdue-commas-introductions"],
  }),
  formula({
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
    scenario: "Explain why something works, then limit the claim with a contrast.",
    punctuationRule: "Use a semicolon or new sentence before however when it turns to a full contrasting clause.",
    evaluationGuidance: "Check that the contrast qualifies the result instead of cancelling the cause.",
    sourceRefs: ["cambridge-discourse-markers", "cambridge-linking-words", "purdue-sentence-patterns"],
  }),
  formula({
    id: "contrast-clarification",
    level: 2,
    label: "Contrast -> clarification",
    steps: [
      relationStep("contrast", ["but", "however", "yet"]),
      relationStep("clarification", ["in other words", "that is", "to put it simply"]),
    ],
    easyScaffold: "___, but ___; in other words, ___.",
    sourceIdea: "Correct grammar is not the same as connected speech.",
    scenario: "Make a contrast, then restate the point more precisely.",
    punctuationRule: "Use a semicolon or new sentence before in other words when it explains a full prior clause.",
    evaluationGuidance: "Check that the clarification explains the contrast instead of adding a new topic.",
    sourceRefs: ["cambridge-discourse-markers", "purdue-sentence-patterns"],
  }),
  formula({
    id: "purpose-result",
    level: 2,
    label: "Purpose -> result",
    steps: [
      relationStep("purpose", ["to", "in order to", "so that"]),
      relationStep("result", ["so", "therefore", "as a result"]),
    ],
    easyScaffold: "To ___, ___; as a result, ___.",
    sourceIdea: "A focused exercise creates measurable progress.",
    scenario: "Show the goal of an action and the result it creates.",
    punctuationRule: "Use a comma after an opening purpose phrase and a semicolon before as a result when it starts a full clause.",
    evaluationGuidance: "Check that the result follows from the action taken for the stated purpose.",
    sourceRefs: ["cambridge-linking-words", "purdue-commas-introductions", "purdue-sentence-patterns"],
  }),
  formula({
    id: "sequence-cause-result",
    level: 2,
    label: "Sequence -> cause -> result",
    steps: [
      relationStep("sequence", ["first", "then", "after that"]),
      relationStep("cause", ["because", "since", "as"]),
      relationStep("result", ["so", "therefore", "as a result"]),
    ],
    easyScaffold: "First, ___; then, because ___, ___.",
    sourceIdea: "The order of practice changes the quality of the result.",
    scenario: "Order two actions, then explain why the second action produces a result.",
    punctuationRule: "Use commas after sequence markers and after an inserted because-clause when needed.",
    evaluationGuidance: "Check that sequence creates order and cause explains the outcome.",
    sourceRefs: ["cambridge-discourse-markers", "cambridge-linking-words", "purdue-commas-introductions"],
  }),
  formula({
    id: "comparison-contrast-clarification",
    level: 2,
    label: "Comparison -> contrast -> clarification",
    steps: [
      relationStep("comparison", ["like", "similar to", "compared with"]),
      relationStep("contrast", ["but", "however", "whereas"]),
      relationStep("clarification", ["in other words", "that is", "to put it simply"]),
    ],
    easyScaffold: "Like ___, ___; however, ___; in other words, ___.",
    sourceIdea: "Learning a sentence pattern is like training a movement, but language needs meaning.",
    scenario: "Use a comparison, separate the difference, then clarify the point.",
    punctuationRule: "Use semicolons or new sentences around however and in other words when they start full clauses.",
    evaluationGuidance: "Check that the comparison helps, the contrast separates, and the clarification names the lesson.",
    sourceRefs: ["cefr-table-3", "cambridge-discourse-markers", "purdue-sentence-patterns"],
  }),
  formula({
    id: "exemplification-result",
    level: 2,
    label: "Exemplification -> result",
    steps: [
      relationStep("exemplification", ["for example", "for instance", "such as"]),
      relationStep("result", ["so", "therefore", "as a result"]),
    ],
    easyScaffold: "___; for example, ___, so ___.",
    sourceIdea: "One concrete error can reveal the whole weak pattern.",
    scenario: "Give an example, then explain what follows from it.",
    punctuationRule: "Use a semicolon or new sentence before for example when it introduces a full clause.",
    evaluationGuidance: "Check that the example is specific and the result follows from the example.",
    sourceRefs: ["cambridge-discourse-markers", "purdue-sentence-patterns"],
  }),
  formula({
    id: "temporal-condition-result",
    level: 2,
    label: "Temporal -> condition -> result",
    steps: [
      relationStep("temporal", ["when", "after", "before", "once", "as soon as"]),
      relationStep("condition", ["if", "as long as", "provided that"]),
      relationStep("result", ["will", "can", "so"]),
    ],
    easyScaffold: "When ___, if ___, ___.",
    sourceIdea: "The timing of practice changes what the learner can notice.",
    scenario: "Connect timing, condition, and outcome.",
    punctuationRule: "Use commas after opening time and condition clauses when they come before the main clause.",
    evaluationGuidance: "Check that the temporal clause sets time and the condition controls the result.",
    sourceRefs: ["cambridge-time-conjunctions", "cambridge-linking-words", "purdue-commas-introductions"],
  }),
  formula({
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
    scenario: "Admit a difficulty, explain the cause behind progress, then conclude.",
    punctuationRule: "Use commas after opening concession/cause clauses and a semicolon before therefore when it starts a full conclusion.",
    evaluationGuidance: "Check that the concession is real, the cause explains progress, and the conclusion resolves the argument.",
    sourceRefs: ["cefr-table-3", "cambridge-discourse-markers", "purdue-commas-introductions", "purdue-sentence-patterns"],
  }),
  formula({
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
    scenario: "Set a condition, show the opposing problem, clarify it, then name the result.",
    punctuationRule: "Use commas for opening condition clauses and semicolons for full-clause discourse markers.",
    evaluationGuidance: "Check that the condition frames the problem and the clarification makes the contrast more precise.",
    sourceRefs: ["cambridge-discourse-markers", "cambridge-linking-words", "purdue-commas-introductions"],
  }),
  formula({
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
    scenario: "Explain a cause, contrast it with another path, then choose the better alternative.",
    punctuationRule: "Use punctuation to separate the whereas contrast and the consequently result clause.",
    evaluationGuidance: "Check that the alternative is a real choice created by the result.",
    sourceRefs: ["cefr-table-3", "cambridge-linking-words", "purdue-sentence-patterns"],
  }),
  formula({
    id: "temporal-cause-result-conclusion",
    level: 3,
    label: "Temporal -> cause -> result -> conclusion",
    steps: [
      relationStep("temporal", ["when", "after", "once", "as soon as"]),
      relationStep("cause", ["because", "since", "as"]),
      relationStep("result", ["so", "therefore", "as a result"]),
      relationStep("conclusion", ["ultimately", "in the end", "therefore"]),
    ],
    easyScaffold: "Once ___, because ___, ___; ultimately, ___.",
    sourceIdea: "After a learner notices the pattern, repeated practice becomes more efficient.",
    scenario: "Show timing, explain why it matters, state the result, then conclude.",
    punctuationRule: "Use commas after opening time/cause clauses and a semicolon before the final conclusion marker.",
    evaluationGuidance: "Check that timing starts the logic and the conclusion follows from the result.",
    sourceRefs: ["cefr-table-3", "cambridge-time-conjunctions", "purdue-commas-introductions"],
  }),
  formula({
    id: "comparison-concession-result-conclusion",
    level: 3,
    label: "Comparison -> concession -> result -> conclusion",
    steps: [
      relationStep("comparison", ["like", "similar to", "compared with"]),
      relationStep("concession", ["although", "even though", "while"]),
      relationStep("result", ["therefore", "so", "as a result"]),
      relationStep("conclusion", ["in short", "ultimately", "overall"]),
    ],
    easyScaffold: "Like ___, ___; although ___, ___; in short, ___.",
    sourceIdea: "Language training works like physical training, although feedback changes the speed of learning.",
    scenario: "Use a comparison, concede a limit, then resolve the argument.",
    punctuationRule: "Use semicolons or new sentences to keep each full relation move readable.",
    evaluationGuidance: "Check that the comparison frames the idea and the concession does not erase the result.",
    sourceRefs: ["cefr-table-3", "cambridge-discourse-markers", "purdue-sentence-patterns"],
  }),
  formula({
    id: "purpose-sequence-result-conclusion",
    level: 3,
    label: "Purpose -> sequence -> result -> conclusion",
    steps: [
      relationStep("purpose", ["to", "in order to", "so that"]),
      relationStep("sequence", ["first", "then", "finally"]),
      relationStep("result", ["so", "therefore", "as a result"]),
      relationStep("conclusion", ["ultimately", "in short", "therefore"]),
    ],
    easyScaffold: "To ___, first ___, then ___; therefore, ___.",
    sourceIdea: "A deliberate practice order turns confusion into control.",
    scenario: "State a purpose, order the method, then conclude with the outcome.",
    punctuationRule: "Use commas after introductory purpose and sequence markers, and a semicolon before therefore if it starts a full clause.",
    evaluationGuidance: "Check that the sequence serves the stated purpose and the conclusion names the result.",
    sourceRefs: ["cambridge-discourse-markers", "cambridge-linking-words", "purdue-commas-introductions"],
  }),
  formula({
    id: "reference-clarification-contrast-result",
    level: 3,
    label: "Reference -> clarification -> contrast -> result",
    steps: [
      relationStep("reference", ["this", "that", "these", "those", "the same problem"]),
      relationStep("clarification", ["in other words", "that is", "to put it simply"]),
      relationStep("contrast", ["however", "whereas", "but"]),
      relationStep("result", ["so", "therefore", "as a result"]),
    ],
    easyScaffold: "This ___; in other words, ___; however, ___, so ___.",
    sourceIdea: "A learner may know the rule, but the same problem returns under pressure.",
    scenario: "Refer back to a problem, clarify it, contrast the hidden issue, then state the result.",
    punctuationRule: "Use semicolons around full-clause discourse markers such as in other words and however.",
    evaluationGuidance: "Check that reference points back to a clear noun/idea and does not become vague this/that.",
    sourceRefs: ["cefr-table-3", "cambridge-discourse-markers", "purdue-sentence-patterns"],
  }),
  formula({
    id: "exemplification-emphasis-result-conclusion",
    level: 3,
    label: "Exemplification -> emphasis -> result -> conclusion",
    steps: [
      relationStep("exemplification", ["for example", "for instance", "such as"]),
      relationStep("emphasis", ["especially", "in fact", "above all"]),
      relationStep("result", ["therefore", "so", "as a result"]),
      relationStep("conclusion", ["ultimately", "in short", "overall"]),
    ],
    easyScaffold: "___; for example, ___; in fact, ___; therefore, ___.",
    sourceIdea: "Specific mistakes reveal the pattern, especially when they repeat.",
    scenario: "Use an example, emphasize the important part, then conclude from the result.",
    punctuationRule: "Use semicolons or new sentences before full-clause markers such as for example, in fact, and therefore.",
    evaluationGuidance: "Check that the emphasized point is the reason the example matters.",
    sourceRefs: ["cambridge-discourse-markers", "purdue-sentence-patterns"],
  }),
];

function relationStep(relation, expectedMarkers) {
  return {
    id: relation,
    relation,
    expectedMarkers,
    required: true,
  };
}

function formula(definition) {
  const relationStack = definition.steps.map((step) => step.relation);
  return {
    lesson: "structure",
    relationStack,
    deviceGroups: relationStack,
    ...definition,
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

export function createTask(inputConfig = {}, options = {}) {
  const config = normalizeConfig(inputConfig);
  const selectedFormula = selectFormula(config.level, options);
  const levelFormulas = getFormulasByLevel(config.level);
  const formulaIndex = levelFormulas.findIndex((formula) => formula.id === selectedFormula.id) + 1;

  return {
    id: `task-${Date.now()}`,
    config: {
      ...config,
      formulaId: selectedFormula.id,
    },
    formula: selectedFormula.steps,
    formulaId: selectedFormula.id,
    formulaLabel: selectedFormula.label,
    formulaMeta: {
      level: selectedFormula.level,
      formulaIndex,
      formulaCount: levelFormulas.length,
      totalFormulaCount: STRUCTURE_FORMULAS.length,
      relations: selectedFormula.relationStack,
      punctuationRule: selectedFormula.punctuationRule,
      sourceRefs: selectedFormula.sourceRefs,
      scenario: selectedFormula.scenario,
    },
    sourceIdea: selectedFormula.sourceIdea,
    evaluationGuidance: createEvaluationGuidance(selectedFormula),
    instruction: createInstruction(config, selectedFormula),
    scaffold: config.support === "easy" ? selectedFormula.easyScaffold : "",
  };
}

function selectFormula(level, options = {}) {
  const formulas = getFormulasByLevel(level);
  if (!formulas.length) return STRUCTURE_FORMULAS[0];

  const avoidFormulaId = String(options.avoidFormulaId || "");
  const pool = formulas.length > 1 && avoidFormulaId ? formulas.filter((formula) => formula.id !== avoidFormulaId) : formulas;
  const candidates = pool.length ? pool : formulas;
  const random = typeof options.random === "function" ? options.random : Math.random;
  const index = Math.min(candidates.length - 1, Math.floor(random() * candidates.length));

  return candidates[index] || candidates[0];
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

function createEvaluationGuidance(formula) {
  const base = formula.evaluationGuidance || "Check that every required relation appears in the intended order.";

  if (formula.id !== "cause-result") return base;

  return `${base} Do not require both because and so in the same simple sentence.`;
}
