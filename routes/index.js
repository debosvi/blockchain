var express = require('express');
var router = express.Router();

// var async = require('async');
var User   = require('../models/user'); // get our mongoose model

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/setup', function(req, res) {
    // create a sample admin user
    var admin_user = new User({ 
        username: 'admin', 
        password: 'admin',
        admin: true 
    });
    
    // remove all ids
    admin_user.collection.drop(function(err) {
        if (err) throw err;
        console.log('Drop any users successful');
    });
    
    // save the sample user
    admin_user.save(function(err) {
        if (err) throw err;
        console.log('User "admin" saved successfully');
    });
    
    // create a sample admin user
    var regular_user = new User({ 
        username: 'user', 
        password: 'user',
        admin: false
    });
    
    // save the sample user
    regular_user.save(function(err) {
        if (err) throw err;
        console.log('User "user" saved successfully');
    });
    
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
