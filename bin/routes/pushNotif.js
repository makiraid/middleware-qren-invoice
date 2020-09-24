const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const config = require('../utils/configAuth');
const db = require('../utils/postgres')

router.post('/pushNotif', async (req, res, next) => {
    const body = req.body;

    const update = db.updateOne(body)

    console.log(update)
});

module.exports = router;