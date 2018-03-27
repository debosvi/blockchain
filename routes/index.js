var express = require('express');
var router = express.Router();

// var async = require('async');
var User   = require('../models/user'); // get our mongoose model

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/login', function(req, res) {
    console.log(req.body);
    res.redirect('/');
});   

router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        console.log('users: ' + users);
        
        res.render('users', {users: users});
    });
});   

router.get('/:page', function(req, res, next) {
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
