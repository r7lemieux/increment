"use strict";
import 'chai-http';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {userService} from './user-service';
// import app from '../app';
import testSetup from '../common/testSetup';
import * as express from 'express';
import {Application} from 'express';
import bodyParser = require('body-parser');
import * as Prom from 'bluebird';

const routes = require('../common/routes');

chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should();

const username = 'Richard';

describe('user api', () => {

  let app: Application;

  before(() => {
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    routes(app);
    testSetup()
      .then(userService.deleteAll)
  });

  it('should create a user ', () => {
    return chai.request(app).post('/api/user')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({username: username})
      .then(res => {
        res.status.should.eql(200);
        res.body.should.haveOwnProperty('username', username);
        return; //Prom.resolve();
      })
      .catch(function (e) {
        console.log("error:", e.status);
        return should.fail(e, '', 'Fail to create user ' + username);
      });
  });

  it('should retreive a user by username', () => {
    return chai.request(app).get('/api/user/' + username)
      .then(res => {
        res.status.should.eql(200);
        return res.body.username.should.eql(username);
      })
      .catch(function (e) {
        console.log("error:", e.status);
        return should.fail(e, '', 'Fail to retrieve user ' + username);
      });
  });

});
//# sourceMappingURL=user-service-spec.js.map
