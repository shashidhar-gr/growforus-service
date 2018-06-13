var express = require('express');
var assert = require('assert');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function (req, res, next) {
  loginUser(req.db, req.body, function (err, result) {
    if (err) {
      res.json(result.status, { "success": false, result });
    }
    else {
      res.send(result.status, { "success": true, result });
    }
  });
});

/******
 * Router handler for user registration. This function will read the request body
 * and checks for duplicate entry of username. If given name is not in collection 
 * then data will be saved.
 ******/
router.post('/register', function (req, res, next) {

  registerUser(req.db, req.body, function (err, result) {
    if (err) {
      res.json(result.status, { "success": false, result });
    }
    else {
      res.send(result.status, { "success": true, result });
    }
  });

});

/**** 
 * Function that will take care of user login. Below steps will be followed
 * for user login.
 * Step1: Check for username and password in collection.
*****/
function loginUser(db, user, callback) {
  console.log("In loginUser");
  //Using users collection.
  const collection = db.collection('users');

  collection.find({ "username": user.username, "password": user.password }, function (err, results) {
    console.log("In loginUser find");
    if (err) {
      return callback(true, { "status": 500, "message": "something went wrong" });
    }
    else {
      if (results.length > 0) {
        return callback(false, { "status": 200, "message": "Login successfull.", "result": results });
      }
      else {
        return callback(true, { "status": 404, "message": "username or password is incorrect." });
      }
    }
  });
}

/**** 
 * Function that will take care of user registration. Below steps will be followed
 * for user registration.
 * Step1: Check for duplicate username in collection.
 * Step2: If given username doesn't exists in collction, then insert the document. 
*****/
function registerUser(db, user, callback) {
  console.log("In registerUser");
  //Using users collection.
  const collection = db.collection('users');
  console.log('Continue!!');
  console.log(user);
  collection.find({ "username": user.username }, function (err, results) {
    console.log("In registerUser find");
    if (err) {
      console.log(err);
      return callback(true, { "status": 500, "message": "something went wrong" });
    }
    else {
      console.log("In not error");
      if (results.length > 0) {
        return callback(true, { "status": 500, "message": "username already exists." });
      }
      else {
        // Inserting user.
        collection.insert([
          user
        ], function (err, result) {
          return callback(false, { "status": 200, "message": "user registered succesfully." });
        });
      }
    }
  });
}

module.exports = router;
