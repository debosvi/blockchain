var bcrypt = require('bcryptjs');
var User = require('../models/user');

/* require login middleware can apply on routes in which we need required login */
exports.requireLogin = function(req, res, next) {
    if(req.params.page == 'about') {
        next();
    }
    else if(req.params.page == 'login') {
        next();
    }
    else if(req.params.page == 'users') {
        User.find({}, function(err, users) {
            if(!err) {
                res.render('users', {page: '/user', users: users});
            }
            else {
                next();
            }
        });
    }
    else {
        if (!req.user) {
            req.session.returnTo = req.params.page;
            res.redirect('/login');
        } 
        else {
            next();
        }
    }
}

exports.tryLogin = function(req, res) {
    User.findOne({ username: req.body.username }, function(error, user) {
        if (!user) {
            res.render('login', { error: 'Invalid username'} );
        } 
        else {
//             if (bcrypt.compareSync(req.body.password, user.password)) {
            if (req.body.password, user.password) {
                credir = req.session.returnTo || '/'
                req.session.user = user;
                res.redirect(credir);
            } else {
                res.render('login', { error: 'Invalid password'} );
            }
        }
    });
};

/*registerUser inplemented with callback function only */
exports.registerUser = function(req, cb) {
    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
    });
    user.save(function(err) {
        if (err) {
            var error = 'something went wrong!';
            if (err.code === 11000) {
                error = 'Email already registered, try another!';
            }
            cb(error, null); //calling callback and return value as per need
        } else {
            cb(null, true);
        }
    });
};

exports.getUser = function(username, cb) {
    User.findOne({
        username: username
    }, function(err, user) {
        if (user) {
            cb(null, user);
        } else {
            cb("User not found", null);
        }
    });
}
