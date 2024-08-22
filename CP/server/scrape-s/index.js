
    const bodyParser = require('body-parser')
    const express = require('express')
    const cors = require('cors')
    const router = require('./routes')

    const app = express()

    app.use(bodyParser.json())
    app.use(cors())

    app.use('/apis',router)

    app.listen(3001, () => console.log('SERVER STARTED'));


    