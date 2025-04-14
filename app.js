const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');
const cors = require('cors');

app = express();
app.use(express.static(path.join(__dirname, './public')));
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});
app.set('view engine', 'njk');
app.use(express.json());

app.use(cors());

const indexRouter = require('./routes/admin/index/index.router');

const indexAPIRouter = require('./routes/clients/index/index.router');
const reportAPIRouter = require('./routes/clients/reports/reports.router');
const authAPIRouter = require('./routes/clients/auth/auth.router');
const historyAPIRouter = require('./routes/clients/history/history.controller');

app.use('/', indexRouter);

app.use('/api', indexAPIRouter);
app.use('/api', reportAPIRouter);
app.use('/api', authAPIRouter);

module.exports = app;
