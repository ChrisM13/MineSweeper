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
  }
  placeNums() {
    //foreach elem on the board and check surrounding if no mine 
      //heck up down left right (upleft) upright downleft downright
      // add 1 to number of for each mine 
   for ( var i = 0; i < this.width; i++) {
      for(var j = 0; i < this.height; i++) {
        if ( this.board[i][j].mine === true){
          this.board[i-1][j-1].num +=1
        }
      }
   }
  }
}
 
var i = 3
var j = 4
// console.log(checkRight(1, 2, , 5))

function checkRight(i, j, height, width) {
  if (i+1 >= height || j + 1 >= width) {
    console.log('do nothing, outside of board')
  } else {
    console.log('check board[i][j+1]')
  }
}

class Cell {
  constructor(mine) {
    this.hidden = true
    this.mine = mine
  }
}
