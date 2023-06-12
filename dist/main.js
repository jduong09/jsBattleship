/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/game.js":
/*!************************!*\
  !*** ./src/js/game.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const gameboardFns = __webpack_require__(/*! ./gameboard.js */ "./src/js/gameboard.js");
const Ship = __webpack_require__(/*! ./ship.js */ "./src/js/ship.js");

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

/***/ }),

/***/ "./src/js/gameboard.js":
/*!*****************************!*\
  !*** ./src/js/gameboard.js ***!
  \*****************************/
/***/ ((module) => {

const Gameboard = () => {
  const _board = Array.from({length: 10}, () => Array(10).fill(''));
  const _ships = {};
  const _missedAttacks = [];

  // validateInsert function
  // Given a start and end parameter
  // Going from the start to the end marker
  function validateInsert(start, end) {
    const dx = start[0] - end[0];
    const dy = start[1] - end[1];
    let marker = start;
    if (dx) {
      while (marker[0] !== end[0]) {
        if (_board[marker[1]][marker[0]] !== '') {
          return false;
        }
        if (dx < 0) {
          marker = [marker[0] + 1, start[1]];
        } else {
          marker = [marker[0] - 1, start[1]];
        }
      }
    } else {
      while (marker[1] !== end[1]) {
        if (_board[marker[1]][marker[0]] !== '') {
          return false;
        }
        if (dy < 0) {
          marker = [start[0], marker[1] + 1];
        } else {
          marker = [start[0], marker[1] - 1];
        }
      }
    }
    return true;
  }

  function insert(shipObj, start, end) {
    let shipLength = shipObj.shipLength;
    _ships[shipObj.name] = shipObj;
    let dx = start[0] - end[0];
    let dy = start[1] - end[1];
    if (dx) {
      dx = Math.abs(dx) + 1;
      let xMarker = start[0];
      while (dx) {
        if (start[0] > end[0]) {
          _board[start[1]][xMarker] = shipObj.name;
          xMarker -= 1;
          dx -= 1;
        } else {
          _board[start[1]][xMarker] = shipObj.name;
          xMarker += 1
          dx -= 1;
        }
      }
    } else {
      dy = Math.abs(dy) + 1;
      let yMarker = start[1];
      while (dy) {
        if (start[1] > end[1]) {
          _board[yMarker][start[0]] = shipObj.name;
          yMarker -= 1;
          dy -= 1;
        } else {
          _board[yMarker][start[0]] = shipObj.name;
          yMarker += 1;
          dy -= 1;
        }
      }
    }
    return _board;
  }

  function receiveAttack(coord) {
    const boardlocation = _board[coord[1]][coord[0]];
    if (boardlocation !== '') {
      const ship = _ships[boardlocation];
      ship.hit();
      
      _board[coord[1]][coord[0]] = 'H';

      if (ship.isSunk()) {
        return `${ship.name} sunk!`;
      } else {
        return `${ship.name} hit!`;
      }
    } else {
      _missedAttacks.push(coord);
      _board[coord[1]][coord[0]] = 'M';
      return coord;
    }
  }

  function checkForDuplicates(coord) {
    const dupes = _missedAttacks.filter((ele) => {
      return ele[0] === coord[0] && ele[1] === coord[1];
    });
    return dupes.length ? true : false;
  }

  function gameOver() {
    for (const shipName in _ships) {
      const ship = _ships[shipName];
      if (ship.isSunk()) return false;
    }
    return true;
  }

  return {
    _board,
    _ships,
    _missedAttacks,
    validateInsert,
    insert,
    receiveAttack,
    checkForDuplicates,
    gameOver
  }
}

/*
const checkInsertParameters =(shipLength, start, end) => {
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
*/

module.exports = {
  Gameboard
};

/***/ }),

/***/ "./src/js/ship.js":
/*!************************!*\
  !*** ./src/js/ship.js ***!
  \************************/
/***/ ((module) => {

/*
REMEMBER you only have to test your object’s public interface.
Only methods or properties that are used outside of your ‘ship’ object need unit tests.
*/

// Ships should have a hit() function that increases the number of ‘hits’ in your ship.

// isSunk() should be a function that calculates it based on their length 
// and the number of ‘hits’.
const Ship = (name, hitpoints) => {
  let _hitpoints = hitpoints;
  const shipLength = hitpoints;
  let _sunk = false;

  function hit() {
    _hitpoints -= 1;

    if (!_hitpoints) {
      _sunk = true;
    }

    return _hitpoints;
  }

  function isSunk() {
    return _sunk;
  }

  return {
    name,
    shipLength,
    hit,
    isSunk,
  };
}

module.exports = Ship;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
const Game = __webpack_require__(/*! ./game */ "./src/js/game.js");
const Ship = __webpack_require__(/*! ./ship */ "./src/js/ship.js");

document.addEventListener('DOMContentLoaded', () => {
  const game = Game();

  game.createPlayer('Justin');
  game.createPlayer('Jeff');
  setPlayerBoardNames(game);
  displayGameBoard(1, game._players['1'].board._board);
  displayGameBoard(2, game._players['2'].board._board);

  startPrepPhase(game);
 
  startBattlePhase(game);
});

const startPrepPhase = (game) => {
  const inputInsertCoordinates = document.getElementById('insert-coordinates');
  const spanInsertError = document.getElementById('span-insert-error');

  setPrepHeader(game);
  setInputListener(inputInsertCoordinates, spanInsertError);
  setPrepSubmitBtnListener(game);
}

const startBattlePhase = (game) => {
  const gameMessage = document.getElementById('game-message');
  const inputCoord = document.getElementById('coord');
  const spanError = document.getElementById('span-coord-error');
  const currentPlayer = game.getCurrentPlayer();
  
  gameMessage.innerHTML = `${game._players[currentPlayer].name}'s Turn`;
  
  setInputListener(inputCoord, spanError);
  setBattleSubmitBtnListener(game);
}

const setBattleSubmitBtnListener = (game) => {
  const inputCoord = document.getElementById('coord');
  const inputSubmit = document.getElementById('atk-submit');
  const spanError = document.getElementById('span-coord-error');

  inputSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const coordinate = transformInputToCoord(inputCoord.value);
    // Given an input, we need to validate that it is a valid coordinate.
    if (game.validateCoordinate(coordinate)) {
      if (!spanError.classList.contains('hide')) {
        spanError.classList.add('hide');
      }

      // Once turn is validated, we run through the turn functions
      // We call turn with coordinate to check if it is a hit or miss.
      // Update opponents gameboard.
      const turn = game.turn(coordinate);
      // Update game message to either hit or miss
      // Display opponents gameboard to illustrate hit or miss
      // Hide gameboard after 2.5seconds.
      // NEED TO ADD GAME OVER CHECK AND GAME OVER MESSAGE.
      displayTurnResult(turn, game);
      
      // After 5 seconds
      // Change turns
      // Update Game message to battle phase
      // End of function, we want for input to be selected on turn.
      setTimeout(() => {
        // Change game phase current turn.
        game.swapTurns();
        // Show current players game board, with hits and misses and ships.
        // show opponents gameboard, with hits and misses but no ships.
        updateTurnPhase(game);
      }, 5000)
    } else {
      displayAtkErrorMessage(coordinate);
    }
  });
}

const setPlayerBoardNames = (game) => {
  const boardOneHeader = document.querySelector(`div.board[data-player="1"] > h3`);
  const boardTwoHeader = document.querySelector(`div.board[data-player="2"] > h3`);

  boardOneHeader.innerHTML = `${game._players[1].name}'s Board`;
  boardTwoHeader.innerHTML = `${game._players[2].name}'s Board`;
}

const displayTurnResult = (turn, game) => {
  // Update Game Message to hit or miss, display result of attack.
  const gameMessage = document.getElementById('game-message');
  const currentPlayer = game.getCurrentPlayer();
  const oppositePlayer = currentPlayer === 1 ? 2 : 1;

  if (Array.isArray(turn)) {
    gameMessage.innerHTML = 'MISS';
  } else {
    gameMessage.innerHTML = turn;
  }

  displayOpponentGameboard(oppositePlayer, game._players[oppositePlayer].board._board);

  // After 2.5 seconds hide the opponents game board.
  setTimeout(() => {
    hideGameBoard(oppositePlayer);
  }, 2500);
}

