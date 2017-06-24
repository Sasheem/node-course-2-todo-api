// load in mongoose
var mongoose = require('mongoose');

// with these two lines mongoose is set up
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);    // connect to db w/ ref to env variable

module.exports = {mongoose};
