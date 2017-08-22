import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as knex from 'knex';
import {dbStarter} from './common/db/dbStarter-service';
import {authService} from './auth/auth-service'
import Bluebird = require('bluebird');
import * as lodash from 'lodash';

const _ = lodash;
const routes    = require('./common/routes');
const port      = 4010;

class App {

  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    dbStarter.initDatabase();
    routes(this.express);
    authService.initPassport(this.express);
    this.express.listen(port, () => {
      console.log('kdr listening on port ' + port);
    });

  }

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: false}));
  }

}

export const app = new App();

