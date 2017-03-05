#!/usr/bin/env node

/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var path = require('path'); //utilities for working with file and directory paths
var favicon = require('serve-favicon'); //for serving favicon
var http_logger = require('morgan'); //http logger
const winston = require('winston'); //standard logger
winston.level = process.env.LOG_LEVEL || 'silly';

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var debug = require('debug')('lehighhousing:server');
var http = require('http');

var mongoose = require('mongoose');
var config = require('./config')[app.get('env')]; //gets NODE_ENV environmental variable
global.db = mongoose.connect('mongodb://'+config.database.user+':'+config.database.password+'@'+config.database.host+':27017/'+config.database.name);

var index = require('./routes/index');
var house = require('./routes/house');
var landlord = require('./routes/landlord');

// view engine setup
app.set('views', 'views');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(http_logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', index);
app.use('/', house);
app.use('/', landlord);

// catch 404 and forward to message display
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// message display
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the message page
    res.status(err.status || 500);
    res.render('message');
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

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

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

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
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
