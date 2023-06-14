const Game = require('./game');
const Ship = require('./ship');

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