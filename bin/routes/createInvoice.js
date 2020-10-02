const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const config = require('../utils/configAuth');
const promise = require('bluebird');
const { reject } = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: promise
};

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

const middlewarePayment = (paramsLocal) => new Promise((resolve, reject) => {
  fetch('http://localhost:3000/api/v1/createpayment', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic YmtkbWF0YXJhbTpiYXNpYzEyMw==',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paramsLocal),
    redirect: 'follow'
  })
  .then(async response => {
    const result = response.json();
    resolve(result)
    
  })
  .catch(error => reject(error))
});

router.post('/createInvoice', async (req, res, next) => {
  const { merchantApiKey, nop, tahun, nama, spptharusbayar, pbbdenda, pbbadmingw, nominal,  } = req.body;

  const params = {
    'merchantApiKey': merchantApiKey,
    'nominal': nominal,
    'staticQR': '0',
    'mdrId': '',
    'surchargeId': '',
    'invoiceName': nama,
    'qrGaruda': '1'
  }

  const result = await middlewareInvoice(params)
  const invoiceId = result.invoiceId;

  const paramsLocal = {
    'nop':nop,
    'tahun':tahun,
    'namawp':nama,
    'sppt_harus_bayar':spptharusbayar,
    'pbb_denda':pbbdenda,
    'pbb_admin_gw':pbbadmingw,
    'pbb_total_bayar':nominal,
    'invoice':invoiceId,
    'status':'1',
    'message':'payment wait validation',
    'trxid':'',
    'tanggal_transaksi':result.timeStamp,
    'tanggal_expired':result.expiredDate
  }
  if (result.resultCode == 0) {
     const hasil = await middlewarePayment(paramsLocal)
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