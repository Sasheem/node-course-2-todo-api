// local imports
require('./config/config');

// library imports
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

// set up express application
var app = express();
const port = process.env.PORT;

// get body data that was sent from client
app.use(bodyParser.json());

// configure routes
// POST route will allow us to make new todos
app.post('/todos', authenticate, (req, res) => {
   var todo = new Todo({
     text: req.body.text,
     _creator: req.user._id
   });

   todo.save().then((doc) => {
     res.status(200).send(doc);
   }, (e) => {
     res.status(400).send(e);
   });
});

// GET route will return todos to show them to user
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    // success case when promise gets resolved
    res.send({todos});
  }, (e) => {
    // fail case promise rejected
    res.status(400).send(e);
  });
  // when authentication added you will retrieve one single todo. for now find all
});

// STRUCTURE FOR URL WE ARE GOING TO GRAB FROM
// GET /todos/id
app.get('/todos/:id', authenticate,  (req, res) => {
  var id = req.params.id;

  // error case 1 - todo id isn't valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();               // sending empty body to protect user info
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    // error case 2 - todo doesn't exist
    if (!todo) {
      return res.status(404).send();      // sending empty body to protect user info
    }
    // success case 1 - send todo back as object
    res.send({todo});
  }).catch((e) => {
    // error case 3 - bad request?
    res.status(400).send();
  });
});

// DELETE ROUTE
app.delete('/todos/:id', authenticate, (req, res) => {
  // get the id
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    // check for empty todo
    if (!todo) {
      return res.status(404).send();
    }
    // success - send doc back w/ 200 code
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// PATCH ROUTE
app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  // array arg contains subset of things user passed to us, we don't want the user
  // to be able to change anything they choose
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // checking completed value, using that to set completedAt to a timestamp
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // query to update db
  // change to findOneAndUpdate
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// POST /users private route
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// GET /users/me private route to fetch logged in user details
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login route
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// DELETE /users/me/token logout route
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

// sets up port .. eventually going on heroku. local port 3000 for now
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

module.exports = {app};

/*
  what we are going to do
  CRUD - create read update delete

  create a resource, use POST http method, send resource as the body

  so to make a new todo, send JSON object over to server that has a text property
  server will take that text property, create new model. then it will send that
    complete model (with the id, completed properrty and completedAt) back to client

  MODULES TO INSTALL to write test cases
  expect -> for assertions
  mocha -> for entire test suite
  supertest -> test express routes
  nodemon -> its installed globally but good idea to install locally to
    create test-watch script

*/
