"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    const rows = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
    };

    const coords = coordinate && coordinate.split(/(\d+)/);
    console.log(coords);

    let row;
    let col;
    if (coords) {
      row = rows[coords[0]];
      col = parseInt(coords[1]) - 1;
    }

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    if (/[^0-9.]+/g.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    if (!solver.validate(puzzle)) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    if (row === undefined || isNaN(col) || col < 0 || col > 8) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (value < 1 || value > 9 || isNaN(value)) {
      return res.json({ error: "Invalid value" });
    }

    if (solver.isAlreadyPlaced(puzzle, row, col, value)) {
      return res.json({ valid: true });
    }

    let conflict = [];

    if (!solver.checkRowPlacement(puzzle, row, col, value)) {
      conflict.push("row");
    }
    if (!solver.checkColPlacement(puzzle, row, col, value)) {
      conflict.push("column");
    }
    if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
      conflict.push("region");
    }

    if (
      solver.checkRowPlacement(puzzle, row, col, value) &&
      solver.checkColPlacement(puzzle, row, col, value) &&
      solver.checkRegionPlacement(puzzle, row, col, value)
    ) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false, conflict });
    }
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    if (/[^0-9.]+/g.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    if (!solver.validate(puzzle)) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    const solution = solver.solve(puzzle);

    if (!solution) {
      res.json({ error: "Puzzle cannot be solved" });
    } else {
      res.json({ solution });
    }
  });
};