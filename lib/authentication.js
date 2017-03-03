const User = require('../models/user');

function authentication(req, res, next) {
  //seeing if the user is logged in
  //if not then exit this middleware
  if (!req.session.isAuthenticated) return next();


  //find the user based on their userId in the session
  User
    .findById(req.session.userId)
    .then((user) => {
      if (!user) {
  //if the user cant be found then user doesn't exist on database - is an edge case (eg -account deleted) --- in this instance the user is logged out (removing admin rights)
        return req.session.regenerate(()=> res.unauthorized());
      }
  //set the userId back onto the session
      req.session.userId = user.id;
  //set the whole user object to the request
  //this enables us to use the users details in our controllers
      req.user = user;
  //set the whole user object to res.locals so we can use it in the views
      res.locals.user = user;

  //give isAuthenticated a boolean value so we can use it to show hide buttons/stuff thats only permitted to the logged in user
      res.locals.isAuthenticated = true;

  //cool - lets roll onto the next piece of middleware
      next();
    })
  //any errors - will catch them with our global error handlers
    .catch(next);
}

module.exports = authentication;
