const createError = require('http-errors');
const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const routes=require('./app/routes/index');
const app = express();
app.use(cors());
app.use(express.json()); // support json encoded bodies
app.use(validator());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);
//TODO: import index route containing all routes


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
app.listen(5000, function () {
  console.log('Server is running at PORT 5000..');
});

module.exports = app;