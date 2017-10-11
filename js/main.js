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
$diff.on('click', function () {
  setDiff($(this).attr('class'));
});

$gameBoard.on('click', handleClick)




/*----- functions -----*/
class Board {
  constructor(numMines, width, height) {
    this.board;
    this.width = width;
    this.height = height;
    this.setNumMines(numMines)
    this.generateBoard()
    this.placeMines()
    this.placeNums()
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
    for (var row = 0; row < this.width; row++) {
      board[row] = new Array()
      $container.append(`<tr class="row${row}"></tr>`)
      for (var col = 0; col < this.height; col++) {
        board[row][col] = new Cell(false, row, col, board);
        $(`.row${row}`).append(`<td class="col${row}${col}"></td>`)
      }
    }
    this.board = board
  }

  render() {
    for (var row = 0; row < this.width; row++) {
      for (var col = 0; col < this.height; col++) {
        var cell = this.board[row][col];
        var $td = $(`.col${row}${col}`);
        if (cell.hidden) {
          $td.html('h');
        } else if (cell.mine) {
          $td.html('m');
        } else {
          $td.html(cell.mineTotal);
        }
      }
    }
  }

  revealAll() {
    this.board.forEach(function (row) {
      row.forEach(function (cell) {
        cell.hidden = false;
      })
    })
    newBoard.render()
  }

  placeMines() {
    while (this.numMines > 0) {
      var x = Math.floor(Math.random() * this.width)
      var y = Math.floor(Math.random() * this.height)
      if (this.board[x][y].mine === false) {
        this.board[x][y].mine = true
        this.numMines -= 1
        console.log(this.board)
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
    if(this.mine) {
      newBoard.win = false;
      newBoard.hidden = false;
      newBoard.revealAll();
      newBoard.render()
      return;
    }
    console.log(this)
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
            }if (cell.visted) {
          }else if (cell.mineTotal === 0) {
              cell.hidden = false
              cell.visted = true
              cell.reveal()
            }
          }
  
          //       if (this.board[row][col].mineTotal > 0) {
          //         this.board[row][col].hidden = false
          //         break;
          //       }
          //       if (this.board[row][col].mine) {
          //         break;
          // }
        }
      }
    }
    newBoard.render()
  }
}

function setDiff(diff) {
  //init() <-- clear old board
  switch (diff) {
    case "easy":
      newBoard = new Board(5, 5, 8)
      newBoard.render()
      break;
    case "medium":
      newBoard = new Board(40, 8, 11)
      newBoard.render()
      break;
    case "hard":
      newBoard = new Board(99, 11, 14)
      newBoard.render()
      break;
    default:
      newBoard = new Board(10, 5, 8)
      newBoard.render()
  }
}

function handleClick(evt) {
  var td = $(evt.target);
  var className = td.attr('class')
  var arr = className.match(/[0-9]/ig)
  if (!arr) return
  var row = arr[0];
  var col = arr[1];
  var cell = newBoard.board[row][col]
  cell.reveal()




  // console.log(td.attr('class'));

  // if (this.mine) {
  //   $msg.html(`The Aliens Have Won!`)
  //   revealAll()
  //   return
  // } else {
  //   this.reveal()
  // }
}

function init() {
  setDiff('easy');
}
init()
