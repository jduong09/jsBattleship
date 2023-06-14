const Game = require('../js/game.js');
const Ship = require('../js/ship.js');

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

describe('validateCoordinate function will check to see if coordinates fit in range of player board', () => {
  const game = Game();
  game.createPlayer('Jeff');
  game.createPlayer('Justin');

  test('If coordinates are less than 0, return false', () => {
    expect(game.validateCoordinate([-1, 0])).toBeFalsy();
  });

  test('If coordinates are greater than 9', () => {
    expect(game.validateCoordinate([11, 0])).toBeFalsy();
  });

  test('If coordinates fit in range, returns true', () => {
    expect(game.validateCoordinate([0, 0])).toBeTruthy();
  });
});

describe('turn will take in a pair of coordinates, and check for hits and misses on opponents boards.', () => {
  const game = Game();
  game.createPlayer('Jeff');
  game.createPlayer('Justin');

  test('If coordinates miss a ship, add to the opponent\'s gameboards missed array, and return miss message.', () => {
    const ship = Ship('Destroyer', 2);
    game._players[2].board.insert(ship, [0, 0], [0, 1]);
    expect(game.turn([2, 0])).toStrictEqual([2, 0]);
  });

  test('If coordinates hit a ship, run ships hit function, and return hit message.', () => {
    const ship = Ship('Destroyer', 2);
    game._players[2].board.insert(ship, [0, 0], [0, 1]);
    expect(game.turn([0, 0])).toBe('Destroyer hit!');
  });

  test ('If coordinates sink a ship, return ship sunk message', () => {
    const ship = Ship('Destroyer', 2);
    const cruiser = Ship('Cruiser', 3);
    game._players[2].board.insert(ship, [0, 0], [0, 1]);
    game._players[2].board.insert(cruiser, [5, 0], [7, 0]);
    expect(game.turn([0, 0])).toBe('Destroyer hit!');
    expect(game.turn([0, 1])).toBe('Destroyer sunk!');
  });
});