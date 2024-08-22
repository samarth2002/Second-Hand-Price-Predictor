const express = require('express')
const router = express.Router()
const { sendUrls } = require('./sendUrls/api')



router.post('/sendURls', sendUrls)


module.exports = router


