// library imports
const _ = require('lodash');
const express = require('express');                  // why use var instead const?
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// local imports
var {mongoose} = require('./db/mongoose.js')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

// set up express application
var app = express();
const port = process.env.PORT || 3000;      // may or may not be set, depending if run locally or not

// get body data that was sent from client
app.use(bodyParser.json());

// configure routes
// POST route will allow us to make new todos
app.post('/todos', (req, res) => {
   var todo = new Todo({
     text: req.body.text
   });

   todo.save().then((doc) => {
     res.status(200).send(doc);
   }, (e) => {
     res.status(400).send(e);
   });
});

// GET route will return todos to show them to user
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
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
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  // error case 1 - todo id isn't valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();               // sending empty body to protect user info
  }

  Todo.findById(id).then((todo) => {
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
app.delete('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
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
app.patch('/todos/:id', (req, res) => {
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
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
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
