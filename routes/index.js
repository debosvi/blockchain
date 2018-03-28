var express = require('express');
var router = express.Router();

// var async = require('async');
var User   = require('../models/user'); // get our mongoose model
var UserController = require('../controllers/user');

router.use(function(req, res, next) {
    if (req.session && req.session.user) {
        var user = UserController.getUser(req.session.user.username, function(err, user) {
            if (user != null) {
                req.user = user;
                delete req.user.password;
                req.session.user = req.user;
                res.locals.user = req.user;
                next();
            } else {
                next();
            }
        });
    } else {
        next();
    }
});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/login', UserController.tryLogin);

router.get('/logout', function(req, res) {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect('/');
        }
    }); 
});

router.get('/:page', UserController.requireLogin, function(req, res) {    
    res.render(req.params.page, {page: req.params.page});
});

router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = router;
