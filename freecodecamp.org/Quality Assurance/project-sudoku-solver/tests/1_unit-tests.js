const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  suite("Testing puzzle", function () {
    let puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    let solution =
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    test("valid puzzle string of 81 characters", function () {
      assert.equal(solver.solve(puzzle), solution);
    });
    test("puzzle string with invalid characters (not 1-9 or .)", function () {
      assert.notEqual(
        solver.solve(
          "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
        ),
        solution
      );
    });
    test("puzzle string that is not 81 characters in length", function () {
      assert.equal(
        solver.validate(
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.999"
        ),
        false
      );
    });
  });

  suite("Testing row", function () {
    let puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    test("valid row placement", function () {
      assert.equal(solver.checkRowPlacement(puzzle, 0, 0, 7), true);
    });
    test("invalid row placement", function () {
      assert.equal(solver.checkRowPlacement(puzzle, 0, 0, 9), false);
    });
  });

  suite("Testing column", function () {
    let puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    test("valid column placement", function () {
      assert.equal(solver.checkColPlacement(puzzle, 0, 0, 7), true);
    });
    test("invalid column placement", function () {
      assert.equal(solver.checkColPlacement(puzzle, 0, 0, 8), false);
    });
  });

  suite("Testing region", function () {
    let puzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    test("a valid region (3x3 grid) placement", function () {
      assert.equal(solver.checkRegionPlacement(puzzle, 0, 0, 7), true);
    });
    test("invalid region (3x3 grid) placement", function () {
      assert.equal(solver.checkRegionPlacement(puzzle, 0, 0, 5), false);
    });
  });

  suite("Testing solver", function () {
    let puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    let solution =
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    test("valid puzzle strings pass the solver", function () {
      assert.isOk(solver.solve(puzzle));
    });
    test("invalid puzzle strings fail the solver", function () {
      assert.notEqual(
        solver.solve(
          "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
        ),
        solution
      );
    });
    test("solver returns the expected solution for an incomplete puzzle", function () {
      assert.equal(solver.solve(puzzle), solution);
    });
  });
});