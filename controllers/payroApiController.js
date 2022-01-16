const axios = require('axios');
let express = require('express');
let router = express.Router();

const payroApiController = {

    async payment(req, res) {
        console.log('reqest payment : ' , req.body , req.headers , req.query)
        let value = JSON.stringify({
            "order_id": req.body.order_id,
            "amount": req.body.amount,
            "name": req.body.name,
            "phone": req.body.phone,
            "mail": req.body.mail,
            "desc": req.body.desc,
            "callback": "http://localhost:1377/confirm"
        });

        let config = {
            method: 'post',
            url: 'https://api-c.payro24.ir/v1.0/payment',
            headers: {
                'Content-Type': 'application/json',
                'P-TOKEN': process.env.P_TOKEN ,
                'P-SANDBOX': process.env.P_SANDBO
            },
            data: value
        };

        await axios(config)
            .then(response => {
                res.redirect(response.data.link);
            })
            .catch(error => {
                res.status('500')

            })


    },

    async verify(req, res) {
        console.log('reqest', req.body)
        let value = JSON.stringify({
            "order_id": req.body.order_id,
            "id" : req.body.id
        });

        let config = {
            method: 'post',
            url: 'https://api.payro24.ir/v1.0/payment/verify',
            headers: {
                'Content-Type': 'application/json',
                'P-TOKEN': process.env.P_TOKEN ,
                'P-SANDBOX': process.env.P_SANDBO
            },
            data: value
        };

        await axios(config)
            .then(response => {
                console.log('response verify : ' , response.data)
                res.render('confirm' , {data : response.data});
            })
            .catch(error => {
                console.log(error);

            })
    },



}

module.exports = payroApiController