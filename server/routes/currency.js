const express = require('express');
const router = express.Router();
const Controller = require('../controllers/CurrencyController');

/**
 {
     "default": 2,
     "map": {
         "1": {
             "id": 1,
             "iso_code": "USD",
             "currency": "United States dollar",
             "symbol": "$",
             "rates": {
                 "RON": 4.253,
                 "EUR": 0.9401,
                 "GBP": 0.8045
             }
         },
         "2": {
             "id": 2,
             "iso_code": "RON",
             "currency": "Romanian leu",
             "symbol": "lei",
             "rates": {
                 "EUR": 0.221,
                 "GBP": 0.1892,
                 "USD": 0.2351
             }
         },
         "3": {
             "id": 3,
             "iso_code": "EUR",
             "currency": "Euro",
             "symbol": "\u20ac",
             "rates": {
                 "RON": 4.5241,
                 "GBP": 0.8558,
                 "USD": 1.0637
             }
         },
         "4": {
             "id": 4,
             "iso_code": "GBP",
             "currency": "Pound sterling",
             "symbol": "\u00a3",
             "rates": {
                 "RON": 5.2864,
                 "EUR": 1.1685,
                 "USD": 1.243
             }
         }
     }
 };
 */

// todo change to currency/list
router.get('/', async(req, res) => {
    const update = req.query.update === 'true';

    res.json(await Controller.getList({update}));
});

module.exports = router;
