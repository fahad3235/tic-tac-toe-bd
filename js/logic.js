// tic-tac-toe-bd \u2014 pure game logic, no DOM. Runs unchanged in Node and browser.
(function (root) {
  'use strict';
  var WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function emptyBoard() { return [null, null, null, null, null, null, null, null, null]; }
  function other(p) { return p === 'X' ? 'O' : 'X'; }

  // Returns {winner:'X'|'O'|null, line:[...]|null, draw:boolean}
  function evaluate(board) {
    for (var i = 0; i < WIN_LINES.length; i++) {
      var l = WIN_LINES[i];
      if (board[l[0]] && board[l[0]] === board[l[1]] && board[l[1]] === board[l[2]]) {
        return { winner: board[l[0]], line: l.slice(), draw: false };
      }
    }
    var full = board.every(function (c) { return c !== null; });
    return { winner: null, line: null, draw: full };
  }

  function emptyCells(board) {
    var out = [];
    for (var i = 0; i < 9; i++) if (board[i] === null) out.push(i);
    return out;
  }

  // Minimax from the perspective of `ai`. Returns {score, move}.
  function minimax(board, turn, ai, depth) {
    var ev = evaluate(board);
    if (ev.winner === ai) return { score: 10 - depth, move: -1 };
    if (ev.winner === other(ai)) return { score: depth - 10, move: -1 };
    if (ev.draw) return { score: 0, move: -1 };
    var cells = emptyCells(board);
    var best = { score: turn === ai ? -Infinity : Infinity, move: cells[0] };
    for (var i = 0; i < cells.length; i++) {
      board[cells[i]] = turn;
      var r = minimax(board, other(turn), ai, depth + 1);
      board[cells[i]] = null;
      if (turn === ai && r.score > best.score) best = { score: r.score, move: cells[i] };
      if (turn !== ai && r.score < best.score) best = { score: r.score, move: cells[i] };
    }
    return best;
  }

  // Depth-limited minimax used by Medium: searches only `limit` plies, then
  // scores by (ai lines of 2) minus (opponent lines of 2) as a heuristic.
  function minimaxLimited(board, turn, ai, depth, limit) {
    var ev = evaluate(board);
    if (ev.winner === ai) return { score: 10 - depth, move: -1 };
    if (ev.winner === other(ai)) return { score: depth - 10, move: -1 };
    if (ev.draw) return { score: 0, move: -1 };
    if (depth >= limit) {
      var score = 0;
      for (var i = 0; i < WIN_LINES.length; i++) {
        var l = WIN_LINES[i];
        var a = 0, o = 0;
        for (var j = 0; j < 3; j++) {
          if (board[l[j]] === ai) a++;
          if (board[l[j]] === other(ai)) o++;
        }
        if (a > 0 && o === 0) score += a;
        if (o > 0 && a === 0) score -= o;
      }
      return { score: score, move: -1 };
    }
    var cells = emptyCells(board);
    var best = { score: turn === ai ? -Infinity : Infinity, move: cells[0] };
    for (var k = 0; k < cells.length; k++) {
      board[cells[k]] = turn;
      var r = minimaxLimited(board, other(turn), ai, depth + 1, limit);
      board[cells[k]] = null;
      if (turn === ai && r.score > best.score) best = { score: r.score, move: cells[k] };
      if (turn !== ai && r.score < best.score) best = { score: r.score, move: cells[k] };
    }
    return best;
  }

  // difficulty: 'easy' | 'medium' | 'hard'. randomFn injectable for tests.
  function aiMove(board, ai, difficulty, randomFn) {
    var cells = emptyCells(board);
    if (cells.length === 0) return -1;
    var rnd = randomFn || Math.random;
    if (difficulty === 'easy') {
      return cells[Math.floor(rnd() * cells.length)];
    }
    if (difficulty === 'medium') {
      // 25% of the time blunder to a random cell (keeps Medium beatable).
      if (rnd() < 0.25) return cells[Math.floor(rnd() * cells.length)];
      return minimaxLimited(board.slice(), ai, ai, 0, 2).move;
    }
    return minimax(board.slice(), ai, ai, 0).move;
  }

  var api = {
    WIN_LINES: WIN_LINES, emptyBoard: emptyBoard, other: other,
    evaluate: evaluate, emptyCells: emptyCells,
    minimax: minimax, minimaxLimited: minimaxLimited, aiMove: aiMove
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TicTacToeLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
