/*----- constants -----*/





/*----- app's state (variables) -----*/




/*----- cached element references -----*/
$gameBoard = $('#gameBoard')
$msg = $('.message')



/*----- event listeners -----*/




/*----- functions -----*/
class Board {
  constructor(numMines, width, height) {
    this.numMines = numMines;
    this.width = width;
    this.height = height;
    this.generateBoard();
  }

  generateBoard() {
    const board = []
    for (var i = 0; i < this.width; i++) {
      board[i] = new Array()
      for (var j = 0; j < this.height; j++) {
        board[i][j] = new Cell(false);
      }
    }

    this.board = board
  }
}

class Cell {
  constructor(mine) {
    this.hidden = true
    this.mine = mine
  }
}
