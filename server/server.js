// load in mongoose
var mongoose = require('mongoose');

// with these two lines mongoose is set up
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');    // connect to db

// create a model to specify attributes for documents we want to store
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true          // removes any leading and trailing whitespace
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// set up a variable to get saved to mongodb
// var newTodo = new Todo({
//   text: 'cook dinner'
// });

// saves new document to mongodb
// newTodo.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('unable to save todo', e);
// });

// make a new user model -
// email: require it, trim it, set type, set min length of 1
// password: require it, trim it, set type, set min length of 1
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

var newUser = new User({
  email: 'sts12@me.com'
});

newUser.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('unable to save user', e);
});