const updateTurnPhase = (game) => {
  const gameMessage = document.getElementById('game-message');
  const inputCoord = document.getElementById('coord');
  const divAtk = document.getElementById('div-atk');
  const player = game._players[game.getCurrentPlayer()];

  const currentPlayer = game.getCurrentPlayer();
  const opponentPlayer = currentPlayer === 1 ? 2 : 1;

  // Show current players game board, with hits and misses and ships.
  // show opponents gameboard, with hits and misses but no ships.
  displayGameBoard(currentPlayer, game._players[currentPlayer].board._board);
  displayOpponentGameboard(opponentPlayer, game._players[opponentPlayer].board._board);

  gameMessage.innerHTML = `${game._players[currentPlayer].name}'s Turn`;
  inputCoord.value = '';
  divAtk.innerHTML = `${player.name}, where would you like to attack?`;
}

const displayAtkErrorMessage = (coord) => {
  const spanError = document.getElementById('span-coord-error');

  if (coord[0] < 0 || coord[0] > 10 || coord[1] < 0 || coord[1] > 10) {
    spanError.innerHTML = 'Input is out of range. Try again.';
  } else {
    spanError.innerHTML = 'Input has been chosen already. Try again.';
  }
  spanError.classList.remove('hide');
}

const setPrepHeader = (game) => {
  const gameMessage = document.getElementById('game-message');
  const playerOne = game._players[1];
  const divInsert = document.getElementById('div-insert');
  
  gameMessage.innerHTML = `${playerOne.name}'s Turn`;
  divInsert.innerHTML = `${playerOne.name}, choose where to place your cruiser (Length: 3 Places):`;
}

const setPrepSubmitBtnListener = (game) => {
  const gamePhase = document.getElementById('game-phase');
  const gameMessage = document.getElementById('game-message');
  const formInsert = document.getElementById('form-insert-ships');
  const formBattle = document.getElementById('form-atk-coords');
  const divInsert = document.getElementById('div-insert');
  const input = document.getElementById('insert-coordinates');
  const spanError = document.getElementById('span-insert-error');
  const submit = document.getElementById('insert-submit');

  let currentPlayer = game._players[1];
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    const currentShip = divInsert.getAttribute('data-ship');
    const coordinatesArray = input.value.split(' ');
    const coordinates = [transformInputToCoord(coordinatesArray[0]), transformInputToCoord(coordinatesArray[1])];
    
    if (currentShip === 'cruiser') {
      // The two coordinates match the length of the ship
      if (game.checkInsertParameters(3, coordinates[0], coordinates[1])) {
        // Check that two coordinates don't interfere with other ships on the players board.
        if (currentPlayer.board.validateInsert(coordinates[0], coordinates[1])) {
          const ship = Ship('Cruiser', 3);
          currentPlayer.board.insert(ship, coordinates[0], coordinates[1]);
          divInsert.setAttribute('data-ship', 'battleship');
          divInsert.innerHTML = `${currentPlayer.name}, choose where to place your battleship (Length: 5 places):`;
          input.value = null;

          if (currentPlayer === game._players[1]) {
            displayGameBoard(1, game._players['1'].board._board);
          } else {
            displayGameBoard(2, game._players['2'].board._board);
          }
        } else {
          spanError.innerHTML = 'Error: Different Ship placed at coordinates. Use different coordinates.';
          spanError.classList.remove('hide');
        }
      } else {
        spanError.innerHTML = 'Error: Coordinates range does not match ship length.';
        spanError.classList.remove('hide');
      }
    } else if (currentShip === 'battleship') {
      if (game.checkInsertParameters(5, coordinates[0], coordinates[1])) {
        if (currentPlayer.board.validateInsert(coordinates[0], coordinates[1])) {
          const ship = Ship('Battleship', 5);
          currentPlayer.board.insert(ship, coordinates[0], coordinates[1]);
          divInsert.setAttribute('data-ship', 'destroyer');
          divInsert.innerHTML = `${currentPlayer.name}, choose where to place your destoyer (Length: 2 places):`;
          input.value = null;

          if (currentPlayer === game._players[1]) {
            displayGameBoard(1, game._players['1'].board._board);
          } else {
            displayGameBoard(2, game._players['2'].board._board);
          }
        } else {
          spanError.innerHTML = 'Error: Different Ship placed at coordinates. Use different coordinates.';
          spanError.classList.remove('hide');
        }
      } else {
        spanError.innerHTML = 'Error: Coordinates range does not match ship length.';
        spanError.classList.remove('hide');
      }
    } else if (currentShip === 'destroyer') {
      if (game.checkInsertParameters(2, coordinates[0], coordinates[1])) {
        if (currentPlayer.board.validateInsert(coordinates[0], coordinates[1])) {
          const ship = Ship('Destroyer', 2);
          currentPlayer.board.insert(ship, coordinates[0], coordinates[1]);
          
          if (currentPlayer === game._players[1]) {
            displayGameBoard(1, game._players['1'].board._board);
             // After 5 seconds
            setTimeout(() => {
              // Hide Player 1 board
              hideGameBoard(1);
              // Changed currentPlayer variable to Player 2
              currentPlayer = game._players[2];
              gameMessage.innerHTML = `${currentPlayer.name}'s Turn`;
              // Set div Insert to cruiser
              divInsert.setAttribute('data-ship', 'cruiser');
              divInsert.innerHTML = `${currentPlayer.name}, choose where to place your cruiser (Length: 3 places):`;
              input.value = null;
            }, 2500);
          } else {
            displayGameBoard(2, game._players['2'].board._board);

            setTimeout(() => {
              hideGameBoard(2);
              gamePhase.innerHTML = 'Battle Phase';
              formInsert.classList.add('hide');
              formBattle.classList.remove('hide');
              setBattleHeader(game);
            }, 2500);
          }
        } else {
          spanError.innerHTML = 'Error: Different Ship placed at coordinates. Use different coordinates.';
          spanError.classList.remove('hide');
        }
      } else {
        spanError.innerHTML = 'Error: Coordinates range does not match ship length.';
        spanError.classList.remove('hide');
      }
    }
  });
}

const setInputListener = (input, span) => {
  input.addEventListener('input', () => {
    if (!input.validity.valid) {
      displayInputError(input);
      span.classList.remove('hide');
    } else {
      if (!span.classList.contains('hide')) {
        span.classList.add('hide');
      }
    }
  });
}

const displayInputError = (input) => {
  const parentElement = input.parentElement;
  const spanErrorElement = parentElement.children[3];
  if (input.validity.valueMissing) {
    spanErrorElement.innerHTML = 'Error: Input is required.';
    spanErrorElement.classList.add('active');
  } else if (input.validity.tooLong) {
    spanErrorElement.innerHTML = 'Error: Input is too long.';
    spanErrorElement.classList.add('active');
  } else if (input.validity.patternMismatch) {
    spanErrorElement.innerHTML = (input.id === 'insert-coordinates')
      ? 'Error: Input does not match pattern. ex: "A4 A6".'
      : 'Error: Input does not match pattern. ex: "A5".';
  } else {
    spanErrorElement.innerHTML = '';
    spanErrorElement.classList.remove('active');
  }
}

const transformInputToCoord = (inputVal) => {
  const alph = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K'];
  
  const idxStart = alph.findIndex((ele) => {
    return ele === inputVal[0];
  });

  return [idxStart, parseInt(inputVal.slice(1)) - 1];
}

// Displays current players own game board.
const displayGameBoard = (playerNumber, playerBoard) => {
  const board = document.querySelector(`div.board[data-player="${playerNumber}"]`);
  const rowListItems = document.querySelectorAll(`div.board[data-player="${playerNumber}"] > ul > li`);

  for (let i = 0; i < playerBoard.length; i++) {
    const boardRow = playerBoard[i];
    const displayBoardRow = rowListItems[i + 1];
    const spans = displayBoardRow.children;

    for (let j = 0; j < boardRow.length; j++) {
      if (boardRow[j] === '') {
        continue;
      } else if (boardRow[j] === 'H' || boardRow[j] === 'M') {
        spans[j + 1].innerHTML = 'X';
      } else {
        spans[j + 1].innerHTML = 'S';
      }
    }
  }

  board.classList.remove('hide');
}

