var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    // modify req object to use in GET /users/me
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    // 401 status means authentication is required
    res.status(401).send();
  });
};

module.exports = {authenticate};
