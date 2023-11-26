// This file is not working



const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function scrapeOlxSearchResults(searchQuery) {
    const browser = await puppeteer.launch({
        args: ['--disable-http2'],
    });
    const page = await browser.newPage();
    page.on('load', () => {
        console.log('Page loaded successfully.');
    });

    page.on('load', () => {
        console.log('Page loading failed.');
    });
    await page.goto(`https://www.olx.in/q-${searchQuery}`, {
        waitUntil: 'domcontentloaded',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
    });
    

    await page.waitForSelector('li[data-aut-id="itemBox"]');

    const htmlContent = await page.content();

    const $ = cheerio.load(htmlContent);
    console.log($)
    const searchResultDivs = $('li[data-aut-id="itemBox"]');

    const results = [];

    searchResultDivs.each((index, element) => {
        const title = $(element).find('span._2poNJ').text().trim()

        const price = $(element).find('span._2Ks63').text().trim();
        const image = $(element).find('img._2hBzJ').attr('src'); 

        results.push({ title, price, image });
    });

    await browser.close();

    return results;
}

async function getResultsOlx(req, res) {
    console.log(req.body)
    const searchQuery = req.body.data;
    console.log(searchQuery);
    const response = await scrapeOlxSearchResults(searchQuery);
    res.json({ results: response });
}

module.exports = { getResultsOlx };
