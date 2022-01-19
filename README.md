# nodejs-package
NodeJS sample code for payro24 payment api

<div dir="rtl">
:جهت استفاده از این پکیج شما باید بعد از دانلود پکیج بر روی سیستم خود ابتدا دستور زیر رو اجرا کنید
</div>

```bash
sudo npm install // برای نصب پکیج های مورد نیاز
```
‍‍‍‍‍‍‍‍<div dir="rtl">
:سپس برای اجرای پکیج دستور زیر را وارد کنید
</div>

```bash
npm run dev // اجرای پکیج
```

<div dir="rtl">
با اجرای دستور بالا صفحه مرورگر شما باز می شود و نمونه صفحه پرداخت نمایش داده می شود 
</div>


<div dir="rtl">
  
جهت کانفیگ اولیه به `nodejs-package` مراجعه کنید و فایل `.env` را باز کنید 
</div>

```env 
PORT=1377 // پورتی که میخواهید پکیج روی آن اجرا شود 
P_TOKEN= 'xxxx-xxxx-xxxx-xxxx'; // کلید دریافتی از سامانه پیرو
P_SANDBO="1" //حالت تست یا به اصطلاح سندباکس

```

<div dir="rtl">
  
توجه داشته باشید که در صورت فعال بودن حالت تست تمام عملیات به صورت آزمایشی انجام میشود . شما میتوانید بر حسب نیاز از این پکیج استفاده کنید .  اطلاعات کامل را میتوانید از راهنمای استفاده از سیستم پرداخت داخل پنل دریافت کنید .
</div>

<div dir="rtl">
  
 بعد از پر کردن اطلاعات داخل فرم صفحه پرداخت و زدن دکمه پرداخت API ایجاد تراکنش صدا زده میشود و اطلاعات به سمت سرور `payro` ارسال میشود .
</div>


<div dir="rtl">
  
 بعد از پر کردن اطلاعات داخل فرم صفحه پرداخت و زدن دکمه پرداخت API ایجاد تراکنش صدا زده میشود و اطلاعات به سمت سرور `payro` ارسال میشود . اطلاعاتی که باید در فرم ارسال کنید :
  
  ‍‍`order_id شماره سفارش پذیرنده (ضروری)`
  ‍`amount   (ضروری)مبلغ مورد نظر به ریال`
  `name نام پرداخت کننده`
  `phone 	تلفن همراه پرداخت کننده`
  `mail پست الکترونیک پرداخت کننده`
  `desc توضیح تراکنش`
  `callback آدرس بازگشت به سایت پذیرنده`
  `details اطلاعات تسویه اشتراکی`
</div>
<div dir="rtl">
  
  کد استفاده شده در نود جی اس برای نمایش صفحه پرداخت :
</div>


```bash

# '/routes/index.js'
const express = require('express')
const router = express.Router()

let mainRouter = require('./main.router');
router.use('/', mainRouter);

module.exports = router

# '/routes/main.router.js'
let express = require('express');// فرواخوانی Express 
let router = express.Router(); //فرواخوانی Router

router.get('/', (req, res) => {
  let data = { // تعریف مقادیر اولیه و پیشفرض برای ارسال به صفحه پرداخت
    "order_id": 143,
    "amount": 25000,
    "name": "توحید",
    "phone": "09130097803",
    "mail": "info@test.com",
    "desc": "توضیحات پرداخت کننده",
  }
  res.render('profile' , {data : data}); // باز کردن صفحه پرداخت و ارسال مقادیر پیشفرض به آن
})
```

<div dir="rtl">

  کد استفاده شده در نود جی اس برای ارسال درخواست : 
</div>

‍‍```bash

# '/routes/index.js'
let payroApiRouter = require('./payroApi.router');
router.use('/payroapi', payroApiRouter)

# '/routes/payroApi.router.js'
let express = require('express');
let router = express.Router();

let payroApiController = require('../controllers/payroApiController')//وارد کردن کنترلر برای انجام درخواست پرداخت

router.post('/payment', payroApiController.payment)//تعریف متد POST برای ارسال درخواست پرداخت

module.exports = router;

# '/controllers/payroApiController.js'
const axios = require('axios');
let express = require('express');

const payroApiController = {
//ایجاد درخواست پرداخت
    async payment(req, res) {
//دریافت اطلاعات پر شده در داخل فرم پرداخت       
        let value = JSON.stringify({
            "order_id": req.body.order_id,
            "amount": req.body.amount,
            "name": req.body.name,
            "phone": req.body.phone,
            "mail": req.body.mail,
            "desc": req.body.desc,
            "callback": "http://localhost:1377/confirm" //آدرس بازگشت به سایت 
        });
 //تعریف کانفیگ اطلاعات مورد نیاز برای ارسال به سرور
        let config = {
            method: 'post',// متد ارسالی
            url: 'https://api-c.payro24.ir/v1.0/payment',//آدرس ارسال درخواست
            // تعریف هدر برای ارسال درخواست به سمت سرور
            headers: {
                'Content-Type': 'application/json',
                'P-TOKEN': process.env.P_TOKEN ,//توکن یا رمز دریافت شده از سمت پنل پیرو که در داخل env تعذیف شده
                'P-SANDBOX': process.env.P_SANDBO//فعال یا غیر فعال کردن حالت آزمایشی که در داخل env تعریف شده
            },
            data: value //داده ای که باید به سمت سرور ارسال کنیم و در value مقدار دهی کردیم
        };
//ارسال درخواست با axios
        await axios(config)
            .then(response => {
                res.redirect(response.data.link);
            })
            .catch(error => {
                res.status('500')

            })


    },

}
module.exports = payroApiController
```
<div dir="rtl">

بعد از اسال درخواست شما به سمت سرور . وارد صفحه تاییذ پرداخت میشوید . بعد از اتمام کار در این صفحه شما به سمت آدرسی که در callback تعریف کرده اید منتقل میشوید . 
</div>

