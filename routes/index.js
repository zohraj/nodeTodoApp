var express = require('express');
var router = express.Router();
var user_controller = require('./../controllers/user');
var item_controller = require('./../controllers/item');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/list',item_controller.list);
router.post('/add',item_controller.add);
router.put('/update/:id',item_controller.update);
router.delete('/delete/:id',item_controller.delete);
router.post('/register', user_controller.register);
router.post('/login',  user_controller.login);
router.get('/profile', requiresLogin, function (req, res, next) {
  console.log(req);
  res.render('user_profile');
});
// GET /logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

function requiresLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
}
module.exports = router;