// Displays Opponents gameboard with hits and misses
const displayOpponentGameboard = (playerNumber, playerBoard) => {
  const board = document.querySelector(`div.board[data-player="${playerNumber}"]`);
  const rowListItems = document.querySelectorAll(`div.board[data-player="${playerNumber}"] > ul > li`);

  for (let i = 0; i < playerBoard.length; i++) {
    const boardRow = playerBoard[i];
    const displayBoardRow = rowListItems[i + 1];
    const spans = displayBoardRow.children;

    for (let j = 0; j < boardRow.length; j++) {
      if (boardRow[j] === 'H') {
        spans[j + 1].innerHTML = 'H';
      } else if  (boardRow[j] === 'M') {
        spans[j + 1].innerHTML = 'X';
      } else {
        spans[j + 1].innerHTML = '';
      }
    }
  }
  board.classList.remove('hide');
}

// Hides any game board.
const hideGameBoard = (playerNumber) => {
  const rowListItems = document.querySelectorAll(`div.board[data-player="${playerNumber}"] > ul > li`);

  for (let i = 1; i < 11; i++) {
    const displayBoardRow = rowListItems[i];
    const spans = displayBoardRow.children;

    for (let j = 1; j < 11; j++) {
      spans[j].innerHTML = '';
    }
  }
}

