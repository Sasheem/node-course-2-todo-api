const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

  // the outer return says 'run the ifstatement and return the value from within the fulfilled promise'?
  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  // mongodb operator - pull items from an array that match certain criteria
  // $pull
  var user = this;


  // if this token doesn't match then nothing gets removed,
  // if it does it will remove the enitre object
  return user.update({
    $pull: {
      tokens: {token}
    }
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

UserSchema.statics.findByCredentials = function (email, password) {
  // find a user where the email passed in matches one to a user
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();      // will return to the catch(e) in server.js
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);            // will return to then() in server.js
        } else {
          reject();                 // will return to the catch(e) in server.js
        }
      });
    });
  });
};


UserSchema.pre('save', function (next) {
  // why use lowercase user? instead of uppercase User?
  // so I am using an instance of the individual document
  var user = this;

   // check if password was modified
   if (user.isModified('password')) {
     // yes it was modified, make call to genSalt and hash
     // why do we want to only encrypt if password was just modified?
     // doesn't that mean it was already hashed and salted?

     bcrypt.genSalt(10, (err, salt) => {
       bcrypt.hash(user.password, salt, (err, hash) => {
         user.password = hash;
         next();
       });
     });
   } else {
     // not modified
     next();
   }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
