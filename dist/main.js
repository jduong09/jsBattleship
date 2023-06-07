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
    console.log(coordinates);

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

  console.log(parseInt(arr[0].slice(1)), parseInt(arr[1].slice(1)));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxxQkFBcUIsbUJBQU8sQ0FBQyw2Q0FBZ0I7QUFDN0MsYUFBYSxtQkFBTyxDQUFDLG1DQUFXOztBQUVoQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLGtCQUFrQjs7QUFFdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDbEdBO0FBQ0EsNkJBQTZCLFdBQVc7QUFDeEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzVIQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztVQ3BDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7QUN0QkEsYUFBYSxtQkFBTyxDQUFDLGdDQUFRO0FBQzdCLGFBQWEsbUJBQU8sQ0FBQyxnQ0FBUTs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxtQkFBbUI7QUFDcEQ7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLG1CQUFtQjtBQUNwRDtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsbUJBQW1CO0FBQ3RELFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxVQUFVLDhCQUE4QixVQUFVO0FBQ3ZGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkVBQTJFLGFBQWE7QUFDeEY7O0FBRUEsa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLHFCQUFxQjtBQUN6QztBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2pzYmF0dGxlc2hpcC8uL3NyYy9qcy9nYW1lLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC8uL3NyYy9qcy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwLy4vc3JjL2pzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC8uL3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnYW1lYm9hcmRGbnMgPSByZXF1aXJlKCcuL2dhbWVib2FyZC5qcycpO1xuY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcC5qcycpO1xuXG4vLyBGb3IgR2FtZSB0byBSdW4uXG4vLyBIYXMgcGxheWVyc19vYmplY3Qgd2hpY2ggaG9sZHMgdHdvIHBsYXllciBvYmplY3RzLCBmb3IgdGhlIGdhbWVcbi8vIEhhcyBjdXJyZW50VHVybiB3aGljaCBrZWVwcyB0cmFjayBvZiB3aG9zZSB0dXJuIGl0IGlzLlxuXG4vLyBIVE1MIGhhcyBpbnB1dCBmb3IgY2hvb3NpbmcgY29vcmRpbmF0ZXMgdG8gc3RyaWtlIG9uIGJvYXJkLlxuLy8gT25jZSB1c2VyIGhhcyBpbnB1dHRlZCB2YWxpZCBjb29yZGluYXRlcywgcnVuIHR1cm4gZnVuY3Rpb24uXG4vLyBmdW5jdGlvbiAndHVybicgd2hpY2ggd2lsbCBydW4gdGhyb3VnaCBhIHR1cm4uXG4gIC8vIENvb3JkaW5hdGVzIHdpbGwgYmUgc2V0IHRvIGdhbWVib2FyZCwgdG8gY2hlY2sgaWYgdGhlcmUgaXMgYSBoaXQgb24gdGhlIG9wcG9uZW50cyBib2FyZC5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIGhpdCwgd2Ugd2FudCB0byBzaWduaWZ5IHRoZXJlIGlzIGEgaGl0XG4gICAgICAvLyBXZSB3YW50IHRvIGNoZWNrIGlmIGEgc2hpcCBoYXMgZmFsbGVuXG4gICAgICAvLyBXZSB3YW50IHRvIGNoZWNrIGlmIGFsbCBzaGlwcyBoYXZlIGZhbGxlblxuICAgIC8vIElmIHRoZXJlIGlzIGEgbWlzcywgd2Ugd2FudCB0byBzaWduaWZ5IHRoYXQgaXQgaXMgYSBtaXNzXG4gICAgICAvLyBXZSB3YW50IHRvIGFkZCB0byB0aGUgbWlzcyBhcnJheVxuICAgIC8vIENoYW5nZSB0aGUgY3VycmVudFR1cm4gdG8gdGhlIG9wcG9uZW50cyB0dXJuXG4gICAgLy8gVXBkYXRlIHRoZSBIVE1MIERvbSB0byBzaWduaWZ5IHRoYXQgaXQgaXMgdGhlIG9wcG9uZW50cyB0dXJuXG5jb25zdCBHYW1lID0gKCkgPT4ge1xuICBjb25zdCBfcGxheWVycyA9IHt9O1xuICBsZXQgX2N1cnJlbnRUdXJuID0gX3BsYXllcnNbMV07XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGxheWVyKHBsYXllck5hbWUpIHtcbiAgICBjb25zdCBwbGF5ZXJOdW1iZXIgPSBfcGxheWVyc1sxXSA/IDIgOiAxO1xuXG4gICAgX3BsYXllcnNbcGxheWVyTnVtYmVyXSA9IHtcbiAgICAgIG5hbWU6IHBsYXllck5hbWUsXG4gICAgICBib2FyZDogZ2FtZWJvYXJkRm5zLkdhbWVib2FyZCgpXG4gICAgfVxuICAgXG4gICAgLypcbiAgICBjb25zdCBjcnVpc2VyID0gU2hpcCgnQ3J1aXNlcicsIDMpO1xuICAgIGNvbnN0IGRlc3Ryb3llciA9IFNoaXAoJ0Rlc3Ryb3llcicsIDIpO1xuICAgIF9wbGF5ZXJzW3BsYXllck51bWJlcl0uYm9hcmQuaW5zZXJ0KGNydWlzZXIsIFswLCAwXSwgWzAsIDJdKTtcbiAgICBfcGxheWVyc1twbGF5ZXJOdW1iZXJdLmJvYXJkLmluc2VydChkZXN0cm95ZXIsIFsxLCAwXSwgWzIsIDBdKTtcbiAgICAqL1xuXG4gICAgcmV0dXJuIF9wbGF5ZXJzW3BsYXllck51bWJlcl07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRQbGF5ZXJCb2FyZChwbGF5ZXJOdW1iZXIpIHtcbiAgICBjb25zdCBzaGlwcyA9IFtbJ0JhdHRsZXNoaXAnLCA0XSwgWydDcnVpc2VyJywgM11dO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcblxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrSW5zZXJ0UGFyYW1ldGVycyhzaGlwTGVuZ3RoLCBzdGFydCwgZW5kKSB7XG4gICAgbGV0IGR4O1xuICAgIGxldCBkeTtcbiAgICBpZiAoTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICE9PSAwKSB7XG4gICAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSArIDE7XG4gICAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKVxuICAgIH0gZWxzZSB7XG4gICAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKVxuICAgICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSkgKyAxO1xuICAgIH1cbiAgXG4gICAgLy8gSWYgZHggYW5kIGR5IGFyZW4ndCB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBpbmNvcnJlY3QuXG4gICAgLy8gVGhpcyBpcyBqdXN0IGZvciBtYW51YWxseSBpbnB1dHRpbmcgY29vcmRpbmF0ZXMgYW5kIG5vdCBmb3IgZnV0dXJlLlxuICAgIGlmIChkeCAhPT0gc2hpcExlbmd0aCAmJiBkeSAhPT0gc2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIElmIHRoZSBob3Jpem9udGFsIGlzIGNvcnJlY3QsIHRoZW4gZHkgbXVzdCBiZSAwIGJlY2F1c2UgdGhlcmUgaXMgbm8gZGlhZ29uYWwgc2hpcCBwbGFjZW1lbnRcbiAgICB9IGVsc2UgaWYgKGR4ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gKGR5ID09PSAwKSA/IHRydWUgOiBmYWxzZTtcbiAgICAvLyBJZiB0aGUgdmVydGljYWwgZGlmZmVyZW5jZSBpcyB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGhvcml6b250YWwgZGlmZmVyZW5jZSBzaG91bGQgYmUgMC5cbiAgICB9IGVsc2UgaWYgKGR5ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gKGR4ID09PSAwKSA/IHRydWUgOiBmYWxzZTsgXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBfcGxheWVycyxcbiAgICBjcmVhdGVQbGF5ZXIsXG4gICAgY2hlY2tJbnNlcnRQYXJhbWV0ZXJzXG4gIH07XG59XG5cbi8qXG4vLyBDYXJyaWVyIChvY2N1cGllcyA1IHNwYWNlcyksIEJhdHRsZXNoaXAgKDQpLCBDcnVpc2VyICgzKSwgU3VibWFyaW5lICgzKSwgYW5kIERlc3Ryb3llciAoMikuXG5jb25zdCBjcmVhdGVSYW5kb21Cb2FyZCA9ICgpID0+IHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZWJvYXJkRm5zLkdhbWVib2FyZCgpO1xuICBjb25zdCBzaGlwQXJyYXkgPSBbU2hpcCgnRGVzdHJveWVyJywgMildO1xuXG4gIC8vIFJhbmRvbWx5IGFkZCBzaGlwcyB0byBnYW1lYm9hcmQuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc2hpcCA9IHNoaXBBcnJheVtpXTtcbiAgICAvLyBHZW5lcmF0ZSByYW5kb20gc3RhcnRpbmcgcG9zaXRpb24gaW4gYmV0d2VlbiAxIGFuZCAxMS5cbiAgICBsZXQgcmFuZG9tU3RhcnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMTEgLSAxICsgMSkgKyAxKTtcblxuICAgIC8vIEdlbmVyYXRlIHdoZXRoZXIgaW50ZWdlciB3aWxsIGJlIHggb3IgeS5cbiAgICBjb25zdCByYW5kb21EaXJlY3Rpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMiAtIDEgKyAxKSArIDEpO1xuICAgIGNvbnNvbGUubG9nKHJhbmRvbURpcmVjdGlvbik7XG4gICAgbGV0IHNoaXBTdGFydCA9IHJhbmRvbURpcmVjdGlvbiA9PT0gMSA/IFtyYW5kb21TdGFydCwgMF0gOiBbMCwgcmFuZG9tU3RhcnRdO1xuICAgIGNvbnNvbGUubG9nKHNoaXBTdGFydCk7XG4gIH1cbn1cbiovXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7IiwiY29uc3QgR2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBfYm9hcmQgPSBBcnJheS5mcm9tKHtsZW5ndGg6IDEwfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwoJycpKTtcbiAgY29uc3QgX3NoaXBzID0ge307XG4gIGNvbnN0IF9taXNzZWRBdHRhY2tzID0gW107XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVJbnNlcnQoc3RhcnQsIGVuZCkge1xuICAgIGxldCBtYXJrZXIgPSBzdGFydDtcbiAgICBpZiAoc3RhcnRbMF0gPT09IDApIHtcbiAgICAgIHdoaWxlIChtYXJrZXJbMV0gIT09IGVuZFsxXSkge1xuICAgICAgICBpZiAoX2JvYXJkW21hcmtlclsxXV1bbWFya2VyWzBdXSAhPT0gJycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSW5zZXJ0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgbWFya2VyID0gW3N0YXJ0WzBdLCBtYXJrZXJbMV0gKyAxXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKG1hcmtlclswXSAhPT0gZW5kWzBdKSB7XG4gICAgICAgIGlmIChfYm9hcmRbbWFya2VyWzFdXVttYXJrZXJbMF1dICE9PSAnJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBJbnNlcnQnKTtcbiAgICAgICAgfVxuICAgICAgICBtYXJrZXIgPSBbbWFya2VyWzBdICsgMSwgc3RhcnRbMV1dO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydChzaGlwT2JqLCBzdGFydCwgZW5kKSB7XG4gICAgbGV0IHNoaXBMZW5ndGggPSBzaGlwT2JqLnNoaXBMZW5ndGg7XG4gICAgaWYgKGNoZWNrSW5zZXJ0UGFyYW1ldGVycyhzaGlwTGVuZ3RoLCBzdGFydCwgZW5kKSkge1xuICAgICAgX3NoaXBzW3NoaXBPYmoubmFtZV0gPSBzaGlwT2JqO1xuICAgICAgbGV0IGR4ID0gc3RhcnRbMF0gLSBlbmRbMF07XG4gICAgICBsZXQgZHkgPSBzdGFydFsxXSAtIGVuZFsxXTtcbiAgICAgIGlmIChkeCkge1xuICAgICAgICBkeCA9IE1hdGguYWJzKGR4KSArIDE7XG4gICAgICAgIGxldCB4TWFya2VyID0gc3RhcnRbMF07XG4gICAgICAgIHdoaWxlIChkeCkge1xuICAgICAgICAgIGlmIChzdGFydFswXSA+IGVuZFswXSkge1xuICAgICAgICAgICAgX2JvYXJkW3N0YXJ0WzFdXVt4TWFya2VyXSA9IHNoaXBPYmoubmFtZTtcbiAgICAgICAgICAgIHhNYXJrZXIgLT0gMTtcbiAgICAgICAgICAgIGR4IC09IDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9ib2FyZFtzdGFydFsxXV1beE1hcmtlcl0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgICB4TWFya2VyICs9IDFcbiAgICAgICAgICAgIGR4IC09IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkeSA9IE1hdGguYWJzKGR5KSArIDE7XG4gICAgICAgIGxldCB5TWFya2VyID0gc3RhcnRbMV07XG4gICAgICAgIHdoaWxlIChkeSkge1xuICAgICAgICAgIGlmIChzdGFydFsxXSA+IGVuZFsxXSkge1xuICAgICAgICAgICAgX2JvYXJkW3lNYXJrZXJdW3N0YXJ0WzBdXSA9IHNoaXBPYmoubmFtZTtcbiAgICAgICAgICAgIHlNYXJrZXIgLT0gMTtcbiAgICAgICAgICAgIGR5IC09IDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9ib2FyZFt5TWFya2VyXVtzdGFydFswXV0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgICB5TWFya2VyICs9IDE7XG4gICAgICAgICAgICBkeSAtPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIHJldHVybiBfYm9hcmQ7XG4gICAgfSBlbHNlIHtcbiAgICAvLyBFbHNlIHdlIHJldHVybiBhIGluY29ycmVjdCBtZXNzYWdlP1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soY29vcmQpIHtcbiAgICBjb25zdCBib2FyZGxvY2F0aW9uID0gX2JvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV07XG4gICAgaWYgKGJvYXJkbG9jYXRpb24pIHtcbiAgICAgIGNvbnN0IHNoaXAgPSBfc2hpcHNbYm9hcmRsb2NhdGlvbl07XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgcmV0dXJuICdTaGl0IEhpdCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9taXNzZWRBdHRhY2tzLnB1c2goY29vcmQpO1xuICAgICAgcmV0dXJuIGNvb3JkO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdhbWVPdmVyKCkge1xuICAgIGZvciAoY29uc3Qgc2hpcE5hbWUgaW4gX3NoaXBzKSB7XG4gICAgICBjb25zdCBzaGlwID0gX3NoaXBzW3NoaXBOYW1lXTtcbiAgICAgIGlmIChzaGlwLmlzU3VuaygpKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBfYm9hcmQsXG4gICAgX3NoaXBzLFxuICAgIF9taXNzZWRBdHRhY2tzLFxuICAgIHZhbGlkYXRlSW5zZXJ0LFxuICAgIGluc2VydCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIGdhbWVPdmVyXG4gIH1cbn1cblxuY29uc3QgY2hlY2tJbnNlcnRQYXJhbWV0ZXJzID0oc2hpcExlbmd0aCwgc3RhcnQsIGVuZCkgPT4ge1xuICBsZXQgZHg7XG4gIGxldCBkeTtcbiAgaWYgKE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSAhPT0gMCkge1xuICAgIGR4ID0gTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICsgMTtcbiAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKVxuICB9IGVsc2Uge1xuICAgIGR4ID0gTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pXG4gICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSkgKyAxO1xuICB9XG5cbiAgLy8gSWYgZHggYW5kIGR5IGFyZW4ndCB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBpbmNvcnJlY3QuXG4gIC8vIFRoaXMgaXMganVzdCBmb3IgbWFudWFsbHkgaW5wdXR0aW5nIGNvb3JkaW5hdGVzIGFuZCBub3QgZm9yIGZ1dHVyZS5cbiAgaWYgKGR4ICE9PSBzaGlwTGVuZ3RoICYmIGR5ICE9PSBzaGlwTGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBJZiB0aGUgaG9yaXpvbnRhbCBpcyBjb3JyZWN0LCB0aGVuIGR5IG11c3QgYmUgMCBiZWNhdXNlIHRoZXJlIGlzIG5vIGRpYWdvbmFsIHNoaXAgcGxhY2VtZW50XG4gIH0gZWxzZSBpZiAoZHggPT09IHNoaXBMZW5ndGgpIHtcbiAgICByZXR1cm4gKGR5ID09PSAwKSA/IHRydWUgOiBmYWxzZTtcbiAgLy8gSWYgdGhlIHZlcnRpY2FsIGRpZmZlcmVuY2UgaXMgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBob3Jpem9udGFsIGRpZmZlcmVuY2Ugc2hvdWxkIGJlIDAuXG4gIH0gZWxzZSBpZiAoZHkgPT09IHNoaXBMZW5ndGgpIHtcbiAgICByZXR1cm4gKGR4ID09PSAwKSA/IHRydWUgOiBmYWxzZTsgXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrSW5zZXJ0UGFyYW1ldGVycyxcbiAgR2FtZWJvYXJkXG59OyIsIi8qXG5SRU1FTUJFUiB5b3Ugb25seSBoYXZlIHRvIHRlc3QgeW91ciBvYmplY3TigJlzIHB1YmxpYyBpbnRlcmZhY2UuXG5Pbmx5IG1ldGhvZHMgb3IgcHJvcGVydGllcyB0aGF0IGFyZSB1c2VkIG91dHNpZGUgb2YgeW91ciDigJhzaGlw4oCZIG9iamVjdCBuZWVkIHVuaXQgdGVzdHMuXG4qL1xuXG4vLyBTaGlwcyBzaG91bGQgaGF2ZSBhIGhpdCgpIGZ1bmN0aW9uIHRoYXQgaW5jcmVhc2VzIHRoZSBudW1iZXIgb2Yg4oCYaGl0c+KAmSBpbiB5b3VyIHNoaXAuXG5cbi8vIGlzU3VuaygpIHNob3VsZCBiZSBhIGZ1bmN0aW9uIHRoYXQgY2FsY3VsYXRlcyBpdCBiYXNlZCBvbiB0aGVpciBsZW5ndGggXG4vLyBhbmQgdGhlIG51bWJlciBvZiDigJhoaXRz4oCZLlxuY29uc3QgU2hpcCA9IChuYW1lLCBoaXRwb2ludHMpID0+IHtcbiAgbGV0IF9oaXRwb2ludHMgPSBoaXRwb2ludHM7XG4gIGNvbnN0IHNoaXBMZW5ndGggPSBoaXRwb2ludHM7XG4gIGxldCBfc3VuayA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGhpdCgpIHtcbiAgICBfaGl0cG9pbnRzIC09IDE7XG5cbiAgICBpZiAoIV9oaXRwb2ludHMpIHtcbiAgICAgIF9zdW5rID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gX2hpdHBvaW50cztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3VuaygpIHtcbiAgICByZXR1cm4gX3N1bms7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWUsXG4gICAgc2hpcExlbmd0aCxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKTtcbmNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgY29uc3QgZ2FtZSA9IEdhbWUoKTtcbiAgZ2FtZS5jcmVhdGVQbGF5ZXIoJ0p1c3RpbicpO1xuICBnYW1lLmNyZWF0ZVBsYXllcignSmVmZicpO1xuICBkaXNwbGF5R2FtZUJvYXJkKDEsIGdhbWUuX3BsYXllcnNbJzEnXS5ib2FyZC5fYm9hcmQpO1xuICBkaXNwbGF5R2FtZUJvYXJkKDIsIGdhbWUuX3BsYXllcnNbJzInXS5ib2FyZC5fYm9hcmQpO1xuXG4gIC8vIEdhbWUgUGhhc2VcbiAgLy8gU2V0IFBsYXllciAxIEJvYXJkXG4gICAgLy8gQXNrIHBsYXllciBmb3IgaW5wdXQgY29vcmRpbmF0ZXMgZm9yIDMgc2hpcHNcbiAgLy8gU2V0IFBsYXllciAyIEJvYXJkXG4gICAgLy8gQXNrIHBsYXllciBmb3IgaW5wdXQgY29vcmRpbmF0ZXMgZm9yIDMgc2hpcHNcbiAgLy8gQXNrIFBsYXllciAxIGZvciBjb29yZGluYXRlcyB0byBoaXRcbiAgLy8gQXNrIFBsYXllciAyIGZvciBjb29yZGluYXRlcyB0byBoaXRcbiAgLy8gc2V0UGxheWVyT25lQm9hcmQoKTtcbiAgLy8gc2V0UGxheWVyVHdvQm9hcmQoKTtcbiAgc2V0SW5zZXJ0U2hpcExpc3RlbmVyKGdhbWUpO1xufSk7XG5cbmNvbnN0IHNldEluc2VydFNoaXBMaXN0ZW5lciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGZvcm1JbnNlcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1pbnNlcnQtc2hpcHMnKTtcbiAgY29uc3QgZGl2SW5zZXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1pbnNlcnQnKTtcbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zZXJ0LWNvb3JkaW5hdGVzJyk7XG4gIGNvbnN0IHNwYW5FcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFuLWluc2VydC1lcnJvcicpO1xuICBjb25zdCBzdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zZXJ0LXN1Ym1pdCcpO1xuXG4gIGxldCBjdXJyZW50UGxheWVyID0gZ2FtZS5fcGxheWVyc1sxXTtcbiAgc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgY3VycmVudFNoaXAgPSBkaXZJbnNlcnQuZ2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnKTtcbiAgICAvLyAnQTQgQTUnIC0tPiBbQTQsIEE1XSB8fCBbWzAsIDRdLCBbMCwgNV1dO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdHJhbnNmb3JtSW5wdXRUb0Nvb3JkKGlucHV0LnZhbHVlKTtcbiAgICBjb25zb2xlLmxvZyhjb29yZGluYXRlcyk7XG5cbiAgICBpZiAoY3VycmVudFBsYXllci5ib2FyZC52YWxpZGF0ZUluc2VydChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7ICAgICAgXG4gICAgICBpZiAoY3VycmVudFNoaXAgPT09ICdjcnVpc2VyJyAmJiBnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycygzLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBTaGlwKCdDcnVpc2VyJywgMyk7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIuYm9hcmQuaW5zZXJ0KHNoaXAsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSk7XG4gICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdiYXR0bGVzaGlwJyk7XG4gICAgICAgIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtjdXJyZW50UGxheWVyLm5hbWV9LCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBiYXR0bGVzaGlwIChMZW5ndGg6IDUgcGxhY2VzKTpgO1xuICAgICAgICBpbnB1dC52YWx1ZSA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTaGlwID09PSAnYmF0dGxlc2hpcCcgJiYgZ2FtZS5jaGVja0luc2VydFBhcmFtZXRlcnMoNSwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICBjb25zdCBzaGlwID0gU2hpcCgnQmF0dGxlc2hpcCcsIDUpO1xuICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICBkaXZJbnNlcnQuc2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnLCAnZGVzdHJveWVyJyk7XG4gICAgICAgIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtjdXJyZW50UGxheWVyLm5hbWV9LCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBkZXN0cm95ZXIgKExlbmd0aDogMiBwbGFjZXMpOmA7XG4gICAgICAgIGlucHV0LnZhbHVlID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudFNoaXAgPT09ICdkZXN0cm95ZXInICYmIGdhbWUuY2hlY2tJbnNlcnRQYXJhbWV0ZXJzKDIsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0NydWlzZXInLCAyKTtcbiAgICAgICAgY3VycmVudFBsYXllci5ib2FyZC5pbnNlcnQoc2hpcCwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKTtcbiAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PT0gZ2FtZS5fcGxheWVyc1sxXSkge1xuICAgICAgICAgIGN1cnJlbnRQbGF5ZXIgPSBnYW1lLl9wbGF5ZXJzWzJdO1xuICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdjcnVpc2VyJyk7XG4gICAgICAgICAgZGl2SW5zZXJ0LmlubmVySFRNTCA9IGAke2N1cnJlbnRQbGF5ZXIubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGNydWlzZXIgKExlbmd0aDogMyBwbGFjZXMpOmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9ybUluc2VydC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgICAgICAgICBkaXNwbGF5R2FtZUJvYXJkKDIsIGdhbWUuX3BsYXllcnNbJzInXS5ib2FyZC5fYm9hcmQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENoYW5nZSBTcGFuIEVycm9yIG1lc3NhZ2UgdG8gbWF0Y2ggZXJyb3JcbiAgICAgIC8vIFVuaGlkZSBTcGFuIEVycm9yLlxuICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcic7XG4gICAgICBzcGFuRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgIH1cbiAgfSk7XG59XG5cbmNvbnN0IHRyYW5zZm9ybUlucHV0VG9Db29yZCA9IChpbnB1dFZhbCkgPT4ge1xuICBjb25zdCBhcnIgPSBpbnB1dFZhbC5zcGxpdCgnICcpO1xuICBjb25zdCBhbHBoID0gWydBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRicsICdHJywgJ0gnLCAnSScsICdLJ107XG4gIFxuICBjb25zdCBpZHhTdGFydCA9IGFscGguZmluZEluZGV4KChlbGUpID0+IHtcbiAgICByZXR1cm4gZWxlID09PSBhcnJbMF1bMF07XG4gIH0pO1xuXG4gIGNvbnN0IGlkeEVuZCA9IGFscGguZmluZEluZGV4KChlbGUpID0+IHtcbiAgICByZXR1cm4gZWxlID09PSBhcnJbMV1bMF07XG4gIH0pO1xuXG4gIGNvbnNvbGUubG9nKHBhcnNlSW50KGFyclswXS5zbGljZSgxKSksIHBhcnNlSW50KGFyclsxXS5zbGljZSgxKSkpO1xuXG4gIHJldHVybiBbW2lkeFN0YXJ0LCBwYXJzZUludChhcnJbMF0uc2xpY2UoMSkpIC0gMV0sIFtpZHhFbmQsIHBhcnNlSW50KGFyclsxXS5zbGljZSgxKSkgLSAxXV07XG59XG5cbi8qXG5jb25zdCBzZXRJbnNlcnRTaGlwTmFtZSA9IChzdGFydCwgc2hpcE5hbWUpID0+IHtcbiAgY29uc3QgbWVzc2FnZSA9ICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1tZXNzYWdlJyk7XG4gIG1lc3NhZ2UuaW5uZXJIVE1MID0gc3RhcnQgPyBgU2V0ICR7c2hpcE5hbWV9IHN0YXJ0aW5nIGxvY2F0aW9uOiBgIDogYFNldCAke3NoaXBOYW1lfSBlbmRpbmcgbG9jYXRpb246IGA7IFxufVxuXG4vLyBwYXJhbWV0ZXJzID0gc2hpcE5hbWUsIHNoaXBMZW5ndGhcbmNvbnN0IHByb21wdFNoaXBJbnNlcnQgPSAoKSA9PiB7XG4gIGxldCBzaGlwQ29vcmQgPSBbXTtcbiAgY29uc3QgY29vcmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29yZCcpO1xuICBjb25zdCBpbnB1dFN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXQnKTtcblxuICBpbnB1dFN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHNoaXBDb29yZC5wdXNoKGNvb3JkSW5wdXQudmFsdWUpO1xuICB9KTtcblxuICByZXR1cm4gc2hpcENvb3JkO1xufVxuXG5jb25zdCBpbnNlcnRTaGlwID0gKCkgPT4ge1xuICBjb25zb2xlLmxvZyhwcm9tcHRTaGlwSW5zZXJ0KCkpOyBcbn1cbiovXG5cbmNvbnN0IGRpc3BsYXlHYW1lQm9hcmQgPSAocGxheWVyTnVtYmVyLCBwbGF5ZXJCb2FyZCkgPT4ge1xuICBjb25zdCByb3dMaXN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl0gPiB1bCA+IGxpYCk7XG4gIGNvbnNvbGUubG9nKHJvd0xpc3RJdGVtcyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGJvYXJkUm93ID0gcGxheWVyQm9hcmRbaV07XG4gICAgY29uc3QgZGlzcGxheUJvYXJkUm93ID0gcm93TGlzdEl0ZW1zW2kgKyAxXTtcbiAgICBjb25zdCBzcGFucyA9IGRpc3BsYXlCb2FyZFJvdy5jaGlsZHJlbjtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmRSb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChib2FyZFJvd1tqXSA9PT0gJycpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFuc1tqICsgMV0uaW5uZXJIVE1MID0gJ1MnO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==