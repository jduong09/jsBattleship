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
    const opponentGameboard = _currentTurn === 1 ? _players[2].board : _players[1].board;
    const atk = opponentGameboard.receiveAttack(coord);
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

      if (ship.isSunk()) {
        return `${ship.name} sunk!`;
      }
      _board[coord[1]][coord[0]] = 'H';
      return 'hit';
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
  // Initialize Game Object
  const game = Game();

  // Create Two Players And Display their boards
  game.createPlayer('Justin');
  game.createPlayer('Jeff');
  displayGameBoard(1, game._players['1'].board._board);
  displayGameBoard(2, game._players['2'].board._board);
  // Prep Phase
  // Set Player 1 Board
    // Ask player for input coordinates for 3 ships
  // Set Player 2 Board
    // Ask player for input coordinates for 3 ships
  startPrepPhase(game);
  // Battle Phase
    // Ask Player 1 for coordinates to hit
    // Ask Player 2 for coordinates to hit
  startBattlePhase(game);
});

const startPrepPhase = (game) => {
  /*
  <form id="form-insert-ships">
    <div id="div-insert" data-ship="cruiser">Player 1, choose where to place your cruiser (Length: 3 places):</div>
    <label>Coordinates:</label>
    <input type="text" id="insert-coordinates" minlength="5" maxlength="7" pattern="^[A-Z]([1-9]|10)\s[A-Z]([1-9]|10)$" placeholder="ex: A4 A6, B3 B6" required/>
    <span id="span-insert-error" class="span-input-error hide"></span>
    <input type="submit" id="insert-submit" value="Submit Coordinates" />
  </form>
  */
  // const formPrep = document.getElementById('form-insert-ships');
  const inputInsertCoordinates = document.getElementById('insert-coordinates');
  const spanInsertError = document.getElementById('span-insert-error');

  setPrepHeader(game);
  setInputListener(inputInsertCoordinates, spanInsertError);
  setPrepSubmitBtnListener(game);
}

const startBattlePhase = (game) => {
  const inputCoord = document.getElementById('coord');
  const spanError = document.getElementById('span-coord-error');
  
  setInputListener(inputCoord, spanError);
  setBattleSubmitBtnListener(game);
  /*
  <form id="form-atk-coords" class="hide">
    <label for="coord"></label>
    <input type="text" id="coord" placeholder="ex: A4" />
    <input type="submit" id="submit" value="Submit Coordinates" />
  </form>
  */
  // We need to unhide the form-atk-coords form.
  // Need to set the data-turn on coord input to current player
  // Need to add listener on submit to check for correct/valid input on coord input and then submits player turn on game.
}

const setBattleSubmitBtnListener = (game) => {
  const currentPlayer = game.getCurrentPlayer();
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

      game.turn(coordinate);
      game.swapTurns();
    } else {
      displayAtkErrorMessage(coordinate);
    }
  });
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
  const playerOne = game._players[1];
  const divInsert = document.getElementById('div-insert');
  
  divInsert.innerHTML = `${playerOne.name}, choose where to place your cruiser (Length: 3 Places):`;
}

