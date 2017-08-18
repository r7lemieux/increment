import * as passport from 'passport';
import {userController} from './user-controller';
// import {Application, Request, Response} from 'express';

export function userRoutes(app) {
  app.post('/api/user', (req, res) => userController.user(req, res));
}
