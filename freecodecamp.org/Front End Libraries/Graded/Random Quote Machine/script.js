// script.js

// Function to fetch a random quote from the API
async function getRandomQuote() {
    const response = await fetch('./type.fit_api_quotes.json'); // Replace with your actual API URL
    const quotes = await response.json();
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
  
  // Function to generate a color, but with random luminosity
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    let luminance;
  
    do {
      color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
  
      // Calculate luminance of the color
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    } while (luminance < 128); // Keep generating until a bright color is obtained
  
    return color;
  }
  
  // Function to update the HTML with the quote text and author, and apply random colors
  function updateQuote(quote) {
    const textElement = document.getElementById('text');
    const authorElement = document.getElementById('author');
    const quoteBox = document.getElementById('quote-box');
    const twitterIcon = document.querySelector('#tweet-quote i');
  
    const newColor = getRandomColor();
    textElement.textContent = quote.text;
    authorElement.textContent = quote.author;
    quoteBox.style.borderColor = newColor;
    textElement.style.color = newColor;
    authorElement.style.color = newColor;
    twitterIcon.style.color = newColor;
  
    // Update Twitter button URL with the quote and author
    const tweetButton = document.getElementById('tweet-quote');
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `"${quote.text}" - ${quote.author}`
    )}`;
    tweetButton.setAttribute('href', twitterURL);
  }
  
  // Function to handle the click event of the "Get New Quote" button
  document.getElementById('new-quote').addEventListener('click', async () => {
    const quote = await getRandomQuote();
    updateQuote(quote);
  });
  
  // Fetch the first quote when the page loads and update the quote box
  window.addEventListener('load', async () => {
    const quote = await getRandomQuote();
    updateQuote(quote);
  });
  