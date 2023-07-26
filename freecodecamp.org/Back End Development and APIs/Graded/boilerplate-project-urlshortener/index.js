require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory database to store URL mappings
const urlDatabase = [];
let currentShortUrl = 1;

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// API endpoint to create short URLs
app.post('/api/shorturl', function(req, res) {
  const { url } = req.body;
  if (!isValidUrl(url)) {
    res.json({ error: 'invalid url' });
  } else {
    const shortUrl = currentShortUrl++;
    urlDatabase.push({ original_url: url, short_url: shortUrl });
    res.json({ original_url: url, short_url: shortUrl });
  }
});

// API endpoint to handle URL redirection
app.get('/api/shorturl/:shortUrl', function(req, res) {
  const shortUrl = parseInt(req.params.shortUrl);
  const entry = urlDatabase.find(item => item.short_url === shortUrl);
  if (entry) {
    res.redirect(entry.original_url);
  } else {
    res.json({ error: 'short_url not found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// Helper function to validate URLs
function isValidUrl(url) {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}
