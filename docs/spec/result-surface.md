# Result Surface Spec

## Objective

Design the result state as a familiar writing-feedback surface inside the mobile AI chat, adapted for lesson mastery.

The result surface must borrow the evidence structure of Grammarly, LanguageTool, Hemingway, and Write & Improve without becoming a separate report page in MVP. It should appear as a structured assistant message that can expand into details.

## Core Principle

```text
The sentence is the source of truth.
The formula is the first judge.
The feedback rail explains what to do next.
The variant strip enriches only after the required lesson is satisfied.
```

## Layout

### Mobile Chat

```text
Assistant task message
Learner attempt message
Assistant result message
  status line
  formula fit
  required fix
  upgrade
  variants
  rewrite instruction
Bottom input dock
```

### Desktop Adaptation

```text
Left rail: pages/projects
Center: chat thread
Right rail: expanded feedback inspector
Bottom: input dock
```

No nested cards. Use messages, panels, rails, rows, and progressive disclosure.

## Top Session Bar

Shows:

- Lesson: Structure
- Level: 1 / 2 / 3
- Support: Easy / Normal / Hard
- Quantity progress: 1 of 3
- Formula target
- Status: Passed / Needs Revision / Off Formula

In mobile chat, this can be a compact status line inside the assistant result message. It should not look like a marketing hero.

## Annotated Sentence Panel

The learner's attempt appears exactly as submitted.

Highlight categories:

| Category | Role | Visual Treatment |
| --- | --- | --- |
| Formula | Required lesson fit | Primary accent; solid underline or subtle background. |
| Connector | Cohesion marker use | Blue/cyan family, distinct from formula status. |
| Grammar | Blocking correctness | Red underline or marker. |
| Punctuation | Mechanical punctuation | Amber/yellow marker. |
| Articles/Prepositions/Tense | Targeted grammar modules later | Specific category label; not active in MVP except when blocking. |
| Clarity | Hard to follow | Blue or neutral highlight, not always an error. |
| Style | Optional improvement | Purple or muted accent. |

Rule: formula feedback must be visibly separated from generic grammar feedback.

## Feedback Stack

Cards appear in fixed order:

1. **Formula Fit**
   - Passed / Partial / Failed.
   - Shows which relation steps were found or missing.
   - If failed, this is the only major feedback card expanded by default.

2. **Required Fixes**
   - Blocking grammar/punctuation issues.
   - Uses original -> replacement.
   - Each issue has Apply, Ignore, and Explain.

3. **Logic Upgrade**
   - Explains how the sentence could argue more clearly.
   - Only shown after formula fit is partial or passed.

4. **Style / Creativity**
   - Optional refinement.
   - Preserves learner's baseline idea.

5. **Rewrite Task**
   - One specific instruction for the next attempt.

## Variant Strip / Actions

Variants are actions, not judgments.

Initial actions:

- Make clearer.
- Make more formal.
- Make more academic.
- Make more creative.
- Make more concise.
- Make more layered.

Variant rules:

- Never replace the learner's original by default.
- Never present variants before required fixes unless collapsed behind an action.
- Always explain what changed in one line.

## Scoring

MVP scoring is local to the task. It is not a global learner score.

| Score | Meaning |
| --- | --- |
| Formula | Did the selected logical structure appear correctly? |
| Correctness | Are there blocking grammar/punctuation issues? |
| Fluency | Does the sentence read naturally? |
| Enrichment | Is it expressive without becoming inflated? |

The result should use status language more than numbers.

Preferred:

```text
Formula passed. Needs one grammar fix.
```

Avoid:

```text
You scored 84.
```

## Progressive Disclosure

Feedback should become more explicit only when needed:

1. Hint: "You are missing the concession step."
2. Specific cue: "Start with although or even though."
3. Direct scaffold: "Although ___, because ___, ___; therefore, ___."
4. Model answer: shown only after repeated failed revision.

## Empty / Clean States

If an attempt passes:

- Show a concise success state.
- Still offer one stronger variant.
- Move to next task or ask for a harder support setting.

If there are no grammar issues but formula fails:

- Do not say "all good."
- Say "Correct English, wrong structure."

## Design Borrowing From Webstar

- Calm, spare, tool-like UI.
- Cyan reserved for current selection, formula state, and primary action.
- No decorative gradients or gamified badges.
- Cards only for individual feedback items, not nested page sections.
- Dense but readable product surface.
- Familiar mobile chat behavior first; Webstar-like restraint second.

## Accessibility

- Highlight meaning must not depend on color only.
- Each issue needs a text label.
- Keyboard users must move from issue to issue.
- Popovers must have deterministic focus behavior.
- Revision input must preserve submitted attempt history.
