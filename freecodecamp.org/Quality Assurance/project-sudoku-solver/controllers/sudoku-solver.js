class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return false;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.str2Grid(puzzleString);
    for (let x = 0; x <= 8; x++) if (grid[row][x] == value) return false;
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.str2Grid(puzzleString);
    for (let x = 0; x <= 8; x++) if (grid[x][column] == value) return false;
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = this.str2Grid(puzzleString);

    let startRow = row - (row % 3),
      startCol = column - (column % 3);

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == value) return false;
    return true;
  }

  isAlreadyPlaced(puzzleString, row, col, value) {
    let grid = this.str2Grid(puzzleString);

    if (grid[row][col] == value) {
      if (
        !this.checkRowPlacement(puzzleString, row, col, value) &&
        !this.checkColPlacement(puzzleString, row, col, value) &&
        !this.checkRegionPlacement(puzzleString, row, col, value)
      ) {
        return true;
      }
    }
  }

  solveSudoku(grid, row, col) {
    if (row == 9 - 1 && col == 9) return grid;

    if (col == 9) {
      row++;
      col = 0;
    }

    if (grid[row][col] != 0) return this.solveSudoku(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        if (this.solveSudoku(grid, row, col + 1)) return grid;
      }
      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {
    for (let x = 0; x <= 8; x++) if (grid[row][x] == num) return false;

    for (let x = 0; x <= 8; x++) if (grid[x][col] == num) return false;

    let startRow = row - (row % 3),
      startCol = col - (col % 3);

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == num) return false;

    return true;
  }

  str2Grid(puzzle) {
    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    let row = -1;
    let col = 0;

    for (let i = 0; i < puzzle.length; i++) {
      if (i % 9 === 0) {
        row++;
      }

      if (col % 9 === 0) {
        col = 0;
      }

      grid[row][col] = puzzle[i] === "." ? 0 : +puzzle[i];

      col++;
    }
    return grid;
  }

  grid2Str(grid) {
    return grid.flat().join("");
  }

  solve(puzzleString) {
    let grid = this.str2Grid(puzzleString);
    let solvedGrid = this.solveSudoku(grid, 0, 0);
    if (!solvedGrid) {
      return false;
    }
    let solvedString = this.grid2Str(solvedGrid);
    return solvedString;
  }
}

module.exports = SudokuSolver;