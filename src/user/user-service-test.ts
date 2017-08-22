"use strict";
import 'chai-http';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {userService} from './user-service';
import {User} from './user';
import {dbStarter} from '../common/db/dbStarter-service';
import testSetup from '../common/testSetup';

chai.use(chaiHttp);
const expect   = chai.expect;
const should   = chai.should();
const username = 'Richard';

describe('user service', () => {

  before(() => {
    testSetup()
      .then(userService.deleteAll);
  });

  it('should create a user ', () => {
    const userPartial: Partial<User> = {
      username: username,
    };
    return userService.create(userPartial)
      .then(user => {
        should.exist(user);
        user.should.have.property('username', username);
        user.username.should.eql(username);
      })
  });

  it('should retreive a user by username', () => {
    return userService.findSingle({username: username})
      .then( user => {
        should.exist(user);
        user.username.should.eql(username);
      });
  });

});
//# sourceMappingURL=user-service-spec.js.map
