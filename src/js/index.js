const Game = require('./game');
const Ship = require('./ship');

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