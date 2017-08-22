"use strict";
import 'chai-http';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {authService} from './auth-service';
import app from '../app';
import * as util from 'util';

// const authConfig    = require('./auth-config.json');

chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should();

describe('auth service', () => {

  it('should allow login', () => {
    return chai.request(app).post('/api/login')
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
      });
  });
});

//# sourceMappingURL=auth-service-spec.js.map
