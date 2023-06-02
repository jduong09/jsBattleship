const Game = require('./game');

document.addEventListener('DOMContentLoaded', () => {
  const game = Game();
  game.createPlayer('Justin');
  game.createPlayer('Jeff');
  game.turn();

  displayGameBoard(game._players['1']);
});

const displayGameBoard = (playerNumber) => {

  const board = playerNumber === 1 ? document.querySelector('div.board:first-of-type') : document.querySelector('div.board:last-of-type');
  
  console.log(board);
}

