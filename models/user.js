// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({ 
    fullname: {type: String, required: true, max: 32}, 
    username: {type: String, required: true, max: 8}, 
    password: {type: String, required: true, max: 16}, 
    admin: {type: Boolean, required: true},  
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', UserSchema);
