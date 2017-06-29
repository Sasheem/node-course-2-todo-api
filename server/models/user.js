const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      // attributes
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// update toJSON method
UserSchema.methods.toJSON = function () {
  // what gets sent back when a mongoose model is converted to a json value
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// arrow functions don't store a 'this' keyword and we need that to access
// the individual docuement
UserSchema.methods.generateAuthToken = function () {
  // instance methods get user called as individual document
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  // ???? WHAT THE FUUUUUUCCCKKKK
  // the outer return says 'run the ifstatement and return the value from within the fulfilled promise'?
  return user.save().then(() => {
    return token;
  });
};

// added to statics object gets turn to to a model method,
// added to methods object gets turn to instance method
UserSchema.statics.findByToken = function (token) {
  // token arg b/c we can go thru process of verifying it
  // finding associated user and returning it
  // model methods get called with the model as the 'this' binding
  var User = this;
  var decoded;
  // going to call as undefined for now b/c jwt.verify will throw errors if something goes wrong

  // hence why we do the try & catch block
  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return a promise that is always going to reject
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  // success case
  // by returning promise we can chain another then call onto findByToken in server.js
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'         // won't be hardcoded for long
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
