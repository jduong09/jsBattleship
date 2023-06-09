const Game = require('../js/game.js');

test('createPlayer function will create player and create random gameboard for player', () => {
  const game = Game();
  game.createPlayer('Jeff');
  expect(game._players).toHaveProperty('1');
});

test('getCurrentTurn function will return the current player', () => {
  const game = Game();
  game.createPlayer('Jeff');
  expect(game.getCurrentPlayer()).toBe(1);
});

test('validateCoordinate function will check to see if coordinates fit in range of player board and are unique coordinates not in missed array.', () => {
  const game = Game();
  game.createPlayer('Jeff');
  game.createPlayer('Justin');
  expect(game.validateCoordinate([0, 0])).toBeTruthy();
  expect(game.validateCoordinate([10, 0])).toBeFalsy();
});