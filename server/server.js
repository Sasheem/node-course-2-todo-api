// library imports
var express = require('express');
var bodyParser = require('body-parser');

// local imports
var {mongoose} = require('./db/mongoose.js')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

// set up express application
var app = express();

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

// sets up port .. eventually going on heroku. local port 3000 for now
app.listen(3000, () => {
  console.log('server started on port 3000');
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
