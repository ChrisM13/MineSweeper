/*----- constants -----*/

var newBoard;

/*----- app's state (variables) -----*/




/*----- cached element references -----*/
$gameBoard = $('#gameBoard')
$msg = $('.message')
$container = $('.container')
$diff = $('.difficulty')



/*----- event listeners -----*/
// // $container.addEventListener('click', leftClick)
$diff.on('click', 'button', function (evt) {
  var td = $(evt.target);
  var className = td.attr('class')
  setDiff(className);
});

$gameBoard.on('click', 'td', handleClick)




/*----- functions -----*/
class Board {
  constructor(numMines, width, height) {
    this.board;
    this.width = width;
    this.height = height;
    this.winner = false
    this.loser = false
    this.totalMines = numMines
    this.setNumMines(numMines)
    this.generateBoard()
    this.placeMines()
    this.placeNums()
    this.checkWinner()
  }

  setNumMines(numMines) {
    if (numMines > (this.width * this.height)) {
      this.numMines = this.width * this.height
    } else {
      this.numMines = numMines;
    }
  }

  generateBoard() {
    const board = []
    $container.html('');
    for (var row = 0; row < this.width; row++) {
      board[row] = new Array()
      $container.append(`<tr data-row="${row}"></tr>`)
      for (var col = 0; col < this.height; col++) {
        board[row][col] = new Cell(false, row, col, board);
        $(`tr[data-row="${row}"]`).append(`<td data-row="${row}" data-col="${col}"></td>`)
      }
    }
    this.board = board
  }

  render() {
    this.checkWinner()
    if (this.winner) {
    }
    this.board.forEach(function (row) {
      row.forEach(function (cell) {
        var $td = $(`td[data-row="${cell.row}"][data-col="${cell.col}"]`);
        if (cell.hidden) {
          $td.html('');
        } else if (cell.mine) {
          $td.addClass('alien');
        } else {
          $td.html(cell.mineTotal);
        }
      });
    });
  }

  revealAll() {
    this.board.forEach(function (row) {
      row.forEach(function (cell) {
        cell.hidden = false;
      })
    })
    $gameBoard.toggleClass("gameBoardLose");
    newBoard.render()
    setTimeout(function() {
      $gameBoard.toggleClass("gameBoardLose");
    }, 2000);
  }

  placeMines() {
    while (this.numMines > 0) {
      var x = Math.floor(Math.random() * this.width)
      var y = Math.floor(Math.random() * this.height)
      if (this.board[x][y].mine === false) {
        this.board[x][y].mine = true
        this.numMines -= 1
      }
    }
  }

  placeNums() {
    this.board.forEach(function (row) {
      row.forEach(function (cell) {
        cell.computeAdjacent();
      })
    });
  }

  checkWinner() {
    if (!this.loser) {
      var totalSafe = (this.width * this.height) - this.totalMines;
      this.board.forEach(function (row) {
        row.forEach(function (cell) {
          if (!cell.mine) {
            if (!cell.hidden) {
              totalSafe -= 1;
            }
            if (totalSafe === 0) {
              newBoard.winner = true;
            }

          }
        })
      })
    }
  }
}

class Cell {
  constructor(mine, row, col, board) {
    this.hidden = true
    this.mine = mine
    this.row = row
    this.col = col
    this.board = board
    this.mineTotal = 0
    this.visted = false
  }

  computeAdjacent() {
    if (this.mine) return;
    var total = 0
    for (var row = this.row - 1; row < this.row + 2; row++) {
      for (var col = this.col - 1; col < this.col + 2; col++) {
        if (row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length) {
          this.mineTotal += this.checkCell(row, col);
        }
      }
    }
  }

  checkCell(row, col) {
    return this.board[row][col].mine ? 1 : 0;
  }
  reveal() {
    if (this.mineTotal > 0) {
      this.hidden = false;
      newBoard.render()
      return
    }
    if (this.mine) {
      newBoard.loser = true;
      newBoard.hidden = false;
      newBoard.revealAll();
      newBoard.render()
      return;
    }
    if (this.mineTotal === 0) {
      for (var row = this.row - 1; row < this.row + 2; row++) {
        for (var col = this.col - 1; col < this.col + 2; col++) {
          var cell
          if (this.board[row] === undefined) {
            cell = false
          } else {
            cell = this.board[row][col]
          }
          if (cell) {
            if (cell.mineTotal > 0) {
              cell.hidden = false;
              cell.visted = true
            }
            if (cell.visted) {} else if (cell.mineTotal === 0) {
              cell.hidden = false
              cell.visted = true
              cell.reveal()
            }
          }
        }
      }
    }
    newBoard.render()
  }
}

function setDiff(diff) {
  switch (diff) {
    case "easy":
      newBoard = new Board(5, 5, 8)
      newBoard.render()
      break;
    case "medium":
      newBoard = new Board(20, 8, 13)
      newBoard.render()
      break;
    case "hard":
      newBoard = new Board(25, 9, 15)
      newBoard.render()
      break;
    default:
  }
}

function handleClick(evt) {
  var td = $(evt.target);
  var markFlag = evt.shiftKey;
  var row = parseInt($(this).attr('data-row'));
  var col = parseInt($(this).attr('data-col'));
  var cell = newBoard.board[row][col]
  cell.reveal()
}

function init() {
  setDiff('easy');
}
init()
