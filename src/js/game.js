const gameboardFns = require('./gameboard.js');
const Ship = require('./ship.js');

const Game = () => {
  const _players = {};

  function createPlayer(playerName) {
    const playerNumber = _players[1] ? 2 : 1;

    _players[playerNumber] = {
      name: playerName,
      board: gameboardFns.Gameboard()
    }
   
    const cruiser = Ship('Cruiser', 3);
    const destroyer = Ship('Destroyer', 2);
    _players[playerNumber].board.insert(cruiser, [0, 0], [0, 2]);
    _players[playerNumber].board.insert(destroyer, [1, 0], [2, 0]);

    return _players[playerNumber];
  }

  function setPlayerBoard(playerNumber) {
    const ships = [['Battleship', 4], ['Cruiser', 3]];
    for (let i = 0; i < ships.length; i++) {

    }
  }

  return {
    _players,
    createPlayer
  };
}

/*
// Carrier (occupies 5 spaces), Battleship (4), Cruiser (3), Submarine (3), and Destroyer (2).
const createRandomBoard = () => {
  const gameboard = gameboardFns.Gameboard();
  const shipArray = [Ship('Destroyer', 2)];

  // Randomly add ships to gameboard.
  for (let i = 0; i < shipArray.length; i++) {
    const ship = shipArray[i];
    // Generate random starting position in between 1 and 11.
    let randomStart = Math.floor(Math.random() * (11 - 1 + 1) + 1);

    // Generate whether integer will be x or y.
    const randomDirection = Math.floor(Math.random() * (2 - 1 + 1) + 1);
    console.log(randomDirection);
    let shipStart = randomDirection === 1 ? [randomStart, 0] : [0, randomStart];
    console.log(shipStart);
  }
}
*/

const newGame = Game();
newGame.createPlayer('Justin');
newGame.createPlayer('Jeff');
console.log(newGame);

module.exports = Game;