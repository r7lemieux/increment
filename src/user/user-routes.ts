import {userController} from './user-controller';

export function userRoutes(app) {
  app.post('/api/user', userController.createUser);
  app.get('/api/user/:username', userController.retrieveUser);
  app.put('/api/user/:username', userController.updateUser);

  app.get('/profile', isLoggedIn, function(req, res) {
    res.send({
      user : req.user
    });
  });

  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
  }

}
