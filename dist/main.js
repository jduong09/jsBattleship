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
  console.log(currentPlayer);
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
          console.log(game._players['1'].board._board);
          console.log(game._players['2'].board._board);
          displayGameBoard(1, game._players['1'].board._board);
          displayGameBoard(2, game._players['2'].board._board);
        }
      }
      // 
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

  return [[idxStart, parseInt(arr[0][1])], [idxEnd, parseInt(arr[1][1])]];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQSxpQ0FBaUMsbUJBQW1CO0FBQ3BEO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxtQkFBbUI7QUFDcEQ7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLG1CQUFtQjtBQUN0RCxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsVUFBVSw4QkFBOEIsVUFBVTtBQUN2Rjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJFQUEyRSxhQUFhOztBQUV4RixrQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IscUJBQXFCO0FBQ3pDO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwLy4vc3JjL2pzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwLy4vc3JjL2pzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvc2hpcC5qcyIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwLy4vc3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdhbWVib2FyZEZucyA9IHJlcXVpcmUoJy4vZ2FtZWJvYXJkLmpzJyk7XG5jb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwLmpzJyk7XG5cbi8vIEZvciBHYW1lIHRvIFJ1bi5cbi8vIEhhcyBwbGF5ZXJzX29iamVjdCB3aGljaCBob2xkcyB0d28gcGxheWVyIG9iamVjdHMsIGZvciB0aGUgZ2FtZVxuLy8gSGFzIGN1cnJlbnRUdXJuIHdoaWNoIGtlZXBzIHRyYWNrIG9mIHdob3NlIHR1cm4gaXQgaXMuXG5cbi8vIEhUTUwgaGFzIGlucHV0IGZvciBjaG9vc2luZyBjb29yZGluYXRlcyB0byBzdHJpa2Ugb24gYm9hcmQuXG4vLyBPbmNlIHVzZXIgaGFzIGlucHV0dGVkIHZhbGlkIGNvb3JkaW5hdGVzLCBydW4gdHVybiBmdW5jdGlvbi5cbi8vIGZ1bmN0aW9uICd0dXJuJyB3aGljaCB3aWxsIHJ1biB0aHJvdWdoIGEgdHVybi5cbiAgLy8gQ29vcmRpbmF0ZXMgd2lsbCBiZSBzZXQgdG8gZ2FtZWJvYXJkLCB0byBjaGVjayBpZiB0aGVyZSBpcyBhIGhpdCBvbiB0aGUgb3Bwb25lbnRzIGJvYXJkLlxuICAgIC8vIElmIHRoZXJlIGlzIGEgaGl0LCB3ZSB3YW50IHRvIHNpZ25pZnkgdGhlcmUgaXMgYSBoaXRcbiAgICAgIC8vIFdlIHdhbnQgdG8gY2hlY2sgaWYgYSBzaGlwIGhhcyBmYWxsZW5cbiAgICAgIC8vIFdlIHdhbnQgdG8gY2hlY2sgaWYgYWxsIHNoaXBzIGhhdmUgZmFsbGVuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBtaXNzLCB3ZSB3YW50IHRvIHNpZ25pZnkgdGhhdCBpdCBpcyBhIG1pc3NcbiAgICAgIC8vIFdlIHdhbnQgdG8gYWRkIHRvIHRoZSBtaXNzIGFycmF5XG4gICAgLy8gQ2hhbmdlIHRoZSBjdXJyZW50VHVybiB0byB0aGUgb3Bwb25lbnRzIHR1cm5cbiAgICAvLyBVcGRhdGUgdGhlIEhUTUwgRG9tIHRvIHNpZ25pZnkgdGhhdCBpdCBpcyB0aGUgb3Bwb25lbnRzIHR1cm5cbiAgICBcblxuXG5cblxuY29uc3QgR2FtZSA9ICgpID0+IHtcbiAgY29uc3QgX3BsYXllcnMgPSB7fTtcbiAgbGV0IF9jdXJyZW50VHVybiA9IF9wbGF5ZXJzWzFdO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBsYXllcihwbGF5ZXJOYW1lKSB7XG4gICAgY29uc3QgcGxheWVyTnVtYmVyID0gX3BsYXllcnNbMV0gPyAyIDogMTtcblxuICAgIF9wbGF5ZXJzW3BsYXllck51bWJlcl0gPSB7XG4gICAgICBuYW1lOiBwbGF5ZXJOYW1lLFxuICAgICAgYm9hcmQ6IGdhbWVib2FyZEZucy5HYW1lYm9hcmQoKVxuICAgIH1cbiAgIFxuICAgIC8qXG4gICAgY29uc3QgY3J1aXNlciA9IFNoaXAoJ0NydWlzZXInLCAzKTtcbiAgICBjb25zdCBkZXN0cm95ZXIgPSBTaGlwKCdEZXN0cm95ZXInLCAyKTtcbiAgICBfcGxheWVyc1twbGF5ZXJOdW1iZXJdLmJvYXJkLmluc2VydChjcnVpc2VyLCBbMCwgMF0sIFswLCAyXSk7XG4gICAgX3BsYXllcnNbcGxheWVyTnVtYmVyXS5ib2FyZC5pbnNlcnQoZGVzdHJveWVyLCBbMSwgMF0sIFsyLCAwXSk7XG4gICAgKi9cblxuICAgIHJldHVybiBfcGxheWVyc1twbGF5ZXJOdW1iZXJdO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0UGxheWVyQm9hcmQocGxheWVyTnVtYmVyKSB7XG4gICAgY29uc3Qgc2hpcHMgPSBbWydCYXR0bGVzaGlwJywgNF0sIFsnQ3J1aXNlcicsIDNdXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0luc2VydFBhcmFtZXRlcnMoc2hpcExlbmd0aCwgc3RhcnQsIGVuZCkge1xuICAgIGxldCBkeDtcbiAgICBsZXQgZHk7XG4gICAgaWYgKE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSAhPT0gMCkge1xuICAgICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgKyAxO1xuICAgICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSlcbiAgICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pICsgMTtcbiAgICB9XG4gIFxuICAgIC8vIElmIGR4IGFuZCBkeSBhcmVuJ3QgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBjb29yZGluYXRlcyBnaXZlbiBhcmUgaW5jb3JyZWN0LlxuICAgIC8vIFRoaXMgaXMganVzdCBmb3IgbWFudWFsbHkgaW5wdXR0aW5nIGNvb3JkaW5hdGVzIGFuZCBub3QgZm9yIGZ1dHVyZS5cbiAgICBpZiAoZHggIT09IHNoaXBMZW5ndGggJiYgZHkgIT09IHNoaXBMZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyBJZiB0aGUgaG9yaXpvbnRhbCBpcyBjb3JyZWN0LCB0aGVuIGR5IG11c3QgYmUgMCBiZWNhdXNlIHRoZXJlIGlzIG5vIGRpYWdvbmFsIHNoaXAgcGxhY2VtZW50XG4gICAgfSBlbHNlIGlmIChkeCA9PT0gc2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIChkeSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XG4gICAgLy8gSWYgdGhlIHZlcnRpY2FsIGRpZmZlcmVuY2UgaXMgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBob3Jpem9udGFsIGRpZmZlcmVuY2Ugc2hvdWxkIGJlIDAuXG4gICAgfSBlbHNlIGlmIChkeSA9PT0gc2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIChkeCA9PT0gMCkgPyB0cnVlIDogZmFsc2U7IFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgX3BsYXllcnMsXG4gICAgY3JlYXRlUGxheWVyLFxuICAgIGNoZWNrSW5zZXJ0UGFyYW1ldGVyc1xuICB9O1xufVxuXG4vKlxuLy8gQ2FycmllciAob2NjdXBpZXMgNSBzcGFjZXMpLCBCYXR0bGVzaGlwICg0KSwgQ3J1aXNlciAoMyksIFN1Ym1hcmluZSAoMyksIGFuZCBEZXN0cm95ZXIgKDIpLlxuY29uc3QgY3JlYXRlUmFuZG9tQm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IGdhbWVib2FyZEZucy5HYW1lYm9hcmQoKTtcbiAgY29uc3Qgc2hpcEFycmF5ID0gW1NoaXAoJ0Rlc3Ryb3llcicsIDIpXTtcblxuICAvLyBSYW5kb21seSBhZGQgc2hpcHMgdG8gZ2FtZWJvYXJkLlxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHNoaXAgPSBzaGlwQXJyYXlbaV07XG4gICAgLy8gR2VuZXJhdGUgcmFuZG9tIHN0YXJ0aW5nIHBvc2l0aW9uIGluIGJldHdlZW4gMSBhbmQgMTEuXG4gICAgbGV0IHJhbmRvbVN0YXJ0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDExIC0gMSArIDEpICsgMSk7XG5cbiAgICAvLyBHZW5lcmF0ZSB3aGV0aGVyIGludGVnZXIgd2lsbCBiZSB4IG9yIHkuXG4gICAgY29uc3QgcmFuZG9tRGlyZWN0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDIgLSAxICsgMSkgKyAxKTtcbiAgICBjb25zb2xlLmxvZyhyYW5kb21EaXJlY3Rpb24pO1xuICAgIGxldCBzaGlwU3RhcnQgPSByYW5kb21EaXJlY3Rpb24gPT09IDEgPyBbcmFuZG9tU3RhcnQsIDBdIDogWzAsIHJhbmRvbVN0YXJ0XTtcbiAgICBjb25zb2xlLmxvZyhzaGlwU3RhcnQpO1xuICB9XG59XG4qL1xuXG5jb25zdCBuZXdHYW1lID0gR2FtZSgpO1xubmV3R2FtZS5jcmVhdGVQbGF5ZXIoJ0p1c3RpbicpO1xubmV3R2FtZS5jcmVhdGVQbGF5ZXIoJ0plZmYnKTtcbmNvbnNvbGUubG9nKG5ld0dhbWUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7IiwiY29uc3QgR2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBfYm9hcmQgPSBBcnJheS5mcm9tKHtsZW5ndGg6IDEwfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwoJycpKTtcbiAgY29uc3QgX3NoaXBzID0ge307XG4gIGNvbnN0IF9taXNzZWRBdHRhY2tzID0gW107XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVJbnNlcnQoc3RhcnQsIGVuZCkge1xuICAgIGxldCBtYXJrZXIgPSBzdGFydDtcbiAgICBpZiAoc3RhcnRbMF0gPT09IDApIHtcbiAgICAgIHdoaWxlIChtYXJrZXJbMV0gIT09IGVuZFsxXSkge1xuICAgICAgICBpZiAoX2JvYXJkW21hcmtlclsxXV1bbWFya2VyWzBdXSAhPT0gJycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSW5zZXJ0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgbWFya2VyID0gW3N0YXJ0WzBdLCBtYXJrZXJbMV0gKyAxXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKG1hcmtlclswXSAhPT0gZW5kWzBdKSB7XG4gICAgICAgIGlmIChfYm9hcmRbbWFya2VyWzFdXVttYXJrZXJbMF1dICE9PSAnJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBJbnNlcnQnKTtcbiAgICAgICAgfVxuICAgICAgICBtYXJrZXIgPSBbbWFya2VyWzBdICsgMSwgc3RhcnRbMV1dO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydChzaGlwT2JqLCBzdGFydCwgZW5kKSB7XG4gICAgbGV0IHNoaXBMZW5ndGggPSBzaGlwT2JqLnNoaXBMZW5ndGg7XG4gICAgaWYgKGNoZWNrSW5zZXJ0UGFyYW1ldGVycyhzaGlwTGVuZ3RoLCBzdGFydCwgZW5kKSkge1xuICAgICAgX3NoaXBzW3NoaXBPYmoubmFtZV0gPSBzaGlwT2JqO1xuICAgICAgbGV0IGR4ID0gc3RhcnRbMF0gLSBlbmRbMF07XG4gICAgICBsZXQgZHkgPSBzdGFydFsxXSAtIGVuZFsxXTtcbiAgICAgIF9ib2FyZFtzdGFydFsxXV1bc3RhcnRbMF1dID0gc2hpcE9iai5uYW1lO1xuICAgICAgaWYgKGR4KSB7XG4gICAgICAgIGxldCB4TWFya2VyID0gc3RhcnRbMF07XG4gICAgICAgIHdoaWxlIChkeCkge1xuICAgICAgICAgIGlmIChkeCA+IDApIHtcbiAgICAgICAgICAgIF9ib2FyZFtzdGFydFsxXV1beE1hcmtlciAtIDFdID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgICAgeE1hcmtlciAtPSAxO1xuICAgICAgICAgICAgZHggLT0gMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2JvYXJkW3N0YXJ0WzFdXVt4TWFya2VyICsgMV0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgICB4TWFya2VyICs9IDFcbiAgICAgICAgICAgIGR4ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgeU1hcmtlciA9IHN0YXJ0WzFdO1xuICAgICAgICB3aGlsZSAoZHkpIHtcbiAgICAgICAgICBpZiAoZHkgPiAwKSB7XG4gICAgICAgICAgICBfYm9hcmRbeU1hcmtlciAtIDFdW3N0YXJ0WzBdXSA9IHNoaXBPYmoubmFtZTtcbiAgICAgICAgICAgIHlNYXJrZXIgLT0gMTtcbiAgICAgICAgICAgIGR5IC09IDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9ib2FyZFt5TWFya2VyICsgMV1bc3RhcnRbMF1dID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgICAgeU1hcmtlciArPSAxO1xuICAgICAgICAgICAgZHkgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICByZXR1cm4gX2JvYXJkO1xuICAgIH0gZWxzZSB7XG4gICAgLy8gRWxzZSB3ZSByZXR1cm4gYSBpbmNvcnJlY3QgbWVzc2FnZT9cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKGNvb3JkKSB7XG4gICAgY29uc3QgYm9hcmRsb2NhdGlvbiA9IF9ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xuICAgIGlmIChib2FyZGxvY2F0aW9uKSB7XG4gICAgICBjb25zdCBzaGlwID0gX3NoaXBzW2JvYXJkbG9jYXRpb25dO1xuICAgICAgc2hpcC5oaXQoKTtcbiAgICAgIHJldHVybiAnU2hpdCBIaXQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBfbWlzc2VkQXR0YWNrcy5wdXNoKGNvb3JkKTtcbiAgICAgIHJldHVybiBjb29yZDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICBmb3IgKGNvbnN0IHNoaXBOYW1lIGluIF9zaGlwcykge1xuICAgICAgY29uc3Qgc2hpcCA9IF9zaGlwc1tzaGlwTmFtZV07XG4gICAgICBpZiAoc2hpcC5pc1N1bmsoKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG5cblxuICByZXR1cm4ge1xuICAgIF9ib2FyZCxcbiAgICBfc2hpcHMsXG4gICAgX21pc3NlZEF0dGFja3MsXG4gICAgdmFsaWRhdGVJbnNlcnQsXG4gICAgaW5zZXJ0LFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgZ2FtZU92ZXJcbiAgfVxufVxuXG5jb25zdCBjaGVja0luc2VydFBhcmFtZXRlcnMgPShzaGlwTGVuZ3RoLCBzdGFydCwgZW5kKSA9PiB7XG4gIGxldCBkeDtcbiAgbGV0IGR5O1xuICBpZiAoTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICE9PSAwKSB7XG4gICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgKyAxO1xuICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pXG4gIH0gZWxzZSB7XG4gICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSlcbiAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKSArIDE7XG4gIH1cblxuICAvLyBJZiBkeCBhbmQgZHkgYXJlbid0IHRoZSBzaGlwIGxlbmd0aCwgdGhlbiB0aGUgY29vcmRpbmF0ZXMgZ2l2ZW4gYXJlIGluY29ycmVjdC5cbiAgLy8gVGhpcyBpcyBqdXN0IGZvciBtYW51YWxseSBpbnB1dHRpbmcgY29vcmRpbmF0ZXMgYW5kIG5vdCBmb3IgZnV0dXJlLlxuICBpZiAoZHggIT09IHNoaXBMZW5ndGggJiYgZHkgIT09IHNoaXBMZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIElmIHRoZSBob3Jpem9udGFsIGlzIGNvcnJlY3QsIHRoZW4gZHkgbXVzdCBiZSAwIGJlY2F1c2UgdGhlcmUgaXMgbm8gZGlhZ29uYWwgc2hpcCBwbGFjZW1lbnRcbiAgfSBlbHNlIGlmIChkeCA9PT0gc2hpcExlbmd0aCkge1xuICAgIHJldHVybiAoZHkgPT09IDApID8gdHJ1ZSA6IGZhbHNlO1xuICAvLyBJZiB0aGUgdmVydGljYWwgZGlmZmVyZW5jZSBpcyB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGhvcml6b250YWwgZGlmZmVyZW5jZSBzaG91bGQgYmUgMC5cbiAgfSBlbHNlIGlmIChkeSA9PT0gc2hpcExlbmd0aCkge1xuICAgIHJldHVybiAoZHggPT09IDApID8gdHJ1ZSA6IGZhbHNlOyBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2tJbnNlcnRQYXJhbWV0ZXJzLFxuICBHYW1lYm9hcmRcbn07IiwiLypcblJFTUVNQkVSIHlvdSBvbmx5IGhhdmUgdG8gdGVzdCB5b3VyIG9iamVjdOKAmXMgcHVibGljIGludGVyZmFjZS5cbk9ubHkgbWV0aG9kcyBvciBwcm9wZXJ0aWVzIHRoYXQgYXJlIHVzZWQgb3V0c2lkZSBvZiB5b3VyIOKAmHNoaXDigJkgb2JqZWN0IG5lZWQgdW5pdCB0ZXN0cy5cbiovXG5cbi8vIFNoaXBzIHNob3VsZCBoYXZlIGEgaGl0KCkgZnVuY3Rpb24gdGhhdCBpbmNyZWFzZXMgdGhlIG51bWJlciBvZiDigJhoaXRz4oCZIGluIHlvdXIgc2hpcC5cblxuLy8gaXNTdW5rKCkgc2hvdWxkIGJlIGEgZnVuY3Rpb24gdGhhdCBjYWxjdWxhdGVzIGl0IGJhc2VkIG9uIHRoZWlyIGxlbmd0aCBcbi8vIGFuZCB0aGUgbnVtYmVyIG9mIOKAmGhpdHPigJkuXG5jb25zdCBTaGlwID0gKG5hbWUsIGhpdHBvaW50cykgPT4ge1xuICBsZXQgX2hpdHBvaW50cyA9IGhpdHBvaW50cztcbiAgY29uc3Qgc2hpcExlbmd0aCA9IGhpdHBvaW50cztcbiAgbGV0IF9zdW5rID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gaGl0KCkge1xuICAgIF9oaXRwb2ludHMgLT0gMTtcblxuICAgIGlmICghX2hpdHBvaW50cykge1xuICAgICAgX3N1bmsgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBfaGl0cG9pbnRzO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNTdW5rKCkge1xuICAgIHJldHVybiBfc3VuaztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZSxcbiAgICBzaGlwTGVuZ3RoLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hpcDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpO1xuY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBjb25zdCBnYW1lID0gR2FtZSgpO1xuICBnYW1lLmNyZWF0ZVBsYXllcignSnVzdGluJyk7XG4gIGdhbWUuY3JlYXRlUGxheWVyKCdKZWZmJyk7XG4gIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG5cbiAgLy8gR2FtZSBQaGFzZVxuICAvLyBTZXQgUGxheWVyIDEgQm9hcmRcbiAgICAvLyBBc2sgcGxheWVyIGZvciBpbnB1dCBjb29yZGluYXRlcyBmb3IgMyBzaGlwc1xuICAvLyBTZXQgUGxheWVyIDIgQm9hcmRcbiAgICAvLyBBc2sgcGxheWVyIGZvciBpbnB1dCBjb29yZGluYXRlcyBmb3IgMyBzaGlwc1xuICAvLyBBc2sgUGxheWVyIDEgZm9yIGNvb3JkaW5hdGVzIHRvIGhpdFxuICAvLyBBc2sgUGxheWVyIDIgZm9yIGNvb3JkaW5hdGVzIHRvIGhpdFxuICAvLyBzZXRQbGF5ZXJPbmVCb2FyZCgpO1xuICAvLyBzZXRQbGF5ZXJUd29Cb2FyZCgpO1xuICBzZXRJbnNlcnRTaGlwTGlzdGVuZXIoZ2FtZSk7XG59KTtcblxuY29uc3Qgc2V0SW5zZXJ0U2hpcExpc3RlbmVyID0gKGdhbWUpID0+IHtcbiAgY29uc3QgZm9ybUluc2VydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtLWluc2VydC1zaGlwcycpO1xuICBjb25zdCBkaXZJbnNlcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWluc2VydCcpO1xuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnNlcnQtY29vcmRpbmF0ZXMnKTtcbiAgY29uc3Qgc3BhbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYW4taW5zZXJ0LWVycm9yJyk7XG4gIGNvbnN0IHN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnNlcnQtc3VibWl0Jyk7XG5cbiAgbGV0IGN1cnJlbnRQbGF5ZXIgPSBnYW1lLl9wbGF5ZXJzWzFdO1xuICBjb25zb2xlLmxvZyhjdXJyZW50UGxheWVyKTtcbiAgc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgY3VycmVudFNoaXAgPSBkaXZJbnNlcnQuZ2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnKTtcbiAgICAvLyAnQTQgQTUnIC0tPiBbQTQsIEE1XSB8fCBbWzAsIDRdLCBbMCwgNV1dOyBcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHRyYW5zZm9ybUlucHV0VG9Db29yZChpbnB1dC52YWx1ZSk7XG5cbiAgICBpZiAoY3VycmVudFBsYXllci5ib2FyZC52YWxpZGF0ZUluc2VydChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7ICAgICAgXG4gICAgICBpZiAoY3VycmVudFNoaXAgPT09ICdjcnVpc2VyJyAmJiBnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycygzLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBTaGlwKCdDcnVpc2VyJywgMyk7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIuYm9hcmQuaW5zZXJ0KHNoaXAsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSk7XG4gICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdiYXR0bGVzaGlwJyk7XG4gICAgICAgIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtjdXJyZW50UGxheWVyLm5hbWV9LCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBiYXR0bGVzaGlwIChMZW5ndGg6IDUgcGxhY2VzKTpgO1xuICAgICAgICBpbnB1dC52YWx1ZSA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTaGlwID09PSAnYmF0dGxlc2hpcCcgJiYgZ2FtZS5jaGVja0luc2VydFBhcmFtZXRlcnMoNSwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICBjb25zdCBzaGlwID0gU2hpcCgnQmF0dGxlc2hpcCcsIDUpO1xuICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICBkaXZJbnNlcnQuc2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnLCAnZGVzdHJveWVyJyk7XG4gICAgICAgIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtjdXJyZW50UGxheWVyLm5hbWV9LCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBkZXN0cm95ZXIgKExlbmd0aDogMiBwbGFjZXMpOmA7XG4gICAgICAgIGlucHV0LnZhbHVlID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudFNoaXAgPT09ICdkZXN0cm95ZXInICYmIGdhbWUuY2hlY2tJbnNlcnRQYXJhbWV0ZXJzKDIsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0NydWlzZXInLCAyKTtcbiAgICAgICAgY3VycmVudFBsYXllci5ib2FyZC5pbnNlcnQoc2hpcCwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKTtcbiAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PT0gZ2FtZS5fcGxheWVyc1sxXSkge1xuICAgICAgICAgIGN1cnJlbnRQbGF5ZXIgPSBnYW1lLl9wbGF5ZXJzWzJdO1xuICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdjcnVpc2VyJyk7XG4gICAgICAgICAgZGl2SW5zZXJ0LmlubmVySFRNTCA9IGAke2N1cnJlbnRQbGF5ZXIubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGNydWlzZXIgKExlbmd0aDogMyBwbGFjZXMpOmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9ybUluc2VydC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgICAgY29uc29sZS5sb2coZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgICAgICAgICBkaXNwbGF5R2FtZUJvYXJkKDIsIGdhbWUuX3BsYXllcnNbJzInXS5ib2FyZC5fYm9hcmQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ2hhbmdlIFNwYW4gRXJyb3IgbWVzc2FnZSB0byBtYXRjaCBlcnJvclxuICAgICAgLy8gVW5oaWRlIFNwYW4gRXJyb3IuXG4gICAgICBzcGFuRXJyb3IuaW5uZXJIVE1MID0gJ0Vycm9yJztcbiAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgdHJhbnNmb3JtSW5wdXRUb0Nvb3JkID0gKGlucHV0VmFsKSA9PiB7XG4gIGNvbnN0IGFyciA9IGlucHV0VmFsLnNwbGl0KCcgJyk7XG4gIGNvbnN0IGFscGggPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0snXTtcbiAgXG4gIGNvbnN0IGlkeFN0YXJ0ID0gYWxwaC5maW5kSW5kZXgoKGVsZSkgPT4ge1xuICAgIHJldHVybiBlbGUgPT09IGFyclswXVswXTtcbiAgfSk7XG5cbiAgY29uc3QgaWR4RW5kID0gYWxwaC5maW5kSW5kZXgoKGVsZSkgPT4ge1xuICAgIHJldHVybiBlbGUgPT09IGFyclsxXVswXTtcbiAgfSk7XG5cbiAgcmV0dXJuIFtbaWR4U3RhcnQsIHBhcnNlSW50KGFyclswXVsxXSldLCBbaWR4RW5kLCBwYXJzZUludChhcnJbMV1bMV0pXV07XG59XG5cbi8qXG5jb25zdCBzZXRJbnNlcnRTaGlwTmFtZSA9IChzdGFydCwgc2hpcE5hbWUpID0+IHtcbiAgY29uc3QgbWVzc2FnZSA9ICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1tZXNzYWdlJyk7XG4gIG1lc3NhZ2UuaW5uZXJIVE1MID0gc3RhcnQgPyBgU2V0ICR7c2hpcE5hbWV9IHN0YXJ0aW5nIGxvY2F0aW9uOiBgIDogYFNldCAke3NoaXBOYW1lfSBlbmRpbmcgbG9jYXRpb246IGA7IFxufVxuXG4vLyBwYXJhbWV0ZXJzID0gc2hpcE5hbWUsIHNoaXBMZW5ndGhcbmNvbnN0IHByb21wdFNoaXBJbnNlcnQgPSAoKSA9PiB7XG4gIGxldCBzaGlwQ29vcmQgPSBbXTtcbiAgY29uc3QgY29vcmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29yZCcpO1xuICBjb25zdCBpbnB1dFN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXQnKTtcblxuICBpbnB1dFN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHNoaXBDb29yZC5wdXNoKGNvb3JkSW5wdXQudmFsdWUpO1xuICB9KTtcblxuICByZXR1cm4gc2hpcENvb3JkO1xufVxuXG5jb25zdCBpbnNlcnRTaGlwID0gKCkgPT4ge1xuICBjb25zb2xlLmxvZyhwcm9tcHRTaGlwSW5zZXJ0KCkpOyBcbn1cbiovXG5cbmNvbnN0IGRpc3BsYXlHYW1lQm9hcmQgPSAocGxheWVyTnVtYmVyLCBwbGF5ZXJCb2FyZCkgPT4ge1xuICBjb25zdCByb3dMaXN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl0gPiB1bCA+IGxpYCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGJvYXJkUm93ID0gcGxheWVyQm9hcmRbaV07XG4gICAgY29uc3QgZGlzcGxheUJvYXJkUm93ID0gcm93TGlzdEl0ZW1zW2kgKyAxXTtcbiAgICBjb25zdCBzcGFucyA9IGRpc3BsYXlCb2FyZFJvdy5jaGlsZHJlbjtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmRSb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChib2FyZFJvd1tqXSA9PT0gJycpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFuc1tqICsgMV0uaW5uZXJIVE1MID0gJ1MnO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==