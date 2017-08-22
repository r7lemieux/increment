import * as passport from 'passport';
import {userController} from './user-controller';
// import {Application, Request, Response} from 'express';

export function userRoutes(app) {
  app.post('/api/user', (req, res) => {
    return userController.createUser(req, res)
  });
  app.get('/api/user/:username', (req, res) => userController.retrieveUser(req, res));
}