const setPrepSubmitBtnListener = (game) => {
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
              // Set div Insert to cruiser
              divInsert.setAttribute('data-ship', 'cruiser');
              divInsert.innerHTML = `${currentPlayer.name}, choose where to place your cruiser (Length: 3 places):`;
              input.value = null;
            }, 2500);
          } else {
            displayGameBoard(2, game._players['2'].board._board);

            setTimeout(() => {
              hideGameBoard(2);
              gameMessage.innerHTML = 'Battle Phase';
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
      } else {
        spans[j + 1].innerHTML = 'S';
      }
    }
  }

  board.classList.remove('hide');
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsZUFBZTtBQUMxQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxtQkFBbUI7QUFDdEQ7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxtQkFBbUI7QUFDdEQ7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLG1CQUFtQjtBQUMxRDtBQUNBLGFBQWE7QUFDYixZQUFZO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0EsaUVBQWlFLGFBQWE7QUFDOUUsMkVBQTJFLGFBQWE7O0FBRXhGLGtCQUFrQix3QkFBd0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixxQkFBcUI7QUFDekM7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMkVBQTJFLGFBQWE7O0FBRXhGLGtCQUFrQixRQUFRO0FBQzFCO0FBQ0E7O0FBRUEsb0JBQW9CLFFBQVE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0NBQWtDO0FBQzFELEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC8uL3NyYy9qcy9zaGlwLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2FtZWJvYXJkRm5zID0gcmVxdWlyZSgnLi9nYW1lYm9hcmQuanMnKTtcbmNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAuanMnKTtcblxuLy8gRm9yIEdhbWUgdG8gUnVuLlxuLy8gSGFzIHBsYXllcnNfb2JqZWN0IHdoaWNoIGhvbGRzIHR3byBwbGF5ZXIgb2JqZWN0cywgZm9yIHRoZSBnYW1lXG4vLyBIYXMgY3VycmVudFR1cm4gd2hpY2gga2VlcHMgdHJhY2sgb2Ygd2hvc2UgdHVybiBpdCBpcy5cblxuLy8gSFRNTCBoYXMgaW5wdXQgZm9yIGNob29zaW5nIGNvb3JkaW5hdGVzIHRvIHN0cmlrZSBvbiBib2FyZC5cbi8vIE9uY2UgdXNlciBoYXMgaW5wdXR0ZWQgdmFsaWQgY29vcmRpbmF0ZXMsIHJ1biB0dXJuIGZ1bmN0aW9uLlxuLy8gZnVuY3Rpb24gJ3R1cm4nIHdoaWNoIHdpbGwgcnVuIHRocm91Z2ggYSB0dXJuLlxuICAvLyBDb29yZGluYXRlcyB3aWxsIGJlIHNldCB0byBnYW1lYm9hcmQsIHRvIGNoZWNrIGlmIHRoZXJlIGlzIGEgaGl0IG9uIHRoZSBvcHBvbmVudHMgYm9hcmQuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBoaXQsIHdlIHdhbnQgdG8gc2lnbmlmeSB0aGVyZSBpcyBhIGhpdFxuICAgICAgLy8gV2Ugd2FudCB0byBjaGVjayBpZiBhIHNoaXAgaGFzIGZhbGxlblxuICAgICAgLy8gV2Ugd2FudCB0byBjaGVjayBpZiBhbGwgc2hpcHMgaGF2ZSBmYWxsZW5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIG1pc3MsIHdlIHdhbnQgdG8gc2lnbmlmeSB0aGF0IGl0IGlzIGEgbWlzc1xuICAgICAgLy8gV2Ugd2FudCB0byBhZGQgdG8gdGhlIG1pc3MgYXJyYXlcbiAgICAvLyBDaGFuZ2UgdGhlIGN1cnJlbnRUdXJuIHRvIHRoZSBvcHBvbmVudHMgdHVyblxuICAgIC8vIFVwZGF0ZSB0aGUgSFRNTCBEb20gdG8gc2lnbmlmeSB0aGF0IGl0IGlzIHRoZSBvcHBvbmVudHMgdHVyblxuY29uc3QgR2FtZSA9ICgpID0+IHtcbiAgY29uc3QgX3BsYXllcnMgPSB7fTtcbiAgbGV0IF9jdXJyZW50VHVybiA9IDE7XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGxheWVyKHBsYXllck5hbWUpIHtcbiAgICBjb25zdCBwbGF5ZXJOdW1iZXIgPSBfcGxheWVyc1sxXSA/IDIgOiAxO1xuXG4gICAgX3BsYXllcnNbcGxheWVyTnVtYmVyXSA9IHtcbiAgICAgIG5hbWU6IHBsYXllck5hbWUsXG4gICAgICBib2FyZDogZ2FtZWJvYXJkRm5zLkdhbWVib2FyZCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIF9wbGF5ZXJzW3BsYXllck51bWJlcl07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDdXJyZW50UGxheWVyKCkge1xuICAgIHJldHVybiBfY3VycmVudFR1cm47XG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZGF0ZUNvb3JkaW5hdGUoY29vcmQpIHtcbiAgICAvLyBWYWxpZGF0ZUNvb3JkaW5hdGUgd2lsbCBjaGVjayB0byBtYWtlIHN1cmUgdGhlIGNvb3JkaW5hdGVzIGFyZSBpbiB0aGUgcmFuZ2UgMCBhbmQgOS5cbiAgICBpZiAoY29vcmRbMF0gPCAwIHx8IGNvb3JkWzBdID4gOSB8fCBjb29yZFsxXSA8IDAgfHwgY29vcmRbMV0gPiA5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBjdXJyZW50UGxheWVycyBib2FyZCBkb2VzIG5vdCBoYXZlIHRoYXQgYXMgYSBNaXNzZWQgY29vcmRpbmF0ZSBvciBoaXQgY29vcmRpbmF0ZS5cbiAgICBjb25zdCBvcHBvbmVudEdhbWVib2FyZCA9IF9jdXJyZW50VHVybiA9PT0gMSA/IF9wbGF5ZXJzWzJdLmJvYXJkIDogX3BsYXllcnNbMV0uYm9hcmQ7XG4gICAgLy8gSWYgb3Bwb25lbnQgYm9hcmQgaGFzIGR1cGxpY2F0ZXMsIHJldHVybiBmYWxzZS5cbiAgICBpZiAob3Bwb25lbnRHYW1lYm9hcmQuY2hlY2tGb3JEdXBsaWNhdGVzKGNvb3JkKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrSW5zZXJ0UGFyYW1ldGVycyhzaGlwTGVuZ3RoLCBzdGFydCwgZW5kKSB7XG4gICAgbGV0IGR4O1xuICAgIGxldCBkeTtcbiAgICBpZiAoTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICE9PSAwKSB7XG4gICAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSArIDE7XG4gICAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKVxuICAgIH0gZWxzZSB7XG4gICAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKVxuICAgICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSkgKyAxO1xuICAgIH1cbiAgXG4gICAgLy8gSWYgZHggYW5kIGR5IGFyZW4ndCB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBpbmNvcnJlY3QuXG4gICAgLy8gVGhpcyBpcyBqdXN0IGZvciBtYW51YWxseSBpbnB1dHRpbmcgY29vcmRpbmF0ZXMgYW5kIG5vdCBmb3IgZnV0dXJlLlxuICAgIGlmIChkeCAhPT0gc2hpcExlbmd0aCAmJiBkeSAhPT0gc2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIElmIHRoZSBob3Jpem9udGFsIGlzIGNvcnJlY3QsIHRoZW4gZHkgbXVzdCBiZSAwIGJlY2F1c2UgdGhlcmUgaXMgbm8gZGlhZ29uYWwgc2hpcCBwbGFjZW1lbnRcbiAgICB9IGVsc2UgaWYgKGR4ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gKGR5ID09PSAwKSA/IHRydWUgOiBmYWxzZTtcbiAgICAvLyBJZiB0aGUgdmVydGljYWwgZGlmZmVyZW5jZSBpcyB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGhvcml6b250YWwgZGlmZmVyZW5jZSBzaG91bGQgYmUgMC5cbiAgICB9IGVsc2UgaWYgKGR5ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gKGR4ID09PSAwKSA/IHRydWUgOiBmYWxzZTsgXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdHVybihjb29yZCkge1xuICAgIGNvbnN0IG9wcG9uZW50R2FtZWJvYXJkID0gX2N1cnJlbnRUdXJuID09PSAxID8gX3BsYXllcnNbMl0uYm9hcmQgOiBfcGxheWVyc1sxXS5ib2FyZDtcbiAgICBjb25zdCBhdGsgPSBvcHBvbmVudEdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkKTtcbiAgICByZXR1cm4gYXRrO1xuICB9XG5cbiAgZnVuY3Rpb24gc3dhcFR1cm5zKCkge1xuICAgIF9jdXJyZW50VHVybiA9IF9jdXJyZW50VHVybiA9PT0gMSA/IDIgOiAxO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBfcGxheWVycyxcbiAgICBjcmVhdGVQbGF5ZXIsXG4gICAgZ2V0Q3VycmVudFBsYXllcixcbiAgICB2YWxpZGF0ZUNvb3JkaW5hdGUsXG4gICAgY2hlY2tJbnNlcnRQYXJhbWV0ZXJzLFxuICAgIHR1cm4sXG4gICAgc3dhcFR1cm5zXG4gIH07XG59XG5cbi8qXG4vLyBDYXJyaWVyIChvY2N1cGllcyA1IHNwYWNlcyksIEJhdHRsZXNoaXAgKDQpLCBDcnVpc2VyICgzKSwgU3VibWFyaW5lICgzKSwgYW5kIERlc3Ryb3llciAoMikuXG5jb25zdCBjcmVhdGVSYW5kb21Cb2FyZCA9ICgpID0+IHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZWJvYXJkRm5zLkdhbWVib2FyZCgpO1xuICBjb25zdCBzaGlwQXJyYXkgPSBbU2hpcCgnRGVzdHJveWVyJywgMildO1xuXG4gIC8vIFJhbmRvbWx5IGFkZCBzaGlwcyB0byBnYW1lYm9hcmQuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc2hpcCA9IHNoaXBBcnJheVtpXTtcbiAgICAvLyBHZW5lcmF0ZSByYW5kb20gc3RhcnRpbmcgcG9zaXRpb24gaW4gYmV0d2VlbiAxIGFuZCAxMS5cbiAgICBsZXQgcmFuZG9tU3RhcnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMTEgLSAxICsgMSkgKyAxKTtcblxuICAgIC8vIEdlbmVyYXRlIHdoZXRoZXIgaW50ZWdlciB3aWxsIGJlIHggb3IgeS5cbiAgICBjb25zdCByYW5kb21EaXJlY3Rpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMiAtIDEgKyAxKSArIDEpO1xuICAgIGNvbnNvbGUubG9nKHJhbmRvbURpcmVjdGlvbik7XG4gICAgbGV0IHNoaXBTdGFydCA9IHJhbmRvbURpcmVjdGlvbiA9PT0gMSA/IFtyYW5kb21TdGFydCwgMF0gOiBbMCwgcmFuZG9tU3RhcnRdO1xuICAgIGNvbnNvbGUubG9nKHNoaXBTdGFydCk7XG4gIH1cbn1cbiovXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7IiwiY29uc3QgR2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBfYm9hcmQgPSBBcnJheS5mcm9tKHtsZW5ndGg6IDEwfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwoJycpKTtcbiAgY29uc3QgX3NoaXBzID0ge307XG4gIGNvbnN0IF9taXNzZWRBdHRhY2tzID0gW107XG5cbiAgLy8gdmFsaWRhdGVJbnNlcnQgZnVuY3Rpb25cbiAgLy8gR2l2ZW4gYSBzdGFydCBhbmQgZW5kIHBhcmFtZXRlclxuICAvLyBHb2luZyBmcm9tIHRoZSBzdGFydCB0byB0aGUgZW5kIG1hcmtlclxuICBmdW5jdGlvbiB2YWxpZGF0ZUluc2VydChzdGFydCwgZW5kKSB7XG4gICAgY29uc3QgZHggPSBzdGFydFswXSAtIGVuZFswXTtcbiAgICBjb25zdCBkeSA9IHN0YXJ0WzFdIC0gZW5kWzFdO1xuICAgIGxldCBtYXJrZXIgPSBzdGFydDtcbiAgICBpZiAoZHgpIHtcbiAgICAgIHdoaWxlIChtYXJrZXJbMF0gIT09IGVuZFswXSkge1xuICAgICAgICBpZiAoX2JvYXJkW21hcmtlclsxXV1bbWFya2VyWzBdXSAhPT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR4IDwgMCkge1xuICAgICAgICAgIG1hcmtlciA9IFttYXJrZXJbMF0gKyAxLCBzdGFydFsxXV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFya2VyID0gW21hcmtlclswXSAtIDEsIHN0YXJ0WzFdXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAobWFya2VyWzFdICE9PSBlbmRbMV0pIHtcbiAgICAgICAgaWYgKF9ib2FyZFttYXJrZXJbMV1dW21hcmtlclswXV0gIT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSA8IDApIHtcbiAgICAgICAgICBtYXJrZXIgPSBbc3RhcnRbMF0sIG1hcmtlclsxXSArIDFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcmtlciA9IFtzdGFydFswXSwgbWFya2VyWzFdIC0gMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnQoc2hpcE9iaiwgc3RhcnQsIGVuZCkge1xuICAgIGxldCBzaGlwTGVuZ3RoID0gc2hpcE9iai5zaGlwTGVuZ3RoO1xuICAgIF9zaGlwc1tzaGlwT2JqLm5hbWVdID0gc2hpcE9iajtcbiAgICBsZXQgZHggPSBzdGFydFswXSAtIGVuZFswXTtcbiAgICBsZXQgZHkgPSBzdGFydFsxXSAtIGVuZFsxXTtcbiAgICBpZiAoZHgpIHtcbiAgICAgIGR4ID0gTWF0aC5hYnMoZHgpICsgMTtcbiAgICAgIGxldCB4TWFya2VyID0gc3RhcnRbMF07XG4gICAgICB3aGlsZSAoZHgpIHtcbiAgICAgICAgaWYgKHN0YXJ0WzBdID4gZW5kWzBdKSB7XG4gICAgICAgICAgX2JvYXJkW3N0YXJ0WzFdXVt4TWFya2VyXSA9IHNoaXBPYmoubmFtZTtcbiAgICAgICAgICB4TWFya2VyIC09IDE7XG4gICAgICAgICAgZHggLT0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfYm9hcmRbc3RhcnRbMV1dW3hNYXJrZXJdID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgIHhNYXJrZXIgKz0gMVxuICAgICAgICAgIGR4IC09IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZHkgPSBNYXRoLmFicyhkeSkgKyAxO1xuICAgICAgbGV0IHlNYXJrZXIgPSBzdGFydFsxXTtcbiAgICAgIHdoaWxlIChkeSkge1xuICAgICAgICBpZiAoc3RhcnRbMV0gPiBlbmRbMV0pIHtcbiAgICAgICAgICBfYm9hcmRbeU1hcmtlcl1bc3RhcnRbMF1dID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgIHlNYXJrZXIgLT0gMTtcbiAgICAgICAgICBkeSAtPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9ib2FyZFt5TWFya2VyXVtzdGFydFswXV0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgeU1hcmtlciArPSAxO1xuICAgICAgICAgIGR5IC09IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9ib2FyZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soY29vcmQpIHtcbiAgICBjb25zdCBib2FyZGxvY2F0aW9uID0gX2JvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV07XG4gICAgaWYgKGJvYXJkbG9jYXRpb24gIT09ICcnKSB7XG4gICAgICBjb25zdCBzaGlwID0gX3NoaXBzW2JvYXJkbG9jYXRpb25dO1xuICAgICAgc2hpcC5oaXQoKTtcblxuICAgICAgaWYgKHNoaXAuaXNTdW5rKCkpIHtcbiAgICAgICAgcmV0dXJuIGAke3NoaXAubmFtZX0gc3VuayFgO1xuICAgICAgfVxuICAgICAgX2JvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0gPSAnSCc7XG4gICAgICByZXR1cm4gJ2hpdCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9taXNzZWRBdHRhY2tzLnB1c2goY29vcmQpO1xuICAgICAgX2JvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0gPSAnTSc7XG4gICAgICByZXR1cm4gY29vcmQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tGb3JEdXBsaWNhdGVzKGNvb3JkKSB7XG4gICAgY29uc3QgZHVwZXMgPSBfbWlzc2VkQXR0YWNrcy5maWx0ZXIoKGVsZSkgPT4ge1xuICAgICAgcmV0dXJuIGVsZVswXSA9PT0gY29vcmRbMF0gJiYgZWxlWzFdID09PSBjb29yZFsxXTtcbiAgICB9KTtcbiAgICByZXR1cm4gZHVwZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgZm9yIChjb25zdCBzaGlwTmFtZSBpbiBfc2hpcHMpIHtcbiAgICAgIGNvbnN0IHNoaXAgPSBfc2hpcHNbc2hpcE5hbWVdO1xuICAgICAgaWYgKHNoaXAuaXNTdW5rKCkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIF9ib2FyZCxcbiAgICBfc2hpcHMsXG4gICAgX21pc3NlZEF0dGFja3MsXG4gICAgdmFsaWRhdGVJbnNlcnQsXG4gICAgaW5zZXJ0LFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgY2hlY2tGb3JEdXBsaWNhdGVzLFxuICAgIGdhbWVPdmVyXG4gIH1cbn1cblxuLypcbmNvbnN0IGNoZWNrSW5zZXJ0UGFyYW1ldGVycyA9KHNoaXBMZW5ndGgsIHN0YXJ0LCBlbmQpID0+IHtcbiAgbGV0IGR4O1xuICBsZXQgZHk7XG4gIGlmIChNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgIT09IDApIHtcbiAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSArIDE7XG4gICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSlcbiAgfSBlbHNlIHtcbiAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKVxuICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pICsgMTtcbiAgfVxuXG4gIC8vIElmIGR4IGFuZCBkeSBhcmVuJ3QgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBjb29yZGluYXRlcyBnaXZlbiBhcmUgaW5jb3JyZWN0LlxuICAvLyBUaGlzIGlzIGp1c3QgZm9yIG1hbnVhbGx5IGlucHV0dGluZyBjb29yZGluYXRlcyBhbmQgbm90IGZvciBmdXR1cmUuXG4gIGlmIChkeCAhPT0gc2hpcExlbmd0aCAmJiBkeSAhPT0gc2hpcExlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gSWYgdGhlIGhvcml6b250YWwgaXMgY29ycmVjdCwgdGhlbiBkeSBtdXN0IGJlIDAgYmVjYXVzZSB0aGVyZSBpcyBubyBkaWFnb25hbCBzaGlwIHBsYWNlbWVudFxuICB9IGVsc2UgaWYgKGR4ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgcmV0dXJuIChkeSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XG4gIC8vIElmIHRoZSB2ZXJ0aWNhbCBkaWZmZXJlbmNlIGlzIHRoZSBzaGlwIGxlbmd0aCwgdGhlbiB0aGUgaG9yaXpvbnRhbCBkaWZmZXJlbmNlIHNob3VsZCBiZSAwLlxuICB9IGVsc2UgaWYgKGR5ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgcmV0dXJuIChkeCA9PT0gMCkgPyB0cnVlIDogZmFsc2U7IFxuICB9XG59XG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgR2FtZWJvYXJkXG59OyIsIi8qXG5SRU1FTUJFUiB5b3Ugb25seSBoYXZlIHRvIHRlc3QgeW91ciBvYmplY3TigJlzIHB1YmxpYyBpbnRlcmZhY2UuXG5Pbmx5IG1ldGhvZHMgb3IgcHJvcGVydGllcyB0aGF0IGFyZSB1c2VkIG91dHNpZGUgb2YgeW91ciDigJhzaGlw4oCZIG9iamVjdCBuZWVkIHVuaXQgdGVzdHMuXG4qL1xuXG4vLyBTaGlwcyBzaG91bGQgaGF2ZSBhIGhpdCgpIGZ1bmN0aW9uIHRoYXQgaW5jcmVhc2VzIHRoZSBudW1iZXIgb2Yg4oCYaGl0c+KAmSBpbiB5b3VyIHNoaXAuXG5cbi8vIGlzU3VuaygpIHNob3VsZCBiZSBhIGZ1bmN0aW9uIHRoYXQgY2FsY3VsYXRlcyBpdCBiYXNlZCBvbiB0aGVpciBsZW5ndGggXG4vLyBhbmQgdGhlIG51bWJlciBvZiDigJhoaXRz4oCZLlxuY29uc3QgU2hpcCA9IChuYW1lLCBoaXRwb2ludHMpID0+IHtcbiAgbGV0IF9oaXRwb2ludHMgPSBoaXRwb2ludHM7XG4gIGNvbnN0IHNoaXBMZW5ndGggPSBoaXRwb2ludHM7XG4gIGxldCBfc3VuayA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGhpdCgpIHtcbiAgICBfaGl0cG9pbnRzIC09IDE7XG5cbiAgICBpZiAoIV9oaXRwb2ludHMpIHtcbiAgICAgIF9zdW5rID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gX2hpdHBvaW50cztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3VuaygpIHtcbiAgICByZXR1cm4gX3N1bms7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWUsXG4gICAgc2hpcExlbmd0aCxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKTtcbmNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgLy8gSW5pdGlhbGl6ZSBHYW1lIE9iamVjdFxuICBjb25zdCBnYW1lID0gR2FtZSgpO1xuXG4gIC8vIENyZWF0ZSBUd28gUGxheWVycyBBbmQgRGlzcGxheSB0aGVpciBib2FyZHNcbiAgZ2FtZS5jcmVhdGVQbGF5ZXIoJ0p1c3RpbicpO1xuICBnYW1lLmNyZWF0ZVBsYXllcignSmVmZicpO1xuICBkaXNwbGF5R2FtZUJvYXJkKDEsIGdhbWUuX3BsYXllcnNbJzEnXS5ib2FyZC5fYm9hcmQpO1xuICBkaXNwbGF5R2FtZUJvYXJkKDIsIGdhbWUuX3BsYXllcnNbJzInXS5ib2FyZC5fYm9hcmQpO1xuICAvLyBQcmVwIFBoYXNlXG4gIC8vIFNldCBQbGF5ZXIgMSBCb2FyZFxuICAgIC8vIEFzayBwbGF5ZXIgZm9yIGlucHV0IGNvb3JkaW5hdGVzIGZvciAzIHNoaXBzXG4gIC8vIFNldCBQbGF5ZXIgMiBCb2FyZFxuICAgIC8vIEFzayBwbGF5ZXIgZm9yIGlucHV0IGNvb3JkaW5hdGVzIGZvciAzIHNoaXBzXG4gIHN0YXJ0UHJlcFBoYXNlKGdhbWUpO1xuICAvLyBCYXR0bGUgUGhhc2VcbiAgICAvLyBBc2sgUGxheWVyIDEgZm9yIGNvb3JkaW5hdGVzIHRvIGhpdFxuICAgIC8vIEFzayBQbGF5ZXIgMiBmb3IgY29vcmRpbmF0ZXMgdG8gaGl0XG4gIHN0YXJ0QmF0dGxlUGhhc2UoZ2FtZSk7XG59KTtcblxuY29uc3Qgc3RhcnRQcmVwUGhhc2UgPSAoZ2FtZSkgPT4ge1xuICAvKlxuICA8Zm9ybSBpZD1cImZvcm0taW5zZXJ0LXNoaXBzXCI+XG4gICAgPGRpdiBpZD1cImRpdi1pbnNlcnRcIiBkYXRhLXNoaXA9XCJjcnVpc2VyXCI+UGxheWVyIDEsIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGNydWlzZXIgKExlbmd0aDogMyBwbGFjZXMpOjwvZGl2PlxuICAgIDxsYWJlbD5Db29yZGluYXRlczo8L2xhYmVsPlxuICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiaW5zZXJ0LWNvb3JkaW5hdGVzXCIgbWlubGVuZ3RoPVwiNVwiIG1heGxlbmd0aD1cIjdcIiBwYXR0ZXJuPVwiXltBLVpdKFsxLTldfDEwKVxcc1tBLVpdKFsxLTldfDEwKSRcIiBwbGFjZWhvbGRlcj1cImV4OiBBNCBBNiwgQjMgQjZcIiByZXF1aXJlZC8+XG4gICAgPHNwYW4gaWQ9XCJzcGFuLWluc2VydC1lcnJvclwiIGNsYXNzPVwic3Bhbi1pbnB1dC1lcnJvciBoaWRlXCI+PC9zcGFuPlxuICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgaWQ9XCJpbnNlcnQtc3VibWl0XCIgdmFsdWU9XCJTdWJtaXQgQ29vcmRpbmF0ZXNcIiAvPlxuICA8L2Zvcm0+XG4gICovXG4gIC8vIGNvbnN0IGZvcm1QcmVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0taW5zZXJ0LXNoaXBzJyk7XG4gIGNvbnN0IGlucHV0SW5zZXJ0Q29vcmRpbmF0ZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zZXJ0LWNvb3JkaW5hdGVzJyk7XG4gIGNvbnN0IHNwYW5JbnNlcnRFcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFuLWluc2VydC1lcnJvcicpO1xuXG4gIHNldFByZXBIZWFkZXIoZ2FtZSk7XG4gIHNldElucHV0TGlzdGVuZXIoaW5wdXRJbnNlcnRDb29yZGluYXRlcywgc3Bhbkluc2VydEVycm9yKTtcbiAgc2V0UHJlcFN1Ym1pdEJ0bkxpc3RlbmVyKGdhbWUpO1xufVxuXG5jb25zdCBzdGFydEJhdHRsZVBoYXNlID0gKGdhbWUpID0+IHtcbiAgY29uc3QgaW5wdXRDb29yZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29yZCcpO1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1jb29yZC1lcnJvcicpO1xuICBcbiAgc2V0SW5wdXRMaXN0ZW5lcihpbnB1dENvb3JkLCBzcGFuRXJyb3IpO1xuICBzZXRCYXR0bGVTdWJtaXRCdG5MaXN0ZW5lcihnYW1lKTtcbiAgLypcbiAgPGZvcm0gaWQ9XCJmb3JtLWF0ay1jb29yZHNcIiBjbGFzcz1cImhpZGVcIj5cbiAgICA8bGFiZWwgZm9yPVwiY29vcmRcIj48L2xhYmVsPlxuICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiY29vcmRcIiBwbGFjZWhvbGRlcj1cImV4OiBBNFwiIC8+XG4gICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiBpZD1cInN1Ym1pdFwiIHZhbHVlPVwiU3VibWl0IENvb3JkaW5hdGVzXCIgLz5cbiAgPC9mb3JtPlxuICAqL1xuICAvLyBXZSBuZWVkIHRvIHVuaGlkZSB0aGUgZm9ybS1hdGstY29vcmRzIGZvcm0uXG4gIC8vIE5lZWQgdG8gc2V0IHRoZSBkYXRhLXR1cm4gb24gY29vcmQgaW5wdXQgdG8gY3VycmVudCBwbGF5ZXJcbiAgLy8gTmVlZCB0byBhZGQgbGlzdGVuZXIgb24gc3VibWl0IHRvIGNoZWNrIGZvciBjb3JyZWN0L3ZhbGlkIGlucHV0IG9uIGNvb3JkIGlucHV0IGFuZCB0aGVuIHN1Ym1pdHMgcGxheWVyIHR1cm4gb24gZ2FtZS5cbn1cblxuY29uc3Qgc2V0QmF0dGxlU3VibWl0QnRuTGlzdGVuZXIgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBjdXJyZW50UGxheWVyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XG4gIGNvbnN0IGlucHV0Q29vcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29vcmQnKTtcbiAgY29uc3QgaW5wdXRTdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXRrLXN1Ym1pdCcpO1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1jb29yZC1lcnJvcicpO1xuXG4gIGlucHV0U3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgY29vcmRpbmF0ZSA9IHRyYW5zZm9ybUlucHV0VG9Db29yZChpbnB1dENvb3JkLnZhbHVlKTtcbiAgICAvLyBHaXZlbiBhbiBpbnB1dCwgd2UgbmVlZCB0byB2YWxpZGF0ZSB0aGF0IGl0IGlzIGEgdmFsaWQgY29vcmRpbmF0ZS5cbiAgICBpZiAoZ2FtZS52YWxpZGF0ZUNvb3JkaW5hdGUoY29vcmRpbmF0ZSkpIHtcbiAgICAgIGlmICghc3BhbkVycm9yLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpKSB7XG4gICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICB9XG5cbiAgICAgIGdhbWUudHVybihjb29yZGluYXRlKTtcbiAgICAgIGdhbWUuc3dhcFR1cm5zKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BsYXlBdGtFcnJvck1lc3NhZ2UoY29vcmRpbmF0ZSk7XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgZGlzcGxheUF0a0Vycm9yTWVzc2FnZSA9IChjb29yZCkgPT4ge1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1jb29yZC1lcnJvcicpO1xuXG4gIGlmIChjb29yZFswXSA8IDAgfHwgY29vcmRbMF0gPiAxMCB8fCBjb29yZFsxXSA8IDAgfHwgY29vcmRbMV0gPiAxMCkge1xuICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnSW5wdXQgaXMgb3V0IG9mIHJhbmdlLiBUcnkgYWdhaW4uJztcbiAgfSBlbHNlIHtcbiAgICBzcGFuRXJyb3IuaW5uZXJIVE1MID0gJ0lucHV0IGhhcyBiZWVuIGNob3NlbiBhbHJlYWR5LiBUcnkgYWdhaW4uJztcbiAgfVxuICBzcGFuRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xufVxuXG5jb25zdCBzZXRQcmVwSGVhZGVyID0gKGdhbWUpID0+IHtcbiAgY29uc3QgcGxheWVyT25lID0gZ2FtZS5fcGxheWVyc1sxXTtcbiAgY29uc3QgZGl2SW5zZXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1pbnNlcnQnKTtcbiAgXG4gIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGNydWlzZXIgKExlbmd0aDogMyBQbGFjZXMpOmA7XG59XG5cbmNvbnN0IHNldFByZXBTdWJtaXRCdG5MaXN0ZW5lciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCBmb3JtSW5zZXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0taW5zZXJ0LXNoaXBzJyk7XG4gIGNvbnN0IGZvcm1CYXR0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1hdGstY29vcmRzJyk7XG4gIGNvbnN0IGRpdkluc2VydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtaW5zZXJ0Jyk7XG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1jb29yZGluYXRlcycpO1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1pbnNlcnQtZXJyb3InKTtcbiAgY29uc3Qgc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1zdWJtaXQnKTtcblxuICBsZXQgY3VycmVudFBsYXllciA9IGdhbWUuX3BsYXllcnNbMV07XG4gIHN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGN1cnJlbnRTaGlwID0gZGl2SW5zZXJ0LmdldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJyk7XG4gICAgY29uc3QgY29vcmRpbmF0ZXNBcnJheSA9IGlucHV0LnZhbHVlLnNwbGl0KCcgJyk7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBbdHJhbnNmb3JtSW5wdXRUb0Nvb3JkKGNvb3JkaW5hdGVzQXJyYXlbMF0pLCB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQoY29vcmRpbmF0ZXNBcnJheVsxXSldO1xuICAgIFxuICAgIGlmIChjdXJyZW50U2hpcCA9PT0gJ2NydWlzZXInKSB7XG4gICAgICAvLyBUaGUgdHdvIGNvb3JkaW5hdGVzIG1hdGNoIHRoZSBsZW5ndGggb2YgdGhlIHNoaXBcbiAgICAgIGlmIChnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycygzLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIC8vIENoZWNrIHRoYXQgdHdvIGNvb3JkaW5hdGVzIGRvbid0IGludGVyZmVyZSB3aXRoIG90aGVyIHNoaXBzIG9uIHRoZSBwbGF5ZXJzIGJvYXJkLlxuICAgICAgICBpZiAoY3VycmVudFBsYXllci5ib2FyZC52YWxpZGF0ZUluc2VydChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0NydWlzZXInLCAzKTtcbiAgICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdiYXR0bGVzaGlwJyk7XG4gICAgICAgICAgZGl2SW5zZXJ0LmlubmVySFRNTCA9IGAke2N1cnJlbnRQbGF5ZXIubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGJhdHRsZXNoaXAgKExlbmd0aDogNSBwbGFjZXMpOmA7XG4gICAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IGdhbWUuX3BsYXllcnNbMV0pIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IERpZmZlcmVudCBTaGlwIHBsYWNlZCBhdCBjb29yZGluYXRlcy4gVXNlIGRpZmZlcmVudCBjb29yZGluYXRlcy4nO1xuICAgICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IENvb3JkaW5hdGVzIHJhbmdlIGRvZXMgbm90IG1hdGNoIHNoaXAgbGVuZ3RoLic7XG4gICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjdXJyZW50U2hpcCA9PT0gJ2JhdHRsZXNoaXAnKSB7XG4gICAgICBpZiAoZ2FtZS5jaGVja0luc2VydFBhcmFtZXRlcnMoNSwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICBpZiAoY3VycmVudFBsYXllci5ib2FyZC52YWxpZGF0ZUluc2VydChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0JhdHRsZXNoaXAnLCA1KTtcbiAgICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdkZXN0cm95ZXInKTtcbiAgICAgICAgICBkaXZJbnNlcnQuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSwgY2hvb3NlIHdoZXJlIHRvIHBsYWNlIHlvdXIgZGVzdG95ZXIgKExlbmd0aDogMiBwbGFjZXMpOmA7XG4gICAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IGdhbWUuX3BsYXllcnNbMV0pIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IERpZmZlcmVudCBTaGlwIHBsYWNlZCBhdCBjb29yZGluYXRlcy4gVXNlIGRpZmZlcmVudCBjb29yZGluYXRlcy4nO1xuICAgICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IENvb3JkaW5hdGVzIHJhbmdlIGRvZXMgbm90IG1hdGNoIHNoaXAgbGVuZ3RoLic7XG4gICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjdXJyZW50U2hpcCA9PT0gJ2Rlc3Ryb3llcicpIHtcbiAgICAgIGlmIChnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycygyLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIGlmIChjdXJyZW50UGxheWVyLmJvYXJkLnZhbGlkYXRlSW5zZXJ0KGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgICBjb25zdCBzaGlwID0gU2hpcCgnRGVzdHJveWVyJywgMik7XG4gICAgICAgICAgY3VycmVudFBsYXllci5ib2FyZC5pbnNlcnQoc2hpcCwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKTtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PT0gZ2FtZS5fcGxheWVyc1sxXSkge1xuICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgICAgICAgICAgICAvLyBBZnRlciA1IHNlY29uZHNcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBIaWRlIFBsYXllciAxIGJvYXJkXG4gICAgICAgICAgICAgIGhpZGVHYW1lQm9hcmQoMSk7XG4gICAgICAgICAgICAgIC8vIENoYW5nZWQgY3VycmVudFBsYXllciB2YXJpYWJsZSB0byBQbGF5ZXIgMlxuICAgICAgICAgICAgICBjdXJyZW50UGxheWVyID0gZ2FtZS5fcGxheWVyc1syXTtcbiAgICAgICAgICAgICAgLy8gU2V0IGRpdiBJbnNlcnQgdG8gY3J1aXNlclxuICAgICAgICAgICAgICBkaXZJbnNlcnQuc2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnLCAnY3J1aXNlcicpO1xuICAgICAgICAgICAgICBkaXZJbnNlcnQuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSwgY2hvb3NlIHdoZXJlIHRvIHBsYWNlIHlvdXIgY3J1aXNlciAoTGVuZ3RoOiAzIHBsYWNlcyk6YDtcbiAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgfSwgMjUwMCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBoaWRlR2FtZUJvYXJkKDIpO1xuICAgICAgICAgICAgICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSAnQmF0dGxlIFBoYXNlJztcbiAgICAgICAgICAgICAgZm9ybUluc2VydC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgICAgICAgIGZvcm1CYXR0bGUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgICBzZXRCYXR0bGVIZWFkZXIoZ2FtZSk7XG4gICAgICAgICAgICB9LCAyNTAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogRGlmZmVyZW50IFNoaXAgcGxhY2VkIGF0IGNvb3JkaW5hdGVzLiBVc2UgZGlmZmVyZW50IGNvb3JkaW5hdGVzLic7XG4gICAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogQ29vcmRpbmF0ZXMgcmFuZ2UgZG9lcyBub3QgbWF0Y2ggc2hpcCBsZW5ndGguJztcbiAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5jb25zdCBzZXRJbnB1dExpc3RlbmVyID0gKGlucHV0LCBzcGFuKSA9PiB7XG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIGlmICghaW5wdXQudmFsaWRpdHkudmFsaWQpIHtcbiAgICAgIGRpc3BsYXlJbnB1dEVycm9yKGlucHV0KTtcbiAgICAgIHNwYW4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXNwYW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykpIHtcbiAgICAgICAgc3Bhbi5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgZGlzcGxheUlucHV0RXJyb3IgPSAoaW5wdXQpID0+IHtcbiAgY29uc3QgcGFyZW50RWxlbWVudCA9IGlucHV0LnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IHNwYW5FcnJvckVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LmNoaWxkcmVuWzNdO1xuICBpZiAoaW5wdXQudmFsaWRpdHkudmFsdWVNaXNzaW5nKSB7XG4gICAgc3BhbkVycm9yRWxlbWVudC5pbm5lckhUTUwgPSAnRXJyb3I6IElucHV0IGlzIHJlcXVpcmVkLic7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgfSBlbHNlIGlmIChpbnB1dC52YWxpZGl0eS50b29Mb25nKSB7XG4gICAgc3BhbkVycm9yRWxlbWVudC5pbm5lckhUTUwgPSAnRXJyb3I6IElucHV0IGlzIHRvbyBsb25nLic7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgfSBlbHNlIGlmIChpbnB1dC52YWxpZGl0eS5wYXR0ZXJuTWlzbWF0Y2gpIHtcbiAgICBzcGFuRXJyb3JFbGVtZW50LmlubmVySFRNTCA9IChpbnB1dC5pZCA9PT0gJ2luc2VydC1jb29yZGluYXRlcycpXG4gICAgICA/ICdFcnJvcjogSW5wdXQgZG9lcyBub3QgbWF0Y2ggcGF0dGVybi4gZXg6IFwiQTQgQTZcIi4nXG4gICAgICA6ICdFcnJvcjogSW5wdXQgZG9lcyBub3QgbWF0Y2ggcGF0dGVybi4gZXg6IFwiQTVcIi4nO1xuICB9IGVsc2Uge1xuICAgIHNwYW5FcnJvckVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgfVxufVxuXG5jb25zdCB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQgPSAoaW5wdXRWYWwpID0+IHtcbiAgY29uc3QgYWxwaCA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSyddO1xuICBcbiAgY29uc3QgaWR4U3RhcnQgPSBhbHBoLmZpbmRJbmRleCgoZWxlKSA9PiB7XG4gICAgcmV0dXJuIGVsZSA9PT0gaW5wdXRWYWxbMF07XG4gIH0pO1xuXG4gIHJldHVybiBbaWR4U3RhcnQsIHBhcnNlSW50KGlucHV0VmFsLnNsaWNlKDEpKSAtIDFdO1xufVxuXG5jb25zdCBkaXNwbGF5R2FtZUJvYXJkID0gKHBsYXllck51bWJlciwgcGxheWVyQm9hcmQpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl1gKTtcbiAgY29uc3Qgcm93TGlzdEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgZGl2LmJvYXJkW2RhdGEtcGxheWVyPVwiJHtwbGF5ZXJOdW1iZXJ9XCJdID4gdWwgPiBsaWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBib2FyZFJvdyA9IHBsYXllckJvYXJkW2ldO1xuICAgIGNvbnN0IGRpc3BsYXlCb2FyZFJvdyA9IHJvd0xpc3RJdGVtc1tpICsgMV07XG4gICAgY29uc3Qgc3BhbnMgPSBkaXNwbGF5Qm9hcmRSb3cuY2hpbGRyZW47XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkUm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoYm9hcmRSb3dbal0gPT09ICcnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhbnNbaiArIDFdLmlubmVySFRNTCA9ICdTJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBib2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG59XG5cbmNvbnN0IGhpZGVHYW1lQm9hcmQgPSAocGxheWVyTnVtYmVyKSA9PiB7XG4gIGNvbnN0IHJvd0xpc3RJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIiR7cGxheWVyTnVtYmVyfVwiXSA+IHVsID4gbGlgKTtcblxuICBmb3IgKGxldCBpID0gMTsgaSA8IDExOyBpKyspIHtcbiAgICBjb25zdCBkaXNwbGF5Qm9hcmRSb3cgPSByb3dMaXN0SXRlbXNbaV07XG4gICAgY29uc3Qgc3BhbnMgPSBkaXNwbGF5Qm9hcmRSb3cuY2hpbGRyZW47XG5cbiAgICBmb3IgKGxldCBqID0gMTsgaiA8IDExOyBqKyspIHtcbiAgICAgIHNwYW5zW2pdLmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBzZXRCYXR0bGVIZWFkZXIgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBkaXZBdGsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWF0aycpO1xuICBjb25zdCBjdXJyZW50UGxheWVyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XG4gIGRpc3BsYXlHYW1lQm9hcmQoY3VycmVudFBsYXllciwgZ2FtZS5fcGxheWVyc1tjdXJyZW50UGxheWVyXS5ib2FyZC5fYm9hcmQpO1xuICBkaXZBdGsuaW5uZXJIVE1MID0gYCR7Z2FtZS5fcGxheWVyc1tjdXJyZW50UGxheWVyXS5uYW1lfSwgd2hlcmUgd291bGQgeW91IGxpa2UgdG8gYXR0YWNrP2A7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9