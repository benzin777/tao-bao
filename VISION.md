# Tao Dao Vision

## One Sentence

Tao Dao is an AI writing tutor that teaches English by making the learner master one high-leverage construction system at a time, starting with sentence structure and cohesive devices.

## Why This Exists

Generic grammar tools correct output. Tao Dao trains construction.

The learner's problem is not only "this sentence has an error." The deeper problem is often "I do not yet control the system that creates this sentence type." Tao Dao should therefore behave less like a proofreader and more like a structured practice partner: it assigns a pattern, watches the learner attempt it, gives targeted feedback, and asks for revision.

## Learner Model

The original learner profile is a Russian-speaking English learner who wants to deliberately train failure modules before expanding to broader writing modes.

The first modules identified:

1. Structure and cohesive devices.
2. Prepositions plus articles/determiners.
3. English time/tense/aspect.

The first implemented module is Structure Mode.

## Core Values

### Constraint Before Freedom

The app should not begin as an open writing assistant. It should constrain the task so the learner can master a specific construction.

### Formula Before Polish

A sentence must satisfy the selected structure before the app praises surface polish or creativity.

### Baseline Preservation

Corrections should preserve the learner's intent and voice. Tao Dao should improve the learner's sentence, not replace it with generic academic prose.

### Progressive Help

Support should scale from scaffolded frames to harder open tasks. The same structural level can be easy, normal, or hard depending on how much help the learner receives.

### Academic Grounding

Every mode should have a proper linguistic model behind it. For Structure Mode, the academic base is discourse competence, conjunctive cohesion, cohesive devices, and discourse markers.

### Automatic Enrichment

The learner should not manually choose tone or presentation modes. Tao Dao should infer useful rewrite enrichment after formula fit and required corrections.

### Chat First

The main interface is an AI mobile chat. Lessons, pages, hints, and results live around the chat rather than replacing it with a dashboard.

## Product Shape

```text
Tao Dao
`-- Chat Shell
    |-- Input Dock
    |   |-- Mode
    |   |-- Hint
    |   `-- Composer
    |-- Page Drawer
    |-- Mode Sheet
    |-- Hint Sheet
    `-- Lesson System
        `-- Structure Mode
            |-- Level
            |-- Support
            |-- Task
            |-- Attempt
            |-- Result
            `-- Revision
```

## Structure Mode Doctrine

Structure Mode trains logical relations between clauses:

- Additive
- Adversative/contrastive
- Causal
- Resultative
- Conditional
- Temporal/sequential
- Purpose
- Exemplification
- Comparison
- Emphasis
- Reference
- Clarifying
- Concessive
- Concluding

Level measures structure complexity:

- Level 1: one relation or one simple dependency.
- Level 2: two relation moves chained together.
- Level 3: layered argument with three or more relation moves.

Support measures task scaffolding:

- Easy: formula and fillable frame visible.
- Normal: formula named, frame hidden.
- Hard: communicative goal only.

## Future Modes

### Prepositions, Articles, Determiners

Training system:

- Articles: general/new/known.
- Determiners: pointing, owning, quantity.
- Prepositions: place, time, movement, abstract pairings.
- Core habit: before a noun, ask article/determiner and relation questions.

### Time, Tense, Aspect

Training system:

- Finished vs connected to now.
- Whole action vs in progress.
- Real vs distant.
- Present perfect as the major bridge problem.
- Continuous for current/temporary actions.
- Present simple after time/condition clauses.

## Long-Term Direction

Later, Tao Dao can grow into:

- Multiple lesson modules.
- Saved pages and learner writing.
- Per-module performance tracking.
- A learner "outfit" or profile based on completed work and result quality.
- More result analytics inspired by Grammarly, ProWritingAid, LanguageTool, and Write & Improve.

These are later layers. The first proof is whether the Structure Mode loop creates better sentences through revision.
