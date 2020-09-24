const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const config = require('../utils/configAuth');
const toString = require('../utils/toString');

const middlewareInvoice = (params) => new Promise((resolve, reject) => {
  const cfg = config.get('/qren');
  fetch(`${cfg.base_url}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${cfg.basic}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params),
    redirect: 'follow'
  })
  .then(async response => {
    const result = response.json();
    resolve(result)
  })
  .catch(error => reject(error))
});

router.post('/createInvoice', async (req, res, next) => {
  const { merchantApiKey, nominal, nama } = req.body;

  const params = {
    'merchantApiKey': merchantApiKey,
    'nominal': toString(nominal),
    'staticQR': '0',
    'mdrId': '',
    'surchargeId': '',
    'invoiceName': nama,
    'qrGaruda': '1'
  }

  const result = await middlewareInvoice(params)

  if (result.resultCode == 0) {
    res.status(200).send({
      statusCode: '00',
      statusDesc: 'success',
      data: {
        invoiceId: result.invoiceId,
        qrContent: result.content,
        nmid: result.nmid
      },
      timeStamp: result.timeStamp,
      expiredDate: result.expiredDate,
      error: false
    })
  } else {
    res.status(400).send({
      statusCode: '02',
      statusDesc: 'failed',
      messages: 'Mohon maaf, sistem sedang dalam perbaikan silahkan coba beberapa saat lagi',
      error: true
    })
  }
});

module.exports = router;