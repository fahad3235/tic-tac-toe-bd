# TEST RESULTS — tic-tac-toe-bd (factory run #174, 2026-10-29)

## Unit tests — 19/19 passed (`node tests/test.js`)

- Win detection: row (X), column (O), diagonal (O); draw on a full board;
  open board correctly not-over.
- Hard AI: takes an immediate win (O O _ -> 2), blocks an immediate threat
  (X X _ -> 2), wins a forced diagonal (position -> 8), and draws from the
  empty board against optimal play (minimax score 0 for both sides).
- Easy AI with stubbed randomness returns the expected legal cells
  (0.999 -> last empty cell, 0 -> first empty cell).
- Medium AI (depth-2 + 25% blunder branch, both stubbed) returns legal cells.
- `aiMove` on a full board returns -1; `emptyCells` and `other()` correct.
- i18n: EN and BN key sets identical, no empty strings, Bengali digits
  0–9 convert correctly.

## Headless-Chrome smoke — 13/13 passed (`node tests/smoke.js`)

Playwright `headless_shell-1187` via raw CDP (PUT on `/json/new`), `file://`
page, 0 console/page errors. Verified: title, 9 cells, "Your turn" status,
centre-click -> AI replies with O, 2-player top-row win -> "Player X wins!"
with exactly 3 highlighted cells and score X = 1, New game clears the board,
BN toggle renders Bengali tagline + English button + Bengali score digit,
390px viewport has no horizontal overflow.

## Source hygiene

All app sources pure ASCII (Bengali as `\uXXXX` escapes in JS, numeric
entities in HTML; `grep -P '[^\x00-\x7F]'` zero matches) so the push-API
transport cannot corrupt text.

## Repairs

- 1 real UI fix during build: score-row toggling referenced the wrong row id
  (You row hidden in 2-player mode); fixed before testing.
- 0 app-logic bugs found by tests or smoke.
