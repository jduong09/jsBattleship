/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/game.js":
/*!************************!*\
  !*** ./src/js/game.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const gameboardFns = __webpack_require__(/*! ./gameboard.js */ "./src/js/gameboard.js");
const Ship = __webpack_require__(/*! ./ship.js */ "./src/js/ship.js");

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

  function validateInsert(start, end) {
    let marker = start;
    if (start[0] === 0) {

      while (marker[1] !== end[1]) {
        if (_board[marker[1]][marker[0]] !== '') {
          throw new Error('Invalid Insert');
        }
        marker = [start[0], marker[1] + 1];
      }
    } else {
      while (marker[0] !== end[0]) {
        if (_board[marker[1]][marker[0]] !== '') {
          throw new Error('Invalid Insert');
        }
        marker = [marker[0] + 1, start[1]];
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
      _board[start[1]][start[0]] = shipObj.name;
      if (dx) {
        let xMarker = start[0];
        while (dx) {
          if (dx > 0) {
            _board[start[1]][xMarker - 1] = shipObj.name;
            xMarker -= 1;
            dx -= 1;
          } else {
            _board[start[1]][xMarker + 1] = shipObj.name;
            xMarker += 1
            dx += 1;
          }
        }
      } else {
        let yMarker = start[1];
        while (dy) {
          if (dy > 0) {
            _board[yMarker - 1][start[0]] = shipObj.name;
            yMarker -= 1;
            dy -= 1;
          } else {
            _board[yMarker + 1][start[0]] = shipObj.name;
            yMarker += 1;
            dy += 1;
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

document.addEventListener('DOMContentLoaded', () => {
  const game = Game();
  game.createPlayer('Justin');
  game.createPlayer('Jeff');
  displayGameBoard(1, game._players['1'].board._board);
  displayGameBoard(2, game._players['2'].board._board);
  insertShip();
});

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
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxxQkFBcUIsbUJBQU8sQ0FBQyw2Q0FBZ0I7QUFDN0MsYUFBYSxtQkFBTyxDQUFDLG1DQUFXOztBQUVoQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixrQkFBa0I7O0FBRXRDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQzdEQTtBQUNBLDZCQUE2QixXQUFXO0FBQ3hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O1VDcENBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7OztBQ3RCQSxhQUFhLG1CQUFPLENBQUMsZ0NBQVE7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EscUNBQXFDLFVBQVUsOEJBQThCLFVBQVU7QUFDdkY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkVBQTJFLGFBQWE7O0FBRXhGLGtCQUFrQix3QkFBd0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixxQkFBcUI7QUFDekM7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC8uL3NyYy9qcy9zaGlwLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2FtZWJvYXJkRm5zID0gcmVxdWlyZSgnLi9nYW1lYm9hcmQuanMnKTtcbmNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAuanMnKTtcblxuY29uc3QgR2FtZSA9ICgpID0+IHtcbiAgY29uc3QgX3BsYXllcnMgPSB7fTtcblxuICBmdW5jdGlvbiBjcmVhdGVQbGF5ZXIocGxheWVyTmFtZSkge1xuICAgIGNvbnN0IHBsYXllck51bWJlciA9IF9wbGF5ZXJzWzFdID8gMiA6IDE7XG5cbiAgICBfcGxheWVyc1twbGF5ZXJOdW1iZXJdID0ge1xuICAgICAgbmFtZTogcGxheWVyTmFtZSxcbiAgICAgIGJvYXJkOiBnYW1lYm9hcmRGbnMuR2FtZWJvYXJkKClcbiAgICB9XG4gICBcbiAgICBjb25zdCBjcnVpc2VyID0gU2hpcCgnQ3J1aXNlcicsIDMpO1xuICAgIGNvbnN0IGRlc3Ryb3llciA9IFNoaXAoJ0Rlc3Ryb3llcicsIDIpO1xuICAgIF9wbGF5ZXJzW3BsYXllck51bWJlcl0uYm9hcmQuaW5zZXJ0KGNydWlzZXIsIFswLCAwXSwgWzAsIDJdKTtcbiAgICBfcGxheWVyc1twbGF5ZXJOdW1iZXJdLmJvYXJkLmluc2VydChkZXN0cm95ZXIsIFsxLCAwXSwgWzIsIDBdKTtcblxuICAgIHJldHVybiBfcGxheWVyc1twbGF5ZXJOdW1iZXJdO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0UGxheWVyQm9hcmQocGxheWVyTnVtYmVyKSB7XG4gICAgY29uc3Qgc2hpcHMgPSBbWydCYXR0bGVzaGlwJywgNF0sIFsnQ3J1aXNlcicsIDNdXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIF9wbGF5ZXJzLFxuICAgIGNyZWF0ZVBsYXllclxuICB9O1xufVxuXG4vKlxuLy8gQ2FycmllciAob2NjdXBpZXMgNSBzcGFjZXMpLCBCYXR0bGVzaGlwICg0KSwgQ3J1aXNlciAoMyksIFN1Ym1hcmluZSAoMyksIGFuZCBEZXN0cm95ZXIgKDIpLlxuY29uc3QgY3JlYXRlUmFuZG9tQm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IGdhbWVib2FyZEZucy5HYW1lYm9hcmQoKTtcbiAgY29uc3Qgc2hpcEFycmF5ID0gW1NoaXAoJ0Rlc3Ryb3llcicsIDIpXTtcblxuICAvLyBSYW5kb21seSBhZGQgc2hpcHMgdG8gZ2FtZWJvYXJkLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHNoaXAgPSBzaGlwQXJyYXlbaV07XG4gICAgLy8gR2VuZXJhdGUgcmFuZG9tIHN0YXJ0aW5nIHBvc2l0aW9uIGluIGJldHdlZW4gMSBhbmQgMTEuXG4gICAgbGV0IHJhbmRvbVN0YXJ0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDExIC0gMSArIDEpICsgMSk7XG5cbiAgICAvLyBHZW5lcmF0ZSB3aGV0aGVyIGludGVnZXIgd2lsbCBiZSB4IG9yIHkuXG4gICAgY29uc3QgcmFuZG9tRGlyZWN0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDIgLSAxICsgMSkgKyAxKTtcbiAgICBjb25zb2xlLmxvZyhyYW5kb21EaXJlY3Rpb24pO1xuICAgIGxldCBzaGlwU3RhcnQgPSByYW5kb21EaXJlY3Rpb24gPT09IDEgPyBbcmFuZG9tU3RhcnQsIDBdIDogWzAsIHJhbmRvbVN0YXJ0XTtcbiAgICBjb25zb2xlLmxvZyhzaGlwU3RhcnQpO1xuICB9XG59XG4qL1xuXG5jb25zdCBuZXdHYW1lID0gR2FtZSgpO1xubmV3R2FtZS5jcmVhdGVQbGF5ZXIoJ0p1c3RpbicpO1xubmV3R2FtZS5jcmVhdGVQbGF5ZXIoJ0plZmYnKTtcbmNvbnNvbGUubG9nKG5ld0dhbWUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7IiwiY29uc3QgR2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBfYm9hcmQgPSBBcnJheS5mcm9tKHtsZW5ndGg6IDEwfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwoJycpKTtcbiAgY29uc3QgX3NoaXBzID0ge307XG4gIGNvbnN0IF9taXNzZWRBdHRhY2tzID0gW107XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVJbnNlcnQoc3RhcnQsIGVuZCkge1xuICAgIGxldCBtYXJrZXIgPSBzdGFydDtcbiAgICBpZiAoc3RhcnRbMF0gPT09IDApIHtcblxuICAgICAgd2hpbGUgKG1hcmtlclsxXSAhPT0gZW5kWzFdKSB7XG4gICAgICAgIGlmIChfYm9hcmRbbWFya2VyWzFdXVttYXJrZXJbMF1dICE9PSAnJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBJbnNlcnQnKTtcbiAgICAgICAgfVxuICAgICAgICBtYXJrZXIgPSBbc3RhcnRbMF0sIG1hcmtlclsxXSArIDFdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAobWFya2VyWzBdICE9PSBlbmRbMF0pIHtcbiAgICAgICAgaWYgKF9ib2FyZFttYXJrZXJbMV1dW21hcmtlclswXV0gIT09ICcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEluc2VydCcpO1xuICAgICAgICB9XG4gICAgICAgIG1hcmtlciA9IFttYXJrZXJbMF0gKyAxLCBzdGFydFsxXV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5zZXJ0KHNoaXBPYmosIHN0YXJ0LCBlbmQpIHtcbiAgICBsZXQgc2hpcExlbmd0aCA9IHNoaXBPYmouc2hpcExlbmd0aDtcbiAgICBpZiAoY2hlY2tJbnNlcnRQYXJhbWV0ZXJzKHNoaXBMZW5ndGgsIHN0YXJ0LCBlbmQpKSB7XG4gICAgICBfc2hpcHNbc2hpcE9iai5uYW1lXSA9IHNoaXBPYmo7XG4gICAgICBsZXQgZHggPSBzdGFydFswXSAtIGVuZFswXTtcbiAgICAgIGxldCBkeSA9IHN0YXJ0WzFdIC0gZW5kWzFdO1xuICAgICAgX2JvYXJkW3N0YXJ0WzFdXVtzdGFydFswXV0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICBpZiAoZHgpIHtcbiAgICAgICAgbGV0IHhNYXJrZXIgPSBzdGFydFswXTtcbiAgICAgICAgd2hpbGUgKGR4KSB7XG4gICAgICAgICAgaWYgKGR4ID4gMCkge1xuICAgICAgICAgICAgX2JvYXJkW3N0YXJ0WzFdXVt4TWFya2VyIC0gMV0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgICB4TWFya2VyIC09IDE7XG4gICAgICAgICAgICBkeCAtPSAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfYm9hcmRbc3RhcnRbMV1dW3hNYXJrZXIgKyAxXSA9IHNoaXBPYmoubmFtZTtcbiAgICAgICAgICAgIHhNYXJrZXIgKz0gMVxuICAgICAgICAgICAgZHggKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB5TWFya2VyID0gc3RhcnRbMV07XG4gICAgICAgIHdoaWxlIChkeSkge1xuICAgICAgICAgIGlmIChkeSA+IDApIHtcbiAgICAgICAgICAgIF9ib2FyZFt5TWFya2VyIC0gMV1bc3RhcnRbMF1dID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgICAgeU1hcmtlciAtPSAxO1xuICAgICAgICAgICAgZHkgLT0gMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2JvYXJkW3lNYXJrZXIgKyAxXVtzdGFydFswXV0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgICB5TWFya2VyICs9IDE7XG4gICAgICAgICAgICBkeSArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIHJldHVybiBfYm9hcmQ7XG4gICAgfSBlbHNlIHtcbiAgICAvLyBFbHNlIHdlIHJldHVybiBhIGluY29ycmVjdCBtZXNzYWdlP1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soY29vcmQpIHtcbiAgICBjb25zdCBib2FyZGxvY2F0aW9uID0gX2JvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV07XG4gICAgaWYgKGJvYXJkbG9jYXRpb24pIHtcbiAgICAgIGNvbnN0IHNoaXAgPSBfc2hpcHNbYm9hcmRsb2NhdGlvbl07XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgcmV0dXJuICdTaGl0IEhpdCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9taXNzZWRBdHRhY2tzLnB1c2goY29vcmQpO1xuICAgICAgcmV0dXJuIGNvb3JkO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdhbWVPdmVyKCkge1xuICAgIGZvciAoY29uc3Qgc2hpcE5hbWUgaW4gX3NoaXBzKSB7XG4gICAgICBjb25zdCBzaGlwID0gX3NoaXBzW3NoaXBOYW1lXTtcbiAgICAgIGlmIChzaGlwLmlzU3VuaygpKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cblxuXG4gIHJldHVybiB7XG4gICAgX2JvYXJkLFxuICAgIF9zaGlwcyxcbiAgICBfbWlzc2VkQXR0YWNrcyxcbiAgICB2YWxpZGF0ZUluc2VydCxcbiAgICBpbnNlcnQsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBnYW1lT3ZlclxuICB9XG59XG5cbmNvbnN0IGNoZWNrSW5zZXJ0UGFyYW1ldGVycyA9KHNoaXBMZW5ndGgsIHN0YXJ0LCBlbmQpID0+IHtcbiAgbGV0IGR4O1xuICBsZXQgZHk7XG4gIGlmIChNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgIT09IDApIHtcbiAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSArIDE7XG4gICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSlcbiAgfSBlbHNlIHtcbiAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKVxuICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pICsgMTtcbiAgfVxuXG4gIC8vIElmIGR4IGFuZCBkeSBhcmVuJ3QgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBjb29yZGluYXRlcyBnaXZlbiBhcmUgaW5jb3JyZWN0LlxuICAvLyBUaGlzIGlzIGp1c3QgZm9yIG1hbnVhbGx5IGlucHV0dGluZyBjb29yZGluYXRlcyBhbmQgbm90IGZvciBmdXR1cmUuXG4gIGlmIChkeCAhPT0gc2hpcExlbmd0aCAmJiBkeSAhPT0gc2hpcExlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gSWYgdGhlIGhvcml6b250YWwgaXMgY29ycmVjdCwgdGhlbiBkeSBtdXN0IGJlIDAgYmVjYXVzZSB0aGVyZSBpcyBubyBkaWFnb25hbCBzaGlwIHBsYWNlbWVudFxuICB9IGVsc2UgaWYgKGR4ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgcmV0dXJuIChkeSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XG4gIC8vIElmIHRoZSB2ZXJ0aWNhbCBkaWZmZXJlbmNlIGlzIHRoZSBzaGlwIGxlbmd0aCwgdGhlbiB0aGUgaG9yaXpvbnRhbCBkaWZmZXJlbmNlIHNob3VsZCBiZSAwLlxuICB9IGVsc2UgaWYgKGR5ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgcmV0dXJuIChkeCA9PT0gMCkgPyB0cnVlIDogZmFsc2U7IFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVja0luc2VydFBhcmFtZXRlcnMsXG4gIEdhbWVib2FyZFxufTsiLCIvKlxuUkVNRU1CRVIgeW91IG9ubHkgaGF2ZSB0byB0ZXN0IHlvdXIgb2JqZWN04oCZcyBwdWJsaWMgaW50ZXJmYWNlLlxuT25seSBtZXRob2RzIG9yIHByb3BlcnRpZXMgdGhhdCBhcmUgdXNlZCBvdXRzaWRlIG9mIHlvdXIg4oCYc2hpcOKAmSBvYmplY3QgbmVlZCB1bml0IHRlc3RzLlxuKi9cblxuLy8gU2hpcHMgc2hvdWxkIGhhdmUgYSBoaXQoKSBmdW5jdGlvbiB0aGF0IGluY3JlYXNlcyB0aGUgbnVtYmVyIG9mIOKAmGhpdHPigJkgaW4geW91ciBzaGlwLlxuXG4vLyBpc1N1bmsoKSBzaG91bGQgYmUgYSBmdW5jdGlvbiB0aGF0IGNhbGN1bGF0ZXMgaXQgYmFzZWQgb24gdGhlaXIgbGVuZ3RoIFxuLy8gYW5kIHRoZSBudW1iZXIgb2Yg4oCYaGl0c+KAmS5cbmNvbnN0IFNoaXAgPSAobmFtZSwgaGl0cG9pbnRzKSA9PiB7XG4gIGxldCBfaGl0cG9pbnRzID0gaGl0cG9pbnRzO1xuICBjb25zdCBzaGlwTGVuZ3RoID0gaGl0cG9pbnRzO1xuICBsZXQgX3N1bmsgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBoaXQoKSB7XG4gICAgX2hpdHBvaW50cyAtPSAxO1xuXG4gICAgaWYgKCFfaGl0cG9pbnRzKSB7XG4gICAgICBfc3VuayA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9oaXRwb2ludHM7XG4gIH1cblxuICBmdW5jdGlvbiBpc1N1bmsoKSB7XG4gICAgcmV0dXJuIF9zdW5rO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIHNoaXBMZW5ndGgsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGlwOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJjb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJyk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGdhbWUgPSBHYW1lKCk7XG4gIGdhbWUuY3JlYXRlUGxheWVyKCdKdXN0aW4nKTtcbiAgZ2FtZS5jcmVhdGVQbGF5ZXIoJ0plZmYnKTtcbiAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgZGlzcGxheUdhbWVCb2FyZCgyLCBnYW1lLl9wbGF5ZXJzWycyJ10uYm9hcmQuX2JvYXJkKTtcbiAgaW5zZXJ0U2hpcCgpO1xufSk7XG5cbmNvbnN0IHNldEluc2VydFNoaXBOYW1lID0gKHN0YXJ0LCBzaGlwTmFtZSkgPT4ge1xuICBjb25zdCBtZXNzYWdlID0gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW1lc3NhZ2UnKTtcbiAgbWVzc2FnZS5pbm5lckhUTUwgPSBzdGFydCA/IGBTZXQgJHtzaGlwTmFtZX0gc3RhcnRpbmcgbG9jYXRpb246IGAgOiBgU2V0ICR7c2hpcE5hbWV9IGVuZGluZyBsb2NhdGlvbjogYDsgXG59XG5cbi8vIHBhcmFtZXRlcnMgPSBzaGlwTmFtZSwgc2hpcExlbmd0aFxuY29uc3QgcHJvbXB0U2hpcEluc2VydCA9ICgpID0+IHtcbiAgbGV0IHNoaXBDb29yZCA9IFtdO1xuICBjb25zdCBjb29yZElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb3JkJyk7XG4gIGNvbnN0IGlucHV0U3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdCcpO1xuXG4gIGlucHV0U3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgc2hpcENvb3JkLnB1c2goY29vcmRJbnB1dC52YWx1ZSk7XG4gIH0pO1xuXG4gIHJldHVybiBzaGlwQ29vcmQ7XG59XG5cbmNvbnN0IGluc2VydFNoaXAgPSAoKSA9PiB7XG4gIGNvbnNvbGUubG9nKHByb21wdFNoaXBJbnNlcnQoKSk7XG59XG5cbmNvbnN0IGRpc3BsYXlHYW1lQm9hcmQgPSAocGxheWVyTnVtYmVyLCBwbGF5ZXJCb2FyZCkgPT4ge1xuICBjb25zdCByb3dMaXN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl0gPiB1bCA+IGxpYCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGJvYXJkUm93ID0gcGxheWVyQm9hcmRbaV07XG4gICAgY29uc3QgZGlzcGxheUJvYXJkUm93ID0gcm93TGlzdEl0ZW1zW2kgKyAxXTtcbiAgICBjb25zdCBzcGFucyA9IGRpc3BsYXlCb2FyZFJvdy5jaGlsZHJlbjtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmRSb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChib2FyZFJvd1tqXSA9PT0gJycpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFuc1tqICsgMV0uaW5uZXJIVE1MID0gJ1MnO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==