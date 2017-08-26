"use strict";
import 'chai-http';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {authService} from './auth-service';
import * as express from 'express';
import * as util from 'util';
import {Application} from 'express';
import bodyParser = require('body-parser');
import testSetup from '../common/testSetup';
import {userService} from '../user/user-service';
import {passportConfig} from './passport-config';
import session = require('express-session');
// import * as passport from 'passport';
const routes = require('../common/routes');
const flash  = require('req-flash');

const passport = require('passport');
// const authConfig    = require('./auth-config.json');

chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should();
const username = 'Richard';
const partialUser = {'email':'grosjoe@labas.ca', username:username}
const partialUserWithPassword = {'email':'grosjoe@labas.ca', username:username, password:'wqedd32432sdfs'}

describe('auth service', () => {
  let app: Application;

  before(() => {
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    passportConfig(passport);
    app.use(session({ secret: 'qwerqwerqwer3323' }));
    //app.use(passport.session());
    app.use(flash());
    routes(app);
    return testSetup()
      .then(userService.deleteAll)
  });

  it('should allow register', () => {
    return chai.request(app).post('/api/signup')
      .send(partialUserWithPassword)
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.equals(partialUser);
      });
  });

  it('should allow login', () => {
    return chai.request(app).post('/api/login')
      .send(partialUser)
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.equals(partialUser);
      });
  });
});

//# sourceMappingURL=auth-service-spec.js.map
