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
    if (opponentGameboard.gameOver()) {
      return 'Game Over!';
    }
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
    swapTurns,
  };
}

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
    const boardLocation = _board[coord[1]][coord[0]];
    if (boardLocation === 'H') {
      return true;
    }
    
    const dupes = _missedAttacks.filter((ele) => {
      return ele[0] === coord[0] && ele[1] === coord[1];
    });
    return dupes.length ? true : false;
  }

  function gameOver() {
    for (const shipName in _ships) {
      const ship = _ships[shipName];
      if (!ship.isSunk()) return false;
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
  setResetBtnListener(game);
});

const setPlayerBoardNames = (game) => {
  const boardOneHeader = document.querySelector(`div.board[data-player="1"] > h3`);
  const boardTwoHeader = document.querySelector(`div.board[data-player="2"] > h3`);

  boardOneHeader.innerHTML = `${game._players[1].name}'s Board`;
  boardTwoHeader.innerHTML = `${game._players[2].name}'s Board`;
}

const startPrepPhase = (game) => {
  const inputInsertCoordinates = document.getElementById('insert-coordinates');
  const spanInsertError = document.getElementById('span-insert-error');

  setPrepHeader(game);
  setInputListener(inputInsertCoordinates, spanInsertError);
  setPrepSubmitBtnListener(game);
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
            }, 2000);
          } else {
            displayGameBoard(2, game._players['2'].board._board);

            setTimeout(() => {
              hideGameBoard(2);
              gamePhase.innerHTML = 'Battle Phase';
              formInsert.classList.add('hide');
              formBattle.classList.remove('hide');
              setBattleHeader(game);
            }, 2000);
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
    inputCoord.disabled = true;
    const coordinate = transformInputToCoord(inputCoord.value);
    // Given an input, we need to validate that it is a valid coordinate.
    if (game.validateCoordinate(coordinate)) {
      if (!spanError.classList.contains('hide')) {
        spanError.classList.add('hide');
      }
      const turn = game.turn(coordinate);
      if (turn === 'Game Over!') {
        displayGameOver(game);
      } else {
        displayTurnResult(turn, game);
        setTimeout(() => {
          // Change game phase current turn.
          game.swapTurns();
          inputCoord.disabled = false;
          updateTurnPhase(game);
        }, 3000);
      }
    } else {
      displayAtkErrorMessage(coordinate);
      inputCoord.disabled = false;
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

const setResetBtnListener = (game) => {
  const resetBtn = document.getElementById('btn-reset');

  resetBtn.addEventListener('click', (e) => {
    e.preventDefault();

    location.reload();
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
        spans[j + 1].innerHTML = '';
      } else if (boardRow[j] === 'H') {
        spans[j + 1].innerHTML = 'H';
      } else if (boardRow[j] === 'M') {
        spans[j + 1].innerHTML = 'X';
      } else {
        spans[j + 1].textContent = '';
        if (boardRow[j] === 'Cruiser') {
          spans[j + 1].appendChild(createGameIcon('cruiser'));
        } else if (boardRow[j] === 'Battleship') {
          spans[j + 1].appendChild(createGameIcon('battleship'));
        } else {
          spans[j + 1].appendChild(createGameIcon('destroyer'));
        }
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
      } else if (boardRow[j] === 'M') {
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

const createGameIcon = (name) => {
  const obj = {
    'cruiser': 'M192 32c0-17.7 14.3-32 32-32H352c17.7 0 32 14.3 32 32V64h48c26.5 0 48 21.5 48 48V240l44.4 14.8c23.1 7.7 29.5 37.5 11.5 53.9l-101 92.6c-16.2 9.4-34.7 15.1-50.9 15.1c-19.6 0-40.8-7.7-59.2-20.3c-22.1-15.5-51.6-15.5-73.7 0c-17.1 11.8-38 20.3-59.2 20.3c-16.2 0-34.7-5.7-50.9-15.1l-101-92.6c-18-16.5-11.6-46.2 11.5-53.9L96 240V112c0-26.5 21.5-48 48-48h48V32zM160 218.7l107.8-35.9c13.1-4.4 27.3-4.4 40.5 0L416 218.7V128H160v90.7zM306.5 421.9C329 437.4 356.5 448 384 448c26.9 0 55.4-10.8 77.4-26.1l0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 501.7 417 512 384 512c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.4 27.3-10.1 39.2-1.7l0 0C136.7 437.2 165.1 448 192 448c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0z',
    'battleship': 'M224 0H352c17.7 0 32 14.3 32 32h75.1c20.6 0 31.6 24.3 18.1 39.8L456 96H120L98.8 71.8C85.3 56.3 96.3 32 116.9 32H192c0-17.7 14.3-32 32-32zM96 128H480c17.7 0 32 14.3 32 32V283.5c0 13.3-4.2 26.3-11.9 37.2l-51.4 71.9c-1.9 1.1-3.7 2.2-5.5 3.5c-15.5 10.7-34 18-51 19.9H375.6c-17.1-1.8-35-9-50.8-19.9c-22.1-15.5-51.6-15.5-73.7 0c-14.8 10.2-32.5 18-50.6 19.9H183.9c-17-1.8-35.6-9.2-51-19.9c-1.8-1.3-3.7-2.4-5.6-3.5L75.9 320.7C68.2 309.8 64 296.8 64 283.5V160c0-17.7 14.3-32 32-32zm32 64v96H448V192H128zM306.5 421.9C329 437.4 356.5 448 384 448c26.9 0 55.3-10.8 77.4-26.1l0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 501.7 417 512 384 512c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.4 27.3-10.1 39.2-1.7l0 0C136.7 437.2 165.1 448 192 448c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0z',
    'destroyer': 'M256 16c0-7 4.5-13.2 11.2-15.3s13.9 .4 17.9 6.1l224 320c3.4 4.9 3.8 11.3 1.1 16.6s-8.2 8.6-14.2 8.6H272c-8.8 0-16-7.2-16-16V16zM212.1 96.5c7 1.9 11.9 8.2 11.9 15.5V336c0 8.8-7.2 16-16 16H80c-5.7 0-11-3-13.8-8s-2.9-11-.1-16l128-224c3.6-6.3 11-9.4 18-7.5zM5.7 404.3C2.8 394.1 10.5 384 21.1 384H554.9c10.6 0 18.3 10.1 15.4 20.3l-4 14.3C550.7 473.9 500.4 512 443 512H133C75.6 512 25.3 473.9 9.7 418.7l-4-14.3z'
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('viewBox', '0 0 576 512');
  svg.setAttribute('height', '1rem');

  const path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  path.setAttribute('d', obj[name]);

  svg.appendChild(path);
  return svg;
}

const setBattleHeader = (game) => {
  const gameMessage = document.getElementById('game-message');
  const divAtk = document.getElementById('div-atk');
  const currentPlayer = game.getCurrentPlayer();
  displayGameBoard(currentPlayer, game._players[currentPlayer].board._board);
  gameMessage.innerHTML = `${game._players[currentPlayer].name}'s Turn`;
  divAtk.innerHTML = `${game._players[currentPlayer].name}, where would you like to attack?`;
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
  }, 2000);
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

const displayGameOver = (game) => {
  const gameMessage = document.getElementById('game-message');
  const formReset = document.getElementById('form-reset');
  const winner = game._players[game.getCurrentPlayer()];
  displayGameBoard(1, game._players[1].board._board);
  displayGameBoard(2, game._players[2].board._board);

  gameMessage.innerHTML = `${winner.name} wins!`;
  formReset.classList.remove('hide');
  // unhide play again button? 
}

const resetForms = (game) => {
  const formReset = document.getElementById('form-reset');
  const formInsert = document.getElementById('form-insert-ships');
  const formAtk = document.getElementById('form-atk-coords');
  const divInsert = document.getElementById('div-insert');
  const gameMessage = document.getElementById('game-message');

  formReset.classList.add('hide');
  formAtk.classList.add('hide');
  formInsert.classList.remove('hide');

  divInsert.setAttribute('data-ship', 'cruiser');
  gameMessage.innerHTML = `${game._players[game.getCurrentPlayer()].name}'s Turn`;
  divInsert.innerHTML = `${game._players[game.getCurrentPlayer()].name}, choose where to place your cruiser (Length: 3 places):`;
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQUVBLG9CQUFvQixRQUFRO0FBQzVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixrQ0FBa0M7QUFDL0Qsd0JBQXdCLGtDQUFrQztBQUMxRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2QkFBNkIsa0NBQWtDO0FBQy9EO0FBQ0Esd0JBQXdCLFlBQVk7QUFDcEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QixhQUFhO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLDRDQUE0QztBQUN6RSwyQkFBMkIsNENBQTRDO0FBQ3ZFLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC8uL3NyYy9qcy9zaGlwLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2FtZWJvYXJkRm5zID0gcmVxdWlyZSgnLi9nYW1lYm9hcmQuanMnKTtcbmNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAuanMnKTtcblxuLy8gRm9yIEdhbWUgdG8gUnVuLlxuLy8gSGFzIHBsYXllcnNfb2JqZWN0IHdoaWNoIGhvbGRzIHR3byBwbGF5ZXIgb2JqZWN0cywgZm9yIHRoZSBnYW1lXG4vLyBIYXMgY3VycmVudFR1cm4gd2hpY2gga2VlcHMgdHJhY2sgb2Ygd2hvc2UgdHVybiBpdCBpcy5cblxuLy8gSFRNTCBoYXMgaW5wdXQgZm9yIGNob29zaW5nIGNvb3JkaW5hdGVzIHRvIHN0cmlrZSBvbiBib2FyZC5cbi8vIE9uY2UgdXNlciBoYXMgaW5wdXR0ZWQgdmFsaWQgY29vcmRpbmF0ZXMsIHJ1biB0dXJuIGZ1bmN0aW9uLlxuLy8gZnVuY3Rpb24gJ3R1cm4nIHdoaWNoIHdpbGwgcnVuIHRocm91Z2ggYSB0dXJuLlxuICAvLyBDb29yZGluYXRlcyB3aWxsIGJlIHNldCB0byBnYW1lYm9hcmQsIHRvIGNoZWNrIGlmIHRoZXJlIGlzIGEgaGl0IG9uIHRoZSBvcHBvbmVudHMgYm9hcmQuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBoaXQsIHdlIHdhbnQgdG8gc2lnbmlmeSB0aGVyZSBpcyBhIGhpdFxuICAgICAgLy8gV2Ugd2FudCB0byBjaGVjayBpZiBhIHNoaXAgaGFzIGZhbGxlblxuICAgICAgLy8gV2Ugd2FudCB0byBjaGVjayBpZiBhbGwgc2hpcHMgaGF2ZSBmYWxsZW5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIG1pc3MsIHdlIHdhbnQgdG8gc2lnbmlmeSB0aGF0IGl0IGlzIGEgbWlzc1xuICAgICAgLy8gV2Ugd2FudCB0byBhZGQgdG8gdGhlIG1pc3MgYXJyYXlcbiAgICAvLyBDaGFuZ2UgdGhlIGN1cnJlbnRUdXJuIHRvIHRoZSBvcHBvbmVudHMgdHVyblxuICAgIC8vIFVwZGF0ZSB0aGUgSFRNTCBEb20gdG8gc2lnbmlmeSB0aGF0IGl0IGlzIHRoZSBvcHBvbmVudHMgdHVyblxuY29uc3QgR2FtZSA9ICgpID0+IHtcbiAgY29uc3QgX3BsYXllcnMgPSB7fTtcbiAgbGV0IF9jdXJyZW50VHVybiA9IDE7XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGxheWVyKHBsYXllck5hbWUpIHtcbiAgICBjb25zdCBwbGF5ZXJOdW1iZXIgPSBfcGxheWVyc1sxXSA/IDIgOiAxO1xuXG4gICAgX3BsYXllcnNbcGxheWVyTnVtYmVyXSA9IHtcbiAgICAgIG5hbWU6IHBsYXllck5hbWUsXG4gICAgICBib2FyZDogZ2FtZWJvYXJkRm5zLkdhbWVib2FyZCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIF9wbGF5ZXJzW3BsYXllck51bWJlcl07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDdXJyZW50UGxheWVyKCkge1xuICAgIHJldHVybiBfY3VycmVudFR1cm47XG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZGF0ZUNvb3JkaW5hdGUoY29vcmQpIHtcbiAgICAvLyBWYWxpZGF0ZUNvb3JkaW5hdGUgd2lsbCBjaGVjayB0byBtYWtlIHN1cmUgdGhlIGNvb3JkaW5hdGVzIGFyZSBpbiB0aGUgcmFuZ2UgMCBhbmQgOS5cbiAgICBpZiAoY29vcmRbMF0gPCAwIHx8IGNvb3JkWzBdID4gOSB8fCBjb29yZFsxXSA8IDAgfHwgY29vcmRbMV0gPiA5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBjdXJyZW50UGxheWVycyBib2FyZCBkb2VzIG5vdCBoYXZlIHRoYXQgYXMgYSBNaXNzZWQgY29vcmRpbmF0ZSBvciBoaXQgY29vcmRpbmF0ZS5cbiAgICBjb25zdCBvcHBvbmVudEdhbWVib2FyZCA9IF9jdXJyZW50VHVybiA9PT0gMSA/IF9wbGF5ZXJzWzJdLmJvYXJkIDogX3BsYXllcnNbMV0uYm9hcmQ7XG4gICAgLy8gSWYgb3Bwb25lbnQgYm9hcmQgaGFzIGR1cGxpY2F0ZXMsIHJldHVybiBmYWxzZS5cbiAgICBpZiAob3Bwb25lbnRHYW1lYm9hcmQuY2hlY2tGb3JEdXBsaWNhdGVzKGNvb3JkKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrSW5zZXJ0UGFyYW1ldGVycyhzaGlwTGVuZ3RoLCBzdGFydCwgZW5kKSB7XG4gICAgbGV0IGR4O1xuICAgIGxldCBkeTtcbiAgICBpZiAoTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICE9PSAwKSB7XG4gICAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSArIDE7XG4gICAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKVxuICAgIH0gZWxzZSB7XG4gICAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKVxuICAgICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSkgKyAxO1xuICAgIH1cbiAgXG4gICAgLy8gSWYgZHggYW5kIGR5IGFyZW4ndCB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBpbmNvcnJlY3QuXG4gICAgLy8gVGhpcyBpcyBqdXN0IGZvciBtYW51YWxseSBpbnB1dHRpbmcgY29vcmRpbmF0ZXMgYW5kIG5vdCBmb3IgZnV0dXJlLlxuICAgIGlmIChkeCAhPT0gc2hpcExlbmd0aCAmJiBkeSAhPT0gc2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIElmIHRoZSBob3Jpem9udGFsIGlzIGNvcnJlY3QsIHRoZW4gZHkgbXVzdCBiZSAwIGJlY2F1c2UgdGhlcmUgaXMgbm8gZGlhZ29uYWwgc2hpcCBwbGFjZW1lbnRcbiAgICB9IGVsc2UgaWYgKGR4ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gKGR5ID09PSAwKSA/IHRydWUgOiBmYWxzZTtcbiAgICAvLyBJZiB0aGUgdmVydGljYWwgZGlmZmVyZW5jZSBpcyB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGhvcml6b250YWwgZGlmZmVyZW5jZSBzaG91bGQgYmUgMC5cbiAgICB9IGVsc2UgaWYgKGR5ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gKGR4ID09PSAwKSA/IHRydWUgOiBmYWxzZTsgXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdHVybihjb29yZCkge1xuICAgIC8vIEdpdmVuIGEgY29vcmRpbmF0ZSwgd2UgY2hlY2sgdG8gc2VlIGlmIHRoZSBvcHBvbmVudCBnYW1lYm9hcmQgd2lsbCBnZXQgaGl0IG9yIGEgbWlzcy5cbiAgICBjb25zdCBvcHBvbmVudEdhbWVib2FyZCA9IF9jdXJyZW50VHVybiA9PT0gMSA/IF9wbGF5ZXJzWzJdLmJvYXJkIDogX3BsYXllcnNbMV0uYm9hcmQ7XG4gICAgY29uc3QgYXRrID0gb3Bwb25lbnRHYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZCk7XG4gICAgLy8gaWYgYXRrIGlzIHR5cGUgb2JqZWN0LCB0aGVuIHRoZSBnYW1lYm9hcmQgcmV0dXJuZWQgYSBtaXNzLlxuICAgIC8vIHVwZGF0ZSBnYW1lIG1lc3NhZ2UgdG8gc3RhdGUgdGhhdCBpdCB3YXMgYSBtaXNzLlxuICAgIGlmIChvcHBvbmVudEdhbWVib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICByZXR1cm4gJ0dhbWUgT3ZlciEnO1xuICAgIH1cbiAgICByZXR1cm4gYXRrO1xuICB9XG5cbiAgZnVuY3Rpb24gc3dhcFR1cm5zKCkge1xuICAgIF9jdXJyZW50VHVybiA9IF9jdXJyZW50VHVybiA9PT0gMSA/IDIgOiAxO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBfcGxheWVycyxcbiAgICBjcmVhdGVQbGF5ZXIsXG4gICAgZ2V0Q3VycmVudFBsYXllcixcbiAgICB2YWxpZGF0ZUNvb3JkaW5hdGUsXG4gICAgY2hlY2tJbnNlcnRQYXJhbWV0ZXJzLFxuICAgIHR1cm4sXG4gICAgc3dhcFR1cm5zLFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7IiwiY29uc3QgR2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBfYm9hcmQgPSBBcnJheS5mcm9tKHtsZW5ndGg6IDEwfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwoJycpKTtcbiAgY29uc3QgX3NoaXBzID0ge307XG4gIGNvbnN0IF9taXNzZWRBdHRhY2tzID0gW107XG5cbiAgLy8gdmFsaWRhdGVJbnNlcnQgZnVuY3Rpb25cbiAgLy8gR2l2ZW4gYSBzdGFydCBhbmQgZW5kIHBhcmFtZXRlclxuICAvLyBHb2luZyBmcm9tIHRoZSBzdGFydCB0byB0aGUgZW5kIG1hcmtlclxuICBmdW5jdGlvbiB2YWxpZGF0ZUluc2VydChzdGFydCwgZW5kKSB7XG4gICAgY29uc3QgZHggPSBzdGFydFswXSAtIGVuZFswXTtcbiAgICBjb25zdCBkeSA9IHN0YXJ0WzFdIC0gZW5kWzFdO1xuICAgIGxldCBtYXJrZXIgPSBzdGFydDtcbiAgICBpZiAoZHgpIHtcbiAgICAgIHdoaWxlIChtYXJrZXJbMF0gIT09IGVuZFswXSkge1xuICAgICAgICBpZiAoX2JvYXJkW21hcmtlclsxXV1bbWFya2VyWzBdXSAhPT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR4IDwgMCkge1xuICAgICAgICAgIG1hcmtlciA9IFttYXJrZXJbMF0gKyAxLCBzdGFydFsxXV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFya2VyID0gW21hcmtlclswXSAtIDEsIHN0YXJ0WzFdXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAobWFya2VyWzFdICE9PSBlbmRbMV0pIHtcbiAgICAgICAgaWYgKF9ib2FyZFttYXJrZXJbMV1dW21hcmtlclswXV0gIT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSA8IDApIHtcbiAgICAgICAgICBtYXJrZXIgPSBbc3RhcnRbMF0sIG1hcmtlclsxXSArIDFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcmtlciA9IFtzdGFydFswXSwgbWFya2VyWzFdIC0gMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnQoc2hpcE9iaiwgc3RhcnQsIGVuZCkge1xuICAgIGxldCBzaGlwTGVuZ3RoID0gc2hpcE9iai5zaGlwTGVuZ3RoO1xuICAgIF9zaGlwc1tzaGlwT2JqLm5hbWVdID0gc2hpcE9iajtcbiAgICBsZXQgZHggPSBzdGFydFswXSAtIGVuZFswXTtcbiAgICBsZXQgZHkgPSBzdGFydFsxXSAtIGVuZFsxXTtcbiAgICBpZiAoZHgpIHtcbiAgICAgIGR4ID0gTWF0aC5hYnMoZHgpICsgMTtcbiAgICAgIGxldCB4TWFya2VyID0gc3RhcnRbMF07XG4gICAgICB3aGlsZSAoZHgpIHtcbiAgICAgICAgaWYgKHN0YXJ0WzBdID4gZW5kWzBdKSB7XG4gICAgICAgICAgX2JvYXJkW3N0YXJ0WzFdXVt4TWFya2VyXSA9IHNoaXBPYmoubmFtZTtcbiAgICAgICAgICB4TWFya2VyIC09IDE7XG4gICAgICAgICAgZHggLT0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfYm9hcmRbc3RhcnRbMV1dW3hNYXJrZXJdID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgIHhNYXJrZXIgKz0gMVxuICAgICAgICAgIGR4IC09IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZHkgPSBNYXRoLmFicyhkeSkgKyAxO1xuICAgICAgbGV0IHlNYXJrZXIgPSBzdGFydFsxXTtcbiAgICAgIHdoaWxlIChkeSkge1xuICAgICAgICBpZiAoc3RhcnRbMV0gPiBlbmRbMV0pIHtcbiAgICAgICAgICBfYm9hcmRbeU1hcmtlcl1bc3RhcnRbMF1dID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgIHlNYXJrZXIgLT0gMTtcbiAgICAgICAgICBkeSAtPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9ib2FyZFt5TWFya2VyXVtzdGFydFswXV0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgeU1hcmtlciArPSAxO1xuICAgICAgICAgIGR5IC09IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9ib2FyZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soY29vcmQpIHtcbiAgICBjb25zdCBib2FyZGxvY2F0aW9uID0gX2JvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV07XG5cbiAgICBpZiAoYm9hcmRsb2NhdGlvbiAhPT0gJycpIHtcbiAgICAgIGNvbnN0IHNoaXAgPSBfc2hpcHNbYm9hcmRsb2NhdGlvbl07XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgXG4gICAgICBfYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSA9ICdIJztcblxuICAgICAgaWYgKHNoaXAuaXNTdW5rKCkpIHtcbiAgICAgICAgcmV0dXJuIGAke3NoaXAubmFtZX0gc3VuayFgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGAke3NoaXAubmFtZX0gaGl0IWA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIF9taXNzZWRBdHRhY2tzLnB1c2goY29vcmQpO1xuICAgICAgX2JvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0gPSAnTSc7XG4gICAgICByZXR1cm4gY29vcmQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tGb3JEdXBsaWNhdGVzKGNvb3JkKSB7XG4gICAgY29uc3QgYm9hcmRMb2NhdGlvbiA9IF9ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xuICAgIGlmIChib2FyZExvY2F0aW9uID09PSAnSCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBkdXBlcyA9IF9taXNzZWRBdHRhY2tzLmZpbHRlcigoZWxlKSA9PiB7XG4gICAgICByZXR1cm4gZWxlWzBdID09PSBjb29yZFswXSAmJiBlbGVbMV0gPT09IGNvb3JkWzFdO1xuICAgIH0pO1xuICAgIHJldHVybiBkdXBlcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICBmb3IgKGNvbnN0IHNoaXBOYW1lIGluIF9zaGlwcykge1xuICAgICAgY29uc3Qgc2hpcCA9IF9zaGlwc1tzaGlwTmFtZV07XG4gICAgICBpZiAoIXNoaXAuaXNTdW5rKCkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiB7XG4gICAgX2JvYXJkLFxuICAgIF9zaGlwcyxcbiAgICBfbWlzc2VkQXR0YWNrcyxcbiAgICB2YWxpZGF0ZUluc2VydCxcbiAgICBpbnNlcnQsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBjaGVja0ZvckR1cGxpY2F0ZXMsXG4gICAgZ2FtZU92ZXJcbiAgfVxufVxuXG4vKlxuY29uc3QgY2hlY2tJbnNlcnRQYXJhbWV0ZXJzID0oc2hpcExlbmd0aCwgc3RhcnQsIGVuZCkgPT4ge1xuICBsZXQgZHg7XG4gIGxldCBkeTtcbiAgaWYgKE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSAhPT0gMCkge1xuICAgIGR4ID0gTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICsgMTtcbiAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKVxuICB9IGVsc2Uge1xuICAgIGR4ID0gTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pXG4gICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSkgKyAxO1xuICB9XG5cbiAgLy8gSWYgZHggYW5kIGR5IGFyZW4ndCB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBpbmNvcnJlY3QuXG4gIC8vIFRoaXMgaXMganVzdCBmb3IgbWFudWFsbHkgaW5wdXR0aW5nIGNvb3JkaW5hdGVzIGFuZCBub3QgZm9yIGZ1dHVyZS5cbiAgaWYgKGR4ICE9PSBzaGlwTGVuZ3RoICYmIGR5ICE9PSBzaGlwTGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBJZiB0aGUgaG9yaXpvbnRhbCBpcyBjb3JyZWN0LCB0aGVuIGR5IG11c3QgYmUgMCBiZWNhdXNlIHRoZXJlIGlzIG5vIGRpYWdvbmFsIHNoaXAgcGxhY2VtZW50XG4gIH0gZWxzZSBpZiAoZHggPT09IHNoaXBMZW5ndGgpIHtcbiAgICByZXR1cm4gKGR5ID09PSAwKSA/IHRydWUgOiBmYWxzZTtcbiAgLy8gSWYgdGhlIHZlcnRpY2FsIGRpZmZlcmVuY2UgaXMgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBob3Jpem9udGFsIGRpZmZlcmVuY2Ugc2hvdWxkIGJlIDAuXG4gIH0gZWxzZSBpZiAoZHkgPT09IHNoaXBMZW5ndGgpIHtcbiAgICByZXR1cm4gKGR4ID09PSAwKSA/IHRydWUgOiBmYWxzZTsgXG4gIH1cbn1cbiovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBHYW1lYm9hcmRcbn07IiwiLypcblJFTUVNQkVSIHlvdSBvbmx5IGhhdmUgdG8gdGVzdCB5b3VyIG9iamVjdOKAmXMgcHVibGljIGludGVyZmFjZS5cbk9ubHkgbWV0aG9kcyBvciBwcm9wZXJ0aWVzIHRoYXQgYXJlIHVzZWQgb3V0c2lkZSBvZiB5b3VyIOKAmHNoaXDigJkgb2JqZWN0IG5lZWQgdW5pdCB0ZXN0cy5cbiovXG5cbi8vIFNoaXBzIHNob3VsZCBoYXZlIGEgaGl0KCkgZnVuY3Rpb24gdGhhdCBpbmNyZWFzZXMgdGhlIG51bWJlciBvZiDigJhoaXRz4oCZIGluIHlvdXIgc2hpcC5cblxuLy8gaXNTdW5rKCkgc2hvdWxkIGJlIGEgZnVuY3Rpb24gdGhhdCBjYWxjdWxhdGVzIGl0IGJhc2VkIG9uIHRoZWlyIGxlbmd0aCBcbi8vIGFuZCB0aGUgbnVtYmVyIG9mIOKAmGhpdHPigJkuXG5jb25zdCBTaGlwID0gKG5hbWUsIGhpdHBvaW50cykgPT4ge1xuICBsZXQgX2hpdHBvaW50cyA9IGhpdHBvaW50cztcbiAgY29uc3Qgc2hpcExlbmd0aCA9IGhpdHBvaW50cztcbiAgbGV0IF9zdW5rID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gaGl0KCkge1xuICAgIF9oaXRwb2ludHMgLT0gMTtcblxuICAgIGlmICghX2hpdHBvaW50cykge1xuICAgICAgX3N1bmsgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBfaGl0cG9pbnRzO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNTdW5rKCkge1xuICAgIHJldHVybiBfc3VuaztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZSxcbiAgICBzaGlwTGVuZ3RoLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hpcDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpO1xuY29uc3QgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBjb25zdCBnYW1lID0gR2FtZSgpO1xuICBnYW1lLmNyZWF0ZVBsYXllcignSnVzdGluJyk7XG4gIGdhbWUuY3JlYXRlUGxheWVyKCdKZWZmJyk7XG4gIHNldFBsYXllckJvYXJkTmFtZXMoZ2FtZSk7XG4gIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG5cbiAgc3RhcnRQcmVwUGhhc2UoZ2FtZSk7XG4gIHN0YXJ0QmF0dGxlUGhhc2UoZ2FtZSk7XG4gIHNldFJlc2V0QnRuTGlzdGVuZXIoZ2FtZSk7XG59KTtcblxuY29uc3Qgc2V0UGxheWVyQm9hcmROYW1lcyA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGJvYXJkT25lSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2LmJvYXJkW2RhdGEtcGxheWVyPVwiMVwiXSA+IGgzYCk7XG4gIGNvbnN0IGJvYXJkVHdvSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2LmJvYXJkW2RhdGEtcGxheWVyPVwiMlwiXSA+IGgzYCk7XG5cbiAgYm9hcmRPbmVIZWFkZXIuaW5uZXJIVE1MID0gYCR7Z2FtZS5fcGxheWVyc1sxXS5uYW1lfSdzIEJvYXJkYDtcbiAgYm9hcmRUd29IZWFkZXIuaW5uZXJIVE1MID0gYCR7Z2FtZS5fcGxheWVyc1syXS5uYW1lfSdzIEJvYXJkYDtcbn1cblxuY29uc3Qgc3RhcnRQcmVwUGhhc2UgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBpbnB1dEluc2VydENvb3JkaW5hdGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1jb29yZGluYXRlcycpO1xuICBjb25zdCBzcGFuSW5zZXJ0RXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1pbnNlcnQtZXJyb3InKTtcblxuICBzZXRQcmVwSGVhZGVyKGdhbWUpO1xuICBzZXRJbnB1dExpc3RlbmVyKGlucHV0SW5zZXJ0Q29vcmRpbmF0ZXMsIHNwYW5JbnNlcnRFcnJvcik7XG4gIHNldFByZXBTdWJtaXRCdG5MaXN0ZW5lcihnYW1lKTtcbn1cblxuY29uc3Qgc2V0UHJlcEhlYWRlciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCBwbGF5ZXJPbmUgPSBnYW1lLl9wbGF5ZXJzWzFdO1xuICBjb25zdCBkaXZJbnNlcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWluc2VydCcpO1xuICBcbiAgZ2FtZU1lc3NhZ2UuaW5uZXJIVE1MID0gYCR7cGxheWVyT25lLm5hbWV9J3MgVHVybmA7XG4gIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGNydWlzZXIgKExlbmd0aDogMyBQbGFjZXMpOmA7XG59XG5cbmNvbnN0IHNldFByZXBTdWJtaXRCdG5MaXN0ZW5lciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVQaGFzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLXBoYXNlJyk7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCBmb3JtSW5zZXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0taW5zZXJ0LXNoaXBzJyk7XG4gIGNvbnN0IGZvcm1CYXR0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1hdGstY29vcmRzJyk7XG4gIGNvbnN0IGRpdkluc2VydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtaW5zZXJ0Jyk7XG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1jb29yZGluYXRlcycpO1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1pbnNlcnQtZXJyb3InKTtcbiAgY29uc3Qgc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydC1zdWJtaXQnKTtcblxuICBsZXQgY3VycmVudFBsYXllciA9IGdhbWUuX3BsYXllcnNbMV07XG4gIHN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGN1cnJlbnRTaGlwID0gZGl2SW5zZXJ0LmdldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJyk7XG4gICAgY29uc3QgY29vcmRpbmF0ZXNBcnJheSA9IGlucHV0LnZhbHVlLnNwbGl0KCcgJyk7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBbdHJhbnNmb3JtSW5wdXRUb0Nvb3JkKGNvb3JkaW5hdGVzQXJyYXlbMF0pLCB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQoY29vcmRpbmF0ZXNBcnJheVsxXSldO1xuICAgIGlmIChjdXJyZW50U2hpcCA9PT0gJ2NydWlzZXInKSB7XG4gICAgICAvLyBUaGUgdHdvIGNvb3JkaW5hdGVzIG1hdGNoIHRoZSBsZW5ndGggb2YgdGhlIHNoaXBcbiAgICAgIGlmIChnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycygzLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIC8vIENoZWNrIHRoYXQgdHdvIGNvb3JkaW5hdGVzIGRvbid0IGludGVyZmVyZSB3aXRoIG90aGVyIHNoaXBzIG9uIHRoZSBwbGF5ZXJzIGJvYXJkLlxuICAgICAgICBpZiAoY3VycmVudFBsYXllci5ib2FyZC52YWxpZGF0ZUluc2VydChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0NydWlzZXInLCAzKTtcbiAgICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdiYXR0bGVzaGlwJyk7XG4gICAgICAgICAgZGl2SW5zZXJ0LmlubmVySFRNTCA9IGAke2N1cnJlbnRQbGF5ZXIubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGJhdHRsZXNoaXAgKExlbmd0aDogNSBwbGFjZXMpOmA7XG4gICAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IGdhbWUuX3BsYXllcnNbMV0pIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IERpZmZlcmVudCBTaGlwIHBsYWNlZCBhdCBjb29yZGluYXRlcy4gVXNlIGRpZmZlcmVudCBjb29yZGluYXRlcy4nO1xuICAgICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IENvb3JkaW5hdGVzIHJhbmdlIGRvZXMgbm90IG1hdGNoIHNoaXAgbGVuZ3RoLic7XG4gICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjdXJyZW50U2hpcCA9PT0gJ2JhdHRsZXNoaXAnKSB7XG4gICAgICBpZiAoZ2FtZS5jaGVja0luc2VydFBhcmFtZXRlcnMoNSwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICBpZiAoY3VycmVudFBsYXllci5ib2FyZC52YWxpZGF0ZUluc2VydChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0JhdHRsZXNoaXAnLCA1KTtcbiAgICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdkZXN0cm95ZXInKTtcbiAgICAgICAgICBkaXZJbnNlcnQuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSwgY2hvb3NlIHdoZXJlIHRvIHBsYWNlIHlvdXIgZGVzdG95ZXIgKExlbmd0aDogMiBwbGFjZXMpOmA7XG4gICAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IGdhbWUuX3BsYXllcnNbMV0pIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IERpZmZlcmVudCBTaGlwIHBsYWNlZCBhdCBjb29yZGluYXRlcy4gVXNlIGRpZmZlcmVudCBjb29yZGluYXRlcy4nO1xuICAgICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IENvb3JkaW5hdGVzIHJhbmdlIGRvZXMgbm90IG1hdGNoIHNoaXAgbGVuZ3RoLic7XG4gICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjdXJyZW50U2hpcCA9PT0gJ2Rlc3Ryb3llcicpIHtcbiAgICAgIGlmIChnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycygyLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIGlmIChjdXJyZW50UGxheWVyLmJvYXJkLnZhbGlkYXRlSW5zZXJ0KGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgICBjb25zdCBzaGlwID0gU2hpcCgnRGVzdHJveWVyJywgMik7XG4gICAgICAgICAgY3VycmVudFBsYXllci5ib2FyZC5pbnNlcnQoc2hpcCwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKTtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PT0gZ2FtZS5fcGxheWVyc1sxXSkge1xuICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgICAgICAgICAgICAvLyBBZnRlciA1IHNlY29uZHNcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBIaWRlIFBsYXllciAxIGJvYXJkXG4gICAgICAgICAgICAgIGhpZGVHYW1lQm9hcmQoMSk7XG4gICAgICAgICAgICAgIC8vIENoYW5nZWQgY3VycmVudFBsYXllciB2YXJpYWJsZSB0byBQbGF5ZXIgMlxuICAgICAgICAgICAgICBjdXJyZW50UGxheWVyID0gZ2FtZS5fcGxheWVyc1syXTtcbiAgICAgICAgICAgICAgZ2FtZU1lc3NhZ2UuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSdzIFR1cm5gO1xuICAgICAgICAgICAgICAvLyBTZXQgZGl2IEluc2VydCB0byBjcnVpc2VyXG4gICAgICAgICAgICAgIGRpdkluc2VydC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsICdjcnVpc2VyJyk7XG4gICAgICAgICAgICAgIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtjdXJyZW50UGxheWVyLm5hbWV9LCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBjcnVpc2VyIChMZW5ndGg6IDMgcGxhY2VzKTpgO1xuICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgyLCBnYW1lLl9wbGF5ZXJzWycyJ10uYm9hcmQuX2JvYXJkKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGhpZGVHYW1lQm9hcmQoMik7XG4gICAgICAgICAgICAgIGdhbWVQaGFzZS5pbm5lckhUTUwgPSAnQmF0dGxlIFBoYXNlJztcbiAgICAgICAgICAgICAgZm9ybUluc2VydC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgICAgICAgIGZvcm1CYXR0bGUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgICBzZXRCYXR0bGVIZWFkZXIoZ2FtZSk7XG4gICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogRGlmZmVyZW50IFNoaXAgcGxhY2VkIGF0IGNvb3JkaW5hdGVzLiBVc2UgZGlmZmVyZW50IGNvb3JkaW5hdGVzLic7XG4gICAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogQ29vcmRpbmF0ZXMgcmFuZ2UgZG9lcyBub3QgbWF0Y2ggc2hpcCBsZW5ndGguJztcbiAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5jb25zdCBzdGFydEJhdHRsZVBoYXNlID0gKGdhbWUpID0+IHtcbiAgY29uc3QgZ2FtZU1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1tZXNzYWdlJyk7XG4gIGNvbnN0IGlucHV0Q29vcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29vcmQnKTtcbiAgY29uc3Qgc3BhbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYW4tY29vcmQtZXJyb3InKTtcbiAgY29uc3QgY3VycmVudFBsYXllciA9IGdhbWUuZ2V0Q3VycmVudFBsYXllcigpO1xuICBcbiAgZ2FtZU1lc3NhZ2UuaW5uZXJIVE1MID0gYCR7Z2FtZS5fcGxheWVyc1tjdXJyZW50UGxheWVyXS5uYW1lfSdzIFR1cm5gO1xuICBcbiAgc2V0SW5wdXRMaXN0ZW5lcihpbnB1dENvb3JkLCBzcGFuRXJyb3IpO1xuICBzZXRCYXR0bGVTdWJtaXRCdG5MaXN0ZW5lcihnYW1lKTtcbn1cblxuY29uc3Qgc2V0QmF0dGxlU3VibWl0QnRuTGlzdGVuZXIgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBpbnB1dENvb3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb3JkJyk7XG4gIGNvbnN0IGlucHV0U3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F0ay1zdWJtaXQnKTtcbiAgY29uc3Qgc3BhbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYW4tY29vcmQtZXJyb3InKTtcblxuICBpbnB1dFN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlucHV0Q29vcmQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIGNvbnN0IGNvb3JkaW5hdGUgPSB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQoaW5wdXRDb29yZC52YWx1ZSk7XG4gICAgLy8gR2l2ZW4gYW4gaW5wdXQsIHdlIG5lZWQgdG8gdmFsaWRhdGUgdGhhdCBpdCBpcyBhIHZhbGlkIGNvb3JkaW5hdGUuXG4gICAgaWYgKGdhbWUudmFsaWRhdGVDb29yZGluYXRlKGNvb3JkaW5hdGUpKSB7XG4gICAgICBpZiAoIXNwYW5FcnJvci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSkge1xuICAgICAgICBzcGFuRXJyb3IuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgfVxuICAgICAgY29uc3QgdHVybiA9IGdhbWUudHVybihjb29yZGluYXRlKTtcbiAgICAgIGlmICh0dXJuID09PSAnR2FtZSBPdmVyIScpIHtcbiAgICAgICAgZGlzcGxheUdhbWVPdmVyKGdhbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzcGxheVR1cm5SZXN1bHQodHVybiwgZ2FtZSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIC8vIENoYW5nZSBnYW1lIHBoYXNlIGN1cnJlbnQgdHVybi5cbiAgICAgICAgICBnYW1lLnN3YXBUdXJucygpO1xuICAgICAgICAgIGlucHV0Q29vcmQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICB1cGRhdGVUdXJuUGhhc2UoZ2FtZSk7XG4gICAgICAgIH0sIDMwMDApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkaXNwbGF5QXRrRXJyb3JNZXNzYWdlKGNvb3JkaW5hdGUpO1xuICAgICAgaW5wdXRDb29yZC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG59XG5cbmNvbnN0IHNldElucHV0TGlzdGVuZXIgPSAoaW5wdXQsIHNwYW4pID0+IHtcbiAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XG4gICAgaWYgKCFpbnB1dC52YWxpZGl0eS52YWxpZCkge1xuICAgICAgZGlzcGxheUlucHV0RXJyb3IoaW5wdXQpO1xuICAgICAgc3Bhbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghc3Bhbi5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSkge1xuICAgICAgICBzcGFuLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5jb25zdCBzZXRSZXNldEJ0bkxpc3RlbmVyID0gKGdhbWUpID0+IHtcbiAgY29uc3QgcmVzZXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuLXJlc2V0Jyk7XG5cbiAgcmVzZXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICB9KTtcbn1cblxuY29uc3QgZGlzcGxheUlucHV0RXJyb3IgPSAoaW5wdXQpID0+IHtcbiAgY29uc3QgcGFyZW50RWxlbWVudCA9IGlucHV0LnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IHNwYW5FcnJvckVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LmNoaWxkcmVuWzNdO1xuICBpZiAoaW5wdXQudmFsaWRpdHkudmFsdWVNaXNzaW5nKSB7XG4gICAgc3BhbkVycm9yRWxlbWVudC5pbm5lckhUTUwgPSAnRXJyb3I6IElucHV0IGlzIHJlcXVpcmVkLic7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgfSBlbHNlIGlmIChpbnB1dC52YWxpZGl0eS50b29Mb25nKSB7XG4gICAgc3BhbkVycm9yRWxlbWVudC5pbm5lckhUTUwgPSAnRXJyb3I6IElucHV0IGlzIHRvbyBsb25nLic7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgfSBlbHNlIGlmIChpbnB1dC52YWxpZGl0eS5wYXR0ZXJuTWlzbWF0Y2gpIHtcbiAgICBzcGFuRXJyb3JFbGVtZW50LmlubmVySFRNTCA9IChpbnB1dC5pZCA9PT0gJ2luc2VydC1jb29yZGluYXRlcycpXG4gICAgICA/ICdFcnJvcjogSW5wdXQgZG9lcyBub3QgbWF0Y2ggcGF0dGVybi4gZXg6IFwiQTQgQTZcIi4nXG4gICAgICA6ICdFcnJvcjogSW5wdXQgZG9lcyBub3QgbWF0Y2ggcGF0dGVybi4gZXg6IFwiQTVcIi4nO1xuICB9IGVsc2Uge1xuICAgIHNwYW5FcnJvckVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgfVxufVxuXG5jb25zdCB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQgPSAoaW5wdXRWYWwpID0+IHtcbiAgY29uc3QgYWxwaCA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSyddO1xuICBcbiAgY29uc3QgaWR4U3RhcnQgPSBhbHBoLmZpbmRJbmRleCgoZWxlKSA9PiB7XG4gICAgcmV0dXJuIGVsZSA9PT0gaW5wdXRWYWxbMF07XG4gIH0pO1xuICByZXR1cm4gW2lkeFN0YXJ0LCBwYXJzZUludChpbnB1dFZhbC5zbGljZSgxKSkgLSAxXTtcbn1cblxuY29uc3QgZGlzcGxheUdhbWVCb2FyZCA9IChwbGF5ZXJOdW1iZXIsIHBsYXllckJvYXJkKSA9PiB7XG4gIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2LmJvYXJkW2RhdGEtcGxheWVyPVwiJHtwbGF5ZXJOdW1iZXJ9XCJdYCk7XG4gIGNvbnN0IHJvd0xpc3RJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIiR7cGxheWVyTnVtYmVyfVwiXSA+IHVsID4gbGlgKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllckJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYm9hcmRSb3cgPSBwbGF5ZXJCb2FyZFtpXTtcbiAgICBjb25zdCBkaXNwbGF5Qm9hcmRSb3cgPSByb3dMaXN0SXRlbXNbaSArIDFdO1xuICAgIGNvbnN0IHNwYW5zID0gZGlzcGxheUJvYXJkUm93LmNoaWxkcmVuO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBib2FyZFJvdy5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKGJvYXJkUm93W2pdID09PSAnJykge1xuICAgICAgICBzcGFuc1tqICsgMV0uaW5uZXJIVE1MID0gJyc7XG4gICAgICB9IGVsc2UgaWYgKGJvYXJkUm93W2pdID09PSAnSCcpIHtcbiAgICAgICAgc3BhbnNbaiArIDFdLmlubmVySFRNTCA9ICdIJztcbiAgICAgIH0gZWxzZSBpZiAoYm9hcmRSb3dbal0gPT09ICdNJykge1xuICAgICAgICBzcGFuc1tqICsgMV0uaW5uZXJIVE1MID0gJ1gnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhbnNbaiArIDFdLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgIGlmIChib2FyZFJvd1tqXSA9PT0gJ0NydWlzZXInKSB7XG4gICAgICAgICAgc3BhbnNbaiArIDFdLmFwcGVuZENoaWxkKGNyZWF0ZUdhbWVJY29uKCdjcnVpc2VyJykpO1xuICAgICAgICB9IGVsc2UgaWYgKGJvYXJkUm93W2pdID09PSAnQmF0dGxlc2hpcCcpIHtcbiAgICAgICAgICBzcGFuc1tqICsgMV0uYXBwZW5kQ2hpbGQoY3JlYXRlR2FtZUljb24oJ2JhdHRsZXNoaXAnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhbnNbaiArIDFdLmFwcGVuZENoaWxkKGNyZWF0ZUdhbWVJY29uKCdkZXN0cm95ZXInKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xufVxuXG4vLyBEaXNwbGF5cyBPcHBvbmVudHMgZ2FtZWJvYXJkIHdpdGggaGl0cyBhbmQgbWlzc2VzXG5jb25zdCBkaXNwbGF5T3Bwb25lbnRHYW1lYm9hcmQgPSAocGxheWVyTnVtYmVyLCBwbGF5ZXJCb2FyZCkgPT4ge1xuICBjb25zdCBib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIiR7cGxheWVyTnVtYmVyfVwiXWApO1xuICBjb25zdCByb3dMaXN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl0gPiB1bCA+IGxpYCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGJvYXJkUm93ID0gcGxheWVyQm9hcmRbaV07XG4gICAgY29uc3QgZGlzcGxheUJvYXJkUm93ID0gcm93TGlzdEl0ZW1zW2kgKyAxXTtcbiAgICBjb25zdCBzcGFucyA9IGRpc3BsYXlCb2FyZFJvdy5jaGlsZHJlbjtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmRSb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChib2FyZFJvd1tqXSA9PT0gJ0gnKSB7XG4gICAgICAgIHNwYW5zW2ogKyAxXS5pbm5lckhUTUwgPSAnSCc7XG4gICAgICB9IGVsc2UgaWYgKGJvYXJkUm93W2pdID09PSAnTScpIHtcbiAgICAgICAgc3BhbnNbaiArIDFdLmlubmVySFRNTCA9ICdYJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5zW2ogKyAxXS5pbm5lckhUTUwgPSAnJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xufVxuXG4vLyBIaWRlcyBhbnkgZ2FtZSBib2FyZC5cbmNvbnN0IGhpZGVHYW1lQm9hcmQgPSAocGxheWVyTnVtYmVyKSA9PiB7XG4gIGNvbnN0IHJvd0xpc3RJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIiR7cGxheWVyTnVtYmVyfVwiXSA+IHVsID4gbGlgKTtcblxuICBmb3IgKGxldCBpID0gMTsgaSA8IDExOyBpKyspIHtcbiAgICBjb25zdCBkaXNwbGF5Qm9hcmRSb3cgPSByb3dMaXN0SXRlbXNbaV07XG4gICAgY29uc3Qgc3BhbnMgPSBkaXNwbGF5Qm9hcmRSb3cuY2hpbGRyZW47XG5cbiAgICBmb3IgKGxldCBqID0gMTsgaiA8IDExOyBqKyspIHtcbiAgICAgIHNwYW5zW2pdLmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBjcmVhdGVHYW1lSWNvbiA9IChuYW1lKSA9PiB7XG4gIGNvbnN0IG9iaiA9IHtcbiAgICAnY3J1aXNlcic6ICdNMTkyIDMyYzAtMTcuNyAxNC4zLTMyIDMyLTMySDM1MmMxNy43IDAgMzIgMTQuMyAzMiAzMlY2NGg0OGMyNi41IDAgNDggMjEuNSA0OCA0OFYyNDBsNDQuNCAxNC44YzIzLjEgNy43IDI5LjUgMzcuNSAxMS41IDUzLjlsLTEwMSA5Mi42Yy0xNi4yIDkuNC0zNC43IDE1LjEtNTAuOSAxNS4xYy0xOS42IDAtNDAuOC03LjctNTkuMi0yMC4zYy0yMi4xLTE1LjUtNTEuNi0xNS41LTczLjcgMGMtMTcuMSAxMS44LTM4IDIwLjMtNTkuMiAyMC4zYy0xNi4yIDAtMzQuNy01LjctNTAuOS0xNS4xbC0xMDEtOTIuNmMtMTgtMTYuNS0xMS42LTQ2LjIgMTEuNS01My45TDk2IDI0MFYxMTJjMC0yNi41IDIxLjUtNDggNDgtNDhoNDhWMzJ6TTE2MCAyMTguN2wxMDcuOC0zNS45YzEzLjEtNC40IDI3LjMtNC40IDQwLjUgMEw0MTYgMjE4LjdWMTI4SDE2MHY5MC43ek0zMDYuNSA0MjEuOUMzMjkgNDM3LjQgMzU2LjUgNDQ4IDM4NCA0NDhjMjYuOSAwIDU1LjQtMTAuOCA3Ny40LTI2LjFsMCAwYzExLjktOC41IDI4LjEtNy44IDM5LjIgMS43YzE0LjQgMTEuOSAzMi41IDIxIDUwLjYgMjUuMmMxNy4yIDQgMjcuOSAyMS4yIDIzLjkgMzguNHMtMjEuMiAyNy45LTM4LjQgMjMuOWMtMjQuNS01LjctNDQuOS0xNi41LTU4LjItMjVDNDQ5LjUgNTAxLjcgNDE3IDUxMiAzODQgNTEyYy0zMS45IDAtNjAuNi05LjktODAuNC0xOC45Yy01LjgtMi43LTExLjEtNS4zLTE1LjYtNy43Yy00LjUgMi40LTkuNyA1LjEtMTUuNiA3LjdjLTE5LjggOS00OC41IDE4LjktODAuNCAxOC45Yy0zMyAwLTY1LjUtMTAuMy05NC41LTI1LjhjLTEzLjQgOC40LTMzLjcgMTkuMy01OC4yIDI1Yy0xNy4yIDQtMzQuNC02LjctMzguNC0yMy45czYuNy0zNC40IDIzLjktMzguNGMxOC4xLTQuMiAzNi4yLTEzLjMgNTAuNi0yNS4yYzExLjEtOS40IDI3LjMtMTAuMSAzOS4yLTEuN2wwIDBDMTM2LjcgNDM3LjIgMTY1LjEgNDQ4IDE5MiA0NDhjMjcuNSAwIDU1LTEwLjYgNzcuNS0yNi4xYzExLjEtNy45IDI1LjktNy45IDM3IDB6JyxcbiAgICAnYmF0dGxlc2hpcCc6ICdNMjI0IDBIMzUyYzE3LjcgMCAzMiAxNC4zIDMyIDMyaDc1LjFjMjAuNiAwIDMxLjYgMjQuMyAxOC4xIDM5LjhMNDU2IDk2SDEyMEw5OC44IDcxLjhDODUuMyA1Ni4zIDk2LjMgMzIgMTE2LjkgMzJIMTkyYzAtMTcuNyAxNC4zLTMyIDMyLTMyek05NiAxMjhINDgwYzE3LjcgMCAzMiAxNC4zIDMyIDMyVjI4My41YzAgMTMuMy00LjIgMjYuMy0xMS45IDM3LjJsLTUxLjQgNzEuOWMtMS45IDEuMS0zLjcgMi4yLTUuNSAzLjVjLTE1LjUgMTAuNy0zNCAxOC01MSAxOS45SDM3NS42Yy0xNy4xLTEuOC0zNS05LTUwLjgtMTkuOWMtMjIuMS0xNS41LTUxLjYtMTUuNS03My43IDBjLTE0LjggMTAuMi0zMi41IDE4LTUwLjYgMTkuOUgxODMuOWMtMTctMS44LTM1LjYtOS4yLTUxLTE5LjljLTEuOC0xLjMtMy43LTIuNC01LjYtMy41TDc1LjkgMzIwLjdDNjguMiAzMDkuOCA2NCAyOTYuOCA2NCAyODMuNVYxNjBjMC0xNy43IDE0LjMtMzIgMzItMzJ6bTMyIDY0djk2SDQ0OFYxOTJIMTI4ek0zMDYuNSA0MjEuOUMzMjkgNDM3LjQgMzU2LjUgNDQ4IDM4NCA0NDhjMjYuOSAwIDU1LjMtMTAuOCA3Ny40LTI2LjFsMCAwYzExLjktOC41IDI4LjEtNy44IDM5LjIgMS43YzE0LjQgMTEuOSAzMi41IDIxIDUwLjYgMjUuMmMxNy4yIDQgMjcuOSAyMS4yIDIzLjkgMzguNHMtMjEuMiAyNy45LTM4LjQgMjMuOWMtMjQuNS01LjctNDQuOS0xNi41LTU4LjItMjVDNDQ5LjUgNTAxLjcgNDE3IDUxMiAzODQgNTEyYy0zMS45IDAtNjAuNi05LjktODAuNC0xOC45Yy01LjgtMi43LTExLjEtNS4zLTE1LjYtNy43Yy00LjUgMi40LTkuNyA1LjEtMTUuNiA3LjdjLTE5LjggOS00OC41IDE4LjktODAuNCAxOC45Yy0zMyAwLTY1LjUtMTAuMy05NC41LTI1LjhjLTEzLjQgOC40LTMzLjcgMTkuMy01OC4yIDI1Yy0xNy4yIDQtMzQuNC02LjctMzguNC0yMy45czYuNy0zNC40IDIzLjktMzguNGMxOC4xLTQuMiAzNi4yLTEzLjMgNTAuNi0yNS4yYzExLjEtOS40IDI3LjMtMTAuMSAzOS4yLTEuN2wwIDBDMTM2LjcgNDM3LjIgMTY1LjEgNDQ4IDE5MiA0NDhjMjcuNSAwIDU1LTEwLjYgNzcuNS0yNi4xYzExLjEtNy45IDI1LjktNy45IDM3IDB6JyxcbiAgICAnZGVzdHJveWVyJzogJ00yNTYgMTZjMC03IDQuNS0xMy4yIDExLjItMTUuM3MxMy45IC40IDE3LjkgNi4xbDIyNCAzMjBjMy40IDQuOSAzLjggMTEuMyAxLjEgMTYuNnMtOC4yIDguNi0xNC4yIDguNkgyNzJjLTguOCAwLTE2LTcuMi0xNi0xNlYxNnpNMjEyLjEgOTYuNWM3IDEuOSAxMS45IDguMiAxMS45IDE1LjVWMzM2YzAgOC44LTcuMiAxNi0xNiAxNkg4MGMtNS43IDAtMTEtMy0xMy44LThzLTIuOS0xMS0uMS0xNmwxMjgtMjI0YzMuNi02LjMgMTEtOS40IDE4LTcuNXpNNS43IDQwNC4zQzIuOCAzOTQuMSAxMC41IDM4NCAyMS4xIDM4NEg1NTQuOWMxMC42IDAgMTguMyAxMC4xIDE1LjQgMjAuM2wtNCAxNC4zQzU1MC43IDQ3My45IDUwMC40IDUxMiA0NDMgNTEySDEzM0M3NS42IDUxMiAyNS4zIDQ3My45IDkuNyA0MTguN2wtNC0xNC4zeidcbiAgfVxuXG4gIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpO1xuICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCA1NzYgNTEyJyk7XG4gIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcxcmVtJyk7XG5cbiAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdwYXRoJyk7XG4gIHBhdGguc2V0QXR0cmlidXRlKCdkJywgb2JqW25hbWVdKTtcblxuICBzdmcuYXBwZW5kQ2hpbGQocGF0aCk7XG4gIHJldHVybiBzdmc7XG59XG5cbmNvbnN0IHNldEJhdHRsZUhlYWRlciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCBkaXZBdGsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWF0aycpO1xuICBjb25zdCBjdXJyZW50UGxheWVyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XG4gIGRpc3BsYXlHYW1lQm9hcmQoY3VycmVudFBsYXllciwgZ2FtZS5fcGxheWVyc1tjdXJyZW50UGxheWVyXS5ib2FyZC5fYm9hcmQpO1xuICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSBgJHtnYW1lLl9wbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLm5hbWV9J3MgVHVybmA7XG4gIGRpdkF0ay5pbm5lckhUTUwgPSBgJHtnYW1lLl9wbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLm5hbWV9LCB3aGVyZSB3b3VsZCB5b3UgbGlrZSB0byBhdHRhY2s/YDtcbn1cblxuY29uc3QgZGlzcGxheUF0a0Vycm9yTWVzc2FnZSA9IChjb29yZCkgPT4ge1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1jb29yZC1lcnJvcicpO1xuXG4gIGlmIChjb29yZFswXSA8IDAgfHwgY29vcmRbMF0gPiAxMCB8fCBjb29yZFsxXSA8IDAgfHwgY29vcmRbMV0gPiAxMCkge1xuICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnSW5wdXQgaXMgb3V0IG9mIHJhbmdlLiBUcnkgYWdhaW4uJztcbiAgfSBlbHNlIHtcbiAgICBzcGFuRXJyb3IuaW5uZXJIVE1MID0gJ0lucHV0IGhhcyBiZWVuIGNob3NlbiBhbHJlYWR5LiBUcnkgYWdhaW4uJztcbiAgfVxuICBzcGFuRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xufVxuXG5jb25zdCBkaXNwbGF5VHVyblJlc3VsdCA9ICh0dXJuLCBnYW1lKSA9PiB7XG4gIC8vIFVwZGF0ZSBHYW1lIE1lc3NhZ2UgdG8gaGl0IG9yIG1pc3MsIGRpc3BsYXkgcmVzdWx0IG9mIGF0dGFjay5cbiAgY29uc3QgZ2FtZU1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1tZXNzYWdlJyk7XG4gIGNvbnN0IGN1cnJlbnRQbGF5ZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcbiAgY29uc3Qgb3Bwb3NpdGVQbGF5ZXIgPSBjdXJyZW50UGxheWVyID09PSAxID8gMiA6IDE7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodHVybikpIHtcbiAgICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSAnTUlTUyc7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZU1lc3NhZ2UuaW5uZXJIVE1MID0gdHVybjtcbiAgfVxuXG4gIGRpc3BsYXlPcHBvbmVudEdhbWVib2FyZChvcHBvc2l0ZVBsYXllciwgZ2FtZS5fcGxheWVyc1tvcHBvc2l0ZVBsYXllcl0uYm9hcmQuX2JvYXJkKTtcblxuICAvLyBBZnRlciAyLjUgc2Vjb25kcyBoaWRlIHRoZSBvcHBvbmVudHMgZ2FtZSBib2FyZC5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgaGlkZUdhbWVCb2FyZChvcHBvc2l0ZVBsYXllcik7XG4gIH0sIDIwMDApO1xufVxuXG5jb25zdCB1cGRhdGVUdXJuUGhhc2UgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBnYW1lTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW1lc3NhZ2UnKTtcbiAgY29uc3QgaW5wdXRDb29yZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29yZCcpO1xuICBjb25zdCBkaXZBdGsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWF0aycpO1xuICBjb25zdCBwbGF5ZXIgPSBnYW1lLl9wbGF5ZXJzW2dhbWUuZ2V0Q3VycmVudFBsYXllcigpXTtcblxuICBjb25zdCBjdXJyZW50UGxheWVyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XG4gIGNvbnN0IG9wcG9uZW50UGxheWVyID0gY3VycmVudFBsYXllciA9PT0gMSA/IDIgOiAxO1xuXG4gIC8vIFNob3cgY3VycmVudCBwbGF5ZXJzIGdhbWUgYm9hcmQsIHdpdGggaGl0cyBhbmQgbWlzc2VzIGFuZCBzaGlwcy5cbiAgLy8gc2hvdyBvcHBvbmVudHMgZ2FtZWJvYXJkLCB3aXRoIGhpdHMgYW5kIG1pc3NlcyBidXQgbm8gc2hpcHMuXG4gIGRpc3BsYXlHYW1lQm9hcmQoY3VycmVudFBsYXllciwgZ2FtZS5fcGxheWVyc1tjdXJyZW50UGxheWVyXS5ib2FyZC5fYm9hcmQpO1xuICBkaXNwbGF5T3Bwb25lbnRHYW1lYm9hcmQob3Bwb25lbnRQbGF5ZXIsIGdhbWUuX3BsYXllcnNbb3Bwb25lbnRQbGF5ZXJdLmJvYXJkLl9ib2FyZCk7XG5cbiAgZ2FtZU1lc3NhZ2UuaW5uZXJIVE1MID0gYCR7Z2FtZS5fcGxheWVyc1tjdXJyZW50UGxheWVyXS5uYW1lfSdzIFR1cm5gO1xuICBpbnB1dENvb3JkLnZhbHVlID0gJyc7XG4gIGRpdkF0ay5pbm5lckhUTUwgPSBgJHtwbGF5ZXIubmFtZX0sIHdoZXJlIHdvdWxkIHlvdSBsaWtlIHRvIGF0dGFjaz9gO1xufVxuXG5jb25zdCBkaXNwbGF5R2FtZU92ZXIgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBnYW1lTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW1lc3NhZ2UnKTtcbiAgY29uc3QgZm9ybVJlc2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0tcmVzZXQnKTtcbiAgY29uc3Qgd2lubmVyID0gZ2FtZS5fcGxheWVyc1tnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKV07XG4gIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1sxXS5ib2FyZC5fYm9hcmQpO1xuICBkaXNwbGF5R2FtZUJvYXJkKDIsIGdhbWUuX3BsYXllcnNbMl0uYm9hcmQuX2JvYXJkKTtcblxuICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSBgJHt3aW5uZXIubmFtZX0gd2lucyFgO1xuICBmb3JtUmVzZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAvLyB1bmhpZGUgcGxheSBhZ2FpbiBidXR0b24/IFxufVxuXG5jb25zdCByZXNldEZvcm1zID0gKGdhbWUpID0+IHtcbiAgY29uc3QgZm9ybVJlc2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0tcmVzZXQnKTtcbiAgY29uc3QgZm9ybUluc2VydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtLWluc2VydC1zaGlwcycpO1xuICBjb25zdCBmb3JtQXRrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0tYXRrLWNvb3JkcycpO1xuICBjb25zdCBkaXZJbnNlcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWluc2VydCcpO1xuICBjb25zdCBnYW1lTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW1lc3NhZ2UnKTtcblxuICBmb3JtUmVzZXQuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICBmb3JtQXRrLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgZm9ybUluc2VydC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG5cbiAgZGl2SW5zZXJ0LnNldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJywgJ2NydWlzZXInKTtcbiAgZ2FtZU1lc3NhZ2UuaW5uZXJIVE1MID0gYCR7Z2FtZS5fcGxheWVyc1tnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKV0ubmFtZX0ncyBUdXJuYDtcbiAgZGl2SW5zZXJ0LmlubmVySFRNTCA9IGAke2dhbWUuX3BsYXllcnNbZ2FtZS5nZXRDdXJyZW50UGxheWVyKCldLm5hbWV9LCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBjcnVpc2VyIChMZW5ndGg6IDMgcGxhY2VzKTpgO1xufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==