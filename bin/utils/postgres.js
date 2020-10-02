const express = require('express');
const { resolve, reject } = require('bluebird');
const promise = require('bluebird');
const { NotExtended } = require('http-errors');
const fetch = require('node-fetch');
const options = {
  // Initialization Options
  promiseLib: promise
}
const pgp = require('pg-promise')(options);
const connectionString = 'postgres://postgres:Elektro12@127.0.0.1:5432/pbbqrcode';
const db = pgp(connectionString)

function doShow(req, res, next) {
  db.any('select * from paymentqrcode')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL puppies'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function doCreate(req, res, next) {
  db.none('INSERT INTO paymentqrcode (nop, tahun, namawp, sppt_harus_bayar, pbb_denda, pbb_admin_gw, pbb_total_bayar, invoice, status, message, trxid, tanggal_transaksi, tanggal_expired)VALUES(${nop}, ${tahun}, ${namawp}, ${sppt_harus_bayar}, ${pbb_denda}, ${pbb_admin_gw}, ${pbb_total_bayar}, ${invoice}, ${status}, ${message}, ${trxid}, ${tanggal_transaksi}, ${tanggal_expired})', req.body)
    .then(function () {
      res.status(200).json({
        status: 'success',
        message: 'data berhasil ditambahkan'
      });
    })
    .catch(function (err) {
      return next(err);
    });

}

 async function doUpdate  (req, res, next) {
  const invoice = req.body.invoice;
   await db.multi('UPDATE paymentqrcode SET invoice=$1, status=$2, message=$3, trxid=$4 WHERE invoice=$5 RETURNING invoice, status, message, trxid',
    [req.body.invoice, req.body.status, req.body.message,
      req.body.trxid, invoice])
    .then(async function (data) {
      const result =  data[0];
      if(result[0]=== undefined){
        res.json({message:'invoiceId tidak ditemukan'})
      }else{
        res.status(200)
      .json({
        data: result[0]
      });

      const getInvoice = result[0].invoice;
       db.one('SELECT * FROM paymentqrcode WHERE invoice = $1', getInvoice)
       .then(async function(data){
          const dataWajibPajak ={
            'nop':data.nop,
            'sppt_tahun_pajak':data.tahun,
            'sppt_pbb_harus_dibayar':data.sppt_harus_bayar,
            'pbb_denda':data.pbb_denda,
            'pbb_admin_gw':data.pbb_admin_gw,
            'pbb_total_bayar':data.pbb_total_bayar,
            'update_by':'SULAS'
          }
          if(res.statusCode == 200 && result[0].status == 0)
          {         
                   return fetch('https://bkd.sangat.top/ws_pbb_mtr/index.php/update/pbbm21',{
                      method:'POST',
                      headers: {
                         "Content-Type": "application/x-www-form-urlencoded",
                      },
                      body:new URLSearchParams({
                        'nop':dataWajibPajak.nop,
                        'sppt_tahun_pajak':dataWajibPajak.sppt_tahun_pajak,
                        'sppt_pbb_harus_dibayar':dataWajibPajak.sppt_pbb_harus_dibayar,
                        'pbb_denda':dataWajibPajak.pbb_denda,
                        'pbb_admin_gw':dataWajibPajak.pbb_admin_gw,
                        'pbb_total_bayar':dataWajibPajak.pbb_total_bayar,
                        'update_by':dataWajibPajak.update_by
                      }),
                      redirect:'follow'
                    })
                    .then(async response =>{
                    })
                    .then(function (res) {
                    })
                    .catch(error => console.log(error))  
          }
       }).catch(function (err){next(err)})

      }
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  db,
  doShow: doShow,
  doCreate: doCreate,
  doUpdate: doUpdate,

}

