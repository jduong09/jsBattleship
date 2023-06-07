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
  let _currentTurn = _players[1];

  function createPlayer(playerName) {
    const playerNumber = _players[1] ? 2 : 1;

    _players[playerNumber] = {
      name: playerName,
      board: gameboardFns.Gameboard()
    }
   
    /*
    const cruiser = Ship('Cruiser', 3);
    const destroyer = Ship('Destroyer', 2);
    _players[playerNumber].board.insert(cruiser, [0, 0], [0, 2]);
    _players[playerNumber].board.insert(destroyer, [1, 0], [2, 0]);
    */

    return _players[playerNumber];
  }

  function setPlayerBoard(playerNumber) {
    const ships = [['Battleship', 4], ['Cruiser', 3]];
    for (let i = 0; i < ships.length; i++) {

    }
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
  const game = Game();
  game.createPlayer('Justin');
  game.createPlayer('Jeff');
  displayGameBoard(1, game._players['1'].board._board);
  displayGameBoard(2, game._players['2'].board._board);

  // Game Phase
  // Set Player 1 Board
    // Ask player for input coordinates for 3 ships
  // Set Player 2 Board
    // Ask player for input coordinates for 3 ships
  // Ask Player 1 for coordinates to hit
  // Ask Player 2 for coordinates to hit
  // setPlayerOneBoard();
  // setPlayerTwoBoard();
  setInsertShipListener(game);
});

const setInsertShipListener = (game) => {
  const formInsert = document.getElementById('form-insert-ships');
  const divInsert = document.getElementById('div-insert');
  const input = document.getElementById('insert-coordinates');
  const spanError = document.getElementById('span-insert-error');
  const submit = document.getElementById('insert-submit');

  let currentPlayer = game._players[1];
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    const currentShip = divInsert.getAttribute('data-ship');
    // 'A4 A5' --> [A4, A5] || [[0, 4], [0, 5]];
    const coordinates = transformInputToCoord(input.value);
    if (currentPlayer.board.validateInsert(coordinates[0], coordinates[1])) {      
      if (currentShip === 'cruiser' && game.checkInsertParameters(3, coordinates[0], coordinates[1])) {
        const ship = Ship('Cruiser', 3);
        currentPlayer.board.insert(ship, coordinates[0], coordinates[1]);
        divInsert.setAttribute('data-ship', 'battleship');
        divInsert.innerHTML = `${currentPlayer.name}, choose where to place your battleship (Length: 5 places):`;
        input.value = null;
      } else if (currentShip === 'battleship' && game.checkInsertParameters(5, coordinates[0], coordinates[1])) {
        const ship = Ship('Battleship', 5);
        currentPlayer.board.insert(ship, coordinates[0], coordinates[1]);
        divInsert.setAttribute('data-ship', 'destroyer');
        divInsert.innerHTML = `${currentPlayer.name}, choose where to place your destroyer (Length: 2 places):`;
        input.value = null;
      } else if (currentShip === 'destroyer' && game.checkInsertParameters(2, coordinates[0], coordinates[1])) {
        const ship = Ship('Cruiser', 2);
        currentPlayer.board.insert(ship, coordinates[0], coordinates[1]);
        input.value = null;
        if (currentPlayer === game._players[1]) {
          currentPlayer = game._players[2];
          divInsert.setAttribute('data-ship', 'cruiser');
          divInsert.innerHTML = `${currentPlayer.name}, choose where to place your cruiser (Length: 3 places):`;
        } else {
          formInsert.classList.add('hide');
          displayGameBoard(1, game._players['1'].board._board);
          displayGameBoard(2, game._players['2'].board._board);
        }
      }
    } else {
      // Change Span Error message to match error
      // Unhide Span Error.
      spanError.innerHTML = 'Error';
      spanError.classList.remove('hide');
    }
  });
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

/*
const setInsertShipName = (start, shipName) => {
  const message =  document.getElementById('game-message');
  message.innerHTML = start ? `Set ${shipName} starting location: ` : `Set ${shipName} ending location: `; 
}

// parameters = shipName, shipLength
const promptShipInsert = () => {
  let shipCoord = [];
  const coordInput = document.getElementById('coord');
  const inputSubmit = document.getElementById('submit');

  inputSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    shipCoord.push(coordInput.value);
  });

  return shipCoord;
}

const insertShip = () => {
  console.log(promptShipInsert()); 
}
*/