const setBattleHeader = (game) => {
  const divAtk = document.getElementById('div-atk');
  const currentPlayer = game.getCurrentPlayer();
  displayGameBoard(currentPlayer, game._players[currentPlayer].board._board);
  divAtk.innerHTML = `${game._players[currentPlayer].name}, where would you like to attack?`;
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlFQUFpRSxhQUFhO0FBQzlFLDJFQUEyRSxhQUFhOztBQUV4RixrQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IscUJBQXFCO0FBQ3pDO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyRUFBMkUsYUFBYTs7QUFFeEYsa0JBQWtCLFFBQVE7QUFDMUI7QUFDQTs7QUFFQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixrQ0FBa0M7QUFDMUQsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2pzYmF0dGxlc2hpcC8uL3NyYy9qcy9nYW1lLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC8uL3NyYy9qcy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwLy4vc3JjL2pzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC8uL3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnYW1lYm9hcmRGbnMgPSByZXF1aXJlKCcuL2dhbWVib2FyZC5qcycpO1xuY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcC5qcycpO1xuXG4vLyBGb3IgR2FtZSB0byBSdW4uXG4vLyBIYXMgcGxheWVyc19vYmplY3Qgd2hpY2ggaG9sZHMgdHdvIHBsYXllciBvYmplY3RzLCBmb3IgdGhlIGdhbWVcbi8vIEhhcyBjdXJyZW50VHVybiB3aGljaCBrZWVwcyB0cmFjayBvZiB3aG9zZSB0dXJuIGl0IGlzLlxuXG4vLyBIVE1MIGhhcyBpbnB1dCBmb3IgY2hvb3NpbmcgY29vcmRpbmF0ZXMgdG8gc3RyaWtlIG9uIGJvYXJkLlxuLy8gT25jZSB1c2VyIGhhcyBpbnB1dHRlZCB2YWxpZCBjb29yZGluYXRlcywgcnVuIHR1cm4gZnVuY3Rpb24uXG4vLyBmdW5jdGlvbiAndHVybicgd2hpY2ggd2lsbCBydW4gdGhyb3VnaCBhIHR1cm4uXG4gIC8vIENvb3JkaW5hdGVzIHdpbGwgYmUgc2V0IHRvIGdhbWVib2FyZCwgdG8gY2hlY2sgaWYgdGhlcmUgaXMgYSBoaXQgb24gdGhlIG9wcG9uZW50cyBib2FyZC5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIGhpdCwgd2Ugd2FudCB0byBzaWduaWZ5IHRoZXJlIGlzIGEgaGl0XG4gICAgICAvLyBXZSB3YW50IHRvIGNoZWNrIGlmIGEgc2hpcCBoYXMgZmFsbGVuXG4gICAgICAvLyBXZSB3YW50IHRvIGNoZWNrIGlmIGFsbCBzaGlwcyBoYXZlIGZhbGxlblxuICAgIC8vIElmIHRoZXJlIGlzIGEgbWlzcywgd2Ugd2FudCB0byBzaWduaWZ5IHRoYXQgaXQgaXMgYSBtaXNzXG4gICAgICAvLyBXZSB3YW50IHRvIGFkZCB0byB0aGUgbWlzcyBhcnJheVxuICAgIC8vIENoYW5nZSB0aGUgY3VycmVudFR1cm4gdG8gdGhlIG9wcG9uZW50cyB0dXJuXG4gICAgLy8gVXBkYXRlIHRoZSBIVE1MIERvbSB0byBzaWduaWZ5IHRoYXQgaXQgaXMgdGhlIG9wcG9uZW50cyB0dXJuXG5jb25zdCBHYW1lID0gKCkgPT4ge1xuICBjb25zdCBfcGxheWVycyA9IHt9O1xuICBsZXQgX2N1cnJlbnRUdXJuID0gMTtcblxuICBmdW5jdGlvbiBjcmVhdGVQbGF5ZXIocGxheWVyTmFtZSkge1xuICAgIGNvbnN0IHBsYXllck51bWJlciA9IF9wbGF5ZXJzWzFdID8gMiA6IDE7XG5cbiAgICBfcGxheWVyc1twbGF5ZXJOdW1iZXJdID0ge1xuICAgICAgbmFtZTogcGxheWVyTmFtZSxcbiAgICAgIGJvYXJkOiBnYW1lYm9hcmRGbnMuR2FtZWJvYXJkKClcbiAgICB9XG5cbiAgICByZXR1cm4gX3BsYXllcnNbcGxheWVyTnVtYmVyXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnRQbGF5ZXIoKSB7XG4gICAgcmV0dXJuIF9jdXJyZW50VHVybjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlQ29vcmRpbmF0ZShjb29yZCkge1xuICAgIC8vIFZhbGlkYXRlQ29vcmRpbmF0ZSB3aWxsIGNoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgY29vcmRpbmF0ZXMgYXJlIGluIHRoZSByYW5nZSAwIGFuZCA5LlxuICAgIGlmIChjb29yZFswXSA8IDAgfHwgY29vcmRbMF0gPiA5IHx8IGNvb3JkWzFdIDwgMCB8fCBjb29yZFsxXSA+IDkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGN1cnJlbnRQbGF5ZXJzIGJvYXJkIGRvZXMgbm90IGhhdmUgdGhhdCBhcyBhIE1pc3NlZCBjb29yZGluYXRlIG9yIGhpdCBjb29yZGluYXRlLlxuICAgIGNvbnN0IG9wcG9uZW50R2FtZWJvYXJkID0gX2N1cnJlbnRUdXJuID09PSAxID8gX3BsYXllcnNbMl0uYm9hcmQgOiBfcGxheWVyc1sxXS5ib2FyZDtcbiAgICAvLyBJZiBvcHBvbmVudCBib2FyZCBoYXMgZHVwbGljYXRlcywgcmV0dXJuIGZhbHNlLlxuICAgIGlmIChvcHBvbmVudEdhbWVib2FyZC5jaGVja0ZvckR1cGxpY2F0ZXMoY29vcmQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tJbnNlcnRQYXJhbWV0ZXJzKHNoaXBMZW5ndGgsIHN0YXJ0LCBlbmQpIHtcbiAgICBsZXQgZHg7XG4gICAgbGV0IGR5O1xuICAgIGlmIChNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgIT09IDApIHtcbiAgICAgIGR4ID0gTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICsgMTtcbiAgICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGR4ID0gTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pXG4gICAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKSArIDE7XG4gICAgfVxuICBcbiAgICAvLyBJZiBkeCBhbmQgZHkgYXJlbid0IHRoZSBzaGlwIGxlbmd0aCwgdGhlbiB0aGUgY29vcmRpbmF0ZXMgZ2l2ZW4gYXJlIGluY29ycmVjdC5cbiAgICAvLyBUaGlzIGlzIGp1c3QgZm9yIG1hbnVhbGx5IGlucHV0dGluZyBjb29yZGluYXRlcyBhbmQgbm90IGZvciBmdXR1cmUuXG4gICAgaWYgKGR4ICE9PSBzaGlwTGVuZ3RoICYmIGR5ICE9PSBzaGlwTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gSWYgdGhlIGhvcml6b250YWwgaXMgY29ycmVjdCwgdGhlbiBkeSBtdXN0IGJlIDAgYmVjYXVzZSB0aGVyZSBpcyBubyBkaWFnb25hbCBzaGlwIHBsYWNlbWVudFxuICAgIH0gZWxzZSBpZiAoZHggPT09IHNoaXBMZW5ndGgpIHtcbiAgICAgIHJldHVybiAoZHkgPT09IDApID8gdHJ1ZSA6IGZhbHNlO1xuICAgIC8vIElmIHRoZSB2ZXJ0aWNhbCBkaWZmZXJlbmNlIGlzIHRoZSBzaGlwIGxlbmd0aCwgdGhlbiB0aGUgaG9yaXpvbnRhbCBkaWZmZXJlbmNlIHNob3VsZCBiZSAwLlxuICAgIH0gZWxzZSBpZiAoZHkgPT09IHNoaXBMZW5ndGgpIHtcbiAgICAgIHJldHVybiAoZHggPT09IDApID8gdHJ1ZSA6IGZhbHNlOyBcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0dXJuKGNvb3JkKSB7XG4gICAgLy8gR2l2ZW4gYSBjb29yZGluYXRlLCB3ZSBjaGVjayB0byBzZWUgaWYgdGhlIG9wcG9uZW50IGdhbWVib2FyZCB3aWxsIGdldCBoaXQgb3IgYSBtaXNzLlxuICAgIGNvbnN0IG9wcG9uZW50R2FtZWJvYXJkID0gX2N1cnJlbnRUdXJuID09PSAxID8gX3BsYXllcnNbMl0uYm9hcmQgOiBfcGxheWVyc1sxXS5ib2FyZDtcbiAgICBjb25zdCBhdGsgPSBvcHBvbmVudEdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkKTtcbiAgICAvLyBpZiBhdGsgaXMgdHlwZSBvYmplY3QsIHRoZW4gdGhlIGdhbWVib2FyZCByZXR1cm5lZCBhIG1pc3MuXG4gICAgLy8gdXBkYXRlIGdhbWUgbWVzc2FnZSB0byBzdGF0ZSB0aGF0IGl0IHdhcyBhIG1pc3MuXG4gICAgcmV0dXJuIGF0aztcbiAgfVxuXG4gIGZ1bmN0aW9uIHN3YXBUdXJucygpIHtcbiAgICBfY3VycmVudFR1cm4gPSBfY3VycmVudFR1cm4gPT09IDEgPyAyIDogMTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgX3BsYXllcnMsXG4gICAgY3JlYXRlUGxheWVyLFxuICAgIGdldEN1cnJlbnRQbGF5ZXIsXG4gICAgdmFsaWRhdGVDb29yZGluYXRlLFxuICAgIGNoZWNrSW5zZXJ0UGFyYW1ldGVycyxcbiAgICB0dXJuLFxuICAgIHN3YXBUdXJuc1xuICB9O1xufVxuXG4vKlxuLy8gQ2FycmllciAob2NjdXBpZXMgNSBzcGFjZXMpLCBCYXR0bGVzaGlwICg0KSwgQ3J1aXNlciAoMyksIFN1Ym1hcmluZSAoMyksIGFuZCBEZXN0cm95ZXIgKDIpLlxuY29uc3QgY3JlYXRlUmFuZG9tQm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IGdhbWVib2FyZEZucy5HYW1lYm9hcmQoKTtcbiAgY29uc3Qgc2hpcEFycmF5ID0gW1NoaXAoJ0Rlc3Ryb3llcicsIDIpXTtcblxuICAvLyBSYW5kb21seSBhZGQgc2hpcHMgdG8gZ2FtZWJvYXJkLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHNoaXAgPSBzaGlwQXJyYXlbaV07XG4gICAgLy8gR2VuZXJhdGUgcmFuZG9tIHN0YXJ0aW5nIHBvc2l0aW9uIGluIGJldHdlZW4gMSBhbmQgMTEuXG4gICAgbGV0IHJhbmRvbVN0YXJ0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDExIC0gMSArIDEpICsgMSk7XG5cbiAgICAvLyBHZW5lcmF0ZSB3aGV0aGVyIGludGVnZXIgd2lsbCBiZSB4IG9yIHkuXG4gICAgY29uc3QgcmFuZG9tRGlyZWN0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDIgLSAxICsgMSkgKyAxKTtcbiAgICBjb25zb2xlLmxvZyhyYW5kb21EaXJlY3Rpb24pO1xuICAgIGxldCBzaGlwU3RhcnQgPSByYW5kb21EaXJlY3Rpb24gPT09IDEgPyBbcmFuZG9tU3RhcnQsIDBdIDogWzAsIHJhbmRvbVN0YXJ0XTtcbiAgICBjb25zb2xlLmxvZyhzaGlwU3RhcnQpO1xuICB9XG59XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBHYW1lOyIsImNvbnN0IEdhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgX2JvYXJkID0gQXJyYXkuZnJvbSh7bGVuZ3RoOiAxMH0sICgpID0+IEFycmF5KDEwKS5maWxsKCcnKSk7XG4gIGNvbnN0IF9zaGlwcyA9IHt9O1xuICBjb25zdCBfbWlzc2VkQXR0YWNrcyA9IFtdO1xuXG4gIC8vIHZhbGlkYXRlSW5zZXJ0IGZ1bmN0aW9uXG4gIC8vIEdpdmVuIGEgc3RhcnQgYW5kIGVuZCBwYXJhbWV0ZXJcbiAgLy8gR29pbmcgZnJvbSB0aGUgc3RhcnQgdG8gdGhlIGVuZCBtYXJrZXJcbiAgZnVuY3Rpb24gdmFsaWRhdGVJbnNlcnQoc3RhcnQsIGVuZCkge1xuICAgIGNvbnN0IGR4ID0gc3RhcnRbMF0gLSBlbmRbMF07XG4gICAgY29uc3QgZHkgPSBzdGFydFsxXSAtIGVuZFsxXTtcbiAgICBsZXQgbWFya2VyID0gc3RhcnQ7XG4gICAgaWYgKGR4KSB7XG4gICAgICB3aGlsZSAobWFya2VyWzBdICE9PSBlbmRbMF0pIHtcbiAgICAgICAgaWYgKF9ib2FyZFttYXJrZXJbMV1dW21hcmtlclswXV0gIT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeCA8IDApIHtcbiAgICAgICAgICBtYXJrZXIgPSBbbWFya2VyWzBdICsgMSwgc3RhcnRbMV1dO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcmtlciA9IFttYXJrZXJbMF0gLSAxLCBzdGFydFsxXV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKG1hcmtlclsxXSAhPT0gZW5kWzFdKSB7XG4gICAgICAgIGlmIChfYm9hcmRbbWFya2VyWzFdXVttYXJrZXJbMF1dICE9PSAnJykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHkgPCAwKSB7XG4gICAgICAgICAgbWFya2VyID0gW3N0YXJ0WzBdLCBtYXJrZXJbMV0gKyAxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXJrZXIgPSBbc3RhcnRbMF0sIG1hcmtlclsxXSAtIDFdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5zZXJ0KHNoaXBPYmosIHN0YXJ0LCBlbmQpIHtcbiAgICBsZXQgc2hpcExlbmd0aCA9IHNoaXBPYmouc2hpcExlbmd0aDtcbiAgICBfc2hpcHNbc2hpcE9iai5uYW1lXSA9IHNoaXBPYmo7XG4gICAgbGV0IGR4ID0gc3RhcnRbMF0gLSBlbmRbMF07XG4gICAgbGV0IGR5ID0gc3RhcnRbMV0gLSBlbmRbMV07XG4gICAgaWYgKGR4KSB7XG4gICAgICBkeCA9IE1hdGguYWJzKGR4KSArIDE7XG4gICAgICBsZXQgeE1hcmtlciA9IHN0YXJ0WzBdO1xuICAgICAgd2hpbGUgKGR4KSB7XG4gICAgICAgIGlmIChzdGFydFswXSA+IGVuZFswXSkge1xuICAgICAgICAgIF9ib2FyZFtzdGFydFsxXV1beE1hcmtlcl0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgeE1hcmtlciAtPSAxO1xuICAgICAgICAgIGR4IC09IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2JvYXJkW3N0YXJ0WzFdXVt4TWFya2VyXSA9IHNoaXBPYmoubmFtZTtcbiAgICAgICAgICB4TWFya2VyICs9IDFcbiAgICAgICAgICBkeCAtPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGR5ID0gTWF0aC5hYnMoZHkpICsgMTtcbiAgICAgIGxldCB5TWFya2VyID0gc3RhcnRbMV07XG4gICAgICB3aGlsZSAoZHkpIHtcbiAgICAgICAgaWYgKHN0YXJ0WzFdID4gZW5kWzFdKSB7XG4gICAgICAgICAgX2JvYXJkW3lNYXJrZXJdW3N0YXJ0WzBdXSA9IHNoaXBPYmoubmFtZTtcbiAgICAgICAgICB5TWFya2VyIC09IDE7XG4gICAgICAgICAgZHkgLT0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfYm9hcmRbeU1hcmtlcl1bc3RhcnRbMF1dID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgIHlNYXJrZXIgKz0gMTtcbiAgICAgICAgICBkeSAtPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfYm9hcmQ7XG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKGNvb3JkKSB7XG4gICAgY29uc3QgYm9hcmRsb2NhdGlvbiA9IF9ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xuICAgIGlmIChib2FyZGxvY2F0aW9uICE9PSAnJykge1xuICAgICAgY29uc3Qgc2hpcCA9IF9zaGlwc1tib2FyZGxvY2F0aW9uXTtcbiAgICAgIHNoaXAuaGl0KCk7XG4gICAgICBcbiAgICAgIF9ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dID0gJ0gnO1xuXG4gICAgICBpZiAoc2hpcC5pc1N1bmsoKSkge1xuICAgICAgICByZXR1cm4gYCR7c2hpcC5uYW1lfSBzdW5rIWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYCR7c2hpcC5uYW1lfSBoaXQhYDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgX21pc3NlZEF0dGFja3MucHVzaChjb29yZCk7XG4gICAgICBfYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSA9ICdNJztcbiAgICAgIHJldHVybiBjb29yZDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0ZvckR1cGxpY2F0ZXMoY29vcmQpIHtcbiAgICBjb25zdCBkdXBlcyA9IF9taXNzZWRBdHRhY2tzLmZpbHRlcigoZWxlKSA9PiB7XG4gICAgICByZXR1cm4gZWxlWzBdID09PSBjb29yZFswXSAmJiBlbGVbMV0gPT09IGNvb3JkWzFdO1xuICAgIH0pO1xuICAgIHJldHVybiBkdXBlcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICBmb3IgKGNvbnN0IHNoaXBOYW1lIGluIF9zaGlwcykge1xuICAgICAgY29uc3Qgc2hpcCA9IF9zaGlwc1tzaGlwTmFtZV07XG4gICAgICBpZiAoc2hpcC5pc1N1bmsoKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgX2JvYXJkLFxuICAgIF9zaGlwcyxcbiAgICBfbWlzc2VkQXR0YWNrcyxcbiAgICB2YWxpZGF0ZUluc2VydCxcbiAgICBpbnNlcnQsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBjaGVja0ZvckR1cGxpY2F0ZXMsXG4gICAgZ2FtZU92ZXJcbiAgfVxufVxuXG4vKlxuY29uc3QgY2hlY2tJbnNlcnRQYXJhbWV0ZXJzID0oc2hpcExlbmd0aCwgc3RhcnQsIGVuZCkgPT4ge1xuICBsZXQgZHg7XG4gIGxldCBkeTtcbiAgaWYgKE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSAhPT0gMCkge1xuICAgIGR4ID0gTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICsgMTtcbiAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKVxuICB9IGVsc2Uge1xuICAgIGR4ID0gTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pXG4gICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSkgKyAxO1xuICB9XG5cbiAgLy8gSWYgZHggYW5kIGR5IGFyZW4ndCB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBpbmNvcnJlY3QuXG4gIC8vIFRoaXMgaXMganVzdCBmb3IgbWFudWFsbHkgaW5wdXR0aW5nIGNvb3JkaW5hdGVzIGFuZCBub3QgZm9yIGZ1dHVyZS5cbiAgaWYgKGR4ICE9PSBzaGlwTGVuZ3RoICYmIGR5ICE9PSBzaGlwTGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBJZiB0aGUgaG9yaXpvbnRhbCBpcyBjb3JyZWN0LCB0aGVuIGR5IG11c3QgYmUgMCBiZWNhdXNlIHRoZXJlIGlzIG5vIGRpYWdvbmFsIHNoaXAgcGxhY2VtZW50XG4gIH0gZWxzZSBpZiAoZHggPT09IHNoaXBMZW5ndGgpIHtcbiAgICByZXR1cm4gKGR5ID09PSAwKSA/IHRydWUgOiBmYWxzZTtcbiAgLy8gSWYgdGhlIHZlcnRpY2FsIGRpZmZlcmVuY2UgaXMgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBob3Jpem9udGFsIGRpZmZlcmVuY2Ugc2hvdWxkIGJlIDAuXG4gIH0gZWxzZSBpZiAoZHkgPT09IHNoaXBMZW5ndGgpIHtcbiAgICByZXR1cm4gKGR4ID09PSAwKSA/IHRydWUgOiBmYWxzZTsgXG4gIH1cbn1cbiovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBHYW1lYm9hcmRcbn07IiwiLypcblJFTUVNQkVSIHlvdSBvbmx5IGhhdmUgdG8gdGVzdCB5b3VyIG9iamVjdOKAmXMgcHVibGljIGludGVyZmFjZS5cbk9ubHkgbWV0aG9kcyBvciBwcm9wZXJ0aWVzIHRoYXQgYXJlIHVzZWQgb3V0c2lkZSBvZiB5b3VyIOKAmHNoaXDigJkgb2JqZWN0IG5lZWQgdW5pdCB0ZXN0cy5cbiovXG5cbi8vIFNoaXBzIHNob3VsZCBoYXZlIGEgaGl0KCkgZnVuY3Rpb24gdGhhdCBpbmNyZWFzZXMgdGhlIG51bWJlciBvZiDigJhoaXRz4oCZIGluIHlvdXIgc2hpcC5cblxuLy8gaXNTdW5rKCkgc2hvdWxkIGJlIGEgZnVuY3Rpb24gdGhhdCBjYWxjdWxhdGVzIGl0IGJhc2VkIG9uIHRoZWlyIGxlbmd0aCBcbi8vIGFuZCB0aGUgbnVtYmVyIG9mIOKAmGhpdHPigJkuXG5jb25zdCBTaGlwID0gKG5hbWUsIGhpdHBvaW50cykgPT4ge1xuICBsZXQgX2hpdHBvaW50cyA9IGhpdHBvaW50cztcbiAgY29uc3Qgc2hpcExlbmd0aCA9IGhpdHBvaW50cztcbiAgbGV0IF9zdW5rID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gaGl0KCkge1xuICAgIF9oaXRwb2ludHMgLT0gMTtcblxuICAgIGlmICghX2hpdHBvaW50cykge1xuICAgICAgX3N1bmsgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBfaGl0cG9pbnRzO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNTdW5rKCkge1xuICAgIHJldHVybiBfc3VuaztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZSxcbiAgICBzaGlwTGVuZ3RoLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hpcDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpO1xuY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBjb25zdCBnYW1lID0gR2FtZSgpO1xuXG4gIGdhbWUuY3JlYXRlUGxheWVyKCdKdXN0aW4nKTtcbiAgZ2FtZS5jcmVhdGVQbGF5ZXIoJ0plZmYnKTtcbiAgc2V0UGxheWVyQm9hcmROYW1lcyhnYW1lKTtcbiAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgZGlzcGxheUdhbWVCb2FyZCgyLCBnYW1lLl9wbGF5ZXJzWycyJ10uYm9hcmQuX2JvYXJkKTtcblxuICBzdGFydFByZXBQaGFzZShnYW1lKTtcbiBcbiAgc3RhcnRCYXR0bGVQaGFzZShnYW1lKTtcbn0pO1xuXG5jb25zdCBzdGFydFByZXBQaGFzZSA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGlucHV0SW5zZXJ0Q29vcmRpbmF0ZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zZXJ0LWNvb3JkaW5hdGVzJyk7XG4gIGNvbnN0IHNwYW5JbnNlcnRFcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFuLWluc2VydC1lcnJvcicpO1xuXG4gIHNldFByZXBIZWFkZXIoZ2FtZSk7XG4gIHNldElucHV0TGlzdGVuZXIoaW5wdXRJbnNlcnRDb29yZGluYXRlcywgc3Bhbkluc2VydEVycm9yKTtcbiAgc2V0UHJlcFN1Ym1pdEJ0bkxpc3RlbmVyKGdhbWUpO1xufVxuXG5jb25zdCBzdGFydEJhdHRsZVBoYXNlID0gKGdhbWUpID0+IHtcbiAgY29uc3QgZ2FtZU1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1tZXNzYWdlJyk7XG4gIGNvbnN0IGlucHV0Q29vcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29vcmQnKTtcbiAgY29uc3Qgc3BhbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYW4tY29vcmQtZXJyb3InKTtcbiAgY29uc3QgY3VycmVudFBsYXllciA9IGdhbWUuZ2V0Q3VycmVudFBsYXllcigpO1xuICBcbiAgZ2FtZU1lc3NhZ2UuaW5uZXJIVE1MID0gYCR7Z2FtZS5fcGxheWVyc1tjdXJyZW50UGxheWVyXS5uYW1lfSdzIFR1cm5gO1xuICBcbiAgc2V0SW5wdXRMaXN0ZW5lcihpbnB1dENvb3JkLCBzcGFuRXJyb3IpO1xuICBzZXRCYXR0bGVTdWJtaXRCdG5MaXN0ZW5lcihnYW1lKTtcbn1cblxuY29uc3Qgc2V0QmF0dGxlU3VibWl0QnRuTGlzdGVuZXIgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBpbnB1dENvb3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb3JkJyk7XG4gIGNvbnN0IGlucHV0U3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F0ay1zdWJtaXQnKTtcbiAgY29uc3Qgc3BhbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYW4tY29vcmQtZXJyb3InKTtcblxuICBpbnB1dFN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGNvb3JkaW5hdGUgPSB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQoaW5wdXRDb29yZC52YWx1ZSk7XG4gICAgLy8gR2l2ZW4gYW4gaW5wdXQsIHdlIG5lZWQgdG8gdmFsaWRhdGUgdGhhdCBpdCBpcyBhIHZhbGlkIGNvb3JkaW5hdGUuXG4gICAgaWYgKGdhbWUudmFsaWRhdGVDb29yZGluYXRlKGNvb3JkaW5hdGUpKSB7XG4gICAgICBpZiAoIXNwYW5FcnJvci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSkge1xuICAgICAgICBzcGFuRXJyb3IuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgfVxuXG4gICAgICAvLyBPbmNlIHR1cm4gaXMgdmFsaWRhdGVkLCB3ZSBydW4gdGhyb3VnaCB0aGUgdHVybiBmdW5jdGlvbnNcbiAgICAgIC8vIFdlIGNhbGwgdHVybiB3aXRoIGNvb3JkaW5hdGUgdG8gY2hlY2sgaWYgaXQgaXMgYSBoaXQgb3IgbWlzcy5cbiAgICAgIC8vIFVwZGF0ZSBvcHBvbmVudHMgZ2FtZWJvYXJkLlxuICAgICAgY29uc3QgdHVybiA9IGdhbWUudHVybihjb29yZGluYXRlKTtcbiAgICAgIC8vIFVwZGF0ZSBnYW1lIG1lc3NhZ2UgdG8gZWl0aGVyIGhpdCBvciBtaXNzXG4gICAgICAvLyBEaXNwbGF5IG9wcG9uZW50cyBnYW1lYm9hcmQgdG8gaWxsdXN0cmF0ZSBoaXQgb3IgbWlzc1xuICAgICAgLy8gSGlkZSBnYW1lYm9hcmQgYWZ0ZXIgMi41c2Vjb25kcy5cbiAgICAgIC8vIE5FRUQgVE8gQUREIEdBTUUgT1ZFUiBDSEVDSyBBTkQgR0FNRSBPVkVSIE1FU1NBR0UuXG4gICAgICBkaXNwbGF5VHVyblJlc3VsdCh0dXJuLCBnYW1lKTtcbiAgICAgIFxuICAgICAgLy8gQWZ0ZXIgNSBzZWNvbmRzXG4gICAgICAvLyBDaGFuZ2UgdHVybnNcbiAgICAgIC8vIFVwZGF0ZSBHYW1lIG1lc3NhZ2UgdG8gYmF0dGxlIHBoYXNlXG4gICAgICAvLyBFbmQgb2YgZnVuY3Rpb24sIHdlIHdhbnQgZm9yIGlucHV0IHRvIGJlIHNlbGVjdGVkIG9uIHR1cm4uXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8gQ2hhbmdlIGdhbWUgcGhhc2UgY3VycmVudCB0dXJuLlxuICAgICAgICBnYW1lLnN3YXBUdXJucygpO1xuICAgICAgICAvLyBTaG93IGN1cnJlbnQgcGxheWVycyBnYW1lIGJvYXJkLCB3aXRoIGhpdHMgYW5kIG1pc3NlcyBhbmQgc2hpcHMuXG4gICAgICAgIC8vIHNob3cgb3Bwb25lbnRzIGdhbWVib2FyZCwgd2l0aCBoaXRzIGFuZCBtaXNzZXMgYnV0IG5vIHNoaXBzLlxuICAgICAgICB1cGRhdGVUdXJuUGhhc2UoZ2FtZSk7XG4gICAgICB9LCA1MDAwKVxuICAgIH0gZWxzZSB7XG4gICAgICBkaXNwbGF5QXRrRXJyb3JNZXNzYWdlKGNvb3JkaW5hdGUpO1xuICAgIH1cbiAgfSk7XG59XG5cbmNvbnN0IHNldFBsYXllckJvYXJkTmFtZXMgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBib2FyZE9uZUhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIjFcIl0gPiBoM2ApO1xuICBjb25zdCBib2FyZFR3b0hlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIjJcIl0gPiBoM2ApO1xuXG4gIGJvYXJkT25lSGVhZGVyLmlubmVySFRNTCA9IGAke2dhbWUuX3BsYXllcnNbMV0ubmFtZX0ncyBCb2FyZGA7XG4gIGJvYXJkVHdvSGVhZGVyLmlubmVySFRNTCA9IGAke2dhbWUuX3BsYXllcnNbMl0ubmFtZX0ncyBCb2FyZGA7XG59XG5cbmNvbnN0IGRpc3BsYXlUdXJuUmVzdWx0ID0gKHR1cm4sIGdhbWUpID0+IHtcbiAgLy8gVXBkYXRlIEdhbWUgTWVzc2FnZSB0byBoaXQgb3IgbWlzcywgZGlzcGxheSByZXN1bHQgb2YgYXR0YWNrLlxuICBjb25zdCBnYW1lTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW1lc3NhZ2UnKTtcbiAgY29uc3QgY3VycmVudFBsYXllciA9IGdhbWUuZ2V0Q3VycmVudFBsYXllcigpO1xuICBjb25zdCBvcHBvc2l0ZVBsYXllciA9IGN1cnJlbnRQbGF5ZXIgPT09IDEgPyAyIDogMTtcblxuICBpZiAoQXJyYXkuaXNBcnJheSh0dXJuKSkge1xuICAgIGdhbWVNZXNzYWdlLmlubmVySFRNTCA9ICdNSVNTJztcbiAgfSBlbHNlIHtcbiAgICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSB0dXJuO1xuICB9XG5cbiAgZGlzcGxheU9wcG9uZW50R2FtZWJvYXJkKG9wcG9zaXRlUGxheWVyLCBnYW1lLl9wbGF5ZXJzW29wcG9zaXRlUGxheWVyXS5ib2FyZC5fYm9hcmQpO1xuXG4gIC8vIEFmdGVyIDIuNSBzZWNvbmRzIGhpZGUgdGhlIG9wcG9uZW50cyBnYW1lIGJvYXJkLlxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBoaWRlR2FtZUJvYXJkKG9wcG9zaXRlUGxheWVyKTtcbiAgfSwgMjUwMCk7XG59XG5cbmNvbnN0IHVwZGF0ZVR1cm5QaGFzZSA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCBpbnB1dENvb3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb3JkJyk7XG4gIGNvbnN0IGRpdkF0ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtYXRrJyk7XG4gIGNvbnN0IHBsYXllciA9IGdhbWUuX3BsYXllcnNbZ2FtZS5nZXRDdXJyZW50UGxheWVyKCldO1xuXG4gIGNvbnN0IGN1cnJlbnRQbGF5ZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcbiAgY29uc3Qgb3Bwb25lbnRQbGF5ZXIgPSBjdXJyZW50UGxheWVyID09PSAxID8gMiA6IDE7XG5cbiAgLy8gU2hvdyBjdXJyZW50IHBsYXllcnMgZ2FtZSBib2FyZCwgd2l0aCBoaXRzIGFuZCBtaXNzZXMgYW5kIHNoaXBzLlxuICAvLyBzaG93IG9wcG9uZW50cyBnYW1lYm9hcmQsIHdpdGggaGl0cyBhbmQgbWlzc2VzIGJ1dCBubyBzaGlwcy5cbiAgZGlzcGxheUdhbWVCb2FyZChjdXJyZW50UGxheWVyLCBnYW1lLl9wbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLmJvYXJkLl9ib2FyZCk7XG4gIGRpc3BsYXlPcHBvbmVudEdhbWVib2FyZChvcHBvbmVudFBsYXllciwgZ2FtZS5fcGxheWVyc1tvcHBvbmVudFBsYXllcl0uYm9hcmQuX2JvYXJkKTtcblxuICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSBgJHtnYW1lLl9wbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLm5hbWV9J3MgVHVybmA7XG4gIGlucHV0Q29vcmQudmFsdWUgPSAnJztcbiAgZGl2QXRrLmlubmVySFRNTCA9IGAke3BsYXllci5uYW1lfSwgd2hlcmUgd291bGQgeW91IGxpa2UgdG8gYXR0YWNrP2A7XG59XG5cbmNvbnN0IGRpc3BsYXlBdGtFcnJvck1lc3NhZ2UgPSAoY29vcmQpID0+IHtcbiAgY29uc3Qgc3BhbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYW4tY29vcmQtZXJyb3InKTtcblxuICBpZiAoY29vcmRbMF0gPCAwIHx8IGNvb3JkWzBdID4gMTAgfHwgY29vcmRbMV0gPCAwIHx8IGNvb3JkWzFdID4gMTApIHtcbiAgICBzcGFuRXJyb3IuaW5uZXJIVE1MID0gJ0lucHV0IGlzIG91dCBvZiByYW5nZS4gVHJ5IGFnYWluLic7XG4gIH0gZWxzZSB7XG4gICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdJbnB1dCBoYXMgYmVlbiBjaG9zZW4gYWxyZWFkeS4gVHJ5IGFnYWluLic7XG4gIH1cbiAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbn1cblxuY29uc3Qgc2V0UHJlcEhlYWRlciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCBwbGF5ZXJPbmUgPSBnYW1lLl9wbGF5ZXJzWzFdO1xuICBjb25zdCBkaXZJbnNlcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWluc2VydCcpO1xuICBcbiAgZ2FtZU1lc3NhZ2UuaW5uZXJIVE1MID0gYCR7cGxheWVyT25lLm5hbWV9J3MgVHVybmA7XG4gIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGNydWlzZXIgKExlbmd0aDogMyBQbGFjZXMpOmA7XG59XG5cbmNvbnN0IHNldFByZXBTdWJtaXRCdG5MaXN0ZW5lciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVQaGFzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLXBoYXNlJyk7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCBmb3JtSW5zZXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0taW5zZXJ0LXNoaXBzJyk7XG4gIGNvbnN0IGZvcm1CYXR0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1hdGstY29vcmRzJyk7XG4gIGNvbnN0IGRpdkluc2VydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtaW5zZXJ0Jyk7XG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1jb29yZGluYXRlcycpO1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1pbnNlcnQtZXJyb3InKTtcbiAgY29uc3Qgc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1zdWJtaXQnKTtcblxuICBsZXQgY3VycmVudFBsYXllciA9IGdhbWUuX3BsYXllcnNbMV07XG4gIHN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGN1cnJlbnRTaGlwID0gZGl2SW5zZXJ0LmdldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJyk7XG4gICAgY29uc3QgY29vcmRpbmF0ZXNBcnJheSA9IGlucHV0LnZhbHVlLnNwbGl0KCcgJyk7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBbdHJhbnNmb3JtSW5wdXRUb0Nvb3JkKGNvb3JkaW5hdGVzQXJyYXlbMF0pLCB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQoY29vcmRpbmF0ZXNBcnJheVsxXSldO1xuICAgIFxuICAgIGlmIChjdXJyZW50U2hpcCA9PT0gJ2NydWlzZXInKSB7XG4gICAgICAvLyBUaGUgdHdvIGNvb3JkaW5hdGVzIG1hdGNoIHRoZSBsZW5ndGggb2YgdGhlIHNoaXBcbiAgICAgIGlmIChnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycygzLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIC8vIENoZWNrIHRoYXQgdHdvIGNvb3JkaW5hdGVzIGRvbid0IGludGVyZmVyZSB3aXRoIG90aGVyIHNoaXBzIG9uIHRoZSBwbGF5ZXJzIGJvYXJkLlxuICAgICAgICBpZiAoY3VycmVudFBsYXllci5ib2FyZC52YWxpZGF0ZUluc2VydChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0NydWlzZXInLCAzKTtcbiAgICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdiYXR0bGVzaGlwJyk7XG4gICAgICAgICAgZGl2SW5zZXJ0LmlubmVySFRNTCA9IGAke2N1cnJlbnRQbGF5ZXIubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGJhdHRsZXNoaXAgKExlbmd0aDogNSBwbGFjZXMpOmA7XG4gICAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IGdhbWUuX3BsYXllcnNbMV0pIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IERpZmZlcmVudCBTaGlwIHBsYWNlZCBhdCBjb29yZGluYXRlcy4gVXNlIGRpZmZlcmVudCBjb29yZGluYXRlcy4nO1xuICAgICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IENvb3JkaW5hdGVzIHJhbmdlIGRvZXMgbm90IG1hdGNoIHNoaXAgbGVuZ3RoLic7XG4gICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjdXJyZW50U2hpcCA9PT0gJ2JhdHRsZXNoaXAnKSB7XG4gICAgICBpZiAoZ2FtZS5jaGVja0luc2VydFBhcmFtZXRlcnMoNSwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICBpZiAoY3VycmVudFBsYXllci5ib2FyZC52YWxpZGF0ZUluc2VydChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0JhdHRsZXNoaXAnLCA1KTtcbiAgICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdkZXN0cm95ZXInKTtcbiAgICAgICAgICBkaXZJbnNlcnQuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSwgY2hvb3NlIHdoZXJlIHRvIHBsYWNlIHlvdXIgZGVzdG95ZXIgKExlbmd0aDogMiBwbGFjZXMpOmA7XG4gICAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IGdhbWUuX3BsYXllcnNbMV0pIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IERpZmZlcmVudCBTaGlwIHBsYWNlZCBhdCBjb29yZGluYXRlcy4gVXNlIGRpZmZlcmVudCBjb29yZGluYXRlcy4nO1xuICAgICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IENvb3JkaW5hdGVzIHJhbmdlIGRvZXMgbm90IG1hdGNoIHNoaXAgbGVuZ3RoLic7XG4gICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjdXJyZW50U2hpcCA9PT0gJ2Rlc3Ryb3llcicpIHtcbiAgICAgIGlmIChnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycygyLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIGlmIChjdXJyZW50UGxheWVyLmJvYXJkLnZhbGlkYXRlSW5zZXJ0KGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgICBjb25zdCBzaGlwID0gU2hpcCgnRGVzdHJveWVyJywgMik7XG4gICAgICAgICAgY3VycmVudFBsYXllci5ib2FyZC5pbnNlcnQoc2hpcCwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKTtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PT0gZ2FtZS5fcGxheWVyc1sxXSkge1xuICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgICAgICAgICAgICAvLyBBZnRlciA1IHNlY29uZHNcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBIaWRlIFBsYXllciAxIGJvYXJkXG4gICAgICAgICAgICAgIGhpZGVHYW1lQm9hcmQoMSk7XG4gICAgICAgICAgICAgIC8vIENoYW5nZWQgY3VycmVudFBsYXllciB2YXJpYWJsZSB0byBQbGF5ZXIgMlxuICAgICAgICAgICAgICBjdXJyZW50UGxheWVyID0gZ2FtZS5fcGxheWVyc1syXTtcbiAgICAgICAgICAgICAgZ2FtZU1lc3NhZ2UuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSdzIFR1cm5gO1xuICAgICAgICAgICAgICAvLyBTZXQgZGl2IEluc2VydCB0byBjcnVpc2VyXG4gICAgICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdjcnVpc2VyJyk7XG4gICAgICAgICAgICAgIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtjdXJyZW50UGxheWVyLm5hbWV9LCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBjcnVpc2VyIChMZW5ndGg6IDMgcGxhY2VzKTpgO1xuICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICB9LCAyNTAwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgyLCBnYW1lLl9wbGF5ZXJzWycyJ10uYm9hcmQuX2JvYXJkKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGhpZGVHYW1lQm9hcmQoMik7XG4gICAgICAgICAgICAgIGdhbWVQaGFzZS5pbm5lckhUTUwgPSAnQmF0dGxlIFBoYXNlJztcbiAgICAgICAgICAgICAgZm9ybUluc2VydC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgICAgICAgIGZvcm1CYXR0bGUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgICBzZXRCYXR0bGVIZWFkZXIoZ2FtZSk7XG4gICAgICAgICAgICB9LCAyNTAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogRGlmZmVyZW50IFNoaXAgcGxhY2VkIGF0IGNvb3JkaW5hdGVzLiBVc2UgZGlmZmVyZW50IGNvb3JkaW5hdGVzLic7XG4gICAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogQ29vcmRpbmF0ZXMgcmFuZ2UgZG9lcyBub3QgbWF0Y2ggc2hpcCBsZW5ndGguJztcbiAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5jb25zdCBzZXRJbnB1dExpc3RlbmVyID0gKGlucHV0LCBzcGFuKSA9PiB7XG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIGlmICghaW5wdXQudmFsaWRpdHkudmFsaWQpIHtcbiAgICAgIGRpc3BsYXlJbnB1dEVycm9yKGlucHV0KTtcbiAgICAgIHNwYW4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXNwYW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykpIHtcbiAgICAgICAgc3Bhbi5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgZGlzcGxheUlucHV0RXJyb3IgPSAoaW5wdXQpID0+IHtcbiAgY29uc3QgcGFyZW50RWxlbWVudCA9IGlucHV0LnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IHNwYW5FcnJvckVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LmNoaWxkcmVuWzNdO1xuICBpZiAoaW5wdXQudmFsaWRpdHkudmFsdWVNaXNzaW5nKSB7XG4gICAgc3BhbkVycm9yRWxlbWVudC5pbm5lckhUTUwgPSAnRXJyb3I6IElucHV0IGlzIHJlcXVpcmVkLic7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgfSBlbHNlIGlmIChpbnB1dC52YWxpZGl0eS50b29Mb25nKSB7XG4gICAgc3BhbkVycm9yRWxlbWVudC5pbm5lckhUTUwgPSAnRXJyb3I6IElucHV0IGlzIHRvbyBsb25nLic7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgfSBlbHNlIGlmIChpbnB1dC52YWxpZGl0eS5wYXR0ZXJuTWlzbWF0Y2gpIHtcbiAgICBzcGFuRXJyb3JFbGVtZW50LmlubmVySFRNTCA9IChpbnB1dC5pZCA9PT0gJ2luc2VydC1jb29yZGluYXRlcycpXG4gICAgICA/ICdFcnJvcjogSW5wdXQgZG9lcyBub3QgbWF0Y2ggcGF0dGVybi4gZXg6IFwiQTQgQTZcIi4nXG4gICAgICA6ICdFcnJvcjogSW5wdXQgZG9lcyBub3QgbWF0Y2ggcGF0dGVybi4gZXg6IFwiQTVcIi4nO1xuICB9IGVsc2Uge1xuICAgIHNwYW5FcnJvckVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgfVxufVxuXG5jb25zdCB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQgPSAoaW5wdXRWYWwpID0+IHtcbiAgY29uc3QgYWxwaCA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSyddO1xuICBcbiAgY29uc3QgaWR4U3RhcnQgPSBhbHBoLmZpbmRJbmRleCgoZWxlKSA9PiB7XG4gICAgcmV0dXJuIGVsZSA9PT0gaW5wdXRWYWxbMF07XG4gIH0pO1xuXG4gIHJldHVybiBbaWR4U3RhcnQsIHBhcnNlSW50KGlucHV0VmFsLnNsaWNlKDEpKSAtIDFdO1xufVxuXG4vLyBEaXNwbGF5cyBjdXJyZW50IHBsYXllcnMgb3duIGdhbWUgYm9hcmQuXG5jb25zdCBkaXNwbGF5R2FtZUJvYXJkID0gKHBsYXllck51bWJlciwgcGxheWVyQm9hcmQpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl1gKTtcbiAgY29uc3Qgcm93TGlzdEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgZGl2LmJvYXJkW2RhdGEtcGxheWVyPVwiJHtwbGF5ZXJOdW1iZXJ9XCJdID4gdWwgPiBsaWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBib2FyZFJvdyA9IHBsYXllckJvYXJkW2ldO1xuICAgIGNvbnN0IGRpc3BsYXlCb2FyZFJvdyA9IHJvd0xpc3RJdGVtc1tpICsgMV07XG4gICAgY29uc3Qgc3BhbnMgPSBkaXNwbGF5Qm9hcmRSb3cuY2hpbGRyZW47XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkUm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoYm9hcmRSb3dbal0gPT09ICcnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIGlmIChib2FyZFJvd1tqXSA9PT0gJ0gnIHx8IGJvYXJkUm93W2pdID09PSAnTScpIHtcbiAgICAgICAgc3BhbnNbaiArIDFdLmlubmVySFRNTCA9ICdYJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5zW2ogKyAxXS5pbm5lckhUTUwgPSAnUyc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xufVxuXG4vLyBEaXNwbGF5cyBPcHBvbmVudHMgZ2FtZWJvYXJkIHdpdGggaGl0cyBhbmQgbWlzc2VzXG5jb25zdCBkaXNwbGF5T3Bwb25lbnRHYW1lYm9hcmQgPSAocGxheWVyTnVtYmVyLCBwbGF5ZXJCb2FyZCkgPT4ge1xuICBjb25zdCBib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIiR7cGxheWVyTnVtYmVyfVwiXWApO1xuICBjb25zdCByb3dMaXN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl0gPiB1bCA+IGxpYCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGJvYXJkUm93ID0gcGxheWVyQm9hcmRbaV07XG4gICAgY29uc3QgZGlzcGxheUJvYXJkUm93ID0gcm93TGlzdEl0ZW1zW2kgKyAxXTtcbiAgICBjb25zdCBzcGFucyA9IGRpc3BsYXlCb2FyZFJvdy5jaGlsZHJlbjtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmRSb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChib2FyZFJvd1tqXSA9PT0gJ0gnKSB7XG4gICAgICAgIHNwYW5zW2ogKyAxXS5pbm5lckhUTUwgPSAnSCc7XG4gICAgICB9IGVsc2UgaWYgIChib2FyZFJvd1tqXSA9PT0gJ00nKSB7XG4gICAgICAgIHNwYW5zW2ogKyAxXS5pbm5lckhUTUwgPSAnWCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFuc1tqICsgMV0uaW5uZXJIVE1MID0gJyc7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbn1cblxuLy8gSGlkZXMgYW55IGdhbWUgYm9hcmQuXG5jb25zdCBoaWRlR2FtZUJvYXJkID0gKHBsYXllck51bWJlcikgPT4ge1xuICBjb25zdCByb3dMaXN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl0gPiB1bCA+IGxpYCk7XG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCAxMTsgaSsrKSB7XG4gICAgY29uc3QgZGlzcGxheUJvYXJkUm93ID0gcm93TGlzdEl0ZW1zW2ldO1xuICAgIGNvbnN0IHNwYW5zID0gZGlzcGxheUJvYXJkUm93LmNoaWxkcmVuO1xuXG4gICAgZm9yIChsZXQgaiA9IDE7IGogPCAxMTsgaisrKSB7XG4gICAgICBzcGFuc1tqXS5pbm5lckhUTUwgPSAnJztcbiAgICB9XG4gIH1cbn1cblxuY29uc3Qgc2V0QmF0dGxlSGVhZGVyID0gKGdhbWUpID0+IHtcbiAgY29uc3QgZGl2QXRrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1hdGsnKTtcbiAgY29uc3QgY3VycmVudFBsYXllciA9IGdhbWUuZ2V0Q3VycmVudFBsYXllcigpO1xuICBkaXNwbGF5R2FtZUJvYXJkKGN1cnJlbnRQbGF5ZXIsIGdhbWUuX3BsYXllcnNbY3VycmVudFBsYXllcl0uYm9hcmQuX2JvYXJkKTtcbiAgZGl2QXRrLmlubmVySFRNTCA9IGAke2dhbWUuX3BsYXllcnNbY3VycmVudFBsYXllcl0ubmFtZX0sIHdoZXJlIHdvdWxkIHlvdSBsaWtlIHRvIGF0dGFjaz9gO1xufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==