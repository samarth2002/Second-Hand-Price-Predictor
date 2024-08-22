const express = require('express')
const ApiRouter = express.Router()
const scrapeRouter = require('./scrape/index')
const similarityRouter = require('./similarity/index')

ApiRouter.use('/scrape',scrapeRouter)
ApiRouter.use('/similarity', similarityRouter)



module.exports = ApiRouter
