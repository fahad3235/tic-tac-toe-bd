// tic-tac-toe-bd \u2014 UI wiring. Pure DOM; logic lives in js/logic.js.
(function () {
  'use strict';
  var L = window.TicTacToeLogic;
  var I18N = window.TicTacToeI18n.STR;
  var toBn = window.TicTacToeI18n.toBnDigits;
  var LS_LANG = 'ttt-bd-lang', LS_SCORE = 'ttt-bd-score';

  var state = {
    lang: 'en', mode: 'ai', difficulty: 'medium', humanMark: 'X',
    board: L.emptyBoard(), turn: 'X', over: false, winner: null, winLine: null,
    history: [], scores: { you: 0, ai: 0, x: 0, o: 0, draws: 0 }
  };

  function $(id) { return document.getElementById(id); }
  function t(key) { return I18N[state.lang][key]; }
  function fmt(n) { return state.lang === 'bn' ? toBn(n) : String(n); }

  function load() {
    try {
      var l = localStorage.getItem(LS_LANG); if (l === 'en' || l === 'bn') state.lang = l;
      var s = JSON.parse(localStorage.getItem(LS_SCORE) || 'null');
      if (s && typeof s === 'object') {
        ['you', 'ai', 'x', 'o', 'draws'].forEach(function (k) {
          if (typeof s[k] === 'number') state.scores[k] = s[k];
        });
      }
    } catch (e) { /* private mode: defaults stand */ }
  }
  function saveScores() {
    try { localStorage.setItem(LS_SCORE, JSON.stringify(state.scores)); } catch (e) {}
  }
  function saveLang() {
    try { localStorage.setItem(LS_LANG, state.lang); } catch (e) {}
  }

  function aiMark() { return L.other(state.humanMark); }
  function isAiTurn() {
    return state.mode === 'ai' && !state.over && state.turn === aiMark();
  }

  function statusText() {
    if (state.over) {
      if (state.winner === null) return t('drawMsg');
      if (state.mode === 'ai') return state.winner === state.humanMark ? t('winYou') : t('winAI');
      return state.winner === 'X' ? t('winX') : t('winO');
    }
    if (state.mode === 'ai') return isAiTurn() ? t('turnAI') : t('turnYou');
    return state.turn === 'X' ? t('turnX') : t('turnO');
  }

  function render() {
    document.documentElement.lang = state.lang === 'bn' ? 'bn' : 'en';
    var cells = document.querySelectorAll('#board .cell');
    cells.forEach(function (cell, i) {
      cell.textContent = state.board[i] || '';
      cell.classList.toggle('mark-x', state.board[i] === 'X');
      cell.classList.toggle('mark-o', state.board[i] === 'O');
      cell.classList.toggle('win', !!state.winLine && state.winLine.indexOf(i) >= 0);
      cell.disabled = state.over || state.board[i] !== null || isAiTurn();
    });
    $('status').textContent = statusText();
    $('scoreYou').textContent = fmt(state.scores.you);
    $('scoreAi').textContent = fmt(state.scores.ai);
    $('scoreX').textContent = fmt(state.scores.x);
    $('scoreO').textContent = fmt(state.scores.o);
    $('scoreDraws').textContent = fmt(state.scores.draws);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t(key)) el.textContent = t(key);
    });
    $('scoreAiRow').style.display = state.mode === 'ai' ? '' : 'none';
    $('scoreAiRow2').style.display = state.mode === 'ai' ? '' : 'none';
    $('scoreXRow').style.display = state.mode === 'ai' ? 'none' : '';
    $('scoreORow').style.display = state.mode === 'ai' ? 'none' : '';
    $('difficultyRow').style.display = state.mode === 'ai' ? '' : 'none';
    $('youPlayRow').style.display = state.mode === 'ai' ? '' : 'none';
    $('undoBtn').disabled = state.history.length === 0 || isAiTurn();
    $('langBtn').textContent = t('langBtn');
  }

  function finishIfOver() {
    var ev = L.evaluate(state.board);
    if (ev.winner || ev.draw) {
      state.over = true; state.winner = ev.winner; state.winLine = ev.line;
      if (ev.draw) state.scores.draws++;
      else if (state.mode === 'ai') {
        if (ev.winner === state.humanMark) state.scores.you++; else state.scores.ai++;
      } else if (ev.winner === 'X') state.scores.x++; else state.scores.o++;
      saveScores();
      return true;
    }
    return false;
  }

  function place(i) {
    if (state.over) { $('note').textContent = t('gameOver'); return; }
    if (state.board[i] !== null) { $('note').textContent = t('cellTaken'); return; }
    $('note').textContent = '';
    state.history.push(state.board.slice());
    state.board[i] = state.turn;
    if (!finishIfOver()) state.turn = L.other(state.turn);
    render();
    if (isAiTurn()) {
      setTimeout(function () {
        if (state.over || !isAiTurn()) return;
        state.history.push(state.board.slice());
        var mv = L.aiMove(state.board.slice(), aiMark(), state.difficulty);
        if (mv >= 0) {
          state.board[mv] = aiMark();
          if (!finishIfOver()) state.turn = state.humanMark;
        }
        render();
      }, 350);
    }
  }

  function newGame() {
    state.board = L.emptyBoard(); state.turn = 'X'; state.over = false;
    state.winner = null; state.winLine = null; state.history = [];
    $('note').textContent = '';
    render();
    // If the human plays O, the computer (X) opens.
    if (isAiTurn()) {
      setTimeout(function () {
        if (state.over || !isAiTurn()) return;
        state.history.push(state.board.slice());
        var mv = L.aiMove(state.board.slice(), aiMark(), state.difficulty);
        if (mv >= 0) {
          state.board[mv] = aiMark();
          if (!finishIfOver()) state.turn = state.humanMark;
        }
        render();
      }, 350);
    }
  }

  function undo() {
    if (state.history.length === 0 || isAiTurn()) return;
    // Undo one full round in AI mode (AI move + human move), one move in 2P.
    var steps = state.mode === 'ai' ? 2 : 1;
    while (steps > 0 && state.history.length > 0) {
      state.board = state.history.pop(); steps--;
    }
    state.over = false; state.winner = null; state.winLine = null;
    // Recompute whose turn it is from the move count.
    var filled = state.board.filter(function (c) { return c !== null; }).length;
    state.turn = (filled % 2 === 0) ? 'X' : 'O';
    $('note').textContent = '';
    render();
  }

  function init() {
    load();
    var boardEl = $('board');
    for (var i = 0; i < 9; i++) {
      (function (idx) {
        var b = document.createElement('button');
        b.className = 'cell'; b.type = 'button';
        b.setAttribute('aria-label', 'Square ' + (idx + 1));
        b.addEventListener('click', function () { place(idx); });
        boardEl.appendChild(b);
      })(i);
    }
    $('modeSel').addEventListener('change', function (e) {
      state.mode = e.target.value; newGame();
    });
    $('diffSel').addEventListener('change', function (e) {
      state.difficulty = e.target.value; newGame();
    });
    $('markSel').addEventListener('change', function (e) {
      state.humanMark = e.target.value; newGame();
    });
    $('newBtn').addEventListener('click', newGame);
    $('undoBtn').addEventListener('click', undo);
    $('resetBtn').addEventListener('click', function () {
      state.scores = { you: 0, ai: 0, x: 0, o: 0, draws: 0 };
      saveScores(); render();
    });
    $('langBtn').addEventListener('click', function () {
      state.lang = state.lang === 'en' ? 'bn' : 'en';
      saveLang(); render();
    });
    $('modeSel').value = state.mode;
    $('diffSel').value = state.difficulty;
    $('markSel').value = state.humanMark;
    newGame();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
