var mongoose = require('mongoose');

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

module.exports = {Todo};
