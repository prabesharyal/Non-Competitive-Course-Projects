const express = require('express');
const bodyParser = require('body-parser');
const Book = require('../databse_handler');

const router = express.Router();
router.use(bodyParser.json());

// GET /api/books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find({}, '_id title comments');
    const response = books.map(book => ({
      _id: book._id,
      title: book.title,
      commentcount: book.comments.length,
    }));
    res.json(response);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// POST /api/books
router.post('/books', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(200).send('missing required field title');
    }
    const book = new Book({ title });
    await book.save();
    res.json({ _id: book._id, title: book.title });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// DELETE /api/books
router.delete('/books', async (req, res) => {
  try {
    await Book.deleteMany({});
    res.send('complete delete successful');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// GET /api/books/:id
router.get('/books/:id', async (req, res) => {
  let bookid = req.params.id;
  //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
  try {
    const data = await Book.findById(bookid);
    if (!data) {
      res.send("no book exists");
    } else {
      res.json({
        comments: data.comments,
        _id: data._id,
        title: data.title,
        commentcount: data.comments.length,
      });
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// POST /api/books/:id
// POST /api/books/:id
router.post('/books/:id', async (req, res) => {
  try {
    let bookid = req.params.id;
    let comment = req.body.comment;
    if (!comment) {
      res.send('missing required field comment');
      return;
    }

    // Find the book by ID
    const bookdata = await Book.findById(bookid);
    if (!bookdata) {
      res.send('no book exists');
      return;
    }

    // Add the comment to the book data
    bookdata.comments.push(comment);

    // Save the updated book data
    const saveData = await bookdata.save();

    // Send the response in JSON format
    res.json({
      comments: saveData.comments,
      _id: saveData._id,
      title: saveData.title,
      commentcount: saveData.comments.length,
    });
  } catch (error) {
    res.status(500).send('no book exists');
  }
});

// DELETE /api/books/:id
router.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.send('no book exists');
    }
    res.send('delete successful');
  } catch (error) {
    res.status(500).send('no book exists');
  }
});



module.exports = router;
