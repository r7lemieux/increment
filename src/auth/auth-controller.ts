import {Request, Response} from 'express';
import * as Prom from 'bluebird';
import * as util from 'util';
import {dbValidationService} from '../common/db/dbValidation-service';

type IdRequestTask = {
  key: string,
  res: Response
}

export class AuthController {

  constructor() {
  }

  validParams(req, res) {
    const error = dbValidationService.validateKey(req.query.key);
    if (error) {
      res.status(400);
      res.send(error);
      return false;
    }
    return true;
  }
}

export const authController: AuthController = new AuthController();
