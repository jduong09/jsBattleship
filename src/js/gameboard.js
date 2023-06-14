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