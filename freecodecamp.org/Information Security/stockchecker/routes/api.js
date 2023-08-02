'use strict';
const mongoose = require('mongoose');
const crypto = require('crypto');
const axios = require('axios');

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  price: Number,
  likes: { type: Number, default: 0 },
  likedByIP: [String],
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = function (app) {
  app.route('/api/stock-prices').get(async function (req, res) {
    const { stock, like } = req.query;
    const stockData = Array.isArray(stock) ? stock : [stock];

    async function getStockData(symbol) {
      const apiUrl = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;

      try {
        const response = await axios.get(apiUrl);
        return {
          symbol: response.data.symbol,
          price: response.data.latestPrice,
        };
      } catch (error) {
        console.error(`Error fetching stock data for ${symbol}:`, error.message);
        return null;
      }
    }

    async function processStocks(stocks) {
      const promises = stocks.map(async (symbol) => {
        const stock = await getStockData(symbol);
        const likes = await getLikes(symbol);
        const likedByIP = like === 'true' ? await getLikedIPs(symbol) : null;
        return {
          stock: stock.symbol,
          price: stock.price,
          likes,
          likedByIP,
        };
      });
      return Promise.all(promises);
    }

    function getLikes(symbol) {
      return Stock.findOne({ symbol }).exec().then((data) => (data ? data.likes : 0));
    }

    function updateLikes(symbol, ip) {
      return Stock.findOneAndUpdate(
        { symbol },
        {
          $inc: { likes: 1 },
          $addToSet: { likedByIP: ip },
        },
        { upsert: true, new: true }
      ).exec();
    }

    function removeLike(symbol, ip) {
      return Stock.findOneAndUpdate(
        { symbol },
        {
          $inc: { likes: -1 },
          $pull: { likedByIP: ip },
        },
        { new: true }
      ).exec();
    }

    async function getAnonymizedIP(ip) {
      const hash = crypto.createHash('sha256').update(ip).digest('hex');
      return hash;
    }

    async function getLikedIPs(symbol) {
      const data = await Stock.findOne({ symbol }).exec();
      return data ? (data.likedByIP || []) : [];
    }

    if (stockData.length === 1) {
      const [stock] = await processStocks(stockData);
      res.json({ stockData: stock });
    } else {
      const stockResults = await processStocks(stockData);
      const rel_likes = stockResults.map((stock) => stock.likes - (stock.likedByIP ? stock.likedByIP.length : 0));
      stockResults.forEach((stock, index) => (stock.rel_likes = rel_likes[index]));
      if (stockData.length === 2) {
        // If viewing two stocks, return an array of stock data
        res.json({ stockData: stockResults });
      } else {
        // If viewing more than two stocks, return as object with stock names as keys
        const stocksObj = {};
        stockResults.forEach((stock) => {
          stocksObj[stock.stock] = stock;
        });
        res.json(stocksObj);
      }
    }

    if (like) {
      const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const anonymizedIP = await getAnonymizedIP(userIP); // Anonymize IP address using SHA-256 hash

      for (const symbol of stockData) {
        if (like === 'true') {
          await updateLikes(symbol, anonymizedIP);
        } else if (like === 'false') {
          await removeLike(symbol, anonymizedIP);
        }
      }
    }
  });
};
