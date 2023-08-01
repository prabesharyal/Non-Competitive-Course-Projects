const chai = require("chai");
const assert = chai.assert;
const ConvertHandler = require("../controllers/convertHandler.js");

suite("Unit Tests", function () {
  this.timeout(2000);
  const convertHandler = new ConvertHandler();

  test("Whole number input", function () {
    assert.equal(convertHandler.getNum("10gal"), 10);
  });

  test("Decimal number input", function () {
    assert.equal(convertHandler.getNum("3.5km"), 3.5);
  });

  test("Fractional input", function () {
    assert.equal(convertHandler.getNum("1/2mi"), 0.5);
  });

  test("Fractional input with a decimal", function () {
    assert.equal(convertHandler.getNum("5.4/3lbs"), 1.8);
  });

  test("Default to numerical input of 1", function () {
    assert.equal(convertHandler.getNum("gal"), 1);
  });

  test("Valid input unit", function () {
    assert.equal(convertHandler.getUnit("km"), "km");
  });

  test("Invalid input unit", function () {
    assert.isUndefined(convertHandler.getUnit("invalidUnit"));
  });

  test("Return unit for valid input unit", function () {
    assert.equal(convertHandler.getReturnUnit("km"), "mi");
  });

  test("Spelled-out string unit for valid input unit", function () {
    assert.equal(convertHandler.spellOutUnit("mi"), "miles");
  });

  test("Convert gal to L", function () {
    assert.equal(convertHandler.convert(1, "gal"), 3.78541);
  });

  test("Convert L to gal", function () {
    assert.equal(convertHandler.convert(5, "L"), 1.32086);
  });

  test("Convert mi to km", function () {
    assert.equal(convertHandler.convert(1, "mi"), 1.60934);
  });

  test("Convert km to mi", function () {
    assert.equal(convertHandler.convert(1.60934, "km"), 1);
  });

  test("Convert lbs to kg", function () {
    assert.equal(convertHandler.convert(1, "lbs"), 0.45359);
  });

  test("Double-fraction input", function () {
    assert.isUndefined(convertHandler.getNum("3/2/3gal"));
  });

  test("Convert kg to lbs", function () {
    assert.equal(convertHandler.convert(0.453592, "kg"), 1);
  });
});
