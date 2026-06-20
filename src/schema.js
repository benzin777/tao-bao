const relationEnum = [
  "addition",
  "contrast",
  "cause",
  "result",
  "condition",
  "concession",
  "clarification",
  "conclusion",
  "alternative",
];

const formulaStepSchema = {
  type: "object",
  additionalProperties: false,
  required: ["id", "relation", "expectedMarkers", "required"],
  properties: {
    id: {
      type: "string",
    },
    relation: {
      type: "string",
      enum: relationEnum,
    },
    expectedMarkers: {
      type: "array",
      items: {
        type: "string",
      },
    },
    required: {
      type: "boolean",
    },
  },
};

const detectedRelationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["relationId", "relation", "marker", "textSpan", "confidence"],
  properties: {
    relationId: {
      type: "string",
    },
    relation: {
      type: "string",
      enum: relationEnum,
    },
    marker: {
      type: "string",
    },
    textSpan: {
      type: "object",
      additionalProperties: false,
      required: ["startIndex", "endIndex", "text"],
      properties: {
        startIndex: {
          type: "integer",
          minimum: 0,
        },
        endIndex: {
          type: "integer",
          minimum: 0,
        },
        text: {
          type: "string",
        },
      },
    },
    confidence: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
  },
};

const feedbackIssueSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "category",
    "severity",
    "original",
    "replacement",
    "explanation",
    "startIndex",
    "endIndex",
    "relationId",
    "action",
  ],
  properties: {
    id: {
      type: "string",
    },
    category: {
      type: "string",
      enum: [
        "formula",
        "connector",
        "grammar",
        "article",
        "preposition",
        "tense",
        "punctuation",
        "clarity",
        "enrichment",
      ],
    },
    severity: {
      type: "string",
      enum: ["blocking", "warning", "suggestion"],
    },
    original: {
      type: "string",
    },
    replacement: {
      type: "string",
    },
    explanation: {
      type: "string",
    },
    startIndex: {
      type: "integer",
      minimum: 0,
    },
    endIndex: {
      type: "integer",
      minimum: 0,
    },
    relationId: {
      type: "string",
    },
    action: {
      type: "string",
      enum: ["rewrite", "apply", "notice", "optional"],
    },
  },
};

const sentenceVariantSchema = {
  type: "object",
  additionalProperties: false,
  required: ["id", "variant", "sentence", "changeNote"],
  properties: {
    id: {
      type: "string",
    },
    variant: {
      type: "string",
      enum: ["clearer", "formal", "academic", "creative", "concise", "layered"],
    },
    sentence: {
      type: "string",
    },
    changeNote: {
      type: "string",
    },
  },
};

export const EVALUATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "status",
    "summary",
    "formula",
    "issues",
    "correctedSentence",
    "variants",
    "nextInstruction",
  ],
  properties: {
    status: {
      type: "string",
      enum: ["passed", "needs_revision", "off_formula"],
    },
    summary: {
      type: "string",
    },
    formula: {
      type: "object",
      additionalProperties: false,
      required: ["fit", "expected", "detected", "missing", "misplaced", "explanation"],
      properties: {
        fit: {
          type: "string",
          enum: ["passed", "partial", "failed"],
        },
        expected: {
          type: "array",
          items: formulaStepSchema,
        },
        detected: {
          type: "array",
          items: detectedRelationSchema,
        },
        missing: {
          type: "array",
          items: formulaStepSchema,
        },
        misplaced: {
          type: "array",
          items: detectedRelationSchema,
        },
        explanation: {
          type: "string",
        },
      },
    },
    issues: {
      type: "array",
      items: feedbackIssueSchema,
    },
    correctedSentence: {
      type: "string",
    },
    variants: {
      type: "array",
      minItems: 2,
      maxItems: 6,
      items: sentenceVariantSchema,
    },
    nextInstruction: {
      type: "string",
    },
  },
};
