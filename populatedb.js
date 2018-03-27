#! /usr/bin/env node

var mongoose = require('mongoose');
var async = require('async')
var User = require('./models/user')
var configDB = require('./config/database.js');

// mongoose
mongoose.connect(configDB.url);
mongoose.Promise = global.Promise;

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var authors = []
var genres = []
var books = []
var bookinstances = []

function cleanAllUsers(cb) {
    console.log('cleanAllUsers');
    
    // remove all ids
    mongoose.connection.dropDatabase(function(err) {
        if (err) throw err;
        console.log('Drop any users successful');
    });
            
    cb(null, null)
}
 
function userCreate(fullname, username, password, admin, cb) {
    console.log('userCreate');
    
    userdetail = { fullname:fullname, username:username, password:password, admin:admin}
    
    var user = new User(userdetail);
        
    user.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New user: ' + user);
        cb(null, user)
    });
}

function addUsers(cb) {
    console.log('addUsers');
    async.parallel([
        function(callback) {
            userCreate('Administrator', 'admin', 'adminpwd', true, callback);
        },
        function(callback) {
            userCreate('Regular User', 'user', 'userpwd', false, callback);
        },
    ],
    // optional callback
    cb);
}

async.series([
    cleanAllUsers,
    addUsers
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('Populate DB successful');        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




