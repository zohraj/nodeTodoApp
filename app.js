const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const db = require('./db');
const dotenv= require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const routes = require('./app/routes/index');
const app = express();

app.use(cors());
app.use(express.json()); // support json encoded bodies
app.use(validator());
app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));
require('dotenv').config()
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
db.init(); //initiating the db config
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Start server
 */
app.listen(process.env.ENV_PORT || 5000, function () {
  console.log('Server is running at PORT ' + process.env.ENV_PORT);
});

module.exports = app;