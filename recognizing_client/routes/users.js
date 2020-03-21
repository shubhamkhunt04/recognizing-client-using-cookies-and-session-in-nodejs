var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var session = require('express-session');

var router = express.Router();
router.use(bodyParser.json());


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Signup.............................................

router.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user != null) {
        var err = new Error('User ' + req.body.username + ' already exists !')
        err.status = 403;
        next(err);
      }
      else {
        return User.create({
          username: req.body.username,
          password: req.body.password
        });
      }
    })
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'Registrations successful ! ', user: user });
    }, (err) => next(err))
    .catch((err) => next(err));
});

//Login..............................................

router.post('/login', (req, res, next) => {
  if (!req.session.user) {

    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error('You are not authenticated');

      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');  // output => [username , password]
    var username = auth[0];
    var password = auth[1];

    User.findOne({ username: username })
      .then((user) => {
        if (user == null) {
          var err = new Error('User ' + username + ' does not exist');
          err.status = 403;
          return next(err);
        }
        else if (user.password !== password) {
          var err = new Error('Your password is wrong !');
          err.status = 403;
          return next(err);
        }
        else if (user.username == username && user.password == password) {
          //now user is authorized
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end("You are authenticated !");
        }
      })
      .catch((err) => next(err));
  }

  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end("You are already authenticated !!");
  }
});


//Logout.......................................................

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();  // destroy session on serverside
    res.clearCookie('session-id');       // clear cookies on clientside
    res.redirect('/');
  }
  else {

    var err = new Error('You are not logged in !');
    err.status = 403;
    return next(err);
  }
})

module.exports = router;
