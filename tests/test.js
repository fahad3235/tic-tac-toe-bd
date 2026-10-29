// Node unit tests for tic-tac-toe-bd logic + i18n. Run: node tests/test.js
'use strict';
const assert = require('assert');
const L = require('../js/logic.js');
const I = require('../js/i18n.js');

let n = 0;
function check(name, fn) { fn(); n++; console.log('ok ' + n + ' - ' + name); }

// --- evaluate ---
check('row win X', () => {
  const b = ['X', 'X', 'X', null, null, null, null, null, null];
  const ev = L.evaluate(b);
  assert.strictEqual(ev.winner, 'X'); assert.deepStrictEqual(ev.line, [0, 1, 2]);
});
check('diagonal win O', () => {
  const b = ['O', null, null, null, 'O', null, null, null, 'O'];
  assert.strictEqual(L.evaluate(b).winner, 'O');
});
check('draw on full board', () => {
  const b = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
  const ev = L.evaluate(b);
  assert.strictEqual(ev.winner, null); assert.strictEqual(ev.draw, true);
});
check('open board not over', () => {
  const ev = L.evaluate(L.emptyBoard());
  assert.strictEqual(ev.winner, null); assert.strictEqual(ev.draw, false);
});
check('column win', () => {
  const b = [null, 'O', null, null, 'O', null, null, 'O', null];
  assert.strictEqual(L.evaluate(b).winner, 'O');
});

// --- minimax / AI ---
check('hard AI takes immediate win', () => {
  // O to move: O O _ / X X _ / _ _ _  -> O wins at 2
  const b = ['O', 'O', null, 'X', 'X', null, null, null, null];
  assert.strictEqual(L.aiMove(b.slice(), 'O', 'hard'), 2);
});
check('hard AI blocks immediate threat', () => {
  // X to move: X X _ / O _ _ / _ _ _ ; O must block at 2
  const b = ['X', 'X', null, 'O', null, null, null, null, null];
  assert.strictEqual(L.aiMove(b.slice(), 'O', 'hard'), 2);
});
check('hard AI from empty board never loses vs optimal play (score 0)', () => {
  const r = L.minimax(L.emptyBoard(), 'X', 'X', 0);
  assert.strictEqual(r.score, 0);
});
check('hard AI as second player draws vs optimal first player', () => {
  // X opens centre; O (hard) reply must hold a draw under optimal play.
  const b = [null, null, null, null, 'X', null, null, null, null];
  const r = L.minimax(b.slice(), 'O', 'O', 0);
  assert.strictEqual(r.score, 0);
});
check('hard AI wins a forced position', () => {
  // O to move: O _ X / _ O _ / X _ _ -> O wins at 8 (diagonal)
  const b = ['O', null, 'X', null, 'O', null, 'X', null, null];
  assert.strictEqual(L.aiMove(b.slice(), 'O', 'hard'), 8);
});
check('easy AI returns a legal empty cell (stubbed random)', () => {
  const b = ['X', null, null, null, null, null, null, null, null];
  assert.strictEqual(L.aiMove(b.slice(), 'O', 'easy', () => 0.999), 8);
  assert.strictEqual(L.aiMove(b.slice(), 'O', 'easy', () => 0), 1);
});
check('medium AI returns a legal empty cell', () => {
  const b = ['X', null, null, null, 'O', null, null, null, null];
  const mv = L.aiMove(b.slice(), 'X', 'medium', () => 0.5);
  assert.ok(b[mv] === null && mv >= 0 && mv < 9);
});
check('medium blunder branch returns legal cell', () => {
  const b = ['X', null, null, null, 'O', null, null, null, null];
  const mv = L.aiMove(b.slice(), 'X', 'medium', () => 0.1);
  assert.ok(b[mv] === null);
});
check('aiMove on full board returns -1', () => {
  assert.strictEqual(L.aiMove(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'], 'X', 'hard'), -1);
});
check('emptyCells lists only nulls', () => {
  assert.deepStrictEqual(L.emptyCells(['X', null, 'O', null, null, null, null, null, null]), [1, 3, 4, 5, 6, 7, 8]);
});
check('other() flips marks', () => {
  assert.strictEqual(L.other('X'), 'O'); assert.strictEqual(L.other('O'), 'X');
});

// --- i18n ---
check('en and bn share exactly the same keys', () => {
  const en = Object.keys(I.STR.en).sort(), bn = Object.keys(I.STR.bn).sort();
  assert.deepStrictEqual(en, bn);
});
check('no empty strings in either language', () => {
  for (const lang of ['en', 'bn']) for (const k of Object.keys(I.STR[lang])) {
    assert.ok(I.STR[lang][k].length > 0, lang + '.' + k);
  }
});
check('Bengali digits convert 0-9', () => {
  assert.strictEqual(I.toBnDigits('0123456789'), '\u09e6\u09e7\u09e8\u09e9\u09ea\u09eb\u09ec\u09ed\u09ee\u09ef');
  assert.strictEqual(I.toBnDigits('Score 3'), 'Score \u09e9');
});

console.log('ALL ' + n + ' TESTS PASSED');
