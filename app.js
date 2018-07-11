var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const https = require('https');
let data = '';
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
var validator = require('express-validator');
app.use(validator());
var session = require('express-session');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(5000, function () {
  console.log('Server is running at PORT 5000..');
});



app.post("/", function (req, res) {
  console.log(req.body);
  res.status(200).send("Welcome to our restful API" + req.body);
});


app.post('/login', function (req, res) {

  db.collection('user').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database');
    res.redirect('/');

    // res.status(200).send("Logging in");
  });
});
app.post('register', function (req, res) {
  console.log(res);
  console.log("register");
})

module.exports = app;