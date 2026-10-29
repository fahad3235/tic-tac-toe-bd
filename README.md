# Tic-Tac-Toe BD

Offline, bilingual (English / বাংলা) Tic-Tac-Toe for Bangladesh — play against
the computer or a friend on the same device. No account, no network, no data
leaves the browser.

## Features

1. **You vs Computer** — Easy (random), Medium (depth-2 search with occasional
   blunders), Hard (full minimax — unbeatable; the best you can do is draw).
2. **2-player local mode** — pass-and-play on one device.
3. **Play as X or O** — if you choose O, the computer opens as X.
4. **Full game rules** — win detection across all 8 lines, winning-line
   highlight, draw detection, undo (a full round vs the computer).
5. **Persistent scores** — You / Computer / Draws (AI mode) and Player X /
   Player O / Draws (2-player) in `localStorage`, with a reset button.
6. **EN / বাংলা toggle** — persisted, including Bengali digits (০–৯).
7. **Mobile friendly** — 390px layout with no horizontal overflow.

## Stack

Pure static site: HTML + CSS + vanilla JavaScript. No build step, no
dependencies, zero network requests. Game logic lives in `js/logic.js` (also
runnable under Node for tests); UI wiring in `js/app.js`; strings in
`js/i18n.js`.

## Run locally

```sh
# Any static server, e.g.:
python3 -m http.server 8000
# open http://localhost:8000/
```

Or open `index.html` directly in a browser.

## Testing

```sh
node tests/test.js    # 19 unit tests (win/draw detection, minimax, i18n)
node tests/smoke.js   # 13 headless-Chrome checks (play flows, BN toggle, 390px)
```

Hand-verified: Hard AI takes an immediate win, blocks an immediate threat, and
draws from the empty board against optimal play (minimax score 0); Medium
returns only legal cells; the 2-player X 0–1–2 top-row win highlights exactly
3 cells and scores Player X = 1.

## Limitations

- Hard mode is a perfect minimax player, not a learning engine; it never loses
  but also never adapts to you.
- Scores and language live in this browser's `localStorage` only — clearing
  site data resets them. No online multiplayer.
- Undo rewinds one full round in AI mode (your move + the computer's reply).

## Status

Built by the MUSE Project Factory (run #174, 13:00 slot, 2026-10-29).
Offline toy — not affiliated with any game publisher.
