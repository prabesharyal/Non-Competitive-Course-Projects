require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

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
    useDefaults: true,
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
 // Only allow your site to send the referrer for your own pages
app.use(helmet({
  referrerPolicy: {
    policy: 'same-origin'
  }
}));

// ---------------------------------------------------------------- //
// *********************** Jay Shree Ram  **************************//
// ---------------------------------------------------------------- //

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});




app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
