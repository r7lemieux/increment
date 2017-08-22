import {Request, Response} from 'express';
import * as util from 'util';
import {userService} from './user-service';

type UserRequestTask = {
  key: string,
  res: Response
}

export class UserController {

  constructor() {
  }

  createUser = (req, res: Response) => {
    console.log(`=> user-controller:14 req  ${util.inspect(req.body)}`);
    userService.create(req.body)
      .then(ret => {
        res.send(ret);
      })
      .catch(err => {
      console.log(`=> user-controller: Fail to create user ${JSON.stringify(req.body)}`);
    })
  }

  retrieveUser = (req, res: Response) => {
    userService.findSingle(req.params)
      .then( user => {
        res.send(user);
      })
      .catch(err => {
        console.log(`=> user-controller: Fail to retrieve user ${JSON.stringify(req.params)}`);
      })
  }
}

export const userController: UserController = new UserController();
