const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const db = require('./db');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const routes = require('./app/routes/index');
const app = express();

const config = require('./app/config')
var onlineUsers = config.onlineUsers;
app.use(cors());
app.use(express.json()); // support json encoded bodies
app.use(validator());
app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));
app.set('superSecret', config.secret);
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
 * socket io connection
 */
var http = require('http');
let server = http.Server(app);
let socketIO = require('socket.io');
let io = socketIO(server);

io.on('connection', function (socket) {
  console.log("connected with socket");
  socket.on('new-message', function (data) {
    console.log(data);
    var recipient;
    onlineUsers.forEach(function (user) {
      if (user.userId == data.to) {
        result = user;
      }
    })
    console.log("user found-->", result);
    console.log("====users from config===");
    console.log(onlineUsers);
    if (result) {
      io.to(result.socketId).emit("new-message",data.message);
    }

  });
})

io.use(function (socket, next) {
  var handshake = socket.handshake;
  onlineUsers = config.onlineUsers;
  var userFound = false;
  onlineUsers.forEach(function (user) {
    if (user.userId == handshake.query.id) {
      userFound = true
    }

  })
  if (!userFound && handshake.query.id && handshake.query.id != 'undefined' && socket.id) {
    onlineUsers.push({
      "userId": handshake.query.id,
      "socketId": socket.id
    })
  }
  else {
    onlineUsers.forEach(function (user) {
      if (user.userId == handshake.query.id) {
        user.socketId = socket.id
      }
    })
  }
  config.onlineUsers = onlineUsers

  console.log("socket Id : " + socket.id + " and token: " + handshake.query.id);
  next();
});

/**
 * Start server
 */


server.listen(process.env.ENV_PORT || 5000, function () {
  console.log('Server is running at PORT ' + process.env.ENV_PORT);
});

module.exports = app;