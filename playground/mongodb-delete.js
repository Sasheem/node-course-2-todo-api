// looking for mongo client to connect us to mongo server where we can issue
// commands to manipulate the db

// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


// two args, 1st url to where the db lives, 2nd callback
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('unable to connect to mongodb server');
  }
  console.log('connected to mongodb server');

  // 3 methods to remove data

  // deleteMany
  // db.collection('Todos').deleteMany({
  //   text: 'get lunch w/ coworker'
  // }).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({
  //   text: 'get gas'
  // }).then((result) => {
  //   console.log(result);
  // });

  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({
  //   completed: false
  // }).then((result) => {
  //   console.log(result);
  // });


  // CHALLENGE
  // delete documents with name Sasheem
  // db.collection('Users').deleteMany({
  //   name: 'Sasheem'
  // }).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete document with name Silas & print to screen
  // db.collection('Users').findOneAndDelete({
  //   _id: new ObjectID('59459e36808e5c3c69ff4fb5')
  // }).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').find({
  //   name: 'Silas'
  // }).toArray().then((docs) => {
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log(err);
  // });

  // db.close();
});
