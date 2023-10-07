const express = require('express')
const router = express.Router()
const { getResults } = require('./getResults/api')





router.post('/getResults', getResults)

module.exports = router