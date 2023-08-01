'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  const translator = new Translator();
  const lang = {
    'american-to-british': 'am',
    'british-to-american': 'br'
  }

  app.route('/api/translate')
    .post((req, res) => {
      const text = req.body.text;
      const locale = req.body.locale;
      if (text === '') {
        return res.json({ error: 'No text to translate' });
      }
      else if (!text || !locale) {
        return res.json({ error: 'Required field(s) missing' })
      }
      if (!['american-to-british', 'british-to-american'].includes(locale)) {
        return res.json({ error: 'Invalid value for locale field' })
      }
      let translation = translator.translate(text, lang[locale]);
      if (translation == text) {
        return res.json({ text: text, translation: 'Everything looks good to me!' })
      }
      else {
        return res.json({ text: text, translation: translation });
      }
    });
};