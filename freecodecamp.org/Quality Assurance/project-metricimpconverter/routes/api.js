'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  app.route('/api/convert').get(function (req, res) {
    // input 
    let input = req.query.input;

    // /convert
    let initNum = convertHandler.getNum(input);
    let initUnit = convertHandler.getUnit(input);

    // validation
    if (!initNum && !initUnit) {
      res.send("invalid number and unit");
    }
    else if (!initNum) {
      res.send("invalid number");
    }
    else if (!initUnit){
      res.send("invalid unit");
    }
     else {
      // Output 
      let returnNum = convertHandler.convert(initNum, initUnit);
      let returnUnit = convertHandler.getReturnUnit(initUnit);

      let gotSomething = convertHandler.getString(
        initNum,
        initUnit,
        returnNum,
        returnUnit
      );

      res.json({
        initNum,
        initUnit,
        returnNum,
        returnUnit,
        string: gotSomething,
      });
    }
  });
};
