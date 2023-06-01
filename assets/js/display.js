const Game = require('./game');

document.addEventListener('DOMContentLoaded', () => {
  const game = Game();
  game.createPlayer('Justin');
  game.createPlayer('Jeff');
  game.turn();
});

const displayGameBoard = (player) => {
  const board = document.createElement('div');
  const 
}

