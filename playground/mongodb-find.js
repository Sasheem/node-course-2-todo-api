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

  // arg for find() is the query
  // db.collection('Todos').find({
  //   _id: new ObjectID('5944b4dc808e5c3c69ff3dc1')
  // }).toArray().then((docs) => {
  //   console.log('Todos:');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('unable to fetch todos', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('unable to fetch todos', err);
  // });

  db.collection('Users').find({
    name: 'Sasheem Snell'
  }).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('unable to fetch user', err);
  });

  // db.close();
});
