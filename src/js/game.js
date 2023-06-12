const gameboardFns = require('./gameboard.js');
const Ship = require('./ship.js');

// For Game to Run.
// Has players_object which holds two player objects, for the game
// Has currentTurn which keeps track of whose turn it is.

// HTML has input for choosing coordinates to strike on board.
// Once user has inputted valid coordinates, run turn function.
// function 'turn' which will run through a turn.
  // Coordinates will be set to gameboard, to check if there is a hit on the opponents board.
    // If there is a hit, we want to signify there is a hit
      // We want to check if a ship has fallen
      // We want to check if all ships have fallen
    // If there is a miss, we want to signify that it is a miss
      // We want to add to the miss array
    // Change the currentTurn to the opponents turn
    // Update the HTML Dom to signify that it is the opponents turn
const Game = () => {
  const _players = {};
  let _currentTurn = 1;

  function createPlayer(playerName) {
    const playerNumber = _players[1] ? 2 : 1;

    _players[playerNumber] = {
      name: playerName,
      board: gameboardFns.Gameboard()
    }

    return _players[playerNumber];
  }

  function getCurrentPlayer() {
    return _currentTurn;
  }

  function validateCoordinate(coord) {
    // ValidateCoordinate will check to make sure the coordinates are in the range 0 and 9.
    if (coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9) {
      return false;
    }
    // Check to make sure that the currentPlayers board does not have that as a Missed coordinate or hit coordinate.
    const opponentGameboard = _currentTurn === 1 ? _players[2].board : _players[1].board;
    // If opponent board has duplicates, return false.
    if (opponentGameboard.checkForDuplicates(coord)) {
      return false;
    }
    return true;
  }

  function checkInsertParameters(shipLength, start, end) {
    let dx;
    let dy;
    if (Math.abs(start[0] - end[0]) !== 0) {
      dx = Math.abs(start[0] - end[0]) + 1;
      dy = Math.abs(start[1] - end[1])
    } else {
      dx = Math.abs(start[0] - end[0])
      dy = Math.abs(start[1] - end[1]) + 1;
    }
  
    // If dx and dy aren't the ship length, then the coordinates given are incorrect.
    // This is just for manually inputting coordinates and not for future.
    if (dx !== shipLength && dy !== shipLength) {
      return false;
    // If the horizontal is correct, then dy must be 0 because there is no diagonal ship placement
    } else if (dx === shipLength) {
      return (dy === 0) ? true : false;
    // If the vertical difference is the ship length, then the horizontal difference should be 0.
    } else if (dy === shipLength) {
      return (dx === 0) ? true : false; 
    }
  }

  function turn(coord) {
    // Given a coordinate, we check to see if the opponent gameboard will get hit or a miss.
    const opponentGameboard = _currentTurn === 1 ? _players[2].board : _players[1].board;
    const atk = opponentGameboard.receiveAttack(coord);
    // if atk is type object, then the gameboard returned a miss.
    // update game message to state that it was a miss.
    return atk;
  }

  function swapTurns() {
    _currentTurn = _currentTurn === 1 ? 2 : 1;
  }

  return {
    _players,
    createPlayer,
    getCurrentPlayer,
    validateCoordinate,
    checkInsertParameters,
    turn,
    swapTurns
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
module.exports = Game;