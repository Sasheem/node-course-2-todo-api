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

  // MANIUPULATING _id attribute


  // INITIAL INSERT TO CREATE TODOS
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('unable to insert todo ->', err);
  //   }
  //   // pretty printing
  //   // ops attribute stores all the docs that were inserted
  //   // undefined for filter function
  //   // 2 for indentation
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // insert new doc into the Users collection
  // name, age, and location property
  // CHALLENGE
  db.collection('Users').insertOne({
    name: 'Tyler Galceran',
    age: 23,
    location: 'Tallahasee'
  }, (err, result) => {
    if (err) {
      console.log('unable to insert user', err);
    }

    console.log(`User added on ${result.ops[0]._id.getTimestamp()}`);
    // console.log(JSON.stringify(result.ops, undefined, 2));
  });


  // object id broken down - 12 byte value
  // 1st 4 bytes is a time stamp
  // next 3 bytes are a machine identifier
  // 2 bytes for process id
  // 3 byte counter similar to what mysql would do
  // remaining bytes for random value
  db.close();
});
