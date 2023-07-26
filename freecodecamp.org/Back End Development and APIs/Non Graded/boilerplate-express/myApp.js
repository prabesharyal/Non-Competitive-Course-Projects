
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

function requestLogger(req, res, next) {
  const method = req.method;
  const path = req.path;
  const ip = req.ip;

  console.log(`${method} ${path} - ${ip}`);
  next();
}

app.use(requestLogger);
app.use("/public", express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/", function(req, res) {
  absolutePath = __dirname + '/views/index.html';
  res.sendFile(absolutePath);
});

app.get("/json", function(req, res) {
  const casingRes = process.env['MESSAGE_STYLE'];
  var msg = "Hello json";
  msg = (casingRes && casingRes.toLowerCase() === 'uppercase') ? msg.toUpperCase() : msg;
  res.json({ "message": msg });
});

function currentTimeMiddleware(req, res, next) {
  req.time = new Date().toString();
  next();
}

app.get('/now', currentTimeMiddleware, function(req, res) {
  res.json({ time: req.time });
});

app.get("/:word/echo", (req, res) => {
  const { word } = req.params;
  res.json({
    echo: word
  });
});
app.route("/name")
  .get((req, res) => {
    const { first, last } = req.query;
    const fullName = `${first} ${last}`;
    res.json({ name: fullName });
  })
  .post((req, res) => {
    const { first, last } = req.body;
    const fullName = `${first} ${last}`;
    res.json({ name: fullName });
  });


module.exports = app;
