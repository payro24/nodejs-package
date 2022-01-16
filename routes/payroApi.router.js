let express = require('express');
let router = express.Router();
let payroApiController = require('../controllers/payroApiController')

router.post('/payment', payroApiController.payment)


router.post('/verify', payroApiController.verify)

module.exports = router;