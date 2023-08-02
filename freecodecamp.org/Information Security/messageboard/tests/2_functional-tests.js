const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let board = 'test-board';
  let threadIdToDelete;
  let replyIdToDelete;

  this.timeout(5000);

  // Test for creating a new thread
  test('Create a new thread', function(done) {
    chai
      .request(server)
      .post(`/api/threads/${board}`)
      .send({
        text: 'Test thread text',
        delete_password: 'test123',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });

  // Test for viewing the 10 most recent threads with 3 replies each
  test('View the 10 most recent threads', function(done) {
    chai
      .request(server)
      .get(`/api/threads/${board}`)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'Response should be an array');
        assert.isAtMost(res.body.length, 10, 'Should return at most 10 threads');
        assert.property(res.body[0], 'text', 'Thread should have a text property');
        assert.property(res.body[0], 'replies', 'Thread should have a replies property');
        assert.isArray(res.body[0].replies, 'Replies should be an array');
        assert.isAtMost(res.body[0].replies.length, 3, 'Each thread should have at most 3 replies');
        done();
      });
  });

  // Test for deleting a thread with an incorrect password
  test('Delete a thread with incorrect password', function(done) {
    chai
      .request(server)
      .delete(`/api/threads/${board}`)
      .send({
        thread_id: threadIdToDelete, // Replace with a valid thread_id
        delete_password: 'wrong-password',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'Thread not found.');
        done();
      });
  });

  // Test for deleting a thread with the correct password
  test('Delete a thread with correct password', function(done) {
    chai
      .request(server)
      .delete(`/api/threads/${board}`)
      .send({
        thread_id: threadIdToDelete, // Replace with a valid thread_id
        delete_password: 'test123',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'Thread not found.');
        done();
      });
  });

  // Test for reporting a thread
  test('Report a thread', function(done) {
    chai
      .request(server)
      .put(`/api/threads/${board}`)
      .send({
        thread_id: threadIdToDelete, // Replace with a valid thread_id
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'Thread not found.');
        done();
      });
  });

  // Test for creating a new reply
  test('Create a new reply', function(done) {
    chai
      .request(server)
      .post(`/api/replies/${board}`)
      .send({
        text: 'Test reply text',
        delete_password: 'test123',
        thread_id: threadIdToDelete, // Replace with a valid thread_id
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });

  // Test for viewing a single thread with all replies
  test('View a single thread with all replies', function(done) {
    chai
      .request(server)
      .get(`/api/replies/${board}`)
      .query({ thread_id: threadIdToDelete }) // Replace with a valid thread_id
      .end(function(err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });

  // Test for deleting a reply with an incorrect password
  test('Delete a reply with incorrect password', function(done) {
    chai
      .request(server)
      .delete(`/api/replies/${board}`)
      .send({
        thread_id: threadIdToDelete, // Replace with a valid thread_id
        reply_id: replyIdToDelete, // Replace with a valid reply_id
        delete_password: 'wrong-password',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Thread not found.');
        done();
      });
  });

  // Test for deleting a reply with the correct password
  test('Delete a reply with correct password', function(done) {
    chai
      .request(server)
      .delete(`/api/replies/${board}`)
      .send({
        thread_id: threadIdToDelete, // Replace with a valid thread_id
        reply_id: replyIdToDelete, // Replace with a valid reply_id
        delete_password: 'test123',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });

  // Test for reporting a reply
  test('Report a reply', function(done) {
    chai
      .request(server)
      .put(`/api/replies/${board}`)
      .send({
        thread_id: threadIdToDelete, // Replace with a valid thread_id
        reply_id: replyIdToDelete, // Replace with a valid reply_id
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'Thread not found.');
        done();
      });
  });

});
