import {Request, Response} from 'express';

type UserRequestTask = {
  key: string,
  res: Response
}

export class UserController {

  constructor() {
  }

  user = (req, res: Response) => {
    console.log(`=> user-controller:14 req.user.username ${JSON.stringify(req.user.username)}`);
  }
}

export const userController: UserController = new UserController();
