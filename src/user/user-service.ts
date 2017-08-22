// import * as Prom from 'bluebird';

import {MoService} from '../common/services/mo-service';
import {User} from './user';
import {userDb} from './user-db';
import {callback} from '../common/core/interfaces';
import * as Prom from 'bluebird';
import {Rezult} from '../common/message/rezult';
import {ErrorName} from '../common/message/errorName';
import {dbValidationService, validator} from '../common/db/dbValidation-service';
import {Mo} from '../common/mo/mo';

export class UserService extends MoService<User> {

  constructor() {
    super(User.prototype, userDb);
  }

  create(partialUser: Partial<User>, cb?: callback): Prom<User> {
    return this.moDb.create(partialUser)
      .then(user => {
        if (cb) {
          cb(null, {
            verifyPassword: (pw) => true,
          });
        }
        return user as User;
      })
      .catch(err => {
        console.error(`Fail to create user ${JSON.stringify(partialUser)}  Error => ${err}`);
        if (cb) {
          cb(err);
        } else {
          throw err;
        }
      });
  }

  findSingle(partialUser: Partial<User>, cb?: callback): Prom<User> {
    return super.findSingle(partialUser)
      .then(user => {
        // {
        //   if (cb) {
        //     cb(null, {
        //       verifyPassword: (pw) => true,
        //     });
        //   }
        // }
        return user as User;
      });
  }

  validatePartialUser(partialUser: Partial<User>): Rezult[] {
    const rezults: Rezult[] = [];
    const testField         = this.buildTestField(partialUser, rezults);
    testField('id', 'int');
    testField('username', 'key');
    testField('email', 'email');
    testField('phone', 'phone');
    testField('facebookId', 'key');
    return rezults;
  }
}

export const userService: UserService = new UserService();
