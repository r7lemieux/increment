import {Request, Response} from 'express';
import {log, inspect} from 'util';

type AuthRequestTask = {
  key: string,
  res: Response
}

export class AuthController {

  constructor() {
  }

  login(req, res:Response) {
    console.log(`=> auth-controller:15 req ${inspect(req)}`)
    log('username ' + req.user.username)
  }

}

export const authController: AuthController = new AuthController();
