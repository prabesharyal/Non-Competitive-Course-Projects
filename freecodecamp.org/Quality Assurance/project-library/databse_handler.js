// database_handler.js
const mongoose = require('mongoose');

// Replace 'DB' with your actual environment variable holding the MongoDB URI
const mongoURI = process.env.DB;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Remove the useFindAndModify option
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [String],
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
