import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {dbStarter} from './common/db/dbStarter-service';
import * as lodash from 'lodash';
import {idRoutes} from "./globalId/id-routes";

const flash  = require('req-flash');
const _      = lodash;
const routes = require('./globalId/id-routes');
const port   = 4010;

class App {

  public express: express.Application;

  constructor() {
    this.express = express();
    dbStarter.initDatabase();

    idRoutes(this.express);
    this.middleware();
    this.express.listen(port, () => {
      console.log('kdr listening on port ' + port);
    });

  }

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: false}))
  }

}

export const app = new App();

