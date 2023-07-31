function letsSplitBaby(input) {
  let number = input.match(/[.\d/]+/g) || ["1"];
  let string = input.replace(/[.\d/]+/g, "");
  return [number[0], string];
}

function isValidDivision(input) {
  let nums = input.split("/");
  if (nums.length > 2) {
    return false;
  }
  return nums;
}

function ConvertHandler() {
  this.getNum = function (input) {
    let result = letsSplitBaby(input)[0];
    let nums = isValidDivision(result);

    if (!nums) {
      return undefined;
    }

    let num1 = nums[0];
    let num2 = nums[1] || "1";

    result = parseFloat(num1) / parseFloat(num2);
    if (isNaN(num1) || isNaN(num2)) {
      return undefined;
    }

    return result;
  };

  this.getUnit = function (input) {
    const result = letsSplitBaby(input)[1].toLowerCase();

    const unitAbbreviations = {
      km: "km",
      gal: "gal",
      lbs: "lbs",
      mi: "mi",
      l: "L",
      kg: "kg",
    };

    return unitAbbreviations[result] || undefined;
  };

  this.getReturnUnit = function (initUnit) {
    const unitConversions = {
      km: "mi",
      mi: "km",
      gal: "L",
      L: "gal",
      lbs: "kg",
      kg: "lbs",
    };
    return unitConversions[initUnit];
  };

  this.spellOutUnit = function (unit) {
    let result;
    const unitSpellings = {
      km: "kilometers",
      gal: "gallons",
      lbs: "pounds",
      mi: "miles",
      L: "liters",
      kg: "kilograms",
    };
    result = unitSpellings[unit];
    return result;
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
  
    switch (initUnit) {
      case "km":
        result = initNum / miToKm;
        break;
      case "gal":
        result = initNum * galToL;
        break;
      case "lbs":
        result = initNum * lbsToKg;
        break;
      case "mi":
        result = initNum * miToKm;
        break;
      case "L":
        result = initNum / galToL;
        break;
      case "kg":
        result = initNum / lbsToKg;
        break;
      default:
        result = undefined;
    }
  
    return parseFloat(result.toFixed(5));
  };
  
  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    let result;
    result = `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
    return result;
  };
}

module.exports = ConvertHandler;
