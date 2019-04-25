var express = require('express');
var router = express.Router();
const Todo = require('../models/todo');
const Auth = require('../middleware/Auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const secret = /*require('../config')*/"supersecret";


router.post('/api/register', function(req, res) {
    const email = req.body.username;
    const password  = req.body.password;
    const user = new User({ email, password });
    user.save(function(err) {
      if (err) {
        res.status(500)
          .send("Error registering new user please try again.");
      } else {
        res.status(200).json({registered : 'Welcome to the club!'});
      }
    });
  });

router.post('/api/authenticate', function(req, res) {
   const email = req.body.username;
   const password  = req.body.password;
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
            const token = jwt.sign(payload, secret, {
              expiresIn: '1h'
            });
            console.log({isLogged: true})
            res.cookie('token', token, { httpOnly: true })
              .status(200)
              .json({isLogged : 'true'});
          }
        });
      }
    });
  });


router.get('/getAllItems', (req, res, next) => {
   Todo.find({}).sort({'date': -1}).exec((err, todoList) => {
      if (err) {
         console.log(err);
      }else {
         res.json(todoList);
      }
   })
});

router.post('/addItem', Auth, (req, res, next) => {
   console.log(req.body);
   let newItem = req.body;
   Todo.create(newItem, (err) => {
      if (err) {
         console.log(err);
      }else {
         Todo.find({}, (err, todoList) => {
            if (err) {
               console.log(err);
            }else {
               console.log(todoList);
               res.json(todoList);
            }
         });
      }
   })
})

router.post('/deleteItem', Auth ,(req, res, next) => {
   console.log(req.body);
   let delete_date = req.body.date
   Todo.remove({date: delete_date}, (err, result) => {
      if (err) {
         console.log(err)
      }else {
         res.json(result);
      }
   });
});
module.exports = router;
