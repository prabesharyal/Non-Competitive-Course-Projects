// functional-tests.js
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
    this.timeout(5000);
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let bookId;

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Book object should contain title');
            assert.property(res.body, '_id', 'Book object should contain _id');
            bookId = res.body._id; // Store the bookId for further tests
            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({}) // Sending an empty object to simulate no title given
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title', 'Response should indicate missing title field');
            done();
          });
      });

    });

    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            done();
          });
      });

    });

    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/harciyaxidir') // Replace 'invalid-id' with a non-existing book id
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'Response should indicate book not found');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${bookId}`) // Use the previously stored bookId
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Book object should contain title');
            assert.property(res.body, '_id', 'Book object should contain _id');
            done();
          });
      });

    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        const comment = 'This is a test comment';
        chai.request(server)
          .post(`/api/books/${bookId}`) // Use the previously stored bookId
          .send({ comment })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Book object should contain title');
            assert.property(res.body, '_id', 'Book object should contain _id');
            assert.property(res.body, 'comments', 'Book object should contain comments');
            assert.isArray(res.body.comments, 'comments should be an array');
            assert.include(res.body.comments, comment, 'comments should include the test comment');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post(`/api/books/${bookId}`) // Use the previously stored bookId
          .send({}) // Sending an empty object to simulate no comment field
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment', 'Response should indicate missing comment field');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const comment = 'This is a test comment';
        chai.request(server)
          .post('/api/books/invalid-id') // Replace 'invalid-id' with a non-existing book id
          .send({ comment })
          .end(function(err, res) {
            assert.equal(res.status, 500);
            assert.equal(res.text, 'no book exists', 'Response should indicate book not found');
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${bookId}`) // Use the previously stored bookId
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful', 'Response should indicate successful deletion');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        chai.request(server)
          .delete('/api/books/invalid-id') // Replace 'invalid-id' with a non-existing book id
          .end(function(err, res) {
            assert.equal(res.status, 500);
            assert.equal(res.text, 'no book exists', 'Response should indicate book not found');
            done();
          });
      });

    });

  });

});

after(function() {
  chai.request(server)
    .get('/')
  });
