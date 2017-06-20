const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5945c16a87caa8db92dc6873';

// use method off of ObjectID to validate id before it reaches the findById
if (!ObjectID.isValid(id)) {
  console.log('id not valid');
}

// // get back an entire array
// Todo.find({
//   _id: id               // mongoose autmatically converts string to objectID
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// // returns one docuement at most
// // get back a document
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   if (!todo) {
//     return console.log('id not found');
//   }
//   console.log('todo', todo);
// });

// get back a document
// Todo.findById(id).then((todo) => {
//   if (!todo) {  // check if todo id exists in todo array
//     return console.log('id not found');
//   }
//   console.log('todo', todo);
// }).catch((e) => console.log(e));

User.findById(id).then((user) => {
  if(!user) {
    return console.log('id not found');
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
