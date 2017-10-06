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
    this.placeMines();
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
  placeMines() {
    while ( this.numMines > 0 ) {
    var x = Math.floor( Math.random()*this.width)
    var y = Math.floor( Math.random()*this.height)
    if ( this.board[x][y].mine === 'mine') {
    }else{
      this.board[x][y].mine = 'mine'
    }
    this.numMines -= 1 
    }

    //while more than 0 mines p
    //pick a random rwo 
    //pick a radom col 
    //try to place to place the min in that cell
    //if theres no mine place mine
      //minus one from numMines
    //else pick another cell 
  }
}

class Cell {
  constructor(mine) {
    this.hidden = true
    this.mine = mine
  }
}
