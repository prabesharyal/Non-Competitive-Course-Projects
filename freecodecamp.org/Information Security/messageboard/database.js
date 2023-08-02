// database.js
const mongoose = require('mongoose');

// Get the database URI from the environment variable 'DB'
const dbURI = process.env.DB;

// Connect to the database
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Listen for successful connection
mongoose.connection.on('connected', () => {
  console.log('Connected to the database.');
});

// Listen for connection error
mongoose.connection.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Listen for disconnection event
mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from the database.');
});

// Close the connection when the Node process ends
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Database connection closed due to application termination.');
    process.exit(0);
  });
});
