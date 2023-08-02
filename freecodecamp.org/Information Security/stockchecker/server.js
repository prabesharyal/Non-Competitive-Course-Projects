'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();



// ---------------------------------------------------------------- //
//            All  master Security Settings - Prabesh
// ---------------------------------------------------------------- //
const helmet = require('helmet'); // Import the helmet middleware for security features
// Use helmet middleware
app.use(helmet());
// Use helmet middleware to hide the "X-Powered-By" header
app.use(helmet.hidePoweredBy());
// Use helmet middleware to prevent clickjacking
app.use(helmet.frameguard());
// Use helmet middleware to prevent cross-site scripting (XSS) attacks
app.use(helmet.xssFilter());
// Use helmet middleware to prevent MIME type inference
app.use(helmet.noSniff());
// Use helmet middleware to prevent IE from opening untrusted HTML
app.use(helmet.ieNoOpen());
// Use helmet middleware to ask browsers to access your site via HTTPS only
app.use(helmet.hsts());
// Use helmet middleware to disable DNS prefetching
app.use(helmet.dnsPrefetchControl());
// Use helmet middleware to disable client-side caching
app.use(helmet.noCache());
// Use helmet middleware to set a Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'trusted-cdn.com'],
      styleSrc: ["'self'", 'fonts.googleapis.com', "'unsafe-inline'"],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'trusted-cdn.com', 'data:'],
      sandbox: ['allow-forms', 'allow-scripts'],
      reportUri: '/report-violation',
    },
  })
);
// ---------------------------------------------------------------- //
// *********************** Jay Shree Ram  **************************//
// ---------------------------------------------------------------- //


app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); // For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize MongoDB connection
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB database!');
});

// Index page (static HTML)
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// For FCC testing purposes
fccTestingRoutes(app);

// Routing for API
apiRoutes(app); // Delegate API handling to api.js

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type('text').send('Not Found');
});

// Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; // for testing
