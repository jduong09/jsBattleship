const Ship = require('../js/ship');
const gameboardFns = require('../js/gameboard');

describe('gameboard board is correctly created', () => {
  test('gameboard length is correctly 11', () => {
    const gameboard = gameboardFns.Gameboard();
    expect(gameboard._board.length).toEqual(11);
  });

  test('gameboard 2nd row is an array and contains items.', () => {
    const gameboard = gameboardFns.Gameboard();
    expect(gameboard._board[1]).toStrictEqual(['', '', '', '', '', '', '', '', '', '', '']);
    expect(gameboard._board.length).toEqual(11);
  });
});

// Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
describe('checkInsertParameters should check to see if start and end coordinates accurately match shipLength', () => {
  test('If start and end accurately match shipLength, return truthy', () => {
    expect(gameboardFns.checkInsertParameters(4, [0, 0], [3, 0])).toBeTruthy();
    expect(gameboardFns.checkInsertParameters(4, [0, 0], [0, 3])).toBeTruthy();
  });
  test('If start and end incorrectly match shipLength, return falsy', () => {
    expect(gameboardFns.checkInsertParameters(3, [0, 0], [3, 0])).toBeFalsy();
    expect(gameboardFns.checkInsertParameters(3, [0, 0], [4, 0])).toBeFalsy();
  });
});

describe('Gameboard should place ships at specific coordinates by calling the ship factory function', () => {
  test('Inserting Ship that goes horizontally on board when going left to right', () => {
    const cruiser = Ship('Cruiser', 4);
    const gameboard = gameboardFns.Gameboard();
    gameboard.insert(cruiser, [0, 0], [3, 0]);
    // Expect ships array contains cruiser object.
    expect(gameboard._ships).toHaveProperty(cruiser.name, cruiser);
    // Expect coordinates [0, 0] and [3, 0] to have cruiser ship.
    expect(gameboard._board[0][0]).toBe('Cruiser');
    expect(gameboard._board[0][1]).toBe('Cruiser');
    expect(gameboard._board[0][2]).toBe('Cruiser');
    expect(gameboard._board[0][3]).toBe('Cruiser');
    expect(gameboard._board[0][4]).toBe('');
    expect(gameboard._board[1][4]).toBe('');
  });

  test('Inserting Ship that goes horizontally on board when going right to left', () => {
    const cruiser = Ship('Cruiser', 4);
    const gameboard = gameboardFns.Gameboard();
    gameboard.insert(cruiser, [3, 0], [0, 0]);
    expect(gameboard._ships).toHaveProperty(cruiser.name, cruiser);
    
    expect(gameboard._board[0][0]).toBe('Cruiser');
    expect(gameboard._board[0][1]).toBe('Cruiser');
    expect(gameboard._board[0][2]).toBe('Cruiser');
    expect(gameboard._board[0][3]).toBe('Cruiser');
    expect(gameboard._board[0][4]).toBe('');
    expect(gameboard._board[1][4]).toBe('');
  });

  test('Inserting Ship that goes vertically on board when going bottom to top', () => {
    const cruiser = Ship('Cruiser', 4);
    const gameboard = gameboardFns.Gameboard();
    gameboard.insert(cruiser, [0, 0], [0, 3]);
    expect(gameboard._ships).toHaveProperty(cruiser.name, cruiser);

    expect(gameboard._board[0][0]).toBe('Cruiser');
    expect(gameboard._board[1][0]).toBe('Cruiser');
    expect(gameboard._board[2][0]).toBe('Cruiser');
    expect(gameboard._board[3][0]).toBe('Cruiser');
    expect(gameboard._board[4][0]).toBe('');
    expect(gameboard._board[4][1]).toBe('');
  });

  test('Inserting Ship that goes vertically on board when going bottom to top', () => {
    const cruiser = Ship('Cruiser', 4);
    const gameboard = gameboardFns.Gameboard();
    gameboard.insert(cruiser, [0, 3], [0, 0]);
    expect(gameboard._ships).toHaveProperty(cruiser.name, cruiser);

    expect(gameboard._board[0][0]).toBe('Cruiser');
    expect(gameboard._board[1][0]).toBe('Cruiser');
    expect(gameboard._board[2][0]).toBe('Cruiser');
    expect(gameboard._board[3][0]).toBe('Cruiser');
    expect(gameboard._board[4][0]).toBe('');
    expect(gameboard._board[4][1]).toBe('');
  });
})

// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether ot not the attack hit a ship and then sends the hit function to the correct ship, or records the coordinates of the missed shot.
describe('receiveAttack function', () => {
  test('sends hit function if attack hits ship', () => {
    const cruiser = Ship('Cruiser', 1);
    const gameboard = gameboardFns.Gameboard();
    gameboard.insert(cruiser, [0, 0], [0, 0]);
    gameboard.receiveAttack([0, 0]);
    expect(cruiser.isSunk()).toBeTruthy();
  });

  test('records coordinates if attack misses ships', () => {
    const cruiser = Ship('Cruiser', 4);
    const gameboard = gameboardFns.Gameboard();
    gameboard.insert(cruiser, [0, 0], [3, 0]);
    expect(gameboard.receiveAttack([4, 0])).toStrictEqual([4, 0]);
  });
});

test('Gameboard should keep track of missed attacks so they can display them properly', () => {
  const expected = [[4, 0]];
  const cruiser = Ship('Cruiser', 4);
  const gameboard = gameboardFns.Gameboard();
  gameboard.insert(cruiser, [0, 0], [3, 0]);
  // Send missed attack
  gameboard.receiveAttack([4, 0]);
  expect(gameboard._missedAttacks).toEqual(expect.arrayContaining(expected));
});

test('Gameboard should be able to report whether or not all of the ships have been sunk', () => {
  const cruiser = Ship('Cruiser', 4);
  const airCarrier = Ship('Air Carrier', 7);
  const gameboard = gameboardFns.Gameboard();
  gameboard.insert(cruiser, [0, 0], [3, 0]);
  gameboard.insert(airCarrier, [11, 0], [5, 0]);

  // Destroy Cruiser
  gameboard.receiveAttack([0, 0]);
  gameboard.receiveAttack([1, 0]);
  gameboard.receiveAttack([2, 0]);
  gameboard.receiveAttack([3, 0]);

  // Destroy Air Carrier
  gameboard.receiveAttack([11, 0]);
  gameboard.receiveAttack([10, 0]);
  gameboard.receiveAttack([9, 0]);
  gameboard.receiveAttack([8, 0]);
  gameboard.receiveAttack([7, 0]);
  gameboard.receiveAttack([6, 0]);
  gameboard.receiveAttack([5, 0]);

  expect(gameboard.gameOver).toBeTruthy();
});