const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {

    test('Translation with text and locale fields: POST request to /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate')
            .send({ text: 'This is my favorite player.', locale: 'american-to-british' })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'text');
                assert.property(res.body, 'translation');
                assert.equal(res.body.translation, 'This is my <span class="highlight">favourite</span> player.');
                done();
            })
    });
    test('Translation with text and invalid locale field: POST request to /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate')
            .send({ text: 'This is my favorite player.', locale: 'none' })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid value for locale field');
                done();
            })
    });
    test('Translation with missing text field: POST request to /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate')
            .send({ locale: 'american-to-british' })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            })
    });
    test('Translation with missing locale field: POST request to /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate')
            .send({ text: 'I do not know what I am doing right now.' })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            })
    });
    test('Translation with empty text: POST request to /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate')
            .send({ text: '', locale: 'american-to-british' })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'No text to translate');
                done();
            })
    });
    test('Translation with text that needs no translation: POST request to /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate')
            .send({ text: "It's all good.", locale: 'american-to-british' })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'text');
                assert.property(res.body, 'translation');
                assert.equal(res.body.translation, 'Everything looks good to me!');
                done();
            })
    });
});