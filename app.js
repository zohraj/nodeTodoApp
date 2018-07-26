const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const db = require('./db');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const routes = require('./app/routes/index');
const app = express();

const config = require('./app/config')
var onlineUsers = config.onlineUsers;
app.use(cors());
app.use(express.json()); // support json encoded bodies
app.use(validator());

app.set('superSecret', config.secret);
require('dotenv').config()
db.init(); //initiating the db config
app.use(cookieParser());
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
 * socket io connection
 */
var http = require('http');
let server = http.Server(app);
socketEvents = require('./app/services/socket');
const io = require('socket.io').listen(server);

socketEvents(io)



/**
 * Start server
 */


server.listen(process.env.ENV_PORT || 5000, function () {
  console.log('Server is running at PORT ' + process.env.ENV_PORT);
});

module.exports = app;