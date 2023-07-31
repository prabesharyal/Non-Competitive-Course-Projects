const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(require("chai-http"));

suite("Functional Tests", function () {
  test("Convert valid input", function (done) {
    chai
      .request(server)
      .get("/api/convert?input=10L")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.initNum, 10);
        assert.equal(res.body.initUnit, "L");
        assert.approximately(res.body.returnNum, 2.64172, 0.1);
        assert.equal(res.body.returnUnit, "gal");
        assert.equal(
          res.body.string,
          "10 liters converts to 2.64172 gallons"
        );
        done();
      });
  });

  test("Convert invalid input", function (done) {
    chai
      .request(server)
      .get("/api/convert?input=32g")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "invalid unit");
        done();
      });
  });

  test("Convert invalid number", function (done) {
    chai
      .request(server)
      .get("/api/convert?input=3/7.2/4kg")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "invalid number");
        done();
      });
  });

  test("Convert invalid number and unit", function (done) {
    chai
      .request(server)
      .get("/api/convert?input=3/7.2/4kilomegagram")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "invalid number and unit");
        done();
      });
  });

  test("Convert with no number", function (done) {
    chai
      .request(server)
      .get("/api/convert?input=kg")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.initNum, 1);
        assert.equal(res.body.initUnit, "kg");
        assert.approximately(res.body.returnNum, 2.20462, 0.1);
        assert.equal(res.body.returnUnit, "lbs");
        assert.equal(
          res.body.string,
          "1 kilograms converts to 2.20462 pounds"
        );
        done();
      });
  });
});