const displayGameBoard = (playerNumber, playerBoard) => {
  const rowListItems = document.querySelectorAll(`div.board[data-player="${playerNumber}"] > ul > li`);
  console.log(rowListItems);

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
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsbUJBQW1CO0FBQ3BEO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxtQkFBbUI7QUFDcEQ7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLG1CQUFtQjtBQUN0RCxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsVUFBVSw4QkFBOEIsVUFBVTtBQUN2Rjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJFQUEyRSxhQUFhO0FBQ3hGOztBQUVBLGtCQUFrQix3QkFBd0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixxQkFBcUI7QUFDekM7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC8uL3NyYy9qcy9zaGlwLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2FtZWJvYXJkRm5zID0gcmVxdWlyZSgnLi9nYW1lYm9hcmQuanMnKTtcbmNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAuanMnKTtcblxuLy8gRm9yIEdhbWUgdG8gUnVuLlxuLy8gSGFzIHBsYXllcnNfb2JqZWN0IHdoaWNoIGhvbGRzIHR3byBwbGF5ZXIgb2JqZWN0cywgZm9yIHRoZSBnYW1lXG4vLyBIYXMgY3VycmVudFR1cm4gd2hpY2gga2VlcHMgdHJhY2sgb2Ygd2hvc2UgdHVybiBpdCBpcy5cblxuLy8gSFRNTCBoYXMgaW5wdXQgZm9yIGNob29zaW5nIGNvb3JkaW5hdGVzIHRvIHN0cmlrZSBvbiBib2FyZC5cbi8vIE9uY2UgdXNlciBoYXMgaW5wdXR0ZWQgdmFsaWQgY29vcmRpbmF0ZXMsIHJ1biB0dXJuIGZ1bmN0aW9uLlxuLy8gZnVuY3Rpb24gJ3R1cm4nIHdoaWNoIHdpbGwgcnVuIHRocm91Z2ggYSB0dXJuLlxuICAvLyBDb29yZGluYXRlcyB3aWxsIGJlIHNldCB0byBnYW1lYm9hcmQsIHRvIGNoZWNrIGlmIHRoZXJlIGlzIGEgaGl0IG9uIHRoZSBvcHBvbmVudHMgYm9hcmQuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBoaXQsIHdlIHdhbnQgdG8gc2lnbmlmeSB0aGVyZSBpcyBhIGhpdFxuICAgICAgLy8gV2Ugd2FudCB0byBjaGVjayBpZiBhIHNoaXAgaGFzIGZhbGxlblxuICAgICAgLy8gV2Ugd2FudCB0byBjaGVjayBpZiBhbGwgc2hpcHMgaGF2ZSBmYWxsZW5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIG1pc3MsIHdlIHdhbnQgdG8gc2lnbmlmeSB0aGF0IGl0IGlzIGEgbWlzc1xuICAgICAgLy8gV2Ugd2FudCB0byBhZGQgdG8gdGhlIG1pc3MgYXJyYXlcbiAgICAvLyBDaGFuZ2UgdGhlIGN1cnJlbnRUdXJuIHRvIHRoZSBvcHBvbmVudHMgdHVyblxuICAgIC8vIFVwZGF0ZSB0aGUgSFRNTCBEb20gdG8gc2lnbmlmeSB0aGF0IGl0IGlzIHRoZSBvcHBvbmVudHMgdHVyblxuY29uc3QgR2FtZSA9ICgpID0+IHtcbiAgY29uc3QgX3BsYXllcnMgPSB7fTtcbiAgbGV0IF9jdXJyZW50VHVybiA9IF9wbGF5ZXJzWzFdO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBsYXllcihwbGF5ZXJOYW1lKSB7XG4gICAgY29uc3QgcGxheWVyTnVtYmVyID0gX3BsYXllcnNbMV0gPyAyIDogMTtcblxuICAgIF9wbGF5ZXJzW3BsYXllck51bWJlcl0gPSB7XG4gICAgICBuYW1lOiBwbGF5ZXJOYW1lLFxuICAgICAgYm9hcmQ6IGdhbWVib2FyZEZucy5HYW1lYm9hcmQoKVxuICAgIH1cbiAgIFxuICAgIC8qXG4gICAgY29uc3QgY3J1aXNlciA9IFNoaXAoJ0NydWlzZXInLCAzKTtcbiAgICBjb25zdCBkZXN0cm95ZXIgPSBTaGlwKCdEZXN0cm95ZXInLCAyKTtcbiAgICBfcGxheWVyc1twbGF5ZXJOdW1iZXJdLmJvYXJkLmluc2VydChjcnVpc2VyLCBbMCwgMF0sIFswLCAyXSk7XG4gICAgX3BsYXllcnNbcGxheWVyTnVtYmVyXS5ib2FyZC5pbnNlcnQoZGVzdHJveWVyLCBbMSwgMF0sIFsyLCAwXSk7XG4gICAgKi9cblxuICAgIHJldHVybiBfcGxheWVyc1twbGF5ZXJOdW1iZXJdO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0UGxheWVyQm9hcmQocGxheWVyTnVtYmVyKSB7XG4gICAgY29uc3Qgc2hpcHMgPSBbWydCYXR0bGVzaGlwJywgNF0sIFsnQ3J1aXNlcicsIDNdXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0luc2VydFBhcmFtZXRlcnMoc2hpcExlbmd0aCwgc3RhcnQsIGVuZCkge1xuICAgIGxldCBkeDtcbiAgICBsZXQgZHk7XG4gICAgaWYgKE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSAhPT0gMCkge1xuICAgICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgKyAxO1xuICAgICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSlcbiAgICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pICsgMTtcbiAgICB9XG4gIFxuICAgIC8vIElmIGR4IGFuZCBkeSBhcmVuJ3QgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBjb29yZGluYXRlcyBnaXZlbiBhcmUgaW5jb3JyZWN0LlxuICAgIC8vIFRoaXMgaXMganVzdCBmb3IgbWFudWFsbHkgaW5wdXR0aW5nIGNvb3JkaW5hdGVzIGFuZCBub3QgZm9yIGZ1dHVyZS5cbiAgICBpZiAoZHggIT09IHNoaXBMZW5ndGggJiYgZHkgIT09IHNoaXBMZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyBJZiB0aGUgaG9yaXpvbnRhbCBpcyBjb3JyZWN0LCB0aGVuIGR5IG11c3QgYmUgMCBiZWNhdXNlIHRoZXJlIGlzIG5vIGRpYWdvbmFsIHNoaXAgcGxhY2VtZW50XG4gICAgfSBlbHNlIGlmIChkeCA9PT0gc2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIChkeSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XG4gICAgLy8gSWYgdGhlIHZlcnRpY2FsIGRpZmZlcmVuY2UgaXMgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBob3Jpem9udGFsIGRpZmZlcmVuY2Ugc2hvdWxkIGJlIDAuXG4gICAgfSBlbHNlIGlmIChkeSA9PT0gc2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIChkeCA9PT0gMCkgPyB0cnVlIDogZmFsc2U7IFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgX3BsYXllcnMsXG4gICAgY3JlYXRlUGxheWVyLFxuICAgIGNoZWNrSW5zZXJ0UGFyYW1ldGVyc1xuICB9O1xufVxuXG4vKlxuLy8gQ2FycmllciAob2NjdXBpZXMgNSBzcGFjZXMpLCBCYXR0bGVzaGlwICg0KSwgQ3J1aXNlciAoMyksIFN1Ym1hcmluZSAoMyksIGFuZCBEZXN0cm95ZXIgKDIpLlxuY29uc3QgY3JlYXRlUmFuZG9tQm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IGdhbWVib2FyZEZucy5HYW1lYm9hcmQoKTtcbiAgY29uc3Qgc2hpcEFycmF5ID0gW1NoaXAoJ0Rlc3Ryb3llcicsIDIpXTtcblxuICAvLyBSYW5kb21seSBhZGQgc2hpcHMgdG8gZ2FtZWJvYXJkLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHNoaXAgPSBzaGlwQXJyYXlbaV07XG4gICAgLy8gR2VuZXJhdGUgcmFuZG9tIHN0YXJ0aW5nIHBvc2l0aW9uIGluIGJldHdlZW4gMSBhbmQgMTEuXG4gICAgbGV0IHJhbmRvbVN0YXJ0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDExIC0gMSArIDEpICsgMSk7XG5cbiAgICAvLyBHZW5lcmF0ZSB3aGV0aGVyIGludGVnZXIgd2lsbCBiZSB4IG9yIHkuXG4gICAgY29uc3QgcmFuZG9tRGlyZWN0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDIgLSAxICsgMSkgKyAxKTtcbiAgICBjb25zb2xlLmxvZyhyYW5kb21EaXJlY3Rpb24pO1xuICAgIGxldCBzaGlwU3RhcnQgPSByYW5kb21EaXJlY3Rpb24gPT09IDEgPyBbcmFuZG9tU3RhcnQsIDBdIDogWzAsIHJhbmRvbVN0YXJ0XTtcbiAgICBjb25zb2xlLmxvZyhzaGlwU3RhcnQpO1xuICB9XG59XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBHYW1lOyIsImNvbnN0IEdhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgX2JvYXJkID0gQXJyYXkuZnJvbSh7bGVuZ3RoOiAxMH0sICgpID0+IEFycmF5KDEwKS5maWxsKCcnKSk7XG4gIGNvbnN0IF9zaGlwcyA9IHt9O1xuICBjb25zdCBfbWlzc2VkQXR0YWNrcyA9IFtdO1xuXG4gIC8vIHZhbGlkYXRlSW5zZXJ0IGZ1bmN0aW9uXG4gIC8vIEdpdmVuIGEgc3RhcnQgYW5kIGVuZCBwYXJhbWV0ZXJcbiAgLy8gR29pbmcgZnJvbSB0aGUgc3RhcnQgdG8gdGhlIGVuZCBtYXJrZXJcbiAgZnVuY3Rpb24gdmFsaWRhdGVJbnNlcnQoc3RhcnQsIGVuZCkge1xuICAgIGNvbnN0IGR4ID0gc3RhcnRbMF0gLSBlbmRbMF07XG4gICAgY29uc3QgZHkgPSBzdGFydFsxXSAtIGVuZFsxXTtcblxuICAgIGxldCBtYXJrZXIgPSBzdGFydDtcbiAgICBpZiAoZHgpIHtcbiAgICAgIHdoaWxlIChtYXJrZXJbMF0gIT09IGVuZFswXSkge1xuICAgICAgICBpZiAoX2JvYXJkW21hcmtlclsxXV1bbWFya2VyWzBdXSAhPT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR4IDwgMCkge1xuICAgICAgICAgIG1hcmtlciA9IFttYXJrZXJbMF0gKyAxLCBzdGFydFsxXV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFya2VyID0gW21hcmtlclswXSAtIDEsIHN0YXJ0WzFdXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAobWFya2VyWzFdICE9PSBlbmRbMV0pIHtcbiAgICAgICAgaWYgKF9ib2FyZFttYXJrZXJbMV1dW21hcmtlclswXV0gIT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSA8IDApIHtcbiAgICAgICAgICBtYXJrZXIgPSBbc3RhcnRbMF0sIG1hcmtlclsxXSArIDFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcmtlciA9IFtzdGFydFswXSwgbWFya2VyWzFdIC0gMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnQoc2hpcE9iaiwgc3RhcnQsIGVuZCkge1xuICAgIGxldCBzaGlwTGVuZ3RoID0gc2hpcE9iai5zaGlwTGVuZ3RoO1xuICAgIGlmIChjaGVja0luc2VydFBhcmFtZXRlcnMoc2hpcExlbmd0aCwgc3RhcnQsIGVuZCkpIHtcbiAgICAgIF9zaGlwc1tzaGlwT2JqLm5hbWVdID0gc2hpcE9iajtcbiAgICAgIGxldCBkeCA9IHN0YXJ0WzBdIC0gZW5kWzBdO1xuICAgICAgbGV0IGR5ID0gc3RhcnRbMV0gLSBlbmRbMV07XG4gICAgICBpZiAoZHgpIHtcbiAgICAgICAgZHggPSBNYXRoLmFicyhkeCkgKyAxO1xuICAgICAgICBsZXQgeE1hcmtlciA9IHN0YXJ0WzBdO1xuICAgICAgICB3aGlsZSAoZHgpIHtcbiAgICAgICAgICBpZiAoc3RhcnRbMF0gPiBlbmRbMF0pIHtcbiAgICAgICAgICAgIF9ib2FyZFtzdGFydFsxXV1beE1hcmtlcl0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgICB4TWFya2VyIC09IDE7XG4gICAgICAgICAgICBkeCAtPSAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfYm9hcmRbc3RhcnRbMV1dW3hNYXJrZXJdID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgICAgeE1hcmtlciArPSAxXG4gICAgICAgICAgICBkeCAtPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHkgPSBNYXRoLmFicyhkeSkgKyAxO1xuICAgICAgICBsZXQgeU1hcmtlciA9IHN0YXJ0WzFdO1xuICAgICAgICB3aGlsZSAoZHkpIHtcbiAgICAgICAgICBpZiAoc3RhcnRbMV0gPiBlbmRbMV0pIHtcbiAgICAgICAgICAgIF9ib2FyZFt5TWFya2VyXVtzdGFydFswXV0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgICB5TWFya2VyIC09IDE7XG4gICAgICAgICAgICBkeSAtPSAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfYm9hcmRbeU1hcmtlcl1bc3RhcnRbMF1dID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgICAgeU1hcmtlciArPSAxO1xuICAgICAgICAgICAgZHkgLT0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICByZXR1cm4gX2JvYXJkO1xuICAgIH0gZWxzZSB7XG4gICAgLy8gRWxzZSB3ZSByZXR1cm4gYSBpbmNvcnJlY3QgbWVzc2FnZT9cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKGNvb3JkKSB7XG4gICAgY29uc3QgYm9hcmRsb2NhdGlvbiA9IF9ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xuICAgIGlmIChib2FyZGxvY2F0aW9uKSB7XG4gICAgICBjb25zdCBzaGlwID0gX3NoaXBzW2JvYXJkbG9jYXRpb25dO1xuICAgICAgc2hpcC5oaXQoKTtcbiAgICAgIHJldHVybiAnU2hpdCBIaXQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBfbWlzc2VkQXR0YWNrcy5wdXNoKGNvb3JkKTtcbiAgICAgIHJldHVybiBjb29yZDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICBmb3IgKGNvbnN0IHNoaXBOYW1lIGluIF9zaGlwcykge1xuICAgICAgY29uc3Qgc2hpcCA9IF9zaGlwc1tzaGlwTmFtZV07XG4gICAgICBpZiAoc2hpcC5pc1N1bmsoKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgX2JvYXJkLFxuICAgIF9zaGlwcyxcbiAgICBfbWlzc2VkQXR0YWNrcyxcbiAgICB2YWxpZGF0ZUluc2VydCxcbiAgICBpbnNlcnQsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBnYW1lT3ZlclxuICB9XG59XG5cbmNvbnN0IGNoZWNrSW5zZXJ0UGFyYW1ldGVycyA9KHNoaXBMZW5ndGgsIHN0YXJ0LCBlbmQpID0+IHtcbiAgbGV0IGR4O1xuICBsZXQgZHk7XG4gIGlmIChNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgIT09IDApIHtcbiAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSArIDE7XG4gICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSlcbiAgfSBlbHNlIHtcbiAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKVxuICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pICsgMTtcbiAgfVxuXG4gIC8vIElmIGR4IGFuZCBkeSBhcmVuJ3QgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBjb29yZGluYXRlcyBnaXZlbiBhcmUgaW5jb3JyZWN0LlxuICAvLyBUaGlzIGlzIGp1c3QgZm9yIG1hbnVhbGx5IGlucHV0dGluZyBjb29yZGluYXRlcyBhbmQgbm90IGZvciBmdXR1cmUuXG4gIGlmIChkeCAhPT0gc2hpcExlbmd0aCAmJiBkeSAhPT0gc2hpcExlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gSWYgdGhlIGhvcml6b250YWwgaXMgY29ycmVjdCwgdGhlbiBkeSBtdXN0IGJlIDAgYmVjYXVzZSB0aGVyZSBpcyBubyBkaWFnb25hbCBzaGlwIHBsYWNlbWVudFxuICB9IGVsc2UgaWYgKGR4ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgcmV0dXJuIChkeSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XG4gIC8vIElmIHRoZSB2ZXJ0aWNhbCBkaWZmZXJlbmNlIGlzIHRoZSBzaGlwIGxlbmd0aCwgdGhlbiB0aGUgaG9yaXpvbnRhbCBkaWZmZXJlbmNlIHNob3VsZCBiZSAwLlxuICB9IGVsc2UgaWYgKGR5ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgcmV0dXJuIChkeCA9PT0gMCkgPyB0cnVlIDogZmFsc2U7IFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVja0luc2VydFBhcmFtZXRlcnMsXG4gIEdhbWVib2FyZFxufTsiLCIvKlxuUkVNRU1CRVIgeW91IG9ubHkgaGF2ZSB0byB0ZXN0IHlvdXIgb2JqZWN04oCZcyBwdWJsaWMgaW50ZXJmYWNlLlxuT25seSBtZXRob2RzIG9yIHByb3BlcnRpZXMgdGhhdCBhcmUgdXNlZCBvdXRzaWRlIG9mIHlvdXIg4oCYc2hpcOKAmSBvYmplY3QgbmVlZCB1bml0IHRlc3RzLlxuKi9cblxuLy8gU2hpcHMgc2hvdWxkIGhhdmUgYSBoaXQoKSBmdW5jdGlvbiB0aGF0IGluY3JlYXNlcyB0aGUgbnVtYmVyIG9mIOKAmGhpdHPigJkgaW4geW91ciBzaGlwLlxuXG4vLyBpc1N1bmsoKSBzaG91bGQgYmUgYSBmdW5jdGlvbiB0aGF0IGNhbGN1bGF0ZXMgaXQgYmFzZWQgb24gdGhlaXIgbGVuZ3RoIFxuLy8gYW5kIHRoZSBudW1iZXIgb2Yg4oCYaGl0c+KAmS5cbmNvbnN0IFNoaXAgPSAobmFtZSwgaGl0cG9pbnRzKSA9PiB7XG4gIGxldCBfaGl0cG9pbnRzID0gaGl0cG9pbnRzO1xuICBjb25zdCBzaGlwTGVuZ3RoID0gaGl0cG9pbnRzO1xuICBsZXQgX3N1bmsgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBoaXQoKSB7XG4gICAgX2hpdHBvaW50cyAtPSAxO1xuXG4gICAgaWYgKCFfaGl0cG9pbnRzKSB7XG4gICAgICBfc3VuayA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9oaXRwb2ludHM7XG4gIH1cblxuICBmdW5jdGlvbiBpc1N1bmsoKSB7XG4gICAgcmV0dXJuIF9zdW5rO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIHNoaXBMZW5ndGgsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGlwOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJjb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJyk7XG5jb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGdhbWUgPSBHYW1lKCk7XG4gIGdhbWUuY3JlYXRlUGxheWVyKCdKdXN0aW4nKTtcbiAgZ2FtZS5jcmVhdGVQbGF5ZXIoJ0plZmYnKTtcbiAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgZGlzcGxheUdhbWVCb2FyZCgyLCBnYW1lLl9wbGF5ZXJzWycyJ10uYm9hcmQuX2JvYXJkKTtcblxuICAvLyBHYW1lIFBoYXNlXG4gIC8vIFNldCBQbGF5ZXIgMSBCb2FyZFxuICAgIC8vIEFzayBwbGF5ZXIgZm9yIGlucHV0IGNvb3JkaW5hdGVzIGZvciAzIHNoaXBzXG4gIC8vIFNldCBQbGF5ZXIgMiBCb2FyZFxuICAgIC8vIEFzayBwbGF5ZXIgZm9yIGlucHV0IGNvb3JkaW5hdGVzIGZvciAzIHNoaXBzXG4gIC8vIEFzayBQbGF5ZXIgMSBmb3IgY29vcmRpbmF0ZXMgdG8gaGl0XG4gIC8vIEFzayBQbGF5ZXIgMiBmb3IgY29vcmRpbmF0ZXMgdG8gaGl0XG4gIC8vIHNldFBsYXllck9uZUJvYXJkKCk7XG4gIC8vIHNldFBsYXllclR3b0JvYXJkKCk7XG4gIHNldEluc2VydFNoaXBMaXN0ZW5lcihnYW1lKTtcbn0pO1xuXG5jb25zdCBzZXRJbnNlcnRTaGlwTGlzdGVuZXIgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBmb3JtSW5zZXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0taW5zZXJ0LXNoaXBzJyk7XG4gIGNvbnN0IGRpdkluc2VydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtaW5zZXJ0Jyk7XG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1jb29yZGluYXRlcycpO1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1pbnNlcnQtZXJyb3InKTtcbiAgY29uc3Qgc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1zdWJtaXQnKTtcblxuICBsZXQgY3VycmVudFBsYXllciA9IGdhbWUuX3BsYXllcnNbMV07XG4gIHN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGN1cnJlbnRTaGlwID0gZGl2SW5zZXJ0LmdldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJyk7XG4gICAgLy8gJ0E0IEE1JyAtLT4gW0E0LCBBNV0gfHwgW1swLCA0XSwgWzAsIDVdXTtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHRyYW5zZm9ybUlucHV0VG9Db29yZChpbnB1dC52YWx1ZSk7XG4gICAgaWYgKGN1cnJlbnRQbGF5ZXIuYm9hcmQudmFsaWRhdGVJbnNlcnQoY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkgeyAgICAgIFxuICAgICAgaWYgKGN1cnJlbnRTaGlwID09PSAnY3J1aXNlcicgJiYgZ2FtZS5jaGVja0luc2VydFBhcmFtZXRlcnMoMywgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICBjb25zdCBzaGlwID0gU2hpcCgnQ3J1aXNlcicsIDMpO1xuICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICBkaXZJbnNlcnQuc2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnLCAnYmF0dGxlc2hpcCcpO1xuICAgICAgICBkaXZJbnNlcnQuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSwgY2hvb3NlIHdoZXJlIHRvIHBsYWNlIHlvdXIgYmF0dGxlc2hpcCAoTGVuZ3RoOiA1IHBsYWNlcyk6YDtcbiAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50U2hpcCA9PT0gJ2JhdHRsZXNoaXAnICYmIGdhbWUuY2hlY2tJbnNlcnRQYXJhbWV0ZXJzKDUsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0JhdHRsZXNoaXAnLCA1KTtcbiAgICAgICAgY3VycmVudFBsYXllci5ib2FyZC5pbnNlcnQoc2hpcCwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKTtcbiAgICAgICAgZGl2SW5zZXJ0LnNldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJywgJ2Rlc3Ryb3llcicpO1xuICAgICAgICBkaXZJbnNlcnQuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSwgY2hvb3NlIHdoZXJlIHRvIHBsYWNlIHlvdXIgZGVzdHJveWVyIChMZW5ndGg6IDIgcGxhY2VzKTpgO1xuICAgICAgICBpbnB1dC52YWx1ZSA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTaGlwID09PSAnZGVzdHJveWVyJyAmJiBnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycygyLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBTaGlwKCdDcnVpc2VyJywgMik7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIuYm9hcmQuaW5zZXJ0KHNoaXAsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSk7XG4gICAgICAgIGlucHV0LnZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IGdhbWUuX3BsYXllcnNbMV0pIHtcbiAgICAgICAgICBjdXJyZW50UGxheWVyID0gZ2FtZS5fcGxheWVyc1syXTtcbiAgICAgICAgICBkaXZJbnNlcnQuc2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnLCAnY3J1aXNlcicpO1xuICAgICAgICAgIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtjdXJyZW50UGxheWVyLm5hbWV9LCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBjcnVpc2VyIChMZW5ndGg6IDMgcGxhY2VzKTpgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvcm1JbnNlcnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgyLCBnYW1lLl9wbGF5ZXJzWycyJ10uYm9hcmQuX2JvYXJkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDaGFuZ2UgU3BhbiBFcnJvciBtZXNzYWdlIHRvIG1hdGNoIGVycm9yXG4gICAgICAvLyBVbmhpZGUgU3BhbiBFcnJvci5cbiAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3InO1xuICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICB9XG4gIH0pO1xufVxuXG5jb25zdCB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQgPSAoaW5wdXRWYWwpID0+IHtcbiAgY29uc3QgYXJyID0gaW5wdXRWYWwuc3BsaXQoJyAnKTtcbiAgY29uc3QgYWxwaCA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSyddO1xuICBcbiAgY29uc3QgaWR4U3RhcnQgPSBhbHBoLmZpbmRJbmRleCgoZWxlKSA9PiB7XG4gICAgcmV0dXJuIGVsZSA9PT0gYXJyWzBdWzBdO1xuICB9KTtcblxuICBjb25zdCBpZHhFbmQgPSBhbHBoLmZpbmRJbmRleCgoZWxlKSA9PiB7XG4gICAgcmV0dXJuIGVsZSA9PT0gYXJyWzFdWzBdO1xuICB9KTtcblxuICByZXR1cm4gW1tpZHhTdGFydCwgcGFyc2VJbnQoYXJyWzBdLnNsaWNlKDEpKSAtIDFdLCBbaWR4RW5kLCBwYXJzZUludChhcnJbMV0uc2xpY2UoMSkpIC0gMV1dO1xufVxuXG4vKlxuY29uc3Qgc2V0SW5zZXJ0U2hpcE5hbWUgPSAoc3RhcnQsIHNoaXBOYW1lKSA9PiB7XG4gIGNvbnN0IG1lc3NhZ2UgPSAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBtZXNzYWdlLmlubmVySFRNTCA9IHN0YXJ0ID8gYFNldCAke3NoaXBOYW1lfSBzdGFydGluZyBsb2NhdGlvbjogYCA6IGBTZXQgJHtzaGlwTmFtZX0gZW5kaW5nIGxvY2F0aW9uOiBgOyBcbn1cblxuLy8gcGFyYW1ldGVycyA9IHNoaXBOYW1lLCBzaGlwTGVuZ3RoXG5jb25zdCBwcm9tcHRTaGlwSW5zZXJ0ID0gKCkgPT4ge1xuICBsZXQgc2hpcENvb3JkID0gW107XG4gIGNvbnN0IGNvb3JkSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29vcmQnKTtcbiAgY29uc3QgaW5wdXRTdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0Jyk7XG5cbiAgaW5wdXRTdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBzaGlwQ29vcmQucHVzaChjb29yZElucHV0LnZhbHVlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHNoaXBDb29yZDtcbn1cblxuY29uc3QgaW5zZXJ0U2hpcCA9ICgpID0+IHtcbiAgY29uc29sZS5sb2cocHJvbXB0U2hpcEluc2VydCgpKTsgXG59XG4qL1xuXG5jb25zdCBkaXNwbGF5R2FtZUJvYXJkID0gKHBsYXllck51bWJlciwgcGxheWVyQm9hcmQpID0+IHtcbiAgY29uc3Qgcm93TGlzdEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgZGl2LmJvYXJkW2RhdGEtcGxheWVyPVwiJHtwbGF5ZXJOdW1iZXJ9XCJdID4gdWwgPiBsaWApO1xuICBjb25zb2xlLmxvZyhyb3dMaXN0SXRlbXMpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBib2FyZFJvdyA9IHBsYXllckJvYXJkW2ldO1xuICAgIGNvbnN0IGRpc3BsYXlCb2FyZFJvdyA9IHJvd0xpc3RJdGVtc1tpICsgMV07XG4gICAgY29uc3Qgc3BhbnMgPSBkaXNwbGF5Qm9hcmRSb3cuY2hpbGRyZW47XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkUm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoYm9hcmRSb3dbal0gPT09ICcnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhbnNbaiArIDFdLmlubmVySFRNTCA9ICdTJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=