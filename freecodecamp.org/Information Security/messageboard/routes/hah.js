const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const dbURI = process.env.DB; // Get the MongoDB URI from the environment variable 'DB'

// Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Thread schema
const threadSchema = new Schema({
  text: String,
  delete_password: String,
  created_on: { type: Date, default: Date.now },
  bumped_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
});

// Create Reply schema
const replySchema = new Schema({
  text: String,
  delete_password: String,
  created_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
});

const Thread = mongoose.model('Thread', threadSchema);
const Reply = mongoose.model('Reply', replySchema);

module.exports = function (app) {

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// POST a new thread
app.post('/api/threads/:board', async (req, res) => {
  const { text, delete_password } = req.body;
  const board = req.params.board;

  const newThread = new Thread({ text, delete_password });
  await newThread.save();

  res.redirect(`/b/${board}`);
});



// POST a new reply to a thread
app.post('/api/replies/:board', async (req, res) => {
  try {
    const { text, delete_password, thread_id } = req.body;
    const board = req.params.board;

    const thread = await Thread.findById(thread_id);
    if (!thread) {
      return res.send('Thread not found.');
    }

    const newReply = new Reply({
      text,
      delete_password,
      created_on: new Date(), // Set the created_on date for the reply
    });

    thread.replies.push(newReply);
    thread.bumped_on = new Date(); // Update the bumped_on date to the comment's date
    await thread.save();
    await newReply.save(); // Save the reply object separately

    res.redirect(`/b/${board}/${thread_id}`);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET the most recent 10 threads on a board with 3 replies for each
app.get('/api/threads/:board', async (req, res) => {
  try {
    const board = req.params.board;

    const threads = await Thread.find({}).sort({ bumped_on: 'desc' }).limit(10).populate({
      path: 'replies',
      select: '-reported -delete_password',
      options: { limit: 3, sort: { created_on: 'desc' } },
    });

    // Remove reported and delete_password fields from the threads
    threads.forEach((thread) => {
      thread.reported = undefined;
      thread.delete_password = undefined;
      thread.replies.forEach((reply) => {
        reply.reported = undefined;
        reply.delete_password = undefined;
      });
    });

    res.json(threads);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET a thread with all its replies
app.get('/api/replies/:board', async (req, res) => {
  try {
    const thread_id = req.query.thread_id;

    const thread = await Thread.findById(thread_id).populate('replies', '-reported -delete_password');
    if (!thread) {
      return res.send('Thread not found.');
    }

    // Remove reported and delete_password fields from the thread and its replies
    thread.reported = undefined;
    thread.delete_password = undefined;
    thread.replies.forEach((reply) => {
      reply.reported = undefined;
      reply.delete_password = undefined;
    });

    res.json(thread);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE a thread
app.delete('/api/threads/:board', async (req, res) => {
  try {
    const { thread_id, delete_password } = req.body;

    const thread = await Thread.findById(thread_id);
    if (!thread) {
      return res.send('Thread not found.');
    }

    if (thread.delete_password !== delete_password) {
      return res.send('incorrect password');
    }

    await Thread.findByIdAndDelete(thread_id);
    res.send('success');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE a reply
app.delete('/api/replies/:board', async (req, res) => {
  try {
    const { thread_id, reply_id, delete_password } = req.body;

    const thread = await Thread.findById(thread_id);
    if (!thread) {
      return res.send('Thread not found.');
    }

    const reply = thread.replies.find((reply) => reply._id.equals(reply_id));
    if (!reply) {
      return res.send('Reply not found.');
    }

    if (reply.delete_password !== delete_password) {
      return res.send('incorrect password');
    }

    reply.text = '[deleted]';
    await thread.save();
    res.send('success');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PUT request to report a thread
app.put('/api/threads/:board', async (req, res) => {
  try {
    const { thread_id } = req.body;

    const thread = await Thread.findByIdAndUpdate(thread_id, { reported: true });
    if (!thread) {
      return res.send('Thread not found.');
    }

    res.send('reported');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PUT request to report a reply
app.put('/api/replies/:board', async (req, res) => {
  try {
    const { thread_id, reply_id } = req.body;

    const thread = await Thread.findById(thread_id);
    if (!thread) {
      return res.send('Thread not found.');
    }

    const reply = thread.replies.find((reply) => reply._id.equals(reply_id));
    if (!reply) {
      return res.send('Reply not found.');
    }

    reply.reported = true;
    await thread.save();
    res.send('reported');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});






};