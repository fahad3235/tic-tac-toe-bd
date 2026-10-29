// tic-tac-toe-bd \u2014 EN / \u09ac\u09be\u0982\u09b2\u09be strings. Converted to \uXXXX escapes before push.
(function (root) {
  'use strict';
  var STR = {
    en: {
      tagline: 'Classic 3\u00d73 \u2014 beat the computer or play a friend',
      mode: 'Mode', vsAI: 'You vs Computer', twoPlayer: '2 Players (local)',
      difficulty: 'Difficulty', easy: 'Easy', medium: 'Medium', hard: 'Hard (unbeatable)',
      youPlay: 'You play', xLabel: 'X (first)', oLabel: 'O (second)',
      newGame: 'New game', undo: 'Undo', resetScores: 'Reset scores',
      scoreTitle: 'Score', you: 'You', computer: 'Computer', draws: 'Draws',
      playerX: 'Player X', playerO: 'Player O',
      turnYou: 'Your turn', turnAI: 'Computer is thinking\u2026', turnX: "Player X's turn", turnO: "Player O's turn",
      winYou: 'You win!', winAI: 'Computer wins!', winX: 'Player X wins!', winO: 'Player O wins!',
      drawMsg: "It's a draw!", playAgain: 'Play again',
      howTitle: 'How to play', howText: 'Get 3 in a row \u2014 across, down, or diagonal. Hard mode plays perfectly: the best you can do is draw.',
      footer: 'Offline toy. No account, no network. Scores stay on this device only.',
      cellTaken: 'That square is taken.', gameOver: 'Game over \u2014 start a new game.',
      langBtn: '\u09ac\u09be\u0982\u09b2\u09be'
    },
    bn: {
      tagline: '\u0995\u09cd\u09b2\u09be\u09b8\u09bf\u0995 \u09e9\u00d7\u09e9 \u2014 \u0995\u09ae\u09cd\u09aa\u09bf\u0989\u099f\u09be\u09b0\u0995\u09c7 \u09b9\u09be\u09b0\u09be\u09a8 \u0985\u09a5\u09ac\u09be \u09ac\u09a8\u09cd\u09a7\u09c1\u09b0 \u09b8\u09be\u09a5\u09c7 \u0996\u09c7\u09b2\u09c1\u09a8',
      mode: '\u09ae\u09cb\u09a1', vsAI: '\u0986\u09aa\u09a8\u09bf \u09ac\u09a8\u09be\u09ae \u0995\u09ae\u09cd\u09aa\u09bf\u0989\u099f\u09be\u09b0', twoPlayer: '\u09e8 \u099c\u09a8 \u0996\u09c7\u09b2\u09cb\u09af\u09bc\u09be\u09a1\u09bc',
      difficulty: '\u0995\u09a0\u09bf\u09a8\u09a4\u09be', easy: '\u09b8\u09b9\u099c', medium: '\u09ae\u09be\u099d\u09be\u09b0\u09bf', hard: '\u0995\u09a0\u09bf\u09a8 (\u0985\u09aa\u09b0\u09be\u099c\u09c7\u09af\u09bc)',
      youPlay: '\u0986\u09aa\u09a8\u09bf \u0996\u09c7\u09b2\u09ac\u09c7\u09a8', xLabel: 'X (\u09aa\u09cd\u09b0\u09a5\u09ae)', oLabel: 'O (\u09a6\u09cd\u09ac\u09bf\u09a4\u09c0\u09af\u09bc)',
      newGame: '\u09a8\u09a4\u09c1\u09a8 \u0996\u09c7\u09b2\u09be', undo: '\u09aa\u09c2\u09b0\u09cd\u09ac\u09be\u09ac\u09b8\u09cd\u09a5\u09be', resetScores: '\u09b8\u09cd\u0995\u09cb\u09b0 \u09ae\u09c1\u099b\u09c1\u09a8',
      scoreTitle: '\u09b8\u09cd\u0995\u09cb\u09b0', you: '\u0986\u09aa\u09a8\u09bf', computer: '\u0995\u09ae\u09cd\u09aa\u09bf\u0989\u099f\u09be\u09b0', draws: '\u09a1\u09cd\u09b0',
      playerX: '\u0996\u09c7\u09b2\u09cb\u09af\u09bc\u09be\u09a1\u09bc X', playerO: '\u0996\u09c7\u09b2\u09cb\u09af\u09bc\u09be\u09a1\u09bc O',
      turnYou: '\u0986\u09aa\u09a8\u09be\u09b0 \u099a\u09be\u09b2', turnAI: '\u0995\u09ae\u09cd\u09aa\u09bf\u0989\u099f\u09be\u09b0 \u09ad\u09be\u09ac\u099b\u09c7\u2026', turnX: '\u0996\u09c7\u09b2\u09cb\u09af\u09bc\u09be\u09a1\u09bc X-\u098f\u09b0 \u099a\u09be\u09b2', turnO: '\u0996\u09c7\u09b2\u09cb\u09af\u09bc\u09be\u09a1\u09bc O-\u098f\u09b0 \u099a\u09be\u09b2',
      winYou: '\u0986\u09aa\u09a8\u09bf \u099c\u09bf\u09a4\u09c7\u099b\u09c7\u09a8!', winAI: '\u0995\u09ae\u09cd\u09aa\u09bf\u0989\u099f\u09be\u09b0 \u099c\u09bf\u09a4\u09c7\u099b\u09c7!', winX: '\u0996\u09c7\u09b2\u09cb\u09af\u09bc\u09be\u09a1\u09bc X \u099c\u09bf\u09a4\u09c7\u099b\u09c7!', winO: '\u0996\u09c7\u09b2\u09cb\u09af\u09bc\u09be\u09a1\u09bc O \u099c\u09bf\u09a4\u09c7\u099b\u09c7!',
      drawMsg: '\u09a1\u09cd\u09b0 \u09b9\u09af\u09bc\u09c7\u099b\u09c7!', playAgain: '\u0986\u09ac\u09be\u09b0 \u0996\u09c7\u09b2\u09c1\u09a8',
      howTitle: '\u0995\u09c0\u09ad\u09be\u09ac\u09c7 \u0996\u09c7\u09b2\u09ac\u09c7\u09a8', howText: '\u09b8\u09be\u09b0\u09bf, \u0995\u09b2\u09be\u09ae \u09ac\u09be \u0995\u09b0\u09cd\u09a3 \u09ac\u09b0\u09be\u09ac\u09b0 \u09e9\u099f\u09bf \u09ae\u09c7\u09b2\u09be\u09a8\u0964 \u0995\u09a0\u09bf\u09a8 \u09ae\u09cb\u09a1 \u09a8\u09bf\u0996\u09c1\u0981\u09a4 \u0996\u09c7\u09b2\u09c7: \u09b8\u09c7\u09b0\u09be \u09ab\u09b2 \u09a1\u09cd\u09b0\u0964',
      footer: '\u0985\u09ab\u09b2\u09be\u0987\u09a8 \u0996\u09c7\u09b2\u09be\u0964 \u0995\u09cb\u09a8\u09cb \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u09ac\u09be \u09a8\u09c7\u099f\u0993\u09af\u09bc\u09be\u09b0\u09cd\u0995 \u09a8\u09c7\u0987\u0964 \u09b8\u09cd\u0995\u09cb\u09b0 \u09b6\u09c1\u09a7\u09c1 \u098f\u0987 \u09a1\u09bf\u09ad\u09be\u0987\u09b8\u09c7 \u09a5\u09be\u0995\u09c7\u0964',
      cellTaken: '\u098f\u0987 \u0998\u09b0\u099f\u09bf \u09a8\u09c7\u0993\u09af\u09bc\u09be \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964', gameOver: '\u0996\u09c7\u09b2\u09be \u09b6\u09c7\u09b7 \u2014 \u09a8\u09a4\u09c1\u09a8 \u0996\u09c7\u09b2\u09be \u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09c1\u09a8\u0964',
      langBtn: 'English'
    }
  };
  var BN_DIGITS = ['\u09e6', '\u09e7', '\u09e8', '\u09e9', '\u09ea', '\u09eb', '\u09ec', '\u09ed', '\u09ee', '\u09ef'];
  function toBnDigits(s) {
    return String(s).replace(/[0-9]/g, function (d) { return BN_DIGITS[+d]; });
  }
  var api = { STR: STR, toBnDigits: toBnDigits };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TicTacToeI18n = api;
})(typeof window !== 'undefined' ? window : globalThis);
