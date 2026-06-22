# Structure Mode Spec

## Purpose

Structure Mode trains the learner to build sentences by stacking logical relations.

It does not start from rare vocabulary. It starts from discourse competence: the ability to connect propositions coherently.

## Level vs Support

Level and Support must stay separate.

```text
Level = how complex the target sentence structure is.
Support = how much scaffolding the learner receives.
Hints = cohesive-device groups the learner can consult while writing.
```

## Structure Levels

### Level 1: One Relation

One connector, one logical link.

Examples:

- cause -> result
- contrast
- addition
- condition -> result
- purpose
- exemplification
- comparison

Target sentence:

```text
I trained daily, so I improved.
```

### Level 2: Two Relations

Two logical moves in one sentence.

Examples:

- condition -> result -> addition
- cause -> result -> contrast
- contrast -> clarification
- purpose -> result
- sequence -> cause -> result
- temporal -> condition -> result

Target sentence:

```text
If you commit, you will grow, and the results will compound.
```

### Level 3: Layered Argument

Three or more relations that set up, qualify, and resolve an idea.

Examples:

- concession -> cause -> result -> conclusion
- condition -> contrast -> clarification -> result
- cause -> contrast -> result -> alternative
- reference -> clarification -> contrast -> result
- exemplification -> emphasis -> result -> conclusion

Target sentence:

```text
Although the method seems slow, because it builds on small wins, it compounds; therefore, results that feel invisible early become inevitable later.
```

## Support Levels

### Easy

The app shows the formula and gives a fillable scaffold.

Example:

```text
Formula: concession -> cause -> result -> conclusion
Use this frame:
Although ___, because ___, ___; therefore, ___.
```

### Normal

The app names the formula but does not give the full sentence frame.

Example:

```text
Write one sentence using:
concession -> cause -> result -> conclusion
```

### Hard

The app gives a communicative goal, not the formula.

Example:

```text
Make this idea sound intelligent and logically layered:
"Small progress becomes powerful over time."
Use at least three logical relations.
```

## Formula Checks

The evaluator should check:

1. Required relations are present.
2. Connectors match the relation.
3. Connector placement is grammatical.
4. The relation order is coherent.
5. The sentence is one sentence unless the task permits multiple.
6. The learner's meaning is preserved in the correction.

## Formula Selection

The learner does not choose the exact formula. The app selects one pattern from the selected level.

Rules:

- Starting a task can use any formula in that level's formula pool.
- The randomize control should avoid repeating the current formula when alternatives exist.
- Task cards should expose backend metadata such as level, pattern position, total patterns in the level, and relation stack.
- If no learner attempt exists yet, a new task replaces the previous draft task instead of adding a duplicate card.

## Fixed-Grid Task Mixer

Formula selection and task content are separate.

```text
formula = relation skeleton
task mixer = concrete learning-science context
```

The mixer gives each task:

- mechanism, such as feedback loop, retrieval practice, spaced review, deliberate practice, error log, transfer, friction control, or bottleneck removal;
- situation;
- fixed idea;
- audience;
- communicative goal.

The fixed idea is part of the task contract. A learner should practice the selected structure while preserving that idea. If the connector is correct but the idea changes, the attempt still needs revision.

This prevents the formula pool from becoming repetitive motivational filler while still keeping the learner controls simple.

## Feedback Behavior

### If Formula Fails

Do not lead with polish. Lead with the missing relation.

Example:

```text
You wrote a cause/result sentence, but the task asked for concession first.
Add an opening concession with "although" or "even though."
```

### If Formula Passes But Grammar Fails

Keep the formula praise short, then correct the blocker.

Example:

```text
Formula fit: passed.
Grammar blocker: after "doesn't," use the base verb.
```

### If Formula And Grammar Pass

Offer one stronger version and explain the upgrade.

Example:

```text
Your structure works. The upgraded version makes the cause more specific and the conclusion more precise.
```

## Source-Backed Formula Inventory

The active inventory has 24 Structure formulas: 8 per level. The learner still does not choose the exact formula.

| Level | Formula | Easy Scaffold |
| --- | --- | --- |
| 1 | cause -> result | Because ___, ___. |
| 1 | contrast | ___, but ___. |
| 1 | condition -> result | If ___, ___. |
| 1 | addition | ___, and ___. |
| 1 | sequence | First, ___; then, ___. |
| 1 | purpose | To ___, ___. |
| 1 | exemplification | ___; for example, ___. |
| 1 | comparison | ___, like ___. |
| 2 | condition -> result -> addition | If ___, ___, and ___. |
| 2 | cause -> result -> contrast | Because ___, ___; however, ___. |
| 2 | contrast -> clarification | ___, but ___; in other words, ___. |
| 2 | purpose -> result | To ___, ___; as a result, ___. |
| 2 | sequence -> cause -> result | First, ___; then, because ___, ___. |
| 2 | comparison -> contrast -> clarification | Like ___, ___; however, ___; in other words, ___. |
| 2 | exemplification -> result | ___; for example, ___, so ___. |
| 2 | temporal -> condition -> result | When ___, if ___, ___. |
| 3 | concession -> cause -> result -> conclusion | Although ___, because ___, ___; therefore, ___. |
| 3 | condition -> contrast -> clarification -> result | If ___, ___ yet ___; in other words, ___, so ___. |
| 3 | cause -> contrast -> result -> alternative | Since ___ whereas ___, ___; consequently, ___ rather than ___. |
| 3 | temporal -> cause -> result -> conclusion | Once ___, because ___, ___; ultimately, ___. |
| 3 | comparison -> concession -> result -> conclusion | Like ___, ___; although ___, ___; in short, ___. |
| 3 | purpose -> sequence -> result -> conclusion | To ___, first ___, then ___; therefore, ___. |
| 3 | reference -> clarification -> contrast -> result | This ___; in other words, ___; however, ___, so ___. |
| 3 | exemplification -> emphasis -> result -> conclusion | ___; for example, ___; in fact, ___; therefore, ___. |

## Pass Criteria

An attempt passes when:

- Every required relation appears.
- The connector choice fits the relation.
- There are no blocking grammar errors.
- The sentence is understandable without the correction.
- The final rewrite can preserve the learner's baseline idea.
