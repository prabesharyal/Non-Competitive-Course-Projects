const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let puzzle =
  "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
let solvedPuzzle =
  "568913724342687519197254386685479231219538467734162895926345178473891652851726943";
let invalidPuzzle =
  "a..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
let notSolvedPuzzle =
  "9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

suite("Functional Tests", () => {
  suite("POST request to /api/solve", function () {
    test("with valid puzzle string", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, solvedPuzzle);
          done();
        });
    });
    test("with missing puzzle string:", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });
    test("with invalid characters", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: invalidPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          console.log(res.body.error);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    test("with incorrect length", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle + ".." })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    test("with a puzzle that cannot be solved", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: notSolvedPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
    suite("POST request to /api/check", function () {
      test("puzzle placement with all fields", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle, coordinate: "A2", value: 6 })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, true);
            done();
          });
      });
      test("a puzzle placement with single placement conflict", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle, coordinate: "A2", value: 1 })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.length, 1);
            done();
          });
      });
      test("a puzzle placement with multiple placement conflicts", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle, coordinate: "A9", value: 2 })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.length, 2);
            done();
          });
      });
      test("a puzzle placement with  all placement conflicts", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle, coordinate: "A2", value: 9 })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.length, 3);
            done();
          });
      });
      test("a puzzle placement with missing required fields", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle, coordinate: "", value: 9 })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Required field(s) missing");
            done();
          });
      });
      test("a puzzle placement with invalid characters", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: invalidPuzzle, coordinate: "A2", value: 9 })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid characters in puzzle");
            done();
          });
      });
      test("a puzzle placement with incorrect length", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle: puzzle + "..", coordinate: "A2", value: 9 })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(
              res.body.error,
              "Expected puzzle to be 81 characters long"
            );
            done();
          });
      });
      test("a puzzle placement with invalid placement coordinate", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle, coordinate: "A10", value: 9 })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid coordinate");
            done();
          });
      });
      test("a puzzle placement with invalid placement value", function (done) {
        chai
          .request(server)
          .post("/api/check")
          .send({ puzzle, coordinate: "A1", value: 12 })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid value");
            done();
          });
      });
    });
  });
});


after(function() {
  chai.request(server)
    .get('/')
});