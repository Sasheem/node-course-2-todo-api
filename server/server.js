// library imports
var express = require('express');                  // why use var instead const?
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

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
