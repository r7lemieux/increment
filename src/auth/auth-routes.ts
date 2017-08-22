import * as passport from 'passport';
// import {Application, Request, Response} from 'express';

export function authRoutes(app) {
  app.post('/api/login',
    passport.authenticate('local'),
    (req, res) => {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      //res.send('aaa');
      res.redirect('/api/user/' + req.user.username);
    });
}
