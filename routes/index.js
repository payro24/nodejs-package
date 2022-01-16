const express = require('express')
const router = express.Router()

let mainRouter = require('./main.router');
let payroApiRouter = require('./payroApi.router');


router.use('/', mainRouter);
router.use('/payroapi', payroApiRouter)

module.exports = router