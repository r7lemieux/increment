import * as passport from 'passport';
import {userService} from '../user/user-service';
import {User} from '../user/user';

// import {Application, Request, Response} from 'express';

export function authRoutes(app) {

  app.post('/api/signup', passport.authenticate('local-signup', {
      successRedirect: '/api/user/',
      failureRedirect: '/api/signup',
      failureFlash   : false,
    })
  );

  app.post('/api/login',
    passport.authenticate('local-login'),
    (req, res) => {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      //res.send('aaa');
      res.redirect('/api/user/' + req.user.username);
    });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
}
