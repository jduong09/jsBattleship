const Ship = require('../js/ship');
const gameboardFns = require('../js/gameboard');

describe('gameboard board is correctly created', () => {
  test('gameboard length is correctly 10', () => {
    const gameboard = gameboardFns.Gameboard();
    expect(gameboard._board.length).toEqual(10);
  });

  test('gameboard 2nd row is an array and contains items.', () => {
    const gameboard = gameboardFns.Gameboard();
    expect(gameboard._board[1]).toStrictEqual(['', '', '', '', '', '', '', '', '', '']);
    expect(gameboard._board.length).toEqual(10);
  });
});

describe ('validateInsert should check that a start and end coordinates does not interfere with ships already placed on board', () => {
  test('If there is a ship already placed at B1, then parameters A1 to C1 should throw error', () => {
    const gameboard = gameboardFns.Gameboard();
    const cruiser = Ship('Cruiser', 3);
    gameboard.insert(cruiser, [0, 0], [2, 0]);
    // const destroyer = Ship('Destroyer', 2);
    expect(gameboard.validateInsert([1, 0], [1, 1])).toBeFalsy();
  });

  test('If there is are no ships placed between the two parameters, then parameters A1 to C1 should return tru', () => {
    const gameboard = gameboardFns.Gameboard();
    const cruiser = Ship('Cruiser', 3);
    gameboard.insert(cruiser, [0, 0], [2, 0]);

    // const destroyer = Ship('Destroyer', 2);
    expect(gameboard.validateInsert([1, 1], [1, 2])).toBeTruthy();
  });
});
// Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
/*
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
*/
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
    gameboard.insert(cruiser, [9, 0], [6, 0]);
    expect(gameboard._ships).toHaveProperty(cruiser.name, cruiser);
    
    expect(gameboard._board[0][9]).toBe('Cruiser');
    expect(gameboard._board[0][8]).toBe('Cruiser');
    expect(gameboard._board[0][7]).toBe('Cruiser');
    expect(gameboard._board[0][6]).toBe('Cruiser');
    expect(gameboard._board[0][5]).toBe('');
    expect(gameboard._board[1][9]).toBe('');
  });

  test('Inserting Ship that goes vertically on board when going bottom to top', () => {
    const cruiser = Ship('Cruiser', 4);
    const gameboard = gameboardFns.Gameboard();
    gameboard.insert(cruiser, [0, 4], [0, 1]);
    expect(gameboard._ships).toHaveProperty(cruiser.name, cruiser);

    expect(gameboard._board[1][0]).toBe('Cruiser');
    expect(gameboard._board[2][0]).toBe('Cruiser');
    expect(gameboard._board[3][0]).toBe('Cruiser');
    expect(gameboard._board[4][0]).toBe('Cruiser');
    expect(gameboard._board[0][0]).toBe('');
    expect(gameboard._board[5][0]).toBe('');
    expect(gameboard._board[4][1]).toBe('');
  });

  test('Inserting Ship that goes vertically on board when going bottom to top', () => {
    const cruiser = Ship('Cruiser', 3);
    const gameboard = gameboardFns.Gameboard();
    gameboard.insert(cruiser, [0, 7], [0, 9]);
    expect(gameboard._ships).toHaveProperty(cruiser.name, cruiser);

    expect(gameboard._board[7][0]).toBe('Cruiser');
    expect(gameboard._board[8][0]).toBe('Cruiser');
    expect(gameboard._board[9][0]).toBe('Cruiser');
    expect(gameboard._board[6][0]).toBe('');
    expect(gameboard._board[8][1]).toBe('');
  });

  test('Inserting ship at area where another ship is inserted should result in no insertion', () => {
    const cruiser = Ship('Cruiser', 3);
    const gameboard = gameboardFns.Gameboard();
    gameboard.insert(cruiser, [0, 2], [0, 0]);
    expect(gameboard.validateInsert([0, 2], [0, 5])).toBeFalsy();
  });
});

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

describe('Gameboard should be able to report whether or not a coordinate has been chosen already', () => {
  const gameboard = gameboardFns.Gameboard();
  gameboard.receiveAttack([0, 0]);

  test('checkForDuplicates returns true if coordinates matches a coordinate in missed array already', () => {
    expect(gameboard.checkForDuplicates([0, 0])).toBeTruthy();
  });

  test('checkForDuplicates returns false if coordinates does not match a coordinate in missedArray', () => {
    expect(gameboard.checkForDuplicates([3, 0])).toBeFalsy();
  });
});