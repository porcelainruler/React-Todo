var express = require('express');
var Register_router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const config = require('../config');


Register_router.post('/api/register', function(req, res) {
    const { email, password } = req.body;
    const user = new User({ email, password });
    user.save(function(err) {
      if (err) {
        res.status(500)
          .send("Error registering new user please try again.");
      } else {
        res.status(200).send("Welcome to the club!");
      }
    });
  });

Register_router.post('/api/authenticate', function(req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401)
          .json({
            error: 'Incorrect email or password'
          });
      } else {
        user.isCorrectPassword(password, function(err, same) {
          if (err) {
            res.status(500)
              .json({
                error: 'Internal error please try again'
            });
          } else if (!same) {
            res.status(401)
              .json({
                error: 'Incorrect email or password'
            });
          } else {
            // Issue token
            const payload = { email };
            const token = jwt.sign(payload, config.default, {
              expiresIn: '1h'
            });
            res.cookie('token', token, { httpOnly: true })
              .sendStatus(200);
          }
        });
      }
    });
  });

/*
router.get('/getAllItems', (req, res, next) => {
   Todo.find({}).sort({'date': -1}).exec((err, todoList) => {
      if (err) {
         console.log(err);
      }else {
         res.json(todoList);
      }
   })
});
*/

module.exports = Register_router;
