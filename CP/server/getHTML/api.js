const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.olx.in/en-in/items/q-remote-control-helicopter';


function getHTML() {
    return axios.get(url)
        .then((response) => {
            const htmlContent = response.data;

            // Load the HTML content using cheerio
            const $ = cheerio.load(htmlContent);

            // Find the <ul> element with the specified class
            const itemList = $('ul._266Ly._10aCo');

            // Get the HTML code of the <ul> element
            const ulHtml = itemList.html();
            return ulHtml;
        })
        .catch((error) => {
            console.error('Error:', error);
            throw error; // Rethrow the error to be caught by the caller
        });
}

module.exports = {
    getHTML
}