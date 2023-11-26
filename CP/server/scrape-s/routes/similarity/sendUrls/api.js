const axios = require('axios')

async function sendUrls(req, res) {
    const urlArray = req.body.data
    console.log("DATAAAAA")
    console.log(urlArray)
    try {
        const response = await axios.post('http://127.0.0.1:8000/similarity_finder', { url_array: urlArray })
        console.log(response.data)
        const indexes = response.data.indexes
      

        res.json({
            data: indexes, // Sending only the 'data' part of the response
            status: response.status // Sending the status of the response
            // You can include other required properties similarly
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    sendUrls,
}
