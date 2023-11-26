const express = require('express')
const router = express.Router()
const { getResultsAmazon } = require('./getResultsAmazon/api')
const {getResultsFlipkart} = require('./getResultsFlipkart/api')
const { getResultsOlx } = require('./getResultsOlx/api')




router.post('/getResultsAmazon', getResultsAmazon)
router.post('/getResultsFlipkart', getResultsFlipkart)
// router.post('/getResultsOlx', getResultsOlx)


module.exports = router


