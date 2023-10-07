const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function scrapeAmazonSearchResults(searchQuery) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.amazon.com/s?k=${searchQuery}`);

    await page.waitForSelector('div[data-component-type="s-search-result"]');

    const htmlContent = await page.content();

    const $ = cheerio.load(htmlContent);

    const searchResultDivs = $('div[data-component-type="s-search-result"]');

    const results = [];

    searchResultDivs.each((index, element) => {
        const title = $(element).find('span.a-text-normal').text().trim();
        const price = $(element).find('span.a-price span.a-offscreen').text().trim();

        results.push({ title, price });
    });

    await browser.close();

    return results;
}







async function getResults(req,res){
    const searchQuery =  req.body.data
    console.log(searchQuery)
    const response = await scrapeAmazonSearchResults(searchQuery)
    res.json({results: response})
    

}


module.exports = {getResults,}