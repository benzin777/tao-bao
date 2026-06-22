# Interface Shell Spec

## Objective

Tao Dao is a full-screen AI mobile chat interface first.

The lesson system is not a separate dashboard. It lives around the chat as drawers, sheets, and controls that appear only when needed.

## Core Shape

```text
Top bar
  left: menu / pages
  center: empty in the mobile MVP unless a task state truly needs it
  right: hint and randomize pattern

Main surface
  full-height AI chat
  task messages
  learner attempts
  feedback result messages
  revision turns

Bottom dock
  mode control
  input
  send action
```

## Mobile-First Surface

The mobile chat is the product's default state.

Rules:

- The chat occupies the whole display.
- The input dock is always the main control surface.
- Lesson settings slide out from the input area, not from a separate settings page.
- Result feedback appears as structured chat output, not as a separate report page in MVP.
- The interface should feel like an AI chat with a disciplined lesson engine underneath.

## Bottom Input Dock

The bottom dock contains:

- Text input.
- Send button.
- Mode button for current lesson settings, shown as a gear icon.
- Small active lesson readout when a lesson is running.

The dock is the primary control origin. The old plus affordance is treated as a mode control, not a generic add button.

## Mode Drawer

The Mode Drawer slides up or sideways from the input dock.

It controls:

| Control | Values |
| --- | --- |
| Lesson | Structure first |
| Level | 1 / 2 / 3 |
| Support | Easy / Normal / Hard |

Mode Drawer rules:

- Use toggles and segmented controls.
- Do not expose formula choice in the drawer; Tao Dao chooses the exact formula from level/support.
- Do not bury the learner in settings.
- Close the drawer back into the dock when a task starts.

## Hint Sheet

The Hint button opens cohesive-device groups from the top bar.

Hint Sheet rules:

- Show the current task's required relation groups first.
- Then show general groups such as cause, result, contrast, concession, condition, addition, sequence, purpose, temporal, comparison, clarification, exemplification, emphasis, reference, and conclusion.
- Let the learner tap a device to place it into the composer.
- Do not turn hints into a second settings system.

## Task In Chat

The AI creates a lesson task as a chat message.

Examples:

```text
Structure · Level 3 · Easy
Formula: concession -> cause -> result -> conclusion

Use this frame:
Although ___, because ___, ___; therefore, ___.
```

For hard support:

```text
Structure · Level 3 · Hard
Make this idea sound logically layered:
"Small progress becomes powerful over time."
Use at least three relations.
```

## Result In Chat

The result is a structured assistant message.

It can expand into:

- Formula fit.
- Required fix.
- Upgraded sentence.
- Rewrite options.
- Rewrite prompt.

On mobile, this replaces the classic desktop result page.

## Top-Left Menu

The top-left menu opens a course/pages drawer.

In the mobile MVP, the visible top chrome should be minimal: a two-line menu affordance plus compact action icons. Do not show the app title, level readout, or API/model pill in the header unless they become actionable.

The right side can hold compact action icons:

- Hint opens the current formula devices and the general cohesion inventory.
- Randomize pattern asks the backend for a different pattern in the selected level when available.

If the learner has not typed or submitted anything, changing mode or randomizing should replace the current task card instead of stacking another task card.

The drawer contains:

- Course material.
- Lesson subpages.
- Connector sheets.
- Saved attempts later.
- Future projects/workspaces.

This is not the main practice control. It is navigation and storage.

## Pages

Pages begin as educational material inside Tao Dao.

Use cases:

- Open lesson notes.
- Read connector/course sheets.
- Store examples later.
- Later, run a selected page through a lesson mode.

Pages are separate from live lesson attempts. A lesson attempt is a structured event; a page is an educational/course object first.

In the current mobile shell, selecting a page opens a full-height reader surface over the chat instead of adding a course message to the chat thread. The reader can feel like a small internal wiki: title, summary, metadata, sections, reference tables, and examples. It must not become the lesson engine or replace the chat as the first screen.

## Desktop Adaptation

Desktop can reveal more at once:

```text
Left rail: pages/projects
Center: chat
Right rail: mode/result inspector
Bottom: input dock
```

But desktop should still preserve the same mental model:

```text
Chat is primary.
Mode controls belong to the input.
Course pages belong to the top-left menu / left rail.
Result feedback belongs to the chat turn.
```

## Design Rules

- Do not make it look like a generic course dashboard.
- Do not make the first screen a landing page.
- Do not make the menu the lesson engine.
- Do not make the mode drawer a heavy settings page.
- Do not split the product into disconnected pages before the chat loop works.
- Use familiar chat affordances, then add Tao Dao specificity through mode controls and structured feedback.

## MVP Shell

MVP can ship with:

- One chat thread.
- One current page list drawer with static docs.
- One mode drawer.
- One Structure Mode task loop.
- Result feedback as structured assistant messages.

Later:

- Multiple projects.
- Saved pages.
- Lesson history.
- Learner performance profile.
- Export/share.
