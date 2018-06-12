var express = require('express');
var assert = require('assert');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function (req, res, next) {
  res.send('ok');
});

router.post('/register', function (req, res, next) {
  registerUser(req.db, req.body, function (err, result) {
    if (err) {
      res.send("NOT OK");
    }
    else {
      res.send(result);
      
    }
  });
});

//Register user.
function registerUser(db, user, callback) {
  const collection = db.collection('users');
  // Inserting user.
  collection.insert([
    user
  ], function (err, result) {
    callback(err, result);
  });
}

module.exports = router;
