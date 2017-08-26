import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as knex from 'knex';
import {dbStarter} from './common/db/dbStarter-service';
import {authService} from './auth/auth-service'
import Bluebird = require('bluebird');
import * as lodash from 'lodash';
import * as session from 'express-session';
import * as passport from 'passport';
import {passportConfig} from './auth/passport-config';

const flash  = require('req-flash');
const _      = lodash;
const routes = require('./common/routes');
const port   = 4010;

class App {

  public express: express.Application;

  constructor() {
    this.express = express();
    dbStarter.initDatabase();

    routes(this.express);
    this.middleware();
    this.express.listen(port, () => {
      console.log('kdr listening on port ' + port);
    });

  }

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: false}));
    this.express.use(session({ secret: 'qwerqwerqwer3323' }));
    authService.initPassport(this.express);
    passportConfig(passport);
    this.express.use(passport.session());
    this.express.use(flash());
  }

}

export const app = new App();

