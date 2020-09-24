const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

const indexRouter = require('../routes/index');
const createInvoice = require('../routes/createInvoice');
const pushNotif = require('../routes/pushNotif');
const basicAuth = require('../utils/basicAuth');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1', cors({
  origin: '*',
  methods: 'POST',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
}), basicAuth, createInvoice, pushNotif);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
