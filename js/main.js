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
    this.generateBoard();
    this.placeMines();
    console.log('b')
  }
  
  setNumMines(numMines) {
    if ( numMines > (this.width * this.height)) {
      this.numMines = this.width * this.height
    }else{
      this.numMines = numMines;
    }
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
    
    while (this.numMines > 0) {
      var x = Math.floor(Math.random() * this.width)
      var y = Math.floor(Math.random() * this.height)
      if (this.board[x][y].mine === false) {
        console.log('placing mine at x =', x, 'y =', y)
        this.board[x][y].mine = true
        this.numMines -= 1
      }
      console.log('numMines = ', this.numMines)
      console.log('moving on -------------------')
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
