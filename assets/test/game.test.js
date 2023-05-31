const Game = require('../js/game.js');

test('createPlayer function will create player and create random gameboard for player', () => {
  const game = Game();
  game.createPlayer('Jeff');
  expect(game._players).toHaveProperty('Jeff');
});