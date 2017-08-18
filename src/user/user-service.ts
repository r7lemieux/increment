// import * as Prom from 'bluebird';

export class UserService {

  constructor() {

  }

  findOne = (data, cb) => {
    cb(null, {
      verifyPassword: (pw) => true
    });
  }
}

export const userService: UserService = new UserService();
