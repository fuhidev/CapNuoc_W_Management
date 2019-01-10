var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var rest = require('./routes/rest');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/sys_grouprole', rest);
app.use('/sys_role', rest);
app.use('/sys_account', rest);
app.use('/sys_grouplayer', rest);
app.use('/sys_layer', rest);
app.use('/sys_capability', rest);
app.use('/sys_capability_role', rest);
app.use('/sys_capability_account', rest);
app.use('/sys_layer_role', rest);
app.use('/sys_layer_account', rest);
app.use('/sys_logger_layer', rest);
app.use('/sys_logger_capability', rest);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
