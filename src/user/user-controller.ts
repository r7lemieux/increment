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
    userService.create(req.body)
      .then(user => {
        const ret = userService.buildUserVO(user);
        res.send(ret);
      })
      .catch(err => {
      console.log(`=> user-controller: Fail to create user ${JSON.stringify(req.body)}, err ${err}`);
      res.send(err);
    })
  }

  updateUser = (req, res: Response) => {
    userService.update(req.body)
      .then(user => {
        const ret = userService.buildUserVO(user);
        res.send(ret);
      })
      .catch(err => {
        console.log(`=> user-controller: Fail to update user ${JSON.stringify(req.body)}`);
      })
  }

  retrieveUser = (req, res: Response) => {
    userService.findSingle(req.params)
      .then( user => {
        const ret = userService.buildUserVO(user);
        res.send(ret);
      })
      .catch(err => {
        console.log(`=> user-controller: Fail to retrieve user ${JSON.stringify(req.params)}`);
      })
  }
}

export const userController: UserController = new UserController();
