const Ship = require('../js/ship');
const gameboardFns = require('../js/gameboard');

// Gameboards should be able to place ships at specific coordinates
//  by calling the ship factory function.
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


test('Gameboard should place ships at specific coordinates by calling the ship factory function', () => {
  const cruiser = Ship('Cruiser', 4);
  const gameboard = gameboardFns.Gameboard();
  gameboard.insert(cruiser, [0, 0], [3, 0]);
  // Expect ships array contains cruiser object.
  expect(gameboard._ships).toHaveProperty(cruiser.name, cruiser);
  // Expect coordinates [0, 0] and [3, 0] to have cruiser ship.
  expect(gameboard._board[0, 0]).toBe('Cruiser');
  expect(gameboard._board[1, 0]).toBe('Cruiser');
  expect(gameboard._board[2, 0]).toBe('Cruiser');
  expect(gameboard._board[3, 0]).toBe('Cruiser');
});

// Gameboards should have a receiveAttack function
// that takes a pair of coordinates, 
// determines whether ot not the attack hit a ship and 
// then sends the hit function to the correct ship, 
// or records the coordinates of the missed shot.
describe('receiveAttack function', () => {
  test('sends hit function if attack hits ship', () => {
    const cruiser = Ship('Cruiser', 4);
    const gameboard = gameboardFns.Gameboard();
    gameboard.insert(cruiser, [0, 0], [3, 0]);
    gameboard.receiveAttack([3, 0]);
    expect(cruiser.hit()).toHaveBeenCalled();
  });

  test('records coordinates if attack misses ships', () => {
    
  });
});

test('Gameboard should keep track of missed attacks so they can display them properly', () => {

});

test('Gameboard should be able to report whether or not all of the ships have been sunk', () => {

});