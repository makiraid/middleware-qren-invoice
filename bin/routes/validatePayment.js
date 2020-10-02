const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const config = require('../utils/configAuth');
const db = require('../utils/postgres')


router.get('/payment', db.doShow);
router.post('/createPayment', db.doCreate);
router.post('/notifPayment', db.doUpdate);





module.exports = router;