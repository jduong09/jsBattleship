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
    swapTurns
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
  const winner = game._players[game.getCurrentPlayer()];
  displayGameBoard(1, game._players[1].board._board);
  displayGameBoard(2, game._players[2].board._board);

  gameMessage.innerHTML = `${winner.name} wins!`;
  // unhide play again button? 
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixrQ0FBa0M7QUFDL0Qsd0JBQXdCLGtDQUFrQztBQUMxRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2QkFBNkIsa0NBQWtDO0FBQy9EO0FBQ0Esd0JBQXdCLFlBQVk7QUFDcEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2QkFBNkIsYUFBYTtBQUMxQztBQUNBLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC8uL3NyYy9qcy9zaGlwLmpzIiwid2VicGFjazovL2pzYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2FtZWJvYXJkRm5zID0gcmVxdWlyZSgnLi9nYW1lYm9hcmQuanMnKTtcbmNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAuanMnKTtcblxuLy8gRm9yIEdhbWUgdG8gUnVuLlxuLy8gSGFzIHBsYXllcnNfb2JqZWN0IHdoaWNoIGhvbGRzIHR3byBwbGF5ZXIgb2JqZWN0cywgZm9yIHRoZSBnYW1lXG4vLyBIYXMgY3VycmVudFR1cm4gd2hpY2gga2VlcHMgdHJhY2sgb2Ygd2hvc2UgdHVybiBpdCBpcy5cblxuLy8gSFRNTCBoYXMgaW5wdXQgZm9yIGNob29zaW5nIGNvb3JkaW5hdGVzIHRvIHN0cmlrZSBvbiBib2FyZC5cbi8vIE9uY2UgdXNlciBoYXMgaW5wdXR0ZWQgdmFsaWQgY29vcmRpbmF0ZXMsIHJ1biB0dXJuIGZ1bmN0aW9uLlxuLy8gZnVuY3Rpb24gJ3R1cm4nIHdoaWNoIHdpbGwgcnVuIHRocm91Z2ggYSB0dXJuLlxuICAvLyBDb29yZGluYXRlcyB3aWxsIGJlIHNldCB0byBnYW1lYm9hcmQsIHRvIGNoZWNrIGlmIHRoZXJlIGlzIGEgaGl0IG9uIHRoZSBvcHBvbmVudHMgYm9hcmQuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBoaXQsIHdlIHdhbnQgdG8gc2lnbmlmeSB0aGVyZSBpcyBhIGhpdFxuICAgICAgLy8gV2Ugd2FudCB0byBjaGVjayBpZiBhIHNoaXAgaGFzIGZhbGxlblxuICAgICAgLy8gV2Ugd2FudCB0byBjaGVjayBpZiBhbGwgc2hpcHMgaGF2ZSBmYWxsZW5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIG1pc3MsIHdlIHdhbnQgdG8gc2lnbmlmeSB0aGF0IGl0IGlzIGEgbWlzc1xuICAgICAgLy8gV2Ugd2FudCB0byBhZGQgdG8gdGhlIG1pc3MgYXJyYXlcbiAgICAvLyBDaGFuZ2UgdGhlIGN1cnJlbnRUdXJuIHRvIHRoZSBvcHBvbmVudHMgdHVyblxuICAgIC8vIFVwZGF0ZSB0aGUgSFRNTCBEb20gdG8gc2lnbmlmeSB0aGF0IGl0IGlzIHRoZSBvcHBvbmVudHMgdHVyblxuY29uc3QgR2FtZSA9ICgpID0+IHtcbiAgY29uc3QgX3BsYXllcnMgPSB7fTtcbiAgbGV0IF9jdXJyZW50VHVybiA9IDE7XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGxheWVyKHBsYXllck5hbWUpIHtcbiAgICBjb25zdCBwbGF5ZXJOdW1iZXIgPSBfcGxheWVyc1sxXSA/IDIgOiAxO1xuXG4gICAgX3BsYXllcnNbcGxheWVyTnVtYmVyXSA9IHtcbiAgICAgIG5hbWU6IHBsYXllck5hbWUsXG4gICAgICBib2FyZDogZ2FtZWJvYXJkRm5zLkdhbWVib2FyZCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIF9wbGF5ZXJzW3BsYXllck51bWJlcl07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDdXJyZW50UGxheWVyKCkge1xuICAgIHJldHVybiBfY3VycmVudFR1cm47XG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZGF0ZUNvb3JkaW5hdGUoY29vcmQpIHtcbiAgICAvLyBWYWxpZGF0ZUNvb3JkaW5hdGUgd2lsbCBjaGVjayB0byBtYWtlIHN1cmUgdGhlIGNvb3JkaW5hdGVzIGFyZSBpbiB0aGUgcmFuZ2UgMCBhbmQgOS5cbiAgICBpZiAoY29vcmRbMF0gPCAwIHx8IGNvb3JkWzBdID4gOSB8fCBjb29yZFsxXSA8IDAgfHwgY29vcmRbMV0gPiA5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBjdXJyZW50UGxheWVycyBib2FyZCBkb2VzIG5vdCBoYXZlIHRoYXQgYXMgYSBNaXNzZWQgY29vcmRpbmF0ZSBvciBoaXQgY29vcmRpbmF0ZS5cbiAgICBjb25zdCBvcHBvbmVudEdhbWVib2FyZCA9IF9jdXJyZW50VHVybiA9PT0gMSA/IF9wbGF5ZXJzWzJdLmJvYXJkIDogX3BsYXllcnNbMV0uYm9hcmQ7XG4gICAgLy8gSWYgb3Bwb25lbnQgYm9hcmQgaGFzIGR1cGxpY2F0ZXMsIHJldHVybiBmYWxzZS5cbiAgICBpZiAob3Bwb25lbnRHYW1lYm9hcmQuY2hlY2tGb3JEdXBsaWNhdGVzKGNvb3JkKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrSW5zZXJ0UGFyYW1ldGVycyhzaGlwTGVuZ3RoLCBzdGFydCwgZW5kKSB7XG4gICAgbGV0IGR4O1xuICAgIGxldCBkeTtcbiAgICBpZiAoTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICE9PSAwKSB7XG4gICAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSArIDE7XG4gICAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKVxuICAgIH0gZWxzZSB7XG4gICAgICBkeCA9IE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKVxuICAgICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSkgKyAxO1xuICAgIH1cbiAgXG4gICAgLy8gSWYgZHggYW5kIGR5IGFyZW4ndCB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBpbmNvcnJlY3QuXG4gICAgLy8gVGhpcyBpcyBqdXN0IGZvciBtYW51YWxseSBpbnB1dHRpbmcgY29vcmRpbmF0ZXMgYW5kIG5vdCBmb3IgZnV0dXJlLlxuICAgIGlmIChkeCAhPT0gc2hpcExlbmd0aCAmJiBkeSAhPT0gc2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIElmIHRoZSBob3Jpem9udGFsIGlzIGNvcnJlY3QsIHRoZW4gZHkgbXVzdCBiZSAwIGJlY2F1c2UgdGhlcmUgaXMgbm8gZGlhZ29uYWwgc2hpcCBwbGFjZW1lbnRcbiAgICB9IGVsc2UgaWYgKGR4ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gKGR5ID09PSAwKSA/IHRydWUgOiBmYWxzZTtcbiAgICAvLyBJZiB0aGUgdmVydGljYWwgZGlmZmVyZW5jZSBpcyB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGhvcml6b250YWwgZGlmZmVyZW5jZSBzaG91bGQgYmUgMC5cbiAgICB9IGVsc2UgaWYgKGR5ID09PSBzaGlwTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gKGR4ID09PSAwKSA/IHRydWUgOiBmYWxzZTsgXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdHVybihjb29yZCkge1xuICAgIC8vIEdpdmVuIGEgY29vcmRpbmF0ZSwgd2UgY2hlY2sgdG8gc2VlIGlmIHRoZSBvcHBvbmVudCBnYW1lYm9hcmQgd2lsbCBnZXQgaGl0IG9yIGEgbWlzcy5cbiAgICBjb25zdCBvcHBvbmVudEdhbWVib2FyZCA9IF9jdXJyZW50VHVybiA9PT0gMSA/IF9wbGF5ZXJzWzJdLmJvYXJkIDogX3BsYXllcnNbMV0uYm9hcmQ7XG4gICAgY29uc3QgYXRrID0gb3Bwb25lbnRHYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZCk7XG4gICAgLy8gaWYgYXRrIGlzIHR5cGUgb2JqZWN0LCB0aGVuIHRoZSBnYW1lYm9hcmQgcmV0dXJuZWQgYSBtaXNzLlxuICAgIC8vIHVwZGF0ZSBnYW1lIG1lc3NhZ2UgdG8gc3RhdGUgdGhhdCBpdCB3YXMgYSBtaXNzLlxuICAgIGlmIChvcHBvbmVudEdhbWVib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICByZXR1cm4gJ0dhbWUgT3ZlciEnO1xuICAgIH1cbiAgICByZXR1cm4gYXRrO1xuICB9XG5cbiAgZnVuY3Rpb24gc3dhcFR1cm5zKCkge1xuICAgIF9jdXJyZW50VHVybiA9IF9jdXJyZW50VHVybiA9PT0gMSA/IDIgOiAxO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBfcGxheWVycyxcbiAgICBjcmVhdGVQbGF5ZXIsXG4gICAgZ2V0Q3VycmVudFBsYXllcixcbiAgICB2YWxpZGF0ZUNvb3JkaW5hdGUsXG4gICAgY2hlY2tJbnNlcnRQYXJhbWV0ZXJzLFxuICAgIHR1cm4sXG4gICAgc3dhcFR1cm5zXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTsiLCJjb25zdCBHYW1lYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IF9ib2FyZCA9IEFycmF5LmZyb20oe2xlbmd0aDogMTB9LCAoKSA9PiBBcnJheSgxMCkuZmlsbCgnJykpO1xuICBjb25zdCBfc2hpcHMgPSB7fTtcbiAgY29uc3QgX21pc3NlZEF0dGFja3MgPSBbXTtcblxuICAvLyB2YWxpZGF0ZUluc2VydCBmdW5jdGlvblxuICAvLyBHaXZlbiBhIHN0YXJ0IGFuZCBlbmQgcGFyYW1ldGVyXG4gIC8vIEdvaW5nIGZyb20gdGhlIHN0YXJ0IHRvIHRoZSBlbmQgbWFya2VyXG4gIGZ1bmN0aW9uIHZhbGlkYXRlSW5zZXJ0KHN0YXJ0LCBlbmQpIHtcbiAgICBjb25zdCBkeCA9IHN0YXJ0WzBdIC0gZW5kWzBdO1xuICAgIGNvbnN0IGR5ID0gc3RhcnRbMV0gLSBlbmRbMV07XG4gICAgbGV0IG1hcmtlciA9IHN0YXJ0O1xuICAgIGlmIChkeCkge1xuICAgICAgd2hpbGUgKG1hcmtlclswXSAhPT0gZW5kWzBdKSB7XG4gICAgICAgIGlmIChfYm9hcmRbbWFya2VyWzFdXVttYXJrZXJbMF1dICE9PSAnJykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHggPCAwKSB7XG4gICAgICAgICAgbWFya2VyID0gW21hcmtlclswXSArIDEsIHN0YXJ0WzFdXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXJrZXIgPSBbbWFya2VyWzBdIC0gMSwgc3RhcnRbMV1dO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlIChtYXJrZXJbMV0gIT09IGVuZFsxXSkge1xuICAgICAgICBpZiAoX2JvYXJkW21hcmtlclsxXV1bbWFya2VyWzBdXSAhPT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR5IDwgMCkge1xuICAgICAgICAgIG1hcmtlciA9IFtzdGFydFswXSwgbWFya2VyWzFdICsgMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFya2VyID0gW3N0YXJ0WzBdLCBtYXJrZXJbMV0gLSAxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydChzaGlwT2JqLCBzdGFydCwgZW5kKSB7XG4gICAgbGV0IHNoaXBMZW5ndGggPSBzaGlwT2JqLnNoaXBMZW5ndGg7XG4gICAgX3NoaXBzW3NoaXBPYmoubmFtZV0gPSBzaGlwT2JqO1xuICAgIGxldCBkeCA9IHN0YXJ0WzBdIC0gZW5kWzBdO1xuICAgIGxldCBkeSA9IHN0YXJ0WzFdIC0gZW5kWzFdO1xuICAgIGlmIChkeCkge1xuICAgICAgZHggPSBNYXRoLmFicyhkeCkgKyAxO1xuICAgICAgbGV0IHhNYXJrZXIgPSBzdGFydFswXTtcbiAgICAgIHdoaWxlIChkeCkge1xuICAgICAgICBpZiAoc3RhcnRbMF0gPiBlbmRbMF0pIHtcbiAgICAgICAgICBfYm9hcmRbc3RhcnRbMV1dW3hNYXJrZXJdID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgIHhNYXJrZXIgLT0gMTtcbiAgICAgICAgICBkeCAtPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9ib2FyZFtzdGFydFsxXV1beE1hcmtlcl0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgeE1hcmtlciArPSAxXG4gICAgICAgICAgZHggLT0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkeSA9IE1hdGguYWJzKGR5KSArIDE7XG4gICAgICBsZXQgeU1hcmtlciA9IHN0YXJ0WzFdO1xuICAgICAgd2hpbGUgKGR5KSB7XG4gICAgICAgIGlmIChzdGFydFsxXSA+IGVuZFsxXSkge1xuICAgICAgICAgIF9ib2FyZFt5TWFya2VyXVtzdGFydFswXV0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgeU1hcmtlciAtPSAxO1xuICAgICAgICAgIGR5IC09IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2JvYXJkW3lNYXJrZXJdW3N0YXJ0WzBdXSA9IHNoaXBPYmoubmFtZTtcbiAgICAgICAgICB5TWFya2VyICs9IDE7XG4gICAgICAgICAgZHkgLT0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX2JvYXJkO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhjb29yZCkge1xuICAgIGNvbnN0IGJvYXJkbG9jYXRpb24gPSBfYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXTtcbiAgICBpZiAoYm9hcmRsb2NhdGlvbiAhPT0gJycpIHtcbiAgICAgIGNvbnN0IHNoaXAgPSBfc2hpcHNbYm9hcmRsb2NhdGlvbl07XG4gICAgICBzaGlwLmhpdCgpO1xuICAgICAgXG4gICAgICBfYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXSA9ICdIJztcblxuICAgICAgaWYgKHNoaXAuaXNTdW5rKCkpIHtcbiAgICAgICAgcmV0dXJuIGAke3NoaXAubmFtZX0gc3VuayFgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGAke3NoaXAubmFtZX0gaGl0IWA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIF9taXNzZWRBdHRhY2tzLnB1c2goY29vcmQpO1xuICAgICAgX2JvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0gPSAnTSc7XG4gICAgICByZXR1cm4gY29vcmQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tGb3JEdXBsaWNhdGVzKGNvb3JkKSB7XG4gICAgY29uc3QgZHVwZXMgPSBfbWlzc2VkQXR0YWNrcy5maWx0ZXIoKGVsZSkgPT4ge1xuICAgICAgcmV0dXJuIGVsZVswXSA9PT0gY29vcmRbMF0gJiYgZWxlWzFdID09PSBjb29yZFsxXTtcbiAgICB9KTtcbiAgICByZXR1cm4gZHVwZXMubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgZm9yIChjb25zdCBzaGlwTmFtZSBpbiBfc2hpcHMpIHtcbiAgICAgIGNvbnN0IHNoaXAgPSBfc2hpcHNbc2hpcE5hbWVdO1xuICAgICAgaWYgKCFzaGlwLmlzU3VuaygpKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBfYm9hcmQsXG4gICAgX3NoaXBzLFxuICAgIF9taXNzZWRBdHRhY2tzLFxuICAgIHZhbGlkYXRlSW5zZXJ0LFxuICAgIGluc2VydCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIGNoZWNrRm9yRHVwbGljYXRlcyxcbiAgICBnYW1lT3ZlclxuICB9XG59XG5cbi8qXG5jb25zdCBjaGVja0luc2VydFBhcmFtZXRlcnMgPShzaGlwTGVuZ3RoLCBzdGFydCwgZW5kKSA9PiB7XG4gIGxldCBkeDtcbiAgbGV0IGR5O1xuICBpZiAoTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICE9PSAwKSB7XG4gICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgKyAxO1xuICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pXG4gIH0gZWxzZSB7XG4gICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSlcbiAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKSArIDE7XG4gIH1cblxuICAvLyBJZiBkeCBhbmQgZHkgYXJlbid0IHRoZSBzaGlwIGxlbmd0aCwgdGhlbiB0aGUgY29vcmRpbmF0ZXMgZ2l2ZW4gYXJlIGluY29ycmVjdC5cbiAgLy8gVGhpcyBpcyBqdXN0IGZvciBtYW51YWxseSBpbnB1dHRpbmcgY29vcmRpbmF0ZXMgYW5kIG5vdCBmb3IgZnV0dXJlLlxuICBpZiAoZHggIT09IHNoaXBMZW5ndGggJiYgZHkgIT09IHNoaXBMZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIElmIHRoZSBob3Jpem9udGFsIGlzIGNvcnJlY3QsIHRoZW4gZHkgbXVzdCBiZSAwIGJlY2F1c2UgdGhlcmUgaXMgbm8gZGlhZ29uYWwgc2hpcCBwbGFjZW1lbnRcbiAgfSBlbHNlIGlmIChkeCA9PT0gc2hpcExlbmd0aCkge1xuICAgIHJldHVybiAoZHkgPT09IDApID8gdHJ1ZSA6IGZhbHNlO1xuICAvLyBJZiB0aGUgdmVydGljYWwgZGlmZmVyZW5jZSBpcyB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGhvcml6b250YWwgZGlmZmVyZW5jZSBzaG91bGQgYmUgMC5cbiAgfSBlbHNlIGlmIChkeSA9PT0gc2hpcExlbmd0aCkge1xuICAgIHJldHVybiAoZHggPT09IDApID8gdHJ1ZSA6IGZhbHNlOyBcbiAgfVxufVxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEdhbWVib2FyZFxufTsiLCIvKlxuUkVNRU1CRVIgeW91IG9ubHkgaGF2ZSB0byB0ZXN0IHlvdXIgb2JqZWN04oCZcyBwdWJsaWMgaW50ZXJmYWNlLlxuT25seSBtZXRob2RzIG9yIHByb3BlcnRpZXMgdGhhdCBhcmUgdXNlZCBvdXRzaWRlIG9mIHlvdXIg4oCYc2hpcOKAmSBvYmplY3QgbmVlZCB1bml0IHRlc3RzLlxuKi9cblxuLy8gU2hpcHMgc2hvdWxkIGhhdmUgYSBoaXQoKSBmdW5jdGlvbiB0aGF0IGluY3JlYXNlcyB0aGUgbnVtYmVyIG9mIOKAmGhpdHPigJkgaW4geW91ciBzaGlwLlxuXG4vLyBpc1N1bmsoKSBzaG91bGQgYmUgYSBmdW5jdGlvbiB0aGF0IGNhbGN1bGF0ZXMgaXQgYmFzZWQgb24gdGhlaXIgbGVuZ3RoIFxuLy8gYW5kIHRoZSBudW1iZXIgb2Yg4oCYaGl0c+KAmS5cbmNvbnN0IFNoaXAgPSAobmFtZSwgaGl0cG9pbnRzKSA9PiB7XG4gIGxldCBfaGl0cG9pbnRzID0gaGl0cG9pbnRzO1xuICBjb25zdCBzaGlwTGVuZ3RoID0gaGl0cG9pbnRzO1xuICBsZXQgX3N1bmsgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBoaXQoKSB7XG4gICAgX2hpdHBvaW50cyAtPSAxO1xuXG4gICAgaWYgKCFfaGl0cG9pbnRzKSB7XG4gICAgICBfc3VuayA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9oaXRwb2ludHM7XG4gIH1cblxuICBmdW5jdGlvbiBpc1N1bmsoKSB7XG4gICAgcmV0dXJuIF9zdW5rO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIHNoaXBMZW5ndGgsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGlwOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJjb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJyk7XG5jb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGdhbWUgPSBHYW1lKCk7XG4gIGdhbWUuY3JlYXRlUGxheWVyKCdKdXN0aW4nKTtcbiAgZ2FtZS5jcmVhdGVQbGF5ZXIoJ0plZmYnKTtcbiAgc2V0UGxheWVyQm9hcmROYW1lcyhnYW1lKTtcbiAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgZGlzcGxheUdhbWVCb2FyZCgyLCBnYW1lLl9wbGF5ZXJzWycyJ10uYm9hcmQuX2JvYXJkKTtcblxuICBzdGFydFByZXBQaGFzZShnYW1lKTtcbiAgc3RhcnRCYXR0bGVQaGFzZShnYW1lKTtcbn0pO1xuXG5jb25zdCBzZXRQbGF5ZXJCb2FyZE5hbWVzID0gKGdhbWUpID0+IHtcbiAgY29uc3QgYm9hcmRPbmVIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIxXCJdID4gaDNgKTtcbiAgY29uc3QgYm9hcmRUd29IZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIyXCJdID4gaDNgKTtcblxuICBib2FyZE9uZUhlYWRlci5pbm5lckhUTUwgPSBgJHtnYW1lLl9wbGF5ZXJzWzFdLm5hbWV9J3MgQm9hcmRgO1xuICBib2FyZFR3b0hlYWRlci5pbm5lckhUTUwgPSBgJHtnYW1lLl9wbGF5ZXJzWzJdLm5hbWV9J3MgQm9hcmRgO1xufVxuXG5jb25zdCBzdGFydFByZXBQaGFzZSA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGlucHV0SW5zZXJ0Q29vcmRpbmF0ZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zZXJ0LWNvb3JkaW5hdGVzJyk7XG4gIGNvbnN0IHNwYW5JbnNlcnRFcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFuLWluc2VydC1lcnJvcicpO1xuXG4gIHNldFByZXBIZWFkZXIoZ2FtZSk7XG4gIHNldElucHV0TGlzdGVuZXIoaW5wdXRJbnNlcnRDb29yZGluYXRlcywgc3Bhbkluc2VydEVycm9yKTtcbiAgc2V0UHJlcFN1Ym1pdEJ0bkxpc3RlbmVyKGdhbWUpO1xufVxuXG5jb25zdCBzZXRQcmVwSGVhZGVyID0gKGdhbWUpID0+IHtcbiAgY29uc3QgZ2FtZU1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1tZXNzYWdlJyk7XG4gIGNvbnN0IHBsYXllck9uZSA9IGdhbWUuX3BsYXllcnNbMV07XG4gIGNvbnN0IGRpdkluc2VydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtaW5zZXJ0Jyk7XG4gIFxuICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSBgJHtwbGF5ZXJPbmUubmFtZX0ncyBUdXJuYDtcbiAgZGl2SW5zZXJ0LmlubmVySFRNTCA9IGAke3BsYXllck9uZS5uYW1lfSwgY2hvb3NlIHdoZXJlIHRvIHBsYWNlIHlvdXIgY3J1aXNlciAoTGVuZ3RoOiAzIFBsYWNlcyk6YDtcbn1cblxuY29uc3Qgc2V0UHJlcFN1Ym1pdEJ0bkxpc3RlbmVyID0gKGdhbWUpID0+IHtcbiAgY29uc3QgZ2FtZVBoYXNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtcGhhc2UnKTtcbiAgY29uc3QgZ2FtZU1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1tZXNzYWdlJyk7XG4gIGNvbnN0IGZvcm1JbnNlcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1pbnNlcnQtc2hpcHMnKTtcbiAgY29uc3QgZm9ybUJhdHRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtLWF0ay1jb29yZHMnKTtcbiAgY29uc3QgZGl2SW5zZXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1pbnNlcnQnKTtcbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zZXJ0LWNvb3JkaW5hdGVzJyk7XG4gIGNvbnN0IHNwYW5FcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFuLWluc2VydC1lcnJvcicpO1xuICBjb25zdCBzdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zZXJ0LXN1Ym1pdCcpO1xuXG4gIGxldCBjdXJyZW50UGxheWVyID0gZ2FtZS5fcGxheWVyc1sxXTtcbiAgc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgY3VycmVudFNoaXAgPSBkaXZJbnNlcnQuZ2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnKTtcbiAgICBjb25zdCBjb29yZGluYXRlc0FycmF5ID0gaW5wdXQudmFsdWUuc3BsaXQoJyAnKTtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IFt0cmFuc2Zvcm1JbnB1dFRvQ29vcmQoY29vcmRpbmF0ZXNBcnJheVswXSksIHRyYW5zZm9ybUlucHV0VG9Db29yZChjb29yZGluYXRlc0FycmF5WzFdKV07XG4gICAgXG4gICAgaWYgKGN1cnJlbnRTaGlwID09PSAnY3J1aXNlcicpIHtcbiAgICAgIC8vIFRoZSB0d28gY29vcmRpbmF0ZXMgbWF0Y2ggdGhlIGxlbmd0aCBvZiB0aGUgc2hpcFxuICAgICAgaWYgKGdhbWUuY2hlY2tJbnNlcnRQYXJhbWV0ZXJzKDMsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgLy8gQ2hlY2sgdGhhdCB0d28gY29vcmRpbmF0ZXMgZG9uJ3QgaW50ZXJmZXJlIHdpdGggb3RoZXIgc2hpcHMgb24gdGhlIHBsYXllcnMgYm9hcmQuXG4gICAgICAgIGlmIChjdXJyZW50UGxheWVyLmJvYXJkLnZhbGlkYXRlSW5zZXJ0KGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgICBjb25zdCBzaGlwID0gU2hpcCgnQ3J1aXNlcicsIDMpO1xuICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuYm9hcmQuaW5zZXJ0KHNoaXAsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSk7XG4gICAgICAgICAgZGl2SW5zZXJ0LnNldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJywgJ2JhdHRsZXNoaXAnKTtcbiAgICAgICAgICBkaXZJbnNlcnQuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSwgY2hvb3NlIHdoZXJlIHRvIHBsYWNlIHlvdXIgYmF0dGxlc2hpcCAoTGVuZ3RoOiA1IHBsYWNlcyk6YDtcbiAgICAgICAgICBpbnB1dC52YWx1ZSA9IG51bGw7XG5cbiAgICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PT0gZ2FtZS5fcGxheWVyc1sxXSkge1xuICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgyLCBnYW1lLl9wbGF5ZXJzWycyJ10uYm9hcmQuX2JvYXJkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogRGlmZmVyZW50IFNoaXAgcGxhY2VkIGF0IGNvb3JkaW5hdGVzLiBVc2UgZGlmZmVyZW50IGNvb3JkaW5hdGVzLic7XG4gICAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogQ29vcmRpbmF0ZXMgcmFuZ2UgZG9lcyBub3QgbWF0Y2ggc2hpcCBsZW5ndGguJztcbiAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGN1cnJlbnRTaGlwID09PSAnYmF0dGxlc2hpcCcpIHtcbiAgICAgIGlmIChnYW1lLmNoZWNrSW5zZXJ0UGFyYW1ldGVycyg1LCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgIGlmIChjdXJyZW50UGxheWVyLmJvYXJkLnZhbGlkYXRlSW5zZXJ0KGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgICBjb25zdCBzaGlwID0gU2hpcCgnQmF0dGxlc2hpcCcsIDUpO1xuICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuYm9hcmQuaW5zZXJ0KHNoaXAsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSk7XG4gICAgICAgICAgZGl2SW5zZXJ0LnNldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJywgJ2Rlc3Ryb3llcicpO1xuICAgICAgICAgIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtjdXJyZW50UGxheWVyLm5hbWV9LCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBkZXN0b3llciAoTGVuZ3RoOiAyIHBsYWNlcyk6YDtcbiAgICAgICAgICBpbnB1dC52YWx1ZSA9IG51bGw7XG5cbiAgICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PT0gZ2FtZS5fcGxheWVyc1sxXSkge1xuICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWycxJ10uYm9hcmQuX2JvYXJkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCgyLCBnYW1lLl9wbGF5ZXJzWycyJ10uYm9hcmQuX2JvYXJkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogRGlmZmVyZW50IFNoaXAgcGxhY2VkIGF0IGNvb3JkaW5hdGVzLiBVc2UgZGlmZmVyZW50IGNvb3JkaW5hdGVzLic7XG4gICAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdFcnJvcjogQ29vcmRpbmF0ZXMgcmFuZ2UgZG9lcyBub3QgbWF0Y2ggc2hpcCBsZW5ndGguJztcbiAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGN1cnJlbnRTaGlwID09PSAnZGVzdHJveWVyJykge1xuICAgICAgaWYgKGdhbWUuY2hlY2tJbnNlcnRQYXJhbWV0ZXJzKDIsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIuYm9hcmQudmFsaWRhdGVJbnNlcnQoY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICAgIGNvbnN0IHNoaXAgPSBTaGlwKCdEZXN0cm95ZXInLCAyKTtcbiAgICAgICAgICBjdXJyZW50UGxheWVyLmJvYXJkLmluc2VydChzaGlwLCBjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmIChjdXJyZW50UGxheWVyID09PSBnYW1lLl9wbGF5ZXJzWzFdKSB7XG4gICAgICAgICAgICBkaXNwbGF5R2FtZUJvYXJkKDEsIGdhbWUuX3BsYXllcnNbJzEnXS5ib2FyZC5fYm9hcmQpO1xuICAgICAgICAgICAgIC8vIEFmdGVyIDUgc2Vjb25kc1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIC8vIEhpZGUgUGxheWVyIDEgYm9hcmRcbiAgICAgICAgICAgICAgaGlkZUdhbWVCb2FyZCgxKTtcbiAgICAgICAgICAgICAgLy8gQ2hhbmdlZCBjdXJyZW50UGxheWVyIHZhcmlhYmxlIHRvIFBsYXllciAyXG4gICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIgPSBnYW1lLl9wbGF5ZXJzWzJdO1xuICAgICAgICAgICAgICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSBgJHtjdXJyZW50UGxheWVyLm5hbWV9J3MgVHVybmA7XG4gICAgICAgICAgICAgIC8vIFNldCBkaXYgSW5zZXJ0IHRvIGNydWlzZXJcbiAgICAgICAgICAgICAgZGl2SW5zZXJ0LnNldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJywgJ2NydWlzZXInKTtcbiAgICAgICAgICAgICAgZGl2SW5zZXJ0LmlubmVySFRNTCA9IGAke2N1cnJlbnRQbGF5ZXIubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGNydWlzZXIgKExlbmd0aDogMyBwbGFjZXMpOmA7XG4gICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIH0sIDIwMDApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXNwbGF5R2FtZUJvYXJkKDIsIGdhbWUuX3BsYXllcnNbJzInXS5ib2FyZC5fYm9hcmQpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgaGlkZUdhbWVCb2FyZCgyKTtcbiAgICAgICAgICAgICAgZ2FtZVBoYXNlLmlubmVySFRNTCA9ICdCYXR0bGUgUGhhc2UnO1xuICAgICAgICAgICAgICBmb3JtSW5zZXJ0LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgZm9ybUJhdHRsZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgICAgICAgIHNldEJhdHRsZUhlYWRlcihnYW1lKTtcbiAgICAgICAgICAgIH0sIDIwMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFuRXJyb3IuaW5uZXJIVE1MID0gJ0Vycm9yOiBEaWZmZXJlbnQgU2hpcCBwbGFjZWQgYXQgY29vcmRpbmF0ZXMuIFVzZSBkaWZmZXJlbnQgY29vcmRpbmF0ZXMuJztcbiAgICAgICAgICBzcGFuRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFuRXJyb3IuaW5uZXJIVE1MID0gJ0Vycm9yOiBDb29yZGluYXRlcyByYW5nZSBkb2VzIG5vdCBtYXRjaCBzaGlwIGxlbmd0aC4nO1xuICAgICAgICBzcGFuRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmNvbnN0IHN0YXJ0QmF0dGxlUGhhc2UgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBnYW1lTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW1lc3NhZ2UnKTtcbiAgY29uc3QgaW5wdXRDb29yZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29yZCcpO1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1jb29yZC1lcnJvcicpO1xuICBjb25zdCBjdXJyZW50UGxheWVyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XG4gIFxuICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSBgJHtnYW1lLl9wbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLm5hbWV9J3MgVHVybmA7XG4gIFxuICBzZXRJbnB1dExpc3RlbmVyKGlucHV0Q29vcmQsIHNwYW5FcnJvcik7XG4gIHNldEJhdHRsZVN1Ym1pdEJ0bkxpc3RlbmVyKGdhbWUpO1xufVxuXG5jb25zdCBzZXRCYXR0bGVTdWJtaXRCdG5MaXN0ZW5lciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGlucHV0Q29vcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29vcmQnKTtcbiAgY29uc3QgaW5wdXRTdWJtaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXRrLXN1Ym1pdCcpO1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1jb29yZC1lcnJvcicpO1xuXG4gIGlucHV0U3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaW5wdXRDb29yZC5kaXNhYmxlZCA9IHRydWU7XG4gICAgY29uc3QgY29vcmRpbmF0ZSA9IHRyYW5zZm9ybUlucHV0VG9Db29yZChpbnB1dENvb3JkLnZhbHVlKTtcbiAgICAvLyBHaXZlbiBhbiBpbnB1dCwgd2UgbmVlZCB0byB2YWxpZGF0ZSB0aGF0IGl0IGlzIGEgdmFsaWQgY29vcmRpbmF0ZS5cbiAgICBpZiAoZ2FtZS52YWxpZGF0ZUNvb3JkaW5hdGUoY29vcmRpbmF0ZSkpIHtcbiAgICAgIGlmICghc3BhbkVycm9yLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpKSB7XG4gICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICB9XG4gICAgICBjb25zdCB0dXJuID0gZ2FtZS50dXJuKGNvb3JkaW5hdGUpO1xuICAgICAgaWYgKHR1cm4gPT09ICdHYW1lIE92ZXIhJykge1xuICAgICAgICBkaXNwbGF5R2FtZU92ZXIoZ2FtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwbGF5VHVyblJlc3VsdCh0dXJuLCBnYW1lKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgLy8gQ2hhbmdlIGdhbWUgcGhhc2UgY3VycmVudCB0dXJuLlxuICAgICAgICAgIGdhbWUuc3dhcFR1cm5zKCk7XG4gICAgICAgICAgaW5wdXRDb29yZC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgIHVwZGF0ZVR1cm5QaGFzZShnYW1lKTtcbiAgICAgICAgfSwgMzAwMCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BsYXlBdGtFcnJvck1lc3NhZ2UoY29vcmRpbmF0ZSk7XG4gICAgICBpbnB1dENvb3JkLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3Qgc2V0SW5wdXRMaXN0ZW5lciA9IChpbnB1dCwgc3BhbikgPT4ge1xuICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcbiAgICBpZiAoIWlucHV0LnZhbGlkaXR5LnZhbGlkKSB7XG4gICAgICBkaXNwbGF5SW5wdXRFcnJvcihpbnB1dCk7XG4gICAgICBzcGFuLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFzcGFuLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpKSB7XG4gICAgICAgIHNwYW4uY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmNvbnN0IGRpc3BsYXlJbnB1dEVycm9yID0gKGlucHV0KSA9PiB7XG4gIGNvbnN0IHBhcmVudEVsZW1lbnQgPSBpbnB1dC5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBzcGFuRXJyb3JFbGVtZW50ID0gcGFyZW50RWxlbWVudC5jaGlsZHJlblszXTtcbiAgaWYgKGlucHV0LnZhbGlkaXR5LnZhbHVlTWlzc2luZykge1xuICAgIHNwYW5FcnJvckVsZW1lbnQuaW5uZXJIVE1MID0gJ0Vycm9yOiBJbnB1dCBpcyByZXF1aXJlZC4nO1xuICAgIHNwYW5FcnJvckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gIH0gZWxzZSBpZiAoaW5wdXQudmFsaWRpdHkudG9vTG9uZykge1xuICAgIHNwYW5FcnJvckVsZW1lbnQuaW5uZXJIVE1MID0gJ0Vycm9yOiBJbnB1dCBpcyB0b28gbG9uZy4nO1xuICAgIHNwYW5FcnJvckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gIH0gZWxzZSBpZiAoaW5wdXQudmFsaWRpdHkucGF0dGVybk1pc21hdGNoKSB7XG4gICAgc3BhbkVycm9yRWxlbWVudC5pbm5lckhUTUwgPSAoaW5wdXQuaWQgPT09ICdpbnNlcnQtY29vcmRpbmF0ZXMnKVxuICAgICAgPyAnRXJyb3I6IElucHV0IGRvZXMgbm90IG1hdGNoIHBhdHRlcm4uIGV4OiBcIkE0IEE2XCIuJ1xuICAgICAgOiAnRXJyb3I6IElucHV0IGRvZXMgbm90IG1hdGNoIHBhdHRlcm4uIGV4OiBcIkE1XCIuJztcbiAgfSBlbHNlIHtcbiAgICBzcGFuRXJyb3JFbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgIHNwYW5FcnJvckVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gIH1cbn1cblxuY29uc3QgdHJhbnNmb3JtSW5wdXRUb0Nvb3JkID0gKGlucHV0VmFsKSA9PiB7XG4gIGNvbnN0IGFscGggPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0snXTtcbiAgXG4gIGNvbnN0IGlkeFN0YXJ0ID0gYWxwaC5maW5kSW5kZXgoKGVsZSkgPT4ge1xuICAgIHJldHVybiBlbGUgPT09IGlucHV0VmFsWzBdO1xuICB9KTtcbiAgcmV0dXJuIFtpZHhTdGFydCwgcGFyc2VJbnQoaW5wdXRWYWwuc2xpY2UoMSkpIC0gMV07XG59XG5cbmNvbnN0IGRpc3BsYXlHYW1lQm9hcmQgPSAocGxheWVyTnVtYmVyLCBwbGF5ZXJCb2FyZCkgPT4ge1xuICBjb25zdCBib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIiR7cGxheWVyTnVtYmVyfVwiXWApO1xuICBjb25zdCByb3dMaXN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl0gPiB1bCA+IGxpYCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGJvYXJkUm93ID0gcGxheWVyQm9hcmRbaV07XG4gICAgY29uc3QgZGlzcGxheUJvYXJkUm93ID0gcm93TGlzdEl0ZW1zW2kgKyAxXTtcbiAgICBjb25zdCBzcGFucyA9IGRpc3BsYXlCb2FyZFJvdy5jaGlsZHJlbjtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmRSb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChib2FyZFJvd1tqXSA9PT0gJycpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2UgaWYgKGJvYXJkUm93W2pdID09PSAnSCcpIHtcbiAgICAgICAgc3BhbnNbaiArIDFdLmlubmVySFRNTCA9ICdIJztcbiAgICAgIH0gZWxzZSBpZiAoYm9hcmRSb3dbal0gPT09ICdNJykge1xuICAgICAgICBzcGFuc1tqICsgMV0uaW5uZXJIVE1MID0gJ1gnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhbnNbaiArIDFdLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgIGlmIChib2FyZFJvd1tqXSA9PT0gJ0NydWlzZXInKSB7XG4gICAgICAgICAgc3BhbnNbaiArIDFdLmFwcGVuZENoaWxkKGNyZWF0ZUdhbWVJY29uKCdjcnVpc2VyJykpO1xuICAgICAgICB9IGVsc2UgaWYgKGJvYXJkUm93W2pdID09PSAnQmF0dGxlc2hpcCcpIHtcbiAgICAgICAgICBzcGFuc1tqICsgMV0uYXBwZW5kQ2hpbGQoY3JlYXRlR2FtZUljb24oJ2JhdHRsZXNoaXAnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhbnNbaiArIDFdLmFwcGVuZENoaWxkKGNyZWF0ZUdhbWVJY29uKCdkZXN0cm95ZXInKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xufVxuXG4vLyBEaXNwbGF5cyBPcHBvbmVudHMgZ2FtZWJvYXJkIHdpdGggaGl0cyBhbmQgbWlzc2VzXG5jb25zdCBkaXNwbGF5T3Bwb25lbnRHYW1lYm9hcmQgPSAocGxheWVyTnVtYmVyLCBwbGF5ZXJCb2FyZCkgPT4ge1xuICBjb25zdCBib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIiR7cGxheWVyTnVtYmVyfVwiXWApO1xuICBjb25zdCByb3dMaXN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl0gPiB1bCA+IGxpYCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGJvYXJkUm93ID0gcGxheWVyQm9hcmRbaV07XG4gICAgY29uc3QgZGlzcGxheUJvYXJkUm93ID0gcm93TGlzdEl0ZW1zW2kgKyAxXTtcbiAgICBjb25zdCBzcGFucyA9IGRpc3BsYXlCb2FyZFJvdy5jaGlsZHJlbjtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmRSb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChib2FyZFJvd1tqXSA9PT0gJ0gnKSB7XG4gICAgICAgIHNwYW5zW2ogKyAxXS5pbm5lckhUTUwgPSAnSCc7XG4gICAgICB9IGVsc2UgaWYgKGJvYXJkUm93W2pdID09PSAnTScpIHtcbiAgICAgICAgc3BhbnNbaiArIDFdLmlubmVySFRNTCA9ICdYJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5zW2ogKyAxXS5pbm5lckhUTUwgPSAnJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYm9hcmQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xufVxuXG4vLyBIaWRlcyBhbnkgZ2FtZSBib2FyZC5cbmNvbnN0IGhpZGVHYW1lQm9hcmQgPSAocGxheWVyTnVtYmVyKSA9PiB7XG4gIGNvbnN0IHJvd0xpc3RJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIiR7cGxheWVyTnVtYmVyfVwiXSA+IHVsID4gbGlgKTtcblxuICBmb3IgKGxldCBpID0gMTsgaSA8IDExOyBpKyspIHtcbiAgICBjb25zdCBkaXNwbGF5Qm9hcmRSb3cgPSByb3dMaXN0SXRlbXNbaV07XG4gICAgY29uc3Qgc3BhbnMgPSBkaXNwbGF5Qm9hcmRSb3cuY2hpbGRyZW47XG5cbiAgICBmb3IgKGxldCBqID0gMTsgaiA8IDExOyBqKyspIHtcbiAgICAgIHNwYW5zW2pdLmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBjcmVhdGVHYW1lSWNvbiA9IChuYW1lKSA9PiB7XG4gIGNvbnN0IG9iaiA9IHtcbiAgICAnY3J1aXNlcic6ICdNMTkyIDMyYzAtMTcuNyAxNC4zLTMyIDMyLTMySDM1MmMxNy43IDAgMzIgMTQuMyAzMiAzMlY2NGg0OGMyNi41IDAgNDggMjEuNSA0OCA0OFYyNDBsNDQuNCAxNC44YzIzLjEgNy43IDI5LjUgMzcuNSAxMS41IDUzLjlsLTEwMSA5Mi42Yy0xNi4yIDkuNC0zNC43IDE1LjEtNTAuOSAxNS4xYy0xOS42IDAtNDAuOC03LjctNTkuMi0yMC4zYy0yMi4xLTE1LjUtNTEuNi0xNS41LTczLjcgMGMtMTcuMSAxMS44LTM4IDIwLjMtNTkuMiAyMC4zYy0xNi4yIDAtMzQuNy01LjctNTAuOS0xNS4xbC0xMDEtOTIuNmMtMTgtMTYuNS0xMS42LTQ2LjIgMTEuNS01My45TDk2IDI0MFYxMTJjMC0yNi41IDIxLjUtNDggNDgtNDhoNDhWMzJ6TTE2MCAyMTguN2wxMDcuOC0zNS45YzEzLjEtNC40IDI3LjMtNC40IDQwLjUgMEw0MTYgMjE4LjdWMTI4SDE2MHY5MC43ek0zMDYuNSA0MjEuOUMzMjkgNDM3LjQgMzU2LjUgNDQ4IDM4NCA0NDhjMjYuOSAwIDU1LjQtMTAuOCA3Ny40LTI2LjFsMCAwYzExLjktOC41IDI4LjEtNy44IDM5LjIgMS43YzE0LjQgMTEuOSAzMi41IDIxIDUwLjYgMjUuMmMxNy4yIDQgMjcuOSAyMS4yIDIzLjkgMzguNHMtMjEuMiAyNy45LTM4LjQgMjMuOWMtMjQuNS01LjctNDQuOS0xNi41LTU4LjItMjVDNDQ5LjUgNTAxLjcgNDE3IDUxMiAzODQgNTEyYy0zMS45IDAtNjAuNi05LjktODAuNC0xOC45Yy01LjgtMi43LTExLjEtNS4zLTE1LjYtNy43Yy00LjUgMi40LTkuNyA1LjEtMTUuNiA3LjdjLTE5LjggOS00OC41IDE4LjktODAuNCAxOC45Yy0zMyAwLTY1LjUtMTAuMy05NC41LTI1LjhjLTEzLjQgOC40LTMzLjcgMTkuMy01OC4yIDI1Yy0xNy4yIDQtMzQuNC02LjctMzguNC0yMy45czYuNy0zNC40IDIzLjktMzguNGMxOC4xLTQuMiAzNi4yLTEzLjMgNTAuNi0yNS4yYzExLjEtOS40IDI3LjMtMTAuMSAzOS4yLTEuN2wwIDBDMTM2LjcgNDM3LjIgMTY1LjEgNDQ4IDE5MiA0NDhjMjcuNSAwIDU1LTEwLjYgNzcuNS0yNi4xYzExLjEtNy45IDI1LjktNy45IDM3IDB6JyxcbiAgICAnYmF0dGxlc2hpcCc6ICdNMjI0IDBIMzUyYzE3LjcgMCAzMiAxNC4zIDMyIDMyaDc1LjFjMjAuNiAwIDMxLjYgMjQuMyAxOC4xIDM5LjhMNDU2IDk2SDEyMEw5OC44IDcxLjhDODUuMyA1Ni4zIDk2LjMgMzIgMTE2LjkgMzJIMTkyYzAtMTcuNyAxNC4zLTMyIDMyLTMyek05NiAxMjhINDgwYzE3LjcgMCAzMiAxNC4zIDMyIDMyVjI4My41YzAgMTMuMy00LjIgMjYuMy0xMS45IDM3LjJsLTUxLjQgNzEuOWMtMS45IDEuMS0zLjcgMi4yLTUuNSAzLjVjLTE1LjUgMTAuNy0zNCAxOC01MSAxOS45SDM3NS42Yy0xNy4xLTEuOC0zNS05LTUwLjgtMTkuOWMtMjIuMS0xNS41LTUxLjYtMTUuNS03My43IDBjLTE0LjggMTAuMi0zMi41IDE4LTUwLjYgMTkuOUgxODMuOWMtMTctMS44LTM1LjYtOS4yLTUxLTE5LjljLTEuOC0xLjMtMy43LTIuNC01LjYtMy41TDc1LjkgMzIwLjdDNjguMiAzMDkuOCA2NCAyOTYuOCA2NCAyODMuNVYxNjBjMC0xNy43IDE0LjMtMzIgMzItMzJ6bTMyIDY0djk2SDQ0OFYxOTJIMTI4ek0zMDYuNSA0MjEuOUMzMjkgNDM3LjQgMzU2LjUgNDQ4IDM4NCA0NDhjMjYuOSAwIDU1LjMtMTAuOCA3Ny40LTI2LjFsMCAwYzExLjktOC41IDI4LjEtNy44IDM5LjIgMS43YzE0LjQgMTEuOSAzMi41IDIxIDUwLjYgMjUuMmMxNy4yIDQgMjcuOSAyMS4yIDIzLjkgMzguNHMtMjEuMiAyNy45LTM4LjQgMjMuOWMtMjQuNS01LjctNDQuOS0xNi41LTU4LjItMjVDNDQ5LjUgNTAxLjcgNDE3IDUxMiAzODQgNTEyYy0zMS45IDAtNjAuNi05LjktODAuNC0xOC45Yy01LjgtMi43LTExLjEtNS4zLTE1LjYtNy43Yy00LjUgMi40LTkuNyA1LjEtMTUuNiA3LjdjLTE5LjggOS00OC41IDE4LjktODAuNCAxOC45Yy0zMyAwLTY1LjUtMTAuMy05NC41LTI1LjhjLTEzLjQgOC40LTMzLjcgMTkuMy01OC4yIDI1Yy0xNy4yIDQtMzQuNC02LjctMzguNC0yMy45czYuNy0zNC40IDIzLjktMzguNGMxOC4xLTQuMiAzNi4yLTEzLjMgNTAuNi0yNS4yYzExLjEtOS40IDI3LjMtMTAuMSAzOS4yLTEuN2wwIDBDMTM2LjcgNDM3LjIgMTY1LjEgNDQ4IDE5MiA0NDhjMjcuNSAwIDU1LTEwLjYgNzcuNS0yNi4xYzExLjEtNy45IDI1LjktNy45IDM3IDB6JyxcbiAgICAnZGVzdHJveWVyJzogJ00yNTYgMTZjMC03IDQuNS0xMy4yIDExLjItMTUuM3MxMy45IC40IDE3LjkgNi4xbDIyNCAzMjBjMy40IDQuOSAzLjggMTEuMyAxLjEgMTYuNnMtOC4yIDguNi0xNC4yIDguNkgyNzJjLTguOCAwLTE2LTcuMi0xNi0xNlYxNnpNMjEyLjEgOTYuNWM3IDEuOSAxMS45IDguMiAxMS45IDE1LjVWMzM2YzAgOC44LTcuMiAxNi0xNiAxNkg4MGMtNS43IDAtMTEtMy0xMy44LThzLTIuOS0xMS0uMS0xNmwxMjgtMjI0YzMuNi02LjMgMTEtOS40IDE4LTcuNXpNNS43IDQwNC4zQzIuOCAzOTQuMSAxMC41IDM4NCAyMS4xIDM4NEg1NTQuOWMxMC42IDAgMTguMyAxMC4xIDE1LjQgMjAuM2wtNCAxNC4zQzU1MC43IDQ3My45IDUwMC40IDUxMiA0NDMgNTEySDEzM0M3NS42IDUxMiAyNS4zIDQ3My45IDkuNyA0MTguN2wtNC0xNC4zeidcbiAgfVxuXG4gIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpO1xuICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCA1NzYgNTEyJyk7XG4gIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcxcmVtJyk7XG5cbiAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdwYXRoJyk7XG4gIHBhdGguc2V0QXR0cmlidXRlKCdkJywgb2JqW25hbWVdKTtcblxuICBzdmcuYXBwZW5kQ2hpbGQocGF0aCk7XG4gIHJldHVybiBzdmc7XG59XG5cblxuY29uc3Qgc2V0QmF0dGxlSGVhZGVyID0gKGdhbWUpID0+IHtcbiAgY29uc3QgZ2FtZU1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1tZXNzYWdlJyk7XG4gIGNvbnN0IGRpdkF0ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtYXRrJyk7XG4gIGNvbnN0IGN1cnJlbnRQbGF5ZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcbiAgZGlzcGxheUdhbWVCb2FyZChjdXJyZW50UGxheWVyLCBnYW1lLl9wbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLmJvYXJkLl9ib2FyZCk7XG4gIGdhbWVNZXNzYWdlLmlubmVySFRNTCA9IGAke2dhbWUuX3BsYXllcnNbY3VycmVudFBsYXllcl0ubmFtZX0ncyBUdXJuYDtcbiAgZGl2QXRrLmlubmVySFRNTCA9IGAke2dhbWUuX3BsYXllcnNbY3VycmVudFBsYXllcl0ubmFtZX0sIHdoZXJlIHdvdWxkIHlvdSBsaWtlIHRvIGF0dGFjaz9gO1xufVxuXG5jb25zdCBkaXNwbGF5QXRrRXJyb3JNZXNzYWdlID0gKGNvb3JkKSA9PiB7XG4gIGNvbnN0IHNwYW5FcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFuLWNvb3JkLWVycm9yJyk7XG5cbiAgaWYgKGNvb3JkWzBdIDwgMCB8fCBjb29yZFswXSA+IDEwIHx8IGNvb3JkWzFdIDwgMCB8fCBjb29yZFsxXSA+IDEwKSB7XG4gICAgc3BhbkVycm9yLmlubmVySFRNTCA9ICdJbnB1dCBpcyBvdXQgb2YgcmFuZ2UuIFRyeSBhZ2Fpbi4nO1xuICB9IGVsc2Uge1xuICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnSW5wdXQgaGFzIGJlZW4gY2hvc2VuIGFscmVhZHkuIFRyeSBhZ2Fpbi4nO1xuICB9XG4gIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG59XG5cbmNvbnN0IGRpc3BsYXlUdXJuUmVzdWx0ID0gKHR1cm4sIGdhbWUpID0+IHtcbiAgLy8gVXBkYXRlIEdhbWUgTWVzc2FnZSB0byBoaXQgb3IgbWlzcywgZGlzcGxheSByZXN1bHQgb2YgYXR0YWNrLlxuICBjb25zdCBnYW1lTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW1lc3NhZ2UnKTtcbiAgY29uc3QgY3VycmVudFBsYXllciA9IGdhbWUuZ2V0Q3VycmVudFBsYXllcigpO1xuICBjb25zdCBvcHBvc2l0ZVBsYXllciA9IGN1cnJlbnRQbGF5ZXIgPT09IDEgPyAyIDogMTtcblxuICBpZiAoQXJyYXkuaXNBcnJheSh0dXJuKSkge1xuICAgIGdhbWVNZXNzYWdlLmlubmVySFRNTCA9ICdNSVNTJztcbiAgfSBlbHNlIHtcbiAgICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSB0dXJuO1xuICB9XG5cbiAgZGlzcGxheU9wcG9uZW50R2FtZWJvYXJkKG9wcG9zaXRlUGxheWVyLCBnYW1lLl9wbGF5ZXJzW29wcG9zaXRlUGxheWVyXS5ib2FyZC5fYm9hcmQpO1xuXG4gIC8vIEFmdGVyIDIuNSBzZWNvbmRzIGhpZGUgdGhlIG9wcG9uZW50cyBnYW1lIGJvYXJkLlxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBoaWRlR2FtZUJvYXJkKG9wcG9zaXRlUGxheWVyKTtcbiAgfSwgMjAwMCk7XG59XG5cbmNvbnN0IHVwZGF0ZVR1cm5QaGFzZSA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCBpbnB1dENvb3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb3JkJyk7XG4gIGNvbnN0IGRpdkF0ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXYtYXRrJyk7XG4gIGNvbnN0IHBsYXllciA9IGdhbWUuX3BsYXllcnNbZ2FtZS5nZXRDdXJyZW50UGxheWVyKCldO1xuXG4gIGNvbnN0IGN1cnJlbnRQbGF5ZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcbiAgY29uc3Qgb3Bwb25lbnRQbGF5ZXIgPSBjdXJyZW50UGxheWVyID09PSAxID8gMiA6IDE7XG5cbiAgLy8gU2hvdyBjdXJyZW50IHBsYXllcnMgZ2FtZSBib2FyZCwgd2l0aCBoaXRzIGFuZCBtaXNzZXMgYW5kIHNoaXBzLlxuICAvLyBzaG93IG9wcG9uZW50cyBnYW1lYm9hcmQsIHdpdGggaGl0cyBhbmQgbWlzc2VzIGJ1dCBubyBzaGlwcy5cbiAgZGlzcGxheUdhbWVCb2FyZChjdXJyZW50UGxheWVyLCBnYW1lLl9wbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLmJvYXJkLl9ib2FyZCk7XG4gIGRpc3BsYXlPcHBvbmVudEdhbWVib2FyZChvcHBvbmVudFBsYXllciwgZ2FtZS5fcGxheWVyc1tvcHBvbmVudFBsYXllcl0uYm9hcmQuX2JvYXJkKTtcblxuICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSBgJHtnYW1lLl9wbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLm5hbWV9J3MgVHVybmA7XG4gIGlucHV0Q29vcmQudmFsdWUgPSAnJztcbiAgZGl2QXRrLmlubmVySFRNTCA9IGAke3BsYXllci5uYW1lfSwgd2hlcmUgd291bGQgeW91IGxpa2UgdG8gYXR0YWNrP2A7XG59XG5cbmNvbnN0IGRpc3BsYXlHYW1lT3ZlciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCB3aW5uZXIgPSBnYW1lLl9wbGF5ZXJzW2dhbWUuZ2V0Q3VycmVudFBsYXllcigpXTtcbiAgZGlzcGxheUdhbWVCb2FyZCgxLCBnYW1lLl9wbGF5ZXJzWzFdLmJvYXJkLl9ib2FyZCk7XG4gIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1syXS5ib2FyZC5fYm9hcmQpO1xuXG4gIGdhbWVNZXNzYWdlLmlubmVySFRNTCA9IGAke3dpbm5lci5uYW1lfSB3aW5zIWA7XG4gIC8vIHVuaGlkZSBwbGF5IGFnYWluIGJ1dHRvbj8gXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9