"use strict";
import 'chai-http';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {idService} from './id-service';
import app from '../app';
import * as util from 'util';

const idConfig      = require('./id-config.json');
const incrementSize = idConfig.incrementSize;

chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should();

describe('id service', () => {
  describe('increment id', () => {

    it('should return default text ', () => {
      return chai.request(app).get('/')
        .then(res => {
          res.status.should.eql(200);
          res.text.should.eql('GET request to id route');
        })
    });

    it('should create a key value ', () => {
      const key = 'valid_K3Y';
      return idService.removeKey(key)

        .then(() => {
          return chai.request(app).get('/api/generateId')
            .query({key: key})
        })
    });

    it('should increment a key value ', () => {
      const key = 'valid_K3Y';
      return idService.removeKey(key)

        .then(() => {
          return chai.request(app).get('/api/generateId')
            .query({key: key})
        })

        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.eql({from: 0, to: incrementSize});
          return chai.request(app).get('/api/allocatedRanges')
            .query({key: key});
        })

        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.eql([[0, incrementSize]]);
          return chai.request(app).get('/api/generateId')
            .query({key: key})
        })

        .then(res => {
          res.should.have.status(201);
          res.body.should.eql({from: incrementSize, to: incrementSize * 2});
          return chai.request(app).get('/api/allocatedRanges')
            .query({key: key});
        })

        .then(res => {
          res.should.have.status(200);
          res.body.should.eql([[0, incrementSize], [incrementSize, incrementSize * 2]]);
        });
    });

    it('fail an invalid key', () => {
      const key = '1nvalid';
      return idService.removeKey(key)

        .then(() => {
          return chai.request(app).get('/api/generateId')
            .query({key: key})
        })

        .catch(res => {
          res.should.have.status(400);
        });
    });
  });

  describe('retrieve id ranges', () => {

    it('fail an invalid key', () => {
      const key = '1nvalid';
      return idService.removeKey(key)

        .then(() => {
          return chai.request(app).get('/api/allocatedRanges')
            .query({key: key})
        })

        .catch(res => {
          res.should.have.status(400);
        });
    });
  });
});
//# sourceMappingURL=id-service-spec.js.map
