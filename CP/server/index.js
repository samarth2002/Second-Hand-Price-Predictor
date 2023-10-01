const express = require('express');
const app = express();
const { getHTML } = require('./getHTML/api');

app.use(express.json());

// Define a route that uses the getHTML function
app.get('/searchRes', async (req, res) => {
    try {
        const ulHtml = await getHTML();
        // Send the HTML response to the client
        res.send(ulHtml);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3001, () => console.log('SERVER STARTED'));
