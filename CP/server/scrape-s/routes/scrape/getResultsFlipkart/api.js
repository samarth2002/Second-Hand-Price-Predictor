const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function scrapeFlipkartSearchResults(searchQuery) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.flipkart.com/search?q=${searchQuery}`);

    await page.waitForSelector('div[class="_13oc-S"]');

    const htmlContent = await page.content();

    const $ = cheerio.load(htmlContent);

    const searchResultDivs = $('div[class="_13oc-S"]');

    const results = [];

    searchResultDivs.each((index, element) => {
        const title = $(element).find('a.s1Q9rs').attr('title')

        const price = $(element).find('div._30jeq3').text().trim();
        const image = $(element).find('img._396cs4').attr('src'); 

        results.push({ title, price, image });
    });

    await browser.close();

    return results;
}

async function getResultsFlipkart(req, res) {
    console.log(req.body)
    const searchQuery = req.body.data;
    console.log(searchQuery);
    const response = await scrapeFlipkartSearchResults(searchQuery);
    res.json({ results: response });
}

module.exports = { getResultsFlipkart };
