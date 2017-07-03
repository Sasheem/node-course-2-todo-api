const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

// dummy array to populate db for Testing
const users = [{
  _id: userOneId,
  email: 'sasheem@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'anicia@example.com',
  password: 'userTwoPass',

}];

// dummy array to populate db for testing
const todos = [{
  _id: new ObjectID(),
  text: 'first test todo'
}, {
  _id: new ObjectID(),
  text: 'second test todo',
  completed: true,
  completedAt: 333
}];

const populateTodos = (done) => {
  // wipes all todos with an empty object here
  Todo.remove({}).then(() => {
    // CONTINUE HERE AT 2:21 lec titled 'Testing GET /todos'
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  // wipe all users
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    // this runs when the promises uncluded as an argument are fulfilled
    // ie saved to the db
    return Promise.all([userOne, userTwo]);
    // returning will go to the outer then() call to call done()
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
