const Game = require('./game');
const Ship = require('./ship');

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