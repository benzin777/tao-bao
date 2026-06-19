# Interface Shell Spec

## Objective

Tao Dao is a full-screen AI mobile chat interface first.

The lesson system is not a separate dashboard. It lives around the chat as drawers, sheets, and controls that appear only when needed.

## Core Shape

```text
Top bar
  left: menu / pages
  center: current page or session title
  right: session state / account later

Main surface
  full-height AI chat
  task messages
  learner attempts
  feedback result messages
  revision turns

Bottom dock
  input
  plus button
  mode control
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
- Plus button for adding/opening tools.
- Mode button for current lesson settings.
- Small active formula readout when a lesson is running.

The dock is the primary control origin. It should feel close to the Webstar plus-button/action style: restrained, Apple-like, cyan used only for active/primary state.

## Mode Drawer

The Mode Drawer slides up or sideways from the input dock.

It controls:

| Control | Values |
| --- | --- |
| Lesson | Structure first |
| Level | 1 / 2 / 3 |
| Support | Easy / Normal / Hard |
| Quantity | 1 / 3 / 5 |
| Variant | Neutral / Formal / Academic / Creative |

Mode Drawer rules:

- Use toggles, segmented controls, steppers, and compact selectors.
- Show the formula preview directly in the drawer.
- Do not bury the learner in settings.
- Close the drawer back into the dock when a task starts.

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
- Variant options.
- Rewrite prompt.

On mobile, this replaces the classic desktop result page.

## Top-Left Menu

The top-left menu opens a page/project drawer.

The drawer contains:

- Current lesson session.
- Pages.
- Research/spec docs.
- Saved attempts later.
- Future projects/workspaces.

This is not the main practice control. It is navigation and storage.

## Pages

Pages are free-form writing spaces inside Tao Dao.

Use cases:

- Write anything.
- Store lesson notes.
- Draft examples.
- Open specs or references.
- Later, run a selected page through a lesson mode.

Pages are separate from live lesson attempts. A lesson attempt is a structured event; a page is a flexible writing object.

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
Pages belong to the top-left menu / left rail.
Result feedback belongs to the chat turn.
```

## Design Rules

- Do not make it look like a generic course dashboard.
- Do not make the first screen a landing page.
- Do not make the menu the lesson engine.
- Do not make the mode drawer a heavy settings page.
- Do not split the product into disconnected pages before the chat loop works.
- Use familiar chat affordances, then add Tao Dao specificity through the formula/mode controls.

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

