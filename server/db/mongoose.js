// load in mongoose
var mongoose = require('mongoose');

// with these two lines mongoose is set up
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');    // connect to db

module.exports = {mongoose};
