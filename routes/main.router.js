let express = require('express');
let router = express.Router();
let payroApiController = require('../controllers/payroApiController')


router.get('/', (req, res) => {
  let data = {
    "order_id": 143,
    "amount": 25000,
    "name": "توحید",
    "phone": "09130097803",
    "mail": "info@test.com",
    "desc": "توضیحات پرداخت کننده",
  }
  res.render('profile' , {data : data});
})

router.post('/confirm',payroApiController.verify )
// res.render('confirm' , {data : req.body});
module.exports = router;
