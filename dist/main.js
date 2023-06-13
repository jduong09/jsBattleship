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
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQSwyRUFBMkUsYUFBYTs7QUFFeEYsa0JBQWtCLFFBQVE7QUFDMUI7QUFDQTs7QUFFQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLGtDQUFrQztBQUMvRCx3QkFBd0Isa0NBQWtDO0FBQzFEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QixrQ0FBa0M7QUFDL0Q7QUFDQSx3QkFBd0IsWUFBWTtBQUNwQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwLy4vc3JjL2pzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwLy4vc3JjL2pzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvLi9zcmMvanMvc2hpcC5qcyIsIndlYnBhY2s6Ly9qc2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vanNiYXR0bGVzaGlwLy4vc3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdhbWVib2FyZEZucyA9IHJlcXVpcmUoJy4vZ2FtZWJvYXJkLmpzJyk7XG5jb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwLmpzJyk7XG5cbi8vIEZvciBHYW1lIHRvIFJ1bi5cbi8vIEhhcyBwbGF5ZXJzX29iamVjdCB3aGljaCBob2xkcyB0d28gcGxheWVyIG9iamVjdHMsIGZvciB0aGUgZ2FtZVxuLy8gSGFzIGN1cnJlbnRUdXJuIHdoaWNoIGtlZXBzIHRyYWNrIG9mIHdob3NlIHR1cm4gaXQgaXMuXG5cbi8vIEhUTUwgaGFzIGlucHV0IGZvciBjaG9vc2luZyBjb29yZGluYXRlcyB0byBzdHJpa2Ugb24gYm9hcmQuXG4vLyBPbmNlIHVzZXIgaGFzIGlucHV0dGVkIHZhbGlkIGNvb3JkaW5hdGVzLCBydW4gdHVybiBmdW5jdGlvbi5cbi8vIGZ1bmN0aW9uICd0dXJuJyB3aGljaCB3aWxsIHJ1biB0aHJvdWdoIGEgdHVybi5cbiAgLy8gQ29vcmRpbmF0ZXMgd2lsbCBiZSBzZXQgdG8gZ2FtZWJvYXJkLCB0byBjaGVjayBpZiB0aGVyZSBpcyBhIGhpdCBvbiB0aGUgb3Bwb25lbnRzIGJvYXJkLlxuICAgIC8vIElmIHRoZXJlIGlzIGEgaGl0LCB3ZSB3YW50IHRvIHNpZ25pZnkgdGhlcmUgaXMgYSBoaXRcbiAgICAgIC8vIFdlIHdhbnQgdG8gY2hlY2sgaWYgYSBzaGlwIGhhcyBmYWxsZW5cbiAgICAgIC8vIFdlIHdhbnQgdG8gY2hlY2sgaWYgYWxsIHNoaXBzIGhhdmUgZmFsbGVuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBtaXNzLCB3ZSB3YW50IHRvIHNpZ25pZnkgdGhhdCBpdCBpcyBhIG1pc3NcbiAgICAgIC8vIFdlIHdhbnQgdG8gYWRkIHRvIHRoZSBtaXNzIGFycmF5XG4gICAgLy8gQ2hhbmdlIHRoZSBjdXJyZW50VHVybiB0byB0aGUgb3Bwb25lbnRzIHR1cm5cbiAgICAvLyBVcGRhdGUgdGhlIEhUTUwgRG9tIHRvIHNpZ25pZnkgdGhhdCBpdCBpcyB0aGUgb3Bwb25lbnRzIHR1cm5cbmNvbnN0IEdhbWUgPSAoKSA9PiB7XG4gIGNvbnN0IF9wbGF5ZXJzID0ge307XG4gIGxldCBfY3VycmVudFR1cm4gPSAxO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBsYXllcihwbGF5ZXJOYW1lKSB7XG4gICAgY29uc3QgcGxheWVyTnVtYmVyID0gX3BsYXllcnNbMV0gPyAyIDogMTtcblxuICAgIF9wbGF5ZXJzW3BsYXllck51bWJlcl0gPSB7XG4gICAgICBuYW1lOiBwbGF5ZXJOYW1lLFxuICAgICAgYm9hcmQ6IGdhbWVib2FyZEZucy5HYW1lYm9hcmQoKVxuICAgIH1cblxuICAgIHJldHVybiBfcGxheWVyc1twbGF5ZXJOdW1iZXJdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudFBsYXllcigpIHtcbiAgICByZXR1cm4gX2N1cnJlbnRUdXJuO1xuICB9XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVDb29yZGluYXRlKGNvb3JkKSB7XG4gICAgLy8gVmFsaWRhdGVDb29yZGluYXRlIHdpbGwgY2hlY2sgdG8gbWFrZSBzdXJlIHRoZSBjb29yZGluYXRlcyBhcmUgaW4gdGhlIHJhbmdlIDAgYW5kIDkuXG4gICAgaWYgKGNvb3JkWzBdIDwgMCB8fCBjb29yZFswXSA+IDkgfHwgY29vcmRbMV0gPCAwIHx8IGNvb3JkWzFdID4gOSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgY3VycmVudFBsYXllcnMgYm9hcmQgZG9lcyBub3QgaGF2ZSB0aGF0IGFzIGEgTWlzc2VkIGNvb3JkaW5hdGUgb3IgaGl0IGNvb3JkaW5hdGUuXG4gICAgY29uc3Qgb3Bwb25lbnRHYW1lYm9hcmQgPSBfY3VycmVudFR1cm4gPT09IDEgPyBfcGxheWVyc1syXS5ib2FyZCA6IF9wbGF5ZXJzWzFdLmJvYXJkO1xuICAgIC8vIElmIG9wcG9uZW50IGJvYXJkIGhhcyBkdXBsaWNhdGVzLCByZXR1cm4gZmFsc2UuXG4gICAgaWYgKG9wcG9uZW50R2FtZWJvYXJkLmNoZWNrRm9yRHVwbGljYXRlcyhjb29yZCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0luc2VydFBhcmFtZXRlcnMoc2hpcExlbmd0aCwgc3RhcnQsIGVuZCkge1xuICAgIGxldCBkeDtcbiAgICBsZXQgZHk7XG4gICAgaWYgKE1hdGguYWJzKHN0YXJ0WzBdIC0gZW5kWzBdKSAhPT0gMCkge1xuICAgICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgKyAxO1xuICAgICAgZHkgPSBNYXRoLmFicyhzdGFydFsxXSAtIGVuZFsxXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSlcbiAgICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pICsgMTtcbiAgICB9XG4gIFxuICAgIC8vIElmIGR4IGFuZCBkeSBhcmVuJ3QgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBjb29yZGluYXRlcyBnaXZlbiBhcmUgaW5jb3JyZWN0LlxuICAgIC8vIFRoaXMgaXMganVzdCBmb3IgbWFudWFsbHkgaW5wdXR0aW5nIGNvb3JkaW5hdGVzIGFuZCBub3QgZm9yIGZ1dHVyZS5cbiAgICBpZiAoZHggIT09IHNoaXBMZW5ndGggJiYgZHkgIT09IHNoaXBMZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyBJZiB0aGUgaG9yaXpvbnRhbCBpcyBjb3JyZWN0LCB0aGVuIGR5IG11c3QgYmUgMCBiZWNhdXNlIHRoZXJlIGlzIG5vIGRpYWdvbmFsIHNoaXAgcGxhY2VtZW50XG4gICAgfSBlbHNlIGlmIChkeCA9PT0gc2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIChkeSA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XG4gICAgLy8gSWYgdGhlIHZlcnRpY2FsIGRpZmZlcmVuY2UgaXMgdGhlIHNoaXAgbGVuZ3RoLCB0aGVuIHRoZSBob3Jpem9udGFsIGRpZmZlcmVuY2Ugc2hvdWxkIGJlIDAuXG4gICAgfSBlbHNlIGlmIChkeSA9PT0gc2hpcExlbmd0aCkge1xuICAgICAgcmV0dXJuIChkeCA9PT0gMCkgPyB0cnVlIDogZmFsc2U7IFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHR1cm4oY29vcmQpIHtcbiAgICAvLyBHaXZlbiBhIGNvb3JkaW5hdGUsIHdlIGNoZWNrIHRvIHNlZSBpZiB0aGUgb3Bwb25lbnQgZ2FtZWJvYXJkIHdpbGwgZ2V0IGhpdCBvciBhIG1pc3MuXG4gICAgY29uc3Qgb3Bwb25lbnRHYW1lYm9hcmQgPSBfY3VycmVudFR1cm4gPT09IDEgPyBfcGxheWVyc1syXS5ib2FyZCA6IF9wbGF5ZXJzWzFdLmJvYXJkO1xuICAgIGNvbnN0IGF0ayA9IG9wcG9uZW50R2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmQpO1xuICAgIC8vIGlmIGF0ayBpcyB0eXBlIG9iamVjdCwgdGhlbiB0aGUgZ2FtZWJvYXJkIHJldHVybmVkIGEgbWlzcy5cbiAgICAvLyB1cGRhdGUgZ2FtZSBtZXNzYWdlIHRvIHN0YXRlIHRoYXQgaXQgd2FzIGEgbWlzcy5cbiAgICByZXR1cm4gYXRrO1xuICB9XG5cbiAgZnVuY3Rpb24gc3dhcFR1cm5zKCkge1xuICAgIF9jdXJyZW50VHVybiA9IF9jdXJyZW50VHVybiA9PT0gMSA/IDIgOiAxO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBfcGxheWVycyxcbiAgICBjcmVhdGVQbGF5ZXIsXG4gICAgZ2V0Q3VycmVudFBsYXllcixcbiAgICB2YWxpZGF0ZUNvb3JkaW5hdGUsXG4gICAgY2hlY2tJbnNlcnRQYXJhbWV0ZXJzLFxuICAgIHR1cm4sXG4gICAgc3dhcFR1cm5zXG4gIH07XG59XG5cbi8qXG4vLyBDYXJyaWVyIChvY2N1cGllcyA1IHNwYWNlcyksIEJhdHRsZXNoaXAgKDQpLCBDcnVpc2VyICgzKSwgU3VibWFyaW5lICgzKSwgYW5kIERlc3Ryb3llciAoMikuXG5jb25zdCBjcmVhdGVSYW5kb21Cb2FyZCA9ICgpID0+IHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZ2FtZWJvYXJkRm5zLkdhbWVib2FyZCgpO1xuICBjb25zdCBzaGlwQXJyYXkgPSBbU2hpcCgnRGVzdHJveWVyJywgMildO1xuXG4gIC8vIFJhbmRvbWx5IGFkZCBzaGlwcyB0byBnYW1lYm9hcmQuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc2hpcCA9IHNoaXBBcnJheVtpXTtcbiAgICAvLyBHZW5lcmF0ZSByYW5kb20gc3RhcnRpbmcgcG9zaXRpb24gaW4gYmV0d2VlbiAxIGFuZCAxMS5cbiAgICBsZXQgcmFuZG9tU3RhcnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMTEgLSAxICsgMSkgKyAxKTtcblxuICAgIC8vIEdlbmVyYXRlIHdoZXRoZXIgaW50ZWdlciB3aWxsIGJlIHggb3IgeS5cbiAgICBjb25zdCByYW5kb21EaXJlY3Rpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMiAtIDEgKyAxKSArIDEpO1xuICAgIGNvbnNvbGUubG9nKHJhbmRvbURpcmVjdGlvbik7XG4gICAgbGV0IHNoaXBTdGFydCA9IHJhbmRvbURpcmVjdGlvbiA9PT0gMSA/IFtyYW5kb21TdGFydCwgMF0gOiBbMCwgcmFuZG9tU3RhcnRdO1xuICAgIGNvbnNvbGUubG9nKHNoaXBTdGFydCk7XG4gIH1cbn1cbiovXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7IiwiY29uc3QgR2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBfYm9hcmQgPSBBcnJheS5mcm9tKHtsZW5ndGg6IDEwfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwoJycpKTtcbiAgY29uc3QgX3NoaXBzID0ge307XG4gIGNvbnN0IF9taXNzZWRBdHRhY2tzID0gW107XG5cbiAgLy8gdmFsaWRhdGVJbnNlcnQgZnVuY3Rpb25cbiAgLy8gR2l2ZW4gYSBzdGFydCBhbmQgZW5kIHBhcmFtZXRlclxuICAvLyBHb2luZyBmcm9tIHRoZSBzdGFydCB0byB0aGUgZW5kIG1hcmtlclxuICBmdW5jdGlvbiB2YWxpZGF0ZUluc2VydChzdGFydCwgZW5kKSB7XG4gICAgY29uc3QgZHggPSBzdGFydFswXSAtIGVuZFswXTtcbiAgICBjb25zdCBkeSA9IHN0YXJ0WzFdIC0gZW5kWzFdO1xuICAgIGxldCBtYXJrZXIgPSBzdGFydDtcbiAgICBpZiAoZHgpIHtcbiAgICAgIHdoaWxlIChtYXJrZXJbMF0gIT09IGVuZFswXSkge1xuICAgICAgICBpZiAoX2JvYXJkW21hcmtlclsxXV1bbWFya2VyWzBdXSAhPT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR4IDwgMCkge1xuICAgICAgICAgIG1hcmtlciA9IFttYXJrZXJbMF0gKyAxLCBzdGFydFsxXV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFya2VyID0gW21hcmtlclswXSAtIDEsIHN0YXJ0WzFdXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAobWFya2VyWzFdICE9PSBlbmRbMV0pIHtcbiAgICAgICAgaWYgKF9ib2FyZFttYXJrZXJbMV1dW21hcmtlclswXV0gIT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeSA8IDApIHtcbiAgICAgICAgICBtYXJrZXIgPSBbc3RhcnRbMF0sIG1hcmtlclsxXSArIDFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hcmtlciA9IFtzdGFydFswXSwgbWFya2VyWzFdIC0gMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnQoc2hpcE9iaiwgc3RhcnQsIGVuZCkge1xuICAgIGxldCBzaGlwTGVuZ3RoID0gc2hpcE9iai5zaGlwTGVuZ3RoO1xuICAgIF9zaGlwc1tzaGlwT2JqLm5hbWVdID0gc2hpcE9iajtcbiAgICBsZXQgZHggPSBzdGFydFswXSAtIGVuZFswXTtcbiAgICBsZXQgZHkgPSBzdGFydFsxXSAtIGVuZFsxXTtcbiAgICBpZiAoZHgpIHtcbiAgICAgIGR4ID0gTWF0aC5hYnMoZHgpICsgMTtcbiAgICAgIGxldCB4TWFya2VyID0gc3RhcnRbMF07XG4gICAgICB3aGlsZSAoZHgpIHtcbiAgICAgICAgaWYgKHN0YXJ0WzBdID4gZW5kWzBdKSB7XG4gICAgICAgICAgX2JvYXJkW3N0YXJ0WzFdXVt4TWFya2VyXSA9IHNoaXBPYmoubmFtZTtcbiAgICAgICAgICB4TWFya2VyIC09IDE7XG4gICAgICAgICAgZHggLT0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfYm9hcmRbc3RhcnRbMV1dW3hNYXJrZXJdID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgIHhNYXJrZXIgKz0gMVxuICAgICAgICAgIGR4IC09IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZHkgPSBNYXRoLmFicyhkeSkgKyAxO1xuICAgICAgbGV0IHlNYXJrZXIgPSBzdGFydFsxXTtcbiAgICAgIHdoaWxlIChkeSkge1xuICAgICAgICBpZiAoc3RhcnRbMV0gPiBlbmRbMV0pIHtcbiAgICAgICAgICBfYm9hcmRbeU1hcmtlcl1bc3RhcnRbMF1dID0gc2hpcE9iai5uYW1lO1xuICAgICAgICAgIHlNYXJrZXIgLT0gMTtcbiAgICAgICAgICBkeSAtPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9ib2FyZFt5TWFya2VyXVtzdGFydFswXV0gPSBzaGlwT2JqLm5hbWU7XG4gICAgICAgICAgeU1hcmtlciArPSAxO1xuICAgICAgICAgIGR5IC09IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9ib2FyZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soY29vcmQpIHtcbiAgICBjb25zdCBib2FyZGxvY2F0aW9uID0gX2JvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV07XG4gICAgaWYgKGJvYXJkbG9jYXRpb24gIT09ICcnKSB7XG4gICAgICBjb25zdCBzaGlwID0gX3NoaXBzW2JvYXJkbG9jYXRpb25dO1xuICAgICAgc2hpcC5oaXQoKTtcbiAgICAgIFxuICAgICAgX2JvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV0gPSAnSCc7XG5cbiAgICAgIGlmIChzaGlwLmlzU3VuaygpKSB7XG4gICAgICAgIHJldHVybiBgJHtzaGlwLm5hbWV9IHN1bmshYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBgJHtzaGlwLm5hbWV9IGhpdCFgO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBfbWlzc2VkQXR0YWNrcy5wdXNoKGNvb3JkKTtcbiAgICAgIF9ib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dID0gJ00nO1xuICAgICAgcmV0dXJuIGNvb3JkO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrRm9yRHVwbGljYXRlcyhjb29yZCkge1xuICAgIGNvbnN0IGR1cGVzID0gX21pc3NlZEF0dGFja3MuZmlsdGVyKChlbGUpID0+IHtcbiAgICAgIHJldHVybiBlbGVbMF0gPT09IGNvb3JkWzBdICYmIGVsZVsxXSA9PT0gY29vcmRbMV07XG4gICAgfSk7XG4gICAgcmV0dXJuIGR1cGVzLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdhbWVPdmVyKCkge1xuICAgIGZvciAoY29uc3Qgc2hpcE5hbWUgaW4gX3NoaXBzKSB7XG4gICAgICBjb25zdCBzaGlwID0gX3NoaXBzW3NoaXBOYW1lXTtcbiAgICAgIGlmIChzaGlwLmlzU3VuaygpKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBfYm9hcmQsXG4gICAgX3NoaXBzLFxuICAgIF9taXNzZWRBdHRhY2tzLFxuICAgIHZhbGlkYXRlSW5zZXJ0LFxuICAgIGluc2VydCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIGNoZWNrRm9yRHVwbGljYXRlcyxcbiAgICBnYW1lT3ZlclxuICB9XG59XG5cbi8qXG5jb25zdCBjaGVja0luc2VydFBhcmFtZXRlcnMgPShzaGlwTGVuZ3RoLCBzdGFydCwgZW5kKSA9PiB7XG4gIGxldCBkeDtcbiAgbGV0IGR5O1xuICBpZiAoTWF0aC5hYnMoc3RhcnRbMF0gLSBlbmRbMF0pICE9PSAwKSB7XG4gICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSkgKyAxO1xuICAgIGR5ID0gTWF0aC5hYnMoc3RhcnRbMV0gLSBlbmRbMV0pXG4gIH0gZWxzZSB7XG4gICAgZHggPSBNYXRoLmFicyhzdGFydFswXSAtIGVuZFswXSlcbiAgICBkeSA9IE1hdGguYWJzKHN0YXJ0WzFdIC0gZW5kWzFdKSArIDE7XG4gIH1cblxuICAvLyBJZiBkeCBhbmQgZHkgYXJlbid0IHRoZSBzaGlwIGxlbmd0aCwgdGhlbiB0aGUgY29vcmRpbmF0ZXMgZ2l2ZW4gYXJlIGluY29ycmVjdC5cbiAgLy8gVGhpcyBpcyBqdXN0IGZvciBtYW51YWxseSBpbnB1dHRpbmcgY29vcmRpbmF0ZXMgYW5kIG5vdCBmb3IgZnV0dXJlLlxuICBpZiAoZHggIT09IHNoaXBMZW5ndGggJiYgZHkgIT09IHNoaXBMZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIElmIHRoZSBob3Jpem9udGFsIGlzIGNvcnJlY3QsIHRoZW4gZHkgbXVzdCBiZSAwIGJlY2F1c2UgdGhlcmUgaXMgbm8gZGlhZ29uYWwgc2hpcCBwbGFjZW1lbnRcbiAgfSBlbHNlIGlmIChkeCA9PT0gc2hpcExlbmd0aCkge1xuICAgIHJldHVybiAoZHkgPT09IDApID8gdHJ1ZSA6IGZhbHNlO1xuICAvLyBJZiB0aGUgdmVydGljYWwgZGlmZmVyZW5jZSBpcyB0aGUgc2hpcCBsZW5ndGgsIHRoZW4gdGhlIGhvcml6b250YWwgZGlmZmVyZW5jZSBzaG91bGQgYmUgMC5cbiAgfSBlbHNlIGlmIChkeSA9PT0gc2hpcExlbmd0aCkge1xuICAgIHJldHVybiAoZHggPT09IDApID8gdHJ1ZSA6IGZhbHNlOyBcbiAgfVxufVxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEdhbWVib2FyZFxufTsiLCIvKlxuUkVNRU1CRVIgeW91IG9ubHkgaGF2ZSB0byB0ZXN0IHlvdXIgb2JqZWN04oCZcyBwdWJsaWMgaW50ZXJmYWNlLlxuT25seSBtZXRob2RzIG9yIHByb3BlcnRpZXMgdGhhdCBhcmUgdXNlZCBvdXRzaWRlIG9mIHlvdXIg4oCYc2hpcOKAmSBvYmplY3QgbmVlZCB1bml0IHRlc3RzLlxuKi9cblxuLy8gU2hpcHMgc2hvdWxkIGhhdmUgYSBoaXQoKSBmdW5jdGlvbiB0aGF0IGluY3JlYXNlcyB0aGUgbnVtYmVyIG9mIOKAmGhpdHPigJkgaW4geW91ciBzaGlwLlxuXG4vLyBpc1N1bmsoKSBzaG91bGQgYmUgYSBmdW5jdGlvbiB0aGF0IGNhbGN1bGF0ZXMgaXQgYmFzZWQgb24gdGhlaXIgbGVuZ3RoIFxuLy8gYW5kIHRoZSBudW1iZXIgb2Yg4oCYaGl0c+KAmS5cbmNvbnN0IFNoaXAgPSAobmFtZSwgaGl0cG9pbnRzKSA9PiB7XG4gIGxldCBfaGl0cG9pbnRzID0gaGl0cG9pbnRzO1xuICBjb25zdCBzaGlwTGVuZ3RoID0gaGl0cG9pbnRzO1xuICBsZXQgX3N1bmsgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBoaXQoKSB7XG4gICAgX2hpdHBvaW50cyAtPSAxO1xuXG4gICAgaWYgKCFfaGl0cG9pbnRzKSB7XG4gICAgICBfc3VuayA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9oaXRwb2ludHM7XG4gIH1cblxuICBmdW5jdGlvbiBpc1N1bmsoKSB7XG4gICAgcmV0dXJuIF9zdW5rO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIHNoaXBMZW5ndGgsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGlwOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJjb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJyk7XG5jb25zdCBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGdhbWUgPSBHYW1lKCk7XG5cbiAgZ2FtZS5jcmVhdGVQbGF5ZXIoJ0p1c3RpbicpO1xuICBnYW1lLmNyZWF0ZVBsYXllcignSmVmZicpO1xuICBzZXRQbGF5ZXJCb2FyZE5hbWVzKGdhbWUpO1xuICBkaXNwbGF5R2FtZUJvYXJkKDEsIGdhbWUuX3BsYXllcnNbJzEnXS5ib2FyZC5fYm9hcmQpO1xuICBkaXNwbGF5R2FtZUJvYXJkKDIsIGdhbWUuX3BsYXllcnNbJzInXS5ib2FyZC5fYm9hcmQpO1xuXG4gIHN0YXJ0UHJlcFBoYXNlKGdhbWUpO1xuICBzdGFydEJhdHRsZVBoYXNlKGdhbWUpO1xufSk7XG5cbmNvbnN0IHNldFBsYXllckJvYXJkTmFtZXMgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBib2FyZE9uZUhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIjFcIl0gPiBoM2ApO1xuICBjb25zdCBib2FyZFR3b0hlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIjJcIl0gPiBoM2ApO1xuXG4gIGJvYXJkT25lSGVhZGVyLmlubmVySFRNTCA9IGAke2dhbWUuX3BsYXllcnNbMV0ubmFtZX0ncyBCb2FyZGA7XG4gIGJvYXJkVHdvSGVhZGVyLmlubmVySFRNTCA9IGAke2dhbWUuX3BsYXllcnNbMl0ubmFtZX0ncyBCb2FyZGA7XG59XG5cbmNvbnN0IHN0YXJ0UHJlcFBoYXNlID0gKGdhbWUpID0+IHtcbiAgY29uc3QgaW5wdXRJbnNlcnRDb29yZGluYXRlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnNlcnQtY29vcmRpbmF0ZXMnKTtcbiAgY29uc3Qgc3Bhbkluc2VydEVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYW4taW5zZXJ0LWVycm9yJyk7XG5cbiAgc2V0UHJlcEhlYWRlcihnYW1lKTtcbiAgc2V0SW5wdXRMaXN0ZW5lcihpbnB1dEluc2VydENvb3JkaW5hdGVzLCBzcGFuSW5zZXJ0RXJyb3IpO1xuICBzZXRQcmVwU3VibWl0QnRuTGlzdGVuZXIoZ2FtZSk7XG59XG5cbmNvbnN0IHNldFByZXBIZWFkZXIgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBnYW1lTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW1lc3NhZ2UnKTtcbiAgY29uc3QgcGxheWVyT25lID0gZ2FtZS5fcGxheWVyc1sxXTtcbiAgY29uc3QgZGl2SW5zZXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpdi1pbnNlcnQnKTtcbiAgXG4gIGdhbWVNZXNzYWdlLmlubmVySFRNTCA9IGAke3BsYXllck9uZS5uYW1lfSdzIFR1cm5gO1xuICBkaXZJbnNlcnQuaW5uZXJIVE1MID0gYCR7cGxheWVyT25lLm5hbWV9LCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBjcnVpc2VyIChMZW5ndGg6IDMgUGxhY2VzKTpgO1xufVxuXG5jb25zdCBzZXRQcmVwU3VibWl0QnRuTGlzdGVuZXIgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBnYW1lUGhhc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1waGFzZScpO1xuICBjb25zdCBnYW1lTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW1lc3NhZ2UnKTtcbiAgY29uc3QgZm9ybUluc2VydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtLWluc2VydC1zaGlwcycpO1xuICBjb25zdCBmb3JtQmF0dGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0tYXRrLWNvb3JkcycpO1xuICBjb25zdCBkaXZJbnNlcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWluc2VydCcpO1xuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnNlcnQtY29vcmRpbmF0ZXMnKTtcbiAgY29uc3Qgc3BhbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYW4taW5zZXJ0LWVycm9yJyk7XG4gIGNvbnN0IHN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnNlcnQtc3VibWl0Jyk7XG5cbiAgbGV0IGN1cnJlbnRQbGF5ZXIgPSBnYW1lLl9wbGF5ZXJzWzFdO1xuICBzdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBjdXJyZW50U2hpcCA9IGRpdkluc2VydC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcpO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzQXJyYXkgPSBpbnB1dC52YWx1ZS5zcGxpdCgnICcpO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gW3RyYW5zZm9ybUlucHV0VG9Db29yZChjb29yZGluYXRlc0FycmF5WzBdKSwgdHJhbnNmb3JtSW5wdXRUb0Nvb3JkKGNvb3JkaW5hdGVzQXJyYXlbMV0pXTtcbiAgICBcbiAgICBpZiAoY3VycmVudFNoaXAgPT09ICdjcnVpc2VyJykge1xuICAgICAgLy8gVGhlIHR3byBjb29yZGluYXRlcyBtYXRjaCB0aGUgbGVuZ3RoIG9mIHRoZSBzaGlwXG4gICAgICBpZiAoZ2FtZS5jaGVja0luc2VydFBhcmFtZXRlcnMoMywgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICAvLyBDaGVjayB0aGF0IHR3byBjb29yZGluYXRlcyBkb24ndCBpbnRlcmZlcmUgd2l0aCBvdGhlciBzaGlwcyBvbiB0aGUgcGxheWVycyBib2FyZC5cbiAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIuYm9hcmQudmFsaWRhdGVJbnNlcnQoY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICAgIGNvbnN0IHNoaXAgPSBTaGlwKCdDcnVpc2VyJywgMyk7XG4gICAgICAgICAgY3VycmVudFBsYXllci5ib2FyZC5pbnNlcnQoc2hpcCwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKTtcbiAgICAgICAgICBkaXZJbnNlcnQuc2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnLCAnYmF0dGxlc2hpcCcpO1xuICAgICAgICAgIGRpdkluc2VydC5pbm5lckhUTUwgPSBgJHtjdXJyZW50UGxheWVyLm5hbWV9LCBjaG9vc2Ugd2hlcmUgdG8gcGxhY2UgeW91ciBiYXR0bGVzaGlwIChMZW5ndGg6IDUgcGxhY2VzKTpgO1xuICAgICAgICAgIGlucHV0LnZhbHVlID0gbnVsbDtcblxuICAgICAgICAgIGlmIChjdXJyZW50UGxheWVyID09PSBnYW1lLl9wbGF5ZXJzWzFdKSB7XG4gICAgICAgICAgICBkaXNwbGF5R2FtZUJvYXJkKDEsIGdhbWUuX3BsYXllcnNbJzEnXS5ib2FyZC5fYm9hcmQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXNwbGF5R2FtZUJvYXJkKDIsIGdhbWUuX3BsYXllcnNbJzInXS5ib2FyZC5fYm9hcmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFuRXJyb3IuaW5uZXJIVE1MID0gJ0Vycm9yOiBEaWZmZXJlbnQgU2hpcCBwbGFjZWQgYXQgY29vcmRpbmF0ZXMuIFVzZSBkaWZmZXJlbnQgY29vcmRpbmF0ZXMuJztcbiAgICAgICAgICBzcGFuRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFuRXJyb3IuaW5uZXJIVE1MID0gJ0Vycm9yOiBDb29yZGluYXRlcyByYW5nZSBkb2VzIG5vdCBtYXRjaCBzaGlwIGxlbmd0aC4nO1xuICAgICAgICBzcGFuRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY3VycmVudFNoaXAgPT09ICdiYXR0bGVzaGlwJykge1xuICAgICAgaWYgKGdhbWUuY2hlY2tJbnNlcnRQYXJhbWV0ZXJzKDUsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSkpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIuYm9hcmQudmFsaWRhdGVJbnNlcnQoY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICAgIGNvbnN0IHNoaXAgPSBTaGlwKCdCYXR0bGVzaGlwJywgNSk7XG4gICAgICAgICAgY3VycmVudFBsYXllci5ib2FyZC5pbnNlcnQoc2hpcCwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKTtcbiAgICAgICAgICBkaXZJbnNlcnQuc2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnLCAnZGVzdHJveWVyJyk7XG4gICAgICAgICAgZGl2SW5zZXJ0LmlubmVySFRNTCA9IGAke2N1cnJlbnRQbGF5ZXIubmFtZX0sIGNob29zZSB3aGVyZSB0byBwbGFjZSB5b3VyIGRlc3RveWVyIChMZW5ndGg6IDIgcGxhY2VzKTpgO1xuICAgICAgICAgIGlucHV0LnZhbHVlID0gbnVsbDtcblxuICAgICAgICAgIGlmIChjdXJyZW50UGxheWVyID09PSBnYW1lLl9wbGF5ZXJzWzFdKSB7XG4gICAgICAgICAgICBkaXNwbGF5R2FtZUJvYXJkKDEsIGdhbWUuX3BsYXllcnNbJzEnXS5ib2FyZC5fYm9hcmQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXNwbGF5R2FtZUJvYXJkKDIsIGdhbWUuX3BsYXllcnNbJzInXS5ib2FyZC5fYm9hcmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFuRXJyb3IuaW5uZXJIVE1MID0gJ0Vycm9yOiBEaWZmZXJlbnQgU2hpcCBwbGFjZWQgYXQgY29vcmRpbmF0ZXMuIFVzZSBkaWZmZXJlbnQgY29vcmRpbmF0ZXMuJztcbiAgICAgICAgICBzcGFuRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFuRXJyb3IuaW5uZXJIVE1MID0gJ0Vycm9yOiBDb29yZGluYXRlcyByYW5nZSBkb2VzIG5vdCBtYXRjaCBzaGlwIGxlbmd0aC4nO1xuICAgICAgICBzcGFuRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY3VycmVudFNoaXAgPT09ICdkZXN0cm95ZXInKSB7XG4gICAgICBpZiAoZ2FtZS5jaGVja0luc2VydFBhcmFtZXRlcnMoMiwgY29vcmRpbmF0ZXNbMF0sIGNvb3JkaW5hdGVzWzFdKSkge1xuICAgICAgICBpZiAoY3VycmVudFBsYXllci5ib2FyZC52YWxpZGF0ZUluc2VydChjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0pKSB7XG4gICAgICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoJ0Rlc3Ryb3llcicsIDIpO1xuICAgICAgICAgIGN1cnJlbnRQbGF5ZXIuYm9hcmQuaW5zZXJ0KHNoaXAsIGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSk7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IGdhbWUuX3BsYXllcnNbMV0pIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMSwgZ2FtZS5fcGxheWVyc1snMSddLmJvYXJkLl9ib2FyZCk7XG4gICAgICAgICAgICAgLy8gQWZ0ZXIgNSBzZWNvbmRzXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgLy8gSGlkZSBQbGF5ZXIgMSBib2FyZFxuICAgICAgICAgICAgICBoaWRlR2FtZUJvYXJkKDEpO1xuICAgICAgICAgICAgICAvLyBDaGFuZ2VkIGN1cnJlbnRQbGF5ZXIgdmFyaWFibGUgdG8gUGxheWVyIDJcbiAgICAgICAgICAgICAgY3VycmVudFBsYXllciA9IGdhbWUuX3BsYXllcnNbMl07XG4gICAgICAgICAgICAgIGdhbWVNZXNzYWdlLmlubmVySFRNTCA9IGAke2N1cnJlbnRQbGF5ZXIubmFtZX0ncyBUdXJuYDtcbiAgICAgICAgICAgICAgLy8gU2V0IGRpdiBJbnNlcnQgdG8gY3J1aXNlclxuICAgICAgICAgICAgICBkaXZJbnNlcnQuc2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnLCAnY3J1aXNlcicpO1xuICAgICAgICAgICAgICBkaXZJbnNlcnQuaW5uZXJIVE1MID0gYCR7Y3VycmVudFBsYXllci5uYW1lfSwgY2hvb3NlIHdoZXJlIHRvIHBsYWNlIHlvdXIgY3J1aXNlciAoTGVuZ3RoOiAzIHBsYWNlcyk6YDtcbiAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgfSwgMjUwMCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3BsYXlHYW1lQm9hcmQoMiwgZ2FtZS5fcGxheWVyc1snMiddLmJvYXJkLl9ib2FyZCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBoaWRlR2FtZUJvYXJkKDIpO1xuICAgICAgICAgICAgICBnYW1lUGhhc2UuaW5uZXJIVE1MID0gJ0JhdHRsZSBQaGFzZSc7XG4gICAgICAgICAgICAgIGZvcm1JbnNlcnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICAgICAgICBmb3JtQmF0dGxlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgc2V0QmF0dGxlSGVhZGVyKGdhbWUpO1xuICAgICAgICAgICAgfSwgMjUwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IERpZmZlcmVudCBTaGlwIHBsYWNlZCBhdCBjb29yZGluYXRlcy4gVXNlIGRpZmZlcmVudCBjb29yZGluYXRlcy4nO1xuICAgICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnRXJyb3I6IENvb3JkaW5hdGVzIHJhbmdlIGRvZXMgbm90IG1hdGNoIHNoaXAgbGVuZ3RoLic7XG4gICAgICAgIHNwYW5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3Qgc3RhcnRCYXR0bGVQaGFzZSA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCBpbnB1dENvb3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb3JkJyk7XG4gIGNvbnN0IHNwYW5FcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFuLWNvb3JkLWVycm9yJyk7XG4gIGNvbnN0IGN1cnJlbnRQbGF5ZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcbiAgXG4gIGdhbWVNZXNzYWdlLmlubmVySFRNTCA9IGAke2dhbWUuX3BsYXllcnNbY3VycmVudFBsYXllcl0ubmFtZX0ncyBUdXJuYDtcbiAgXG4gIHNldElucHV0TGlzdGVuZXIoaW5wdXRDb29yZCwgc3BhbkVycm9yKTtcbiAgc2V0QmF0dGxlU3VibWl0QnRuTGlzdGVuZXIoZ2FtZSk7XG59XG5cbmNvbnN0IHNldEJhdHRsZVN1Ym1pdEJ0bkxpc3RlbmVyID0gKGdhbWUpID0+IHtcbiAgY29uc3QgaW5wdXRDb29yZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29yZCcpO1xuICBjb25zdCBpbnB1dFN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdGstc3VibWl0Jyk7XG4gIGNvbnN0IHNwYW5FcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFuLWNvb3JkLWVycm9yJyk7XG5cbiAgaW5wdXRTdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBjb29yZGluYXRlID0gdHJhbnNmb3JtSW5wdXRUb0Nvb3JkKGlucHV0Q29vcmQudmFsdWUpO1xuICAgIC8vIEdpdmVuIGFuIGlucHV0LCB3ZSBuZWVkIHRvIHZhbGlkYXRlIHRoYXQgaXQgaXMgYSB2YWxpZCBjb29yZGluYXRlLlxuICAgIGlmIChnYW1lLnZhbGlkYXRlQ29vcmRpbmF0ZShjb29yZGluYXRlKSkge1xuICAgICAgaWYgKCFzcGFuRXJyb3IuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykpIHtcbiAgICAgICAgc3BhbkVycm9yLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgIH1cblxuICAgICAgLy8gT25jZSB0dXJuIGlzIHZhbGlkYXRlZCwgd2UgcnVuIHRocm91Z2ggdGhlIHR1cm4gZnVuY3Rpb25zXG4gICAgICAvLyBXZSBjYWxsIHR1cm4gd2l0aCBjb29yZGluYXRlIHRvIGNoZWNrIGlmIGl0IGlzIGEgaGl0IG9yIG1pc3MuXG4gICAgICAvLyBVcGRhdGUgb3Bwb25lbnRzIGdhbWVib2FyZC5cbiAgICAgIGNvbnN0IHR1cm4gPSBnYW1lLnR1cm4oY29vcmRpbmF0ZSk7XG4gICAgICAvLyBVcGRhdGUgZ2FtZSBtZXNzYWdlIHRvIGVpdGhlciBoaXQgb3IgbWlzc1xuICAgICAgLy8gRGlzcGxheSBvcHBvbmVudHMgZ2FtZWJvYXJkIHRvIGlsbHVzdHJhdGUgaGl0IG9yIG1pc3NcbiAgICAgIC8vIEhpZGUgZ2FtZWJvYXJkIGFmdGVyIDIuNXNlY29uZHMuXG4gICAgICAvLyBORUVEIFRPIEFERCBHQU1FIE9WRVIgQ0hFQ0sgQU5EIEdBTUUgT1ZFUiBNRVNTQUdFLlxuICAgICAgZGlzcGxheVR1cm5SZXN1bHQodHVybiwgZ2FtZSk7XG4gICAgICBcbiAgICAgIC8vIEFmdGVyIDUgc2Vjb25kc1xuICAgICAgLy8gQ2hhbmdlIHR1cm5zXG4gICAgICAvLyBVcGRhdGUgR2FtZSBtZXNzYWdlIHRvIGJhdHRsZSBwaGFzZVxuICAgICAgLy8gRW5kIG9mIGZ1bmN0aW9uLCB3ZSB3YW50IGZvciBpbnB1dCB0byBiZSBzZWxlY3RlZCBvbiB0dXJuLlxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIENoYW5nZSBnYW1lIHBoYXNlIGN1cnJlbnQgdHVybi5cbiAgICAgICAgZ2FtZS5zd2FwVHVybnMoKTtcbiAgICAgICAgLy8gU2hvdyBjdXJyZW50IHBsYXllcnMgZ2FtZSBib2FyZCwgd2l0aCBoaXRzIGFuZCBtaXNzZXMgYW5kIHNoaXBzLlxuICAgICAgICAvLyBzaG93IG9wcG9uZW50cyBnYW1lYm9hcmQsIHdpdGggaGl0cyBhbmQgbWlzc2VzIGJ1dCBubyBzaGlwcy5cbiAgICAgICAgdXBkYXRlVHVyblBoYXNlKGdhbWUpO1xuICAgICAgfSwgNTAwMClcbiAgICB9IGVsc2Uge1xuICAgICAgZGlzcGxheUF0a0Vycm9yTWVzc2FnZShjb29yZGluYXRlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5jb25zdCBzZXRJbnB1dExpc3RlbmVyID0gKGlucHV0LCBzcGFuKSA9PiB7XG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIGlmICghaW5wdXQudmFsaWRpdHkudmFsaWQpIHtcbiAgICAgIGRpc3BsYXlJbnB1dEVycm9yKGlucHV0KTtcbiAgICAgIHNwYW4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXNwYW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykpIHtcbiAgICAgICAgc3Bhbi5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgZGlzcGxheUlucHV0RXJyb3IgPSAoaW5wdXQpID0+IHtcbiAgY29uc3QgcGFyZW50RWxlbWVudCA9IGlucHV0LnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IHNwYW5FcnJvckVsZW1lbnQgPSBwYXJlbnRFbGVtZW50LmNoaWxkcmVuWzNdO1xuICBpZiAoaW5wdXQudmFsaWRpdHkudmFsdWVNaXNzaW5nKSB7XG4gICAgc3BhbkVycm9yRWxlbWVudC5pbm5lckhUTUwgPSAnRXJyb3I6IElucHV0IGlzIHJlcXVpcmVkLic7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgfSBlbHNlIGlmIChpbnB1dC52YWxpZGl0eS50b29Mb25nKSB7XG4gICAgc3BhbkVycm9yRWxlbWVudC5pbm5lckhUTUwgPSAnRXJyb3I6IElucHV0IGlzIHRvbyBsb25nLic7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgfSBlbHNlIGlmIChpbnB1dC52YWxpZGl0eS5wYXR0ZXJuTWlzbWF0Y2gpIHtcbiAgICBzcGFuRXJyb3JFbGVtZW50LmlubmVySFRNTCA9IChpbnB1dC5pZCA9PT0gJ2luc2VydC1jb29yZGluYXRlcycpXG4gICAgICA/ICdFcnJvcjogSW5wdXQgZG9lcyBub3QgbWF0Y2ggcGF0dGVybi4gZXg6IFwiQTQgQTZcIi4nXG4gICAgICA6ICdFcnJvcjogSW5wdXQgZG9lcyBub3QgbWF0Y2ggcGF0dGVybi4gZXg6IFwiQTVcIi4nO1xuICB9IGVsc2Uge1xuICAgIHNwYW5FcnJvckVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgc3BhbkVycm9yRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgfVxufVxuXG5jb25zdCB0cmFuc2Zvcm1JbnB1dFRvQ29vcmQgPSAoaW5wdXRWYWwpID0+IHtcbiAgY29uc3QgYWxwaCA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSyddO1xuICBcbiAgY29uc3QgaWR4U3RhcnQgPSBhbHBoLmZpbmRJbmRleCgoZWxlKSA9PiB7XG4gICAgcmV0dXJuIGVsZSA9PT0gaW5wdXRWYWxbMF07XG4gIH0pO1xuICByZXR1cm4gW2lkeFN0YXJ0LCBwYXJzZUludChpbnB1dFZhbC5zbGljZSgxKSkgLSAxXTtcbn1cblxuY29uc3QgZGlzcGxheUdhbWVCb2FyZCA9IChwbGF5ZXJOdW1iZXIsIHBsYXllckJvYXJkKSA9PiB7XG4gIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgZGl2LmJvYXJkW2RhdGEtcGxheWVyPVwiJHtwbGF5ZXJOdW1iZXJ9XCJdYCk7XG4gIGNvbnN0IHJvd0xpc3RJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYGRpdi5ib2FyZFtkYXRhLXBsYXllcj1cIiR7cGxheWVyTnVtYmVyfVwiXSA+IHVsID4gbGlgKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllckJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYm9hcmRSb3cgPSBwbGF5ZXJCb2FyZFtpXTtcbiAgICBjb25zdCBkaXNwbGF5Qm9hcmRSb3cgPSByb3dMaXN0SXRlbXNbaSArIDFdO1xuICAgIGNvbnN0IHNwYW5zID0gZGlzcGxheUJvYXJkUm93LmNoaWxkcmVuO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBib2FyZFJvdy5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKGJvYXJkUm93W2pdID09PSAnJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAoYm9hcmRSb3dbal0gPT09ICdIJykge1xuICAgICAgICBzcGFuc1tqICsgMV0uaW5uZXJIVE1MID0gJ0gnO1xuICAgICAgfSBlbHNlIGlmIChib2FyZFJvd1tqXSA9PT0gJ00nKSB7XG4gICAgICAgIHNwYW5zW2ogKyAxXS5pbm5lckhUTUwgPSAnWCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFuc1tqICsgMV0udGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgaWYgKGJvYXJkUm93W2pdID09PSAnQ3J1aXNlcicpIHtcbiAgICAgICAgICBzcGFuc1tqICsgMV0uYXBwZW5kQ2hpbGQoY3JlYXRlR2FtZUljb24oJ2NydWlzZXInKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYm9hcmRSb3dbal0gPT09ICdCYXR0bGVzaGlwJykge1xuICAgICAgICAgIHNwYW5zW2ogKyAxXS5hcHBlbmRDaGlsZChjcmVhdGVHYW1lSWNvbignYmF0dGxlc2hpcCcpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFuc1tqICsgMV0uYXBwZW5kQ2hpbGQoY3JlYXRlR2FtZUljb24oJ2Rlc3Ryb3llcicpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbn1cblxuLy8gRGlzcGxheXMgT3Bwb25lbnRzIGdhbWVib2FyZCB3aXRoIGhpdHMgYW5kIG1pc3Nlc1xuY29uc3QgZGlzcGxheU9wcG9uZW50R2FtZWJvYXJkID0gKHBsYXllck51bWJlciwgcGxheWVyQm9hcmQpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl1gKTtcbiAgY29uc3Qgcm93TGlzdEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgZGl2LmJvYXJkW2RhdGEtcGxheWVyPVwiJHtwbGF5ZXJOdW1iZXJ9XCJdID4gdWwgPiBsaWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyQm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBib2FyZFJvdyA9IHBsYXllckJvYXJkW2ldO1xuICAgIGNvbnN0IGRpc3BsYXlCb2FyZFJvdyA9IHJvd0xpc3RJdGVtc1tpICsgMV07XG4gICAgY29uc3Qgc3BhbnMgPSBkaXNwbGF5Qm9hcmRSb3cuY2hpbGRyZW47XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvYXJkUm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoYm9hcmRSb3dbal0gPT09ICdIJykge1xuICAgICAgICBzcGFuc1tqICsgMV0uaW5uZXJIVE1MID0gJ0gnO1xuICAgICAgfSBlbHNlIGlmIChib2FyZFJvd1tqXSA9PT0gJ00nKSB7XG4gICAgICAgIHNwYW5zW2ogKyAxXS5pbm5lckhUTUwgPSAnWCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFuc1tqICsgMV0uaW5uZXJIVE1MID0gJyc7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbn1cblxuLy8gSGlkZXMgYW55IGdhbWUgYm9hcmQuXG5jb25zdCBoaWRlR2FtZUJvYXJkID0gKHBsYXllck51bWJlcikgPT4ge1xuICBjb25zdCByb3dMaXN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBkaXYuYm9hcmRbZGF0YS1wbGF5ZXI9XCIke3BsYXllck51bWJlcn1cIl0gPiB1bCA+IGxpYCk7XG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCAxMTsgaSsrKSB7XG4gICAgY29uc3QgZGlzcGxheUJvYXJkUm93ID0gcm93TGlzdEl0ZW1zW2ldO1xuICAgIGNvbnN0IHNwYW5zID0gZGlzcGxheUJvYXJkUm93LmNoaWxkcmVuO1xuXG4gICAgZm9yIChsZXQgaiA9IDE7IGogPCAxMTsgaisrKSB7XG4gICAgICBzcGFuc1tqXS5pbm5lckhUTUwgPSAnJztcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgY3JlYXRlR2FtZUljb24gPSAobmFtZSkgPT4ge1xuICBjb25zdCBvYmogPSB7XG4gICAgJ2NydWlzZXInOiAnTTE5MiAzMmMwLTE3LjcgMTQuMy0zMiAzMi0zMkgzNTJjMTcuNyAwIDMyIDE0LjMgMzIgMzJWNjRoNDhjMjYuNSAwIDQ4IDIxLjUgNDggNDhWMjQwbDQ0LjQgMTQuOGMyMy4xIDcuNyAyOS41IDM3LjUgMTEuNSA1My45bC0xMDEgOTIuNmMtMTYuMiA5LjQtMzQuNyAxNS4xLTUwLjkgMTUuMWMtMTkuNiAwLTQwLjgtNy43LTU5LjItMjAuM2MtMjIuMS0xNS41LTUxLjYtMTUuNS03My43IDBjLTE3LjEgMTEuOC0zOCAyMC4zLTU5LjIgMjAuM2MtMTYuMiAwLTM0LjctNS43LTUwLjktMTUuMWwtMTAxLTkyLjZjLTE4LTE2LjUtMTEuNi00Ni4yIDExLjUtNTMuOUw5NiAyNDBWMTEyYzAtMjYuNSAyMS41LTQ4IDQ4LTQ4aDQ4VjMyek0xNjAgMjE4LjdsMTA3LjgtMzUuOWMxMy4xLTQuNCAyNy4zLTQuNCA0MC41IDBMNDE2IDIxOC43VjEyOEgxNjB2OTAuN3pNMzA2LjUgNDIxLjlDMzI5IDQzNy40IDM1Ni41IDQ0OCAzODQgNDQ4YzI2LjkgMCA1NS40LTEwLjggNzcuNC0yNi4xbDAgMGMxMS45LTguNSAyOC4xLTcuOCAzOS4yIDEuN2MxNC40IDExLjkgMzIuNSAyMSA1MC42IDI1LjJjMTcuMiA0IDI3LjkgMjEuMiAyMy45IDM4LjRzLTIxLjIgMjcuOS0zOC40IDIzLjljLTI0LjUtNS43LTQ0LjktMTYuNS01OC4yLTI1QzQ0OS41IDUwMS43IDQxNyA1MTIgMzg0IDUxMmMtMzEuOSAwLTYwLjYtOS45LTgwLjQtMTguOWMtNS44LTIuNy0xMS4xLTUuMy0xNS42LTcuN2MtNC41IDIuNC05LjcgNS4xLTE1LjYgNy43Yy0xOS44IDktNDguNSAxOC45LTgwLjQgMTguOWMtMzMgMC02NS41LTEwLjMtOTQuNS0yNS44Yy0xMy40IDguNC0zMy43IDE5LjMtNTguMiAyNWMtMTcuMiA0LTM0LjQtNi43LTM4LjQtMjMuOXM2LjctMzQuNCAyMy45LTM4LjRjMTguMS00LjIgMzYuMi0xMy4zIDUwLjYtMjUuMmMxMS4xLTkuNCAyNy4zLTEwLjEgMzkuMi0xLjdsMCAwQzEzNi43IDQzNy4yIDE2NS4xIDQ0OCAxOTIgNDQ4YzI3LjUgMCA1NS0xMC42IDc3LjUtMjYuMWMxMS4xLTcuOSAyNS45LTcuOSAzNyAweicsXG4gICAgJ2JhdHRsZXNoaXAnOiAnTTIyNCAwSDM1MmMxNy43IDAgMzIgMTQuMyAzMiAzMmg3NS4xYzIwLjYgMCAzMS42IDI0LjMgMTguMSAzOS44TDQ1NiA5NkgxMjBMOTguOCA3MS44Qzg1LjMgNTYuMyA5Ni4zIDMyIDExNi45IDMySDE5MmMwLTE3LjcgMTQuMy0zMiAzMi0zMnpNOTYgMTI4SDQ4MGMxNy43IDAgMzIgMTQuMyAzMiAzMlYyODMuNWMwIDEzLjMtNC4yIDI2LjMtMTEuOSAzNy4ybC01MS40IDcxLjljLTEuOSAxLjEtMy43IDIuMi01LjUgMy41Yy0xNS41IDEwLjctMzQgMTgtNTEgMTkuOUgzNzUuNmMtMTcuMS0xLjgtMzUtOS01MC44LTE5LjljLTIyLjEtMTUuNS01MS42LTE1LjUtNzMuNyAwYy0xNC44IDEwLjItMzIuNSAxOC01MC42IDE5LjlIMTgzLjljLTE3LTEuOC0zNS42LTkuMi01MS0xOS45Yy0xLjgtMS4zLTMuNy0yLjQtNS42LTMuNUw3NS45IDMyMC43QzY4LjIgMzA5LjggNjQgMjk2LjggNjQgMjgzLjVWMTYwYzAtMTcuNyAxNC4zLTMyIDMyLTMyem0zMiA2NHY5Nkg0NDhWMTkySDEyOHpNMzA2LjUgNDIxLjlDMzI5IDQzNy40IDM1Ni41IDQ0OCAzODQgNDQ4YzI2LjkgMCA1NS4zLTEwLjggNzcuNC0yNi4xbDAgMGMxMS45LTguNSAyOC4xLTcuOCAzOS4yIDEuN2MxNC40IDExLjkgMzIuNSAyMSA1MC42IDI1LjJjMTcuMiA0IDI3LjkgMjEuMiAyMy45IDM4LjRzLTIxLjIgMjcuOS0zOC40IDIzLjljLTI0LjUtNS43LTQ0LjktMTYuNS01OC4yLTI1QzQ0OS41IDUwMS43IDQxNyA1MTIgMzg0IDUxMmMtMzEuOSAwLTYwLjYtOS45LTgwLjQtMTguOWMtNS44LTIuNy0xMS4xLTUuMy0xNS42LTcuN2MtNC41IDIuNC05LjcgNS4xLTE1LjYgNy43Yy0xOS44IDktNDguNSAxOC45LTgwLjQgMTguOWMtMzMgMC02NS41LTEwLjMtOTQuNS0yNS44Yy0xMy40IDguNC0zMy43IDE5LjMtNTguMiAyNWMtMTcuMiA0LTM0LjQtNi43LTM4LjQtMjMuOXM2LjctMzQuNCAyMy45LTM4LjRjMTguMS00LjIgMzYuMi0xMy4zIDUwLjYtMjUuMmMxMS4xLTkuNCAyNy4zLTEwLjEgMzkuMi0xLjdsMCAwQzEzNi43IDQzNy4yIDE2NS4xIDQ0OCAxOTIgNDQ4YzI3LjUgMCA1NS0xMC42IDc3LjUtMjYuMWMxMS4xLTcuOSAyNS45LTcuOSAzNyAweicsXG4gICAgJ2Rlc3Ryb3llcic6ICdNMjU2IDE2YzAtNyA0LjUtMTMuMiAxMS4yLTE1LjNzMTMuOSAuNCAxNy45IDYuMWwyMjQgMzIwYzMuNCA0LjkgMy44IDExLjMgMS4xIDE2LjZzLTguMiA4LjYtMTQuMiA4LjZIMjcyYy04LjggMC0xNi03LjItMTYtMTZWMTZ6TTIxMi4xIDk2LjVjNyAxLjkgMTEuOSA4LjIgMTEuOSAxNS41VjMzNmMwIDguOC03LjIgMTYtMTYgMTZIODBjLTUuNyAwLTExLTMtMTMuOC04cy0yLjktMTEtLjEtMTZsMTI4LTIyNGMzLjYtNi4zIDExLTkuNCAxOC03LjV6TTUuNyA0MDQuM0MyLjggMzk0LjEgMTAuNSAzODQgMjEuMSAzODRINTU0LjljMTAuNiAwIDE4LjMgMTAuMSAxNS40IDIwLjNsLTQgMTQuM0M1NTAuNyA0NzMuOSA1MDAuNCA1MTIgNDQzIDUxMkgxMzNDNzUuNiA1MTIgMjUuMyA0NzMuOSA5LjcgNDE4LjdsLTQtMTQuM3onXG4gIH1cblxuICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInN2Z1wiKTtcbiAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgNTc2IDUxMicpO1xuICBzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMXJlbScpO1xuXG4gIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAncGF0aCcpO1xuICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIG9ialtuYW1lXSk7XG5cbiAgc3ZnLmFwcGVuZENoaWxkKHBhdGgpO1xuICByZXR1cm4gc3ZnO1xufVxuXG5cbmNvbnN0IHNldEJhdHRsZUhlYWRlciA9IChnYW1lKSA9PiB7XG4gIGNvbnN0IGdhbWVNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtbWVzc2FnZScpO1xuICBjb25zdCBkaXZBdGsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWF0aycpO1xuICBjb25zdCBjdXJyZW50UGxheWVyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XG4gIGRpc3BsYXlHYW1lQm9hcmQoY3VycmVudFBsYXllciwgZ2FtZS5fcGxheWVyc1tjdXJyZW50UGxheWVyXS5ib2FyZC5fYm9hcmQpO1xuICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSBgJHtnYW1lLl9wbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLm5hbWV9J3MgVHVybmA7XG4gIGRpdkF0ay5pbm5lckhUTUwgPSBgJHtnYW1lLl9wbGF5ZXJzW2N1cnJlbnRQbGF5ZXJdLm5hbWV9LCB3aGVyZSB3b3VsZCB5b3UgbGlrZSB0byBhdHRhY2s/YDtcbn1cblxuY29uc3QgZGlzcGxheUF0a0Vycm9yTWVzc2FnZSA9IChjb29yZCkgPT4ge1xuICBjb25zdCBzcGFuRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bhbi1jb29yZC1lcnJvcicpO1xuXG4gIGlmIChjb29yZFswXSA8IDAgfHwgY29vcmRbMF0gPiAxMCB8fCBjb29yZFsxXSA8IDAgfHwgY29vcmRbMV0gPiAxMCkge1xuICAgIHNwYW5FcnJvci5pbm5lckhUTUwgPSAnSW5wdXQgaXMgb3V0IG9mIHJhbmdlLiBUcnkgYWdhaW4uJztcbiAgfSBlbHNlIHtcbiAgICBzcGFuRXJyb3IuaW5uZXJIVE1MID0gJ0lucHV0IGhhcyBiZWVuIGNob3NlbiBhbHJlYWR5LiBUcnkgYWdhaW4uJztcbiAgfVxuICBzcGFuRXJyb3IuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xufVxuXG5jb25zdCBkaXNwbGF5VHVyblJlc3VsdCA9ICh0dXJuLCBnYW1lKSA9PiB7XG4gIC8vIFVwZGF0ZSBHYW1lIE1lc3NhZ2UgdG8gaGl0IG9yIG1pc3MsIGRpc3BsYXkgcmVzdWx0IG9mIGF0dGFjay5cbiAgY29uc3QgZ2FtZU1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1tZXNzYWdlJyk7XG4gIGNvbnN0IGN1cnJlbnRQbGF5ZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcbiAgY29uc3Qgb3Bwb3NpdGVQbGF5ZXIgPSBjdXJyZW50UGxheWVyID09PSAxID8gMiA6IDE7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodHVybikpIHtcbiAgICBnYW1lTWVzc2FnZS5pbm5lckhUTUwgPSAnTUlTUyc7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZU1lc3NhZ2UuaW5uZXJIVE1MID0gdHVybjtcbiAgfVxuXG4gIGRpc3BsYXlPcHBvbmVudEdhbWVib2FyZChvcHBvc2l0ZVBsYXllciwgZ2FtZS5fcGxheWVyc1tvcHBvc2l0ZVBsYXllcl0uYm9hcmQuX2JvYXJkKTtcblxuICAvLyBBZnRlciAyLjUgc2Vjb25kcyBoaWRlIHRoZSBvcHBvbmVudHMgZ2FtZSBib2FyZC5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgaGlkZUdhbWVCb2FyZChvcHBvc2l0ZVBsYXllcik7XG4gIH0sIDI1MDApO1xufVxuXG5jb25zdCB1cGRhdGVUdXJuUGhhc2UgPSAoZ2FtZSkgPT4ge1xuICBjb25zdCBnYW1lTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW1lc3NhZ2UnKTtcbiAgY29uc3QgaW5wdXRDb29yZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29yZCcpO1xuICBjb25zdCBkaXZBdGsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2LWF0aycpO1xuICBjb25zdCBwbGF5ZXIgPSBnYW1lLl9wbGF5ZXJzW2dhbWUuZ2V0Q3VycmVudFBsYXllcigpXTtcblxuICBjb25zdCBjdXJyZW50UGxheWVyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XG4gIGNvbnN0IG9wcG9uZW50UGxheWVyID0gY3VycmVudFBsYXllciA9PT0gMSA/IDIgOiAxO1xuXG4gIC8vIFNob3cgY3VycmVudCBwbGF5ZXJzIGdhbWUgYm9hcmQsIHdpdGggaGl0cyBhbmQgbWlzc2VzIGFuZCBzaGlwcy5cbiAgLy8gc2hvdyBvcHBvbmVudHMgZ2FtZWJvYXJkLCB3aXRoIGhpdHMgYW5kIG1pc3NlcyBidXQgbm8gc2hpcHMuXG4gIGRpc3BsYXlHYW1lQm9hcmQoY3VycmVudFBsYXllciwgZ2FtZS5fcGxheWVyc1tjdXJyZW50UGxheWVyXS5ib2FyZC5fYm9hcmQpO1xuICBkaXNwbGF5T3Bwb25lbnRHYW1lYm9hcmQob3Bwb25lbnRQbGF5ZXIsIGdhbWUuX3BsYXllcnNbb3Bwb25lbnRQbGF5ZXJdLmJvYXJkLl9ib2FyZCk7XG5cbiAgZ2FtZU1lc3NhZ2UuaW5uZXJIVE1MID0gYCR7Z2FtZS5fcGxheWVyc1tjdXJyZW50UGxheWVyXS5uYW1lfSdzIFR1cm5gO1xuICBpbnB1dENvb3JkLnZhbHVlID0gJyc7XG4gIGRpdkF0ay5pbm5lckhUTUwgPSBgJHtwbGF5ZXIubmFtZX0sIHdoZXJlIHdvdWxkIHlvdSBsaWtlIHRvIGF0dGFjaz9gO1xufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==