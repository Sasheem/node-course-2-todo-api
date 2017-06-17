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

  // findOneAndUpdate - example
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('59459b3b808e5c3c69ff4ea9')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  // CHALLENGE - update single user document to sasheem and increment age
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5944ad842a25fc5943b153a4')
  }, {
    $set: {
      name: 'Sasheem'
    },
    $inc: {
      age: +1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  // db.close();
});
