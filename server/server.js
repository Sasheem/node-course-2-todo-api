// load in mongoose
var mongoose = require('mongoose');

// with these two lines mongoose is set up
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');    // connect to db

// create a model to specify attributes for documents we want to store
var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

// set up a variable to get saved to mongodb
// var newTodo = new Todo({
//   text: 'cook dinner'
// });

// CHALLENGE - create a new document with all the fields filled
var newTodo = new Todo({
  text: 'watch udemy video',
  completed: false,
  completedAt: 930
});

// saves new document to mongodb
newTodo.save().then((doc) => {
  // console.log('saved todo', doc);
  console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('unable to save todo', e);
});
