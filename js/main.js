/*----- constants -----*/

var newBoard;

/*----- app's state (variables) -----*/
var showInstructions = true;




/*----- cached element references -----*/
$gameBoard = $('#gameBoard')
$container = $('.container')
$diff = $('.difficulty-btn ')
$bgCheckbox = $('input[type="checkbox"]');
$instructions = $('#instructions')
$instructionsBtn = $('.instructions-btn')
/*----- event listeners -----*/

$diff.on('click', function (evt) {
  showInstructions = false;
  var td = $(evt.target);
  var className = td.attr('class')
  setDiff(className);
  hideAliens();
});

$instructionsBtn.on('click', function () {
  showInstructions = !showInstructions;
  renderInstructions()
})

$gameBoard.on('click', 'td', handleClick)

$bgCheckbox.on('change', checkBoxSound)




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
    renderInstructions();
    this.checkWinner()
    if (this.winner) {
      playSound()
      $gameBoard.toggleClass("gameBoardWin");
      setTimeout(function () {
        $gameBoard.toggleClass("gameBoardWin");
      }, 5000);
    }
    this.board.forEach(function (row) {
      row.forEach(function (cell) {
        var $td = $(`td[data-row="${cell.row}"][data-col="${cell.col}"]`);
        if (cell.hidden) {
          $td.html('');
        } else if (cell.mine) {
          $td.addClass('alien');
        } else if (cell.mineTotal === 0) {
          $td.html("-")
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
    playSound()
    $gameBoard.toggleClass("gameBoardLose");
    $('td').removeClass("flag")
    newBoard.render()
    setTimeout(function () {
      $gameBoard.toggleClass("gameBoardLose");
    }, 2148);
    showAliens()
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
    case "difficulty-btn easy":
      $gameBoard.fadeOut()
      setTimeout(function () {
        newBoard = new Board(5, 5, 8)
        newBoard.render()
      }, 275);
      break;
    case "difficulty-btn medium":
      $gameBoard.fadeOut()
      setTimeout(function () {
        newBoard = new Board(20, 8, 13)
        newBoard.render()
      }, 275);
      showInstructions = false;
      break;
    case "difficulty-btn hard":
      $gameBoard.fadeOut()
      setTimeout(function () {
        newBoard = new Board(25, 9, 15)
        showInstructions = false;
      }, 275);
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

  if (markFlag) {
    td.toggleClass('flag')
  } else {
    cell.reveal()
  }
}

function checkBoxSound() {
  var backgroundSound = $('#x-background')
  $bgCheckbox.is(':checked') ? backgroundSound[0].pause() : backgroundSound[0].play();
}

function playSound() {
  var loseSound = $('#explosion')[0];
  var winSound = $('#winSound')[0];
  if (newBoard.loser) {
    loseSound.play()
  }
  if (newBoard.winner) {
    winSound.play()
  }
}

function showAliens() {
  $('.leftAlien').fadeIn();
  $('.rightAlien').fadeIn();
}

function hideAliens() {
  $('.leftAlien').fadeOut();
  $('.rightAlien').fadeOut();
}

function renderInstructions() {
  if (showInstructions === true) {
    $gameBoard.fadeOut();
    setTimeout(function () {
      $instructions.fadeIn()
    }, 300);
  } else if (showInstructions === false) {
    $instructions.fadeOut()
    setTimeout(function () {
      $gameBoard.fadeIn()
    }, 300);
  }
}

function init() {
  setDiff('difficulty-btn easy');
  showInstructions = true;
  renderInstructions();

}
init()
