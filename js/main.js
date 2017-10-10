/*----- constants -----*/



/*----- app's state (variables) -----*/




/*----- cached element references -----*/
$gameBoard = $('#gameBoard')
$msg = $('.message')



/*----- event listeners -----*/




/*----- functions -----*/
class Board {
  constructor(numMines, width, height) {
    console.log('a')
    this.width = width;
    this.height = height;
    this.setNumMines(numMines)
    this.generateBoard()
    this.placeMines()
    this.placeNums()
    console.log('b')
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
      for (var col = 0; col < this.height; col++) {
        board[row][col] = new Cell(false, row, col, board);
      }
    }
    this.board = board
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
}

class Cell {
  constructor(mine, row, col, board) {
    this.hidden = true
    this.mine = mine
    this.row = row
    this.col = col
    this.board = board
    this.mineTotal = 0;
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
}

// function handleClick() {

// }
