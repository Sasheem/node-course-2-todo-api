const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// // finds a doc, removes it, returns it
// Todo.findOneAndRemove({_id: '594c1b57808e5c3c69ff7159'}).then((todo) => {
//   // works similar to findByIdAndRemove() just depends if you have more
//   // search criteria than just an id
//
// });


// pass in id, find & remove & return it
Todo.findByIdAndRemove('594c46b3808e5c3c69ff71d5').then((todo) => {
  console.log(todo);
});
