const Ship = require('../js/ship');

// Ships should have a hit() function that increases the number of ‘hits’ in your ship.
test('calling hit function decrements ships hitpoint by 1', () => {
  const cruiser = Ship('Cruiser', 4);
  expect(cruiser.hit()).toBe(3);
});

// isSunk() should be a function that calculates it based on their length 
// and the number of ‘hits’.
test('calling isSunk when ship is not sunk returns false', () => {
  const cruiser = Ship('Cruiser', 4);
  expect(cruiser.isSunk()).toStrictEqual(false);
});

test('calling isSunk when ship is sunk returns true', () => {
  const cruiser = Ship('Cruiser', 4);
  cruiser.hit();
  cruiser.hit();
  cruiser.hit();
  cruiser.hit();
  expect(cruiser.isSunk()).toStrictEqual(true);
});