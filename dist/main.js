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

  return {
    _players,
    createPlayer,
    getCurrentPlayer,
    checkInsertParameters
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
    if (checkInsertParameters(shipLength, start, end)) {
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
    } else {
    // Else we return a incorrect message?
    }
  }

  function receiveAttack(coord) {
    const boardlocation = _board[coord[1]][coord[0]];
    if (boardlocation) {
      const ship = _ships[boardlocation];
      ship.hit();
      return 'Shit Hit';
    } else {
      _missedAttacks.push(coord);
      return coord;
    }
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
    gameOver
  }
}

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

module.exports = {
  checkInsertParameters,
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
  const inputCoord = document.getElementById('coord');
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
    const coordinates = transformInputToCoord(input.value);
    
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
  const arr = inputVal.split(' ');
  const alph = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K'];
  
  const idxStart = alph.findIndex((ele) => {
    return ele === arr[0][0];
  });

  const idxEnd = alph.findIndex((ele) => {
    return ele === arr[1][0];
  });

  return [[idxStart, parseInt(arr[0].slice(1)) - 1], [idxEnd, parseInt(arr[1].slice(1)) - 1]];
}

const displayGameBoard = (playerNumber, playerBoard) => {
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

  divAtk.innerHTML = `${game._players[currentPlayer]}, where would you like to attack?`;
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQSwyRUFBMkUsYUFBYTs7QUFFeEYsa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLHFCQUFxQjtBQUN6QztBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyRUFBMkUsYUFBYTs7QUFFeEYsa0JBQWtCLFFBQVE7QUFDMUI7QUFDQTs7QUFFQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsd0JBQXdCLDZCQUE2QjtBQUNyRCxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwLy4vc3JjL2pzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwLy4vc3JjL2pzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvc2hpcC5qcyIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwLy4vc3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdhbWVib2FyZEZucyA9IHJlcXVpcmUoJy4vZ2FtZWJvYXJkLmpzJyk7XG5jb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwLmpzJyk7XG5cbi8vIEZvciBHYW1lIHRvIFJ1bi5cbi8vIEhhcyBwbGF5ZXJzX29iamVjdCB3aGljaCBob2xkcyB0d28gcGxheWVyIG9iamVjdHMsIGZvciB0aGUgZ2FtZVxuLy8gSGFzIGN1cnJlbnRUdXJuIHdoaWNoIGtlZXBzIHRyYWNrIG9mIHdob3NlIHR1cm4gaXQgaXMuXG5cbi8vIEhUTUwgaGFzIGlucHV0IGZvciBjaG9vc2luZyBjb29yZGluYXRlcyB0byBzdHJpa2Ugb24gYm9hcmQuXG4vLyBPbmNlIHVzZXIgaGFzIGlucHV0dGVkIHZhbGlkIGNvb3JkaW5hdGVzLCBydW4gdHVybiBmdW5jdGlvbi5cbi8vIGZ1bmN0aW9uICd0dXJuJyB3aGljaCB3aWxsIHJ1biB0aHJvdWdoIGEgdHVybi5cbiAgLy8gQ29vcmRpbmF0ZXMgd2lsbCBiZSBzZXQgdG8gZ2FtZWJvYXJkLCB0byBjaGVjayBpZiB0aGVyZSBpcyBhIGhpdCBvbiB0aGUgb3Bwb25lbnRzIGJvYXJkLlxuICAgIC8vIElmIHRoZXJlIGlzIGEgaGl0LCB3ZSB3YW50IHRvIHNpZ25pZnkgdGhlcmUgaXMgYSBoaXRcbiAgICAgIC8vIFdlIHdhbnQgdG8gY2hlY2sgaWYgYSBzaGlwIGhhcyBmYWxsZW5cbiAgICAgIC8vIFdlIHdhbnQgdG8gY2hlY2sgaWYgYWxsIHNoaXBzIGhhdmUgZmFsbGVuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBtaXNzLCB3ZSB3YW50IHRvIHNpZ25pZnkgdGhhdCBpdCBpcyBhIG1pc3NcbiAgICAgIC8vIFdlIHdhbnQgdG8gYWRkIHRvIHRoZSBtaXNzIGFycmF5XG4gICAgLy8gQ2hhbmdlIHRoZSBjdXJyZW50VHVybiB0byB0aGUgb3Bwb25lbnRzIHR1cm5cbiAgICAvLyBVcGRhdGUgdGhlIEhUTUwgRG9tIHRvIHNpZ25pZnkgdGhhdCBpdCBpcyB0aGUgb3Bwb25lbnRzIHR1cm5cbmNvbnN0IEdhbWUgPSAoKSA9PiB7XG4gIGNvbnN0IF9wbGF5ZXJzID0ge307XG4gIGxldCBfY3VycmVudFR1cm4gPSAxO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBsYXllcihwbGF5ZXJOYW1lKSB7XG4gICAgY29uc3QgcGxheWVyTnVtYmVyID0gX3BsYXllcnNbMV0gPyAyIDogMTtcblxuICAgIF9wbGF5ZXJzW3BsYXllck51bWJlcl0gPSB7XG4gICAgICBuYW1lOiBwbGF5ZXJOYW1lLFxuICAgICAgYm9hcmQ6IGdhbWVib2FyZEZucy5HYW1lYm9hcmQoKVxuICAgIH1cblxuICAgIHJldHVybiBfcGxheWVyc1twbGF5ZXJOdW1iZXJdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudFBsYXllcigpIHtcbiAgICByZXR1cm4gX2N1cnJlbnRUdXJuO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tJbnNlcnRQYXJhbWV0ZXJzKHNoaXBMZW5ndGgsIHN0YXJ0LCBlbmQpIHtcbiAgICBsZXQgZHg7XG4gICAgbGV0IGR5O1xuICAgIGlmIChNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgIT09IDApIHtcbiAgICAgIGR4ID0gTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICsgMTtcbiAgICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGR4ID0gTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pXG4gICAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKSArIDE7XG4gICAgfVxuICBcbiAgICAvLyBJZiBkeCBhbmQgZHkgYXJlbid0IHRoZSBzaGlwIGxlbmd0aCwgdGhlbiB0aGUgY29vcmRpbmF0ZXMgZ2l2ZW4gYXJlIGluY29ycmVjdC5cbiAgICAvLyBUaGlzIGlzIGp1c3QgZm9yIG1hbnVhbGx5IGlucHV0dGluZyBjb29yZGluYXRlcyBhbmQgbm90IGZvciBmdXR1cmUuXG4gICAgaWYgKGR4ICE9PSBzaGlwTGVuZ3RoICYmIGR5ICE9PSBzaGlwTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gSWYgdGhlIGhvcml6b250YWwgaXMgY29ycmVjdCwgdGhlbiBkeSBtdXN0IGJlIDAgYmVjYXVzZSB0aGVyZSBpcyBubyBkaWFnb25hbCBzaGlwIHBsYWNlbWVudFxuICAgIH0gZWxzZSBpZiAoZHggPT09IHNoaXBMZW5ndGgpIHtcbiAgICAgIHJldHVybiAoZHkgPT09IDApID8gdHJ1ZSA6IGZhbHNlO1xuICAgIC8vIElmIHRoZSB2ZXJ0aWNhbCBkaWZmZXJlbmNlIGlzIHRoZSBzaGlwIGxlbmd0aCwgdGhlbiB0aGUgaG9yaXpvbnRhbCBkaWZmZXJlbmNlIHNob3VsZCBiZSAwLlxuICAgIH0gZWxzZSBpZiAoZHkgPT09IHNoaXBMZW5ndGgpIHtcbiAgICAgIHJldHVybiAoZHggPT09IDApID8gdHJ1ZSA6IGZhbHNlOyBcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIF9wbGF5ZXJzLFxuICAgIGNyZWF0ZVBsYXllcixcbiAgICBnZXRDdXJyZW50UGxheWVyLFxuICAgIGNoZWNrSW5zZXJ0UGFyYW1ldGVyc1xuICB9O1xufVxuXG4vKlxuLy8gQ2FycmllciAob2NjdXBpZXMgNSBzcGFjZXMpLCBCYXR0bGVzaGlwICg0KSwgQ3J1aXNlciAoMyksIFN1Ym1hcmluZSAoMyksIGFuZCBEZXN0cm95ZXIgKDIpLlxuY29uc3QgY3JlYXRlUmFuZG9tQm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IGdhbWVib2FyZEZucy5HYW1lYm9hcmQoKTtcbiAgY29uc3Qgc2hpcEFycmF5ID0gW1NoaXAoJ0Rlc3Ryb3llcicsIDIpXTtcblxuICAvLyBSYW5kb21seSBhZGQgc2hpcHMgdG8gZ2FtZWJvYXJkLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHNoaXAgPSBzaGlwQXJyYXlbaV07XG4gICAgLy8gR2VuZXJhdGUgcmFuZG9tIHN0YXJ0aW5nIHBvc2l0aW9uIGluIGJldHdlZW4gMSBhbmQgMTEuXG4gICAgbGV0IHJhbmRvbVN0YXJ0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDExIC0gMSArIDEpICsgMSk7XG5cbiAgICAvLyBHZW5lcmF0ZSB3aGV0aGVyIGludGVnZXIgd2lsbCBiZSB4IG9yIHkuXG4gICAgY29uc3QgcmFuZG9tRGlyZWN0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDIgLSAxICsgMSkgKyAxKTtcbiAgICBjb25zb2xlLmxvZyhyYW5kb21EaXJlY3Rpb24pO1xuICAgIGxldCBzaGlwU3RhcnQgPSByYW5kb21EaXJlY3Rpb24gPT09IDEgPyBbcmFuZG9tU3RhcnQsIDBdIDogWzAsIHJhbmRvbVN0YXJ0XTtcbiAgICBjb25zb2xlLmxvZyhzaGlwU3RhcnQpO1xuICB9XG59XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBHYW1lOyIsImNvbnN0IEdhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgX2JvYXJkID0gQXJyYXkuZnJvbSh7bGVuZ3RoOiAxMH0sICgpID0+IEFycmF5KDEwKS5maWxsKCcnKSk7XG4gIGNvbnN0IF9zaGlwcyA9IHt9O1xuICBjb25zdCBfbWlzc2VkQXR0YWNrcyA9IFtdO1xuXG4gIC8vIHZhbGlkYXRlSW5zZXJ0IGZ1bmN0aW9uXG4gIC8vIEdpdmVuIGEgc3RhcnQgYW5kIGVuZCBwYXJhbWV0ZXJcbiAgLy8gR29pbmcgZnJvbSB0aGUgc3RhcnQgdG8gdGhlIGVuZCBtYXJrZXJcbiAgZnVuY3Rpb24gdmFsaWRhdGVJbnNlcnQoc3RhcnQsIGVuZCkge1xuICAgIGNvbnN0IGR4ID0gc3RhcnRbMF0gLSBlbmRbMF07XG4gICAgY29uc3QgZHkgPSBzdGFydFsxXSAtIGVuZFsxXTtcblxuICAgIGxldCBtYXJrZXIgPSBzdGFydDtcbiAgICBpZiAoZHgpIHtcbiAgICAgIHdoaWxlIChtYXJrZXJbMF0gIT09IGVuZFswXSkge1xuICAgICAgICBpZiAoX2JvYXJkW21hcmtlclsxXV1bbWFya2VyWzBdXSAhPT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR4IDwgMCkge1xuICAgICAgICAgIG1hcmtlciA9IFttYXJrZXJbMF0gKyAxLCBzdGFydFsxXV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFya2VyID0gW21hcmtlclswXSAtIDEsIHN0YXJ0WzFdXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAobWFya2VyWzFdICE9PSBlbmRbMV0pIHtcbiAgICAgICAgaWYgKF9ib2FyZFttYXJrZXJbMV1dW21hcmtlclswXV0gIT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSA8IDApIHtcbiAgICAgICAgICBtYXJrZXIgPSBbc3RhcnRbMF0sIG1hcmtlclsxXSArIDFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcmtlciA9IFtzdGFydFswXSwgbWFya2VyWzFdIC0gMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnQoc2hpcE9iaiwgc3RhcnQsIGVuZCkge1xuICAgIGxldCBzaGlwTGVuZ3RoID0gc2hpcE9iai5zaGlwTGVuZ3RoO1xuICAgIGlmIChjaGVja0luc2VydFBhcmFtZXRlcnMoc2hpcExlbmd0aCwgc3RhcnQsIGVuZCkpIHtcbiAgICAgIF9zaGlwc1tzaGlwT2JqLm5hbWVdID0gc2hpcE9iajtcbiAgICAgIGxldCBkeCA9IHN0YXJ0WzBdIC0gZW5kWzBdO1xuICAgICAgbGV0IGR5ID0gc3RhcnRbMV0gLSBlbmRbMV07XG4gICAgICBpZiAoZHgpIHtcbiAgICAgICAgZHggPSBNYXRoLmFicyhkeCkgKyAxO1xuICAgICAgICBsZXQgeE1hcmtlciA9IHN0YXJ0WzBdO1xuICAgICAgICB3aGlsZSAoZHgpIHtcbiAgICAgICAgICBpZiAoc3RhcnRbMF0gPiBlbmRbMF0pIHtcbiAgICAgICAgICAgIF9ib2FyZFtzdGFydFsxXV1beE1hcmtlcl0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgICB4TWFya2VyIC09IDE7XG4gICAgICAgICAgICBkeCAtPSAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfYm9hcmRbc3RhcnRbMV1dW3hNYXJrZXJdID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgICAgeE1hcmtlciArPSAxXG4gICAgICAgICAgICBkeCAtPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHkgPSBNYXRoLmFicyhkeSkgKyAxO1xuICAgICAgICBsZXQgeU1hcmtlciA9IHN0YXJ0WzFdO1xuICAgICAgICB3aGlsZSAoZHkpIHtcbiAgICAgICAgICBpZiAoc3RhcnRbMV0gPiBlbmRbMV0pIHtcbiAgICAgICAgICAgIF9ib2FyZFt5TWFya2VyXVtzdGFydFswXV0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgICB5TWFya2VyIC09IDE7XG4gICAgICAgICAgICBkeSAtPSAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfYm9hcmRbeU1hcmtlcl1bc3RhcnRbMF1dID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgICAgeU1hcmtlciArPSAxO1xuICAgICAgICAgICAgZHkgLT0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICByZXR1cm4gX2JvYXJkO1xuICAgIH0gZWxzZSB7XG4gICAgLy8gRWxzZSB3ZSByZXR1cm4gYSBpbmNvcnJlY3QgbWVzc2FnZT9cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKGNvb3JkKSB7XG4gICAgY29uc3QgYm9hcmRsb2NhdGlvbiA9IF9ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xuICAgIGlmIChib2FyZGxvY2F0aW9uKSB7XG4gICAgICBjb25zdCBzaGlwID0gX3NoaXBzW2JvYXJkbG9jYXRpb25dO1xuICAgICAgc2hpcC5oaXQoKTtcbiAgICAgIHJldHVybiAnU2hpdCBIaXQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBfbWlzc2VkQXR0YWNrcy5wdXNoKGNvb3JkKTtcbiAgICAgIHJldHVybiBjb29yZDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICBmb3IgKGNvbnN0IHNoaXBOYW1lIGluIF9zaGlwcykge1xuICAgICAgY29uc3Qgc2hpcCA9IF9zaGlwc1tzaGlwTmFtZV07XG4gICAgICBpZiAoc2hpcC5pc1N1bmsoKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgX2JvYXJkLFxuICAgIF9zaGlwcyxcbiAgICBfbWlzc2VkQXR0YWNrcyxcbiAgICB2YWxpZGF0ZUluc2VydCxcbiAgICBpbnNlcnQsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBnYW1lT3ZlclxuICB9XG59XG5cbmNvbnN0IGNoZWNrSW5zZXJ0UGFyYW1ldGVycyA9KHNoaXBMZW5ndGgsIHN0YXJ0LCBlbmQpID0+IHtcbiAgbGV0IGR4O1xuICBsZXQgZHk7XG4gIGlmIChNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgIT09IDApIHtcbiAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSArIDE7XG4gICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSlcbiAgfSBlbHNlIHtcbiAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKVxuICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pICsgMTtcbiAgfVxuXG4gIC8vIElmIGR4IGFuZCBkeSBhcmVuJ3QgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBjb29yZGluYXRlcyBnaXZlbiBhcmUgaW5jb3JyZWN0LlxuICAvLyBUaGlzIGlzIGp1c3QgZm9yIG1hbnVhbGx5IGlucHV0dGluZyBjb29yZGluYXRlcyBhbmQgbm90IGZvciBmdXR1cmUuXG4gIGlmIChkeCAhPT0gc2hpcExlbmd0aCAmJiBkeSAhPT0gc2hpcExlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gSWYgdGhlIGhvcml6b250YWwgaXMgY29ycmVjdCwgdGhlbiBkeSBtdXN0IGJlIDAgYmVjYXVzZSB0aGVyZSBpcyBubyBkaWFnb25hbCBzaGlwIHBsYWNlbWVudFxuICB9IGVsc2UgaWYgKGR4ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgcmV0dXJuIChkeSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XG4gIC8vIElmIHRoZSB2ZXJ0aWNhbCBkaWZmZXJlbmNlIGlzIHRoZSBzaGlwIGxlbmd0aCwgdGhlbiB0aGUgaG9yaXpvbnRhbCBkaWZmZXJlbmNlIHNob3VsZCBiZSAwLlxuICB9IGVsc2UgaWYgKGR5ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgcmV0dXJuIChkeCA9PT0gMCkgPyB0cnVlIDogZmFsc2U7IFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVja0luc2VydFBhcmFtZXRlcnMsXG4gIEdhbWVib2FyZFxufTsiLCIvKlxuUkVNRU1CRVIgeW91IG9ubHkgaGF2ZSB0byB0ZXN0IHlvdXIgb2JqZWN04oCZcyBwdWJsaWMgaW50ZXJmYWNlLlxuT25seSBtZXRob2RzIG9yIHByb3BlcnRpZXMgdGhhdCBhcmUgdXNlZCBvdXRzaWRlIG9mIHlvdXIg4oCYc2hpcOKAmSBvYmplY3QgbmVlZCB1bml0IHRlc3RzLlxuKi9cblxuLy8gU2hpcHMgc2hvdWxkIGhhdmUgYSBoaXQoKSBmdW5jdGlvbiB0aGF0IGluY3JlYXNlcyB0aGUgbnVtYmVyIG9mIOKAmGhpdHPigJkgaW4geW91ciBzaGlwLlxuXG4vLyBpc1N1bmsoKSBzaG91bGQgYmUgYSBmdW5jdGlvbiB0aGF0IGNhbGN1bGF0ZXMgaXQgYmFzZWQgb24gdGhlaXIgbGVuZ3RoIFxuLy8gYW5kIHRoZSBudW1iZXIgb2Yg4oCYaGl0c+KAmS5cbmNvbnN0IFNoaXAgPSAobmFtZSwgaGl0cG9pbnRzKSA9PiB7XG4gIGxldCBfaGl0cG9pbnRzID0gaGl0cG9pbnRzO1xuICBjb25zdCBzaGlwTGVuZ3RoID0gaGl0cG9pbnRzO1xuICBsZXQgX3N1bmsgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBoaXQoKSB7XG4gICAgX2hpdHBvaW50cyAtPSAxO1xuXG4gICAgaWYgKCFfaGl0cG9pbnRzKSB7XG4gICAgICBfc3VuayA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9oaXRwb2ludHM7XG4gIH1cblxuICBmdW5jdGlvbiBpc1N1bmsoKSB7XG4gICAgcmV0dXJuIF9zdW5rO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIHNoaXBMZW5ndGgsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGlwOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJjb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJyk7XG5jb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIC8vIEluaXRpYWxpemUgR2FtZSBPYmplY3RcbiAgY29uc3QgZ2FtZSA9IEdhbWUoKTtcblxuICAvLyBDcmVhdGUgVHdvIFBsYXllcnMgQW5kIERpc3BsYXkgdGhlaXIgYm9hcmRzXG4gIGdhbWUuY3JlYXRlUGxheWVyKCdKdXN0aW4nKTtcbiAgZ2FtZS5jcmVhdGVQbGF5ZXIoJ0plZmYnKTtcbiAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgZGlzcGxheUdhbWVCb2FyZCgyLCBnYW1lLl9wbGF5ZXJzWycyJ10uYm9hcmQuX2JvYXJkKTtcbiAgLy8gUHJlcCBQaGFzZVxuICAvLyBTZXQgUGxheWVyIDEgQm9hcmRcbiAgICAvLyBBc2sgcGxheWVyIGZvciBpbnB1dCBjb29yZGluYXRlcyBmb3IgMyBzaGlwc1xuICAvLyBTZXQgUGxheWVyIDIgQm9hcmRcbiAgICAvLyBBc2sgcGxheWVyIGZvciBpbnB1dCBjb29yZGluYXRlcyBmb3IgMyBzaGlwc1xuICBzdGFydFByZXBQaGFzZShnYW1lKTtcbiAgLy8gQmF0dGxlIFBoYXNlXG4gICAgLy8gQXNrIFBsYXllciAxIGZvciBjb29yZGluYXRlcyB0byBoaXRcbiAgICAvLyBBc2sgUGxheWVyIDIgZm9yIGNvb3JkaW5hdGVzIHRvIGhpdFxuICBzdGFydEJhdHRsZVBoYXNlKGdhbWUpO1xufSk7XG5cbmNvbnN0IHN0YXJ0UHJlcFBoYXNlID0gKGdhbWUpID0+IHtcbiAgLypcbiAgPGZvcm0gaWQ9XCJmb3JtLWluc2VydC1zaGlwc1wiPlxuICAgIDxkaXYgaWQ9XCJkaXYtaW5zZXJ0XCIgZGF0YS1zaGlwPVwiY3J1aXNlclwiPlBsYXllciAxLCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBjcnVpc2VyIChMZW5ndGg6IDMgcGxhY2VzKTo8L2Rpdj5cbiAgICA8bGFiZWw+Q29vcmRpbmF0ZXM6PC9sYWJlbD5cbiAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImluc2VydC1jb29yZGluYXRlc1wiIG1pbmxlbmd0aD1cIjVcIiBtYXhsZW5ndGg9XCI3XCIgcGF0dGVybj1cIl5bQS1aXShbMS05XXwxMClcXHNbQS1aXShbMS05XXwxMCkkXCIgcGxhY2Vob2xkZXI9XCJleDogQTQgQTYsIEIzIEI2XCIgcmVxdWlyZWQvPlxuICAgIDxzcGFuIGlkPVwic3Bhbi1pbnNlcnQtZXJyb3JcIiBjbGFzcz1cInNwYW4taW5wdXQtZXJyb3IgaGlkZVwiPjwvc3Bhbj5cbiAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIGlkPVwiaW5zZXJ0LXN1Ym1pdFwiIHZhbHVlPVwiU3VibWl0IENvb3JkaW5hdGVzXCIgLz5cbiAgPC9mb3JtPlxuICAqL1xuICAvLyBjb25zdCBmb3JtUHJlcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtLWluc2VydC1zaGlwcycpO1xuICBjb25zdCBpbnB1dEluc2VydENvb3JkaW5hdGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1jb29yZGluYXRlcycpO1xuICBjb25zdCBzcGFuSW5zZXJ0RXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1pbnNlcnQtZXJyb3InKTtcblxuICBzZXRQcmVwSGVhZGVyKGdhbWUpO1xuICBzZXRJbnB1dExpc3RlbmVyKGlucHV0SW5zZXJ0Q29vcmRpbmF0ZXMsIHNwYW5JbnNlcnRFcnJvcik7XG4gIHNldFByZXBTdWJtaXRCdG5MaXN0ZW5lcihnYW1lKTtcbn1cblxuY29uc3Qgc3RhcnRCYXR0bGVQaGFzZSA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGlucHV0Q29vcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29vcmQnKTtcbiAgY29uc3Qgc3BhbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYW4tY29vcmQtZXJyb3InKTtcbiAgXG4gIHNldElucHV0TGlzdGVuZXIoaW5wdXRDb29yZCwgc3BhbkVycm9yKTtcbiAgc2V0QmF0dGxlU3VibWl0QnRuTGlzdGVuZXIoZ2FtZSk7XG4gIC8qXG4gIDxmb3JtIGlkPVwiZm9ybS1hdGstY29vcmRzXCIgY2xhc3M9XCJoaWRlXCI+XG4gICAgPGxhYmVsIGZvcj1cImNvb3JkXCI+PC9sYWJlbD5cbiAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImNvb3JkXCIgcGxhY2Vob2xkZXI9XCJleDogQTRcIiAvPlxuICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgaWQ9XCJzdWJtaXRcIiB2YWx1ZT1cIlN1Ym1pdCBDb29yZGluYXRlc1wiIC8+XG4gIDwvZm9ybT5cbiAgKi9cbiAgLy8gV2UgbmVlZCB0byB1bmhpZGUgdGhlIGZvcm0tYXRrLWNvb3JkcyBmb3JtLlxuICAvLyBOZWVkIHRvIHNldCB0aGUgZGF0YS10dXJuIG9uIGNvb3JkIGlucHV0IHRvIGN1cnJlbnQgcGxheWVyXG4gIC8vIE5lZWQgdG8gYWRkIGxpc3RlbmVyIG9uIHN1Ym1pdCB0byBjaGVjayBmb3IgY29ycmVjdC92YWxpZCBpbnB1dCBvbiBjb29yZCBpbnB1dCBhbmQgdGhlbiBzdWJtaXRzIHBsYXllciB0dXJuIG9uIGdhbWUuXG59XG5cbmNvbnN0IHNldEJhdHRsZVN1Ym1pdEJ0bkxpc3RlbmVyID0gKGdhbWUpID0+IHtcbiAgY29uc3QgaW5wdXRDb29yZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29yZCcpO1xufVxuXG5jb25zdCBzZXRQcmVwSGVhZGVyID0gKGdhbWUpID0+IHtcbiAgY29uc3QgcGxheWVyT25lID0gZ2FtZS5fcGxheWVyc1sxXTtcbiAgY29uc3QgZGl2SW5zZXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1pbnNlcnQnKTtcbiAgXG4gIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGNydWlzZXIgKExlbmd0aDogMyBQbGFjZXMpOmA7XG59XG5cbmNvbnN0IHNldFByZXBTdWJtaXRCdG5MaXN0ZW5lciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCBmb3JtSW5zZXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0taW5zZXJ0LXNoaXBzJyk7XG4gIGNvbnN0IGZvcm1CYXR0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1hdGstY29vcmRzJyk7XG4gIGNvbnN0IGRpdkluc2VydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtaW5zZXJ0Jyk7XG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1jb29yZGluYXRlcycpO1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1pbnNlcnQtZXJyb3InKTtcbiAgY29uc3Qgc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1zdWJtaXQnKTtcblxuICBsZXQgY3VycmVudFBsYXllciA9IGdhbWUuX3BsYXllcnNbMV07XG4gIHN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGN1cnJlbnRTaGlwID0gZGl2SW5zZXJ0LmdldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJyk7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQoaW5wdXQudmFsdWUpO1xuICAgIFxuICAgIGlmIChjdXJyZW50U2hpcCA9PT0gJ2NydWlzZXInKSB7XG4gICAgICAvLyBUaGUgdHdvIGNvb3JkaW5hdGVzIG1hdGNoIHRoZSBsZW5ndGggb2YgdGhlIHNoaXBcbiAgICAgIGlmIChnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycygzLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIC8vIENoZWNrIHRoYXQgdHdvIGNvb3JkaW5hdGVzIGRvbid0IGludGVyZmVyZSB3aXRoIG90aGVyIHNoaXBzIG9uIHRoZSBwbGF5ZXJzIGJvYXJkLlxuICAgICAgICBpZiAoY3VycmVudFBsYXllci5ib2FyZC52YWxpZGF0ZUluc2VydChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0NydWlzZXInLCAzKTtcbiAgICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdiYXR0bGVzaGlwJyk7XG4gICAgICAgICAgZGl2SW5zZXJ0LmlubmVySFRNTCA9IGAke2N1cnJlbnRQbGF5ZXIubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGJhdHRsZXNoaXAgKExlbmd0aDogNSBwbGFjZXMpOmA7XG4gICAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IGdhbWUuX3BsYXllcnNbMV0pIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IERpZmZlcmVudCBTaGlwIHBsYWNlZCBhdCBjb29yZGluYXRlcy4gVXNlIGRpZmZlcmVudCBjb29yZGluYXRlcy4nO1xuICAgICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IENvb3JkaW5hdGVzIHJhbmdlIGRvZXMgbm90IG1hdGNoIHNoaXAgbGVuZ3RoLic7XG4gICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjdXJyZW50U2hpcCA9PT0gJ2JhdHRsZXNoaXAnKSB7XG4gICAgICBpZiAoZ2FtZS5jaGVja0luc2VydFBhcmFtZXRlcnMoNSwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICBpZiAoY3VycmVudFBsYXllci5ib2FyZC52YWxpZGF0ZUluc2VydChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0JhdHRsZXNoaXAnLCA1KTtcbiAgICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdkZXN0cm95ZXInKTtcbiAgICAgICAgICBkaXZJbnNlcnQuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSwgY2hvb3NlIHdoZXJlIHRvIHBsYWNlIHlvdXIgZGVzdG95ZXIgKExlbmd0aDogMiBwbGFjZXMpOmA7XG4gICAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IGdhbWUuX3BsYXllcnNbMV0pIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IERpZmZlcmVudCBTaGlwIHBsYWNlZCBhdCBjb29yZGluYXRlcy4gVXNlIGRpZmZlcmVudCBjb29yZGluYXRlcy4nO1xuICAgICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IENvb3JkaW5hdGVzIHJhbmdlIGRvZXMgbm90IG1hdGNoIHNoaXAgbGVuZ3RoLic7XG4gICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjdXJyZW50U2hpcCA9PT0gJ2Rlc3Ryb3llcicpIHtcbiAgICAgIGlmIChnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycygyLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIGlmIChjdXJyZW50UGxheWVyLmJvYXJkLnZhbGlkYXRlSW5zZXJ0KGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgICBjb25zdCBzaGlwID0gU2hpcCgnRGVzdHJveWVyJywgMik7XG4gICAgICAgICAgY3VycmVudFBsYXllci5ib2FyZC5pbnNlcnQoc2hpcCwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKTtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PT0gZ2FtZS5fcGxheWVyc1sxXSkge1xuICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgICAgICAgICAgICAvLyBBZnRlciA1IHNlY29uZHNcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBIaWRlIFBsYXllciAxIGJvYXJkXG4gICAgICAgICAgICAgIGhpZGVHYW1lQm9hcmQoMSk7XG4gICAgICAgICAgICAgIC8vIENoYW5nZWQgY3VycmVudFBsYXllciB2YXJpYWJsZSB0byBQbGF5ZXIgMlxuICAgICAgICAgICAgICBjdXJyZW50UGxheWVyID0gZ2FtZS5fcGxheWVyc1syXTtcbiAgICAgICAgICAgICAgLy8gU2V0IGRpdiBJbnNlcnQgdG8gY3J1aXNlclxuICAgICAgICAgICAgICBkaXZJbnNlcnQuc2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnLCAnY3J1aXNlcicpO1xuICAgICAgICAgICAgICBkaXZJbnNlcnQuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSwgY2hvb3NlIHdoZXJlIHRvIHBsYWNlIHlvdXIgY3J1aXNlciAoTGVuZ3RoOiAzIHBsYWNlcyk6YDtcbiAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgfSwgMjUwMCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBoaWRlR2FtZUJvYXJkKDIpO1xuICAgICAgICAgICAgICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSAnQmF0dGxlIFBoYXNlJztcbiAgICAgICAgICAgICAgZm9ybUluc2VydC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgICAgICAgIGZvcm1CYXR0bGUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgICBzZXRCYXR0bGVIZWFkZXIoZ2FtZSk7XG4gICAgICAgICAgICB9LCAyNTAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogRGlmZmVyZW50IFNoaXAgcGxhY2VkIGF0IGNvb3JkaW5hdGVzLiBVc2UgZGlmZmVyZW50IGNvb3JkaW5hdGVzLic7XG4gICAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogQ29vcmRpbmF0ZXMgcmFuZ2UgZG9lcyBub3QgbWF0Y2ggc2hpcCBsZW5ndGguJztcbiAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5jb25zdCBzZXRJbnB1dExpc3RlbmVyID0gKGlucHV0LCBzcGFuKSA9PiB7XG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIGlmICghaW5wdXQudmFsaWRpdHkudmFsaWQpIHtcbiAgICAgIGRpc3BsYXlJbnB1dEVycm9yKGlucHV0KTtcbiAgICAgIHNwYW4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXNwYW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykpIHtcbiAgICAgICAgc3Bhbi5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgZGlzcGxheUlucHV0RXJyb3IgPSAoaW5wdXQpID0+IHtcbiAgY29uc3QgcGFyZW50RWxlbWVudCA9IGlucHV0LnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IHNwYW5FcnJvckVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LmNoaWxkcmVuWzNdO1xuICBpZiAoaW5wdXQudmFsaWRpdHkudmFsdWVNaXNzaW5nKSB7XG4gICAgc3BhbkVycm9yRWxlbWVudC5pbm5lckhUTUwgPSAnRXJyb3I6IElucHV0IGlzIHJlcXVpcmVkLic7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgfSBlbHNlIGlmIChpbnB1dC52YWxpZGl0eS50b29Mb25nKSB7XG4gICAgc3BhbkVycm9yRWxlbWVudC5pbm5lckhUTUwgPSAnRXJyb3I6IElucHV0IGlzIHRvbyBsb25nLic7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgfSBlbHNlIGlmIChpbnB1dC52YWxpZGl0eS5wYXR0ZXJuTWlzbWF0Y2gpIHtcbiAgICBzcGFuRXJyb3JFbGVtZW50LmlubmVySFRNTCA9IChpbnB1dC5pZCA9PT0gJ2luc2VydC1jb29yZGluYXRlcycpXG4gICAgICA/ICdFcnJvcjogSW5wdXQgZG9lcyBub3QgbWF0Y2ggcGF0dGVybi4gZXg6IFwiQTQgQTZcIi4nXG4gICAgICA6ICdFcnJvcjogSW5wdXQgZG9lcyBub3QgbWF0Y2ggcGF0dGVybi4gZXg6IFwiQTVcIi4nO1xuICB9IGVsc2Uge1xuICAgIHNwYW5FcnJvckVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgfVxufVxuXG5jb25zdCB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQgPSAoaW5wdXRWYWwpID0+IHtcbiAgY29uc3QgYXJyID0gaW5wdXRWYWwuc3BsaXQoJyAnKTtcbiAgY29uc3QgYWxwaCA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSyddO1xuICBcbiAgY29uc3QgaWR4U3RhcnQgPSBhbHBoLmZpbmRJbmRleCgoZWxlKSA9PiB7XG4gICAgcmV0dXJuIGVsZSA9PT0gYXJyWzBdWzBdO1xuICB9KTtcblxuICBjb25zdCBpZHhFbmQgPSBhbHBoLmZpbmRJbmRleCgoZWxlKSA9PiB7XG4gICAgcmV0dXJuIGVsZSA9PT0gYXJyWzFdWzBdO1xuICB9KTtcblxuICByZXR1cm4gW1tpZHhTdGFydCwgcGFyc2VJbnQoYXJyWzBdLnNsaWNlKDEpKSAtIDFdLCBbaWR4RW5kLCBwYXJzZUludChhcnJbMV0uc2xpY2UoMSkpIC0gMV1dO1xufVxuXG5jb25zdCBkaXNwbGF5R2FtZUJvYXJkID0gKHBsYXllck51bWJlciwgcGxheWVyQm9hcmQpID0+IHtcbiAgY29uc3Qgcm93TGlzdEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgZGl2LmJvYXJkW2RhdGEtcGxheWVyPVwiJHtwbGF5ZXJOdW1iZXJ9XCJdID4gdWwgPiBsaWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBib2FyZFJvdyA9IHBsYXllckJvYXJkW2ldO1xuICAgIGNvbnN0IGRpc3BsYXlCb2FyZFJvdyA9IHJvd0xpc3RJdGVtc1tpICsgMV07XG4gICAgY29uc3Qgc3BhbnMgPSBkaXNwbGF5Qm9hcmRSb3cuY2hpbGRyZW47XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkUm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoYm9hcmRSb3dbal0gPT09ICcnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhbnNbaiArIDFdLmlubmVySFRNTCA9ICdTJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgaGlkZUdhbWVCb2FyZCA9IChwbGF5ZXJOdW1iZXIpID0+IHtcbiAgY29uc3Qgcm93TGlzdEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgZGl2LmJvYXJkW2RhdGEtcGxheWVyPVwiJHtwbGF5ZXJOdW1iZXJ9XCJdID4gdWwgPiBsaWApO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgMTE7IGkrKykge1xuICAgIGNvbnN0IGRpc3BsYXlCb2FyZFJvdyA9IHJvd0xpc3RJdGVtc1tpXTtcbiAgICBjb25zdCBzcGFucyA9IGRpc3BsYXlCb2FyZFJvdy5jaGlsZHJlbjtcblxuICAgIGZvciAobGV0IGogPSAxOyBqIDwgMTE7IGorKykge1xuICAgICAgc3BhbnNbal0uaW5uZXJIVE1MID0gJyc7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHNldEJhdHRsZUhlYWRlciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGRpdkF0ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtYXRrJyk7XG4gIGNvbnN0IGN1cnJlbnRQbGF5ZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcblxuICBkaXZBdGsuaW5uZXJIVE1MID0gYCR7Z2FtZS5fcGxheWVyc1tjdXJyZW50UGxheWVyXX0sIHdoZXJlIHdvdWxkIHlvdSBsaWtlIHRvIGF0dGFjaz9gO1xufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==