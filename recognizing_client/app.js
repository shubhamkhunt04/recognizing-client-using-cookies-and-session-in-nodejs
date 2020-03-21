var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var Filestore = require('session-file-store')(session);

// my own router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishes = require('./routes/dishRouter');
const leaders = require('./routes/leaderRouter');
const promotions = require('./routes/promoRouter');

const mongoose = require('mongoose');


const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321')); // because use session

app.use(session({                     // session middleware
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new Filestore(),
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);


//Authentication using cookies.

function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
    var err = new Error('You are not authenticated');

    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }
  else {
    if (req.session.user == 'authenticated') {
      next();
    }
    else {
      var err = new Error('You are not authenticated');

      err.status = 403;
      return next(err);

    }
  }
}


app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishes);
app.use('/leaders', leaders);
app.use('/promotions', promotions);


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

module.exports = app;
