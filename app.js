'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var passport = require('passport');
var LocalStrategy = require('passport-local');
var appLogger = require('./modules/Logger').create();
// const bcrypt = require('bcrypt');
var app = express();
var appRest = require('./rest/app');
var device = require('express-device');

var debug = require('debug')('src:server');
var http = require('http');
var server = http.createServer(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(session({
  secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
  resave: true,
  saveUninitialized: true,
}));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'quantri', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

var loginRouter = require('./routes/login')(passport);
app.use('/quantri/dang-nhap', loginRouter);
app.use('/quantri/', function (req, res, next) {
    if (!req.isAuthenticated()) {
      res.redirect('/quantri/dang-nhap');
    } else {
      next();
    }
  },
  require('./routes/admin'));
app.use('/quantri/rest', appRest);
app.get('/quantri/logout', function (req, res) {
  if (req.isAuthenticated()) {
    appLogger.capabilityLogs([{
      username: req.session.passport.user.Username,
      tacVu: 'Đăng xuất'
    }])
    res.clearCookie('passport');
    req.session.destroy();
  }
  res.redirect('/quantri');
  res.end();
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}