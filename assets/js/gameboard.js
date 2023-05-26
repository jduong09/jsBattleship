const Gameboard = () => {
  const _board = new Array(11).fill(new Array(11).fill([]));
  const _ships = {};

  function insert(shipObj, start, end) {
    _ships[shipObj.name] = shipObj;
    let shipLength = shipObj.shipLength;
    // If the insert parameters are correct, then we can insert the ship into the board.
    if (checkInsertParameters(shipLength, start, end)) {
      _ships[shipObj.name] = shipObj;
      let dx = start[0] - end[0];
      let dy = start[1] - end[1];

      _board[start[0], start[1]] = shipObj.name;

      if (dx) {
        while (dx) {
          if (dx > 0) {
            _board[start[0] + 1, start[1]] = shipObj.name;
            dx -= 1;
          } else {
            _board[start[0] - 1, start[1]] = shipObj.name;
            dx += 1;
          }
        }
      } else {
        while (dy) {
          if (dy > 0) {
            _board[start[0], start[1] - 1] = shipObj.name;
            dx -= 1;
          } else {
            _board[start[0 - 1], start[1] + 1] = shipObj.name;
            dx += 1;
          }
        }
      }
    return _board;
    } else {
    // Else we return a incorrect message?
    }
  }

  function receiveAttack(coord) {

  }

  return {
    _board,
    _ships,
    insert,
    receiveAttack,
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