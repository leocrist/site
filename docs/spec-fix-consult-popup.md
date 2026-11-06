---
title: 'Fix quick consult popup in local preview'
type: 'bugfix'
created: '2026-11-04'
status: 'done'
route: 'one-shot'
---

# Fix quick consult popup in local preview

## Intent

**Problem:** Missing support.js left Canvas conditions and event handlers inactive. The popup displayed all states and could not close.

**Approach:** Add a local binding adapter that runs the existing component logic without changing the design. Browser checks passed for VI and EN: initial hidden state, launcher toggle, close button, Escape, six chips, invalid phone, success state, reset, and absence of page errors.

## Suggested Review Order

- Initialize existing component and bind its exported templates.
  [support.js:1](../project/support.js#L1)
- Synchronize field state and move focus when popup states change.
  [support.js:85](../project/support.js#L85)

Independent review: three reset/focus findings patched. Existing lack of backend submission recorded separately.
